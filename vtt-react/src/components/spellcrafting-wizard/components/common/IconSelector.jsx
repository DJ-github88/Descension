import React, { useState, useEffect, useMemo } from 'react';
import { getCustomIconUrl } from '../../../../utils/assetManager';
import WowWindow from '../../../windows/WowWindow';
// Pathfinder styles imported via main.css

/**
 * IconSelector component for choosing spell icons
 * Displays a modal with a grid of icons that can be selected
 */
const IconSelector = ({ onSelect, onClose, currentIcon }) => {
  const [icons, setIcons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Icon categories - aligned with damageTypes.js structure
  const categories = [
    { id: 'all', name: 'All Icons' },
    { id: 'physical', name: 'Physical' },
    { id: 'ember', name: 'Ember' },
    { id: 'rime', name: 'Rime' },
    { id: 'storm', name: 'Storm' },
    { id: 'arcane', name: 'Arcane' },
    { id: 'primal', name: 'Primal' },
    { id: 'blight', name: 'Blight' },
    { id: 'wyrd', name: 'Wyrd' },
    { id: 'chaos', name: 'Chaos' },
    { id: 'utility', name: 'Utility' }
  ];

  // Ability icon data - using custom ability icons
  useEffect(() => {
    // Generate icon data using ability icons - removing duplicates
    const abilityIcons = [
      // Arcane icons
      { id: 'Arcane/Orb Manipulation', iconPath: 'Arcane/Orb Manipulation', category: 'arcane' },
      { id: 'Arcane/Enchanted Sword', iconPath: 'Arcane/Enchanted Sword', category: 'arcane' },
      { id: 'Arcane/Missile', iconPath: 'Arcane/Missile', category: 'arcane' },
      { id: 'Arcane/Enchanted Sword 2', iconPath: 'Arcane/Enchanted Sword 2', category: 'arcane' },
      { id: 'Arcane/Portal Archway', iconPath: 'Arcane/Portal Archway', category: 'arcane' },
      { id: 'Arcane/Open Portal', iconPath: 'Arcane/Open Portal', category: 'arcane' },
      { id: 'Arcane/Spiral Vortex', iconPath: 'Arcane/Spiral Vortex', category: 'arcane' },
      { id: 'Arcane/Swirling Vortex', iconPath: 'Arcane/Swirling Vortex', category: 'arcane' },
      { id: 'Utility/Star Emblem', iconPath: 'Utility/Star Emblem', category: 'arcane' },
      { id: 'Arcane/Channeling Stance', iconPath: 'Arcane/Channeling Stance', category: 'arcane' },
      { id: 'Utility/Glowing Orb Star', iconPath: 'Utility/Glowing Orb Star', category: 'arcane' },
      { id: 'Utility/Glowing Shard', iconPath: 'Utility/Glowing Shard', category: 'arcane' },
      { id: 'Arcane/Magical Staff', iconPath: 'Arcane/Magical Staff', category: 'arcane' },
      { id: 'Arcane/Spellcasting Aura', iconPath: 'Arcane/Spellcasting Aura', category: 'arcane' },
      { id: 'Arcane/Abstract Rune', iconPath: 'Arcane/Abstract Rune', category: 'arcane' },
      { id: 'Arcane/Conjure Elements', iconPath: 'Arcane/Conjure Elements', category: 'arcane' },
      { id: 'Arcane/Empowering Growth', iconPath: 'Arcane/Empowering Growth', category: 'arcane' },
      { id: 'Arcane/Desperate Channelling', iconPath: 'Arcane/Desperate Channelling', category: 'arcane' },
      { id: 'Arcane/Beckon Faith', iconPath: 'Arcane/Beckon Faith', category: 'arcane' },
      
      // Fire icons
      { id: 'Fire/Fiery Bolt', iconPath: 'Fire/Fiery Bolt', category: 'ember' },
      { id: 'Fire/Swirling Fireball', iconPath: 'Fire/Swirling Fireball', category: 'ember' },
      { id: 'Fire/Flame Burst', iconPath: 'Fire/Flame Burst', category: 'ember' },
      { id: 'Fire/Fiery Comet', iconPath: 'Fire/Fiery Comet', category: 'ember' },
      { id: 'Fire/Meteor Shower', iconPath: 'Utility/Meteor Shower', category: 'ember' },
      { id: 'Utility/Falling Meteor', iconPath: 'Utility/Falling Meteor', category: 'ember' },
      { id: 'Fire/Fiery Vortex', iconPath: 'Fire/Fiery Vortex', category: 'ember' },
      { id: 'Fire/Rising Flames', iconPath: 'Fire/Rising Flames', category: 'ember' },
      { id: 'Fire/Flame Aura', iconPath: 'Fire/Flame Aura', category: 'ember' },
      { id: 'Fire/Fiery Skull', iconPath: 'Fire/Fiery Skull', category: 'ember' },
      { id: 'Fire/Dragon Breath', iconPath: 'Fire/Dragon Breath', category: 'ember' },
      { id: 'Fire/Dragon Breath', iconPath: 'Fire/Dragon Breath', category: 'ember' },
      { id: 'Fire/Flame Skull', iconPath: 'Fire/Flame Skull', category: 'ember' },
      { id: 'Fire/Burning Figure', iconPath: 'Fire/Burning Figure', category: 'ember' },
      { id: 'Fire/Burning Status', iconPath: 'Fire/Burning Status', category: 'ember' },
      { id: 'Fire/Burning Tower', iconPath: 'Fire/Burning Tower', category: 'ember' },
      { id: 'Fire/Fiery Comet', iconPath: 'Fire/Fiery Comet', category: 'ember' },
      { id: 'Utility/Meteor Trail', iconPath: 'Utility/Meteor Trail', category: 'ember' },
      { id: 'Fire/Fiery Arc', iconPath: 'Fire/Fiery Arc', category: 'ember' },
      { id: 'Fire/Fire Butterflies', iconPath: 'Fire/Fire Butterflies', category: 'ember' },
      { id: 'Fire/Fiery Demon', iconPath: 'Fire/Fiery Demon', category: 'ember' },
      { id: 'Fire/Fire Beam', iconPath: 'Fire/Fire Beam', category: 'ember' },
      { id: 'Fire/Fiery Horizon', iconPath: 'Fire/Fiery Horizon', category: 'ember' },
      { id: 'Fire/Fiery Symbol', iconPath: 'Fire/Fiery Symbol', category: 'ember' },
      { id: 'Fire/Fiery Trail', iconPath: 'Fire/Fiery Trail', category: 'ember' },
      { id: 'Fire/Sun Symbol', iconPath: 'Fire/Sun Symbol', category: 'ember' },
      { id: 'Fire/Flame Aura', iconPath: 'Fire/Flame Aura', category: 'ember' },
      { id: 'Fire/Flaming Hand', iconPath: 'Fire/Flaming Hand', category: 'ember' },
      { id: 'Fire/Flowing Lava', iconPath: 'Fire/Flowing Lava', category: 'ember' },
      { id: 'Fire/Burning Ember', iconPath: 'Fire/Burning Ember', category: 'ember' },
      { id: 'Fire/Hand Fire', iconPath: 'Fire/Hand Fire', category: 'ember' },
      { id: 'Fire/Fire Bolt', iconPath: 'Fire/Fire Bolt', category: 'ember' },
      { id: 'Fire/Fiery Comet', iconPath: 'Fire/Fiery Comet', category: 'ember' },
      { id: 'Utility/Meteor Trail', iconPath: 'Utility/Meteor Trail', category: 'ember' },
      { id: 'Utility/Molten Orb', iconPath: 'Utility/Molten Orb', category: 'ember' },
      { id: 'Fire/Dragon Breath', iconPath: 'Fire/Dragon Breath', category: 'ember' },
      { id: 'Fire/Rising Inferno', iconPath: 'Fire/Rising Inferno', category: 'ember' },
      { id: 'Fire/Dragon Breath', iconPath: 'Fire/Dragon Breath', category: 'ember' },
      { id: 'Fire/Three Fire Pillars', iconPath: 'Fire/Three Fire Pillars', category: 'ember' },
      { id: 'Fire/Burning Touch', iconPath: 'Fire/Burning Touch', category: 'ember' },
      { id: 'Fire/Eruption', iconPath: 'Fire/Eruption', category: 'ember' },
      { id: 'Fire/Hellfire', iconPath: 'Fire/Hellfire', category: 'ember' },
      { id: 'Fire/Infernal Fire', iconPath: 'Fire/Infernal Fire', category: 'ember' },
      { id: 'Fire/Volcanic Erupt', iconPath: 'Fire/Volcanic Erupt', category: 'ember' },
      
      // Frost icons
      { id: 'Frost/Dripping Ice', iconPath: 'Frost/Dripping Ice', category: 'rime' },
      { id: 'Frost/Ice Shards', iconPath: 'Frost/Ice Shards', category: 'rime' },
      { id: 'Frost/Cursed Ice', iconPath: 'Frost/Cursed Ice', category: 'rime' },
      { id: 'Fire/Ice and FIre', iconPath: 'Fire/Ice and FIre', category: 'rime' },
      { id: 'Frost/Blow Frost', iconPath: 'Frost/Blow Frost', category: 'rime' },
      { id: 'Frost/Frost Freeze 1', iconPath: 'Frost/Frost Freeze 1', category: 'rime' },
      { id: 'Frost/Frostbite Effect', iconPath: 'Frost/Frostbite Effect', category: 'rime' },
      { id: 'Frost/Frost Manipulation', iconPath: 'Frost/Frost Manipulation', category: 'rime' },
      { id: 'Frost/Frozen Wave', iconPath: 'Frost/Frozen Wave', category: 'rime' },
      { id: 'Frost/Ice Orb', iconPath: 'Frost/Ice Orb', category: 'rime' },
      { id: 'Frost/Icy Shield', iconPath: 'Frost/Icy Shield', category: 'rime' },
      { id: 'Frost/Snowflake', iconPath: 'Frost/Snowflake', category: 'rime' },
      
      // Lightning icons
      { id: 'Lightning/Lightning Bolt', iconPath: 'Lightning/Lightning Bolt', category: 'storm' },
      { id: 'Lightning/Lightning Storm', iconPath: 'Lightning/Lightning Storm', category: 'storm' },
      { id: 'Lightning/Lightning Shield', iconPath: 'Lightning/Lightning Shield', category: 'storm' },
      { id: 'Lightning/Lightning Burst', iconPath: 'Lightning/Lightning Burst', category: 'storm' },
      { id: 'Lightning/Sparkle Burst', iconPath: 'Lightning/Sparkle Burst', category: 'storm' },
      { id: 'Lightning/Thunder', iconPath: 'Lightning/Thunder', category: 'storm' },
      { id: 'Lightning/Electric Strike', iconPath: 'Lightning/Electric Strike', category: 'storm' },
      
      // Radiant icons
      { id: 'Radiant/Holy Cross', iconPath: 'Radiant/Holy Cross', category: 'ember' },
      { id: 'Radiant/Radiant Sunburst', iconPath: 'Radiant/Radiant Sunburst', category: 'ember' },
      { id: 'Radiant/Radiant Sun', iconPath: 'Radiant/Radiant Sun', category: 'ember' },
      { id: 'Radiant/Divine Blessing', iconPath: 'Radiant/Divine Blessing', category: 'ember' },
      { id: 'Radiant/Divine Beam', iconPath: 'Radiant/Divine Beam', category: 'ember' },
      { id: 'Radiant/Divine Illumination', iconPath: 'Radiant/Divine Illumination', category: 'ember' },
      { id: 'Radiant/Radiant Aura', iconPath: 'Radiant/Radiant Aura', category: 'ember' },
      { id: 'Radiant/Winged Angel', iconPath: 'Radiant/Winged Angel', category: 'ember' },
      { id: 'Radiant/Celestial Arc', iconPath: 'Radiant/Celestial Arc', category: 'ember' },
      { id: 'Radiant/Divine Ascension', iconPath: 'Radiant/Divine Ascension', category: 'ember' },
      { id: 'Radiant/Divine Entity', iconPath: 'Radiant/Divine Entity', category: 'ember' },
      { id: 'Radiant/Divine Halo', iconPath: 'Radiant/Divine Halo', category: 'ember' },
      { id: 'Radiant/Divine Trio', iconPath: 'Radiant/Divine Trio', category: 'ember' },
      { id: 'Radiant/Divine Radiance', iconPath: 'Radiant/Divine Radiance', category: 'ember' },
      { id: 'Radiant/Radiant Core', iconPath: 'Radiant/Radiant Core', category: 'ember' },
      { id: 'Radiant/Radiant Star', iconPath: 'Radiant/Radiant Star', category: 'ember' },
      { id: 'Arcane/Magical Cross Emblem 2', iconPath: 'Arcane/Magical Cross Emblem 2', category: 'ember' },
      { id: 'Utility/Winged Creature', iconPath: 'Utility/Winged Creature', category: 'ember' },
      { id: 'Utility/Winged Crest', iconPath: 'Utility/Winged Crest', category: 'ember' },
      { id: 'Utility/Winged Warrior', iconPath: 'Utility/Winged Warrior', category: 'ember' },
      { id: 'Radiant/Angelic Ascension', iconPath: 'Radiant/Angelic Ascension', category: 'ember' },
      { id: 'Radiant/Angelic Sword', iconPath: 'Radiant/Angelic Sword', category: 'ember' },
      { id: 'Radiant/Divine Downward Sword', iconPath: 'Radiant/Divine Downward Sword', category: 'ember' },
      { id: 'Radiant/Radiant Golden Shield', iconPath: 'Radiant/Radiant Golden Shield', category: 'ember' },
      { id: 'Radiant/Radiant Divinity', iconPath: 'Radiant/Radiant Divinity', category: 'ember' },
      
      // Necrotic icons
      { id: 'Necrotic/Necrotic Skull', iconPath: 'Necrotic/Necrotic Skull', category: 'blight' },
      { id: 'Necrotic/Decayed Skull', iconPath: 'Necrotic/Decayed Skull', category: 'blight' },
      { id: 'Necrotic/Skull Burst', iconPath: 'Necrotic/Skull Burst', category: 'blight' },
      { id: 'Necrotic/Skull Explosion', iconPath: 'Necrotic/Skull Explosion', category: 'blight' },
      { id: 'Necrotic/Eclipse Shadow', iconPath: 'Eclipse Shadow', category: 'blight' },
      { id: 'Necrotic/Dark Sun Eclipse', iconPath: 'Dark Sun Eclipse', category: 'blight' },
      { id: 'Necrotic/Ghostly Menace', iconPath: 'Necrotic/Ghostly Menace', category: 'blight' },
      { id: 'Utility/Grim Reaper', iconPath: 'Utility/Grim Reaper', category: 'blight' },
      { id: 'Necrotic/Ethereal Skeleton', iconPath: 'Necrotic/Ethereal Skeleton', category: 'blight' },
      { id: 'Utility/Bloodshot Eye', iconPath: 'Utility/Bloodshot Eye', category: 'blight' },
      { id: 'Necrotic/Bloody Horse Skull', iconPath: 'Necrotic/Bloody Horse Skull', category: 'blight' },
      { id: 'Necrotic/Bloody Sacrifice', iconPath: 'Slashing/Bloody Sacrifice', category: 'blight' },
      { id: 'Necrotic/Broken Heart', iconPath: 'Healing/Broken Heart', category: 'blight' },
      { id: 'Necrotic/Crowned Skull', iconPath: 'Necrotic/Crowned Skull', category: 'blight' },
      { id: 'Necrotic/Death Kanji', iconPath: 'Necrotic/Death Kanji', category: 'blight' },
      { id: 'Necrotic/Decapitated Spirit', iconPath: 'Decapitated Spirit', category: 'blight' },
      { id: 'Necrotic/Ethereal Head', iconPath: 'Ethereal Head', category: 'blight' },
      { id: 'Necrotic/Ethereal Spirit', iconPath: 'Ethereal Spirit', category: 'blight' },
      { id: 'Necrotic/Glowing Skull', iconPath: 'Necrotic/Glowing Skull', category: 'blight' },
      { id: 'Necrotic/Glowing Skull Warning', iconPath: 'Necrotic/Glowing Skull Warning', category: 'blight' },
      { id: 'Necrotic/Hanging Skull Emblem', iconPath: 'Necrotic/Hanging Skull Emblem', category: 'blight' },
      { id: 'Utility/Hooded Reaper', iconPath: 'Utility/Hooded Reaper', category: 'blight' },
      { id: 'Necrotic/Monstrous Skull Face', iconPath: 'Necrotic/Monstrous Skull Face', category: 'blight' },
      { id: 'Necrotic/Pile Skulls', iconPath: 'Necrotic/Pile Skulls', category: 'blight' },
      { id: 'Necrotic/Pixelated Skull Pattern', iconPath: 'Necrotic/Pixelated Skull Pattern', category: 'blight' },
      { id: 'Necrotic/Screaming Skull', iconPath: 'Necrotic/Screaming Skull', category: 'blight' },
      { id: 'Necrotic/Skull Grimoire', iconPath: 'Necrotic/Skull Grimoire', category: 'blight' },
      { id: 'Necrotic/Spiked Skull', iconPath: 'Necrotic/Spiked Skull', category: 'blight' },
      { id: 'Necrotic/Swirling Skull Face', iconPath: 'Necrotic/Swirling Skull Face', category: 'blight' },
      { id: 'Necrotic/Triple Skulls', iconPath: 'Necrotic/Triple Skulls', category: 'blight' },
      { id: 'Necrotic/Undead Rising', iconPath: 'Necrotic/Undead Rising', category: 'blight' },
      { id: 'Necrotic/Zombie Reach', iconPath: 'Necrotic/Roaring Zombie', category: 'blight' },
      
      // Poison icons
      { id: 'Utility/Scorpion Creature', iconPath: 'Utility/Scorpion Creature', category: 'blight' },
      { id: 'Utility/Slime Blob', iconPath: 'Utility/Slime Blob', category: 'blight' },
      { id: 'Necrotic/Purple Skull', iconPath: 'Necrotic/Purple Skull', category: 'blight' },
      { id: 'Necrotic/Voodoo Doll', iconPath: 'Voodoo Doll', category: 'blight' },
      { id: 'Utility/Spider Creature', iconPath: 'Utility/Spider Creature', category: 'blight' },
      { id: 'Nature/Glowing Green Orb', iconPath: 'Nature/Glowing Green Orb', category: 'blight' },
      { id: 'Nature/Scorpion Stinger', iconPath: 'Nature/Scorpion Stinger', category: 'blight' },
      { id: 'Poison/Poison Venom', iconPath: 'Poison/Poison Venom', category: 'blight' },
      { id: 'Poison/Poison Flask', iconPath: 'Poison/Poison Flask', category: 'blight' },
      { id: 'Poison/Poison Concoction', iconPath: 'Poison/Poison Concoction', category: 'blight' },
      { id: 'Poison/Acid Splash', iconPath: 'Poison/Acid Splash', category: 'blight' },
      { id: 'Poison/Acid Spray', iconPath: 'Poison/Acid Spray', category: 'blight' },
      { id: 'Poison/Poison Plague', iconPath: 'Poison/Poison Plague', category: 'blight' },
      
      // Acid-like icons moved to poison (similar corrosive nature)
      { id: 'Fire/Dripping Lava', iconPath: 'Fire/Dripping Lava', category: 'blight' },
      { id: 'Poison/Poison Toxin', iconPath: 'Poison/Poison Toxin', category: 'blight' },
      { id: 'Poison/Poison Blight', iconPath: 'Poison/Poison Blight', category: 'blight' },
      
      // Psychic icons
      { id: 'Psychic/Brain Psionics', iconPath: 'Psychic/Brain Psionics', category: 'wyrd' },
      { id: 'Psychic/Hypnotic Eye', iconPath: 'Psychic/Hypnotic Eye', category: 'wyrd' },
      { id: 'Utility/All Seeing Eye', iconPath: 'Utility/All Seeing Eye', category: 'wyrd' },
      { id: 'Psychic/Psychic Emanation', iconPath: 'Psychic/Psychic Emanation', category: 'wyrd' },
      { id: 'Psychic/Puppet Control', iconPath: 'Psychic/Puppet Control', category: 'wyrd' },
      { id: 'Psychic/Psionic Construct', iconPath: 'Psychic/Psionic Construct', category: 'wyrd' },
      { id: 'Utility/Eyeball Optic Nerve', iconPath: 'Utility/Eyeball Optic Nerve', category: 'wyrd' },
      { id: 'Psychic/Mind Read', iconPath: 'Psychic/Mind Read', category: 'wyrd' },
      { id: 'Utility/Glowing Eyes', iconPath: 'Utility/Glowing Eyes', category: 'wyrd' },
      { id: 'Utility/Glowing Eyed Entity', iconPath: 'Utility/Glowing Eyed Entity', category: 'wyrd' },
      { id: 'Psychic/Mind Radiance', iconPath: 'Psychic/Mind Radiance', category: 'wyrd' },
      { id: 'Utility/Reptilian Dragon Eye', iconPath: 'Utility/Reptilian Dragon Eye', category: 'wyrd' },
      { id: 'Utility/Triangle Eye Symbol', iconPath: 'Utility/Triangle Eye Symbol', category: 'wyrd' },
      { id: 'Utility/Watchful Eye', iconPath: 'Utility/Watchful Eye', category: 'wyrd' },
      { id: 'Necrotic/Three Eyed Ghost', iconPath: 'Necrotic/Three Eyed Ghost', category: 'wyrd' },
      { id: 'Psychic/Agonizing Scream', iconPath: 'Psychic/Agonizing Scream', category: 'wyrd' },
      { id: 'Psychic/Mental Blessing', iconPath: 'Psychic/Mental Blessing', category: 'wyrd' },
      { id: 'Psychic/Mental Chaos', iconPath: 'Psychic/Mental Chaos', category: 'wyrd' },
      { id: 'Psychic/Mind Control', iconPath: 'Psychic/Mind Control', category: 'wyrd' },
      { id: 'Psychic/Psionic Strike', iconPath: 'Psychic/Psionic Strike', category: 'wyrd' },
      { id: 'Psychic/Spectral Seer', iconPath: 'Psychic/Spectral Seer', category: 'wyrd' },
      { id: 'Psychic/Telepathic', iconPath: 'Psychic/Telepathic', category: 'wyrd' },
      
      // Force icons
      { id: 'Force/Force Touch', iconPath: 'Force/Force Touch', category: 'arcane' },
      { id: 'Force/Energy Blast', iconPath: 'Force/Energy Blast 1', category: 'arcane' },
      { id: 'Force/Energy Impact', iconPath: 'Force/Energy Impact', category: 'arcane' },
      { id: 'Force/Force Wave', iconPath: 'Force/Force Wave', category: 'arcane' },
      { id: 'Force/Energy Beam', iconPath: 'Force/Diagonal Energy Beam', category: 'arcane' },
      { id: 'Force/Diagonal Energy Beam', iconPath: 'Force/Diagonal Energy Beam', category: 'arcane' },
      { id: 'Force/Energy Burst', iconPath: 'Force/Energy Burst', category: 'arcane' },
      { id: 'Force/Diagonal Energy Ray', iconPath: 'Force/Diagonal Energy Ray', category: 'arcane' },
      { id: 'Force/Diagonal Energy Waves', iconPath: 'Force/Diagonal Energy Waves', category: 'arcane' },
      { id: 'Force/Diagonal Energy', iconPath: 'Force/Diagonal Energy', category: 'arcane' },
      { id: 'Force/Energy Burst Hand', iconPath: 'Force/Energy Burst Hand', category: 'arcane' },
      { id: 'Force/Energy Impact', iconPath: 'Force/Energy Impact', category: 'arcane' },
      { id: 'Nature/Air Blow', iconPath: 'Nature/Air Blow', category: 'arcane' },
      { id: 'Force/Explosive Burst', iconPath: 'Force/Explosive Burst', category: 'arcane' },
      { id: 'Force/Energy Whirlwind', iconPath: 'Force/Energy Whirlwind', category: 'arcane' },
      { id: 'Force/Force Field', iconPath: 'Force/Force Field', category: 'arcane' },
      { id: 'Force/Forceful Punch', iconPath: 'Force/Forceful Punch', category: 'arcane' },
      { id: 'Force/Explosive Burst', iconPath: 'Force/Explosive Burst', category: 'arcane' },
      
      // Thunder-like icons moved to lightning (similar sound/air effects)
      { id: 'magic/tornado-vortex', iconPath: 'Vortex', category: 'storm' },
      { id: 'magic/wind-gust', iconPath: 'Nature/Wind Gust', category: 'storm' },
      { id: 'combat/explosion-burst', iconPath: 'Force/Explosion Burst', category: 'storm' },
      { id: 'combat/bright-explosion', iconPath: 'Radiant/Bright Explosion', category: 'storm' },
      { id: 'combat/radial-explosion', iconPath: 'Utility/Radial Explosion', category: 'storm' },
      { id: 'combat/starburst-explosion', iconPath: 'Force/Starburst Explosion', category: 'storm' },
      { id: 'combat/yellow-burst-explosion', iconPath: 'Force/Yellow Burst Explosion', category: 'storm' },
      
      // Nature icons
      { id: 'Nature/Nature Natural', iconPath: 'Nature/Nature Natural', category: 'primal' },
      { id: 'Nature/Nature Primal', iconPath: 'Nature/Nature Primal', category: 'primal' },
      { id: 'Nature/Gnarled Roots', iconPath: 'Nature/Gnarled Roots', category: 'primal' },
      { id: 'Nature/Root Network', iconPath: 'Nature/Root Network', category: 'primal' },
      { id: 'Nature/Tree', iconPath: 'Nature/Tree', category: 'primal' },
      { id: 'Nature/Thorned Flower', iconPath: 'Nature/Thorned Flower', category: 'primal' },
      { id: 'Nature/Nature Scene', iconPath: 'Nature/Nature Scene', category: 'primal' },
      { id: 'Nature/Elemental Bloom', iconPath: 'Psychic/Elemental Bloom', category: 'primal' },
      { id: 'Necrotic/Glowing Aquatic', iconPath: 'Necrotic/Glowing Aquatic', category: 'primal' },
      { id: 'Nature/Lunar Howl', iconPath: 'Nature/Lunar Howl', category: 'primal' },
      { id: 'Nature/Spirit With Wisps', iconPath: 'Spirit With Wisps', category: 'primal' },
      { id: 'Nature/Starry Night', iconPath: 'Nature/Red Flower Starry Night', category: 'primal' },
      { id: 'Nature/Maple Leaf', iconPath: 'Nature/Maple Leaf', category: 'primal' },
      { id: 'Nature/Single Leaf', iconPath: 'Nature/Single Leaf', category: 'primal' },
      { id: 'Nature/Stylized Maple Leaf', iconPath: 'Nature/Stylized Maple Leaf', category: 'primal' },
      { id: 'Nature/Stylized Tree', iconPath: 'Nature/Stylized Tree', category: 'primal' },
      { id: 'Nature/Fanned Leaf', iconPath: 'Nature/Fanned Leaf', category: 'primal' },
      { id: 'Nature/Leaf Water Droplets', iconPath: 'Nature/Leaf Water Droplets', category: 'primal' },
      { id: 'Nature/Bear Summon', iconPath: 'Nature/Bear Summon', category: 'primal' },
      { id: 'Nature/Beast Mark', iconPath: 'Nature/Beast Mark', category: 'primal' },
      { id: 'Nature/Tiger Spirit', iconPath: 'Nature/Tiger Spirit', category: 'primal' },
      { id: 'Nature/Roar', iconPath: 'Nature/Roar', category: 'primal' },
      { id: 'Nature/Roots', iconPath: 'Nature/Roots', category: 'primal' },
      { id: 'Nature/Thorny Entanglement', iconPath: 'Nature/Thorny Entanglement', category: 'primal' },
      { id: 'Nature/Wolf Dash', iconPath: 'Nature/Wolf Dash', category: 'primal' },
      { id: 'Nature/Growth', iconPath: 'Nature/Growth', category: 'primal' },
      
      // Shadow icons moved to void (similar dark/void themes)
      { id: 'Void/Shadow Entity', iconPath: 'Shadow Entity', category: 'blight' },
      { id: 'Shadow Hood', iconPath: 'Shadow Hood', category: 'blight' },
      { id: 'Twin Shadows', iconPath: 'Twin Shadows', category: 'blight' },
      { id: 'Necrotic/Ghostly Trio', iconPath: 'Necrotic/Ghostly Trio', category: 'blight' },
      { id: 'Utility/Hooded Figure Archway', iconPath: 'Utility/Hooded Figure Archway', category: 'blight' },
      { id: 'Utility/Hooded Mystic', iconPath: 'Hooded Mystic 3', category: 'blight' },
      { id: 'Necrotic/Arise', iconPath: 'Necrotic/Arise', category: 'blight' },
      { id: 'Necrotic/Death Mark', iconPath: 'Necrotic/Death Mark', category: 'blight' },
      { id: 'Necrotic/Necrotic Death', iconPath: 'Necrotic/Necrotic Death', category: 'blight' },
      { id: 'Necrotic/Necrotic Decay 1', iconPath: 'Necrotic/Necrotic Decay 1', category: 'blight' },
      { id: 'Necrotic/Necrotic Wither 1', iconPath: 'Necrotic/Necrotic Wither 1', category: 'blight' },
      { id: 'Utility/Hooded Spirit', iconPath: 'Hooded Spirit', category: 'blight' },
      { id: 'Necrotic/Screaming Ghost', iconPath: 'Necrotic/Screaming Ghost', category: 'blight' },
      { id: 'Necrotic/Screaming Ghost Ornate', iconPath: 'Necrotic/Screaming Ghost Ornate', category: 'blight' },
      { id: 'Necrotic/Spectral Mask', iconPath: 'Necrotic/Spectral Mask', category: 'blight' },
      { id: 'Void/Twin Crescents', iconPath: 'Twin Crescents', category: 'blight' },
      { id: 'Void/Wraith Form', iconPath: 'Wraith Form', category: 'blight' },
      { id: 'Void/Shadowy Potion', iconPath: 'Void/Shadowy Potion', category: 'blight' },
      { id: 'Void/Consumed by Void', iconPath: 'Void/Consumed by Void', category: 'blight' },
      
      // Chaos icons
      { id: 'Chaos/Chaotic Shuffle', iconPath: 'Chaos/Chaotic Shuffle', category: 'chaos' },
      { id: 'Fire/Fiery Vortex', iconPath: 'Fire/Fiery Vortex', category: 'chaos' },
      { id: 'Utility/Cosmic Nexus', iconPath: 'Utility/Cosmic Nexus', category: 'chaos' },
      { id: 'Force/Energy Nexus', iconPath: 'Force/Energy Nexus', category: 'chaos' },
      { id: 'Necrotic/Demonic Mask', iconPath: 'Necrotic/Demonic Mask', category: 'chaos' },
      { id: 'Necrotic/Horned Demon', iconPath: 'Necrotic/Horned Demon', category: 'chaos' },
      { id: 'Nature/Swirling Geometric Pattern', iconPath: 'Nature/Swirling Geometric Pattern', category: 'chaos' },
      { id: 'Utility/Counter Spiral', iconPath: 'Utility/Counter Spiral', category: 'chaos' },
      { id: 'Utility/Jagged Spiral Maze', iconPath: 'Utility/Jagged Spiral Maze', category: 'chaos' },
      { id: 'Utility/Spiral Pattern', iconPath: 'Utility/Spiral Pattern', category: 'chaos' },
      { id: 'Utility/Spiral Shell', iconPath: 'Utility/Spiral Shell', category: 'chaos' },
      { id: 'Arcane/Spiral Vortex', iconPath: 'Arcane/Spiral Vortex', category: 'chaos' },
      { id: 'Nature/Swirling Geometric Pattern', iconPath: 'Nature/Swirling Geometric Pattern', category: 'chaos' },
      { id: 'Radiant/Swirling Organic Shape', iconPath: 'Radiant/Swirling Organic Shape', category: 'chaos' },
      { id: 'Chaos/Chaotic Shuffle', iconPath: 'Chaos/Chaotic Shuffle', category: 'chaos' },
      { id: 'Chaos/Demonic Devour', iconPath: 'Chaos/Demonic Devour', category: 'chaos' },
      { id: 'Chaos/Chaos Book Channel', iconPath: 'Chaos/Chaos Book Channel', category: 'chaos' },
      { id: 'Chaos/Chaotic Assemblance', iconPath: 'Chaos/Chaotic Assemblance', category: 'chaos' },
      { id: 'Chaos/Chaotic Corruption', iconPath: 'Chaos/Chaotic Corruption', category: 'chaos' },
      { id: 'Chaos/Chaotic Rupture', iconPath: 'Chaos/Chaotic Rupture', category: 'chaos' },
      { id: 'Chaos/Chaotic Shadow Storm', iconPath: 'Chaos/Chaotic Shadow Storm', category: 'chaos' },
      { id: 'Chaos/Comet Rain', iconPath: 'Chaos/Comet Rain', category: 'chaos' },
      { id: 'Chaos/Meteor', iconPath: 'Chaos/Meteor', category: 'chaos' },
      { id: 'Chaos/Tendrils Chaos', iconPath: 'Chaos/Tendrils Chaos', category: 'chaos' },
      
      // Void icons
      { id: 'Void/Void Portal Mage', iconPath: 'Void Portal Mage', category: 'blight' },
      { id: 'Void/Black Hole', iconPath: 'Void/Black Hole', category: 'blight' },
      { id: 'Necrotic/Eclipse Shadow', iconPath: 'Eclipse Shadow', category: 'blight' },
      { id: 'Necrotic/Dark Sun Eclipse', iconPath: 'Dark Sun Eclipse', category: 'blight' },
      { id: 'Necrotic/Cosmic Entity', iconPath: 'Necrotic/Cosmic Entity', category: 'blight' },
      { id: 'Utility/Amorphous Entity', iconPath: 'Utility/Amorphous Entity', category: 'blight' },
      { id: 'Utility/Emerging Figure', iconPath: 'Utility/Emerging Figure', category: 'blight' },
      { id: 'Utility/Empowered Silhouette', iconPath: 'Utility/Empowered Silhouette', category: 'blight' },
      { id: 'Utility/Glowing Silhouette', iconPath: 'Utility/Glowing Silhouette', category: 'blight' },
      { id: 'Utility/Menacing Face', iconPath: 'Utility/Menacing Face', category: 'blight' },
      { id: 'Void/Purple Star', iconPath: 'Purple Star', category: 'blight' },
      { id: 'Utility/Robed Figure', iconPath: 'Utility/Robed Figure', category: 'blight' },
      
      // Piercing icons
      { id: 'Piercing/Scatter Shot', iconPath: 'Piercing/Scatter Shot', category: 'physical' },
      { id: 'Piercing/Bow Arrow', iconPath: 'Piercing/Bow Arrow', category: 'physical' },
      { id: 'Piercing/Arrow Intertwined Rings', iconPath: 'Piercing/Arrow Intertwined Rings', category: 'physical' },
      { id: 'Piercing/Bleeding Arrow', iconPath: 'Piercing/Bleeding Arrow', category: 'physical' },
      { id: 'Piercing/Dagger Pierce', iconPath: 'Piercing/Dagger Pierce', category: 'physical' },
      { id: 'Piercing/Diagonal Spear', iconPath: 'Piercing/Diagonal Spear', category: 'physical' },
      { id: 'Piercing/Spear Warrior', iconPath: 'Piercing/Spear Warrior', category: 'physical' },
      { id: 'Piercing/Bone Spear', iconPath: 'Necrotic/Bone Spear', category: 'physical' },
      { id: 'Piercing/Javelin Throw', iconPath: 'Piercing/Javelin Throw', category: 'physical' },
      { id: 'Piercing/Golden Spear Sparkles', iconPath: 'Piercing/Golden Spear Sparkles', category: 'physical' },
      { id: 'Piercing/Javelin Throw', iconPath: 'Piercing/Javelin Throw', category: 'physical' },
      { id: 'Piercing/Water Trident', iconPath: 'Piercing/Water Trident', category: 'physical' },
      { id: 'Piercing/Water Trident', iconPath: 'Piercing/Water Trident', category: 'physical' },
      { id: 'Piercing/Three Vertical Spears', iconPath: 'Piercing/Three Vertical Spears', category: 'physical' },
      { id: 'Piercing/Upward Arrow', iconPath: 'Piercing/Upward Arrow', category: 'physical' },
      { id: 'Piercing/Heart Pierce', iconPath: 'Piercing/Heart Pierce', category: 'physical' },
      { id: 'Piercing/Syringe Dart', iconPath: 'Piercing/Syringe Dart', category: 'physical' },
      { id: 'Piercing/Target Three Arrows', iconPath: 'Piercing/Target Three Arrows', category: 'physical' },
      { id: 'Piercing/Triple Arrows', iconPath: 'Piercing/Triple Arrows', category: 'physical' },
      { id: 'Piercing/Three Descending Arrows', iconPath: 'Piercing/Three Descending Arrows', category: 'physical' },
      { id: 'Piercing/Backstab', iconPath: 'Piercing/Backstab', category: 'physical' },
      { id: 'Piercing/Dagger Rain', iconPath: 'Piercing/Dagger Rain', category: 'physical' },
      { id: 'Piercing/Focused Arrow Shot', iconPath: 'Piercing/Focused Arrow Shot', category: 'physical' },
      { id: 'Piercing/Targeted Strike', iconPath: 'Piercing/Targeted Strike', category: 'physical' },
      
      // Bludgeoning icons
      { id: 'Bludgeoning/Striking Hammer', iconPath: 'Bludgeoning/Striking Hammer', category: 'physical' },
      { id: 'Bludgeoning/Swinging Hammer', iconPath: 'Bludgeoning/Swinging Hammer', category: 'physical' },
      { id: 'Bludgeoning/Hammer', iconPath: 'Bludgeoning/Hammer', category: 'physical' },
      { id: 'Bludgeoning/Ceremonial Hammer', iconPath: 'Bludgeoning/Ceremonial Hammer', category: 'physical' },
      { id: 'Bludgeoning/Hard Step', iconPath: 'Bludgeoning/Hard Step', category: 'physical' },
      { id: 'Bludgeoning/Hammer Crush', iconPath: 'Bludgeoning/Hammer Crush', category: 'physical' },
      { id: 'Utility/Falling Block', iconPath: 'Utility/Falling Block', category: 'physical' },
      { id: 'Bludgeoning/Fist Strike', iconPath: 'Bludgeoning/Fist Strike', category: 'physical' },
      { id: 'Bludgeoning/Bone Fist', iconPath: 'Necrotic/Bone Fist', category: 'physical' },
      { id: 'Bludgeoning/Golden Fist', iconPath: 'Bludgeoning/Golden Fist', category: 'physical' },
      { id: 'Bludgeoning/Punch Impact', iconPath: 'Force/Punch Impact', category: 'physical' },
      { id: 'Piercing/Impact Burst', iconPath: 'Piercing/Impact Burst', category: 'physical' },
      { id: 'Force/Impact Explosion', iconPath: 'Force/Impact Explosion', category: 'physical' },
      { id: 'Bludgeoning/Cranium Crush', iconPath: 'Bludgeoning/Cranium Crush', category: 'physical' },
      { id: 'Bludgeoning/Punch', iconPath: 'Bludgeoning/Punch', category: 'physical' },
      { id: 'Necrotic/Spiked Flail', iconPath: 'Necrotic/Spiked Flail', category: 'physical' },
      { id: 'Necrotic/Skeleton With Flail', iconPath: 'Necrotic/Skeleton With Flail', category: 'physical' },
      { id: 'Bludgeoning/Clenched Fist', iconPath: 'Bludgeoning/Clenched Fist', category: 'physical' },
      { id: 'Bludgeoning/Mortal Strike', iconPath: 'Bludgeoning/Mortal Strike', category: 'physical' },
      
      // Slashing icons
      { id: 'Slashing/Bloody Meat Cleaver', iconPath: 'Slashing/Bloody Meat Cleaver', category: 'physical' },
      { id: 'Slashing/Bloody Slash', iconPath: 'Slashing/Bloody Slash', category: 'physical' },
      { id: 'Slashing/Bloody Sword', iconPath: 'Slashing/Bloody Sword', category: 'physical' },
      { id: 'Slashing/Bloody Blade', iconPath: 'Slashing/Bloody Blade', category: 'physical' },
      { id: 'Slashing/Sword Strike', iconPath: 'Slashing/Sword Strike', category: 'physical' },
      { id: 'Slashing/Striking Sword', iconPath: 'Slashing/Striking Sword', category: 'physical' },
      { id: 'Arcane/Enchanted Sword', iconPath: 'Arcane/Enchanted Sword', category: 'physical' },
      { id: 'Slashing/Flaming Sword', iconPath: 'Slashing/Flaming Sword', category: 'physical' },
      { id: 'Fire/Fiery Slash', iconPath: 'Fire/Fiery Slash', category: 'physical' },
      { id: 'Slashing/Quick Slash', iconPath: 'Slashing/Quick Slash', category: 'physical' },
      { id: 'Slashing/Rapid Slash', iconPath: 'Slashing/Rapid Slash', category: 'physical' },
      { id: 'Slashing/Cross Slash', iconPath: 'Slashing/Cross Slash', category: 'physical' },
      { id: 'Slashing/Crossed Swords', iconPath: 'Slashing/Crossed Swords', category: 'physical' },
      { id: 'Slashing/Curved Scythe', iconPath: 'Slashing/Curved Scythe', category: 'physical' },
      { id: 'Slashing/Jagged Scythe', iconPath: 'Slashing/Jagged Scythe', category: 'physical' },
      { id: 'Slashing/Shattering Blade', iconPath: 'Slashing/Shattering Blade', category: 'physical' },
      { id: 'Slashing/Glowing Slash', iconPath: 'Slashing/Glowing Slash', category: 'physical' },
      { id: 'Slashing/Energized Slash', iconPath: 'Slashing/Energized Slash', category: 'physical' },
      { id: 'Slashing/Diagonal Energy Slash', iconPath: 'Slashing/Diagonal Energy Slash', category: 'physical' },
      { id: 'Slashing/Dual Blades', iconPath: 'Slashing/Dual Blades', category: 'physical' },
      { id: 'Piercing/Dual Daggers', iconPath: 'Piercing/Dual Daggers', category: 'physical' },
      { id: 'Slashing/Crossed Scimitars', iconPath: 'Slashing/Crossed Scimitars', category: 'physical' },
      { id: 'Slashing/Cleave', iconPath: 'Slashing/Cleave', category: 'physical' },
      { id: 'Slashing/Whirl', iconPath: 'Slashing/Whirl', category: 'physical' },
      { id: 'Slashing/Execution', iconPath: 'Slashing/Execution', category: 'physical' },
      
      // Utility icons
      { id: 'Utility/Ornate Symbol', iconPath: 'Utility/Ornate Symbol', category: 'utility' },
      { id: 'Utility/Glowing Orb', iconPath: 'Utility/Glowing Orb', category: 'utility' },
      { id: 'Utility/Summit Victory', iconPath: 'Utility/Summit Victory', category: 'utility' },
      { id: 'Utility/All Seeing Eye', iconPath: 'Utility/All Seeing Eye', category: 'utility' },
      { id: 'Utility/Mountain Summit', iconPath: 'Utility/Mountain Summit', category: 'utility' },
      { id: 'Utility/Sleep', iconPath: 'Utility/Sleep', category: 'utility' },
      { id: 'Utility/Chained', iconPath: 'Utility/Chained', category: 'utility' },
      { id: 'Utility/Strange Brew', iconPath: 'Utility/Strange Brew', category: 'utility' },
      { id: 'Utility/Utility Tool', iconPath: 'Utility/Utility Tool', category: 'utility' },
      { id: 'Utility/Watchful Eye', iconPath: 'Utility/Watchful Eye', category: 'utility' },
      { id: 'Utility/Winged Creature', iconPath: 'Utility/Winged Creature', category: 'utility' },
      { id: 'Utility/Winged Crest', iconPath: 'Utility/Winged Crest', category: 'utility' },
      { id: 'Utility/Winged Warrior', iconPath: 'Utility/Winged Warrior', category: 'utility' },
      { id: 'Utility/Shattered Surface', iconPath: 'Utility/Shattered Surface', category: 'utility' },
      { id: 'Utility/Shield', iconPath: 'Utility/Shield', category: 'utility' },
      { id: 'Utility/Bomb', iconPath: 'Utility/Bomb', category: 'utility' },
      { id: 'Utility/Dash', iconPath: 'Utility/Dash', category: 'utility' },
      { id: 'Utility/Parry', iconPath: 'Utility/Parry', category: 'utility' },
      { id: 'Utility/Stun', iconPath: 'Utility/Stun', category: 'utility' },
      { id: 'Utility/Fear', iconPath: 'Utility/Fear', category: 'utility' },
      { id: 'Utility/Hide', iconPath: 'Utility/Hide', category: 'utility' },
      { id: 'Utility/Rest', iconPath: 'Utility/Rest', category: 'utility' },
      { id: 'Utility/Rewind Time', iconPath: 'Utility/Rewind Time', category: 'utility' },
      { id: 'Utility/Resistance', iconPath: 'Utility/Resistance', category: 'utility' },
      { id: 'Utility/Amorphous Entity', iconPath: 'Utility/Amorphous Entity', category: 'utility' },
      { id: 'Utility/Emerging Figure', iconPath: 'Utility/Emerging Figure', category: 'utility' },
      { id: 'Utility/Empowered Silhouette', iconPath: 'Utility/Empowered Silhouette', category: 'utility' },
      { id: 'Utility/Glowing Silhouette', iconPath: 'Utility/Glowing Silhouette', category: 'utility' },
      { id: 'Utility/Menacing Face', iconPath: 'Utility/Menacing Face', category: 'utility' },
      { id: 'Utility/Robed Figure', iconPath: 'Utility/Robed Figure', category: 'utility' },
      { id: 'Utility/Fleur De Lis', iconPath: 'Utility/Fleur De Lis', category: 'utility' },
      { id: 'Utility/Golden Shield', iconPath: 'Utility/Golden Shield', category: 'utility' },
      { id: 'Utility/Grim Reaper', iconPath: 'Utility/Grim Reaper', category: 'utility' },
      { id: 'Utility/Hooded Reaper', iconPath: 'Utility/Hooded Reaper', category: 'utility' },
      { id: 'Utility/Hooded Thief', iconPath: 'Utility/Hooded Thief', category: 'utility' },
      { id: 'Utility/Hypnotic Eye', iconPath: 'Utility/Hypnotic Eye', category: 'utility' },
      { id: 'Utility/Knight', iconPath: 'Utility/Knight', category: 'utility' },
      { id: 'Utility/Lit Bomb', iconPath: 'Utility/Lit Bomb', category: 'utility' },
      { id: 'Utility/Martial Arts Ready', iconPath: 'Utility/Martial Arts Ready', category: 'utility' },
      { id: 'Utility/Meditative Figure', iconPath: 'Utility/Meditative Figure', category: 'utility' },
      { id: 'Utility/Meteor Trail', iconPath: 'Utility/Meteor Trail', category: 'utility' },
      { id: 'Utility/Molten Orb', iconPath: 'Utility/Molten Orb', category: 'utility' },
      { id: 'Utility/Overlords Command', iconPath: 'Utility/Overlords Command', category: 'utility' },
      { id: 'Utility/Paralyzed', iconPath: 'Utility/Paralyzed', category: 'utility' },
      { id: 'Utility/Petrify', iconPath: 'Utility/Petrify', category: 'utility' },
      { id: 'Utility/Phantom Dash', iconPath: 'Utility/Phantom Dash', category: 'utility' },
      { id: 'Utility/Slow Speed', iconPath: 'Utility/Slow Speed', category: 'utility' },
      { id: 'Utility/Speed Boot', iconPath: 'Utility/Speed Boot', category: 'utility' },
      { id: 'Utility/Speed Dash', iconPath: 'Utility/Speed Dash', category: 'utility' },
      { id: 'Utility/Spiral Pattern', iconPath: 'Utility/Spiral Pattern', category: 'utility' },
      { id: 'Utility/Spiral Shell', iconPath: 'Utility/Spiral Shell', category: 'utility' },
      { id: 'Utility/Spiral Vortex', iconPath: 'Utility/Spiral Vortex', category: 'utility' },
      { id: 'Utility/Star Emblem', iconPath: 'Utility/Star Emblem', category: 'utility' },
      { id: 'Utility/Steadfast Bulwark', iconPath: 'Utility/Steadfast Bulwark', category: 'utility' },
      { id: 'Utility/Trapped', iconPath: 'Utility/Trapped', category: 'utility' },
      { id: 'Utility/Triangle Eye Symbol', iconPath: 'Utility/Triangle Eye Symbol', category: 'utility' },
      { id: 'Utility/Upward Jump', iconPath: 'Utility/Upward Jump', category: 'utility' },
      { id: 'Utility/Utility Gear', iconPath: 'Utility/Utility Gear', category: 'utility' },
      { id: 'Utility/Utility', iconPath: 'Utility/Utility', category: 'utility' }
    ];
    
    // Remove duplicates based on iconPath
    const uniqueIcons = abilityIcons.filter((icon, index, self) =>
      index === self.findIndex(i => i.iconPath === icon.iconPath)
    );
    
    setIcons(uniqueIcons);
  }, []);

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    return icons.filter(icon => {
      const matchesSearch = searchTerm === '' || icon.id.toLowerCase().includes(searchTerm.toLowerCase()) || icon.iconPath.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [icons, searchTerm, selectedCategory]);

  // Render the modal via WowWindow (handles portal, backdrop, focus trap, Esc, aria)
  return (
    <WowWindow
      title="Select a Spell Icon"
      isOpen={true}
      onClose={onClose}
      modal={true}
      centered={true}
      defaultSize={{ width: 900, height: 650 }}
      minConstraints={[600, 400]}
    >
      <div className="icon-selector-filters">
        <input
          type="text"
          className="icon-selector-search"
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="icon-selector-categories">
          {categories.map(category => (
            <button
              key={category.id}
              className={`icon-selector-category ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="icon-selector-grid">
        {filteredIcons.map(icon => (
          <div
            key={icon.id}
            className={`icon-selector-item ${currentIcon === icon.id ? 'selected' : ''}`}
            onClick={() => onSelect(icon.id)}
            title={icon.id}
          >
            <div className="icon-selector-image-container">
              <img
                src={getCustomIconUrl(icon.iconPath, 'abilities')}
                alt={icon.id}
                className="icon-selector-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                }}
              />
            </div>
          </div>
        ))}

        {filteredIcons.length === 0 && (
          <div className="icon-selector-no-results">
            No icons found matching your criteria
          </div>
        )}
      </div>
    </WowWindow>
  );
};

export default IconSelector;
