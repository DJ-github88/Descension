/**
 * Asset Manager - Handles custom game assets
 * 
 * This utility provides a centralized way to manage game assets using
 * local custom artwork from the items folder.
 */

import { convertWowIconToLocal } from './wowToLocalIconMap';

// Base paths for different asset types
export const ASSET_PATHS = {
  icons: {
    spells: '/assets/icons/spells/',
    items: '/assets/icons/items/',
    creatures: '/assets/icons/creatures/',
    abilities: '/assets/icons/abilities/',
    ui: '/assets/icons/Status/utility/'
  },
  images: {
    characters: '/assets/images/characters/',
    backgrounds: '/assets/images/backgrounds/',
    textures: '/assets/images/textures/'
  },
  // Legacy WoW icon base URL for fallback
  wow: 'https://wow.zamimg.com/images/wow/icons/large/'
};

// Default fallback icons for each category
export const FALLBACK_ICONS = {
  spell: 'exclamation-mark-alert',
  item: 'Misc/Books/book-brown-teal-question-mark', // Local item fallback
  creature: 'exclamation-mark-alert',
  ability: 'exclamation-mark-alert',
  ui: 'exclamation-mark-alert'
};

/**
 * Get icon URL with fallback system
 * @param {string} iconId - Icon identifier
 * @param {string} category - Icon category (spell, item, creature, ability, ui)
 * @param {boolean} useCustom - Whether to try custom icons first
 * @returns {string} - Full URL to icon
 */
export const getIconUrl = (iconId, category = 'ui', useCustom = true) => {
  if (!iconId) {
    return getCustomIconUrl(FALLBACK_ICONS[category] || FALLBACK_ICONS.ui, category);
  }

  // For abilities category, use getAbilityIconUrl which handles creature- prefix
  if (category === 'abilities') {
    return getAbilityIconUrl(iconId);
  }

  // For items category, always use local assets only - no WoW fallback
  if (category === 'items') {
    // If it's a WoW-style icon ID, try to map it to a local icon
    if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('trade_')) {
      const localIconId = convertWowIconToLocal(iconId);
      if (localIconId) {
        // Use mapped local icon
        return getCustomIconUrl(localIconId, category);
      }
      // If no mapping found, use fallback icon
      return getCustomIconUrl(FALLBACK_ICONS.item, category);
    }
    // Use the iconId directly (should be a path like "Weapons/Sword/iron-sword" or "Misc/Books/book-brown-teal-question-mark")
    return getCustomIconUrl(iconId, category);
  }

  if (useCustom) {
    // Try custom icon first
    const customUrl = getCustomIconUrl(iconId, category);
    return customUrl;
  } else {
    // Use WoW icon as fallback (only for non-items)
    return getWowIconUrl(iconId);
  }
};

/**
 * Get custom icon URL
 * @param {string} iconId - Icon identifier  
 * @param {string} category - Icon category
 * @returns {string} - URL to custom icon
 */
export const getCustomIconUrl = (iconId, category) => {
  const basePath = ASSET_PATHS.icons[category] || ASSET_PATHS.icons.ui;

  // Ensure .png extension
  const fileName = iconId.endsWith('.png') ? iconId : `${iconId}.png`;

  // URL encode the path to handle spaces and special characters
  // Split by '/' to encode each segment separately, then rejoin
  const pathSegments = fileName.split('/');
  const encodedPath = pathSegments.map(segment => encodeURIComponent(segment)).join('/');

  return `${basePath}${encodedPath}`;
};

/**
 * Map WoW spell/ability icon IDs to local ability icon paths
 * @param {string} wowIconId - WoW icon identifier (e.g., 'spell_frost_frostarmor')
 * @returns {string|null} - Local ability icon path or null if no mapping exists
 */
