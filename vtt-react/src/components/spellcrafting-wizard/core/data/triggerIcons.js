import { getCustomIconUrl } from '../../../../utils/assetManager';

// Local icons for trigger categories and specific triggers
export const TRIGGER_ICONS = {
  // Category icons - using local ability icons
  categories: {
    combat: 'Combat/Striking Hammer',
    movement: 'Utility/Speed Dash',
    health: 'Healing/Healing',
    status: 'Utility/Utility',
    environment: 'Nature/Nature Natural',
    time: 'Utility/Hourglass',
    trap: 'Utility/Trapped'
  },

  // Specific trigger icons - using local ability icons
  triggers: {
    // Combat triggers
    damage_taken: 'Bludgeoning/Striking Hammer',
    damage_dealt: 'Slashing/Bloody Slash',
    healing_received: 'Healing/Healing',
    healing_done: 'Healing/Healing',
    special_result: 'Utility/Star Emblem',
    ineffective: 'Utility/Parry',
    dodge: 'Utility/Parry',
    parry: 'Utility/Parry',
    block: 'Utility/Shield',
    combat_start: 'Combat/Striking Hammer',
    combat_end: 'Utility/Speed Dash',

    // Movement triggers
    movement_start: 'Utility/Speed Dash',
    movement_end: 'Utility/Speed Dash',
    movement_started: 'Utility/Speed Dash',
    movement_stopped: 'Utility/Stun',
    jumped: 'Utility/Upward Jump',
    distance_moved: 'Utility/Speed Dash',
    enter_area: 'Utility/Point',
    leave_area: 'Utility/Point',
    proximity: 'Utility/All Seeing Eye',

    // Health and Resource triggers
    health_threshold: 'Healing/Healing',
    health_change: 'Healing/Healing',
    resource_threshold: 'Utility/Utility',
    resource_spent: 'Utility/Utility',
    resource_gained: 'Utility/Utility',
    ally_health: 'Healing/Healing',

    // Death and Revival triggers
    on_death: 'Necrotic/Necrotic Skull',
    on_revival: 'Radiant/Divine Blessing',
    near_death: 'Necrotic/Necrotic Skull',
    death_save_success: 'Radiant/Divine Blessing',
    death_save_failure: 'Necrotic/Necrotic Skull',

    // Status triggers
    buff_applied: 'Radiant/Radiant Aura',
    buff_removed: 'Utility/Utility',
    debuff_applied: 'Necrotic/Necrotic Skull',
    debuff_removed: 'Utility/Utility',
    cc_applied: 'Utility/Stun',
    cc_broken: 'Utility/Utility',
    effect_applied: 'Utility/Utility',
    effect_removed: 'Utility/Utility',

    // Trap triggers
    proximity: 'Utility/All Seeing Eye',
    stepped_on: 'Utility/Trapped',
    interaction: 'Utility/Utility',
    line_of_sight: 'Utility/All Seeing Eye',
    detection_attempt: 'Utility/All Seeing Eye',
    disarm_attempt: 'Utility/Utility',
    timer: 'Utility/Hourglass',
    weight_pressure: 'Utility/Falling Block',
    magical_trigger: 'Arcane/Orb Manipulation',

    // Environment triggers
    weather_change: 'Nature/Nature Natural',
    terrain_type: 'Nature/Nature Natural',
    day_night: 'Utility/Hourglass',
    object_interaction: 'Utility/Utility',

    // Time triggers
    turn_start: 'Utility/Hourglass',
    turn_end: 'Utility/Hourglass',
    round_start: 'Utility/Hourglass',
    round_end: 'Utility/Hourglass',
    timer: 'Utility/Hourglass'
  }
};

// Get a local icon URL for a trigger
export const getTriggerIconUrl = (triggerId, isCategory = false) => {
  let iconPath;

  if (isCategory) {
    iconPath = TRIGGER_ICONS.categories[triggerId] || 'Utility/Utility';
  } else {
    iconPath = TRIGGER_ICONS.triggers[triggerId] || 'Utility/Utility';
  }

  return getCustomIconUrl(iconPath, 'abilities');
};
