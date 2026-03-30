import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { getIconUrl } from '../../../../utils/assetManager';
import './ClutterLootGenerator.css';

// Map category WoW icon IDs to appropriate custom icon paths
const getCategoryIconPath = (categoryKey, wowIconId) => {
  // Category-specific icon mappings - manually selected fitting icons for each category
  const categoryIconMap = {
    humanoid: 'Misc/Monster Parts/Bones/bone-human-skull-three-quarter-view', // Humanoid trash - use human skull icon
    beast: 'Misc/Monster Parts/Horns/horn-curved-brown-orange-segmented', // Beast parts - use curved horn icon
    dungeon: 'Misc/Monster Parts/Coins', // Dungeon debris - use coins icon
    magical: 'Misc/Profession Resources/Enchanting/resource-blue-flowing-shard-lightning' // Magical remnants - use magical shard icon
  };

  // If we have a specific mapping for this category, use it
  if (categoryIconMap[categoryKey]) {
    return getIconUrl(categoryIconMap[categoryKey], 'items');
  }

  // Otherwise, try to convert the WoW icon ID to a local icon
  return getIconUrl(wowIconId, 'items');
};

// Clutter loot categories with predefined items
const CLUTTER_CATEGORIES = {
  humanoid: {
    name: 'Humanoid Trash',
    icon: 'inv_misc_bone_humanskull_01',
    description: 'Common items carried by humanoid creatures',
    items: [
      {
        name: 'Tattered Cloth Scraps',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_fabric_wool_01',
        value: { gold: 0, silver: 0, copper: 25, platinum: 0 },
        description: 'Worn and dirty cloth scraps with little value.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Broken Dagger',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_weapon_shortblade_05',
        value: { gold: 0, silver: 1, copper: 50, platinum: 0 },
        description: 'A dull, broken dagger with a cracked handle.',
        width: 1,
        height: 2,
        stackable: false,
        weight: 0.5
      },
      {
        name: 'Rusty Lockpick',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_key_03',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'A bent and rusty lockpick, no longer useful.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Frayed Rope',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_rope_01',
        value: { gold: 0, silver: 1, copper: 25, platinum: 0 },
        description: 'A short length of frayed rope.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.2
      },
      {
        name: 'Bent Copper Ring',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_jewelry_ring_03',
        value: { gold: 0, silver: 2, copper: 0, platinum: 0 },
        description: 'A simple copper ring, bent out of shape.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.1
      },
      {
        name: 'Cracked Leather Belt',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_belt_04',
        value: { gold: 0, silver: 1, copper: 75, platinum: 0 },
        description: 'A worn leather belt with a cracked buckle.',
        width: 2,
        height: 1,
        stackable: false,
        weight: 0.3
      },
      {
        name: 'Dull Arrowhead',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_ammo_arrow_01',
        value: { gold: 0, silver: 0, copper: 35, platinum: 0 },
        description: 'A dull arrowhead, no longer sharp enough to be useful.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.1
      },
      {
        name: 'Chipped Mug',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_mug_01',
        value: { gold: 0, silver: 1, copper: 10, platinum: 0 },
        description: 'A chipped ceramic mug.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.2
      },
      {
        name: 'Torn Map Fragment',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_map02',
        value: { gold: 0, silver: 1, copper: 50, platinum: 0 },
        description: 'A torn fragment of a map, showing an unrecognizable location.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Broken Pocket Watch',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_pocketwatch_01',
        value: { gold: 0, silver: 3, copper: 0, platinum: 0 },
        description: 'A broken pocket watch, its hands frozen in time.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.2
      },
      {
        name: 'Stained Playing Cards',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_ticket_tarot_elemental_01',
        value: { gold: 0, silver: 0, copper: 75, platinum: 0 },
        description: 'A deck of stained and worn playing cards, missing several pieces.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 3,
        weight: 0.1
      },
      {
        name: 'Rusted Nail',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_wrench_01',
        value: { gold: 0, silver: 0, copper: 1, platinum: 0 },
        description: 'A single rusted nail, barely worth the effort to pick up.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 20,
        weight: 0.01
      },
      {
        name: 'Empty Tobacco Pouch',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_bag_10',
        value: { gold: 0, silver: 1, copper: 25, platinum: 0 },
        description: 'An empty leather pouch that once held tobacco.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.1
      },
      {
        name: 'Cracked Pipe Bowl',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_pipe_01',
        value: { gold: 0, silver: 0, copper: 50, platinum: 0 },
        description: 'A cracked clay pipe bowl, stained with old residue.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Faded Letter',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_letter_01',
        value: { gold: 0, silver: 0, copper: 25, platinum: 0 },
        description: 'A faded, crumpled letter with illegible writing.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.05
      },
      {
        name: 'Bent Spoon',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_spoon',
        value: { gold: 0, silver: 0, copper: 5, platinum: 0 },
        description: 'A bent metal spoon, warped from repeated use.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.05
      },
      {
        name: 'Tattered Blanket',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_cape_18',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'A tattered wool blanket, full of holes and stains.',
        width: 2,
        height: 2,
        stackable: false,
        weight: 0.8
      },
      {
        name: 'Broken Lantern',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_lantern_01',
        value: { gold: 0, silver: 2, copper: 50, platinum: 0 },
        description: 'A broken metal lantern with a shattered glass pane.',
        width: 1,
        height: 2,
        stackable: false,
        weight: 0.6
      }
    ]
  },
  beast: {
    name: 'Beast Parts',
    icon: 'inv_misc_monsterhorn_03',
    description: 'Parts and remains from beast creatures',
    items: [
      {
        name: 'Cracked Wolf Fang',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_bone_08',
        value: { gold: 0, silver: 1, copper: 25, platinum: 0 },
        description: 'A cracked wolf fang, no longer sharp.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Matted Fur Clump',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_pelt_wolf_01',
        value: { gold: 0, silver: 0, copper: 75, platinum: 0 },
        description: 'A clump of matted, dirty fur.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.1
      },
      {
        name: 'Broken Antler',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_horn_01',
        value: { gold: 0, silver: 1, copper: 50, platinum: 0 },
        description: 'A broken piece of antler.',
        width: 1,
        height: 2,
        stackable: false,
        weight: 0.3
      },
      {
        name: 'Dull Bear Claw',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_monsterclaw_04',
        value: { gold: 0, silver: 1, copper: 75, platinum: 0 },
        description: 'A worn bear claw, no longer sharp.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Tattered Wing Fragment',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_monsterscales_17',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'A fragment of a creature\'s wing, torn and useless.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Cracked Turtle Shell',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_shell_01',
        value: { gold: 0, silver: 2, copper: 0, platinum: 0 },
        description: 'A cracked piece of turtle shell.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.2
      },
      {
        name: 'Brittle Bone',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_bone_01',
        value: { gold: 0, silver: 0, copper: 50, platinum: 0 },
        description: 'A brittle bone fragment, easily crumbled.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.1
      },
      {
        name: 'Cloudy Eye',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_eye_01',
        value: { gold: 0, silver: 1, copper: 25, platinum: 0 },
        description: 'A cloudy, lifeless eye from some creature.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.1
      },
      {
        name: 'Torn Leather Hide',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_leatherscraps_01',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'A torn piece of leather hide, too damaged to be useful.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.2
      },
      {
        name: 'Broken Talon',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_monsterclaw_01',
        value: { gold: 0, silver: 1, copper: 50, platinum: 0 },
        description: 'A broken talon from a bird of prey.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Splintered Antler Shard',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_bone_02',
        value: { gold: 0, silver: 0, copper: 75, platinum: 0 },
        description: 'A splintered shard from a deer\'s antler.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 8,
        weight: 0.15
      },
      {
        name: 'Dried Insect Carapace',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_monsterscales_02',
        value: { gold: 0, silver: 0, copper: 25, platinum: 0 },
        description: 'The dried, brittle shell of a large insect.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 15,
        weight: 0.05
      },
      {
        name: 'Matted Animal Pelt',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_pelt_06',
        value: { gold: 0, silver: 1, copper: 25, platinum: 0 },
        description: 'A matted and filthy animal pelt, too damaged to be useful.',
        width: 2,
        height: 1,
        stackable: false,
        weight: 0.4
      },
      {
        name: 'Jagged Tooth',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_bone_04',
        value: { gold: 0, silver: 0, copper: 40, platinum: 0 },
        description: 'A jagged tooth from some predatory beast.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.08
      },
      {
        name: 'Cracked Hoof',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_bone_05',
        value: { gold: 0, silver: 0, copper: 35, platinum: 0 },
        description: 'A cracked hoof from a cloven animal.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 6,
        weight: 0.2
      },
      {
        name: 'Faded Feathers',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_feather_08',
        value: { gold: 0, silver: 0, copper: 15, platinum: 0 },
        description: 'A handful of faded, dull feathers.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 12,
        weight: 0.03
      },
      {
        name: 'Sticky Spider Silk',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_web_02',
        value: { gold: 0, silver: 0, copper: 20, platinum: 0 },
        description: 'A tangled mass of sticky spider silk.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 8,
        weight: 0.02
      },
      {
        name: 'Beast Hide Scrap',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_leatherscraps_03',
        value: { gold: 0, silver: 0, copper: 60, platinum: 0 },
        description: 'A scrap of tough beast hide, punctured and torn.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 7,
        weight: 0.25
      },
      {
        name: 'Petrified Eggshell',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_egg_05',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'The petrified shell of a large egg.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.3
      }
    ]
  },
  dungeon: {
    name: 'Dungeon Debris',
    icon: 'inv_misc_coin_17',
    description: 'Miscellaneous items found in dungeons and ruins',
    items: [
      {
        name: 'Crumbling Stone Fragment',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_stone_15',
        value: { gold: 0, silver: 0, copper: 50, platinum: 0 },
        description: 'A crumbling fragment of stone from an ancient structure.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.5
      },
      {
        name: 'Tarnished Silver Coin',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_coin_16',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'A tarnished silver coin from a forgotten era.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 20,
        weight: 0.1
      },
      {
        name: 'Faded Tapestry Scrap',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_fabric_purplefire_01',
        value: { gold: 0, silver: 1, copper: 25, platinum: 0 },
        description: 'A faded scrap of tapestry, once colorful but now dull.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Rusted Chain Links',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_chain_01',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'A few links of rusted chain.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.2
      },
      {
        name: 'Broken Pottery Shard',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_food_15',
        value: { gold: 0, silver: 0, copper: 75, platinum: 0 },
        description: 'A shard of broken pottery with faded designs.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.1
      },
      {
        name: 'Corroded Metal Fragment',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_ingot_03',
        value: { gold: 0, silver: 1, copper: 50, platinum: 0 },
        description: 'A corroded fragment of metal, its original purpose unknown.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.3
      },
      {
        name: 'Dusty Gemstone Shard',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_gem_amethyst_02',
        value: { gold: 0, silver: 2, copper: 50, platinum: 0 },
        description: 'A dusty shard of what was once a gemstone.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Moldy Book Page',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_book_09',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'A moldy page torn from an ancient book, the text illegible.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.1
      },
      {
        name: 'Bent Candle Holder',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_candle_02',
        value: { gold: 0, silver: 1, copper: 75, platinum: 0 },
        description: 'A bent metal candle holder, tarnished with age.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.3
      },
      {
        name: 'Cracked Glass Vial',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_potion_12',
        value: { gold: 0, silver: 1, copper: 25, platinum: 0 },
        description: 'A cracked glass vial, empty of whatever it once contained.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Rusted Chain Fragment',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_jewelry_necklace_01',
        value: { gold: 0, silver: 0, copper: 40, platinum: 0 },
        description: 'A fragment of rusted chain, once part of some ancient mechanism.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 8,
        weight: 0.15
      },
      {
        name: 'Weathered Tombstone Chip',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_stone_14',
        value: { gold: 0, silver: 0, copper: 30, platinum: 0 },
        description: 'A chipped piece from an ancient tombstone.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 6,
        weight: 0.4
      },
      {
        name: 'Charred Wood Fragment',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_tradeskillitem_03',
        value: { gold: 0, silver: 0, copper: 10, platinum: 0 },
        description: 'A charred fragment of wood from some long-burnt structure.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 12,
        weight: 0.08
      },
      {
        name: 'Bent Iron Key',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_key_04',
        value: { gold: 0, silver: 1, copper: 75, platinum: 0 },
        description: 'An old iron key, bent and no longer functional.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 4,
        weight: 0.1
      },
      {
        name: 'Pitted Bronze Coin',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_coin_02',
        value: { gold: 0, silver: 0, copper: 75, platinum: 0 },
        description: 'An ancient bronze coin, pitted with corrosion.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 15,
        weight: 0.05
      },
      {
        name: 'Frayed Tapestry Thread',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_fabric_linen_03',
        value: { gold: 0, silver: 0, copper: 20, platinum: 0 },
        description: 'A few threads pulled from an ancient tapestry.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 20,
        weight: 0.01
      },
      {
        name: 'Crumbled Mortar',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_dust_01',
        value: { gold: 0, silver: 0, copper: 5, platinum: 0 },
        description: 'Crumbs of ancient mortar from decaying walls.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 25,
        weight: 0.02
      },
      {
        name: 'Shattered Ceramic Bowl',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_bowl_01',
        value: { gold: 0, silver: 0, copper: 45, platinum: 0 },
        description: 'Pieces of a shattered ancient ceramic bowl.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 6,
        weight: 0.3
      },
      {
        name: 'Tarnished Pewter Button',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_button_01',
        value: { gold: 0, silver: 0, copper: 35, platinum: 0 },
        description: 'A tarnished pewter button from an old uniform.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.03
      }
    ]
  },
  magical: {
    name: 'Magical Remnants',
    icon: 'inv_enchant_dustarcane',
    description: 'Remnants of magical items and components',
    items: [
      {
        name: 'Faded Arcane Dust',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_enchant_dustarcane',
        value: { gold: 0, silver: 2, copper: 0, platinum: 0 },
        description: 'A small pile of faded arcane dust, its magical properties nearly depleted.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.1
      },
      {
        name: 'Cracked Mana Crystal',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_gem_sapphire_02',
        value: { gold: 0, silver: 3, copper: 0, platinum: 0 },
        description: 'A cracked mana crystal with only traces of power remaining.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.2
      },
      {
        name: 'Burnt Scroll Fragment',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_scroll_01',
        value: { gold: 0, silver: 1, copper: 75, platinum: 0 },
        description: 'A burnt fragment of a magical scroll, the spell lost to time.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Tarnished Rune Stone',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_rune_01',
        value: { gold: 0, silver: 2, copper: 50, platinum: 0 },
        description: 'A tarnished stone with a faded rune etched into its surface.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.3
      },
      {
        name: 'Depleted Wand Core',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_wand_01',
        value: { gold: 0, silver: 2, copper: 25, platinum: 0 },
        description: 'The core of a wand, depleted of all magical energy.',
        width: 1,
        height: 2,
        stackable: false,
        weight: 0.2
      },
      {
        name: 'Shattered Focus Crystal',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_gem_crystal_02',
        value: { gold: 0, silver: 3, copper: 50, platinum: 0 },
        description: 'A shattered crystal once used to focus magical energies.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.2
      },
      {
        name: 'Fizzled Enchantment Residue',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_enchant_dustillusion',
        value: { gold: 0, silver: 1, copper: 50, platinum: 0 },
        description: 'Residue from a fizzled enchantment, barely glowing with faint magic.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.1
      },
      {
        name: 'Warped Ley Line Fragment',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_elemental_crystal_water',
        value: { gold: 0, silver: 2, copper: 75, platinum: 0 },
        description: 'A warped fragment of solidified ley line energy.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.2
      },
      {
        name: 'Drained Mana Potion',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_potion_76',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'An empty mana potion vial with a few dried blue drops at the bottom.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Fractured Spell Focus',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_orb_04',
        value: { gold: 0, silver: 3, copper: 0, platinum: 0 },
        description: 'A fractured orb once used to focus spells, now inert.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.3
      },
      {
        name: 'Singed Spellbook Page',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_scroll_03',
        value: { gold: 0, silver: 1, copper: 50, platinum: 0 },
        description: 'A singed page from a spellbook, the runes barely legible.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 8,
        weight: 0.05
      },
      {
        name: 'Crumbled Crystal Shard',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_crystalfragment_01',
        value: { gold: 0, silver: 2, copper: 25, platinum: 0 },
        description: 'A crumbled shard of magical crystal, its power long faded.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 12,
        weight: 0.08
      },
      {
        name: 'Warped Wooden Staff',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_staff_08',
        value: { gold: 0, silver: 2, copper: 75, platinum: 0 },
        description: 'A warped wooden staff, twisted by unstable magic.',
        width: 1,
        height: 3,
        stackable: false,
        weight: 0.8
      },
      {
        name: 'Flickering Candle Stub',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_candle_03',
        value: { gold: 0, silver: 0, copper: 40, platinum: 0 },
        description: 'A stub of enchanted candle that flickers weakly.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 6,
        weight: 0.1
      },
      {
        name: 'Dulled Enchanted Blade',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_weapon_shortblade_07',
        value: { gold: 0, silver: 3, copper: 50, platinum: 0 },
        description: 'A dulled blade that once held magical enchantments.',
        width: 1,
        height: 2,
        stackable: false,
        weight: 0.6
      },
      {
        name: 'Petrified Herb Bundle',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_herb_01',
        value: { gold: 0, silver: 1, copper: 25, platinum: 0 },
        description: 'A bundle of herbs turned to stone by some failed ritual.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 4,
        weight: 0.15
      },
      {
        name: 'Shimmering Thread',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_fabric_soulcloth',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'A thread that occasionally shimmers with residual magic.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 15,
        weight: 0.02
      },
      {
        name: 'Cracked Elemental Core',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_elemental_crystal_shadow',
        value: { gold: 0, silver: 2, copper: 75, platinum: 0 },
        description: 'A cracked core that once contained elemental energy.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 3,
        weight: 0.25
      },
      {
        name: 'Faded Illusionary Cloth',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_fabric_moonrag',
        value: { gold: 0, silver: 1, copper: 50, platinum: 0 },
        description: 'A scrap of cloth that faintly shifts colors when viewed from the corner of your eye.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      }
    ]
  }
};

const ClutterLootGenerator = ({ onAddItems }) => {
  const [selectedCategory, setSelectedCategory] = useState('humanoid');
  const [quantity, setQuantity] = useState(1);
  const [dropChance, setDropChance] = useState(30);
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle adding clutter items to the loot table
  const handleAddClutterItems = () => {
    const category = CLUTTER_CATEGORIES[selectedCategory];
    const items = [];

    // Randomly select 'quantity' items from the category (1-8 items)
    const availableItems = [...category.items];
    for (let i = 0; i < quantity; i++) {
      if (availableItems.length === 0) break;

      // Select a random item
      const randomIndex = Math.floor(Math.random() * availableItems.length);
      const selectedItem = availableItems[randomIndex];

      // Remove the selected item to avoid duplicates
      availableItems.splice(randomIndex, 1);

      // Add the item to the list with a unique ID and the specified drop chance
      const junkTypeMap = {
        humanoid: 'cloth',
        beast: 'bones',
        dungeon: 'minerals',
        magical: 'trinkets'
      };

      // Create varied conditions for more realistic loot (20% intact, 50% damaged, 20% partial, 10% decaying)
      const getRandomCondition = () => {
        const conditions = ['intact', 'damaged', 'partial', 'decaying'];
        const weights = [0.2, 0.5, 0.2, 0.1]; // 20% intact, 50% damaged, 20% partial, 10% decaying

        const random = Math.random();
        let cumulativeWeight = 0;

        for (let i = 0; i < conditions.length; i++) {
          cumulativeWeight += weights[i];
          if (random <= cumulativeWeight) {
            return conditions[i];
          }
        }

        return 'damaged'; // fallback
      };

      items.push({
        ...selectedItem,
        id: `item-${uuidv4()}`,
        dropChance: dropChance,
        quality: 'poor', // Clutter items are always poor quality
        rarity: 'poor',
        // Set junk type and varied condition for the grey input boxes
        junkType: junkTypeMap[selectedCategory] || 'cloth',
        condition: getRandomCondition(),
        // Ensure imageUrl is set for display - use custom icons from items folder
        imageUrl: getIconUrl(selectedItem.iconId, 'items'),
        // Ensure rotation is set for grid placement
        rotation: 0,
        // Ensure required stats objects exist
        baseStats: {},
        combatStats: {},
        utilityStats: {}
      });
    }

    // Call the onAddItems callback with the generated items
    onAddItems(items);
    setIsExpanded(false);
  };

  return (
    <div className="clutter-loot-generator">
      <button
        className="clutter-toggle-button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <i className={`fas fa-${isExpanded ? 'times' : 'trash-alt'}`}></i>
        {isExpanded ? 'Hide Quick Clutter' : 'Quick Add Clutter Loot'}
      </button>

      {isExpanded && (
        <div className="clutter-panel">
          <h4>Add Clutter Loot</h4>
          <p>Quickly add common trash items to the loot table. Select from various categories with diverse items and quantities.</p>

          <div className="clutter-options">
            <div className="clutter-category-selector">
              <label>Category:</label>
              <div className="category-buttons">
                {Object.entries(CLUTTER_CATEGORIES).map(([key, category]) => (
                  <button
                    key={key}
                    className={`category-button ${selectedCategory === key ? 'selected' : ''}`}
                    onClick={() => setSelectedCategory(key)}
                  >
                    <img
                      src={getCategoryIconPath(key, category.icon)}
                      alt={category.name}
                      className="category-icon"
                      onError={(e) => {
                        e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                      }}
                    />
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="clutter-controls">
              <div className="control-group">
                <label htmlFor="clutter-quantity">Quantity</label>
                <div className="quantity-control">
                  <button
                    className="quantity-button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    title="Decrease quantity"
                  >
                    -
                  </button>
                  <div className="clutter-quantity-display">
                    {quantity}
                  </div>
                  <button
                    className="quantity-button"
                    onClick={() => setQuantity(Math.min(8, quantity + 1))}
                    disabled={quantity >= 8}
                    title="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="control-group">
                <label htmlFor="clutter-drop-chance">Drop Chance: {dropChance}%</label>
                <input
                  id="clutter-drop-chance"
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={dropChance}
                  onChange={(e) => setDropChance(parseInt(e.target.value, 10))}
                />
              </div>
            </div>

            <div className="clutter-description">
              <h5 className="wow-heading">{CLUTTER_CATEGORIES[selectedCategory].name.toUpperCase()}</h5>
              <p className="category-description">{CLUTTER_CATEGORIES[selectedCategory].description}</p>

              {/* Examples section */}
              <div className="examples-section">
                <h6 className="examples-header">EXAMPLES:</h6>
                <div className="examples-list">
                  {CLUTTER_CATEGORIES[selectedCategory].items.slice(0, 3).map((item, index) => (
                    <span key={index} className="example-item">{item.name}{index < 2 ? ',' : ''}</span>
                  ))}
                  {CLUTTER_CATEGORIES[selectedCategory].items.length > 3 && (
                    <span className="example-more">+{CLUTTER_CATEGORIES[selectedCategory].items.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>

            <div className="clutter-actions">
              <button
                className="add-clutter-button"
                onClick={handleAddClutterItems}
              >
                <i className="fas fa-plus"></i>
                Add to Loot Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ClutterLootGenerator.propTypes = {
  onAddItems: PropTypes.func.isRequired
};

export default ClutterLootGenerator;