const convertWowIconToAbilityIcon = (wowIconId) => {
  if (!wowIconId || typeof wowIconId !== 'string') {
    return null;
  }

  const iconMapping = {
    // ===== ARCANE =====
    'spell_arcane_arcane01': 'Arcane/Enchanted Sword',
    'spell_arcane_arcane02': 'Arcane/Magical Sword',
    'spell_arcane_arcane04': 'Arcane/Magical Sword',
    'spell_arcane_arcaneorb': 'Arcane/Orb Manipulation',
    'spell_arcane_arcanepotency': 'Arcane/Empowering Growth',
    'spell_arcane_arcanepower': 'Arcane/Spellcasting Aura',
    'spell_arcane_arcanestorm': 'Arcane/Spiral Vortex',
    'spell_arcane_arcanetorrent': 'Arcane/Empowering Growth',
    'spell_arcane_blast': 'Arcane/Magical Sword',
    'spell_arcane_blink': 'Arcane/Quick Step',
    'spell_arcane_echoofdamned': 'Arcane/Desperate Channelling',
    'spell_arcane_farsight': 'Arcane/Revealing Steps',
    'spell_arcane_levitate': 'Arcane/Channeling Stance',
    'spell_arcane_mindmastery': 'Psychic/Focused Mind',
    'spell_arcane_mindvision': 'Psychic/Mind Read',
    'spell_arcane_polymorphchicken': 'Arcane/Conjure Elements',
    'spell_arcane_portaldarkmoon': 'Arcane/Portal Archway',
    'spell_arcane_portalironforge': 'Arcane/Portal Archway',
    'spell_arcane_portalorgrimmar': 'Arcane/Portal Archway',
    'spell_arcane_portals': 'Arcane/Open Portal',
    'spell_arcane_portalshattrath': 'Arcane/Portal Archway',
    'spell_arcane_prismaticcloak': 'Arcane/Ebon Blaze',
    'spell_arcane_starfire': 'Arcane/Missile',

    // ===== FIRE =====
    'spell_fire_burnout': 'Fire/Rising Inferno',
    'spell_fire_elemental_totem': 'Fire/Fire Demon',
    'spell_fire_elementaldevastation': 'Fire/Eruption',
    'spell_fire_felrainoffire': 'Fire/Hellfire',
    'spell_fire_fire': 'Fire/Flame Burst',
    'spell_fire_fireball': 'Fire/Swirling Fireball',
    'spell_fire_fireball02': 'Fire/Swirling Fireball',
    'spell_fire_firebolt': 'Fire/Fire Bolt',
    'spell_fire_flameblades': 'Fire/Flame Fist',
    'spell_fire_flamebolt': 'Fire/Flame Burst',
    'spell_fire_flameshock': 'Fire/Scorching Rune',
    'spell_fire_flare': 'Fire/Sun Symbol',
    'spell_fire_immolation': 'Fire/Enveloping Fire',
    'spell_fire_incinerate': 'Fire/Infernal Fire',
    'spell_fire_lavasplash': 'Fire/Flowing Lava',
    'spell_fire_masterofelements': 'Fire/Fire Orb',
    'spell_fire_meteorstorm': 'Fire/Fiery Comet',
    'spell_fire_ragnaros_lavabolt': 'Fire/Dripping Lava',
    'spell_fire_sealoffire': 'Fire/Fiery Symbol',
    'spell_fire_selfdestruct': 'Utility/Explosive Detonation',
    'spell_fire_twilightflamebreath': 'Fire/Dragon Breath',
    'spell_fire_volcano': 'Fire/Volcanic Erupt',
    
    // ===== OBJECTS & FURNITURE =====
    'inv_box_01': 'Container/Chest/treasure-chest-wooden-brown-straps',
    'inv_box_04': 'Container/Chest/treasure-chest-teal-golden-trim',
    'inv_crate_01': 'Container/Chest/wooden-crate-brown-planks-isometric',
    'inv_misc_note_01': 'Misc/Books/book-scroll-parchment-rolled',
    'inv_misc_note_02': 'Misc/Books/book-scroll-rolled-red-wax-seal',
    'inv_misc_dice_01': 'Social/Dice Roll',

    // ===== FROST =====
    'spell_frost_arcticwinds': 'Frost/Frozen Wave',
    'spell_frost_freezing': 'Frost/Frost Freeze 1',
    'spell_frost_freezingbreath': 'Frost/Dripping Ice',
    'spell_frost_frost': 'Frost/Frozen in Ice',
    'spell_frost_frost_shock': 'Frost/Circular Frost Explosion',
    'spell_frost_frostarmor': 'Frost/Frozen in Ice',
    'spell_frost_frostarmor02': 'Frost/Frozen in Ice',
    'spell_frost_frostblast': 'Frost/Frostbite Effect',
    'spell_frost_frostbolt': 'Frost/Ice Orb',
    'spell_frost_frostbolt02': 'Frost/Frozen in Ice',
    'spell_frost_frostnova': 'Frost/Frozen AoE',
    'spell_frost_frostshock': 'Frost/Inflicted Ice Shard',
    'spell_frost_frostward': 'Frost/Icy Shield',
    'spell_frost_frozencore': 'Frost/Frost Manipulation',
    'spell_frost_frozenorb': 'Frost/Ice Orb',
    'spell_frost_glacier': 'Frost/Frozen Area',
    'spell_frost_iceshard': 'Frost/Ice Shards',
    'spell_frost_iceshards': 'Frost/Ice Shards',
    'spell_frost_iceshock': 'Frost/Frost Phonix',
    'spell_frost_icestorm': 'Frost/Frozen Wave',
    'spell_frost_icewall': 'Frost/Icey wall',
    'spell_frost_stun': 'Frost/Confused',
    'spell_frost_wizardmark': 'Frost/Ice Crystal Rune',

    // ===== HOLY / RADIANT =====
    'spell_holy_avengersshield': 'Radiant/Radiant Golden Shield',
    'spell_holy_blessedrecovery': 'Healing/Renewal',
    'spell_holy_blessingofprotection': 'Radiant/Divine Blessing',
    'spell_holy_blessingofstrength': 'Radiant/Radiant Warrior',
    'spell_holy_borrowedtime': 'Arcane/Rewind Time',
    'spell_holy_crusaderstrike': 'Radiant/Divine Downward Sword',
    'spell_holy_devotionaura': 'Radiant/Divine Blessing',
    'spell_holy_dispelmagic': 'Arcane/Magical Cross Emblem 2',
    'spell_holy_divineillumination': 'Radiant/Divine Illumination',
    'spell_holy_divineintervention': 'Radiant/Divine Ascension',
    'spell_holy_divineprotection': 'Radiant/Radiant Golden Shield',
    'spell_holy_divineprovidence': 'Radiant/Divine Radiance',
    'spell_holy_divinepurpose': 'Radiant/Divine Halo',
    'spell_holy_divineshield': 'Radiant/Radiant Golden Shield',
    'spell_holy_divinespirit': 'Radiant/Radiant Divinity',
    'spell_holy_elunesgrace': 'Nature/Ethereal Bird',
    'spell_holy_excorcism': 'Radiant/Divine Beam',
    'spell_holy_farsight': 'Utility/Watchful Eye',
    'spell_holy_flashheal': 'Healing/Golden Heart',
    'spell_holy_greaterblessingofkings': 'Radiant/Golden Ring',
    'spell_holy_greaterheal': 'Healing/Golden Heart',
    'spell_holy_guardianspirit': 'Radiant/Winged Angel',
    'spell_holy_heal': 'Healing/Golden Heart',
    'spell_holy_holybolt': 'Radiant/Radiant Bolt',
    'spell_holy_holyfire': 'Fire/Sun Symbol',
    'spell_holy_holyguidance': 'Radiant/Enlightened Vision',
    'spell_holy_holynova': 'Radiant/Bright Explosion',
    'spell_holy_holyprotection': 'Radiant/Radiant Golden Shield',
    'spell_holy_holysmite': 'Radiant/Divine Blessing',
    'spell_holy_holywrath': 'Radiant/Radiant Sunburst',
    'spell_holy_innerfire': 'Radiant/Radiant Aura',
    'spell_holy_layonhands': 'Healing/Reaching Hand',
    'spell_holy_penance': 'Radiant/Radiant Beam',
    'spell_holy_powerinfusion': 'Radiant/Radiant Divinity',
    'spell_holy_powerwordbarrier': 'Force/Force Field',
    'spell_holy_powerwordfortitude': 'Radiant/Radiant Light 1',
    'spell_holy_powerwordshield': 'Force/Force Shield',
    'spell_holy_prayerofhealing': 'Healing/Prayer',
    'spell_holy_prayerofhealing02': 'Healing/Prayer',
    'spell_holy_purify': 'Healing/Cure Within',
    'spell_holy_reckoning': 'Radiant/Radiant Warrior',
    'spell_holy_renew': 'Healing/Renewal',
    'spell_holy_restoration': 'Healing/Renewal',
    'spell_holy_resurrection': 'Healing/Ressusitate',
    'spell_holy_reverseentropy': 'Arcane/Rewind Time',
    'spell_holy_righteousfury': 'Radiant/Radiant Warrior',
    'spell_holy_sealofblood': 'Necrotic/Blood Scroll',
    'spell_holy_sealofprotection': 'Radiant/Radiant Golden Shield',
    'spell_holy_sealofsacrifice': 'Radiant/Redemption',
    'spell_holy_sealofwisdom': 'Psychic/Focused Mind',
    'spell_holy_searinglight': 'Radiant/Radiant Beam',
    'spell_holy_searinglightpriest': 'Radiant/Radiant Beam',
    'spell_holy_silence': 'Psychic/Mind Control',
    'spell_holy_spiritualguidence': 'Radiant/Divine Radiance',
    'spell_holy_surgeoflight': 'Radiant/Radiant Glow',

    // ===== NATURE =====
    'spell_nature_abolishmagic': 'Arcane/Magical Cross Emblem 2',
    'spell_nature_acid_01': 'Poison/Acid Splash',
    'spell_nature_ancestralguardian': 'Nature/Ethereal Bear Spirit',
    'spell_nature_astralrecal': 'Nature/Teleport',
    'spell_nature_bloodlust': 'General/Fiery Rage',
    'spell_nature_callstorm': 'Lightning/Lightning Storm',
    'spell_nature_corrosivebreath': 'Poison/Acid Spray',
    'spell_nature_cyclone': 'Nature/Tornado Vortex',
    'spell_nature_earthbind': 'Nature/Entangled',
    'spell_nature_earthbindtotem': 'Nature/Root Network',
    'spell_nature_earthquake': 'Nature/Earth Shatter',
    'spell_nature_forceofnature': 'Nature/Nature Primal',
    'spell_nature_guardianward': 'Nature/Earth Shield',
    'spell_nature_healingtouch': 'Healing/Heal Wound',
    'spell_nature_healingwavegreater': 'Healing/Heart Ripple',
    'spell_nature_invisibilitytotem': 'Utility/Hide',
    'spell_nature_lightning': 'Lightning/Lightning Bolt',
    'spell_nature_lightningshield': 'Lightning/Lightning Shield',
    'spell_nature_moonkey': 'Nature/Ethereal Bird',
    'spell_nature_natureguardian': 'Nature/Nature Natural',
    'spell_nature_naturetouchgrow': 'Nature/Gnarled Roots',
    'spell_nature_nullifydisease': 'Healing/Cure Within',
    'spell_nature_nullifypoison_02': 'Healing/Cure Within',
    'spell_nature_nullward': 'Nature/Earth Shield',
    'spell_nature_reincarnation': 'Necrotic/Resurrect',
    'spell_nature_rejuvenation': 'Healing/Renewal',
    'spell_nature_resistnature': 'Nature/Centered',
    'spell_nature_shamanrage': 'General/Rage',
    'spell_nature_spiritarmor': 'Nature/Earth Shield',
    'spell_nature_spiritwolf': 'Nature/Wolf Dash',
    'spell_nature_starfall': 'Arcane/Star Trail Path',
    'spell_nature_stoneclawtotem': 'Nature/Roots',
    'spell_nature_stoneskintotem02': 'Nature/Earth Shield',
    'spell_nature_stormreach': 'Lightning/Thunder',
    'spell_nature_stranglevines': 'Nature/Thorny Entanglement',
    'spell_nature_strength': 'General/Increase Strength',
    'spell_nature_strengthofearth': 'General/Increase Strength',
    'spell_nature_stoneskintotem': 'Nature/Earth Shield',
    'spell_nature_strengthofearthtotem02': 'General/Increase Strength',
    'spell_nature_thorns': 'Nature/Thorned Flower',
    'spell_nature_timestop': 'Arcane/Rewind Time',
    'spell_nature_tranquility': 'Healing/Heart Ripple',
    'spell_nature_unyeildingstamina': 'Utility/Resistance',
    'spell_nature_windfury': 'Nature/Wind Gust',
    'spell_nature_wispheal': 'Healing/Heart Ripple',
    'spell_nature_wispsplode': 'Nature/Nature Wild 1',
    'spell_nature_wrathv2': 'Nature/Claw Marks',

    // ===== SHADOW / NECROTIC =====
    'spell_shadow_antimagic': 'Arcane/Magical Cross Emblem 2',
    'spell_shadow_antimagicshell': 'Necrotic/Protective Aura',
    'spell_shadow_antishadow': 'Radiant/Radiant Divinity',
    'spell_shadow_blackplague': 'Necrotic/Corruption',
    'spell_shadow_bloodboil': 'Necrotic/Blood Skull',
    'spell_shadow_charm': 'Utility/Glowing Hooded Figure',
    'spell_shadow_chilltouch': 'Frost/Frost Touch',
    'spell_shadow_contagion': 'Poison/Poison Contagion',
    'spell_shadow_curse': 'Necrotic/Necrotic Skull',
    'spell_shadow_curseofachimonde': 'Necrotic/Necrotic Skull',
    'spell_shadow_curseofmannoroth': 'Necrotic/Necrotic Decay 1',
    'spell_shadow_curseofsargeras': 'Necrotic/Necrotic Skull',
    'spell_shadow_darkritual': 'Necrotic/Ritual',
    'spell_shadow_deathanddecay': 'Necrotic/Necrotic Death',
    'spell_shadow_deathcoil': 'Necrotic/Death Mark',
    'spell_shadow_deathscream': 'Necrotic/Screaming Skull',
    'spell_shadow_deathsembrace': 'Necrotic/Necrotic Wither 1',
    'spell_shadow_demonicempathy': 'Necrotic/Demonic Empowerment',
    'spell_shadow_demonicfortitude': 'Utility/Resistance',
    'spell_shadow_demonicpact': 'Necrotic/Spectral Summoning',
    'spell_shadow_demonictactics': 'Utility/Powerful Warrior',
    'spell_shadow_detectinvisibility': 'Utility/All Seeing Eye',
    'spell_shadow_devouraura': 'Necrotic/Devour',
    'spell_shadow_gathershadows': 'Void/Shadowy Potion',
    'spell_shadow_lifedrain': 'Necrotic/Drain Soul',
    'spell_shadow_lifedrain02': 'Necrotic/Drain Soul',
    'spell_shadow_manafeed': 'Arcane/Orb Manipulation',
    'spell_shadow_metamorphosis': 'Necrotic/Transform Demon',
    'spell_shadow_mindbomb': 'Psychic/Psionic Boom',
    'spell_shadow_mindflay': 'Psychic/Mind Beam',
    'spell_shadow_mindshear': 'Psychic/Psionic Strike',
    'spell_shadow_mindsteal': 'Psychic/Mind Control',
    'spell_shadow_mindtwisting': 'Psychic/Mind Roar',
    'spell_shadow_nethercloak': 'Void/Consumed by Void',
    'spell_shadow_painandsuffering': 'Psychic/Twist Pain',
    'spell_shadow_painspike': 'Psychic/Psionic Strike',
    'spell_shadow_plaguecloud': 'Poison/Poison Plague',
    'spell_shadow_possession': 'Psychic/Mind Control',
    'spell_shadow_psychicscream': 'Psychic/Agonizing Scream',
    'spell_shadow_raisedead': 'Necrotic/Arise',
    'spell_shadow_rebirth': 'Necrotic/Resurrect',
    'spell_shadow_sealofkings': 'Radiant/Golden Ring',
    'spell_shadow_shackleundead': 'Necrotic/Crossed Bones',
    'spell_shadow_shadesofdarkness': 'Void/Consumed by Void',
    'spell_shadow_shadetruesight': 'Utility/All Seeing Eye',
    'spell_shadow_shadowbolt': 'Void/Black Hole',
    'spell_shadow_shadowembrace': 'Necrotic/Necrotic Wither 1',
    'spell_shadow_shadowfiend': 'Necrotic/Ghostly Menace',
    'spell_shadow_shadowform': 'Void/Consumed by Void',
    'spell_shadow_shadowfury': 'Void/Black Hole',
    'spell_shadow_shadowstep': 'Utility/Phantom Dash',
    'spell_shadow_shadowwordpain': 'Psychic/Mind Strike',
    'spell_shadow_siphonmana': 'Arcane/Orb Manipulation',
    'spell_shadow_soulleech': 'Necrotic/Drain Soul',
    'spell_shadow_soulleech_2': 'Necrotic/Drain Soul',
    'spell_shadow_soulleech_3': 'Necrotic/Drain Soul',
    'spell_shadow_summoninfernal': 'Utility/Summon Minion',
    'spell_shadow_summonvoidwalker': 'Utility/Summon Minion',
    'spell_shadow_twilight': 'Void/Consumed by Void',
    'spell_shadow_twistedfaith': 'Psychic/Mental Chaos',
    'spell_shadow_unholyfrenzy': 'General/Fiery Rage',
    'spell_shadow_unholystrength': 'General/Increase Strength',
    'spell_shadow_unstableaffliction': 'Poison/Poison Contagion',
    'spell_shadow_unstableaffliction_3': 'Poison/Poison Contagion',
    'spell_shadow_vampiricaura': 'Necrotic/Empowering Aura',

    // ===== DEATH KNIGHT FROST =====
    'spell_deathknight_frostfever': 'Frost/Frostbite Effect',

    // ===== SHAMAN =====
    'spell_shaman_dropall': 'Nature/Earth Shield',
    'spell_shaman_lavaburst': 'Fire/Dripping Lava',

    // ===== ABILITY - WARRIOR =====
    'ability_warrior_battleshout': 'Utility/Powerful Warrior',
    'ability_warrior_bladestorm': 'Slashing/Whirl',
    'ability_warrior_bloodbath': 'Slashing/Bloody Slash',
    'ability_warrior_bloodnova': 'Bludgeoning/Blood Punch',
    'ability_warrior_charge': 'Utility/Dash',
    'ability_warrior_cleave': 'Slashing/Cleave',
    'ability_warrior_commandingshout': 'Utility/Overlords Command',
    'ability_warrior_decisivestrike': 'Slashing/Sword Strike',
    'ability_warrior_defensivestance': 'Utility/Deflecting Shield',
    'ability_warrior_endlessrage': 'General/Rage',
    'ability_warrior_execute': 'Slashing/Execution',
    'ability_warrior_focusedrage': 'General/Rage',
    'ability_warrior_innerrage': 'General/Rage',
    'ability_warrior_intensifyrage': 'Utility/Empowered Warrior',
    'ability_warrior_laststand': 'Utility/Resistance',
    'ability_warrior_rampage': 'Utility/Empowered Warrior',
    'ability_warrior_revenge': 'Slashing/Cross Slash',
    'ability_warrior_savageblow': 'Bludgeoning/Mortal Strike',
    'ability_warrior_secondwind': 'Healing/Renewal',
    'ability_warrior_shieldmastery': 'Utility/Shield',
    'ability_warrior_shieldwall': 'Utility/Shield',
    'ability_warrior_shockwave': 'Force/Sonic Boom',
    'ability_warrior_titansgrip': 'Utility/Powerful Warrior',
    'ability_warrior_unrelentingassault': 'Slashing/Crossed Swords',
    'ability_warrior_warcry': 'Utility/Overlords Command',
    'ability_warrior_weaponmastery': 'Slashing/Crossed Swords',

    // ===== ABILITY - ROGUE =====
    'ability_rogue_ambush': 'Piercing/Backstab',
    'ability_rogue_bladefurry': 'Slashing/Dual Blades',
    'ability_rogue_deadlybrew': 'Poison/Poison Concoction',
    'ability_rogue_dismantle': 'Piercing/Dagger Whirl',
    'ability_rogue_dualweild': 'Slashing/Dual Blades',
    'ability_rogue_envelopingshadows': 'Utility/Hide',
    'ability_rogue_fanofknives': 'Piercing/Dagger Rain',
    'ability_rogue_feint': 'Utility/Parry',
    'ability_rogue_fleetfooted': 'Utility/Speed Boot',
    'ability_rogue_rollthebones': 'Social/Dice Roll',
    'ability_rogue_shadowdance': 'Utility/Phantom Dash',
    'ability_rogue_shadowstep': 'Utility/Phantom Dash',
    'ability_rogue_shadowstrike': 'Piercing/Night Dagger',
    'ability_rogue_slicedice': 'Slashing/Quick Slash',
    'ability_rogue_smoke': 'Utility/Hide',
    'ability_rogue_sprint': 'Utility/Speed Boot',
    'ability_rogue_wrongfullyaccused': 'Social/Careful Blunder',

    // ===== ABILITY - STEALTH / VANISH =====
    'ability_stealth': 'Utility/Hide',
    'ability_vanish': 'Utility/Hide',

    // ===== ABILITY - DRUID =====
    'ability_druid_berserk': 'Nature/Roaring Bear',
    'ability_druid_catform': 'Nature/Cat Face',
    'ability_druid_challangingroar': 'Nature/Roar',
    'ability_druid_dash': 'Utility/Dash',
    'ability_druid_demoralizingroar': 'Nature/Roar',
    'ability_druid_earthandsky': 'Nature/Nature Primal',
    'ability_druid_enrage': 'General/Rage',
    'ability_druid_ferociousbite': 'Nature/Claw Marks',
    'ability_druid_flightform': 'Nature/Ethereal Bird',
    'ability_druid_primalprecision': 'Nature/Claw Marks',
    'ability_druid_rake': 'Nature/Claw Marks',
    'ability_druid_ravage': 'Nature/Claw Marks',
    'ability_druid_starfall': 'Arcane/Star Trail Path',
    'ability_druid_supriseattack': 'Piercing/Backstab',
    'ability_druid_treeoflife': 'Nature/Tree',
    'ability_druid_wildmark': 'Nature/Beast Mark',

    // ===== ABILITY - HUNTER =====
    'ability_hunter_aimedshot': 'Piercing/Focused Arrow Shot',
    'ability_hunter_aspectoftheviper': 'Nature/Sense',
    'ability_hunter_beastcall': 'Nature/Spawn',
    'ability_hunter_beastmastery': 'Nature/Tiger Spirit',
    'ability_hunter_charge': 'Utility/Dash',
    'ability_hunter_markedfordeath': 'Piercing/Targeted Strike',
    'ability_hunter_mastermarksman': 'Piercing/On the Mark',
    'ability_hunter_pet_bat': 'Nature/Ethereal Bird',
    'ability_hunter_pet_bear': 'Nature/Roaring Bear',
    'ability_hunter_pet_cat': 'Nature/Cat Face',
    'ability_hunter_pet_chimera': 'Nature/Ethereal Bird',
    'ability_hunter_pet_dragonhawk': 'Nature/Ethereal Bird',
    'ability_hunter_pet_wolf': 'Nature/Wolf Dash',
    'ability_hunter_rapidkilling': 'Piercing/Rapid Arrows',
    'ability_hunter_sentinelowl': 'Nature/Owl',
    'ability_hunter_snipershot': 'Piercing/Focused Arrow Shot',

    // ===== ABILITY - PALADIN =====
    'ability_paladin_blessedhands': 'Healing/Reaching Hand',

    // ===== ABILITY - MAGE =====
    'ability_mage_firestarter': 'Fire/Burning Ember',

    // ===== ABILITY - PARRY =====
    'ability_parry': 'Utility/Parry',

    // ===== ABILITY - HEROICLEAP =====
    'ability_heroicleap': 'Utility/Upward Jump',

    // ===== ABILITY - GHoul FRENZY =====
    'ability_ghoulfrenzy': 'Necrotic/Speeding Skull',

    // ===== INV - MISC =====
    'inv_inscription_tarot_repose': 'Utility/Rest',
    'inv_misc_bomb_05': 'Utility/Bomb',
    'inv_misc_bomb_08': 'Utility/Orange Bomb',
    'inv_misc_bone_humanskull_02': 'Necrotic/Necrotic Skull',
    'inv_misc_bone_skull_02': 'Necrotic/Skull 2',
    'inv_misc_book_11': 'Utility/Ornate Staff',
    'inv_misc_coin_01': 'Utility/Utility',
    'inv_misc_coin_02': 'Utility/Utility',
    'inv_misc_coin_05': 'Utility/Utility',
    'inv_misc_coin_17': 'Utility/Utility',
    'inv_misc_coin_18': 'Utility/Utility',
    'inv_misc_dice_01': 'Social/Dice Roll',
    'inv_misc_dice_02': 'Social/Dice Roll',
    'inv_misc_enggizmos_25': 'Utility/Strange Brew',
    'inv_misc_enggizmos_27': 'Utility/Utility Tool',
    'inv_misc_enggizmos_30': 'Utility/Utility Tool',
    'inv_misc_enggizmos_32': 'Utility/Utility Tool',
    'inv_misc_gem_crystal_01': 'Utility/Glowing Shard',
    'inv_misc_gem_diamond_01': 'Utility/Glowing Shard',
    'inv_misc_herb_felblossom': 'Nature/Single Leaf',
    'inv_misc_monsterspidercarapace_01': 'Nature/Web',
    'inv_misc_orb_05': 'Arcane/Orb Manipulation',
    'inv_misc_platnumdisks': 'Utility/Utility',
    'inv_misc_tarot_01': 'Utility/Utility',
    'inv_misc_ticket_tarot_ascension': 'Radiant/Divine Ascension',
    'inv_misc_ticket_tarot_blessings': 'Radiant/Divine Blessing',
    'inv_misc_ticket_tarot_madness': 'Psychic/Mental Chaos',
    'inv_misc_ticket_tarot_stack': 'Utility/Utility',
    'inv_misc_ticket_tarot_vengeance': 'Slashing/Crossed Swords',
    'inv_potion_24': 'Utility/Strange Brew',
    'inv_potion_53': 'Healing/Cure Within',
    'inv_potion_54': 'Poison/Poison Flask',
    'inv_sword_04': 'Slashing/Sword Pierce',
    'inv_throwingknife_04': 'Piercing/Thrown Dagger',
    'inv_valentinescard02': 'Social/Social',
    'inv_weapon_glaive_01': 'Slashing/Curved Blade',

    // ===== INV - CREATURE DISEASE/POISON =====
    'ability_creature_disease_01': 'Poison/Poison Contagion',
    'ability_creature_disease_05': 'Poison/Poison Contagion',
    'ability_creature_poison_05': 'Poison/Poison Venom',
    'ability_creature_poison_06': 'Poison/Deadly Poison',

    // ===== ADDITIONAL ARCANE =====
    'spell_arcane_arcane03': 'Arcane/Enchanted Blade',
    'spell_arcane_arcaneresilience': 'Arcane/Channeling Stance',
    'spell_arcane_manatap': 'Arcane/Orb Manipulation',
    'spell_arcane_massdispel': 'Arcane/Magical Cross Emblem 2',
    'spell_arcane_missiles': 'Arcane/Missile',
    'spell_arcane_polymorph': 'Arcane/Conjure Elements',
    'spell_arcane_portaldalaran': 'Arcane/Portal Archway',
    'spell_arcane_portaldarnassus': 'Arcane/Open Portal',
    'spell_arcane_rune': 'Arcane/Abstract Rune',
    'spell_arcane_teleportorgrimmar': 'Arcane/Quick Step',
    'spell_arcane_teleportundercity': 'Arcane/Quick Step',

    // ===== ADDITIONAL FIRE =====
    'spell_fire_bluefire': 'Fire/Fire Orb',
    'spell_fire_felfire': 'Fire/Hellfire',
    'spell_fire_felhellfire': 'Fire/Infernal Fire',
    'spell_fire_firearmor': 'Fire/Flame Shield',
    'spell_fire_fireballgreen': 'Fire/Fiery Demon',
    'spell_fire_fireblast': 'Fire/Flame Burst',
    'spell_fire_flamestrike': 'Fire/Flame Circle',
    'spell_fire_innerfire': 'Fire/Flame Aura',
    'spell_fire_moltenblood': 'Fire/Dripping Lava',
    'spell_fire_playingwithfire': 'Fire/Firey Dedication',
    'spell_fire_soulburn': 'Fire/Burning Ember',
    'spell_fire_smokecloud': 'Fire/Smoking',
    'spell_fire_twilightfireward': 'Fire/Flame Shield',

    // ===== ADDITIONAL FROST =====
    'spell_frost_icebarrier': 'Frost/Icy Shield',
    'spell_frost_summonwaterelemental': 'Frost/Frost Manipulation',
    'spell_frost_waterbolt': 'Frost/Conjure Water',
    'spell_frost_wisp': 'Frost/Snowflake',

    // ===== ADDITIONAL HOLY / RADIANT =====
    'spell_holy_auraoflight': 'Radiant/Radiant Aura',
    'spell_holy_avenginewrath': 'Radiant/Radiant Warrior',
    'spell_holy_blessed': 'Radiant/Divine Blessing',
    'spell_holy_blessedlife': 'Healing/Golden Heart',
    'spell_holy_blessedresillience': 'Utility/Resistance',
    'spell_holy_circleofrenewal': 'Healing/Renewal',
    'spell_holy_counterspell': 'Arcane/Magical Cross Emblem 2',
    'spell_holy_crusade': 'Radiant/Radiant Warrior',
    'spell_holy_devotion': 'Radiant/Divine Blessing',
    'spell_holy_divinehymn': 'Healing/Prayer',
    'spell_holy_exorcism': 'Radiant/Divine Beam',
    'spell_holy_harmundeadaura': 'Necrotic/Protective Aura',
    'spell_holy_heal02': 'Healing/Golden Heart',
    'spell_holy_healingaura': 'Healing/Heart Ripple',
    'spell_holy_healingtouch': 'Healing/Heal Wound',
    'spell_holy_heroism': 'Radiant/Radiant Divinity',
    'spell_holy_mageaura': 'Arcane/Spellcasting Aura',
    'spell_holy_magicalsentry': 'Utility/Watchful Eye',
    'spell_holy_mindsoothe': 'Psychic/Mental Blessing',
    'spell_holy_mindvision': 'Psychic/Mind Read',
    'spell_holy_painsupression': 'Psychic/Psionic Blessing',
    'spell_holy_prayerofmendingtga': 'Healing/Prayer',
    'spell_holy_prayerofspirit': 'Radiant/Divine Radiance',
    'spell_holy_prophecy': 'Psychic/Spectral Seer',
    'spell_holy_purifyingpower': 'Radiant/Radiant Divinity',
    'spell_holy_removecurse': 'Healing/Cure Within',
    'spell_holy_righteousnessaura': 'Radiant/Radiant Aura',
    'spell_holy_sanctuary': 'Radiant/Radiant Golden Shield',
    'spell_holy_sealofvalor': 'Radiant/Radiant Warrior',
    'spell_holy_sealofwrath': 'Radiant/Radiant Sunburst',
    'spell_holy_weaponmastery': 'Slashing/Crossed Swords',
    'spell_holy_wordfortitude': 'Radiant/Radiant Light 1',
    'spell_holy_greaterblessingoflight': 'Radiant/Radiant Glow',
    'spell_holy_greaterblessingofsanctuary': 'Radiant/Radiant Golden Shield',
    'spell_holy_greaterblessingofwisdom': 'Psychic/Focused Mind',

    // ===== ADDITIONAL NATURE =====
    'spell_nature_chainlightning': 'Lightning/Lightning Bolt',
    'spell_nature_crystalball': 'Psychic/Hypnotic Eye',
    'spell_nature_earthshock': 'Nature/Earth Shatter',
    'spell_nature_elementalabsorption': 'Nature/Earth Shield',
    'spell_nature_elementalprecision_1': 'Nature/Centered',
    'spell_nature_elementalshields': 'Nature/Earth Shield',
    'spell_nature_giftofthewaterspirit': 'Nature/Nature Natural',
    'spell_nature_invisibilty': 'Utility/Hide',
    'spell_nature_lightningoverload': 'Lightning/Lightning Burst',
    'spell_nature_mirrorimage': 'Arcane/Ebon Blaze',
    'spell_nature_natureguard': 'Nature/Nature Natural',
    'spell_nature_naturesblessing': 'Nature/Growth',
    'spell_nature_naturetouchdecay': 'Necrotic/Corruption',
    'spell_nature_ravenform': 'Nature/Ethereal Bird',
    'spell_nature_regenerate': 'Healing/Renewal',
    'spell_nature_regeneration': 'Healing/Renewal',
    'spell_nature_removecurse': 'Healing/Cure Within',
    'spell_nature_riptide': 'Healing/Heart Ripple',
    'spell_nature_sentinal': 'Nature/Ethereal Bird',
    'spell_nature_skinofearth': 'Nature/Earth Shield',
    'spell_nature_slow': 'Utility/Slow Speed',
    'spell_nature_slowingtotem': 'Utility/Slow Speed',
    'spell_nature_swiftness': 'Utility/Speed Boot',
    'spell_nature_thunderclap': 'Lightning/Thunder',
    'spell_nature_unrelentingstorm': 'Lightning/Lightning Storm',
    'spell_nature_web': 'Nature/Web',

    // ===== ADDITIONAL SHADOW / NECROTIC =====
    'spell_shadow_armorofthedark': 'Void/Consumed by Void',
    'spell_shadow_auraofdarkness': 'Void/Consumed by Void',
    'spell_shadow_bloodrain': 'Necrotic/Blood Skull',
    'spell_shadow_coneofsilence': 'Psychic/Mind Control',
    'spell_shadow_creepingplague': 'Poison/Poison Plague',
    'spell_shadow_curseoftoungues': 'Psychic/Mind Control',
    'spell_shadow_deadofnight': 'Void/Consumed by Void',
    'spell_shadow_demonform': 'Necrotic/Transform Demon',
    'spell_shadow_enslavedemon': 'Necrotic/Spectral Summoning',
    'spell_shadow_eyeofkilrogg': 'Utility/All Seeing Eye',
    'spell_shadow_felarmour': 'Utility/Resistance',
    'spell_shadow_fingerofdeath': 'Necrotic/Death Mark',
    'spell_shadow_focusedpower': 'Psychic/Psionic Strike',
    'spell_shadow_grimward': 'Necrotic/Ghostly Menace',
    'spell_shadow_haunting': 'Necrotic/Ghostly Menace',
    'spell_shadow_improvedvampiricembrace': 'Necrotic/Empowering Aura',
    'spell_shadow_manaburn': 'Arcane/Orb Manipulation',
    'spell_shadow_mindrot': 'Psychic/Mental Chaos',
    'spell_shadow_psychichorrors': 'Psychic/Agonizing Scream',
    'spell_shadow_ragingscream': 'Psychic/Agonizing Scream',
    'spell_shadow_rainoffire': 'Fire/Fire Storm',
    'spell_shadow_requiem': 'Necrotic/Necrotic Skull',
    'spell_shadow_ritualofsacrifice': 'Necrotic/Ritual',
    'spell_shadow_shadowworddominate': 'Psychic/Mind Control',
    'spell_shadow_soulburn': 'Fire/Burning Ember',
    'spell_shadow_soulgem': 'Utility/Glowing Shard',
    'spell_shadow_summonfelguard': 'Utility/Summon Minion',
    'spell_shadow_summonfelhunter': 'Utility/Summon Minion',
    'spell_shadow_summonimp': 'Utility/Summon Minion',
    'spell_shadow_summonvoidwalkers': 'Utility/Summon Minion',
    'spell_shadow_telepathy': 'Psychic/Telepathic',
    'spell_shadow_teleport': 'Arcane/Quick Step',

    // ===== ADDITIONAL ABILITY - WARRIOR =====
    'ability_warrior_bloodfrenzy': 'General/Fiery Rage',
    'ability_warrior_bloodsword': 'Slashing/Bloody Sword',
    'ability_warrior_challange': 'Utility/Overlords Command',
    'ability_warrior_colossussmash': 'Bludgeoning/Mortal Strike',
    'ability_warrior_endurance': 'Utility/Resistance',
    'ability_warrior_punishingblow': 'Bludgeoning/Mortal Strike',
    'ability_warrior_riposte': 'Utility/Parry',
    'ability_warrior_shieldbash': 'Utility/Shield',
    'ability_warrior_shieldbreak': 'Utility/Shattered Surface',
    'ability_warrior_sunder': 'Slashing/Cleave',

    // ===== ADDITIONAL ABILITY - ROGUE =====
    'ability_rogue_backstab': 'Piercing/Backstab',
    'ability_rogue_combatreadiness': 'Utility/Parry',
    'ability_rogue_daggersofexpertise': 'Piercing/Crossed Daggers',
    'ability_rogue_deadliness': 'Piercing/Dagger Pierce',
    'ability_rogue_deadlypoison': 'Poison/Poison Venom',
    'ability_rogue_deceive': 'Social/Careful Blunder',
    'ability_rogue_deviouspoisons': 'Poison/Poison Contagion',
    'ability_rogue_disembowel': 'Piercing/Piercing Pierce',
    'ability_rogue_disguise': 'Utility/Hide',
    'ability_rogue_distract': 'Utility/Hide',
    'ability_rogue_evasion': 'Utility/Phantom Dash',
    'ability_rogue_findweakness': 'Piercing/Targeted Strike',
    'ability_rogue_quickrecovery': 'Healing/Renewal',
    'ability_rogue_stealth': 'Utility/Hide',
    'ability_rogue_trip': 'General/Trip',
    'ability_rogue_disembowel': 'Piercing/Piercing Pierce',

    // ===== ADDITIONAL ABILITY - DRUID =====
    'ability_druid_challenge': 'Nature/Roar',
    'ability_druid_disembowel': 'Nature/Claw Marks',
    'ability_druid_forceofnature': 'Nature/Nature Primal',
    'ability_druid_lacerate': 'Nature/Claw Marks',
    'ability_druid_naturalperfection': 'Nature/Centered',
    'ability_druid_predatoryinstincts': 'Nature/Tiger Spirit',
    'ability_druid_prowl': 'Utility/Hide',
    'ability_druid_primaltenacity': 'Utility/Resistance',
    'ability_druid_tigersroar': 'Nature/Roar',
    'ability_druid_typhoon': 'Nature/Tornado Vortex',

    // ===== ADDITIONAL ABILITY - HUNTER =====
    'ability_hunter_animalhandler': 'Nature/Tiger Spirit',
    'ability_hunter_aspectofthehawk': 'Utility/Watchful Eye',
    'ability_hunter_assassinate': 'Piercing/Targeted Strike',
    'ability_hunter_beastcall02': 'Nature/Spawn',
    'ability_hunter_beastsoothe': 'Nature/Nature Natural',
    'ability_hunter_camouflage': 'Utility/Hide',
    'ability_hunter_catlikereflexes': 'Utility/Phantom Dash',
    'ability_hunter_combatexperience': 'Utility/Empowered Warrior',
    'ability_hunter_eagleeye': 'Utility/Watchful Eye',
    'ability_hunter_focusedaim': 'Piercing/On the Mark',
    'ability_hunter_huntervswild': 'Nature/Tiger Spirit',
    'ability_hunter_masterscall': 'Nature/Roar',
    'ability_hunter_multishot': 'Piercing/Scatter Shot',
    'ability_hunter_pet_spider': 'Nature/Web',
    'ability_hunter_piercingshots': 'Piercing/Bleeding Arrow',
    'ability_hunter_scentoftheblood': 'Utility/Bloodshot Eye',
    'ability_hunter_track': 'Nature/Sense',

    // ===== ADDITIONAL ABILITY - MISC =====
    'ability_creature_poison_01': 'Poison/Poison Venom',
    'ability_dualwield': 'Slashing/Dual Blades',
    'ability_duelist': 'Slashing/Crossed Swords',
    'ability_meleedamage': 'Slashing/Crossed Swords',
    'ability_monk_palmstrike': 'Bludgeoning/Fist Strike',
    'ability_mount_jungletiger': 'Nature/Tiger Spirit',
    'ability_mount_undeadhorse': 'Necrotic/Bloody Horse Skull',
    'ability_paladin_judgementofthepure': 'Radiant/Divine Blessing',
    'ability_paladin_judgementsofthejust': 'Radiant/Radiant Warrior',
    'ability_racial_cannibalize': 'Necrotic/Devour',
    'ability_warlock_demonicpower': 'Necrotic/Demonic Empowerment',

    // ===== ADDITIONAL INV - MISC =====
    'inv_battery_02': 'Utility/Glowing Orb',
    'inv_belt_01': 'Utility/Utility Tool',
    'inv_crown_01': 'Social/Golden Crown',
    'inv_fabric_linen_01': 'Utility/Utility Tool',
    'inv_fabric_silk_01': 'Utility/Utility Tool',
    'inv_hammer_20': 'Bludgeoning/Hammer',
    'inv_ingot_03': 'Utility/Glowing Shard',
    'inv_ingot_iron': 'Utility/Glowing Shard',
    'inv_ingot_silver': 'Utility/Glowing Shard',
    'inv_jewelry_necklace_01': 'Utility/Gem And Gold Chains',
    'inv_jewelry_necklace_07': 'Utility/Gem And Gold Chains',
    'inv_jewelry_ring_05': 'Utility/Gem And Gold Chains',
    'inv_jewelry_talisman_07': 'Utility/Gem And Gold Chains',
    'inv_misc_bag_10': 'Utility/Utility Tool',
    'inv_misc_bell_01': 'Radiant/Golden Bell',
    'inv_misc_bomb_04': 'Utility/Bomb',
    'inv_misc_book_08': 'Utility/Ornate Staff',
    'inv_misc_book_09': 'Utility/Ornate Staff',
    'inv_misc_coin_03': 'Utility/Utility',
    'inv_misc_coin_06': 'Utility/Utility',
    'inv_misc_dust_01': 'Utility/Utility Tool',
    'inv_misc_dust_02': 'Utility/Utility Tool',
    'inv_misc_dust_04': 'Utility/Utility Tool',
    'inv_misc_enggizmos_01': 'Utility/Utility Tool',
    'inv_misc_enggizmos_02': 'Utility/Utility Tool',
    'inv_misc_enggizmos_03': 'Utility/Utility Tool',
    'inv_misc_enggizmos_04': 'Utility/Utility Tool',
    'inv_misc_gem_amethyst_02': 'Utility/Glowing Shard',
    'inv_misc_gem_ruby_01': 'Utility/Glowing Shard',
    'inv_misc_gear_01': 'Utility/Utility Gear',
    'inv_misc_gear_02': 'Utility/Utility Gear',
    'inv_misc_gear_03': 'Utility/Utility Gear',
    'inv_misc_herb_03': 'Nature/Single Leaf',
    'inv_misc_herb_07': 'Nature/Single Leaf',
    'inv_misc_herb_16': 'Nature/Seeds',
    'inv_misc_orb_01': 'Arcane/Orb Manipulation',
    'inv_misc_powder_purple': 'Utility/Utility Tool',
    'inv_misc_powder_red': 'Utility/Utility Tool',
    'inv_misc_powder_yellow': 'Utility/Utility Tool',
    'inv_misc_punchcards_yellow': 'Utility/Utility Tool',
    'inv_misc_rune_01': 'Arcane/Abstract Rune',
    'inv_misc_scalesofjustice': 'Radiant/Radiant Divinity',
    'inv_misc_stonetablet_04': 'Utility/Ornate Symbol',
    'inv_misc_wire': 'Utility/Wires',
    'inv_misc_wrench_01': 'Utility/Utility Tool',
    'inv_misc_wrench_02': 'Utility/Utility Tool',
    'inv_scroll_02': 'Utility/Ornate Staff',
    'inv_scroll_03': 'Utility/Ornate Staff',
    'inv_shield_05': 'Utility/Shield',

    // ===== ADDITIONAL MAGIC / MISC SPELLS =====
    'spell_lightning_lightningbolt01': 'Lightning/Lightning Bolt',
    'spell_magic_lesserinvisibilty': 'Utility/Hide',
    'spell_magic_magearmor': 'Arcane/Channeling Stance',
    'spell_magic_polymorphrabbit': 'Arcane/Conjure Elements',
    'spell_misc_drink': 'Utility/Strange Brew',

    // ===== ACHIEVEMENT ICONS =====
    'achievement_boss_archmagearugal': 'Arcane/Magical Staff',
    'achievement_boss_kiljaedan': 'Necrotic/Demonic Empowerment',
    'achievement_character_human_male': 'Utility/Armored Warrior',
    'achievement_dungeon_icecrown_frostmourne': 'Slashing/Sword Pierce',

    // ===== BACKSTAB =====
    'ability_backstab': 'Piercing/Backstab',

    // ===== LEGACY FALLBACKS =====
    'inv_misc_questionmark': 'Utility/Utility',
    'inv_misc_book_07': 'Utility/Ornate Staff',
    'inv_misc_bag_08': 'Utility/Utility',
  };

  return iconMapping[wowIconId] || null;
};

