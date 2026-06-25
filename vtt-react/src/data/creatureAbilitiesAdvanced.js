/**
 * Advanced Spell-Card Abilities for Combat Creatures
 *
 * Each combat creature gets a signature + 2 core abilities (3 total), authored
 * from docs/CREATURE_ABILITIES.md and creatureData.js combat strings, and
 * formatted to the FULL advanced spell-card spec in docs/SPELL_DATA_REFERENCE.md.
 *
 * These are merged into LIBRARY_CREATURES at load time (see initCreatureStore.js),
 * overriding legacy abilities so UnifiedSpellCard renders them richly.
 *
 * Builder API (from creatureAbilityBuilders.js):
 *   dmg({...})     -> damage effect
 *   heal({...})    -> healing effect
 *   buff({...})    -> buff effect
 *   debuff({...})  -> debuff effect
 *   ctrl({...})    -> control effect
 *   util({...})    -> utility effect
 *   summon({...})  -> summoning effect
 *   transform({...})-> transformation effect
 *   passive({...}) -> innate passive trait
 */

import {
  dmg, heal, buff, debuff, ctrl, util, passive,
} from './creatureAbilityBuilders';

// ═══════════════════════════════════════════════════════════════════════════
// REGION 1: FROSTWOOD REACH
// ═══════════════════════════════════════════════════════════════════════════
const FROSTWOOD = {
  gref: [
    debuff({ id: 'gref_memory_trade', name: 'Memory Trade', icon: 'spell_shadow_mindsteal', school: 'wyrd', desc: 'Gref plucks a trivial memory from the target, trading it for a brief veil of evasion.', ap: 2, mana: 5, cd: 1, range: 30, save: ['spirit', 13], duration: 3, debuffType: 'statusEffect', effects: [{ id: 'memory_loss', name: 'Memory Loss', description: 'Loses a minor memory; Gref gains full evasion for 3 rounds.' }] }),
    ctrl({ id: 'gref_release_faces', name: 'Release Faces', icon: 'spell_shadow_soulleech', school: 'wyrd', desc: 'Upends its barrow, unleashing trapped memories that dazzle and confuse nearby foes.', ap: 2, mana: 10, cd: 3, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 15, save: ['spirit', 13], duration: 1, controlType: 'incapacitation', effects: [{ id: 'dazzled', name: 'Dazzled', description: 'Dazzled and confused for 1 round.' }] }),
    util({ id: 'gref_mist_vanish', name: 'Mist Vanish', icon: 'spell_shadow_stealth', school: 'arcane', desc: 'Dissolves into the twilight mist, becoming untargetable.', ap: 1, mana: 5, cd: 2, range: 0, rangeType: 'self', utilityType: 'movement', duration: 1, effects: [{ id: 'vanish', name: 'Vanish', description: 'Becomes invisible and untargetable for 1 round.' }] }),
  ],
  oillipheist: [
    ctrl({ id: 'oillipheist_silt_grasp', name: 'Silt Grasp', icon: 'spell_nature_nullifypoison', school: 'physical', desc: 'A coiled maw of silt lashes out, dragging the victim into the bog.', ap: 2, mana: 0, cd: 1, range: 10, rangeType: 'melee', save: ['agility', 13], duration: 2, controlType: 'restraint', effects: [{ id: 'grappled', name: 'Grappled', description: 'Pulled into difficult swamp water, restrained.' }] }),
    heal({ id: 'oillipheist_blood_drain', name: 'Blood Drain', icon: 'spell_shadow_lifedrain', school: 'blight', desc: 'Needle-teeth sip the victim\'s blood, mending the serpent\'s silt-hide.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d8 + 3', vampiric: { formula: '1d8 + 3', type: 'blight' }, target: 'enemies' }),
    passive({ id: 'oillipheist_blindsense', name: 'Blind-Sense', icon: 'spell_shadow_senseundead', school: 'physical', desc: 'Eyeless, it reads every vibration and blood-heat ripple in the water.', effects: [{ id: 'tremorsense', name: 'Tremorsense', description: 'Immune to blindness; detects all moving creatures within 30 ft in water.' }], range: 30 }),
  ],
  grimmstalk: [
    ctrl({ id: 'grimmstalk_skull_stare', name: 'Skull Stare', icon: 'spell_shadow_deathfocus', school: 'wyrd', desc: 'The hollow bird-skull fixes its gaze, freezing the victim in primal terror.', ap: 2, mana: 10, cd: 2, range: 30, save: ['spirit', 14], duration: 1, controlType: 'incapacitation', effects: [{ id: 'paralyzed_terror', name: 'Paralyzed with Terror', description: 'Paralyzed for 1 round.' }] }),
    dmg({ id: 'grimmstalk_feather_slash', name: 'Feather Slash', icon: 'ability_rogue_findweakness', school: 'physical', desc: 'Razor-edged ironwood plumage rakes across the target.', ap: 1, mana: 0, cd: 0, range: 10, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'] }),
    util({ id: 'grimmstalk_canopy_jump', name: 'Canopy Jump', icon: 'spell_druid_wildcharge', school: 'primal', desc: 'Swings between branches, teleporting across the canopy without provoking attacks.', ap: 1, mana: 0, cd: 1, range: 40, rangeType: 'ranged', target: 'self', targetRestrictions: ['self'], utilityType: 'movement', effects: [{ id: 'teleport', name: 'Canopy Teleport', description: 'Teleports up to 40 ft, avoiding opportunity attacks.' }] }),
  ],
  pooka: [
    util({ id: 'pooka_shift_form', name: 'Shift Form', icon: 'spell_druid_shapeshift', school: 'primal', desc: 'Collapses into a sleek wild pony, doubling its speed.', ap: 1, mana: 0, cd: 2, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'transformation', duration: 3, effects: [{ id: 'pony_form', name: 'Pony Form', description: 'Movement speed doubled for 3 rounds.' }] }),
    debuff({ id: 'pooka_distract', name: 'Distract', icon: 'spell_arcane_disperseinmagic', school: 'wyrd', desc: 'A flurry of impossible shape-shifts bewilders the target.', ap: 1, mana: 5, cd: 1, range: 30, save: ['spirit', 13], duration: 2, debuffType: 'statusEffect', effects: [{ id: 'distracted', name: 'Distracted', description: 'Dazed by sudden shifts; Pooka gains evasion.' }] }),
    dmg({ id: 'pooka_hoof_kick', name: 'Hoof Kick', icon: 'ability_druid_thrash', school: 'physical', desc: 'A swift kick from cloven hooves.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 2', types: ['physical'] }),
  ],
  schratling: [
    debuff({ id: 'schratling_compulsive_scribe', name: 'Compulsive Scribe', icon: 'spell_arcane_runedisruption', school: 'wyrd', desc: 'Rewrites any text within reach, scrambling scripts and scrolls.', ap: 1, mana: 5, cd: 2, range: 10, save: ['spirit', 12], duration: 2, debuffType: 'abilityDisable', effects: [{ id: 'scrambled', name: 'Scrambled Text', description: 'Scrolls and written magic within 10 ft are corrupted for 2 rounds.' }] }),
    dmg({ id: 'schratling_peat_ink_spit', name: 'Peat-Ink Spit', icon: 'spell_shadow_devouringplague', school: 'wyrd', desc: 'Hawks a globule of black peat-ink that unspools a trivial memory.', ap: 1, mana: 0, cd: 0, range: 30, formula: '1d4', types: ['wyrd'] }),
    passive({ id: 'schratling_moss_camouflage', name: 'Moss-Camouflage', icon: 'spell_druid_camouflage', school: 'primal', desc: 'Bark-skin blends seamlessly with the forest floor.', effects: [{ id: 'stealth_forest', name: 'Forest Camouflage', description: '+4 to stealth checks in forest terrain.' }] }),
  ],
  tatzelvine: [
    dmg({ id: 'tatzelvine_serpent_lunge', name: 'Serpent-Lunge', icon: 'spell_nature_abolishmagic', school: 'physical', desc: 'Coils and strikes with venom-dripping fangs.', ap: 1, mana: 0, cd: 0, range: 10, rangeType: 'melee', formula: '2d6 + 3', types: ['physical'] }),
    debuff({ id: 'tatzelvine_memory_venom', name: 'Memory-Venom', icon: 'spell_shadow_vampirictouch', school: 'blight', desc: 'Wounds weep a venom that dissolves short-term memory into confusion.', ap: 1, mana: 5, cd: 2, range: 10, rangeType: 'melee', save: ['constitution', 13], duration: 2, debuffType: 'statusEffect', effects: [{ id: 'confused', name: 'Confused', description: 'Loses memory of the last hour; confused for 2 rounds.' }] }),
    passive({ id: 'tatzelvine_branch_grip', name: 'Branch-Grip', icon: 'spell_druid_bearform', school: 'primal', desc: 'Moves fluidly through the canopy, never provoking attacks.', effects: [{ id: 'canopy_move', name: 'Canopy Movement', description: 'Can move across canopy without provoking opportunity attacks.' }] }),
  ],
  drudehaunt: [
    passive({ id: 'drudehaunt_fog_shroud', name: 'Fog-Shroud', icon: 'spell_shadow_coneofsilence', school: 'arcane', desc: 'Perpetually blurred by drifting fog; ranged attacks falter.', effects: [{ id: 'blurred', name: 'Blurred', description: 'Ranged attacks against the Drudehaunt have disadvantage.' }] }),
    ctrl({ id: 'drudehaunt_nightmare_seal', name: 'Nightmare-Seal', icon: 'spell_shadow_nightmare', school: 'wyrd', desc: 'Seals a sleeper in a waking nightmare, harvesting memories as they wake.', ap: 2, mana: 20, cd: 3, range: 30, save: ['spirit', 14], duration: 2, controlType: 'incapacitation', effects: [{ id: 'nightmare_paralysis', name: 'Nightmare Paralysis', description: 'Paralyzed in a nightmare; 2d8 psychic on waking.' }] }),
    ctrl({ id: 'drudehaunt_washbasin_stare', name: 'Washbasin-Stare', icon: 'spell_shadow_hex', school: 'wyrd', desc: 'An AoE of dread radiates from her washing-basin.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 15, save: ['spirit', 13], duration: 3, controlType: 'fear', effects: [{ id: 'frightened', name: 'Frightened', description: 'Frightened for 3 rounds.' }] }),
  ],
  koboldknock: [
    dmg({ id: 'koboldknock_rivet_hammer', name: 'Rivet-Hammer', icon: 'spell_holy_blessedhammer', school: 'physical', desc: 'A precise hammer-blow that rings like a struck rivet.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d6 + 2', types: ['physical'] }),
    passive({ id: 'koboldknock_coded_tap', name: 'Coded-Tap', icon: 'spell_arcane_runeofpower', school: 'arcane', desc: 'Taps walls in coded patterns, revealing veins and hazards.', effects: [{ id: 'mineral_sense', name: 'Mineral Sense', description: 'Reveals nearby mineral veins and structural hazards to the GM.' }] }),
    util({ id: 'koboldknock_fog_seal', name: 'Fog-Seal', icon: 'spell_frost_frostblast', school: 'rime', desc: 'Hammers a crack shut, sealing fog from a corridor.', ap: 1, mana: 5, cd: 3, range: 10, utilityType: 'environment', duration: 10, durationUnit: 'minutes', effects: [{ id: 'seal', name: 'Sealed Crack', description: 'Blocks fog from entering a 10-ft corridor for 1 hour.' }] }),
  ],
  erlkings_hound: [
    ctrl({ id: 'erlkings_triple_bark', name: 'Triple-Bark', icon: 'spell_beastmaster_howl', school: 'wyrd', desc: 'Three escalating barks: terror, forgetting, then a walk into the deep fog.', ap: 2, mana: 10, cd: 3, range: 30, save: ['spirit', 13], duration: 1, controlType: 'fear', effects: [{ id: 'frozen_terror', name: 'Frozen with Terror', description: 'Frozen 1 round (Bark 1); may forget location (Bark 2).' }] }),
    dmg({ id: 'erlkings_bark_shriek', name: 'Bark-Shriek', icon: 'spell_shadow_deathscream', school: 'storm', desc: 'A cone-shape sonic shriek that rattles the bones.', ap: 1, mana: 5, cd: 1, range: 15, targetingType: 'cone', rangeType: 'self_centered', areaShape: 'cone', areaSize: 15, formula: '2d6', types: ['storm'], save: ['constitution', 13], saveOutcome: 'no_effect' }),
    passive({ id: 'erlkings_leaf_shift', name: 'Leaf-Shift', icon: 'spell_druid_wildcharge', school: 'primal', desc: 'Its leafy coat regenerates endlessly in the forest.', effects: [{ id: 'forest_regen', name: 'Forest Regeneration', description: 'Heals 5 HP per round while in forest terrain.' }] }),
  ],
  nuckelmist: [
    ctrl({ id: 'nuckelmist_trample', name: 'Trample', icon: 'spell_nature_earthquake', school: 'physical', desc: 'A massive limb flattens the target into the muck.', ap: 2, mana: 0, cd: 1, range: 10, rangeType: 'melee', formula: '2d10 + 5', types: ['physical'], save: ['agility', 15], saveOutcome: 'half_damage', controlType: 'knockdown', duration: 1, effects: [{ id: 'knocked_prone', name: 'Knocked Prone', description: 'Knocked prone by the trample.' }] }),
    dmg({ id: 'nuckelmist_ink_weep', name: 'Ink-Weep', icon: 'spell_shadow_creepingdoom', school: 'wyrd', desc: 'Weeps a bolt of memory-ink that erases a major recollection.', ap: 2, mana: 20, cd: 2, range: 30, formula: '3d6', types: ['wyrd'], save: ['spirit', 15] }),
    passive({ id: 'nuckelmist_path_erasure', name: 'Path-Erasure Aura', icon: 'spell_shadow_voidshift', school: 'blight', desc: 'A 50-ft aura rots all organic matter; the very path behind it vanishes.', effects: [{ id: 'blight_aura', name: 'Blight Aura', description: '50-ft radius: organic material rots, journals dissolve.' }], range: 50, areaShape: 'circle', areaSize: 50 }),
  ],
  mossmaiden: [
    dmg({ id: 'mossmaiden_goat_kick', name: 'Goat-Kick', icon: 'ability_druid_thrash', school: 'physical', desc: 'A bone-cracking kick that launches the victim backward.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['physical'], save: ['agility', 13], saveOutcome: 'no_effect', controlType: 'forcedMovement', duration: 0, effects: [{ id: 'knocked_back', name: 'Knocked Back', description: 'Knocked back 10 ft.', config: { distance: 10, movementType: 'push' } }] }),
    buff({ id: 'mossmaiden_blood_milk', name: 'Blood-Milk Bargain', icon: 'spell_nature_healingtouch', school: 'primal', desc: 'Offers a wooden cup; the drinker is bound to her grove but grows hardy.', ap: 2, mana: 15, cd: 5, range: 5, target: 'any', targetRestrictions: ['any'], save: ['spirit', 14], duration: 3, buffType: 'statEnhancement', effects: [{ id: 'con_boost', name: 'Constitution Boost', description: '+4 Constitution, but bound to the grove.' }], statModifier: { stat: 'constitution', magnitude: 4, magnitudeType: 'flat' } }),
    passive({ id: 'mossmaiden_seasonal_camouflage', name: 'Seasonal-Camouflage', icon: 'spell_druid_camouflage', school: 'primal', desc: 'Moss-skin shifts hue with the temperature.', effects: [{ id: 'stealth_forest', name: 'Forest Camouflage', description: '+6 to stealth in forest terrain.' }] }),
  ],
  fachanwatch: [
    dmg({ id: 'fachanwatch_ironwood_club', name: 'Ironwood-Club', icon: 'spell_shaman_stormstrike', school: 'physical', desc: 'A two-handed ironwood swing that can stun.', ap: 2, mana: 0, cd: 1, range: 10, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'], save: ['constitution', 14], saveOutcome: 'no_effect', controlType: 'incapacitation', duration: 1, effects: [{ id: 'stunned', name: 'Stunned', description: 'Stunned for 1 round.' }] }),
    passive({ id: 'fachanwatch_fog_anchor', name: 'Fog-Anchor', icon: 'spell_arcane_runeofpower', school: 'arcane', desc: 'Stabilizes spatial memory in a 100-ft radius; fog cannot erase paths.', effects: [{ id: 'path_stable', name: 'Path Stabilization', description: 'Paths within 100 ft cannot be erased by memory-fog.' }], range: 100, areaShape: 'circle', areaSize: 100 }),
    passive({ id: 'fachanwatch_balanced_stance', name: 'Balanced-Stance', icon: 'spell_holy_devotionaura', school: 'physical', desc: 'Rooted like the mountain; immovable.', effects: [{ id: 'immovable', name: 'Immovable', description: 'Immune to knockback, prone, and shove effects.' }] }),
  ],
  knockbrew: [
    dmg({ id: 'knockbrew_cork_tooth_bite', name: 'Cork-Tooth Bite', icon: 'ability_druid_thrash', school: 'physical', desc: 'A nip from blunt cork-teeth.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d4', types: ['physical'] }),
    debuff({ id: 'knockbrew_forget_mead', name: 'Forget-Mead', icon: 'spell_shadow_alterhumanform', school: 'blight', desc: 'Offers a cup that dissolves the last hour from memory.', ap: 1, mana: 5, cd: 3, range: 5, target: 'any', targetRestrictions: ['any'], save: ['spirit', 12], duration: 2, debuffType: 'statusEffect', effects: [{ id: 'memory_wipe', name: 'Memory Wipe', description: 'Loses memory of the last hour (or a full day per cup).' }] }),
    passive({ id: 'knockbrew_cask_tending', name: 'Cask-Tending', icon: 'spell_nature_regeneration', school: 'primal', desc: 'Any alcohol it tends never spoils or freezes.', effects: [{ id: 'preserve', name: 'Preservation', description: 'Tended alcohol never spoils or freezes.' }] }),
  ],
  moorboggle: [
    dmg({ id: 'moorboggle_sinkhole', name: 'Sinkhole', icon: 'spell_nature_earthquake', school: 'physical', desc: 'Opens a temporary bog-sinkhole that swallows the victim.', ap: 2, mana: 10, cd: 2, range: 15, targetingType: 'area', areaShape: 'circle', areaSize: 10, formula: '2d8', types: ['physical'], save: ['agility', 14], saveOutcome: 'no_effect', controlType: 'restraint', duration: 2, effects: [{ id: 'swallowed', name: 'Swallowed', description: 'Swallowed into a subterranean bog-pocket; escape needs DC 15 STR.' }] }),
    debuff({ id: 'moorboggle_memory_drain', name: 'Memory-Drain', icon: 'spell_shadow_unsummon', school: 'wyrd', desc: 'A 10-ft aura slowly peels away minor memories.', ap: 1, mana: 5, cd: 1, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 10, save: ['spirit', 13], duration: 2, debuffType: 'damageOverTime', effects: [{ id: 'memory_drain', name: 'Memory Drain', description: 'Loses one minor memory each round.' }] }),
    passive({ id: 'moorboggle_amorphous', name: 'Amorphous', icon: 'spell_nature_shapeshifting', school: 'physical', desc: 'A boneless mass that ignores grapples and criticals.', effects: [{ id: 'amorphous', name: 'Amorphous', description: 'Immune to grapple, prone, and critical hits; squeezes through any gap.' }] }),
  ],
  banshrond: [
    dmg({ id: 'banshrond_memory_keen', name: 'Memory-Keen', icon: 'spell_shadow_deathscream', school: 'wyrd', desc: 'A wail that shreds memory; one ally loses a significant recollection.', ap: 2, mana: 20, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 60, formula: '3d6', types: ['wyrd'], save: ['spirit', 14] }),
    debuff({ id: 'banshrond_tear_glass', name: 'Tear-Glass', icon: 'spell_shadow_shadowmeld', school: 'wyrd', desc: 'Hurls a shard of crystallized grief that slows the target.', ap: 1, mana: 5, cd: 1, range: 30, formula: '2d6', types: ['wyrd'], save: ['agility', 14], saveOutcome: 'half_damage', duration: 2, debuffType: 'movementImpairment', effects: [{ id: 'slowed', name: 'Slowed', description: 'Slowed for 2 rounds.' }] }),
    passive({ id: 'banshrond_shroud_weave', name: 'Shroud-Weave', icon: 'spell_shadow_fade', school: 'arcane', desc: 'Swirling ghost-pages deflect ranged attacks.', effects: [{ id: 'concealment', name: 'Page-Shroud', description: 'Ranged attacks have a 50% miss chance.' }] }),
  ],
  sluagh: [
    dmg({ id: 'gallow_memory_peck', name: 'Memory Peck', icon: 'ability_hunter_aspectofthehawk', school: 'wyrd', desc: 'A flurry of beaks pecks away the victim\'s name.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6', types: ['wyrd'], save: ['spirit', 13], saveOutcome: 'no_effect', duration: 2, debuffType: 'statusEffect', effects: [{ id: 'name_lost', name: 'Name Lost', description: 'Forgets their own name for 2 rounds.' }] }),
    passive({ id: 'sluagh_body', name: 'Swarm-Body', icon: 'spell_nature_insect_swarm', school: 'physical', desc: 'A living cloud of corvids; single-target attacks pass through.', effects: [{ id: 'swarm', name: 'Swarm', description: 'Immune to grapple, prone, and single-target physical attacks.' }] }),
    ctrl({ id: 'gallow_whirl', name: 'Whirlwind', icon: 'spell_shaman_thunderstorm', school: 'physical', desc: 'The flock becomes a cyclone of feathers and claws.', ap: 2, mana: 10, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 10, formula: '2d6 + 2', types: ['physical'], save: ['agility', 13] }),
  ],
  wildejagd: [
    dmg({ id: 'sluagh_archive_storm', name: 'Archive-Storm', icon: 'spell_arcane_arcanetorrent', school: 'wyrd', desc: 'A vortex of parchment and forgotten lineage tears at the mind.', ap: 2, mana: 20, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 40, formula: '3d6', types: ['wyrd'], save: ['spirit', 15] }),
    ctrl({ id: 'sluagh_page_rain', name: 'Page-Rain', icon: 'spell_shadow_rainoffire', school: 'physical', desc: 'Sheets of razor-paper rain down, pinning the target.', ap: 1, mana: 10, cd: 1, range: 30, formula: '2d6', types: ['physical'], save: ['agility', 14], saveOutcome: 'half_damage', duration: 1, controlType: 'restraint', effects: [{ id: 'restrained_paper', name: 'Restrained', description: 'Restrained by paper for 1 round.' }] }),
    passive({ id: 'sluagh_name_whisper', name: 'Name-Whisper', icon: 'spell_shadow_mindsteal', school: 'wyrd', desc: 'Whispers forgotten ancestor-names, luring listeners closer.', effects: [{ id: 'charm_aura', name: 'Whisper-Lure', description: 'DC 14 SPI or charmed, walking toward the Sluagh.' }], range: 30, areaShape: 'circle', areaSize: 30 }),
  ],
  fuath: [
    ctrl({ id: 'fuath_pool_song', name: 'Pool-Song', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'A haunting call that drags victims toward the black pool.', ap: 2, mana: 10, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 30, save: ['spirit', 13], duration: 2, controlType: 'charm', effects: [{ id: 'compelled', name: 'Compelled', description: 'Compelled to walk toward the pool.' }] }),
    ctrl({ id: 'fuath_kelp_grasp', name: 'Kelp-Grasp', icon: 'spell_nature_entanglement', school: 'physical', desc: 'Kelp-hair snares the victim and drags them under.', ap: 1, mana: 5, cd: 1, range: 10, rangeType: 'melee', save: ['agility', 13], duration: 2, controlType: 'restraint', effects: [{ id: 'grappled', name: 'Grappled', description: 'Grappled and pulled underwater.' }] }),
    util({ id: 'fuath_dissolve', name: 'Dissolve', icon: 'spell_frost_frostblast', school: 'rime', desc: 'Merges with the pool-water, becoming undetectable.', ap: 1, mana: 5, cd: 2, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'movement', duration: 1, effects: [{ id: 'concealment', name: 'Full Concealment', description: 'Indistinguishable from pool-water for 1 round.' }] }),
  ],
  grogoch: [
    dmg({ id: 'grogoch_spade_strike', name: 'Spade-Strike', icon: 'ability_rogue_ambush', school: 'physical', desc: 'A clawed spade-hand slashes out of the dark.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d6 + 2', types: ['physical'] }),
    passive({ id: 'grogoch_tunnel_network', name: 'Tunnel-Network', icon: 'spell_nature_earthquake', school: 'primal', desc: 'Knows every tunnel within a mile.', effects: [{ id: 'tunnel_sense', name: 'Tunnel Sense', description: 'Knows and navigates all underground tunnels within 1 mile.' }] }),
    util({ id: 'grogoch_secret_toll', name: 'Secret-Toll', icon: 'spell_shadow_mindsteal', school: 'wyrd', desc: 'Demands one personal secret for passage.', ap: 1, mana: 0, cd: 5, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'special', effects: [{ id: 'secret_bargain', name: 'Secret Bargain', description: 'Demands a secret for passage; refuses to ever repeat it.' }] }),
  ],
  cailleach: [
    ctrl({ id: 'cailleach_fog_spinning', name: 'Fog-Spinning', icon: 'spell_shadow_fade', school: 'wyrd', desc: 'Spawns memory-fog in a wide radius, dissolving minor memories.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 60, save: ['spirit', 14], duration: 3, controlType: 'zone', effects: [{ id: 'fog_zone', name: 'Memory-Fog', description: 'DC 14 SPI each round or lose one minor memory.' }] }),
    dmg({ id: 'cailleach_distaff_strike', name: 'Distaff-Strike', icon: 'spell_shaman_stormstrike', school: 'physical', desc: 'A whistling blow from her rune-carved distaff.', ap: 1, mana: 0, cd: 0, range: 15, rangeType: 'melee', formula: '2d8 + 4', types: ['physical'] }),
    debuff({ id: 'cailleach_straw_judgment', name: 'Straw-Judgment', icon: 'spell_shadow_unstableaffliction', school: 'blight', desc: 'Fills a negligent household\'s belly with straw.', ap: 2, mana: 25, cd: 5, range: 30, save: ['constitution', 15], duration: 3, debuffType: 'incapacitated', effects: [{ id: 'straw_belly', name: 'Belly of Straw', description: 'Incapacitated for 24 hours; not lethal but deeply disturbing.' }] }),
  ],
  dullahan: [
    debuff({ id: 'dullahan_fear_mirror', name: 'Fear-Mirror', icon: 'spell_shadow_phantasm', school: 'wyrd', desc: 'Its mask reflects the viewer\'s deepest fear.', ap: 1, mana: 10, cd: 1, range: 30, save: ['spirit', 14], duration: 3, debuffType: 'statusEffect', effects: [{ id: 'frightened', name: 'Frightened', description: 'Frightened for 3 rounds.' }] }),
    ctrl({ id: 'dullahan_spine_whip', name: 'Spine-Whip', icon: 'spell_shadow_soulleech', school: 'physical', desc: 'A barbed spine lashes out, dragging the victim closer.', ap: 2, mana: 10, cd: 1, range: 15, rangeType: 'melee', formula: '2d6 + 4', types: ['physical'], save: ['agility', 14], saveOutcome: 'half_damage', controlType: 'forcedMovement', duration: 0, effects: [{ id: 'pulled', name: 'Pulled', description: 'Pulled 10 ft toward the rider.', config: { distance: 10, movementType: 'pull' } }] }),
    passive({ id: 'dullahan_fog_mount', name: 'Fog-Mount', icon: 'spell_shadow_summonvoidwalker', school: 'arcane', desc: 'Its steed is woven of fog; immune to physical harm.', effects: [{ id: 'fog_mount', name: 'Fog-Mount', description: 'Mount immune to physical damage; takes double radiant.' }] }),
  ],
  cusith: [
    ctrl({ id: 'cu_sith_three_bark_hunt', name: 'Three-Bark-Hunt', icon: 'spell_beastmaster_howl', school: 'wyrd', desc: 'Escalating barks that freeze, erase location, then drive the victim into the fog.', ap: 2, mana: 15, cd: 3, range: 30, save: ['spirit', 15], duration: 1, controlType: 'incapacitation', effects: [{ id: 'frozen', name: 'Frozen', description: 'Frozen 1 round, then forgets location.' }] }),
    dmg({ id: 'cu_sith_moss_touch', name: 'Moss-Touch', icon: 'spell_frost_frostarmor', school: 'rime', desc: 'A chill, moss-draped paw strikes with rime.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['rime'] }),
    passive({ id: 'cu_sith_fear_drain', name: 'Fear-Drain', icon: 'spell_shadow_devouringplague', school: 'wyrd', desc: 'Feeds on the memory of fear; frightened foes lose it forever.', effects: [{ id: 'fear_devour', name: 'Fear-Drain', description: 'Frightened creatures within 30 ft permanently lose the emotional memory of fear.' }], range: 30, areaShape: 'circle', areaSize: 30 }),
  ],
  pixie: [
    ctrl({ id: 'pixie_spore_burst', name: 'Spore-Burst', icon: 'spell_nature_spellfire', school: 'primal', desc: 'A puff of luminous spores that blinds nearby foes.', ap: 1, mana: 5, cd: 1, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 5, save: ['constitution', 12], duration: 1, controlType: 'incapacitated', effects: [{ id: 'blinded', name: 'Blinded', description: 'Blinded for 1 round.' }] }),
    util({ id: 'pixie_spore_trail', name: 'Spore-Trail', icon: 'spell_nature_stranglevines', school: 'primal', desc: 'Leaves a colored trail whose hue hints at safety or danger.', ap: 1, mana: 0, cd: 2, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'environment', duration: 6, choices: [{ id: 'gold', name: 'Gold Trail', description: 'Guides followers to safety.' }, { id: 'blue', name: 'Blue Trail', description: 'Leads followers in circles.' }, { id: 'red', name: 'Red Trail', description: 'Leads followers to danger.' }], choiceLabel: 'Trail Color (DC 12 INT to read)' }),
    passive({ id: 'pixie_glow_pulse', name: 'Glow-Pulse', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Doubles its light, illuminating a wide radius.', effects: [{ id: 'illuminate', name: 'Illumination', description: 'Illuminates 40 ft.' }] }),
  ],
  waldschrat: [
    dmg({ id: 'waldschrat_red_cap_spark', name: 'Red-Cap-Spark', icon: 'spell_fire_firebolt', school: 'ember', desc: 'Flicks a tiny ember from its crimson cap.', ap: 1, mana: 0, cd: 0, range: 30, formula: '1d4', types: ['ember'] }),
    ctrl({ id: 'waldschrat_root_rattle', name: 'Root-Rattle', icon: 'spell_nature_stranglevines', school: 'storm', desc: 'A clattering rattle of roots deafens nearby foes.', ap: 1, mana: 5, cd: 1, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 10, save: ['constitution', 12], duration: 1, controlType: 'incapacitated', effects: [{ id: 'deafened', name: 'Deafened', description: 'Deafened for 1 round.' }] }),
    passive({ id: 'waldschrat_fear_feed', name: 'Fear-Feed', icon: 'spell_shadow_twistedfaith', school: 'wyrd', desc: 'Grows stronger near frightened creatures.', effects: [{ id: 'fear_feed', name: 'Fear-Feed', description: '+2 to all rolls for each frightened creature within 30 ft.' }], range: 30, areaShape: 'circle', areaSize: 30 }),
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// REGION 2: NORDHALLA
// ═══════════════════════════════════════════════════════════════════════════
const NORDHALLA = {
  fossegrim_ice: [
    ctrl({ id: 'fossegrim_ice_fiddle', name: 'Ice-Fiddle', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'A keening fiddle that compels all who hear it to dance.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 40, save: ['spirit', 14], duration: 3, controlType: 'charm', effects: [{ id: 'dance', name: 'Compelled Dance', description: 'Charmed and compelled to dance for 3 rounds.' }] }),
    dmg({ id: 'fossegrim_ram_skull_bash', name: 'Ram-Skull-Bash', icon: 'ability_druid_thrash', school: 'physical', desc: 'A charging headbutt from a horned skull.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['physical'] }),
    passive({ id: 'fossegrim_skate_walk', name: 'Skate-Walk', icon: 'spell_frost_frostbolt', school: 'rime', desc: 'Glides across ice without slipping or breaking through.', effects: [{ id: 'ice_walk', name: 'Ice-Walk', description: 'Moves across ice without penalty or breaking through.' }] }),
  ],
  marepress: [
    ctrl({ id: 'marepress_nightmare_crush', name: 'Nightmare-Crush', icon: 'spell_shadow_nightmare', school: 'wyrd', desc: 'Settles on a sleeper\'s chest, paralyzing them in a feeding dream.', ap: 2, mana: 15, cd: 3, range: 5, save: ['spirit', 14], duration: 2, controlType: 'incapacitation', effects: [{ id: 'nightmare', name: 'Nightmare', description: 'Paralyzed; takes 2d6 psychic/round; Marepress heals the same.' }] }),
    passive({ id: 'marepress_frost_aura', name: 'Frost-Aura', icon: 'spell_frost_frostarmor', school: 'rime', desc: 'A 10-ft aura of killing frost.', effects: [{ id: 'frost_aura', name: 'Frost Aura', description: '10-ft radius: non-cold-resistant creatures take 1d6 frost/round.' }], range: 10, areaShape: 'circle', areaSize: 10 }),
    ctrl({ id: 'marepress_black_ice_hoofprint', name: 'Black-Ice-Hoofprint', icon: 'spell_frost_frozencore', school: 'rime', desc: 'Leaves black-ice prints that topple pursuers.', ap: 1, mana: 5, cd: 1, range: 5, save: ['agility', 13], duration: 1, controlType: 'knockdown', effects: [{ id: 'slip', name: 'Slip', description: 'Slips and falls prone.' }] }),
  ],
  krampuskin: [
    dmg({ id: 'krampus_birch_whip', name: 'Birch-Whip', icon: 'ability_rogue_findweakness', school: 'physical', desc: 'A lashing birch switch that opens bleeding wounds.', ap: 2, mana: 0, cd: 1, range: 15, rangeType: 'melee', formula: '2d6 + 4', types: ['physical'], dot: { formula: '1d6', type: 'physical', duration: 3 }, save: ['constitution', 14], saveOutcome: 'no_effect' }),
    dmg({ id: 'krampus_horn_gore', name: 'Horn-Gore', icon: 'ability_druid_gore', school: 'physical', desc: 'A devastating horn-charge.', ap: 2, mana: 0, cd: 2, range: 10, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'] }),
    passive({ id: 'krampus_chain_rattle', name: 'Chain-Rattle', icon: 'spell_shadow_curse', school: 'wyrd', desc: 'The miles-carrying clatter of chains weighs on the guilty.', effects: [{ id: 'guilt', name: 'Guilt-Weigh', description: 'Creatures who hear the chains and feel guilt take -2 to all saves.' }] }),
  ],
  klabatskerry: [
    util({ id: 'klabat_caulk_seal', name: 'Caulk-Seal', icon: 'spell_frost_frostblast', school: 'rime', desc: 'Seals hull-cracks with frost-sealant stronger than tar.', ap: 1, mana: 5, cd: 3, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'environment', duration: 24, durationUnit: 'hours', effects: [{ id: 'seal', name: 'Hull Seal', description: 'Seals cracks; the structure never sinks from ice-damage.' }] }),
    dmg({ id: 'klabat_mallet_strike', name: 'Mallet-Strike', icon: 'spell_shaman_stormstrike', school: 'physical', desc: 'A sturdy mallet-blow.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d6 + 2', types: ['physical'] }),
    passive({ id: 'klabat_bell_chest', name: 'Bell-Chest', icon: 'spell_holy_senseundead', school: 'arcane', desc: 'A bell in its chest rings softly when danger nears.', effects: [{ id: 'early_warning', name: 'Early Warning', description: 'Rings when danger approaches within 100 ft.' }] }),
  ],
  perchtar: [
    dmg({ id: 'perchten_procession_sweep', name: 'Procession-Sweep', icon: 'spell_frost_frozencore', school: 'rime', desc: 'The entire procession sweeps the area in a blizzard of masks.', ap: 3, mana: 40, cd: 5, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 100, formula: '4d6', types: ['rime'], save: ['spirit', 16], saveOutcome: 'half_damage', duration: 1, controlType: 'fear', effects: [{ id: 'flee', name: 'Flee in Terror', description: 'Flee in terror for 1 minute.' }] }),
    debuff({ id: 'perchten_mask_judgment', name: 'Mask-Judgment', icon: 'spell_shadow_unstableaffliction', school: 'wyrd', desc: 'Judges the negligent; none may sleep while the Schiachpercht marches.', ap: 2, mana: 20, cd: 3, range: 30, save: ['constitution', 15], duration: 3, debuffType: 'statusEffect', effects: [{ id: 'exhaustion', name: 'Exhaustion', description: '1d6 exhaustion damage each hour the masks walk.' }] }),
    passive({ id: 'perchten_wyrd_ward', name: 'Wyrd-Clear', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Where it passes, Wyrd-corruption is driven out for a month.', effects: [{ id: 'wyrd_clear', name: 'Month-Clear', description: 'Clears all Wyrd-corruption in the region for one month.' }] }),
  ],
  helhest: [
    dmg({ id: 'helhest_three_legged_charge', name: 'Three-Legged-Charge', icon: 'spell_nature_earthquake', school: 'physical', desc: 'A trampling gallop on three legs.', ap: 2, mana: 0, cd: 1, range: 10, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'], save: ['agility', 15], saveOutcome: 'no_effect', controlType: 'knockdown', duration: 1, effects: [{ id: 'trampled', name: 'Trampled', description: 'Trampled and knocked prone.' }] }),
    debuff({ id: 'helhest_plague_aura', name: 'Plague-Aura', icon: 'spell_shadow_deathanddecay', school: 'blight', desc: 'A 50-ft aura of creeping plague.', ap: 1, mana: 10, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 50, save: ['constitution', 15], duration: 3, debuffType: 'disease', effects: [{ id: 'plague', name: 'Plague', description: 'The eldest and youngest in any settlement visited sicken within a week.' }] }),
    ctrl({ id: 'helhest_coffin_hoof', name: 'Coffin-Hoof', icon: 'spell_shadow_fright', school: 'wyrd', desc: 'A single hoofbeat like a closing coffin-lid frightens all who hear.', ap: 1, mana: 5, cd: 2, range: 30, save: ['spirit', 14], duration: 3, controlType: 'fear', effects: [{ id: 'frightened', name: 'Frightened', description: 'Frightened for 1 hour.' }] }),
  ],
  myling: [
    ctrl({ id: 'myling_weight_bearing', name: 'Weight-Bearing', icon: 'spell_shadow_graspofmalorne', school: 'physical', desc: 'Latches onto a back, growing heavier each round.', ap: 2, mana: 10, cd: 3, range: 5, save: ['strength', 0], duration: 3, controlType: 'restraint', effects: [{ id: 'crushing', name: 'Crushing Weight', description: 'Starts at 20 lbs, +20 lbs/round; failed STR check crushes the carrier into the snow.' }] }),
    passive({ id: 'myling_hearth_release', name: 'Hearth-Release', icon: 'spell_holy_heal', school: 'divine', desc: 'If carried to a hearth-fire, the ice melts and the spirit is freed.', effects: [{ id: 'peaceful', name: 'Hearth-Release', description: 'Resolved peacefully if carried to a hearth-fire.' }] }),
    passive({ id: 'myling_rune_glow', name: 'Rune-Glow', icon: 'spell_arcane_runeofpower', school: 'arcane', desc: 'Scratched name-runes glow, revealing the Myling\'s identity.', effects: [{ id: 'name_glow', name: 'Name-Glow', description: 'Runes glow to reveal the spirit\'s true name.' }] }),
  ],
  jutul: [
    dmg({ id: 'jutul_roll_attack', name: 'Roll-Attack', icon: 'spell_shaman_stormstrike', school: 'physical', desc: 'An immense boulder-charge that can pin the victim.', ap: 2, mana: 0, cd: 2, range: 10, formula: '2d10 + 4', types: ['physical'], save: ['agility', 15], saveOutcome: 'no_effect', controlType: 'restraint', duration: 1, effects: [{ id: 'pinned', name: 'Pinned', description: 'Pinned beneath the stone.' }] }),
    passive({ id: 'jutul_stone_regen', name: 'Stone-Regeneration', icon: 'spell_nature_regeneration', school: 'primal', desc: 'Reknits its rocky hide each round.', effects: [{ id: 'regen', name: 'Regeneration', description: 'Heals 10 HP per round; only concentrated runic light truly damages it.' }] }),
    util({ id: 'jutul_boulder_sleep', name: 'Boulder-Sleep', icon: 'spell_druid_camouflage', school: 'primal', desc: 'Becomes indistinguishable from a natural boulder.', ap: 1, mana: 0, cd: 5, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'movement', duration: 1, effects: [{ id: 'inert', name: 'Inert', description: '+10 to stealth; appears as a natural boulder.' }] }),
  ],
  lindwyrm: [
    dmg({ id: 'lindwyrm_cat_claw_strike', name: 'Cat-Claw-Strike', icon: 'ability_druid_gore', school: 'physical', desc: 'Raking claws of ice-edged talons.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 4', types: ['physical', 'rime'] }),
    dmg({ id: 'lindwyrm_frost_breath', name: 'Frost-Breath', icon: 'spell_frost_frostbolt', school: 'rime', desc: 'A cone of permafrost breath.', ap: 2, mana: 15, cd: 2, range: 20, targetingType: 'cone', rangeType: 'self_centered', areaShape: 'cone', areaSize: 20, formula: '3d6', types: ['rime'], save: ['constitution', 15], saveOutcome: 'no_effect', controlType: 'incapacitation', duration: 1, effects: [{ id: 'frozen', name: 'Frozen', description: 'Frozen for 1 round.' }] }),
    passive({ id: 'lindwyrm_ice_bore', name: 'Ice-Bore', icon: 'spell_frost_frostblast', school: 'rime', desc: 'Tunnels through permafrost, leaving glassy refreezing tunnels.', effects: [{ id: 'untrackable', name: 'Untrackable', description: 'Tunnels through permafrost; cannot be tracked normally.' }] }),
  ],
  nidhoggr: [
    dmg({ id: 'nidhoggr_lamprey_maw', name: 'Lamprey-Maw', icon: 'ability_druid_gore', school: 'physical', desc: 'A lamprey-mouthed bite that opens a bleeding wound.', ap: 2, mana: 0, cd: 1, range: 10, rangeType: 'melee', formula: '2d8 + 4', types: ['physical'], dot: { formula: '1d8', type: 'physical', duration: 3 }, save: ['constitution', 14], saveOutcome: 'no_effect' }),
    util({ id: 'nidhoggr_foundation_gnaw', name: 'Foundation-Gnaw', icon: 'spell_nature_earthquake', school: 'physical', desc: 'Gnaws at bedrock, undermining whole structures over time.', ap: 2, mana: 10, cd: 5, range: 5, utilityType: 'environment', effects: [{ id: 'undermine', name: 'Undermine', description: 'Infested structures develop cracks within months.' }] }),
    passive({ id: 'nidhoggr_oath_corrupt', name: 'Oath-Corrupt', icon: 'spell_shadow_curse', school: 'blight', desc: 'Devours the runic energy of blood-oaths.', effects: [{ id: 'oath_eat', name: 'Oath-Devour', description: 'Consumes blood-oath runes; warriors lose supernatural rage permanently.' }] }),
  ],
  strandvasker: [
    ctrl({ id: 'strandvasker_shore_call', name: 'Shore-Call', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'Mimics lost crewmates\' voices, luring hearers to the ice-edge.', ap: 2, mana: 10, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 60, save: ['spirit', 13], duration: 2, controlType: 'charm', effects: [{ id: 'compelled', name: 'Compelled', description: 'Compelled toward the ice-edge.' }] }),
    dmg({ id: 'strandvasker_rope_grasp', name: 'Rope-Grasp', icon: 'spell_nature_entanglement', school: 'physical', desc: 'A sodden rope loops and drags the victim toward the water.', ap: 1, mana: 0, cd: 1, range: 10, rangeType: 'melee', formula: '2d6 + 3', types: ['physical'], save: ['agility', 13], saveOutcome: 'no_effect', controlType: 'forcedMovement', duration: 0, effects: [{ id: 'pulled', name: 'Pulled', description: 'Pulled toward the water.', config: { distance: 10, movementType: 'pull' } }] }),
    passive({ id: 'strandvasker_salt_armor', name: 'Salt-Armor', icon: 'spell_frost_frostarmor', school: 'physical', desc: 'A crust of salt-crystals reinforces its torso.', effects: [{ id: 'armor', name: 'Salt-Armor', description: '+3 to AC.' }] }),
  ],
  landvaettir: [
    dmg({ id: 'landvaettir_boulder_hurl', name: 'Boulder-Hurl', icon: 'spell_shaman_stormstrike', school: 'physical', desc: 'Hurls a boulder from the peak.', ap: 2, mana: 0, cd: 1, range: 60, formula: '3d6 + 5', types: ['physical'] }),
    ctrl({ id: 'landvaettir_dragon_prohibition', name: 'Dragon-Prohibition', icon: 'spell_nature_earthquake', school: 'physical', desc: 'Any draconic image triggers a burying snowslide.', ap: 2, mana: 20, cd: 3, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 100, save: ['agility', 16], duration: 1, controlType: 'restraint', effects: [{ id: 'buried', name: 'Buried Alive', description: 'Buried in a snowslide.' }] }),
    passive({ id: 'landvaettir_wyrd_ward', name: 'Wyrd-Ward', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'A 200-ft ward that no Wyrd-creature has ever breached.', effects: [{ id: 'ward', name: 'Wyrd-Ward', description: '200-ft radius: Wyrd-creatures cannot enter.' }], range: 200, areaShape: 'circle', areaSize: 200 }),
  ],
  vettir: [
    ctrl({ id: 'vettir_storm_herd', name: 'Storm-Herd', icon: 'spell_shaman_thunderstorm', school: 'rime', desc: 'Directs snowfall into a whiteout or clears a corridor.', ap: 2, mana: 15, cd: 3, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 100, duration: 3, controlType: 'zone', effects: [{ id: 'whiteout', name: 'Whiteout', description: 'Intensifies a blizzard to whiteout conditions for 3 rounds.' }] }),
    passive({ id: 'vettir_invisible', name: 'Invisible', icon: 'spell_shadow_fade', school: 'arcane', desc: 'Has no physical body; perceived only through swirling snow.', effects: [{ id: 'bodiless', name: 'Bodiless', description: 'Perceived only via effects (snow, whispers, temperature); cannot be attacked physically.' }] }),
    util({ id: 'vettir_whisper_carry', name: 'Whisper-Carry', icon: 'spell_arcane_arcanetorrent', school: 'arcane', desc: 'Carries voices across impossible distances.', ap: 1, mana: 5, cd: 2, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'communication', effects: [{ id: 'carry', name: 'Voice-Carry', description: 'Carries a message up to 1 mile; 50% chance of cryptic commentary added.' }] }),
  ],
  bergthrall: [
    dmg({ id: 'bergthrall_gem_throw', name: 'Gem-Throw', icon: 'spell_shaman_stormstrike', school: 'physical', desc: 'Hurls raw gemstones as ammunition.', ap: 1, mana: 0, cd: 0, range: 30, formula: '1d8 + 2', types: ['physical'] }),
    dmg({ id: 'bergthrall_chisel_hands', name: 'Chisel-Hands', icon: 'ability_rogue_ambush', school: 'physical', desc: 'Chisel-tipped fingers stab.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d6 + 2', types: ['physical'] }),
    passive({ id: 'bergthrall_crystal_cut', name: 'Crystal-Cut', icon: 'spell_arcane_runeofpower', school: 'arcane', desc: 'Cuts glacier-crystals used for light-scroll storage.', effects: [{ id: 'crystals', name: 'Crystal-Cutter', description: 'Produces crystals essential to the Archive\'s light-scroll system.' }] }),
  ],
  fenris: [
    dmg({ id: 'fenris_puppy_bite', name: 'Puppy-Bite', icon: 'ability_druid_gore', school: 'physical', desc: 'A surprisingly powerful bite.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 4', types: ['physical'] }),
    passive({ id: 'fenris_bound_hunter', name: 'Bound-Hunter', icon: 'ability_hunter_aspectofthehawk', school: 'physical', desc: 'Tracks oath-breakers across a hundred miles.', effects: [{ id: 'track_oathbreaker', name: 'Oath-Breaker Track', description: 'Tracks any creature who broke a sworn vow within 100 miles.' }] }),
    passive({ id: 'fenris_gleipnir_collar', name: 'Gleipnir-Collar', icon: 'spell_shadow_unbreakablewill', school: 'arcane', desc: 'A braided collar that contains its true size.', effects: [{ id: 'collar', name: 'Gleipnir-Collar', description: 'Collar prevents growth; if removed, becomes a continent-ending catastrophe.' }] }),
  ],
  disir: [
    dmg({ id: 'disablot_hair_grasp', name: 'Hair-Grasp', icon: 'spell_nature_entanglement', school: 'rime', desc: 'A cold grasp of spectral hair.', ap: 1, mana: 5, cd: 1, range: 10, rangeType: 'melee', formula: '2d6 + 3', types: ['rime'] }),
    buff({ id: 'disablot_ancestral_judge', name: 'Ancestral-Judge', icon: 'spell_holy_devotionaura', school: 'divine', desc: 'Blesses families that honor the dead with warmth and fertility.', ap: 2, mana: 15, cd: 5, range: 5, target: 'ally', targetRestrictions: ['ally'], duration: 3, buffType: 'statEnhancement', effects: [{ id: 'con_boost', name: 'Warmth Blessing', description: '+4 Constitution for the blessed.' }], statModifier: { stat: 'constitution', magnitude: 4, magnitudeType: 'flat' } }),
    debuff({ id: 'disablot_spindle_curse', name: 'Spindle-Curse', icon: 'spell_shadow_curse', school: 'blight', desc: 'Curses negligent households with frozen-blood spindles.', ap: 2, mana: 15, cd: 4, range: 30, save: ['spirit', 15], duration: 3, debuffType: 'curse', effects: [{ id: 'barren', name: 'Barren Curse', description: 'Women in the household become barren until offerings resume.' }] }),
  ],
  valravn: [
    dmg({ id: 'valravn_shadow_wing', name: 'Shadow-Wing', icon: 'spell_shadow_mindsteal', school: 'wyrd', desc: 'A wing strike that blinds the target with black feathers.', ap: 1, mana: 5, cd: 2, range: 30, formula: '1d8 + 4', types: ['physical', 'shadow'], save: ['agility', 14], saveOutcome: 'half_damage', controlType: 'blindness', duration: 1, effects: [{ id: 'blinded', name: 'Blinded', description: 'Blinded for 1 round by swirling feathers.' }] }),
    passive({ id: 'valravn_battlefield_scent', name: 'Battlefield-Scent', icon: 'ability_hunter_snipershot', school: 'primal', desc: 'Gains tracking and extra damage against wounded prey.', effects: [{ id: 'scent', name: 'Battlefield-Scent', description: '+2 to hit and +1d6 physical damage against creatures below half health.' }] }),
    dmg({ id: 'valravn_heart_devour', name: 'Heart-Devour', icon: 'ability_creature_poisonous_06', school: 'blight', desc: 'Bites a bleeding, stunned, or dying target, devouring its heart and regaining health.', ap: 2, mana: 10, cd: 3, range: 5, rangeType: 'melee', formula: '2d10 + 4', types: ['physical'], effects: [{ id: 'devour', name: 'Heart-Devour', description: 'Valravn heals for the amount of damage dealt.' }] }),
  ],
  kraken: [
    ctrl({ id: 'kraken_tentacle_slam', name: 'Tentacle-Slam', icon: 'spell_nature_entanglement', school: 'physical', desc: 'A massive tentacle slams and grapples.', ap: 2, mana: 0, cd: 1, range: 30, rangeType: 'melee', formula: '2d10 + 5', types: ['physical'], save: ['agility', 15], saveOutcome: 'no_effect', controlType: 'restraint', duration: 2, effects: [{ id: 'grappled', name: 'Grappled', description: 'Grappled by the tentacle.' }] }),
    dmg({ id: 'kraken_beak_crush', name: 'Beak-Crush', icon: 'ability_druid_gore', school: 'physical', desc: 'A beak descends on a grappled victim.', ap: 2, mana: 0, cd: 1, range: 5, rangeType: 'melee', formula: '3d8 + 5', types: ['physical'] }),
    util({ id: 'kraken_breaker', name: 'Ice-Breaker', icon: 'spell_frost_frostblast', school: 'rime', desc: 'Shatters the ice beneath a vessel.', ap: 3, mana: 20, cd: 5, range: 30, utilityType: 'environment', effects: [{ id: 'shatter', name: 'Ice-Shatter', description: 'Shatters ice beneath a vessel; the ship sinks in 2 rounds.' }] }),
  ],
  marmennill: [
    ctrl({ id: 'marmennill_harp_song', name: 'Harp-Song', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'A harp-song that compels listeners toward the fjord-edge.', ap: 2, mana: 10, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 40, save: ['spirit', 13], duration: 2, controlType: 'charm', effects: [{ id: 'dream_state', name: 'Dream-State', description: 'Compelled toward the fjord-edge; whale-blubber earplugs negate.' }] }),
    dmg({ id: 'marmennill_bone_harp_bash', name: 'Bone-Harp-Bash', icon: 'ability_bossman_smash', school: 'physical', desc: 'A clumsy bash with its bone harp.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d4', types: ['physical'] }),
    util({ id: 'marmennill_oracle_answer', name: 'Oracle-Answer', icon: 'spell_arcane_tormentoftheweak', school: 'arcane', desc: 'Answers three future-questions in dense riddles\u2014then dissolves into seawater.', ap: 3, mana: 30, cd: 10, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'divination', effects: [{ id: 'riddles', name: 'Three Riddles', description: 'Answers 3 future-questions as impenetrable riddles; dies after the third.' }] }),
  ],
  havgammel: [
    util({ id: 'havgammel_form_shift', name: 'Form-Shift', icon: 'spell_druid_shapeshift', school: 'primal', desc: 'Shifts between guiding mermaid and trapping serpent based on observer intent.', ap: 1, mana: 5, cd: 2, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'transformation', duration: 3, effects: [{ id: 'shift', name: 'Form-Shift', description: 'Serpent-form creates ice-floes that trap ships.' }] }),
    buff({ id: 'havgammel_coin_bargain', name: 'Coin-Bargain', icon: 'spell_holy_silverseal', school: 'divine', desc: 'A silver coin tossed before the nets yields overflowing harvests.', ap: 1, mana: 10, cd: 5, range: 5, target: 'ally', targetRestrictions: ['ally'], duration: 3, buffType: 'combatAdvantage', effects: [{ id: 'bounty', name: 'Bounty', description: 'Grants overflowing harvests; pollution yields nets of carved bones.' }] }),
    passive({ id: 'havgammel_scrimshaw', name: 'Scrimshaw-Necklace', icon: 'spell_misc_emotion', school: 'arcane', desc: 'A scrimshaw necklace depicts drowning scenes; study reveals sunken wrecks.', effects: [{ id: 'wrecks', name: 'Wreck-Sense', description: 'Studying the necklace reveals locations of sunken wrecks.' }] }),
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// REGION 3: SUNDALE & EMBERSPIRE
// ═══════════════════════════════════════════════════════════════════════════
const EMBERSPIRE = {
  pazuzu: [
    dmg({ id: 'pazuzu_ash_storm', name: 'Ash-Storm', icon: 'spell_fire_volcano', school: 'physical', desc: 'A scything cloud of razor ash.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 40, formula: '3d6', types: ['physical'], save: ['constitution', 15], saveOutcome: 'no_effect', controlType: 'incapacitated', duration: 2, effects: [{ id: 'blinded', name: 'Blinded', description: 'Blinded for 2 rounds.' }] }),
    dmg({ id: 'pazuzu_lion_claw', name: 'Lion-Claw', icon: 'ability_druid_gore', school: 'physical', desc: 'Raking lion-talons.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'] }),
    dmg({ id: 'pazuzu_scorpion_sting', name: 'Scorpion-Sting', icon: 'spell_nature_nullifypoison', school: 'blight', desc: 'A venomous stinger-strike.', ap: 2, mana: 10, cd: 1, range: 10, rangeType: 'melee', formula: '1d6', types: ['physical'], dot: { formula: '2d6', type: 'blight', duration: 3 }, save: ['constitution', 15], saveOutcome: 'no_effect' }),
  ],
  tiamat: [
    dmg({ id: 'tiamat_magma_breath', name: 'Magma-Breath', icon: 'spell_fire_volcano', school: 'ember', desc: 'A roaring cone of magma.', ap: 3, mana: 25, cd: 2, range: 30, targetingType: 'cone', rangeType: 'self_centered', areaShape: 'cone', areaSize: 30, formula: '4d6', types: ['ember'], dot: { formula: '2d6', type: 'ember', duration: 2 }, save: ['constitution', 16] }),
    dmg({ id: 'tiamat_multi_head_strike', name: 'Multi-Head-Strike', icon: 'ability_druid_gore', school: 'physical', desc: 'Every head strikes a different target.', ap: 2, mana: 0, cd: 1, range: 10, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'] }),
    passive({ id: 'tiamat_lava_swim', name: 'Lava-Swim', icon: 'spell_fire_moltenarmor', school: 'ember', desc: 'Swims through molten rock; fully fire-immune.', effects: [{ id: 'lava_immune', name: 'Lava-Swim', description: 'Moves through molten rock at full speed; immune to fire.' }] }),
  ],
  anzu: [
    dmg({ id: 'anzu_talon_dive', name: 'Talon-Dive', icon: 'ability_hunter_aspectofthehawk', school: 'physical', desc: 'A plunging dive from the caldera-rim.', ap: 2, mana: 0, cd: 1, range: 10, rangeType: 'melee', formula: '2d8 + 5', types: ['physical', 'ember'], controlType: 'knockdown', duration: 0, effects: [{ id: 'prone', name: 'Knocked Prone', description: 'Knocked prone.' }] }),
    dmg({ id: 'anzu_golden_crest_flash', name: 'Golden-Crest-Flash', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'A blinding flare of its golden crest.', ap: 1, mana: 10, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 20, save: ['constitution', 14], duration: 1, controlType: 'incapacitated', effects: [{ id: 'blinded', name: 'Blinded', description: 'Blinded for 1 round.' }] }),
    passive({ id: 'anzu_obsidian_talon_ignite', name: 'Obsidian-Talon-Ignite', icon: 'spell_fire_firebolt', school: 'ember', desc: 'Talons ignite dry material on contact.', effects: [{ id: 'ignite', name: 'Ignite', description: 'Melee attacks deal +1d6 fire.' }] }),
  ],
  girtablilu: [
    ctrl({ id: 'girtablilu_pincer_crush', name: 'Pincer-Crush', icon: 'spell_nature_stranglevines', school: 'physical', desc: 'A vise-grip of chitinous pincers.', ap: 2, mana: 0, cd: 1, range: 5, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'], save: ['strength', 15], saveOutcome: 'no_effect', controlType: 'restraint', duration: 2, effects: [{ id: 'grappled', name: 'Grappled', description: 'Grappled in the pincers.' }] }),
    dmg({ id: 'girtablilu_stinger_venom', name: 'Stinger-Venom', icon: 'spell_nature_nullifypoison', school: 'blight', desc: 'A stinger-strike whose venom, in small doses, cures Wyrd-sickness.', ap: 2, mana: 10, cd: 2, range: 15, rangeType: 'melee', formula: '1d6', types: ['physical'], save: ['constitution', 16] }),
    ctrl({ id: 'girtablilu_vigilance_stare', name: 'Vigilance-Stare', icon: 'spell_shadow_fright', school: 'wyrd', desc: 'Golden eyes radiate divine authority.', ap: 1, mana: 5, cd: 2, range: 30, save: ['spirit', 14], duration: 1, controlType: 'incapacitation', effects: [{ id: 'intimidated', name: 'Intimidated', description: 'Unable to attack for 1 round.' }] }),
  ],
  ammit: [
    dmg({ id: 'ammit_crocodile_bite', name: 'Crocodile-Bite', icon: 'ability_druid_gore', school: 'physical', desc: 'A bone-shearing crocodilian bite.', ap: 2, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d10 + 5', types: ['physical'] }),
    dmg({ id: 'ammit_lion_charge', name: 'Lion-Charge', icon: 'ability_druid_thrash', school: 'physical', desc: 'A charging pounce that pins the victim.', ap: 2, mana: 0, cd: 1, range: 10, formula: '2d6 + 4', types: ['physical'], save: ['agility', 15], saveOutcome: 'no_effect', controlType: 'restraint', duration: 1, effects: [{ id: 'pinned', name: 'Knocked Prone & Pinned', description: 'Knocked prone and pinned.' }] }),
    passive({ id: 'ammit_smolder_hide', name: 'Smolder-Hide', icon: 'spell_fire_moltenarmor', school: 'ember', desc: 'Its body smolders; melee attackers burn on contact.', effects: [{ id: 'smolder', name: 'Smolder-Hide', description: 'Melee attackers take 1d6 fire on contact.' }] }),
  ],
  lamashtu: [
    ctrl({ id: 'lamashtu_donkey_shriek', name: 'Donkey-Shriek', icon: 'spell_shadow_deathscream', school: 'wyrd', desc: 'A devastating donkey-shriek.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 30, save: ['spirit', 15], duration: 1, controlType: 'stunned', effects: [{ id: 'stunned', name: 'Stunned', description: 'Stunned for 1 round.' }] }),
    dmg({ id: 'lamashtu_claw_rake', name: 'Claw-Rake', icon: 'ability_druid_gore', school: 'physical', desc: 'Raking demon-claws.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 4', types: ['physical'] }),
    passive({ id: 'lamashtu_copper_weep', name: 'Copper-Weep', icon: 'spell_fire_volcano', school: 'ember', desc: 'Molten copper weeps from her, pocking basalt.', effects: [{ id: 'copper_terrain', name: 'Copper-Terrain', description: 'Creates hazardous terrain dealing 1d6 fire per square.' }] }),
  ],
  bes: [
    ctrl({ id: 'bes_tambourine_bang', name: 'Tambourine-Bang', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'A tambourine whose laughter breaks enchantments and frightens Wyrd-creatures.', ap: 2, mana: 10, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 20, save: ['spirit', 13], duration: 1, controlType: 'fear', effects: [{ id: 'flee', name: 'Frightened Flee', description: 'Wyrd-creatures are frightened and must flee.' }] }),
    dmg({ id: 'bes_khopesh_slash', name: 'Khopesh-Slash', icon: 'ability_rogue_findweakness', school: 'physical', desc: 'A curving khopesh-stroke.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d8 + 3', types: ['physical'] }),
    util({ id: 'bes_shatter_sacrifice', name: 'Shatter-Sacrifice', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Explodes into protective clay-shards, warding the area.', ap: 3, mana: 20, cd: 10, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 20, utilityType: 'protection', effects: [{ id: 'ward', name: 'Permanent Ward', description: 'Creates a permanent 20-ft Wyrd-warding safe zone.' }] }),
  ],
  ifrit: [
    dmg({ id: 'ifrit_hurl', name: 'Coal-Hurl', icon: 'spell_fire_firebolt', school: 'ember', desc: 'Hurls a searing coal.', ap: 1, mana: 5, cd: 0, range: 40, formula: '2d8', types: ['ember'] }),
    ctrl({ id: 'ifrit_cobra_glare', name: 'Cobra-Glare', icon: 'spell_fire_incinerate', school: 'ember', desc: 'A gaze that ignites the flammable and sets foes ablaze.', ap: 2, mana: 15, cd: 2, range: 50, save: ['agility', 15], saveOutcome: 'no_effect', controlType: 'incapacitation', duration: 0, effects: [{ id: 'ablaze', name: 'Ablaze', description: '3d6 fire damage; set ablaze.' }] }),
    passive({ id: 'ifrit_flame_body', name: 'Flame-Body', icon: 'spell_fire_moltenarmor', school: 'ember', desc: 'A body of living flame.', effects: [{ id: 'flame_body', name: 'Flame-Body', description: 'Melee attackers take 2d6 fire on contact.' }] }),
  ],
  ghul: [
    dmg({ id: 'ghul_fire_bolt', name: 'Fire-Bolt', icon: 'spell_fire_firebolt', school: 'ember', desc: 'A streak of cinder-flame.', ap: 1, mana: 5, cd: 0, range: 30, formula: '2d6', types: ['ember'] }),
    dmg({ id: 'ghul_bone_cloak_split', name: 'Bone-Cloak-Split', icon: 'spell_fire_volcano', school: 'ember', desc: 'Its cloak splits open, revealing a furnace within.', ap: 2, mana: 15, cd: 2, range: 15, targetingType: 'cone', rangeType: 'self_centered', areaShape: 'cone', areaSize: 15, formula: '3d6', types: ['ember'], dot: { formula: '1d6', type: 'ember', duration: 2 }, save: ['constitution', 14] }),
    util({ id: 'ghul_invisible_shift', name: 'Invisible-Shift', icon: 'spell_shadow_fade', school: 'arcane', desc: 'Becomes completely invisible (save for floating green eyes).', ap: 1, mana: 10, cd: 2, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'movement', duration: 1, effects: [{ id: 'invisible', name: 'Invisible', description: 'Invisible for 1 round; DC 14 INT to spot the eyes.' }] }),
  ],
  gugalanna: [
    dmg({ id: 'gugalanna_magma_charge', name: 'Magma-Charge', icon: 'ability_druid_thrash', school: 'physical', desc: 'A trampling magma-charge.', ap: 2, mana: 0, cd: 1, range: 10, formula: '2d8 + 5', types: ['physical', 'ember'], save: ['agility', 15], saveOutcome: 'no_effect', controlType: 'knockdown', duration: 1, effects: [{ id: 'trampled', name: 'Trampled', description: 'Trampled.' }] }),
    dmg({ id: 'gugalanna_steam_breath', name: 'Steam-Breath', icon: 'spell_fire_volcano', school: 'ember', desc: 'A cone of scalding steam.', ap: 1, mana: 10, cd: 1, range: 15, targetingType: 'cone', rangeType: 'self_centered', areaShape: 'cone', areaSize: 15, formula: '2d6', types: ['ember'], save: ['constitution', 14], saveOutcome: 'no_effect', controlType: 'incapacitated', duration: 1, effects: [{ id: 'blinded', name: 'Blinded', description: 'Blinded for 1 round.' }] }),
    passive({ id: 'gugalanna_ground_breaker', name: 'Ground-Breaker', icon: 'spell_nature_earthquake', school: 'physical', desc: 'Its hooves crack cooling lava into navigation-maps.', effects: [{ id: 'tracks', name: 'Navigation Tracks', description: 'Following its tracks leads to stable ground.' }] }),
  ],
  peri: [
    dmg({ id: 'peri_proboscis_touch', name: 'Proboscis-Touch', icon: 'spell_holy_heal', school: 'divine', desc: 'A delicate touch that harms foes or mends allies.', ap: 1, mana: 5, cd: 0, range: 5, rangeType: 'melee', formula: '1d4', types: ['divine'] }),
    buff({ id: 'peri_runic_prayer_wings', name: 'Runic-Prayer-Wings', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Wings edged with prayers grant a surge of spirit.', ap: 1, mana: 10, cd: 3, range: 5, target: 'any', targetRestrictions: ['any'], duration: 3, buffType: 'statEnhancement', effects: [{ id: 'spi_boost', name: 'Prayer-Wings', description: '+4 Spirit for 1 hour.' }], statModifier: { stat: 'spirit', magnitude: 4, magnitudeType: 'flat' } }),
    util({ id: 'peri_wing_roll', name: 'Wing-Roll', icon: 'spell_fire_firebolt', school: 'ember', desc: 'Rolls dawn-thermal into a plantable sun-seed.', ap: 2, mana: 10, cd: 5, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'creation', effects: [{ id: 'sun_seed', name: 'Sun-Seed', description: 'Creates a sun-seed that produces fire for a year when planted.' }] }),
  ],
  daeva: [
    dmg({ id: 'daeva_chaos_bite', name: 'Chaos-Bite', icon: 'spell_shadow_unleasheddread', school: 'blight', desc: 'A bite of pure chaos.', ap: 1, mana: 5, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 4', types: ['blight'] }),
    debuff({ id: 'daeva_truth_eater', name: 'Truth-Eater', icon: 'spell_shadow_twistedfaith', school: 'wyrd', desc: 'Feeds on spoken truth, weakening the honest.', ap: 1, mana: 5, cd: 2, range: 50, duration: 3, debuffType: 'statPenalty', effects: [{ id: 'honest_weak', name: 'Honesty-Weakened', description: 'Honest speakers take -1 to all rolls per truth; shade gains +5 HP per truth.' }] }),
    passive({ id: 'daeva_light_absorb', name: 'Light-Absorb', icon: 'spell_shadow_voidshift', school: 'blight', desc: 'A three-dimensional hole in the world; visible only as a silhouette.', effects: [{ id: 'hole', name: 'Light-Absorb', description: 'All non-radiant damage reduced 75%.' }] }),
  ],
  simurgh: [
    dmg({ id: 'simurgh_talon_strike', name: 'Talon-Strike', icon: 'ability_hunter_aspectofthehawk', school: 'physical', desc: 'A raking talon-strike.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'] }),
    heal({ id: 'simurgh_feather_heal', name: 'Feather-Heal', icon: 'spell_holy_heal', school: 'divine', desc: 'Lays a healing feather that knits broken bones.', ap: 2, mana: 25, cd: 4, range: 5, target: 'ally', targetRestrictions: ['ally'], formula: '3d8 + 5' }),
    ctrl({ id: 'simurgh_wing_buffet', name: 'Wing-Buffet', icon: 'spell_shaman_thunderstorm', school: 'physical', desc: 'A hurricane wingbeat.', ap: 2, mana: 10, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 30, save: ['agility', 15], saveOutcome: 'no_effect', controlType: 'forcedMovement', duration: 0, effects: [{ id: 'knocked_back', name: 'Knocked Back', description: 'Knocked back 20 ft and prone.', config: { distance: 20, movementType: 'push' } }] }),
  ],
  azi: [
    dmg({ id: 'azi_triple_strike', name: 'Triple-Strike', icon: 'ability_druid_gore', school: 'ember', desc: 'Three heads strike at once: fire, lightning, and acid.', ap: 3, mana: 20, cd: 1, range: 10, rangeType: 'melee', formula: '2d6 + 4', types: ['ember', 'storm', 'blight'], save: ['constitution', 15] }),
    dmg({ id: 'azi_tail_whip', name: 'Tail-Whip', icon: 'ability_druid_thrash', school: 'physical', desc: 'A sweeping tail-strike.', ap: 1, mana: 0, cd: 0, range: 15, rangeType: 'melee', formula: '2d6 + 4', types: ['physical'], save: ['agility', 15], saveOutcome: 'no_effect', controlType: 'knockdown', duration: 1, effects: [{ id: 'prone', name: 'Knocked Prone', description: 'Knocked prone.' }] }),
    passive({ id: 'azi_obsidian_hide', name: 'Obsidian-Hide', icon: 'spell_fire_moltenarmor', school: 'physical', desc: 'Dinner-plate obsidian scales repel mortal weapons.', effects: [{ id: 'obsidian_hide', name: 'Obsidian-Hide', description: 'Non-magical weapons cannot pierce.' }] }),
  ],
  edimmu: [
    debuff({ id: 'edimmu_attachment_bond', name: 'Attachment-Bond', icon: 'spell_shadow_twistedfaith', school: 'blight', desc: 'Bonds to a passing creature, sapping strength over days.', ap: 1, mana: 10, cd: 5, range: 5, save: ['spirit', 14], duration: 3, debuffType: 'damageOverTime', effects: [{ id: 'fatigue', name: 'Bonded Fatigue', description: '-1 to all rolls per day; spontaneous combustion on day 7.' }] }),
    passive({ id: 'edimmu_heat_mirage', name: 'Heat-Mirage', icon: 'spell_shadow_fade', school: 'ember', desc: 'Visible only in peripheral vision.', effects: [{ id: 'mirage', name: 'Heat-Mirage', description: 'DC 14 INT to track its position.' }] }),
    passive({ id: 'edimmu_sulfur_aura', name: 'Sulfur-Aura', icon: 'spell_fire_selfdestruct', school: 'ember', desc: 'Smells of sulfur and ancient dust.', effects: [{ id: 'sulfur', name: 'Sulfur-Aura', description: 'Reveals its presence within 30 ft.' }] }),
  ],
  asag: [
    dmg({ id: 'asag_obsidian_fist', name: 'Obsidian-Fist', icon: 'ability_bossman_smash', school: 'physical', desc: 'A magma-hot stone fist.', ap: 2, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d8 + 5', types: ['physical', 'ember'] }),
    dmg({ id: 'asag_earth_laugh', name: 'Earth-Laugh', icon: 'spell_nature_earthquake', school: 'physical', desc: 'A localized magnitude-5 quake.', ap: 3, mana: 25, cd: 3, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 50, formula: '3d6', types: ['physical'], save: ['agility', 15] }),
    passive({ id: 'asag_boiling_presence', name: 'Boiling-Presence', icon: 'spell_fire_volcano', school: 'ember', desc: 'Water within 30 ft literally boils.', effects: [{ id: 'boil', name: 'Boiling Zone', description: '30-ft radius: scalding terrain deals 2d6 fire to anyone entering.' }], range: 30, areaShape: 'circle', areaSize: 30 }),
  ],
  nisroch: [
    dmg({ id: 'nisroch_wedjat_beam', name: 'Wedjat-Beam', icon: 'spell_holy_radiance', school: 'divine', desc: 'A beam of concentrated light from the left eye; double damage to Wyrd.', ap: 2, mana: 10, cd: 1, range: 40, formula: '2d6', types: ['divine'] }),
    dmg({ id: 'nisroch_bronze_talon', name: 'Bronze-Talon', icon: 'ability_hunter_aspectofthehawk', school: 'physical', desc: 'A diving bronze-talon rake.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['physical'] }),
    passive({ id: 'nisroch_sky_patrol', name: 'Sky-Patrol', icon: 'ability_hunter_aspectofthehawk', school: 'divine', desc: 'Patrols the skies scanning for Wyrd-manifestations.', effects: [{ id: 'patrol', name: 'Sky-Patrol', description: 'Acts as an early-warning system for Wyrd-creatures.' }] }),
  ],
  abzu: [
    buff({ id: 'abzu_wisdom_well', name: 'Wisdom-Well', icon: 'spell_arcane_tormentoftheweak', school: 'arcane', desc: 'Those who drink receive forgotten knowledge\u2014for a drop of blood.', ap: 2, mana: 20, cd: 5, range: 5, target: 'any', targetRestrictions: ['any'], duration: 3, buffType: 'empowerment', effects: [{ id: 'knowledge', name: 'Forgotten Knowledge', description: 'Grants one piece of pre-Dimming knowledge.' }] }),
    util({ id: 'abzu_volcanic_coolant', name: 'Volcanic-Coolant', icon: 'spell_frost_frostbolt', school: 'rime', desc: 'Its spring feeds cooling-channels beneath the forges.', ap: 1, mana: 0, cd: 5, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'environment', effects: [{ id: 'coolant', name: 'Coolant Spring', description: 'Prevents the forges from overheating.' }] }),
    passive({ id: 'abzu_water_form', name: 'Water-Form', icon: 'spell_frost_frostarmor', school: 'rime', desc: 'A stationary pool; immune to physical damage.', effects: [{ id: 'water_form', name: 'Water-Form', description: 'Immune to physical damage; vulnerable to cold (freezes).' }] }),
  ],
  kur_pit: [
    ctrl({ id: 'kur_underworld_mouth', name: 'Underworld-Mouth', icon: 'spell_shadow_voidshift', school: 'blight', desc: 'A perfectly circular pit opens without warning.', ap: 3, mana: 40, cd: 5, range: 5, save: ['agility', 16], duration: 3, controlType: 'restraint', effects: [{ id: 'trapped', name: 'Trapped in Labyrinth', description: 'Trapped in the labyrinth between Kur and Duat.' }] }),
    ctrl({ id: 'kur_abyssal_grip', name: 'Abyssal-Grip', icon: 'spell_shadow_graspofmalorne', school: 'blight', desc: 'A gravitational pull toward the pit\'s edge.', ap: 1, mana: 10, cd: 1, range: 10, targetingType: 'area', areaShape: 'circle', areaSize: 10, save: ['agility', 13], duration: 1, controlType: 'forcedMovement', effects: [{ id: 'slide', name: 'Sliding', description: 'Slides 5 ft closer to the pit each round.', config: { distance: 5, movementType: 'pull' } }] }),
    debuff({ id: 'kur_murmur_of_dead', name: 'Murmur-of-Dead', icon: 'spell_shadow_twistedfaith', school: 'wyrd', desc: 'Countless voices in dead languages shake the will.', ap: 1, mana: 10, cd: 2, range: 50, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 50, save: ['spirit', 14], duration: 3, debuffType: 'statusEffect', effects: [{ id: 'shaken', name: 'Shaken', description: '-2 to all checks.' }] }),
  ],
  mushussu: [
    dmg({ id: 'mushuss_nub_horn_bonk', name: 'Nub-Horn-Bonk', icon: 'ability_druid_thrash', school: 'physical', desc: 'A clumsy baby-horn bonk.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d4', types: ['physical'] }),
    buff({ id: 'mushuss_life_breath', name: 'Life-Breath', icon: 'spell_nature_regeneration', school: 'primal', desc: 'Its breath accelerates plant growth.', ap: 1, mana: 5, cd: 3, range: 5, target: 'ally', targetRestrictions: ['ally'], duration: 3, buffType: 'statEnhancement', effects: [{ id: 'growth', name: 'Double Yields', description: 'A visited garden produces double yields.' }] }),
    passive({ id: 'mushuss_imprint_follow', name: 'Imprint-Follow', icon: 'ability_hunter_beastmastery', school: 'primal', desc: 'Imprints on the first kind creature it meets.', effects: [{ id: 'imprint', name: 'Imprint', description: 'Encourages the adult Sirrush to guard the imprinted creature\'s village.' }] }),
  ],
  sirrush: [
    dmg({ id: 'sirrush_dragon_breath', icon: 'spell_fire_fireball', school: 'ember', name: 'Dragon-Breath', desc: 'A streaming gout of drake-fire.', ap: 2, mana: 15, cd: 1, range: 20, targetingType: 'cone', rangeType: 'self_centered', areaShape: 'cone', areaSize: 20, formula: '3d8', types: ['ember'], save: ['agility', 15] }),
    dmg({ id: 'sirrush_serrated_talon', icon: 'ability_druid_gore', school: 'physical', name: 'Serrated-Talon', desc: 'A rending talon-rake.', ap: 1, mana: 0, cd: 0, range: 10, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'] }),
    passive({ id: 'sirrush_scaled_ward', icon: 'spell_fire_moltenarmor', school: 'ember', name: 'Scaled-Ward', desc: 'Glittering scales turn aside elemental harm.', effects: [{ id: 'scale_ward', name: 'Scaled-Ward', description: 'Resistant to fire and frost.' }] }),
  ],
  aswad: [
    dmg({ id: 'aswad_ember_spit', name: 'Ember-Spit', icon: 'spell_fire_firebolt', school: 'ember', desc: 'Hawks a clot of embers from its jar.', ap: 1, mana: 0, cd: 0, range: 30, formula: '1d6', types: ['ember'] }),
    util({ id: 'aswad_soot_shield', name: 'Soot-Shield', icon: 'spell_fire_moltenarmor', school: 'ember', desc: 'Vents smoke, blurring its form against ranged attacks.', ap: 1, mana: 5, cd: 2, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'protection', duration: 2, effects: [{ id: 'concealed', name: 'Soot-Veil', description: 'DC 12 AGI to hit with ranged attacks.' }] }),
    passive({ id: 'aswad_ember_resist', name: 'Ember-Resist', icon: 'spell_fire_firecore', school: 'ember', desc: 'Born of embers; unharmed by flame.', effects: [{ id: 'fire_immune', name: 'Ember-Resist', description: 'Immune to fire damage; vulnerable to water.' }] }),
  ],
  serpopard: [
    ctrl({ id: 'serpopard_serpentine_lunge', name: 'Serpentine-Lunge', icon: 'spell_nature_entanglement', school: 'physical', desc: 'A long-necked lunge that grapples.', ap: 2, mana: 0, cd: 1, range: 15, rangeType: 'melee', formula: '2d8 + 4', types: ['physical'], save: ['agility', 14], saveOutcome: 'no_effect', controlType: 'restraint', duration: 2, effects: [{ id: 'grappled', name: 'Grappled', description: 'Grappled by the long neck.' }] }),
    dmg({ id: 'serpopard_constrict', name: 'Constrict', icon: 'spell_nature_stranglevines', school: 'physical', desc: 'Crushing coils against a grappled victim.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 4', types: ['physical'] }),
    ctrl({ id: 'serpopard_hypnotic_sway', name: 'Hypnotic-Sway', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'A swaying, hypnotic dance.', ap: 1, mana: 10, cd: 2, range: 20, save: ['spirit', 13], duration: 2, controlType: 'charm', effects: [{ id: 'charmed', name: 'Charmed', description: 'Charmed for 2 rounds.' }] }),
  ],
  lamassu: [
    dmg({ id: 'lamassu_runic_stomp', name: 'Runic-Stomp', icon: 'ability_bossman_smash', school: 'physical', desc: 'A stunning hoof-strike charged with runes.', ap: 2, mana: 0, cd: 1, range: 5, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'], save: ['constitution', 14], saveOutcome: 'no_effect', controlType: 'stunned', duration: 1, effects: [{ id: 'stunned', name: 'Stunned', description: 'Stunned for 1 round.' }] }),
    ctrl({ id: 'lamassu_sunburst_wing', name: 'Sunburst-Wing', icon: 'spell_holy_radiance', school: 'divine', desc: 'Wings flare in a blinding sunburst.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 20, save: ['spirit', 14], duration: 1, controlType: 'incapacitated', effects: [{ id: 'blinded', name: 'Blinded', description: 'Blinded by radiant light for 1 round.' }] }),
    passive({ id: 'lamassu_stone_ward', name: 'Stone-Ward', icon: 'spell_holy_devotionaura', school: 'physical', desc: 'Sacred stone-hide turns aside blows.', effects: [{ id: 'stone_ward', name: 'Stone-Ward', description: 'Takes 5 less damage from physical attacks.' }] }),
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// REGION 4: THE ICEHEART SEA
// ═══════════════════════════════════════════════════════════════════════════
const ICEHEART = {
  mamiri: [
    ctrl({ id: 'siren_song_lure', name: 'Song-Lure', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'An irresistible song pulling victims toward the reef.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 120, save: ['spirit', 14], duration: 2, controlType: 'charm', effects: [{ id: 'compelled', name: 'Compelled', description: 'Overwhelming compulsion to move toward the Siren.' }] }),
    dmg({ id: 'siren_kelp_hair_grasp', name: 'Kelp-Hair-Grasp', icon: 'spell_nature_entanglement', school: 'physical', desc: 'Kelp-hair snares and grapples.', ap: 1, mana: 0, cd: 0, range: 10, rangeType: 'melee', formula: '1d8 + 3', types: ['physical'], save: ['agility', 13], saveOutcome: 'no_effect', controlType: 'restraint', duration: 2, effects: [{ id: 'grappled', name: 'Grappled', description: 'Grappled.' }] }),
    util({ id: 'siren_cowrie_bargain', name: 'Cowrie-Crown-Bargain', icon: 'spell_holy_silverseal', school: 'arcane', desc: 'Offers a binding deal sealed with a cowrie shell.', ap: 2, mana: 10, cd: 5, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'special', effects: [{ id: 'bargain', name: 'Binding Bargain', description: 'Wealth or passage for a treasure, secret, or years of life.' }] }),
  ],
  charybdis: [
    dmg({ id: 'charybdis_whirlpool_vortex', name: 'Whirlpool-Vortex', icon: 'spell_frost_frostblast', school: 'physical', desc: 'Anchors in narrow channels, dragging vessels in.', ap: 3, mana: 25, cd: 3, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 100, save: ['strength', 16], duration: 2, controlType: 'forcedMovement', effects: [{ id: 'pulled', name: 'Pulled', description: 'Pulled 20 ft closer each round.', config: { distance: 20, movementType: 'pull' } }] }),
    dmg({ id: 'charybdis_lamprey_throat', name: 'Lamprey-Throat', icon: 'ability_druid_gore', school: 'physical', desc: 'A lamprey-mouthed bite that swallows.', ap: 2, mana: 0, cd: 1, range: 5, rangeType: 'melee', formula: '2d10 + 5', types: ['physical'], save: ['strength', 15], saveOutcome: 'no_effect', controlType: 'restraint', duration: 3, effects: [{ id: 'swallowed', name: 'Swallowed', description: 'Swallowed; 4d6 acid per round.' }] }),
    debuff({ id: 'charybdis_leopard_scale_flash', name: 'Leopard-Scale-Flash', icon: 'spell_shadow_phantasm', school: 'wyrd', desc: 'Disorienting flashing scales at the vortex edge.', ap: 1, mana: 5, cd: 1, range: 15, save: ['spirit', 13], duration: 1, debuffType: 'statusEffect', effects: [{ id: 'confused', name: 'Confused', description: 'Confused for 1 round.' }] }),
  ],
  ketos: [
    dmg({ id: 'ketos_elephant_tusk_ram', name: 'Elephant-Tusk-Ram', icon: 'ability_druid_thrash', school: 'physical', desc: 'A colossal tusk-ram that can hole a hull.', ap: 3, mana: 0, cd: 1, range: 20, rangeType: 'melee', formula: '3d8 + 6', types: ['physical'] }),
    ctrl({ id: 'ketos_swallow_whole', name: 'Swallow-Whole', icon: 'spell_shadow_unsummon', school: 'blight', desc: 'A maw large enough to swallow a small ship.', ap: 3, mana: 30, cd: 3, range: 10, formula: '5d6', types: ['blight'], save: ['strength', 18], saveOutcome: 'no_effect', controlType: 'restraint', duration: 3, effects: [{ id: 'swallowed', name: 'Swallowed', description: 'Vessel and crew swallowed; 5d6 acid per round.' }] }),
    passive({ id: 'ketos_gods_mistake_intellect', name: 'God\'s-Mistake-Intellect', icon: 'spell_arcane_tormentoftheweak', school: 'wyrd', desc: 'An enormous, intelligent brain.', effects: [{ id: 'intellect', name: 'God\'s-Mistake', description: 'Psychic damage ignores 50% of its resistances.' }] }),
  ],
  harpy: [
    dmg({ id: 'harpy_mast_snatcher', name: 'Mast-Snatcher', icon: 'ability_hunter_aspectofthehawk', school: 'physical', desc: 'Snatches crew from decks and lifts them away.', ap: 2, mana: 0, cd: 1, range: 10, formula: '2d6 + 3', types: ['physical'], save: ['agility', 14], saveOutcome: 'no_effect', controlType: 'restraint', duration: 1, effects: [{ id: 'grappled', name: 'Grappled', description: 'Grappled and lifted 20 ft.' }] }),
    dmg({ id: 'harpy_feather_slash', name: 'Feather-Slash', icon: 'ability_rogue_findweakness', school: 'physical', desc: 'A raking wing-claw.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d8 + 3', types: ['physical'] }),
    passive({ id: 'harpy_iron_hook_feet', name: 'Iron-Hook-Feet', icon: 'ability_hunter_aspectofthehawk', school: 'physical', desc: 'Curved iron-hooks lock it to the rigging.', effects: [{ id: 'locked', name: 'Iron-Hook-Feet', description: 'Cannot be dislodged without dealing 20 damage or breaking the mast.' }] }),
  ],
  hippocampus: [
    buff({ id: 'hippocampus_wave_crest', name: 'Wave-Crest', icon: 'spell_frost_frostbolt', school: 'rime', desc: 'Raises waves to speed allies and bog enemies.', ap: 1, mana: 5, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 30, duration: 3, buffType: 'movementBuff', effects: [{ id: 'speed', name: 'Wave-Speed', description: 'Allies +10 swim speed; enemies find water difficult.' }] }),
    dmg({ id: 'hippocampus_hoof_fin_steer', name: 'Hoof-Fin-Steer', icon: 'ability_druid_thrash', school: 'physical', desc: 'A lashing hoof-fin.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d6 + 2', types: ['physical'] }),
    passive({ id: 'hippocampus_estuary_purify', name: 'Estuary-Purify', icon: 'spell_holy_heal', school: 'divine', desc: 'Its presence purifies Wyrd-tainted water.', effects: [{ id: 'pure_water', name: 'Pure Water', description: 'Drinking its water grants 24-hour immunity to water-borne disease.' }] }),
  ],
  gorgon: [
    ctrl({ id: 'gorgon_stone_gaze', name: 'Stone-Gaze', icon: 'spell_shadow_deathfocus', school: 'blight', desc: 'A gaze that progressively petrifies.', ap: 2, mana: 20, cd: 2, range: 30, save: ['spirit', 15], duration: 3, controlType: 'incapacitation', effects: [{ id: 'petrifying', name: 'Petrifying', description: 'Rd1: -10 speed; Rd2: restrained; Rd3: petrified.' }] }),
    ctrl({ id: 'gorgon_eel_hair_hypnosis', name: 'Eel-Hair-Hypnosis', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'Bioluminescent eel-hair pulses hypnotically.', ap: 1, mana: 10, cd: 2, range: 15, save: ['spirit', 13], duration: 2, controlType: 'charm', effects: [{ id: 'entranced', name: 'Entranced', description: 'Entranced; can be pulled toward her without resistance.' }] }),
    util({ id: 'gorgon_firefly_shift', name: 'Firefly-Shift', icon: 'spell_shadow_fade', school: 'arcane', desc: 'Compresses into a tiny eel, becoming nearly invisible.', ap: 1, mana: 10, cd: 3, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'movement', duration: 1, effects: [{ id: 'tiny', name: 'Firefly-Form', description: 'DC 16 INT to spot; drinks fish-blood in this form.' }] }),
  ],
  tokoloshe: [
    util({ id: 'tokoloshe_pebble_invisibility', name: 'Pebbble-Invisibility', icon: 'spell_shadow_fade', school: 'arcane', desc: 'Swallows a black pebble to vanish.', ap: 1, mana: 10, cd: 3, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'movement', duration: 2, effects: [{ id: 'invisible', name: 'Invisible', description: 'Invisible; DC 14 INT to hear its breathing.' }] }),
    dmg({ id: 'tokoloshe_long_arm_grab', name: 'Long-Arm-Grab', icon: 'spell_nature_entanglement', school: 'physical', desc: 'A snatch-and-steal.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d4', types: ['physical'] }),
    debuff({ id: 'tokoloshe_bilge_pest', name: 'Bilge-Pest', icon: 'spell_shadow_twistedfaith', school: 'physical', desc: 'Infests bilges, tangling rigging and sabotaging tools.', ap: 1, mana: 5, cd: 3, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], duration: 3, debuffType: 'abilityDisable', effects: [{ id: 'sabotage', name: 'Navigation Sabotage', description: 'All Navigation checks DC +5 while it remains.' }] }),
  ],
  lamia: [
    ctrl({ id: 'lamia_reef_grasp', name: 'Reef-Grasp', icon: 'spell_nature_entanglement', school: 'physical', desc: 'Inordinately long arms grapple and drag.', ap: 2, mana: 0, cd: 1, range: 15, rangeType: 'melee', formula: '2d6 + 4', types: ['physical'], save: ['agility', 14], saveOutcome: 'no_effect', controlType: 'restraint', duration: 2, effects: [{ id: 'grappled', name: 'Grappled', description: 'Grappled and pulled from deck.' }] }),
    ctrl({ id: 'lamia_grief_lure', name: 'Grief-Lure', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'A lullaby mimicking a grieving mother.', ap: 1, mana: 10, cd: 2, range: 30, save: ['spirit', 15], duration: 2, controlType: 'charm', effects: [{ id: 'lean', name: 'Leaning', description: 'Those who lost children lean into her reach.' }] }),
    passive({ id: 'lamia_pearl_tear', name: 'Pearl-Tear', icon: 'spell_holy_heal', school: 'divine', desc: 'Tears dissolve into pearl-trails that attract predators.', effects: [{ id: 'pearl_trail', name: 'Pearl-Trail', description: 'Tears leave trails attracting predators.' }] }),
  ],
  empusa: [
    heal({ id: 'empusa_storm_seduction', name: 'Storm-Seduction', icon: 'spell_shadow_soulburn', school: 'blight', desc: 'Charms a lone victim and drains vitality.', ap: 2, mana: 15, cd: 2, range: 5, save: ['spirit', 14], formula: '2d6 + 3', vampiric: { formula: '2d6 + 3', type: 'blight' } }),
    dmg({ id: 'empusa_hammer_skull_staff', name: 'Hammer-Skull-Staff', icon: 'ability_bossman_smash', school: 'storm', desc: 'A crackling staff-blow of brass and lightning.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['physical', 'storm'] }),
    debuff({ id: 'empusa_asymmetric_walk', name: 'Asymmetric-Walk', icon: 'spell_shadow_phantasm', school: 'wyrd', desc: 'The clicking brass-leg and donkey-hoof disorient foes.', ap: 1, mana: 5, cd: 2, range: 15, save: ['spirit', 12], duration: 2, debuffType: 'statPenalty', effects: [{ id: 'disoriented', name: 'Disoriented', description: '-2 to attacks against her.' }] }),
  ],
  telkhine: [
    dmg({ id: 'telkhine_whale_bone_hammer', name: 'Whale-Bone-Hammer', icon: 'ability_bossman_smash', school: 'physical', desc: 'A stunning whale-bone blow.', ap: 2, mana: 0, cd: 1, range: 5, rangeType: 'melee', formula: '2d6 + 4', types: ['physical'], save: ['strength', 13], saveOutcome: 'no_effect', controlType: 'stunned', duration: 1, effects: [{ id: 'stunned', name: 'Stunned', description: 'Stunned for 1 round.' }] }),
    ctrl({ id: 'telkhine_boat_roll', name: 'Boat-Roll', icon: 'spell_frost_frostblast', school: 'rime', desc: 'Overturns small boats, stripping their metal fittings.', ap: 2, mana: 15, cd: 3, range: 15, save: ['strength', 14], duration: 1, controlType: 'forcedMovement', effects: [{ id: 'overturned', name: 'Overturned', description: 'Boat overturned; only wood remains.' }] }),
    passive({ id: 'telkhine_ice_smith', name: 'Ice-Smith', icon: 'spell_frost_frostarmor', school: 'rime', desc: 'Forges weapons from deep-sea ice that never melt.', effects: [{ id: 'ice_weapon', name: 'Telkhine-Ice Weapon', description: 'Forged weapons deal +1d6 frost damage.' }] }),
  ],
  stymphalian: [
    dmg({ id: 'stymphalian_feather_arrow', name: 'Feather-Arrow', icon: 'ability_hunter_aspectofthehawk', school: 'physical', desc: 'Launches razor-feathers like arrows.', ap: 1, mana: 0, cd: 0, range: 40, formula: '2d6 + 3', types: ['physical'] }),
    debuff({ id: 'stymphalian_metallic_clatter', name: 'Metallic-Clatter', icon: 'spell_shadow_twistedfaith', school: 'wyrd', desc: 'The metallic wing-beat disrupts concentration.', ap: 1, mana: 5, cd: 1, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 200, save: ['spirit', 12], duration: 1, debuffType: 'statPenalty', effects: [{ id: 'distracted', name: 'Distracted', description: '-2 to concentration.' }] }),
    ctrl({ id: 'stymphalian_bronze_rattle', name: 'Bronze-Rattle-Vulnerability', icon: 'spell_shadow_fright', school: 'wyrd', desc: 'Loud bronze rattles can drive the flock to flee.', ap: 1, mana: 0, cd: 4, range: 30, save: ['spirit', 13], duration: 1, controlType: 'fear', effects: [{ id: 'flee', name: 'Flee', description: 'Flock must flee.' }] }),
  ],
  nereid: [
    heal({ id: 'nereid_drowning_savior', name: 'Drowning-Savior', icon: 'spell_holy_heal', school: 'divine', desc: 'Carries drowning sailors to the surface.', ap: 2, mana: 20, cd: 3, range: 5, target: 'ally', targetRestrictions: ['ally'], formula: '2d8 + 4', hot: { formula: '1d6', duration: 3 } }),
    ctrl({ id: 'nereid_breath_withdraw', name: 'Breath-Withdraw', icon: 'spell_frost_frozencore', school: 'rime', desc: 'Withdraws the breath of the sea from trespassers.', ap: 2, mana: 15, cd: 3, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 30, save: ['constitution', 14], duration: 2, controlType: 'incapacitation', effects: [{ id: 'drowning', name: 'Drowning', description: 'Begins drowning.' }] }),
    passive({ id: 'nereid_luminous_form', name: 'Luminous-Form', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Emits soft blue-green light.', effects: [{ id: 'glow', name: 'Luminous', description: '+6 to Persuasion; illuminates 30 ft.' }] }),
  ],
  graeae: [
    util({ id: 'graeae_shared_obsidian_eye', name: 'Shared-Obsidian-Eye', icon: 'spell_arcane_tormentoftheweak', school: 'arcane', desc: 'The crones pass the eye to grant a prophetic answer.', ap: 2, mana: 15, cd: 3, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'divination', effects: [{ id: 'prophecy', name: 'Prophecy', description: 'One prophetic answer; refuse the tooth-price and receive a false prophecy.' }] }),
    debuff({ id: 'graeae_frost_robe', name: 'Frost-Robe', icon: 'spell_frost_frostarmor', school: 'rime', desc: 'Robes crackling with frost burn melee attackers.', ap: 1, mana: 5, cd: 1, range: 5, save: ['constitution', 13], duration: 1, debuffType: 'statusEffect', effects: [{ id: 'frost_burn', name: 'Frost-Burn', description: 'Melee attackers take 1d6 frost.' }] }),
    util({ id: 'graeae_tooth_price', name: 'Tooth-Price', icon: 'spell_shadow_mindsteal', school: 'physical', desc: 'Answers cost a tooth\u2014extraction ensures truth.', ap: 1, mana: 0, cd: 5, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'special', effects: [{ id: 'tooth', name: 'Tooth-Extraction', description: 'Deals 1d4 damage; ensures the prophecy is true.' }] }),
  ],
  triton: [
    dmg({ id: 'triton_wave_control', name: 'Wave-Control', icon: 'spell_frost_frostbolt', school: 'physical', desc: 'A horn-call raises a wall of water.', ap: 3, mana: 25, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'line', areaSize: 40, formula: '3d6', types: ['physical'], save: ['agility', 16], saveOutcome: 'no_effect', controlType: 'forcedMovement', duration: 0, effects: [{ id: 'pushed', name: 'Pushed Back', description: 'Pushed back 30 ft.', config: { distance: 30, movementType: 'push' } }] }),
    dmg({ id: 'triton_trident_strike', name: 'Trident-Strike', icon: 'ability_druid_gore', school: 'physical', desc: 'A precise trident-thrust.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'] }),
    passive({ id: 'triton_depth_sovereign', name: 'Depth-Sovereign', icon: 'spell_frost_frostarmor', school: 'rime', desc: 'His presence prevents lesser sea-monsters from attacking.', effects: [{ id: 'sovereign', name: 'Depth-Sovereign', description: 'Lesser sea-monsters will not attack within 100 ft.' }] }),
  ],
  nandi: [
    dmg({ id: 'nandi_skull_crush', name: 'Skull-Crush', icon: 'ability_bossman_smash', school: 'physical', desc: 'A bone-crushing bite to the head.', ap: 2, mana: 0, cd: 1, range: 5, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'], save: ['constitution', 15], saveOutcome: 'no_effect', controlType: 'stunned', duration: 1, effects: [{ id: 'stunned', name: 'Stunned', description: 'Stunned for 1 round.' }] }),
    buff({ id: 'nandi_ice_floe_ambush', name: 'Ice-Floe-Ambush', icon: 'spell_druid_camouflage', school: 'rime', desc: 'Hides on ice-floes for an ambush.', ap: 1, mana: 0, cd: 3, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], duration: 1, buffType: 'combatAdvantage', effects: [{ id: 'ambush', name: 'Ambush', description: '+8 to stealth on ice; first attack has advantage.' }] }),
    passive({ id: 'nandi_bristle_float', name: 'Bristle-Float', icon: 'spell_frost_frostarmor', school: 'rime', desc: 'Greasy bristles trap air for buoyancy.', effects: [{ id: 'float', name: 'Unsinkable', description: 'Cannot be drowned.' }] }),
  ],
  popobawa: [
    ctrl({ id: 'popobawa_single_eye', name: 'Single-Eye', icon: 'spell_shadow_fright', school: 'wyrd', desc: 'Staring at its one eye for too long terrifies.', ap: 1, mana: 10, cd: 2, range: 20, save: ['spirit', 15], duration: 3, controlType: 'fear', effects: [{ id: 'frightened', name: 'Frightened', description: 'Frightened for 1 minute.' }] }),
    debuff({ id: 'popobawa_shame_silence', name: 'Shame-Silence', icon: 'spell_shadow_twistedfaith', school: 'wyrd', desc: 'Victims are psychically silenced about the attack.', ap: 1, mana: 5, cd: 3, range: 30, save: ['spirit', 14], duration: 3, debuffType: 'abilityDisable', effects: [{ id: 'silenced', name: 'Shame-Silenced', description: 'Cannot speak of the attack until naming it publicly.' }] }),
    passive({ id: 'popobawa_form_cycle', name: 'Form-Cycle', icon: 'spell_druid_shapeshift', school: 'arcane', desc: 'Shifts between dwarf, specter, and shadow each round.', effects: [{ id: 'form_cycle', name: 'Form-Cycle', description: 'Attacks of opportunity cannot target it.' }] }),
  ],
  abada: [
    util({ id: 'abada_horn_purify', name: 'Horn-Purify', icon: 'spell_holy_heal', school: 'divine', desc: 'Touching poisoned water with its horn purifies it.', ap: 2, mana: 15, cd: 5, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'cure', effects: [{ id: 'purify', name: 'Purify Water', description: 'Purifies a ship\'s water supply for a year.' }] }),
    dmg({ id: 'abada_narwhal_bonk', name: 'Narwhal-Bonk', icon: 'ability_druid_thrash', school: 'physical', desc: 'A playful horn-jab.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d6 + 2', types: ['physical'] }),
    passive({ id: 'abada_garden', name: 'Reef-Garden', icon: 'spell_nature_regeneration', school: 'primal', desc: 'Tended reefs grow twice as fast and resist decay.', effects: [{ id: 'garden', name: 'Reef-Garden', description: 'Tended reefs are immune to Wyrd-decay.' }] }),
  ],
  graia: [
    ctrl({ id: 'graia_future_face', name: 'Future-Face', icon: 'spell_arcane_tormentoftheweak', school: 'wyrd', desc: 'Staring reveals your own older face\u2014then the question comes.', ap: 2, mana: 20, cd: 3, range: 5, save: ['spirit', 16], duration: 2, controlType: 'charm', effects: [{ id: 'compelled', name: 'Compelled', description: 'Compelled to answer: What will you pay?' }] }),
    util({ id: 'graia_grey_passage', name: 'Grey-Passage', icon: 'spell_arcane_teleportundercity', school: 'arcane', desc: 'Ships passing through the center travel in time, not space.', ap: 3, mana: 40, cd: 5, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'special', effects: [{ id: 'time_travel', name: 'Grey-Passage', description: 'Emerge having aged weeks, or vice versa; the swirl takes its cut.' }] }),
    passive({ id: 'graia_still_surface', name: 'Still-Surface', icon: 'spell_frost_frostarmor', school: 'arcane', desc: 'The air above the eddy is unnaturally still.', effects: [{ id: 'calm', name: 'Calm Zone', description: '60-ft radius of calm even during storms.' }] }),
  ],
  ichthya: [
    dmg({ id: 'ichthya_trident_strike', name: 'Trident-Strike', icon: 'ability_druid_gore', school: 'physical', desc: 'A red-hot trident-thrust.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d8 + 4', types: ['physical', 'ember'] }),
    dmg({ id: 'ichthya_horse_uppercut', name: 'Horse-Uppercut', icon: 'ability_druid_thrash', school: 'physical', desc: 'A rearing uppercut.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['physical'] }),
    util({ id: 'ichthya_wave_forge', name: 'Wave-Forge', icon: 'spell_fire_moltenarmor', school: 'ember', desc: 'Forges unbreakable weapons beneath the waves.', ap: 2, mana: 15, cd: 5, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'creation', effects: [{ id: 'forge', name: 'Wave-Forged Gift', description: 'Creates a trident/harpoon that never rusts, breaks, or misses.' }] }),
  ],
  brine: [
    util({ id: 'brine_safe_harbor_glow', name: 'Safe-Harbor-Glow', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Appears over safe anchorages during the worst storms.', ap: 1, mana: 5, cd: 3, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'perception', duration: 6, effects: [{ id: 'guide', name: 'Safe Harbor', description: 'Following it always leads to safety.' }] }),
    debuff({ id: 'brine_false_lantern', name: 'False-Lantern', icon: 'spell_shadow_phantasm', school: 'arcane', desc: 'A corrupted lantern leads ships onto rocks.', ap: 2, mana: 10, cd: 4, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 30, save: ['intelligence', 13], duration: 1, debuffType: 'statusEffect', effects: [{ id: 'decoy', name: 'Misled', description: 'Screaming faces inside; leads onto rocks.' }] }),
    buff({ id: 'brine_soul_light', name: 'Soul-Light', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Warm light comforts nearby creatures.', ap: 1, mana: 5, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 20, duration: 3, buffType: 'statEnhancement', effects: [{ id: 'comfort', name: 'Comfort', description: '+2 to Spirit saves within 20 ft.' }] }),
  ],
  pelagos: [
    dmg({ id: 'pelagos_reef_breaker', name: 'Reef-Breaker', icon: 'ability_bossman_smash', school: 'physical', desc: 'A crushing blow of coral-mass.', ap: 2, mana: 0, cd: 1, range: 10, rangeType: 'melee', formula: '2d10 + 4', types: ['physical'] }),
    ctrl({ id: 'pelagos_tidal_pull', name: 'Tidal-Pull', icon: 'spell_frost_frostbolt', school: 'rime', desc: 'Draws foes into the surf.', ap: 2, mana: 10, cd: 2, range: 20, save: ['strength', 14], duration: 1, controlType: 'forcedMovement', effects: [{ id: 'dragged', name: 'Dragged Under', description: 'Dragged 15 ft into the water.', config: { distance: 15, movementType: 'pull' } }] }),
    passive({ id: 'pelagos_amphibious', name: 'Amphibious', icon: 'spell_frost_frostarmor', school: 'rime', desc: 'Breathes water and land alike.', effects: [{ id: 'amphibious', name: 'Amphibious', description: 'Can breathe underwater; swim 40.' }] }),
  ],
  egbere: [
    ctrl({ id: 'egbere_crying_call', name: 'Crying-Call', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'A wailing cry that charms hearers closer.', ap: 2, mana: 10, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 60, save: ['spirit', 13], duration: 2, controlType: 'charm', effects: [{ id: 'compelled', name: 'Compelled', description: 'Compelled to move toward the Egbere.' }] }),
    dmg({ id: 'egbere_salt_wave', name: 'Salt-Wave', icon: 'spell_frost_frostblast', school: 'rime', desc: 'A 30-ft cone of stinging brine.', ap: 1, mana: 5, cd: 1, range: 30, targetingType: 'cone', rangeType: 'self_centered', areaShape: 'cone', areaSize: 30, formula: '2d6', types: ['rime'], save: ['agility', 13] }),
    passive({ id: 'egbere_mat_shield', name: 'Mat-Shield', icon: 'spell_nature_stranglevines', school: 'physical', desc: 'Its woven mat wards off blows.', effects: [{ id: 'mat_shield', name: 'Mat-Shield', description: '+4 defense while holding its mat.' }] }),
  ],
  scylla_crab: [
    dmg({ id: 'scylla_obsidian_claw', name: 'Obsidian-Claw', icon: 'ability_druid_gore', school: 'physical', desc: 'An armor-piercing obsidian claw-strike.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'] }),
    ctrl({ id: 'scylla_ice_cutter', name: 'Ice-Cutter', icon: 'spell_frost_frozencore', school: 'rime', desc: 'Pins the victim\'s leg, halving speed.', ap: 2, mana: 10, cd: 1, range: 5, rangeType: 'melee', save: ['agility', 14], duration: 2, controlType: 'restraint', effects: [{ id: 'leg_pinned', name: 'Leg Pinned', description: 'Speed halved.' }] }),
    dmg({ id: 'scylla_volcanic_steam', name: 'Volcanic-Steam', icon: 'spell_fire_volcano', school: 'ember', desc: 'Vents a scalding cloud of steam.', ap: 2, mana: 15, cd: 2, range: 15, targetingType: 'cone', rangeType: 'self_centered', areaShape: 'cone', areaSize: 15, formula: '3d6', types: ['ember'], save: ['constitution', 14] }),
  ],
  draugr_helmsman: [
    dmg({ id: 'draugr_rotting_anchor', name: 'Rotting-Anchor', icon: 'ability_bossman_smash', school: 'physical', desc: 'Swings a barnacle-crusted anchor.', ap: 2, mana: 0, cd: 0, range: 10, rangeType: 'melee', formula: '2d8 + 3', types: ['physical'] }),
    debuff({ id: 'draugr_sea_salt_curse', name: 'Sea-Salt-Curse', icon: 'spell_shadow_twistedfaith', school: 'blight', desc: 'Fills the victim\'s lungs with saltwater.', ap: 1, mana: 10, cd: 2, range: 15, save: ['spirit', 13], duration: 3, debuffType: 'damageOverTime', effects: [{ id: 'choking', name: 'Choking', description: '1d8 damage per round; lungs full of salt water.' }] }),
    ctrl({ id: 'draugr_frost_bind', name: 'Frost-Bind', icon: 'spell_frost_frozencore', school: 'rime', desc: 'A ranged bolt of binding rime.', ap: 1, mana: 5, cd: 1, range: 30, save: ['agility', 13], duration: 1, controlType: 'restraint', effects: [{ id: 'rooted', name: 'Rooted', description: 'Rooted in place for 1 round.' }] }),
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// REGION 5: CRAGJAW PEAKS
// ═══════════════════════════════════════════════════════════════════════════
const CRAGJAW = {
  kappa_crag: [
    dmg({ id: 'kappa_beak_snap', name: 'Beak-Snap', icon: 'ability_druid_gore', school: 'physical', desc: 'A beak-lunge that drags into the pool.', ap: 2, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d6 + 3', types: ['physical'], save: ['agility', 13], saveOutcome: 'no_effect', controlType: 'restraint', duration: 1, effects: [{ id: 'grappled', name: 'Grappled', description: 'Pulled into the pool.' }] }),
    dmg({ id: 'kappa_river_stone_hurl', name: 'River-Stone-Hurl', icon: 'spell_shaman_stormstrike', school: 'physical', desc: 'Hurls a smooth river-stone.', ap: 1, mana: 0, cd: 0, range: 30, formula: '1d6 + 2', types: ['physical'] }),
    util({ id: 'kappa_cucumber_lure', name: 'Cucumber-Lure', icon: 'spell_nature_regeneration', school: 'primal', desc: 'Can be bribed with a cucumber offering.', ap: 1, mana: 0, cd: 5, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'special', effects: [{ id: 'bribe', name: 'Cucumber-Bribe', description: 'DC 13 CHA to persuade it to move aside.' }] }),
  ],
  kitsune: [
    ctrl({ id: 'kitsune_fox_fire', name: 'Fox-Fire', icon: 'spell_fire_firebolt', school: 'ember', desc: 'Drifting fox-flames that charm.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 20, formula: '1d8', types: ['ember'], save: ['spirit', 13], saveOutcome: 'half_damage', duration: 1, controlType: 'charm', effects: [{ id: 'charmed', name: 'Charmed', description: 'Charmed for 1 round.' }] }),
    util({ id: 'kitsune_shape_shift', name: 'Shape-Shift', icon: 'spell_druid_shapeshift', school: 'arcane', desc: 'Takes the form of any person or animal.', ap: 1, mana: 10, cd: 3, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'transformation', duration: 3, effects: [{ id: 'disguise', name: 'Disguise', description: '+6 to Deception checks.' }] }),
    passive({ id: 'kitsune_nine_tail', name: 'Nine-Tail-Illusions', icon: 'spell_shadow_phantasm', school: 'wyrd', desc: 'Each tail stores an illusion it can deploy.', effects: [{ id: 'illusions', name: 'Nine Illusions', description: 'Can deploy one stored illusion per round.' }] }),
  ],
  tsuchinoko: [
    dmg({ id: 'tsuchinoko_venom_bite', name: 'Venom-Bite', icon: 'spell_nature_nullifypoison', school: 'blight', desc: 'A fang-bite of paralyzing venom.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d6', types: ['physical'], dot: { formula: '1d6', type: 'blight', duration: 3 }, save: ['constitution', 13] }),
    util({ id: 'tsuchinoko_sake_breath', name: 'Sake-Breath', icon: 'spell_shadow_alterhumanform', school: 'blight', desc: 'Belches fumes that intoxicate.', ap: 1, mana: 5, cd: 2, range: 10, targetingType: 'cone', rangeType: 'self_centered', areaShape: 'cone', areaSize: 10, save: ['constitution', 13], duration: 2, utilityType: 'disruption', effects: [{ id: 'intoxicated', name: 'Intoxicated', description: '-2 to all checks for 1 hour.' }] }),
    passive({ id: 'tsuchinoko_discorporate', name: 'Discorporate', icon: 'spell_shadow_fade', school: 'arcane', desc: 'Can discorporate into a thin slithering line.', effects: [{ id: 'thin', name: 'Discorporate', description: 'Fits through any crack; nearly untrackable.' }] }),
  ],
  nopperabo: [
    ctrl({ id: 'nopperabo_blank_gaze', name: 'Blank-Gaze', icon: 'spell_shadow_phantasm', school: 'wyrd', desc: 'A featureless face that erases identity from the mind.', ap: 2, mana: 15, cd: 2, range: 15, save: ['spirit', 14], duration: 2, controlType: 'incapacitation', effects: [{ id: 'identity_loss', name: 'Identity Loss', description: 'Forgets who they are for 2 rounds.' }] }),
    util({ id: 'nopperabo_steal', name: 'Face-Steal', icon: 'spell_shadow_alterhumanform', school: 'arcane', desc: 'Steals a victim\'s likeness.', ap: 1, mana: 10, cd: 3, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'transformation', duration: 3, effects: [{ id: 'steal', name: 'Stolen Face', description: 'Takes the target\'s appearance for 3 rounds.' }] }),
    passive({ id: 'nopperabo_featureless', name: 'Featureless', icon: 'spell_shadow_fade', school: 'wyrd', desc: 'Its blank face unsettles all who see it.', effects: [{ id: 'unsettling', name: 'Featureless', description: 'DC 12 SPI or shaken for 1 round on sight.' }] }),
  ],
  supayoni: [
    dmg({ id: 'oni_club_smash', name: 'Club-Smash', icon: 'ability_bossman_smash', school: 'physical', desc: 'A stunning two-handed club-blow.', ap: 2, mana: 0, cd: 1, range: 5, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'], save: ['constitution', 15], saveOutcome: 'no_effect', controlType: 'stunned', duration: 1, effects: [{ id: 'stunned', name: 'Stunned', description: 'Stunned for 1 round.' }] }),
    dmg({ id: 'oni_mountain_toss', name: 'Mountain-Toss', icon: 'spell_shaman_stormstrike', school: 'physical', desc: 'Hurls a boulder.', ap: 2, mana: 0, cd: 1, range: 40, formula: '3d6 + 5', types: ['physical'] }),
    passive({ id: 'supayoni_rage', name: 'Blizzard-Rage', icon: 'spell_shadow_unbreakablewill', school: 'physical', desc: 'Grows stronger each round of combat.', effects: [{ id: 'rage', name: 'Blizzard-Rage', description: '+2 STR per round of combat.' }] }),
  ],
  jorogumo_span: [
    ctrl({ id: 'jorogumo_web_trap', name: 'Web-Trap', icon: 'spell_nature_stranglevines', school: 'physical', desc: 'Re-weaves a section into sticky web.', ap: 1, mana: 10, cd: 2, range: 15, save: ['agility', 15], duration: 2, controlType: 'restraint', effects: [{ id: 'restrained', name: 'Restrained', description: 'Restrained by web.' }] }),
    dmg({ id: 'jorogumo_needle_fang', name: 'Needle-Fang', icon: 'ability_druid_gore', school: 'physical', desc: 'A venomous bite.', ap: 2, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 4', types: ['physical', 'blight'] }),
    passive({ id: 'jorogumo_gold_silk', name: 'Gold-Silk-Gown', icon: 'spell_holy_silverseal', school: 'arcane', desc: 'A gown woven from gold-silk.', effects: [{ id: 'social', name: 'Gold-Silk', description: '+8 to all social checks.' }] }),
  ],
  kodama: [
    util({ id: 'kodama_voice', name: 'Echo-Voice', icon: 'spell_arcane_arcanetorrent', school: 'arcane', desc: 'Repeats everything it hears with a 7-second delay.', ap: 1, mana: 5, cd: 1, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'communication', effects: [{ id: 'echo', name: 'Echo-Relay', description: 'Bounces sound across entire valleys; 100% reliable.' }] }),
    passive({ id: 'kodama_peak_warden', name: 'Peak-Warden', icon: 'spell_nature_regeneration', school: 'primal', desc: 'Bound to its mountain-Apu; wails when the mountain is harmed.', effects: [{ id: 'warden', name: 'Mountain-Warden', description: 'DC 14 SPI or driven to tears when the mountain is damaged.' }] }),
    passive({ id: 'kodama_quartz_eyes', name: 'Quartz-Eyes', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Sparkles in the dimmest light.', effects: [{ id: 'sparkle', name: 'Quartz-Eyes', description: 'Reveals its position.' }] }),
  ],
  nurikabe_drift: [
    ctrl({ id: 'nurikabe_path_blocker', name: 'Path-Blocker', icon: 'spell_nature_stranglevines', school: 'physical', desc: 'An impassable wall that extends as you climb or flank.', ap: 2, mana: 15, cd: 3, range: 5, save: ['strength', 16], duration: 2, controlType: 'zone', effects: [{ id: 'blocked', name: 'Blocked Path', description: 'Cannot be climbed, flanked, or broken; only a copper staff at the base moves it.' }] }),
    passive({ id: 'nurikabe_living_wall', name: 'Living-Wall', icon: 'spell_druid_camouflage', school: 'primal', desc: 'Looks identical to surrounding rock.', effects: [{ id: 'camouflaged', name: 'Camouflaged Wall', description: 'Indistinguishable from rock.' }] }),
    util({ id: 'nurikabe_night_architect', name: 'Night-Architect', icon: 'spell_arcane_teleportundercity', school: 'arcane', desc: 'Rearranges mountain geography overnight.', ap: 2, mana: 20, cd: 5, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 100, utilityType: 'environment', effects: [{ id: 'rearrange', name: 'Geography Shift', description: 'Paths clear yesterday are blocked today; dead-ends open.' }] }),
  ],
  nue_cloud: [
    ctrl({ id: 'nue_nightmare_cloud', name: 'Nightmare-Cloud', icon: 'spell_shadow_nightmare', school: 'wyrd', desc: 'A cloud of shared overlapping nightmares.', ap: 3, mana: 25, cd: 3, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 40, save: ['spirit', 15], duration: 3, controlType: 'incapacitation', effects: [{ id: 'shared_nightmare', name: 'Shared Nightmare', description: 'Targets experience overlapping visions of their greatest fears for 1d4 rounds.' }] }),
    passive({ id: 'nue_warm_pocket', name: 'Warm-Pocket', icon: 'spell_fire_firebolt', school: 'ember', desc: 'The cloud is warm and humid.', effects: [{ id: 'warm', name: 'Warm-Pocket', description: 'Snow melts within it.' }] }),
    passive({ id: 'nue_black_snow', name: 'Black-Snow', icon: 'spell_shadow_voidshift', school: 'blight', desc: 'Where the cloud touches ground, snow turns black.', effects: [{ id: 'black_snow', name: 'Black-Snow', description: 'Corrupts the ground it touches.' }] }),
  ],
  kasha_snow: [
    dmg({ id: 'kasha_claw_pounce', name: 'Claw-Pounce', icon: 'ability_druid_gore', school: 'physical', desc: 'A flaming pounce of claw and ember.', ap: 2, mana: 0, cd: 1, range: 10, formula: '2d6 + 3', types: ['physical', 'ember'] }),
    passive({ id: 'kasha_flame_fur', name: 'Flame-Fur', icon: 'spell_fire_moltenarmor', school: 'ember', desc: 'Pale blue-white extremely hot fire-fur.', effects: [{ id: 'flame_fur', name: 'Flame-Fur', description: 'Melee attackers take 1d6 fire on contact.' }] }),
    util({ id: 'kasha_corpse_thief', name: 'Corpse-Thief', icon: 'spell_shadow_unsummon', school: 'blight', desc: 'Descends to steal a funeral-body.', ap: 2, mana: 15, cd: 5, range: 30, target: 'any', targetRestrictions: ['any'], utilityType: 'special', effects: [{ id: 'theft', name: 'Corpse-Thief', description: 'Steals a body; the spirit becomes a restless bridge-ghost.' }] }),
  ],
  tanuki_toll: [
    util({ id: 'tanuki_toll_trickster', name: 'Toll-Trickster', icon: 'spell_shadow_mindsteal', school: 'wyrd', desc: 'Demands absurd tolls: a riddle, a song, a story.', ap: 1, mana: 5, cd: 3, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'special', effects: [{ id: 'toll', name: 'Absurd Toll', description: 'Compliance yields a lucky illa-stone; refusal turns gear to leaves.' }] }),
    util({ id: 'tanuki_leaf_hat', name: 'Leaf-Hat', icon: 'spell_shadow_fade', school: 'arcane', desc: 'Gains invisibility for a brief moment.', ap: 1, mana: 5, cd: 2, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'movement', duration: 1, effects: [{ id: 'invisible', name: 'Invisible', description: 'Invisible for 1 round; cannot attack.' }] }),
    debuff({ id: 'tanuki_sake_flask', name: 'Sake-Flask', icon: 'spell_shadow_alterhumanform', school: 'blight', desc: 'Offers sake that intoxicates.', ap: 1, mana: 5, cd: 2, range: 5, target: 'any', targetRestrictions: ['any'], save: ['constitution', 12], duration: 2, debuffType: 'statPenalty', effects: [{ id: 'drunk', name: 'Intoxicated', description: '-2 to all checks for 1 hour.' }] }),
  ],
  ushi_oni_crag: [
    dmg({ id: 'ushi_oni_sulfur_breath', name: 'Sulfur-Breath', icon: 'spell_nature_nullifypoison', school: 'blight', desc: 'A cone of toxic sulfur-gas.', ap: 2, mana: 15, cd: 2, range: 20, targetingType: 'cone', rangeType: 'self_centered', areaShape: 'cone', areaSize: 20, formula: '3d6', types: ['blight'], save: ['constitution', 15], saveOutcome: 'no_effect', duration: 3, debuffType: 'statusEffect', effects: [{ id: 'poisoned', name: 'Poisoned', description: 'Poisoned for 3 rounds.' }] }),
    dmg({ id: 'ushi_oni_bull_head_slam', name: 'Bull-Head-Slam', icon: 'ability_bossman_smash', school: 'physical', desc: 'A bull-head charge.', ap: 2, mana: 0, cd: 1, range: 5, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'], save: ['agility', 14], saveOutcome: 'no_effect', controlType: 'knockdown', duration: 1, effects: [{ id: 'prone', name: 'Knocked Prone', description: 'Knocked prone.' }] }),
    ctrl({ id: 'ushi_oni_obsidian_web', name: 'Obsidian-Web', icon: 'spell_nature_stranglevines', school: 'physical', desc: 'Volcanic-glass silk, invisible in steam.', ap: 1, mana: 10, cd: 2, range: 15, save: ['agility', 15], duration: 2, controlType: 'restraint', effects: [{ id: 'snared', name: 'Snared', description: 'DC 15 AGI to break, or 20 slashing to cut.' }] }),
  ],
  baku_dream: [
    util({ id: 'baku_nightmare_eater', name: 'Nightmare-Eater', icon: 'spell_shadow_twistedfaith', school: 'wyrd', desc: 'Consumes a nightmare, leaving the sleeper refreshed.', ap: 2, mana: 15, cd: 3, range: 5, target: 'ally', targetRestrictions: ['ally'], utilityType: 'cure', effects: [{ id: 'devour', name: 'Devour Nightmare', description: 'Sleeper wakes refreshed; no memory of bad dreams.' }] }),
    buff({ id: 'baku_aura_of_calm', name: 'Aura-of-Calm', icon: 'spell_holy_devotionaura', school: 'divine', desc: 'A 20-ft aura of calm.', ap: 1, mana: 10, cd: 3, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 20, duration: 3, buffType: 'statEnhancement', effects: [{ id: 'calm', name: 'Aura of Calm', description: '+4 to Spirit saves; immune to fear.' }] }),
    passive({ id: 'baku_sacred_huaca', name: 'Sacred-Huaca', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Its claimed area is sacred ground.', effects: [{ id: 'sacred', name: 'Sacred Ground', description: 'No violence, Wyrd-corruption, or supernatural threat can enter.' }] }),
  ],
  nekomata_spur: [
    ctrl({ id: 'nekomata_corpse_puppeteer', name: 'Corpse-Puppeteer', icon: 'spell_shadow_animatedead', school: 'blight', desc: 'Raises frozen dead as jerky puppets.', ap: 3, mana: 20, cd: 3, range: 30, save: ['spirit', 14], duration: 3, controlType: 'mind_control', effects: [{ id: 'raised', name: 'Animated Corpses', description: 'Animates frozen dead; movements synced to its tails.' }] }),
    dmg({ id: 'nekomata_tail_slash', name: 'Tail-Slash', icon: 'ability_druid_gore', school: 'physical', desc: 'A stunning twin-tail slash.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d8 + 3', types: ['physical'], save: ['constitution', 13], saveOutcome: 'no_effect', controlType: 'stunned', duration: 1, effects: [{ id: 'stunned', name: 'Stunned', description: 'Stunned for 1 round.' }] }),
    passive({ id: 'nekomata_twin_tail_lightning', name: 'Twin-Tail-Lightning', icon: 'spell_shaman_lightningbolt', school: 'storm', desc: 'Lightning arcs between tail-tips.', effects: [{ id: 'arcs', name: 'Twin-Tail Arcs', description: 'Each tail-flick can animate a corpse during storms.' }] }),
  ],
  futakuchi_ration: [
    dmg({ id: 'futakuchi_hair_whip', name: 'Hair-Whip', icon: 'spell_nature_stranglevines', school: 'physical', desc: 'The second mouth\'s hair strikes independently.', ap: 1, mana: 0, cd: 0, range: 10, rangeType: 'melee', formula: '1d8 + 3', types: ['physical'] }),
    passive({ id: 'futakuchi_second_mouth', name: 'Second-Mouth', icon: 'spell_shadow_twistedfaith', school: 'wyrd', desc: 'A hidden mouth that speaks the mountain\'s hunger.', effects: [{ id: 'hunger', name: 'Second Mouth', description: 'Speaks the hunger of the mountain itself.' }] }),
    passive({ id: 'futakuchi_ration_devour', name: 'Ration-Devour', icon: 'spell_nature_regeneration', school: 'physical', desc: 'Consumes three times the rations of a normal person.', effects: [{ id: 'devour', name: 'Ration Devourer', description: 'Consumes 3x rations while appearing to eat little.' }] }),
  ],
  wanyudo_pass: [
    ctrl({ id: 'wanyudo_soul_extraction', name: 'Soul-Extraction', icon: 'spell_shadow_soulleech', school: 'blight', desc: 'Those who look directly lose their soul to the wheel.', ap: 3, mana: 30, cd: 3, range: 5, save: ['spirit', 15], duration: 3, controlType: 'incapacitation', effects: [{ id: 'soul_taken', name: 'Soul Extracted', description: 'Body frozen, face locked in horror; soul joins the wheel.' }] }),
    passive({ id: 'wanyudo_cold_fire', name: 'Cold-Fire', icon: 'spell_fire_moltenarmor', school: 'rime', desc: 'Blue-white fire that gives cold, not heat.', effects: [{ id: 'cold_fire', name: 'Cold-Fire', description: 'Melee attackers take 2d6 frost.' }] }),
    passive({ id: 'wanyudo_soul_wheel', name: 'Soul-Wheel', icon: 'spell_shadow_deathfocus', school: 'blight', desc: 'A wheel of compressed flame and screaming faces.', effects: [{ id: 'wheel', name: 'Soul-Wheel', description: 'Appears as a merchant\'s cart from afar.' }] }),
  ],
  tsuchigumo_burrow: [
    dmg({ id: 'tsuchigumo_gemstone_beams', name: 'Gemstone-Beams', icon: 'spell_shaman_lightningbolt', school: 'ember', desc: 'Eight gemstone-eyes fire different elemental beams.', ap: 2, mana: 15, cd: 1, range: 30, formula: '1d6 + 2', types: ['ember', 'primal', 'rime', 'wyrd', 'storm', 'blight'] }),
    dmg({ id: 'tsuchigumo_mandible_clash', name: 'Mandible-Clash', icon: 'ability_druid_gore', school: 'physical', desc: 'Metallic venom-slick mandibles.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 4', types: ['physical'], dot: { formula: '1d4', type: 'blight', duration: 2 }, save: ['constitution', 14] }),
    ctrl({ id: 'tsuchigumo_golden_web', name: 'Golden-Web', icon: 'spell_nature_stranglevines', school: 'physical', desc: 'Gold-silk stronger than cable; crystallizes blood.', ap: 2, mana: 15, cd: 2, range: 15, save: ['constitution', 15], duration: 2, controlType: 'restraint', effects: [{ id: 'crystallizing', name: 'Blood Crystallizing', description: 'Blood slowly crystallizes into metallic compounds.' }] }),
  ],
  akaname: [
    dmg({ id: 'akaname_tongue_lash', name: 'Tongue-Lash', icon: 'spell_nature_stranglevines', school: 'physical', desc: 'A three-foot prehensile tongue.', ap: 1, mana: 0, cd: 0, range: 10, rangeType: 'melee', formula: '1d4 + 2', types: ['physical'] }),
    dmg({ id: 'akaname_cleaning_tool', name: 'Cleaning-Tool-Armament', icon: 'ability_rogue_findweakness', school: 'physical', desc: 'Wields brushes and scrapers as weapons.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d6 + 1', types: ['physical'] }),
    passive({ id: 'akaname_pipeline_cleaner', name: 'Pipeline-Cleaner', icon: 'spell_nature_regeneration', school: 'primal', desc: 'Licks mineral-scale from pipeline walls.', effects: [{ id: 'clean_pipes', name: 'Pipeline Cleaner', description: 'A pipeline it infests flows three times more efficiently.' }] }),
  ],
  inugami_chain: [
    dmg({ id: 'inugami_loyalty_fang', name: 'Loyalty-Fang', icon: 'ability_druid_gore', school: 'rime', desc: 'A spectral cold bite.', ap: 1, mana: 5, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['rime'] }),
    passive({ id: 'inugami_ghost_movement', name: 'Ghost-Movement', icon: 'spell_shadow_fade', school: 'arcane', desc: 'Flickers, appearing to teleport.', effects: [{ id: 'flicker', name: 'Flicker', description: '+8 to evasion.' }] }),
    passive({ id: 'inugami_face_project', name: 'Face-Project', icon: 'spell_shadow_phantasm', school: 'wyrd', desc: 'Projects its face onto reflective surfaces.', effects: [{ id: 'project', name: 'Face-Project', description: 'Watches over multiple locations simultaneously.' }] }),
  ],
  ittan_banner: [
    util({ id: 'ittan_message_bearer', name: 'Message-Bearer', icon: 'spell_arcane_arcanetorrent', school: 'arcane', desc: 'Carries a whisper the length of its fabric.', ap: 1, mana: 5, cd: 2, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'communication', effects: [{ id: 'message', name: 'Whisper-Message', description: 'Cannot be intercepted or forged.' }] }),
    ctrl({ id: 'ittan_smother_sleep', name: 'Smother-Sleep', icon: 'spell_shadow_nightmare', school: 'wyrd', desc: 'Wraps an attacker\'s face, forcing deep sleep.', ap: 2, mana: 10, cd: 3, range: 5, save: ['constitution', 13], duration: 3, controlType: 'incapacitation', effects: [{ id: 'sleeping', name: 'Dreamless Sleep', description: 'Deep sleep for exactly 1 day.' }] }),
    passive({ id: 'ittan_heart_read', name: 'Heart-Read', icon: 'spell_shadow_mindsteal', school: 'wyrd', desc: 'Embroidered patterns rearrange into readable messages.', effects: [{ id: 'heart_read', name: 'Heart-Read', description: 'Patterns reveal the observer\'s deepest concern.' }] }),
  ],
  gaki: [
    dmg({ id: 'gaki_starving_claw', name: 'Starving-Claw', icon: 'ability_druid_gore', school: 'physical', desc: 'A desperate, hunger-driven rake.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d6 + 2', types: ['physical'] }),
    debuff({ id: 'gaki_hunger_aura', name: 'Hunger-Aura', icon: 'spell_shadow_twistedfaith', school: 'wyrd', desc: 'An aura of gnawing, distracting hunger.', ap: 1, mana: 5, cd: 2, range: 10, targetingType: 'area', areaShape: 'circle', areaSize: 10, save: ['spirit', 13], duration: 2, debuffType: 'statPenalty', effects: [{ id: 'distracted_hunger', name: 'Distracted by Hunger', description: '-2 to concentration and attack rolls.' }] }),
    passive({ id: 'gaki_endless_hunger', name: 'Endless-Hunger', icon: 'spell_shadow_devouringplague', school: 'blight', desc: 'Forever starving, never satisfied.', effects: [{ id: 'hunger', name: 'Endless Hunger', description: 'Cannot be satiated; driven to consume.' }] }),
  ],
  kamaitachi: [
    dmg({ id: 'kamaitachi_sickle_cut', name: 'Sickle-Cut', icon: 'ability_rogue_findweakness', school: 'physical', desc: 'A blindingly fast sickle-strike.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 4', types: ['physical'], crit: { mult: 2 } }),
    ctrl({ id: 'kamaitachi_wind_gale', name: 'Wind-Gale', icon: 'spell_shaman_thunderstorm', school: 'physical', desc: 'A mountain-wind blast that knocks foes prone.', ap: 2, mana: 10, cd: 2, range: 30, targetingType: 'cone', rangeType: 'self_centered', areaShape: 'cone', areaSize: 30, formula: '2d6', types: ['physical'], save: ['agility', 13], saveOutcome: 'no_effect', controlType: 'forcedMovement', duration: 0, effects: [{ id: 'pushed', name: 'Pushed Prone', description: 'Knocked prone and pushed 15 ft.', config: { distance: 15, movementType: 'push' } }] }),
    passive({ id: 'kamaitachi_blade_dance', name: 'Blade-Dance', icon: 'ability_rogue_shadowdance', school: 'physical', desc: 'Moves between attacks without provoking.', effects: [{ id: 'dance', name: 'Blade-Dance', description: 'Moves up to 20 ft between attacks without opportunity attacks.' }] }),
  ],
  kcoa: [
    dmg({ id: 'kcoa_lightning_scratch', name: 'Lightning-Scratch', icon: 'spell_shaman_lightningbolt', school: 'storm', desc: 'A crackling storm-charged scratch.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d8 + 3', types: ['physical', 'storm'] }),
    dmg({ id: 'kcoa_hail_rain', name: 'Hail-Rain', icon: 'spell_frost_frostblast', school: 'rime', desc: 'A 15-ft radius of battering hail.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 15, formula: '2d6', types: ['rime'], save: ['agility', 13] }),
    passive({ id: 'kcoa_storm_flight', name: 'Storm-Flight', icon: 'ability_hunter_aspectofthehawk', school: 'storm', desc: 'Rides storm-winds; immune to fall damage.', effects: [{ id: 'flight', name: 'Storm-Flight', description: 'Can hover and fly; immune to fall damage.' }] }),
  ],
  tengu_scout: [
    dmg({ id: 'tengu_wind_copper_strike', name: 'Wind-Copper-Strike', icon: 'ability_rogue_findweakness', school: 'physical', desc: 'A blow that resonates with slowing copper.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d8 + 4', types: ['physical'], save: ['agility', 12], saveOutcome: 'no_effect', duration: 1, debuffType: 'movementImpairment', effects: [{ id: 'slowed', name: 'Slowed', description: 'Slowed by copper resonance.' }] }),
    util({ id: 'tengu_gale_jump', name: 'Gale-Jump', icon: 'ability_rogue_shadowdance', school: 'arcane', desc: 'A reactive 20-ft leap to evade.', ap: 1, mana: 5, cd: 2, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'movement', duration: 1, effects: [{ id: 'evade', name: 'Gale-Evade', description: 'DC 12 AGI to hit it this round.' }] }),
    passive({ id: 'tengu_flight', name: 'Flight', icon: 'ability_hunter_aspectofthehawk', school: 'arcane', desc: 'Can fly on mountain gales.', effects: [{ id: 'fly', name: 'Flight', description: 'Can fly.' }] }),
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// REGION 6: SUNDRIFT VALE
// ═══════════════════════════════════════════════════════════════════════════
const SUNDRIFT = {
  almas: [
    dmg({ id: 'almas_root_club', name: 'Root-Club', icon: 'ability_bossman_smash', school: 'physical', desc: 'A swing of a gnarled root-club.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['physical'] }),
    util({ id: 'almas_silent_witness', name: 'Silent-Witness', icon: 'spell_arcane_tormentoftheweak', school: 'arcane', desc: 'Remembers the steppe\'s history for centuries.', ap: 1, mana: 10, cd: 5, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'divination', effects: [{ id: 'history', name: 'Steppe-History', description: 'Identifies any creature or event on the steppe (DC 14 History).' }] }),
    passive({ id: 'almas_snowshoe_feet', name: 'Snowshoe-Feet', icon: 'spell_nature_regeneration', school: 'primal', desc: 'Crosses soft steppe-soil without sinking.', effects: [{ id: 'snowshoe', name: 'Snowshoe-Feet', description: 'Ignores soft-soil difficult terrain.' }] }),
  ],
  tulpar: [
    dmg({ id: 'tulpar_starry_cantrip', name: 'Starry-Cantrip', icon: 'spell_holy_radiance', school: 'divine', desc: 'A bolt of constellation-light.', ap: 1, mana: 5, cd: 0, range: 40, formula: '1d8', types: ['divine'] }),
    buff({ id: 'tulpar_sky_memory', name: 'Sky-Memory', icon: 'spell_holy_aurabrilliance', school: 'arcane', desc: 'Its scale-patterns hold the lost constellation-map.', ap: 1, mana: 15, cd: 5, range: 5, target: 'ally', targetRestrictions: ['ally'], duration: 3, buffType: 'empowerment', effects: [{ id: 'celestial', name: 'Celestial Knowledge', description: 'Absorb celestial knowledge from its scales.' }] }),
    passive({ id: 'tulpar_impossible_capture', name: 'Impossible-Capture', icon: 'ability_hunter_beastmastery', school: 'arcane', desc: 'Dissolves into starlight when bridled.', effects: [{ id: 'wild', name: 'Impossible-Capture', description: 'Cannot be tamed; dissolves into starlight.' }] }),
  ],
  erlik: [
    dmg({ id: 'erlik_bone_strike', name: 'Bone-Strike', icon: 'ability_bossman_smash', school: 'physical', desc: 'A blow that presses the weight of unpaid debts.', ap: 2, mana: 10, cd: 1, range: 5, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'], dot: { formula: '2d6', type: 'wyrd', duration: 3 }, save: ['spirit', 15], saveOutcome: 'no_effect' }),
    ctrl({ id: 'erlik_soul_judgment', name: 'Soul-Judgment', icon: 'spell_shadow_deathfocus', school: 'wyrd', desc: 'Presides over the Ancestor-Mounds, judging the dead.', ap: 3, mana: 30, cd: 5, range: 30, save: ['spirit', 18], duration: 3, controlType: 'incapacitation', effects: [{ id: 'judged', name: 'Judged', description: 'Soul weighed for unfulfilled promises and broken oaths.' }] }),
    passive({ id: 'erlik_half_alive', name: 'Half-Alive', icon: 'spell_holy_devotionaura', school: 'blight', desc: 'Half-flesh, half-skeleton.', effects: [{ id: 'dual', name: 'Dual-Voice', description: 'Speaks from living and dead halves simultaneously.' }] }),
  ],
  burkhan_wind: [
    buff({ id: 'burkhan_sacred_circle', name: 'Sacred-Circle', icon: 'spell_holy_devotionaura', school: 'divine', desc: 'Its presence makes the surrounding land fertile.', ap: 2, mana: 20, cd: 5, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 60, duration: 6, buffType: 'auraEffect', effects: [{ id: 'fertile', name: 'Fertile Circle', description: 'Grass grows taller, herds are healthier, water stays pure.' }] }),
    util({ id: 'burkhan_wind_petition', name: 'Wind-Petition', icon: 'spell_shaman_thunderstorm', school: 'arcane', desc: 'Petitioned for favorable weather by throat-singing.', ap: 2, mana: 15, cd: 5, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'environment', effects: [{ id: 'weather', name: 'Weather-Petition', description: 'Calms or raises the weather; offering acceptance multiplies a scarf threefold.' }] }),
    passive({ id: 'burkhan_sacred', name: 'Sacred-Presence', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Attacking it invites cosmic retribution.', effects: [{ id: 'curse', name: 'Sacred-Curse', description: 'Any who damage it must DC 18 SPI or suffer a curse of bad luck for 1 year.' }] }),
  ],
  nian: [
    dmg({ id: 'nian_horn_gore', name: 'Horn-Gore', icon: 'ability_druid_gore', school: 'physical', desc: 'A burning horn-gore.', ap: 2, mana: 0, cd: 1, range: 5, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'], dot: { formula: '1d6', type: 'ember', duration: 3 }, save: ['constitution', 14], saveOutcome: 'no_effect' }),
    dmg({ id: 'nian_charge', name: 'Stampede-Charge', icon: 'ability_druid_thrash', school: 'physical', desc: 'A herd-line charge that tramples all in its path.', ap: 3, mana: 10, cd: 2, range: 30, targetingType: 'line', areaShape: 'line', areaSize: 30, formula: '3d6', types: ['physical'], save: ['agility', 15], saveOutcome: 'no_effect', controlType: 'knockdown', duration: 1, effects: [{ id: 'trampled', name: 'Trampled', description: 'Trampled by the herd.' }] }),
    passive({ id: 'nian_red_terror', name: 'Red-Terror', icon: 'spell_shadow_fright', school: 'wyrd', desc: 'Repelled by loud noise, the color red, and fire.', effects: [{ id: 'terror', name: 'Red-Terror', description: 'Attracted then repelled by red; frightened by loud noise and fire.' }] }),
  ],
  jiangshi: [
    dmg({ id: 'jiangshi_qi_drain', name: 'Qi-Drain', icon: 'spell_shadow_lifedrain', school: 'blight', desc: 'A draining touch that saps life-force.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['blight'], save: ['constitution', 13], saveOutcome: 'half_damage', debuffType: 'statPenalty', duration: 3, effects: [{ id: 'con_loss', name: 'Constitution Loss', description: 'Loses 1d4 CON for 24 hours.' }] }),
    util({ id: 'jiangshi_talisman_control', name: 'Talisman-Control', icon: 'spell_shadow_alterhumanform', school: 'arcane', desc: 'A paper talisman redirects the Jiangshi.', ap: 1, mana: 5, cd: 5, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'special', effects: [{ id: 'redirect', name: 'Redirect the Dead', description: 'A new talisman with the correct ancestor-name redirects it.' }] }),
    passive({ id: 'jiangshi_rigor_freeze', name: 'Rigor-Freeze', icon: 'spell_frost_frozencore', school: 'physical', desc: 'Frozen stiff in rigid posture.', effects: [{ id: 'rigid', name: 'Rigor-Freeze', description: 'Immune to grapple, prone, and knockback.' }] }),
  ],
  taotie_gorge: [
    dmg({ id: 'taotie_spiral_teeth', name: 'Spiral-Teeth', icon: 'ability_druid_gore', school: 'physical', desc: 'Concentric rings of flesh-stripping teeth.', ap: 2, mana: 0, cd: 1, range: 10, rangeType: 'melee', formula: '3d8 + 5', types: ['physical'] }),
    ctrl({ id: 'taotie_pit_trap', name: 'Pit-Trap', icon: 'spell_nature_earthquake', school: 'physical', desc: 'A buried maw that swallows the unwary.', ap: 2, mana: 15, cd: 3, range: 10, save: ['agility', 16], duration: 2, controlType: 'restraint', effects: [{ id: 'swallowed', name: 'Swallowed', description: 'Plunges into the buried maw.' }] }),
    passive({ id: 'taotie_no_eyes', name: 'No-Eyes', icon: 'spell_shadow_fade', school: 'physical', desc: 'Hunts by smell and vibration; cannot be flanked.', effects: [{ id: 'blind_hunter', name: 'Blind-Hunter', description: 'Invisible to scrying; cannot be flanked.' }] }),
  ],
  baize: [
    dmg({ id: 'bai_ze_nine_eye_gaze', name: 'Nine-Eye-Gaze', icon: 'spell_holy_radiance', school: 'divine', desc: 'Each of its nine eyes fires a different colored beam.', ap: 2, mana: 15, cd: 1, range: 30, formula: '1d6', types: ['divine', 'ember', 'rime', 'storm', 'primal'] }),
    util({ id: 'bai_ze_living_bestiary', name: 'Living-Bestiary', icon: 'spell_arcane_tormentoftheweak', school: 'arcane', desc: 'Knows every creature and its weaknesses.', ap: 1, mana: 10, cd: 5, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'divination', effects: [{ id: 'bestiary', name: 'Living-Bestiary', description: 'Answers one creature-related question accurately (DC 14 Nature).' }] }),
    passive({ id: 'baize_appear', name: 'Omen-Appear', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Appears only before major events.', effects: [{ id: 'omen', name: 'Omen-Appear', description: 'Nine eyes encode the event\'s nature and severity.' }] }),
  ],
  zilant_wing: [
    dmg({ id: 'zilant_beak_slam', name: 'Beak-Slam', icon: 'ability_druid_gore', school: 'physical', desc: 'A piercing beak-strike.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['physical'] }),
    passive({ id: 'zilant_wing_song', name: 'Wing-Song', icon: 'spell_arcane_arcanetorrent', school: 'arcane', desc: 'Wind through wing-veins produces a resonant tone.', effects: [{ id: 'navigate', name: 'Wing-Song Navigation', description: 'Unique pitch per territory allows navigation by ear.' }] }),
    passive({ id: 'zilant_forked_tongue', name: 'Forked-Tongue', icon: 'ability_hunter_aspectofthehawk', school: 'primal', desc: 'Tastes the air for 200 ft.', effects: [{ id: 'scent', name: 'Forked-Tongue', description: 'Detects all creatures within 200 ft.' }] }),
  ],
  susulu_spring: [
    heal({ id: 'susulus_healing_spring', name: 'Healing-Spring', icon: 'spell_holy_heal', school: 'divine', desc: 'Spring water mends wounds.', ap: 2, mana: 20, cd: 3, range: 5, target: 'ally', targetRestrictions: ['ally'], formula: '3d8 + 4' }),
    debuff({ id: 'susulus_chilling_mist', name: 'Chilling-Mist', icon: 'spell_frost_frostblast', school: 'rime', desc: 'A cloying, slowing mist.', ap: 1, mana: 10, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 20, save: ['agility', 13], duration: 2, debuffType: 'movementImpairment', effects: [{ id: 'slowed', name: 'Slowed', description: 'Speed halved.' }] }),
    passive({ id: 'susulus_pure_source', name: 'Pure-Source', icon: 'spell_holy_heal', school: 'divine', desc: 'Its waters are eternally pure.', effects: [{ id: 'pure', name: 'Pure-Source', description: 'Water it tends cures disease on contact.' }] }),
  ],
  dijiang_chaos: [
    dmg({ id: 'dijiang_chaos_burst', name: 'Chaos-Burst', icon: 'spell_shadow_unleasheddread', school: 'wyrd', desc: 'A roiling burst of pure chaos.', ap: 2, mana: 20, cd: 2, range: 30, formula: '3d6', types: ['wyrd'], save: ['spirit', 15] }),
    ctrl({ id: 'dijiang_confusing_drum', name: 'Confusing-Drum', icon: 'spell_shadow_twistedfaith', school: 'wyrd', desc: 'Its single eye and six-leg drumming disorient.', ap: 1, mana: 10, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 20, save: ['spirit', 14], duration: 2, controlType: 'mind_control', effects: [{ id: 'confused', name: 'Confused', description: 'Confused for 2 rounds.' }] }),
    passive({ id: 'dijiang_faceless', name: 'Faceless', icon: 'spell_shadow_phantasm', school: 'wyrd', desc: 'No face, only a single glaring eye.', effects: [{ id: 'faceless', name: 'Faceless', description: 'Immune to charm and fear.' }] }),
  ],
  fenghuang_migrate: [
    heal({ id: 'fenghuang_radiant_renewal', name: 'Radiant-Renewal', icon: 'spell_holy_heal', school: 'divine', desc: 'A song that renews body and spirit.', ap: 2, mana: 25, cd: 4, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 30, formula: '4d8', healingType: 'regeneration', target: 'ally' }),
    buff({ id: 'fenghuang_emperors_aura', name: 'Emperor\'s-Aura', icon: 'spell_holy_devotionaura', school: 'divine', desc: 'An aura of peace and right-rule.', ap: 2, mana: 20, cd: 5, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 60, duration: 3, buffType: 'auraEffect', effects: [{ id: 'peace', name: 'Aura of Peace', description: 'Allies within gain +2 to all saves.' }] }),
    passive({ id: 'fenghuang_auspicious', name: 'Auspicious-Presence', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Its arrival heralds prosperity.', effects: [{ id: 'auspicious', name: 'Auspicious', description: 'Its presence brings good fortune to the land.' }] }),
  ],
  qiongqi_scourge: [
    dmg({ id: 'qiongqi_wing_rake', name: 'Wing-Rake', icon: 'ability_hunter_aspectofthehawk', school: 'physical', desc: 'A raking wing-claw.', ap: 1, mana: 0, cd: 0, range: 10, rangeType: 'melee', formula: '2d6 + 4', types: ['physical'] }),
    debuff({ id: 'qiongqi_scourge_howl', name: 'Scourge-Howl', icon: 'spell_shadow_fright', school: 'wyrd', desc: 'A howl that strips courage.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 30, save: ['spirit', 14], duration: 2, debuffType: 'statusEffect', effects: [{ id: 'frightened', name: 'Frightened', description: 'Frightened for 2 rounds.' }] }),
    passive({ id: 'qiongqi_predator', name: 'Predator-Sense', icon: 'ability_hunter_aspectofthehawk', school: 'physical', desc: 'Senses the weakest prey.', effects: [{ id: 'predator', name: 'Predator-Sense', description: 'Always targets the lowest-HP foe.' }] }),
  ],
  zhenniao_toxin: [
    dmg({ id: 'zhenniao_venom_spite', name: 'Venom-Spit', icon: 'spell_nature_nullifypoison', school: 'blight', desc: 'Hawks a glob of lethal venom.', ap: 2, mana: 10, cd: 1, range: 30, formula: '2d8', types: ['blight'], dot: { formula: '1d8', type: 'blight', duration: 3 }, save: ['constitution', 15] }),
    debuff({ id: 'zhenniao_toxic_aura', name: 'Toxic-Aura', icon: 'spell_shadow_deathanddecay', school: 'blight', desc: 'A foul aura of corruption.', ap: 1, mana: 5, cd: 2, range: 10, targetingType: 'area', areaShape: 'circle', areaSize: 10, save: ['constitution', 14], duration: 2, debuffType: 'disease', effects: [{ id: 'sickened', name: 'Sickened', description: '-2 to all rolls while within the aura.' }] }),
    passive({ id: 'zhenniao_poison_blood', name: 'Poison-Blood', icon: 'spell_nature_nullifypoison', school: 'blight', desc: 'Its very blood is toxic.', effects: [{ id: 'poison_blood', name: 'Poison-Blood', description: 'Melee attackers take 1d6 poison on contact.' }] }),
  ],
  ubagan_crystal: [
    ctrl({ id: 'ubagan_mud_grasp', name: 'Mud-Grasp', icon: 'spell_nature_entanglement', school: 'physical', desc: 'A grasping fist of mud.', ap: 1, mana: 5, cd: 1, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['physical'], save: ['agility', 13], saveOutcome: 'no_effect', controlType: 'restraint', duration: 2, effects: [{ id: 'grappled', name: 'Grappled', description: 'Grappled in mud.' }] }),
    util({ id: 'ubagan_water_breaker', name: 'Water-Breaker', icon: 'spell_frost_frostbolt', school: 'rime', desc: 'Breaks underground water-channels, redirecting aquifers.', ap: 3, mana: 30, cd: 5, range: 30, utilityType: 'environment', effects: [{ id: 'break', name: 'Break Aquifer', description: 'Redirects entire aquifers; can destroy a clan\'s water-supply.' }] }),
    passive({ id: 'ubagan_mud_burrow', name: 'Mud-Burrow', icon: 'spell_druid_camouflage', school: 'primal', desc: 'Submerges into mud for full cover.', effects: [{ id: 'burrow', name: 'Mud-Burrow', description: 'Can submerge as a bonus action.' }] }),
  ],
  qoraigarash: [
    dmg({ id: 'qorai_dragon_bite', name: 'Dragon-Bite', icon: 'ability_druid_gore', school: 'physical', desc: 'A coiled dragon-bite.', ap: 2, mana: 0, cd: 1, range: 5, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'] }),
    ctrl({ id: 'qorai_storm_raise', name: 'Storm-Raise', icon: 'spell_shaman_thunderstorm', school: 'storm', desc: 'Coils through the lake, generating a localized storm.', ap: 3, mana: 25, cd: 3, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 100, formula: '3d6', types: ['storm'], save: ['constitution', 15], duration: 2, controlType: 'zone', effects: [{ id: 'storm', name: 'Lake Storm', description: 'Floods a valley or drains a lake in hours.' }] }),
    passive({ id: 'qorai_gemstone_scales', name: 'Gemstone-Scales', icon: 'spell_holy_silverseal', school: 'arcane', desc: 'Semi-precious stones cover its hide.', effects: [{ id: 'scales', name: 'Gemstone-Scales', description: 'Fascinated by polished copper mirrors; lowers HP by 20 per round staring.' }] }),
  ],
  ajina: [
    dmg({ id: 'ajina_entropy_wounds', name: 'Entropy-Wounds', icon: 'spell_shadow_lifedrain', school: 'blight', desc: 'Wounds that fester with entropy.', ap: 1, mana: 5, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['blight'], dot: { formula: '1d6', type: 'blight', duration: 3 } }),
    debuff({ id: 'ajina_independent_mouths', name: 'Independent-Mouths', icon: 'spell_shadow_twistedfaith', school: 'wyrd', desc: 'Whispering mouths confuse the target.', ap: 1, mana: 10, cd: 2, range: 20, save: ['spirit', 13], duration: 1, debuffType: 'statusEffect', effects: [{ id: 'confused', name: 'Confused', description: 'Confused for 1 round.' }] }),
    passive({ id: 'ajina_stalker', name: 'Shadow-Stalker', icon: 'spell_shadow_fade', school: 'blight', school2: 'blight', desc: 'Perpetually half-dissolved into shadow.', effects: [{ id: 'blight', name: 'Shadow-Stalker', description: 'Invisible in darkness; absorbs light.' }] }),
  ],
  lu_wu_mountain: [
    dmg({ id: 'luwu_tiger_claw', name: 'Tiger-Claw', icon: 'ability_bossman_smash', school: 'physical', desc: 'A colossal tiger-paw strike.', ap: 2, mana: 0, cd: 1, range: 5, rangeType: 'melee', formula: '3d8 + 6', types: ['physical'] }),
    ctrl({ id: 'luwu_season_controller', name: 'Season-Controller', icon: 'spell_shaman_thunderstorm', school: 'primal', desc: 'A head turns to unleash a micro-season on the region.', ap: 3, mana: 40, cd: 5, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 100, save: ['constitution', 16], duration: 3, controlType: 'zone', effects: [{ id: 'season', name: 'Micro-Season', description: 'Brings rain, drought, snow, heat, frost, or decay.' }] }),
    passive({ id: 'luwu_nine_heads', name: 'Nine-Heads', icon: 'spell_holy_devotionaura', school: 'primal', desc: 'Nine heads, each a different aspect.', effects: [{ id: 'nine', name: 'Nine-Heads', description: 'Each head must be individually targeted to defeat it.' }] }),
  ],
  bura_stormkin: [
    util({ id: 'bura_shelter_disassembly', name: 'Shelter-Disassembly', icon: 'spell_shaman_thunderstorm', school: 'physical', desc: 'Dismantles structures with surgical precision.', ap: 2, mana: 15, cd: 3, range: 15, target: 'any', targetRestrictions: ['any'], utilityType: 'environment', effects: [{ id: 'dismantle', name: 'Dismantle Shelter', description: 'Disassembles a yurt in 30 seconds.' }] }),
    dmg({ id: 'bura_wind_strike', icon: 'spell_shaman_lightningbolt', school: 'storm', name: 'Wind-Strike', desc: 'A compressed-air strike.', ap: 1, mana: 5, cd: 0, range: 10, formula: '2d6 + 3', types: ['physical'] }),
    passive({ id: 'bura_wind_body', name: 'Wind-Body', icon: 'spell_shaman_thunderstorm', school: 'physical', desc: 'A living tornado; no solid body.', effects: [{ id: 'wind_body', name: 'Wind-Body', description: 'Immune to piercing and slashing.' }] }),
  ],
  tengri_spark: [
    buff({ id: 'tengri_hope_restore', name: 'Hope-Restore', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Its glow restores will to survive.', ap: 2, mana: 25, cd: 4, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 30, duration: 6, buffType: 'statEnhancement', effects: [{ id: 'hope', name: 'Hope-Restore', description: '+2 to all saves and 10 temporary HP for 24 hours.' }], statModifier: { stat: 'all_rolls', magnitude: 2, magnitudeType: 'flat' } }),
    passive({ id: 'tengri_star_light', name: 'Star-Light', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Glows with the only reliable light in the starless sky.', effects: [{ id: 'star', name: 'Star-Light', description: 'Visible from across the steppe.' }] }),
    passive({ id: 'tengri_fate_thread', name: 'Fate-Thread', icon: 'spell_arcane_tormentoftheweak', school: 'arcane', desc: 'A silk-thread trails from its back, connecting to absent stars.', effects: [{ id: 'thread', name: 'Fate-Thread', description: 'Following the thread reveals the observer\'s destiny.' }] }),
  ],
  mogwai: [
    dmg({ id: 'mogwai_shadow_swipe', icon: 'ability_rogue_findweakness', school: 'physical', name: 'Shadow-Swipe', desc: 'A quick swipe of shadowy claws.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d6 + 2', types: ['physical'] }),
    debuff({ id: 'mogwai_gremlin_curse', icon: 'spell_shadow_twistedfaith', school: 'wyrd', name: 'Gremlin-Curse', desc: 'A mischievous curse that sabotages devices.', ap: 1, mana: 10, cd: 3, range: 15, save: ['spirit', 13], duration: 3, debuffType: 'abilityDisable', effects: [{ id: 'sabotage', name: 'Gremlin-Curse', description: 'Mechanical devices and tools malfunction.' }] }),
    util({ id: 'mogwai_multiplication', icon: 'spell_shadow_animatedead', school: 'arcane', name: 'Multiplication', desc: 'Splits into more of itself when wet.', ap: 2, mana: 20, cd: 5, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'special', effects: [{ id: 'split', name: 'Multiply', description: 'Splits into additional copies when exposed to water.' }] }),
  ],
  olgoi_khorkhoi: [
    dmg({ id: 'olgoi_acid_spit', name: 'Acid-Spit', icon: 'spell_nature_nullifypoison', school: 'blight', desc: 'Hawks corrosive acid that eats armor.', ap: 2, mana: 10, cd: 1, range: 30, formula: '2d6', types: ['blight'], save: ['constitution', 13], saveOutcome: 'no_effect', duration: 2, debuffType: 'statPenalty', effects: [{ id: 'corroded', name: 'Armor Corroded', description: 'Target\'s armor is corroded.' }] }),
    dmg({ id: 'olgoi_electrical_discharge', name: 'Electrical-Discharge', icon: 'spell_shaman_lightningbolt', school: 'storm', desc: 'A crackling AoE shock.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 10, formula: '2d8', types: ['storm'], save: ['agility', 13] }),
    passive({ id: 'olgoi_sand_burrow', name: 'Sand-Burrow', icon: 'spell_druid_camouflage', school: 'physical', desc: 'Burrows through sand with ease.', effects: [{ id: 'burrow', name: 'Sand-Burrow', description: 'Gains full cover by submerging in sand.' }] }),
  ],
  yalbagan: [
    dmg({ id: 'yalbagan_triple_strike', name: 'Triple-Strike', icon: 'ability_druid_gore', school: 'physical', desc: 'All three heads strike at once.', ap: 3, mana: 10, cd: 1, range: 10, rangeType: 'melee', formula: '1d10 + 4', types: ['physical'] }),
    dmg({ id: 'yalbagan_poison_bite', name: 'Poison-Bite', icon: 'spell_nature_nullifypoison', school: 'blight', desc: 'A venomous multi-head bite.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d10 + 4', types: ['physical'], dot: { formula: '1d6', type: 'blight', duration: 3 }, save: ['constitution', 13] }),
    passive({ id: 'yalbagan_grass_mimic', name: 'Grass-Mimic', icon: 'spell_druid_camouflage', school: 'primal', desc: 'Blends perfectly with the steppe-grass.', effects: [{ id: 'mimic', name: 'Grass-Mimic', description: '+6 to stealth in tall grass.' }] }),
  ],
  qilin: [
    util({ id: 'qilin_starry_path', name: 'Starry-Path', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Creates a glowing lane of starlight for allies.', ap: 2, mana: 20, cd: 3, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'line', areaSize: 20, duration: 3, utilityType: 'movement', effects: [{ id: 'lane', name: 'Starry Path', description: 'Allies +10 speed and advantage on saves.' }] }),
    dmg({ id: 'qilin_solar_horn', name: 'Solar-Horn', icon: 'spell_fire_firebolt', school: 'ember', desc: 'A beam of solar fire from its horn.', ap: 1, mana: 5, cd: 0, range: 30, formula: '2d8', types: ['ember'] }),
    passive({ id: 'qilin_evasion', name: 'Evasion', icon: 'ability_rogue_shadowdance', school: 'arcane', desc: 'Ignores opportunity attacks.', effects: [{ id: 'evasion', name: 'Celestial Evasion', description: 'Ignores opportunity attacks.' }] }),
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// REGION 7: THE BRYNGLOOM FOREST + REMAINING ORIGINAL BESTIARY
// ═══════════════════════════════════════════════════════════════════════════
const BRYNGLOOM = {
  leshara: [
    ctrl({ id: 'leshy_forest_command', name: 'Forest-Command', icon: 'spell_nature_stranglevines', school: 'primal', desc: 'Commands trees to shift, grow, or attack.', ap: 3, mana: 25, cd: 3, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 100, save: ['agility', 15], duration: 2, controlType: 'restraint', effects: [{ id: 'rooted', name: 'Rooted', description: 'Roots and branches entangle intruders.' }] }),
    dmg({ id: 'leshy_timber_strike', name: 'Timber-Strike', icon: 'ability_bossman_smash', school: 'physical', desc: 'Strikes with the force of a falling tree.', ap: 2, mana: 0, cd: 1, range: 10, rangeType: 'melee', formula: '2d8 + 5', types: ['physical'] }),
    passive({ id: 'leshy_woodland_authority', name: 'Woodland-Authority', icon: 'spell_druid_camouflage', school: 'primal', desc: 'Lord of the wood; impossible to track in his forest.', effects: [{ id: 'authority', name: 'Woodland-Authority', description: 'Cannot be tracked in forest terrain.' }] }),
  ],
  rusalka: [
    ctrl({ id: 'rusalka_drowning_song', name: 'Drowning-Song', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'A keening song that drags victims into the bog.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 40, save: ['spirit', 14], duration: 2, controlType: 'charm', effects: [{ id: 'compelled', name: 'Compelled', description: 'Compelled into the water.' }] }),
    dmg({ id: 'rusalka_cold_embrace', name: 'Cold-Embrace', icon: 'spell_frost_frozencore', school: 'rime', desc: 'A freezing, drowning grasp.', ap: 1, mana: 5, cd: 1, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['rime'], save: ['strength', 14], saveOutcome: 'no_effect', controlType: 'restraint', duration: 2, effects: [{ id: 'grappled', name: 'Grappled', description: 'Grappled and drowned.' }] }),
    passive({ id: 'rusalka_water_form', name: 'Water-Form', icon: 'spell_frost_frostarmor', school: 'rime', desc: 'Dissolves into the bog-water.', effects: [{ id: 'water_form', name: 'Water-Form', description: 'Can become indistinguishable from water.' }] }),
  ],
  strigoi_canopy: [
    heal({ id: 'strigoi_blood_drain', name: 'Blood-Drain', icon: 'spell_shadow_lifedrain', school: 'blight', desc: 'Drains blood to mend its undead flesh.', ap: 2, mana: 10, cd: 1, range: 5, rangeType: 'melee', formula: '2d6 + 4', vampiric: { formula: '2d6 + 4', type: 'blight' } }),
    debuff({ id: 'strigoi_fever_touch', name: 'Fever-Touch', icon: 'spell_shadow_twistedfaith', school: 'blight', desc: 'A touch that spreads wasting fever.', ap: 1, mana: 10, cd: 2, range: 5, rangeType: 'melee', save: ['constitution', 14], duration: 3, debuffType: 'disease', effects: [{ id: 'wasting', name: 'Wasting Fever', description: 'Gain 1 level of exhaustion.' }] }),
    passive({ id: 'strigoi_undead_resilience', name: 'Undead-Resilience', icon: 'spell_holy_devotionaura', school: 'blight', desc: 'Undead flesh resists mortal ailments.', effects: [{ id: 'resilience', name: 'Undead-Resilience', description: 'Immune to disease and poison.' }] }),
  ],
  domovoi: [
    buff({ id: 'domovoi_hearth_blessing', name: 'Hearth-Blessing', icon: 'spell_holy_devotionaura', school: 'divine', desc: 'Blesses a household that honors its threshold.', ap: 2, mana: 15, cd: 4, range: 5, target: 'ally', targetRestrictions: ['ally'], duration: 3, buffType: 'statEnhancement', effects: [{ id: 'hearth', name: 'Hearth-Blessing', description: '+2 to all rolls while in the blessed home.' }] }),
    debuff({ id: 'domovoi_poltergeist', name: 'Poltergeist-Tantrum', icon: 'spell_shadow_twistedfaith', school: 'physical', desc: 'Hurls household objects at the disrespectful.', ap: 1, mana: 10, cd: 2, range: 15, formula: '2d6', types: ['physical'], save: ['agility', 13], duration: 2, debuffType: 'statusEffect', effects: [{ id: 'battered', name: 'Battered', description: 'Pelted by flying objects.' }] }),
    passive({ id: 'domovoi_ward', name: 'Threshold-Ward', icon: 'spell_holy_devotionaura', school: 'divine', desc: 'Wards the home against ill intent.', effects: [{ id: 'ward', name: 'Threshold-Ward', description: 'No creature of evil intent may cross a threshold it guards.' }] }),
  ],
  kikimora: [
    ctrl({ id: 'kikimora_tangle_web', name: 'Tangle-Web', icon: 'spell_nature_stranglevines', school: 'physical', desc: 'Spreads trip-webs across the floor.', ap: 2, mana: 10, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 20, save: ['agility', 14], duration: 2, controlType: 'restraint', effects: [{ id: 'tangled', name: 'Tangled', description: 'Tangled in invisible webbing.' }] }),
    debuff({ id: 'kikimora_mischief', name: 'Mischief-Curse', icon: 'spell_shadow_twistedfaith', school: 'wyrd', desc: 'A curse of petty misfortune.', ap: 1, mana: 5, cd: 2, range: 15, save: ['spirit', 13], duration: 3, debuffType: 'statPenalty', effects: [{ id: 'clumsy', name: 'Clumsy', description: '-2 to all Dexterity checks.' }] }),
    passive({ id: 'kikimora_spinning', name: 'Endless-Spinning', icon: 'spell_nature_stranglevines', school: 'primal', desc: 'Spins webs throughout the home.', effects: [{ id: 'spin', name: 'Endless-Spinning', description: 'A home it infests becomes a labyrinth of web.' }] }),
  ],
  zmey_bog: [
    dmg({ id: 'zmey_fire_breath', name: 'Fire-Breath', icon: 'spell_fire_fireball', school: 'ember', desc: 'A three-headed gout of bog-fire.', ap: 3, mana: 20, cd: 2, range: 30, targetingType: 'cone', rangeType: 'self_centered', areaShape: 'cone', areaSize: 30, formula: '4d6', types: ['ember'], save: ['agility', 16] }),
    dmg({ id: 'zmey_triple_bite', name: 'Triple-Bite', icon: 'ability_druid_gore', school: 'physical', desc: 'All three heads bite at once.', ap: 2, mana: 0, cd: 0, range: 10, rangeType: 'melee', formula: '2d8 + 4', types: ['physical'] }),
    passive({ id: 'zmey_serpentine_hide', name: 'Serpentine-Hide', icon: 'spell_fire_moltenarmor', school: 'physical', desc: 'Thick scales turn aside blows.', effects: [{ id: 'hide', name: 'Serpentine-Hide', description: 'Resistant to physical damage.' }] }),
  ],
  zharptitsa_glow: [
    heal({ id: 'zharptitsa_warmth', name: 'Warmth-of-the-Bird', icon: 'spell_holy_heal', school: 'ember', desc: 'A song of warmth and light that mends allies.', ap: 2, mana: 20, cd: 3, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 30, formula: '3d8', healingType: 'regeneration', target: 'ally' }),
    dmg({ id: 'zharptitsa_radiant_plumage', name: 'Radiant-Plumage', icon: 'spell_holy_radiance', school: 'ember', desc: 'Flares blinding plumage.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 20, formula: '2d8', types: ['ember', 'divine'], save: ['constitution', 14], saveOutcome: 'no_effect', controlType: 'incapacitated', duration: 1, effects: [{ id: 'blinded', name: 'Blinded', description: 'Blinded for 1 round.' }] }),
    passive({ id: 'zharptitsa_eternal_flame', name: 'Eternal-Flame', icon: 'spell_fire_firecore', school: 'ember', desc: 'Its feathers burn without consuming.', effects: [{ id: 'flame', name: 'Eternal-Flame', description: 'Illuminates and warms a wide area.' }] }),
  ],
  naga_root: [
    dmg({ id: 'naga_venom_spit', name: 'Venom-Spit', icon: 'spell_nature_nullifypoison', school: 'blight', desc: 'Spits a jet of paralyzing venom.', ap: 1, mana: 5, cd: 0, range: 30, formula: '2d6', types: ['blight'], save: ['constitution', 14], saveOutcome: 'no_effect', controlType: 'stunned', duration: 1, effects: [{ id: 'paralyzed', name: 'Paralyzed', description: 'Paralyzed for 1 round.' }] }),
    ctrl({ id: 'naga_coil_crush', name: 'Coil-Crush', icon: 'spell_nature_stranglevines', school: 'physical', desc: 'Constricts a grappled victim.', ap: 2, mana: 0, cd: 1, range: 5, rangeType: 'melee', formula: '2d8 + 4', types: ['physical'], save: ['strength', 15], saveOutcome: 'no_effect', controlType: 'restraint', duration: 2, effects: [{ id: 'crushed', name: 'Crushed', description: 'Crushed in the coils.' }] }),
    passive({ id: 'naga_ancient_wisdom', name: 'Ancient-Wisdom', icon: 'spell_arcane_tormentoftheweak', school: 'arcane', desc: 'Old and cunning beyond measure.', effects: [{ id: 'wisdom', name: 'Ancient-Wisdom', description: 'Immune to charm and mind-control.' }] }),
  ],
  preta_hollow: [
    heal({ id: 'preta_hunger_drain', name: 'Hunger-Drain', icon: 'spell_shadow_lifedrain', school: 'blight', desc: 'Endless hunger sips the life of others.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d8 + 2', vampiric: { formula: '1d8 + 2', type: 'blight' } }),
    debuff({ id: 'preta_despair_aura', name: 'Despair-Aura', icon: 'spell_shadow_twistedfaith', school: 'wyrd', desc: 'An aura of bottomless, gnawing want.', ap: 1, mana: 5, cd: 2, range: 15, targetingType: 'area', areaShape: 'circle', areaSize: 15, save: ['spirit', 13], duration: 2, debuffType: 'statPenalty', effects: [{ id: 'despair', name: 'Despair', description: '-2 to all rolls.' }] }),
    passive({ id: 'preta_eternal_hunger', name: 'Eternal-Hunger', icon: 'spell_shadow_devouringplague', school: 'blight', desc: 'Its throat is eternally burning with want.', effects: [{ id: 'hunger', name: 'Eternal-Hunger', description: 'Can never be sated.' }] }),
  ],
  gamayun_seer: [
    util({ id: 'gamayun_prophecy', name: 'Prophetic-Song', icon: 'spell_arcane_tormentoftheweak', school: 'arcane', desc: 'A prophetic bird that foretells what is to come.', ap: 2, mana: 20, cd: 5, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'divination', effects: [{ id: 'prophecy', name: 'Prophecy', description: 'Reveals one true thing about the future.' }] }),
    dmg({ id: 'gamayun_swooping_talons', name: 'Swooping-Talons', icon: 'ability_hunter_aspectofthehawk', school: 'physical', desc: 'A diving talon-rake.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d8 + 3', types: ['physical'] }),
    passive({ id: 'gamayun_far_sight', name: 'Far-Sight', icon: 'ability_hunter_aspectofthehawk', school: 'arcane', desc: 'Sees events far across the world.', effects: [{ id: 'far_sight', name: 'Far-Sight', description: 'Knows of distant events as they happen.' }] }),
  ],
  chort_thorn: [
    dmg({ id: 'chort_thorn_rake', name: 'Thorn-Rake', icon: 'ability_druid_gore', school: 'physical', desc: 'A rake of iron-thorn claws.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['physical'] }),
    debuff({ id: 'chort_wager', name: 'Devil\'s-Wager', icon: 'spell_shadow_twistedfaith', school: 'wyrd', desc: 'A binding riddle-wager for souls.', ap: 2, mana: 15, cd: 5, range: 5, target: 'any', targetRestrictions: ['any'], save: ['spirit', 15], duration: 3, debuffType: 'curse', effects: [{ id: 'bound', name: 'Wager-Bound', description: 'Bound by a riddle-wager; lose and forfeit something dear.' }] }),
    passive({ id: 'chort_cunning', name: 'Fiendish-Cunning', icon: 'spell_shadow_mindsteal', school: 'wyrd', desc: 'Supremely clever and deceptive.', effects: [{ id: 'cunning', name: 'Fiendish-Cunning', description: '+4 to Deception.' }] }),
  ],
  drekavac_wail: [
    ctrl({ id: 'drekavac_wail', name: 'Drekavac-Wail', icon: 'spell_shadow_deathscream', school: 'wyrd', desc: 'A soul-rending infant\'s wail.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 30, save: ['spirit', 14], duration: 1, controlType: 'fear', effects: [{ id: 'frightened', name: 'Frightened', description: 'Frightened for 1 round.' }] }),
    dmg({ id: 'drekavac_raking_claw', name: 'Raking-Claw', icon: 'ability_druid_gore', school: 'physical', desc: 'A desperate rake of bony claws.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d8 + 2', types: ['physical'] }),
    passive({ id: 'drekavac_undead', name: 'Undead-Husk', icon: 'spell_holy_devotionaura', school: 'blight', desc: 'An animate, broken husk.', effects: [{ id: 'undead', name: 'Undead-Husk', description: 'Immune to fear and charm.' }] }),
  ],
  bannik_vent: [
    dmg({ id: 'bannik_steam_blast', name: 'Steam-Blast', icon: 'spell_fire_volcano', school: 'ember', desc: 'A blast of superheated vent-steam.', ap: 2, mana: 10, cd: 1, range: 15, targetingType: 'cone', rangeType: 'self_centered', areaShape: 'cone', areaSize: 15, formula: '2d8', types: ['ember'], save: ['constitution', 14] }),
    debuff({ id: 'bannik_soot_curse', name: 'Soot-Curse', icon: 'spell_shadow_twistedfaith', school: 'blight', desc: 'Marks the disrespectful with soot that will not wash.', ap: 1, mana: 10, cd: 3, range: 15, save: ['spirit', 14], duration: 3, debuffType: 'curse', effects: [{ id: 'sooted', name: 'Soot-Cursed', description: '-2 to Charisma checks until atoned.' }] }),
    util({ id: 'bannik_divination', name: 'Bathhouse-Divination', icon: 'spell_arcane_tormentoftheweak', school: 'arcane', desc: 'Reads the future in the steam.', ap: 1, mana: 10, cd: 5, range: 5, target: 'any', targetRestrictions: ['any'], utilityType: 'divination', effects: [{ id: 'steam_read', name: 'Steam-Reading', description: 'Reveals a cryptic omen.' }] }),
  ],
  psoglav_bone: [
    dmg({ id: 'psoglav_bone_crush', name: 'Bone-Crush-Jaw', icon: 'ability_druid_gore', school: 'physical', desc: 'A crushing bite of iron teeth.', ap: 2, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d8 + 4', types: ['physical'] }),
    debuff({ id: 'psogglav_death_gaze', name: 'Death-Gaze', icon: 'spell_shadow_deathfocus', school: 'blight', desc: 'Multiple eyes gleam with killing intent.', ap: 1, mana: 10, cd: 2, range: 20, save: ['spirit', 14], duration: 2, debuffType: 'statusEffect', effects: [{ id: 'shaken', name: 'Shaken', description: '-2 to all rolls under its gaze.' }] }),
    passive({ id: 'psoglav_bone_armor', name: 'Bone-Armor', icon: 'spell_holy_devotionaura', school: 'physical', desc: 'A hide of fused bone.', effects: [{ id: 'armor', name: 'Bone-Armor', description: 'Resistant to physical damage.' }] }),
  ],
  vourdalak_debt: [
    heal({ id: 'vourdalak_kin_drain', name: 'Kin-Drain', icon: 'spell_shadow_lifedrain', school: 'blight', desc: 'Feeds first on its own kin.', ap: 2, mana: 10, cd: 1, range: 5, rangeType: 'melee', formula: '2d8 + 3', vampiric: { formula: '2d8 + 3', type: 'blight' } }),
    debuff({ id: 'vourdalak_blood_debt', name: 'Blood-Debt', icon: 'spell_shadow_curse', school: 'blight', desc: 'A curse that demands blood repayment.', ap: 2, mana: 15, cd: 3, range: 15, save: ['spirit', 15], duration: 3, debuffType: 'curse', effects: [{ id: 'debt', name: 'Blood-Debt', description: 'Owes the vampire; loses 1d4 HP per round until paid.' }] }),
    passive({ id: 'vourdalak_undead', name: 'Undead-Vitality', icon: 'spell_holy_devotionaura', school: 'blight', desc: 'Rises again unless properly slain.', effects: [{ id: 'rise', name: 'Undead-Vitality', description: 'Regenerates 5 HP per round.' }] }),
  ],
  mavka_willow: [
    ctrl({ id: 'mavka_willow_lure', name: 'Willow-Lure', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'A voice like wind through willows lures victims to the water.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 40, save: ['spirit', 14], duration: 2, controlType: 'charm', effects: [{ id: 'lured', name: 'Lured', description: 'Compelled toward the water.' }] }),
    dmg({ id: 'mavka_root_grasp', name: 'Root-Grasp', icon: 'spell_nature_stranglevines', school: 'primal', desc: 'Willow-roots drag victims down.', ap: 1, mana: 5, cd: 1, range: 10, rangeType: 'melee', formula: '2d6 + 3', types: ['physical'], save: ['agility', 13], saveOutcome: 'no_effect', controlType: 'restraint', duration: 2, effects: [{ id: 'grappled', name: 'Grappled', description: 'Grappled by roots.' }] }),
    passive({ id: 'mavka_water_soul', name: 'Water-Soul', icon: 'spell_frost_frostarmor', school: 'rime', desc: 'Her soul is the river itself.', effects: [{ id: 'water', name: 'Water-Soul', description: 'Cannot be harmed while submerged.' }] }),
  ],
  alkonost: [
    ctrl({ id: 'alkonost_song', name: 'Dawn-Song', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'A song of dawn that charms all who hear.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 60, save: ['spirit', 14], duration: 2, controlType: 'charm', effects: [{ id: 'charmed', name: 'Charmed', description: 'Charmed for 2 rounds.' }] }),
    buff({ id: 'alkonost_morning_light', name: 'Morning-Light', icon: 'spell_holy_aurabrilliance', school: 'divine', desc: 'Warms and invigorates allies.', ap: 1, mana: 10, cd: 3, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 20, duration: 3, buffType: 'statEnhancement', effects: [{ id: 'morning', name: 'Morning-Light', description: '+2 to all rolls.' }] }),
    passive({ id: 'alkonost_storm_call', name: 'Storm-Call', icon: 'spell_shaman_thunderstorm', school: 'storm', desc: 'Her song can summon fair weather or storms.', effects: [{ id: 'weather', name: 'Storm-Call', description: 'Can summon or disperse storms.' }] }),
  ],
  dziwozona_wild: [
    dmg({ id: 'dziwozona_thorn_lash', name: 'Thorn-Lash', icon: 'spell_nature_stranglevines', school: 'physical', desc: 'A whip of bramble and thorn.', ap: 1, mana: 0, cd: 0, range: 10, rangeType: 'melee', formula: '2d6 + 3', types: ['physical'] }),
    ctrl({ id: 'dziwozona_whirlwind_step', name: 'Whirlwind-Step', icon: 'ability_rogue_shadowdance', school: 'arcane', desc: 'A spinning, impossible sidestep.', ap: 1, mana: 10, cd: 2, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], duration: 1, controlType: 'forcedMovement', effects: [{ id: 'reposition', name: 'Whirlwind-Step', description: 'Repositions instantly; attacks miss this round.' }] }),
    passive({ id: 'dziwozona_wild_strength', name: 'Wild-Strength', icon: 'ability_bossman_smash', school: 'physical', desc: 'Impossibly strong for her frame.', effects: [{ id: 'strength', name: 'Wild-Strength', description: '+4 to Strength checks.' }] }),
  ],
  upir_root: [
    heal({ id: 'upir_life_force_drain', name: 'Life-Force-Drain', icon: 'spell_shadow_lifedrain', school: 'blight', desc: 'Drains life-force through touch.', ap: 2, mana: 10, cd: 1, range: 5, rangeType: 'melee', formula: '2d6 + 4', vampiric: { formula: '2d6 + 4', type: 'blight' } }),
    ctrl({ id: 'upir_blood_control', name: 'Blood-Control', icon: 'spell_shadow_alterhumanform', school: 'blight', desc: 'Controls any creature that drank its blood.', ap: 3, mana: 30, cd: 5, range: 30, save: ['spirit', 16], duration: 3, controlType: 'mind_control', effects: [{ id: 'thrall', name: 'Blood-Thrall', description: 'Must obey the Upir for 1 hour.' }] }),
    passive({ id: 'upir_regeneration', name: 'Regeneration', icon: 'spell_nature_regeneration', school: 'blight', desc: 'Regenerates rapidly; only radiant stops it.', effects: [{ id: 'regen', name: 'Regeneration', description: 'Regenerates 15 HP per round; stopped by radiant.' }] }),
  ],
  sirin_song: [
    ctrl({ id: 'sirin_song_of_death', name: 'Song-of-Death', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'A song of final words that can break the heart.', ap: 3, mana: 30, cd: 3, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 60, save: ['spirit', 16], duration: 3, controlType: 'incapacitation', effects: [{ id: 'heartbreak', name: 'Heartbreak', description: 'Those who hear the full song die of heartbreak within 24 hours (SPI 16+ resists).' }] }),
    debuff({ id: 'sirin_sorrow_aura', name: 'Sorrow-Aura', icon: 'spell_shadow_twistedfaith', school: 'wyrd', desc: 'A 30-ft aura of overwhelming grief.', ap: 1, mana: 10, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 30, save: ['spirit', 14], duration: 2, debuffType: 'statPenalty', effects: [{ id: 'grief', name: 'Grief', description: 'Gain 1 level of exhaustion.' }] }),
    heal({ id: 'sirin_healing_tears', name: 'Healing-Tears', icon: 'spell_holy_heal', school: 'divine', desc: 'Weeps tears of light that mend wounds.', ap: 1, mana: 15, cd: 2, range: 5, target: 'ally', targetRestrictions: ['ally'], formula: '2d6', healingType: 'direct' }),
  ],
  // ── Original bestiary (from creatureData.js) ──
  skerry: [
    dmg({ id: 'skerry_ice_spike', icon: 'spell_frost_frostbolt', school: 'rime', name: 'Ice-Spike', desc: 'Hurls a shard of sea-ice.', ap: 1, mana: 0, cd: 0, range: 30, formula: '2d6', types: ['rime'] }),
    ctrl({ id: 'skerry_grasp', icon: 'spell_nature_entanglement', school: 'rime', name: 'Siren-Grasp', desc: 'A freezing grasp that drags into the deep.', ap: 2, mana: 10, cd: 1, range: 5, rangeType: 'melee', save: ['agility', 13], duration: 2, controlType: 'restraint', effects: [{ id: 'dragged', name: 'Dragged Under', description: 'Dragged underwater.' }] }),
    passive({ id: 'skerry_amphibious', icon: 'spell_frost_frostarmor', school: 'rime', name: 'Amphibious', desc: 'At home in the coldest seas.', effects: [{ id: 'amphibious', name: 'Amphibious', description: 'Swim 50; immune to cold.' }] }),
  ],
  nachtkrapp: [
    ctrl({ id: 'nacht_ash_cloud', name: 'Ash-Cloud', icon: 'spell_fire_volcano', school: 'ember', desc: 'Vents a cloud of hot soot.', ap: 2, mana: 10, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 15, save: ['constitution', 13], duration: 1, controlType: 'incapacitated', effects: [{ id: 'blinded', name: 'Blinded & Coughing', description: 'Blinded and coughing for 1 round.' }] }),
    util({ id: 'nacht_coal_snatch', name: 'Coal-Snatch', icon: 'spell_shadow_unsummon', school: 'arcane', desc: 'Steals a light source or burning item.', ap: 1, mana: 5, cd: 2, range: 5, save: ['agility', 13], duration: 0, utilityType: 'disruption', effects: [{ id: 'snatched', name: 'Snatched', description: 'A light source is stolen.' }] }),
    passive({ id: 'nacht_night_flight', name: 'Night-Flight', icon: 'ability_hunter_aspectofthehawk', school: 'arcane', desc: 'Silent flight in total darkness.', effects: [{ id: 'flight', name: 'Night-Flight', description: 'Flies silently; perfect night-vision.' }] }),
  ],
  glacier_gremlin: [
    debuff({ id: 'glacier_frost_lick', name: 'Frost-Lick', icon: 'spell_frost_frozencore', school: 'rime', desc: 'A tongue of creeping ice that slows the limb.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', save: ['constitution', 12], duration: 2, debuffType: 'movementImpairment', effects: [{ id: 'slowed', name: 'Slowed', description: 'Movement speed halved.' }] }),
    dmg({ id: 'glacier_runic_absorb', name: 'Runic-Absorb', icon: 'spell_arcane_runeofpower', school: 'arcane', desc: 'Drains mana on a successful hit.', ap: 1, mana: 0, cd: 1, range: 5, rangeType: 'melee', formula: '1d4', types: ['arcane'], save: ['spirit', 12], saveOutcome: 'no_effect', debuffType: 'statPenalty', duration: 1, effects: [{ id: 'drained', name: 'Mana Drained', description: 'Loses 10 mana.' }] }),
    passive({ id: 'glacier_cold_blooded', name: 'Cold-Blooded', icon: 'spell_frost_frostarmor', school: 'rime', desc: 'Thrives in glacial cold.', effects: [{ id: 'rime', name: 'Cold-Blooded', description: 'Resistant to frost; vulnerable to fire.' }] }),
  ],
  nokk_stallion: [
    ctrl({ id: 'nokk_mist_lure', name: 'Mist-Lure', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'A charm that compels the target toward the water.', ap: 2, mana: 15, cd: 2, range: 30, save: ['spirit', 13], duration: 2, controlType: 'charm', effects: [{ id: 'charmed', name: 'Charmed', description: 'Compelled to move toward the Nokk.' }] }),
    dmg({ id: 'nokk_drown', name: 'Drown', icon: 'spell_frost_frozencore', school: 'rime', desc: 'A grapple that drags beneath the surface.', ap: 2, mana: 10, cd: 1, range: 5, rangeType: 'melee', formula: '2d6 + 5', types: ['rime'], save: ['agility', 13], saveOutcome: 'no_effect', controlType: 'restraint', duration: 2, effects: [{ id: 'drowning', name: 'Drowning', description: 'Grappled and pulled underwater.' }] }),
    util({ id: 'nokk_water_dash', name: 'Water-Dash', icon: 'spell_shaman_thunderstorm', school: 'rime', desc: 'A 50-ft dash leaving a freezing trail.', ap: 1, mana: 5, cd: 1, range: 50, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'movement', duration: 1, effects: [{ id: 'dash', name: 'Freezing Dash', description: 'Leaves a trail of ice.' }] }),
  ],
  wolpertinger: [
    dmg({ id: 'wolp_antler_prod', name: 'Antler-Prod', icon: 'ability_druid_thrash', school: 'physical', desc: 'A jab of tiny antlers.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '1d4', types: ['physical'] }),
    util({ id: 'wolp_gliding_leap', name: 'Gliding-Leap', icon: 'ability_hunter_aspectofthehawk', school: 'arcane', desc: 'Glide-flies up to 30 ft, avoiding attacks.', ap: 1, mana: 0, cd: 1, range: 30, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'movement', duration: 1, effects: [{ id: 'glide', name: 'Gliding-Leap', description: 'Fly/glide 30 ft, avoiding opportunity attacks.' }] }),
    passive({ id: 'wolp_camouflage', name: 'Forest-Camouflage', icon: 'spell_druid_camouflage', school: 'primal', desc: 'Blends into forest foliage.', effects: [{ id: 'camo', name: 'Camouflage', description: '+5 to stealth in forest foliage.' }] }),
  ],
  huldra: [
    ctrl({ id: 'huldra_seductive_song', name: 'Seductive-Song', icon: 'spell_shadow_soulburn', school: 'wyrd', desc: 'A song that charms and compels closer.', ap: 2, mana: 15, cd: 2, range: 30, save: ['spirit', 13], duration: 2, controlType: 'charm', effects: [{ id: 'charmed', name: 'Charmed', description: 'Charmed; must move toward the Huldra.' }] }),
    dmg({ id: 'huldra_wood_slam', name: 'Wood-Slam', icon: 'ability_bossman_smash', school: 'physical', desc: 'A supernatural-strength blow.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d8 + 3', types: ['physical'] }),
    util({ id: 'huldra_tree_meld', name: 'Tree-Meld', icon: 'spell_druid_camouflage', school: 'primal', desc: 'Teleports between pine trees.', ap: 1, mana: 5, cd: 2, range: 40, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'movement', effects: [{ id: 'meld', name: 'Tree-Meld', description: 'Teleports up to 40 ft between trees.' }] }),
  ],
  ushabti: [
    dmg({ id: 'ushabti_sickle_slash', name: 'Sickle-Slash', icon: 'ability_rogue_findweakness', school: 'physical', desc: 'A curving sickle-blow that bleeds.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['physical'], dot: { formula: '1d6', type: 'physical', duration: 3 }, save: ['constitution', 13], saveOutcome: 'no_effect' }),
    util({ id: 'ushabti_clay_shield', name: 'Clay-Shield', icon: 'spell_holy_devotionaura', school: 'physical', desc: 'Hardened clay turns aside blows.', ap: 1, mana: 5, cd: 2, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'protection', duration: 2, effects: [{ id: 'shield', name: 'Clay-Shield', description: 'Takes 3 less damage from physical attacks.' }] }),
    dmg({ id: 'ushabti_shatter', name: 'Shatter', icon: 'spell_fire_selfdestruct', school: 'physical', desc: 'Explodes in a hail of clay shards when destroyed.', ap: 3, mana: 0, cd: 10, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 10, formula: '3d6', types: ['physical'], save: ['agility', 14] }),
  ],
  qalupalik: [
    ctrl({ id: 'qalupalik_amautik_snatch', name: 'Amautik-Snatch', icon: 'spell_nature_entanglement', school: 'physical', desc: 'Snatches the victim into its hood.', ap: 2, mana: 5, cd: 1, range: 5, rangeType: 'melee', save: ['agility', 13], duration: 2, controlType: 'restraint', effects: [{ id: 'snatched', name: 'Snatched', description: 'Pulled into the hood and restrained.' }] }),
    dmg({ id: 'qalupalik_claw_strike', name: 'Claw-Strike', icon: 'ability_druid_gore', school: 'physical', desc: 'A raking green-nailed claw.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['physical'] }),
    util({ id: 'qalupalik_ice_dive', name: 'Ice-Dive', icon: 'spell_frost_frostarmor', school: 'rime', desc: 'Submerges into freezing water.', ap: 1, mana: 0, cd: 2, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'movement', duration: 1, effects: [{ id: 'dive', name: 'Ice-Dive', description: 'Submerges for 1 round, avoiding attacks.' }] }),
  ],
  yuki_onna: [
    dmg({ id: 'yuki_frost_breath', name: 'Frost-Breath', icon: 'spell_frost_frostbolt', school: 'rime', desc: 'A 15-ft cone of killing cold.', ap: 2, mana: 15, cd: 1, range: 15, targetingType: 'cone', rangeType: 'self_centered', areaShape: 'cone', areaSize: 15, formula: '2d8', types: ['rime'], save: ['constitution', 14], saveOutcome: 'no_effect', controlType: 'restraint', duration: 1, effects: [{ id: 'frozen', name: 'Frozen', description: 'Restrained in ice for 1 round.' }] }),
    dmg({ id: 'yuki_chilling_touch', name: 'Chilling-Touch', icon: 'spell_frost_frozencore', school: 'rime', desc: 'A touch that drains warmth and mana.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6', types: ['rime'], save: ['spirit', 14], saveOutcome: 'no_effect', debuffType: 'statPenalty', duration: 1, effects: [{ id: 'mana_drain', name: 'Mana Drained', description: 'Loses 5 mana.' }] }),
    util({ id: 'yuki_snow_cloak', name: 'Snow-Cloak', icon: 'spell_druid_camouflage', school: 'rime', desc: 'Vanishes into the blizzard.', ap: 1, mana: 10, cd: 3, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'movement', duration: 2, effects: [{ id: 'concealed', name: 'Full Concealment', description: 'Full concealment in snow.' }] }),
  ],
  bixie: [
    ctrl({ id: 'bixie_ward_roar', name: 'Ward-Roar', icon: 'spell_shadow_fright', school: 'wyrd', desc: 'A roar that frightens and disrupts spells.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 30, save: ['spirit', 13], duration: 2, controlType: 'fear', effects: [{ id: 'frightened', name: 'Frightened', description: 'Frightened; disadvantage on spells.' }] }),
    dmg({ id: 'bixie_jade_claw', name: 'Jade-Claw', icon: 'ability_druid_gore', school: 'physical', desc: 'A jade-hard claw-strike.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 4', types: ['physical'] }),
    ctrl({ id: 'bixie_wing_sweep', name: 'Wing-Sweep', icon: 'spell_shaman_thunderstorm', school: 'physical', desc: 'A wing-buffet that knocks foes back.', ap: 1, mana: 5, cd: 1, range: 10, save: ['agility', 13], saveOutcome: 'no_effect', controlType: 'forcedMovement', duration: 0, effects: [{ id: 'pushed', name: 'Knocked Back', description: 'Knocked back 15 ft.', config: { distance: 15, movementType: 'push' } }] }),
  ],
  likho: [
    debuff({ id: 'likho_gaze_misfortune', name: 'Gaze-of-Misfortune', icon: 'spell_shadow_deathfocus', school: 'wyrd', desc: 'A gaze that curses with ill luck.', ap: 2, mana: 15, cd: 2, range: 30, save: ['spirit', 14], duration: 3, debuffType: 'statPenalty', effects: [{ id: 'unlucky', name: 'Unlucky', description: 'Disadvantage on all checks and attack rolls for 3 rounds.' }] }),
    ctrl({ id: 'likho_clinging_curse', name: 'Clinging-Curse', icon: 'spell_nature_entanglement', school: 'physical', desc: 'Climbs onto the target\'s back.', ap: 1, mana: 10, cd: 2, range: 5, rangeType: 'melee', save: ['agility', 14], duration: 2, controlType: 'restraint', effects: [{ id: 'clinging', name: 'Clinging', description: 'Climbs on; hard to dislodge.' }] }),
    passive({ id: 'likho_one_eye', name: 'One-Eye', icon: 'spell_shadow_deathfocus', school: 'wyrd', desc: 'A single, baleful eye.', effects: [{ id: 'eye', name: 'One-Eye', description: 'Its gaze is the source of its curse.' }] }),
  ],
  vila: [
    dmg({ id: 'vila_wind_lash', icon: 'spell_shaman_thunderstorm', school: 'storm', name: 'Wind-Lash', desc: 'A whip of mountain wind.', ap: 1, mana: 5, cd: 0, range: 20, formula: '2d6 + 3', types: ['storm'] }),
    buff({ id: 'vila_dance_fight', icon: 'ability_rogue_shadowdance', school: 'arcane', name: 'Dance-Fight', desc: 'A whirling dance that grants evasion and fury.', ap: 1, mana: 10, cd: 3, range: 0, rangeType: 'self', target: 'self', targetRestrictions: ['self'], duration: 3, buffType: 'combatAdvantage', effects: [{ id: 'dance', name: 'Dance-Fight', description: '+2 to attack; attacks against her have disadvantage.' }] }),
    util({ id: 'vila_weather_weave', icon: 'spell_shaman_thunderstorm', school: 'storm', name: 'Weather-Weave', desc: 'Commands the mountain weather.', ap: 2, mana: 20, cd: 4, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 100, utilityType: 'environment', duration: 3, effects: [{ id: 'weather', name: 'Weather-Weave', description: 'Raises or calms a storm.' }] }),
  ],
  vodyan: [
    debuff({ id: 'vodyan_bog_curse', name: 'Bog-Curse', icon: 'spell_shadow_twistedfaith', school: 'rime', desc: 'A curse that slows and chills.', ap: 2, mana: 10, cd: 2, range: 30, save: ['spirit', 13], duration: 3, debuffType: 'movementImpairment', effects: [{ id: 'slowed', name: 'Bog-Slowed', description: 'Speed halved; 1d6 frost/round.' }] }),
    heal({ id: 'vodyan_moss_remedy', name: 'Moss-Remedy', icon: 'spell_nature_healingtouch', school: 'primal', desc: 'Moss and bog-herbs mend wounds.', ap: 1, mana: 10, cd: 2, range: 5, target: 'ally', targetRestrictions: ['ally'], formula: '2d8 + 4' }),
    ctrl({ id: 'vodyan_swamp_fog', name: 'Swamp-Fog', icon: 'spell_frost_frostblast', school: 'rime', desc: 'Creates a 20-ft radius of concealing fog.', ap: 1, mana: 5, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 20, duration: 3, controlType: 'zone', effects: [{ id: 'fog', name: 'Swamp-Fog', description: 'Conceals all within.' }] }),
  ],
  bukavac: [
    ctrl({ id: 'bukavac_deafening_screech', name: 'Deafening-Screech', icon: 'spell_shadow_deathscream', school: 'wyrd', desc: 'A screech that deafens and stuns.', ap: 2, mana: 15, cd: 2, range: 0, targetingType: 'area', rangeType: 'self_centered', areaShape: 'circle', areaSize: 30, save: ['spirit', 14], duration: 1, controlType: 'stunned', effects: [{ id: 'deaf_stunned', name: 'Deafened & Stunned', description: 'Deafened and stunned for 1 round.' }] }),
    ctrl({ id: 'bukavac_six_claw_grasp', name: 'Six-Claw-Grasp', icon: 'spell_nature_entanglement', school: 'physical', desc: 'Six claws grapple and restrain.', ap: 2, mana: 5, cd: 1, range: 5, rangeType: 'melee', save: ['agility', 14], duration: 2, controlType: 'restraint', effects: [{ id: 'grappled', name: 'Grappled', description: 'Grappled and restrained by six claws.' }] }),
    passive({ id: 'bukavac_mud_drag', name: 'Mud-Drag', icon: 'spell_nature_regeneration', school: 'primal', desc: 'Moves at full speed through mud.', effects: [{ id: 'mud', name: 'Mud-Drag', description: 'Ignores mud difficult terrain.' }] }),
  ],
  hut_ling: [
    dmg({ id: 'hut_talon_kick', name: 'Talon-Kick', icon: 'ability_druid_thrash', school: 'physical', desc: 'A leaping talon-kick that knocks prone.', ap: 1, mana: 0, cd: 0, range: 5, rangeType: 'melee', formula: '2d6 + 3', types: ['physical'], save: ['agility', 13], saveOutcome: 'no_effect', controlType: 'knockdown', duration: 1, effects: [{ id: 'prone', name: 'Knocked Prone', description: 'Knocked prone.' }] }),
    dmg({ id: 'hut_runic_lock', name: 'Runic-Lock', icon: 'spell_shaman_lightningbolt', school: 'storm', desc: 'A runic trap that shocks those who open it.', ap: 1, mana: 10, cd: 2, range: 5, save: ['agility', 13], formula: '2d6', types: ['storm'] }),
    util({ id: 'hut_dash', name: 'Dash', icon: 'ability_rogue_shadowdance', school: 'arcane', desc: 'A sudden loping dash.', ap: 1, mana: 0, cd: 1, range: 30, rangeType: 'self', target: 'self', targetRestrictions: ['self'], utilityType: 'movement', effects: [{ id: 'dash', name: 'Dash', description: 'Moves up to 30 ft quickly.' }] }),
  ],
};

/**
 * Master map of advanced spell-card abilities keyed by creature id.
 * Merged into LIBRARY_CREATURES at load time.
 */
export const ADVANCED_ABILITIES = {
  ...FROSTWOOD,
  ...NORDHALLA,
  ...EMBERSPIRE,
  ...ICEHEART,
  ...CRAGJAW,
  ...SUNDRIFT,
  ...BRYNGLOOM,
};

export default ADVANCED_ABILITIES;
