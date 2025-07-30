// WoW-style icons for trigger categories and specific triggers
export const TRIGGER_ICONS = {
  // Category icons
  categories: {
    combat: 'ability_warrior_challange',
    movement: 'ability_rogue_sprint',
    health: 'spell_holy_sealofsacrifice',
    status: 'spell_holy_blessingofprotection',
    environment: 'spell_nature_earthquake',
    time: 'spell_holy_borrowedtime',
    trap: 'spell_fire_selfdestruct'
  },

  // Specific trigger icons
  triggers: {
    // Combat triggers
    damage_taken: 'ability_warrior_bloodbath',
    damage_dealt: 'ability_warrior_savageblow',
    healing_received: 'spell_holy_flashheal',
    healing_done: 'spell_holy_holybolt',
    special_result: 'ability_criticalstrike',
    ineffective: 'ability_rogue_feint',
    dodge: 'ability_rogue_feint',
    parry: 'ability_parry',
    block: 'ability_defend',
    combat_start: 'ability_warrior_charge',
    combat_end: 'ability_rogue_sprint',

    // Movement triggers
    movement_start: 'ability_rogue_sprint',
    movement_end: 'ability_rogue_trip',
    movement_started: 'ability_rogue_sprint',
    movement_stopped: 'spell_frost_stun',
    jumped: 'ability_heroicleap',
    distance_moved: 'ability_hunter_aspectofthefox',
    enter_area: 'spell_nature_earthbind',
    leave_area: 'spell_arcane_blink',
    proximity: 'spell_nature_earthbind',

    // Health and Resource triggers
    health_threshold: 'spell_holy_sealofsacrifice',
    health_change: 'spell_holy_flashheal',
    resource_threshold: 'spell_shadow_lifedrain',
    resource_spent: 'inv_elemental_mote_mana',
    resource_gained: 'spell_holy_divinespirit',
    ally_health: 'spell_holy_prayerofhealing',

    // Death and Revival triggers
    on_death: 'ability_rogue_feigndeath',
    on_revival: 'spell_holy_resurrection',
    near_death: 'spell_shadow_deathanddecay',
    death_save_success: 'spell_holy_guardianspirit',
    death_save_failure: 'spell_shadow_soulgem',

    // Status triggers
    buff_applied: 'spell_holy_powerwordshield',
    buff_removed: 'spell_holy_removecurse',
    debuff_applied: 'spell_shadow_curseofsargeras',
    debuff_removed: 'spell_holy_removecurse',
    cc_applied: 'spell_frost_chainsofice',
    cc_broken: 'spell_nature_removecurse',
    effect_applied: 'spell_holy_blessingofprotection',
    effect_removed: 'spell_holy_removecurse',

    // Trap triggers
    proximity: 'spell_fire_selfdestruct',
    stepped_on: 'ability_rogue_deadlybrew',
    interaction: 'inv_misc_gear_08',
    line_of_sight: 'ability_hunter_snipershot',
    detection_attempt: 'ability_hunter_eagleeye',
    disarm_attempt: 'ability_rogue_dismantle',
    timer: 'inv_misc_pocketwatch_01',
    weight_pressure: 'ability_warrior_strengthofarms',
    magical_trigger: 'spell_arcane_blast',

    // Environment triggers
    weather_change: 'spell_frost_summonwaterelemental',
    terrain_type: 'spell_nature_earthquake',
    day_night: 'spell_nature_starfall',
    object_interaction: 'inv_misc_gear_08',

    // Time triggers
    turn_start: 'inv_misc_pocketwatch_01',
    turn_end: 'inv_misc_pocketwatch_02',
    round_start: 'spell_holy_borrowedtime',
    round_end: 'spell_holy_borrowedtime',
    timer: 'inv_misc_pocketwatch_01'
  }
};

// Get a WoW icon URL for a trigger
export const getTriggerIconUrl = (triggerId, isCategory = false) => {
  let iconId;

  if (isCategory) {
    iconId = TRIGGER_ICONS.categories[triggerId] || 'inv_misc_questionmark';
  } else {
    iconId = TRIGGER_ICONS.triggers[triggerId] || 'inv_misc_questionmark';
  }

  return `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
};