/**
 * Get ability icon URL
 * @param {string} iconId - Icon identifier (can be a path like "Utility/Icon Name" or "combat/sword" or legacy WoW icon ID)
 * @returns {string} - URL to ability icon
 */
export const getAbilityIconUrl = (iconId) => {
  if (!iconId) {
    return getCustomIconUrl('Utility/Utility', 'abilities');
  }

  // Handle items/ prefix by switching category to items
  if (typeof iconId === 'string' && iconId.startsWith('items/')) {
    return getIconUrl(iconId.replace('items/', ''), 'items');
  }

  // If iconId already contains a path (e.g., "Utility/Icon Name" or "combat/sword")
  if (iconId.includes('/') && !iconId.startsWith('http')) {
    // Check if it already has the creature- prefix
    const pathParts = iconId.split('/');
    const fileName = pathParts[pathParts.length - 1];
    if (fileName.startsWith('creature-')) {
      // Already has prefix, use as-is
      return getCustomIconUrl(iconId, 'abilities');
    }

    // First, try the path as-is (for properly formatted paths like "Utility/Icon Name")
    // This handles paths that are already correctly formatted
    const directPath = getCustomIconUrl(iconId, 'abilities');

    // For backwards compatibility with lowercase folder names (e.g., "utility/icon-name"),
    // try adding the creature- prefix only if the folder is lowercase
    const folder = pathParts[0];
    const rest = pathParts.slice(1).join('/');

    // If folder is capitalized (e.g., "Utility"), use path as-is
    if (folder[0] === folder[0].toUpperCase()) {
      return directPath;
    }

    // For lowercase folders (legacy creature ability paths), add creature- prefix
    // combat/demonic-warrior -> combat/creature-combat-demonic-warrior
    const prefixedPath = `${folder}/creature-${folder}-${rest}`;
    return getCustomIconUrl(prefixedPath, 'abilities');
  }

  // If it's a legacy WoW icon ID (starts with inv_, spell_, ability_, etc.), 
  // try to map it to an ability icon
  if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
    // First, try the mapping function
    const mappedIcon = convertWowIconToAbilityIcon(iconId);
    if (mappedIcon) {
      return getCustomIconUrl(mappedIcon, 'abilities');
    }

    // If no mapping found, use a safe local fallback to prevent flickering
    // Use Utility/Utility as the default fallback instead of trying to construct paths
    return getCustomIconUrl('Utility/Utility', 'abilities');
  }

  // Otherwise, try to find the icon as a root-level file in the abilities folder
  // Many icons are stored at the root (e.g., "Shadow Beast.png", "Rock Throw.png")
  // Some were moved to General/ (e.g., "Stealth", "Leap Mountain")
  return getCustomIconUrl(iconId, 'abilities');
};

