  export const RESOURCE_TYPES = [
    { id: 'health', name: 'Health', icon: 'Healing/Golden Heart' },
    { id: 'mana', name: 'Mana', icon: 'Arcane/Orb Manipulation' },
    { id: 'energy', name: 'Energy', icon: 'Utility/Glowing Orb' },
    { id: 'rage', name: 'Rage', icon: 'General/Sword' },
    { id: 'inferno', name: 'Inferno', icon: 'Fire/Fiery Skull' }
  ];

  // Trigger categories
  export const triggerCategories = [
    { id: 'combat', name: 'Combat', iconPath: 'General/Sword' },
    { id: 'movement', name: 'Movement', iconPath: 'Utility/Speed Dash' },
    { id: 'health', name: 'Health, Resources & Death', iconPath: 'Healing/Golden Heart' },
    { id: 'status', name: 'Status Effects', iconPath: 'Utility/Utility' },
    { id: 'environment', name: 'Environment', iconPath: 'Nature/Nature Natural' },
    { id: 'time', name: 'Time & Turns', iconPath: 'Utility/Rest' },
    { id: 'trap', name: 'Trap Triggers', iconPath: 'Utility/Trapped' }
  ];

  // Sample trigger types for each category (in a real app, these would come from TriggerUtils)
  export const getTriggersByCategory = (categoryId) => {
    const triggers = {
      combat: [
        // Damage-related triggers
        { id: 'damage_taken', name: 'Damage Taken', description: 'Activates when damage is taken', params: ['amount', 'damage_type', 'perspective'] },
        { id: 'damage_dealt', name: 'Damage Dealt', description: 'Activates when damage is dealt', params: ['amount', 'damage_type', 'perspective'] },
        { id: 'critical_hit', name: 'Critical Hit', description: 'Activates on a critical hit', params: ['perspective'] },
        { id: 'critical_hit_taken', name: 'Critical Hit Taken', description: 'Activates when receiving a critical hit', params: ['perspective'] },

        // Attack outcome triggers
        { id: 'miss', name: 'Attack Miss', description: 'Activates when an attack misses', params: ['perspective'] },
        { id: 'dodge', name: 'Dodge', description: 'Activates when an attack is dodged', params: ['perspective'] },
        { id: 'parry', name: 'Parry', description: 'Activates when an attack is parried', params: ['perspective'] },
        { id: 'block', name: 'Block', description: 'Activates when an attack is blocked with a shield', params: ['perspective'] },

        // Spell-specific triggers
        { id: 'spell_reflect', name: 'Spell Reflection', description: 'Activates when a spell is reflected', params: ['perspective'] },
        { id: 'spell_interrupt', name: 'Spell Interrupt', description: 'Activates when a spell cast is interrupted', params: ['perspective'] },
        { id: 'spell_resist', name: 'Spell Resist', description: 'Activates when a spell is resisted', params: ['perspective'] },

        // Combat state triggers
        { id: 'combat_start', name: 'Combat Start', description: 'Activates when combat begins', params: [] },
        { id: 'combat_end', name: 'Combat End', description: 'Activates when combat ends', params: [] },
        { id: 'first_strike', name: 'First Strike', description: 'Activates on the first attack in combat', params: ['perspective'] },
        { id: 'last_stand', name: 'Last Stand', description: 'Activates when you are the last ally standing', params: [] }
      ],
      movement: [
        { id: 'movement_start', name: 'Movement Start', description: 'Activates when movement begins', params: ['perspective'] },
        { id: 'movement_end', name: 'Movement End', description: 'Activates when movement stops', params: ['perspective'] },
        { id: 'distance_moved', name: 'Distance Moved', description: 'Activates after moving a certain distance', params: ['distance', 'perspective'] },
        { id: 'enter_area', name: 'Enter Area', description: 'Activates when entering a defined area', params: ['area_type', 'perspective'] },
        { id: 'leave_area', name: 'Leave Area', description: 'Activates when leaving a defined area', params: ['area_type', 'perspective'] },
        { id: 'proximity', name: 'Proximity', description: 'Activates when entities are within a certain range', params: ['distance', 'entity_type'] },
        { id: 'forced_movement', name: 'Forced Movement', description: 'Activates when pushed, pulled, or otherwise forcibly moved', params: ['perspective'] },
        { id: 'high_ground', name: 'High Ground', description: 'Activates when on elevated terrain', params: ['perspective'] },
        { id: 'falling', name: 'Falling', description: 'Activates when falling from a height', params: ['perspective'] }
      ],
      health: [
        { id: 'health_threshold', name: 'Health Threshold', description: 'Activates when health reaches a specified level', params: ['percentage', 'comparison', 'perspective'] },
        { id: 'health_change', name: 'Health Change', description: 'Activates when health changes by an amount', params: ['amount', 'is_percent', 'perspective'] },
        { id: 'resource_threshold', name: 'Resource Threshold', description: 'Activates when a resource reaches a specified level', params: ['resource_type', 'threshold_value', 'threshold_type', 'comparison', 'perspective'] },
        { id: 'ally_health', name: 'Ally Health', description: 'Activates based on ally health conditions', params: ['percentage', 'comparison'] },
        { id: 'on_death', name: 'On Death', description: 'Triggers when a character dies', params: ['target_type'] },
        { id: 'on_revival', name: 'On Revival', description: 'Triggers when a character is revived', params: ['target_type'] },
        { id: 'near_death', name: 'Near Death', description: 'Triggers when a character is near death', params: ['health_threshold', 'target_type'] },
        { id: 'death_save_success', name: 'Death Save Success', description: 'Triggers when a character succeeds on a death saving throw', params: ['target_type'] },
        { id: 'death_save_failure', name: 'Death Save Failure', description: 'Triggers when a character fails a death saving throw', params: ['target_type'] },
        { id: 'full_health', name: 'Full Health', description: 'Triggers when at full health', params: ['perspective'] },
        { id: 'overhealing', name: 'Overhealing', description: 'Triggers when healing would exceed maximum health', params: ['perspective'] }
      ],
      status: [
        { id: 'effect_applied', name: 'Effect Applied', description: 'Activates when a status effect is applied', params: ['effect_type', 'perspective'] },
        { id: 'effect_removed', name: 'Effect Removed', description: 'Activates when a status effect is removed', params: ['effect_type', 'perspective'] },
        { id: 'effect_duration', name: 'Effect Duration', description: 'Activates when an effect has a certain duration remaining', params: ['effect_type', 'duration', 'perspective'] },
        { id: 'effect_stack', name: 'Effect Stack', description: 'Activates when an effect reaches a certain number of stacks', params: ['effect_type', 'stack_count', 'perspective'] },
        { id: 'dispel', name: 'Dispel', description: 'Activates when an effect is dispelled', params: ['effect_type', 'perspective'] },
        { id: 'cleanse', name: 'Cleanse', description: 'Activates when a negative effect is cleansed', params: ['effect_type', 'perspective'] },
        { id: 'immunity', name: 'Immunity', description: 'Activates when immune to an effect', params: ['effect_type', 'perspective'] }
      ],
      trap: [
        { id: 'proximity', name: 'Proximity', description: 'Activates when a creature comes within range of the trap (uses trap size)', params: ['creature_type'] },
        { id: 'stepped_on', name: 'Stepped On', description: 'Activates when a creature steps directly on the trap (within trap size)', params: ['creature_type'] },
        { id: 'interaction', name: 'Interaction', description: 'Activates when a creature interacts with the trap or an object near it', params: ['interaction_type'] },
        { id: 'line_of_sight', name: 'Line of Sight', description: 'Activates when a creature enters the line of sight of the trap', params: ['creature_type'] },
        { id: 'detection_attempt', name: 'Detection Attempt', description: 'Activates when a creature attempts to detect the trap', params: [] },
        { id: 'disarm_attempt', name: 'Disarm Attempt', description: 'Activates when a creature attempts to disarm the trap', params: [] },
        { id: 'timer', name: 'Timer', description: 'Activates after a set amount of time', params: ['time'] },
        { id: 'weight_pressure', name: 'Weight/Pressure', description: 'Activates when sufficient weight or pressure is applied to the trap', params: ['weight_threshold'] },
        { id: 'magical_trigger', name: 'Magical Trigger', description: 'Activates when a specific magical condition is met', params: ['magic_type'] },
        { id: 'trap_chain', name: 'Trap Chain', description: 'Activates when another trap is triggered', params: [] },
        { id: 'trap_damage', name: 'Trap Damage', description: 'Activates when the trap deals damage', params: ['damage_threshold'] }
      ],
      environment: [
        { id: 'weather_change', name: 'Weather Change', description: 'Activates when weather changes', params: ['weather_type'] },
        { id: 'terrain_type', name: 'Terrain Type', description: 'Activates when on a specific terrain', params: ['terrain_type'] },
        { id: 'day_night', name: 'Day/Night Cycle', description: 'Activates at day or night', params: ['is_day'] },
        { id: 'object_interaction', name: 'Object Interaction', description: 'Activates when interacting with objects', params: ['object_type'] },
        { id: 'environmental_damage', name: 'Environmental Damage', description: 'Activates when taking damage from the environment', params: ['damage_type'] },
        { id: 'underwater', name: 'Underwater', description: 'Activates when underwater', params: [] },
        { id: 'in_darkness', name: 'In Darkness', description: 'Activates when in darkness or dim light', params: [] },
        { id: 'in_bright_light', name: 'In Bright Light', description: 'Activates when in bright light', params: [] }
      ],
      time: [
        { id: 'turn_start', name: 'Turn Start', description: 'Activates at the start of a turn', params: ['whose_turn'] },
        { id: 'turn_end', name: 'Turn End', description: 'Activates at the end of a turn', params: ['whose_turn'] },
        { id: 'round_start', name: 'Round Start', description: 'Activates at the start of a combat round', params: [] },
        { id: 'round_end', name: 'Round End', description: 'Activates at the end of a combat round', params: [] },
        { id: 'timer', name: 'Timer', description: 'Activates after a set duration', params: ['seconds'] },
        { id: 'cooldown_ready', name: 'Cooldown Ready', description: 'Activates when an ability cooldown is ready', params: ['ability_id'] },
        { id: 'duration_threshold', name: 'Duration Threshold', description: 'Activates when a spell or effect has a certain duration remaining', params: ['duration', 'comparison'] }
      ]
    };

    return triggers[categoryId] || [];
  };
