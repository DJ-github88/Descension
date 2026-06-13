import { getCustomIconUrl } from '../../../../utils/assetManager';

// Local icons for trigger categories and specific triggers
export const TRIGGER_ICONS = {
  // Category icons - using local ability icons
  categories: {
    combat: 'General/Sword',
    movement: 'Utility/Speed Dash',
    health: 'Healing/Golden Heart',
    status: 'Utility/Utility Effect',
    environment: 'Nature/Nature Natural',
    time: 'Utility/Rest',
    trap: 'Utility/Trapped'
  },

  // Specific trigger icons - using local ability icons
  triggers: {
    // Combat triggers
    damage_taken: 'General/Break Bone',
    damage_dealt: 'General/Sword',
    critical_hit: 'Utility/Strike',
    critical_hit_taken: 'General/Break',
    miss: 'Utility/Ducking Figure',
    healing_received: 'Healing/Golden Heart',
    healing_done: 'Healing/Heart Ripple',
    special_result: 'Utility/Star Emblem',
    ineffective: 'Utility/Shattered Surface',
    dodge: 'Utility/Parry',
    parry: 'Utility/Split Shield',
    block: 'Utility/Shield',
    spell_reflect: 'Utility/Deflecting Shield',
    spell_interrupt: 'Utility/Stun',
    spell_resist: 'Utility/Resistance',
    combat_start: 'Utility/Empowered Warrior',
    combat_end: 'Utility/Rest',
    first_strike: 'General/Prepare Attack',
    last_stand: 'Utility/Steadfast Bulwark',

    // Movement triggers
    movement_start: 'Utility/Speed Dash',
    movement_end: 'Utility/Slow Speed',
    movement_started: 'Utility/Speed Dash',
    movement_stopped: 'Utility/Slow Speed',
    jumped: 'Utility/Upward Jump',
    distance_moved: 'Utility/Running Figure',
    enter_area: 'Utility/Point',
    leave_area: 'Utility/Blue Door',
    proximity: 'Utility/All Seeing Eye',
    forced_movement: 'Utility/Motion Swoosh',
    high_ground: 'Utility/Mountain Summit',
    falling: 'General/Trip',

    // Health and Resource triggers
    health_threshold: 'Healing/Golden Heart',
    health_change: 'Healing/Heart Ecg Line',
    resource_threshold: 'Utility/Utility Power',
    resource_spent: 'Utility/Downgrade',
    resource_gained: 'Utility/Glowing Orb',
    ally_health: 'Healing/Heart Shield',
    full_health: 'Healing/Red Heart',
    overhealing: 'Healing/Swirling Hearts',

    // Death and Revival triggers
    on_death: 'Necrotic/Necrotic Skull',
    on_revival: 'Radiant/Divine Blessing',
    near_death: 'Necrotic/Decayed Skull',
    death_save_success: 'Radiant/Radiant Blessing 1',
    death_save_failure: 'Necrotic/Cranium Skull Smash',

    // Status triggers
    buff_applied: 'Radiant/Radiant Aura',
    buff_removed: 'Utility/Broken',
    debuff_applied: 'Necrotic/Necrotic Decay 4',
    debuff_removed: 'Healing/Cure Within',
    cc_applied: 'Utility/Paralyzed',
    cc_broken: 'Necrotic/Broken Skull Shackle',
    effect_applied: 'Utility/Utility Effect',
    effect_removed: 'Utility/Senses Closed Eye',
    effect_duration: 'Utility/Rest',
    effect_stack: 'Utility/Utility Power 2',
    dispel: 'Utility/Counter Spiral',
    cleanse: 'Healing/Renewal',
    immunity: 'Utility/Bound Shield',

    // Trap triggers
    proximity: 'Utility/All Seeing Eye',
    stepped_on: 'Utility/Trapped',
    interaction: 'Utility/Utility Tool',
    line_of_sight: 'Utility/Watchful Eye',
    detection_attempt: 'Utility/Peep',
    disarm_attempt: 'Utility/Jigsaw Saw Tool',
    timer: 'Arcane/Sands of Time',
    weight_pressure: 'Utility/Falling Block',
    magical_trigger: 'Arcane/Orb Manipulation',
    trap_chain: 'Utility/Metal Chain',
    trap_damage: 'Utility/Explosive Detonation',

    // Environment triggers
    weather_change: 'Nature/Nature Natural 10',
    terrain_type: 'Nature/Nature Natural',
    day_night: 'Utility/Crescent Moon',
    object_interaction: 'Utility/Grab',
    environmental_damage: 'Utility/Falling Block',
    underwater: 'Utility/Boat Horizon',
    in_darkness: 'Dark Shadow',
    in_bright_light: 'Radiant/Radiant Sun',

    // Time triggers
    turn_start: 'Utility/Rest',
    turn_end: 'Utility/Sleep',
    round_start: 'Arcane/Rewind Time',
    round_end: 'Arcane/Sands of Time',
    timer: 'Utility/Rest',
    cooldown_ready: 'Utility/Glowing Orb Star',
    duration_threshold: 'Utility/Rest'
  }
};

// Get a local icon URL for a trigger
export const getTriggerIconUrl = (triggerId, isCategory = false) => {
  let iconPath;

  if (isCategory) {
    iconPath = TRIGGER_ICONS.categories[triggerId] || 'Utility/Utility Effect';
  } else {
    iconPath = TRIGGER_ICONS.triggers[triggerId] || 'Utility/Utility Effect';
  }

  return getCustomIconUrl(iconPath, 'abilities');
};