/**
 * Get WoW icon URL (legacy fallback)
 * @param {string} iconId - WoW icon identifier
 * @returns {string} - URL to WoW icon
 */
export const getWowIconUrl = (iconId) => {
  // In development, use proxy to avoid CORS issues
  if (process.env.NODE_ENV === 'development') {
    return `/api/wow-icons/${iconId}.jpg`;
  }
  // In production, use direct URL
  return `${ASSET_PATHS.wow}${iconId}.jpg`;
};

/**
 * Get a default creature icon based on creature type
 * @param {string} creatureType - The type of creature (e.g., 'dragon', 'humanoid', 'undead')
 * @returns {string} - Default creature icon path
 */
export const getDefaultCreatureIconByType = (creatureType) => {
  const typeToIconMap = {
    'dragon': 'Demon/Icon1',
    'humanoid': 'Human/Icon1',
    'undead': 'Undead/Icon1',
    'beast': 'Monsters/Icon1',
    'fiend': 'Demon/Icon1',
    'fey': 'Fairy/Icon1',
    'aberration': 'Monsters/Icon1',
    'celestial': 'Elves/Icon1',
    'construct': 'Dwarf/Icon1',
    'elemental': 'Monsters/Icon1',
    'giant': 'Dwarf/Icon1',
    'monstrosity': 'Monsters/Icon1',
    'ooze': 'Monsters/Icon1',
    'plant': 'Monsters/Icon1'
  };

  return typeToIconMap[creatureType?.toLowerCase()] || 'Human/Icon1';
};

/**
 * Get creature token icon URL - handles both creature icon paths and legacy WoW icons
 * @param {string} iconId - Icon identifier (can be creature path like "Dark Elf/Icon1" or WoW icon ID)
 * @param {string} creatureType - Optional creature type for fallback icon selection
 * @returns {string} - URL to creature icon
 */
export const getCreatureTokenIconUrl = (iconId, creatureType = null) => {
  // Handle null, undefined, or empty string - use a default creature icon based on type
  if (!iconId || (typeof iconId === 'string' && iconId.trim() === '')) {
    const defaultIcon = getDefaultCreatureIconByType(creatureType);
    const url = getCustomIconUrl(defaultIcon, 'creatures');
    return url;
  }

  // Known creature icon folders - these are actual creature icon paths
  const creatureFolders = [
    'Dark Elf', 'Demon', 'Dwarf', 'Elves', 'Fairy', 'Halfling', 'Human',
    'Kobolds', 'Monsters', 'More Demons', 'More Elves', 'More Humans',
    'More Monsters', 'More Undead', 'Orc and Goblins', 'Pirates', 'Undead'
  ];

  // Known ability icon folders - these should be converted to creature icons
  const abilityFolders = ['combat', 'defensive', 'magic', 'movement', 'social', 'utility'];

  // If iconId contains a '/', check if it's a creature icon or ability icon
  if (iconId.includes('/')) {
    const firstSegment = iconId.split('/')[0];

    // Check if it's an ability icon path (e.g., "combat/beast-paw-claws")
    // Convert it to a creature icon based on creature type
    if (abilityFolders.includes(firstSegment)) {
      // Convert ability icon to creature icon based on type
      const defaultIcon = getDefaultCreatureIconByType(creatureType);
      const url = getCustomIconUrl(defaultIcon, 'creatures');
      return url;
    }

    // Check if it's a known creature folder (e.g., "Dark Elf/Icon1", "Human/Icon1")
    if (creatureFolders.some(folder => iconId.startsWith(folder + '/'))) {
      const url = getCustomIconUrl(iconId, 'creatures');
      return url;
    }

    // Unknown path structure - try as creature icon first, fallback to default
    const url = getCustomIconUrl(iconId, 'creatures');
    return url;
  }

  // If it's a legacy WoW icon ID, use a creature icon fallback instead
  // This ensures all creatures show creature icons, not WoW icons
  if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
    const defaultIcon = getDefaultCreatureIconByType(creatureType);
    const url = getCustomIconUrl(defaultIcon, 'creatures');
    return url;
  }

  // Otherwise, try as ability icon (for backwards compatibility)
  // But fall back to a creature icon if it's not a valid ability icon path
  if (iconId.includes('/')) {
    return getAbilityIconUrl(iconId);
  }

  // Final fallback to creature icon
  const defaultIcon = getDefaultCreatureIconByType(creatureType);
  const url = getCustomIconUrl(defaultIcon, 'creatures');
  return url;
};

/**
 * Check if custom icon exists
 * @param {string} iconId - Icon identifier
 * @param {string} category - Icon category
 * @returns {Promise<boolean>} - Whether custom icon exists
 */
export const customIconExists = async (iconId, category) => {
  try {
    const url = getCustomIconUrl(iconId, category);
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Smart icon loader with fallback chain
 * @param {string} iconId - Icon identifier
 * @param {string} category - Icon category
 * @returns {Promise<string>} - Final icon URL to use
 */
export const loadIconWithFallback = async (iconId, category = 'ui') => {
  if (!iconId) {
    return getCustomIconUrl(FALLBACK_ICONS[category], category);
  }

  // Try custom icon first
  const customExists = await customIconExists(iconId, category);
  if (customExists) {
    return getCustomIconUrl(iconId, category);
  }

  // For items category, never use WoW icons - only use local fallback
  if (category === 'items') {
    return getCustomIconUrl('Misc/Books/book-brown-teal-question-mark', category);
  }

  // Try WoW icon as fallback (only for non-items)
  try {
    const wowUrl = getWowIconUrl(iconId);
    const response = await fetch(wowUrl, { method: 'HEAD' });
    if (response.ok) {
      return wowUrl;
    }
  } catch (error) {
    // WoW icon failed, use fallback
  }

  // Use fallback icon
  return getCustomIconUrl(FALLBACK_ICONS[category], category);
};

/**
 * Batch preload icons for better performance
 * @param {Array} iconList - Array of {iconId, category} objects
 * @returns {Promise<Object>} - Map of iconId to final URL
 */
export const preloadIcons = async (iconList) => {
  const iconMap = {};

  const promises = iconList.map(async ({ iconId, category }) => {
    const url = await loadIconWithFallback(iconId, category);
    iconMap[iconId] = url;
  });

  await Promise.all(promises);
  return iconMap;
};

/**
 * Migration helper - convert WoW icon ID to custom icon name
 * @param {string} wowIconId - WoW icon identifier
 * @param {string} category - Target category
 * @returns {string} - Suggested custom icon name
 */
export const convertWowIconToCustom = (wowIconId, category) => {
  // Remove common WoW prefixes and convert to custom naming
  const cleanId = wowIconId
    .replace(/^(inv_|spell_|ability_)/, '')
    .replace(/_/g, '_')
    .toLowerCase();

  return `${category}_${cleanId}`;
};

// Export for backward compatibility
export default {
  getIconUrl,
  getCustomIconUrl,
  getWowIconUrl,
  getAbilityIconUrl,
  getCreatureTokenIconUrl,
  getDefaultCreatureIconByType,
  loadIconWithFallback,
  preloadIcons,
  customIconExists,
  convertWowIconToCustom,
  ASSET_PATHS,
  FALLBACK_ICONS
};
