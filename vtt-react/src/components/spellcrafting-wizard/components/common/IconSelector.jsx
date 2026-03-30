import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { getCustomIconUrl } from '../../../../utils/assetManager';
// Pathfinder styles imported via main.css
import '../../styles/IconSelector.css';

/**
 * IconSelector component for choosing spell icons
 * Displays a modal with a grid of icons that can be selected
 */
const IconSelector = ({ onSelect, onClose, currentIcon }) => {
  const [icons, setIcons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const modalRef = useRef(null);

  // Icon categories - aligned with damageTypes.js structure
  const categories = [
    { id: 'all', name: 'All Icons' },
    // Physical damage types
    { id: 'bludgeoning', name: 'Bludgeoning' },
    { id: 'piercing', name: 'Piercing' },
    { id: 'slashing', name: 'Slashing' },
    // Elemental damage types
    { id: 'fire', name: 'Fire' },
    { id: 'frost', name: 'Frost' },
    { id: 'lightning', name: 'Lightning' },
    // Magical/Otherworldly damage types
    { id: 'arcane', name: 'Arcane' },
    { id: 'nature', name: 'Nature' },
    { id: 'force', name: 'Force' },
    { id: 'necrotic', name: 'Necrotic' },
    { id: 'radiant', name: 'Radiant' },
    { id: 'poison', name: 'Poison' },
    { id: 'psychic', name: 'Psychic' },
    { id: 'chaos', name: 'Chaos' },
    { id: 'void', name: 'Void' },
    // Utility (non-damage type)
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
      
      // Fire icons
      { id: 'Fire/Fiery Bolt', iconPath: 'Fire/Fiery Bolt', category: 'fire' },
      { id: 'Fire/Swirling Fireball', iconPath: 'Fire/Swirling Fireball', category: 'fire' },
      { id: 'Fire/Flame Burst', iconPath: 'Fire/Flame Burst', category: 'fire' },
      { id: 'Fire/Fiery Comet', iconPath: 'Fire/Fiery Comet', category: 'fire' },
      { id: 'Fire/Meteor Shower', iconPath: 'Fire/Meteor Shower', category: 'fire' },
      { id: 'Utility/Falling Meteor', iconPath: 'Utility/Falling Meteor', category: 'fire' },
      { id: 'Fire/Fiery Vortex', iconPath: 'Fire/Fiery Vortex', category: 'fire' },
      { id: 'Fire/Rising Flames', iconPath: 'Fire/Rising Flames', category: 'fire' },
      { id: 'Fire/Flame Aura', iconPath: 'Fire/Flame Aura', category: 'fire' },
      { id: 'Fire/Fiery Skull', iconPath: 'Fire/Fiery Skull', category: 'fire' },
      { id: 'Fire/Dragon Breath', iconPath: 'Fire/Dragon Breath', category: 'fire' },
      { id: 'Fire/Dragon Breath', iconPath: 'Fire/Dragon Breath', category: 'fire' },
      { id: 'Fire/Flame Skull', iconPath: 'Fire/Flame Skull', category: 'fire' },
      { id: 'Fire/Burning Figure', iconPath: 'Fire/Burning Figure', category: 'fire' },
      { id: 'Fire/Burning Status', iconPath: 'Fire/Burning Status', category: 'fire' },
      { id: 'Fire/Burning Tower', iconPath: 'Fire/Burning Tower', category: 'fire' },
      { id: 'Fire/Fiery Comet', iconPath: 'Fire/Fiery Comet', category: 'fire' },
      { id: 'Utility/Meteor Trail', iconPath: 'Utility/Meteor Trail', category: 'fire' },
      { id: 'Fire/Fiery Arc', iconPath: 'Fire/Fiery Arc', category: 'fire' },
      { id: 'Fire/Fire Butterflies', iconPath: 'Fire/Fire Butterflies', category: 'fire' },
      { id: 'Fire/Fiery Demon', iconPath: 'Fire/Fiery Demon', category: 'fire' },
      { id: 'Fire/Fire Beam', iconPath: 'Fire/Fire Beam', category: 'fire' },
      { id: 'Fire/Fiery Horizon', iconPath: 'Fire/Fiery Horizon', category: 'fire' },
      { id: 'Fire/Fiery Symbol', iconPath: 'Fire/Fiery Symbol', category: 'fire' },
      { id: 'Fire/Fiery Trail', iconPath: 'Fire/Fiery Trail', category: 'fire' },
      { id: 'Fire/Sun Symbol', iconPath: 'Fire/Sun Symbol', category: 'fire' },
      { id: 'Fire/Flame Aura', iconPath: 'Fire/Flame Aura', category: 'fire' },
      { id: 'Fire/Flaming Hand', iconPath: 'Fire/Flaming Hand', category: 'fire' },
      { id: 'Fire/Flowing Lava', iconPath: 'Fire/Flowing Lava', category: 'fire' },
      { id: 'Fire/Burning Ember', iconPath: 'Fire/Burning Ember', category: 'fire' },
      { id: 'Fire/Hand Fire', iconPath: 'Fire/Hand Fire', category: 'fire' },
      { id: 'Fire/Fire Bolt', iconPath: 'Fire/Fire Bolt', category: 'fire' },
      { id: 'Fire/Fiery Comet', iconPath: 'Fire/Fiery Comet', category: 'fire' },
      { id: 'Utility/Meteor Trail', iconPath: 'Utility/Meteor Trail', category: 'fire' },
      { id: 'Utility/Molten Orb', iconPath: 'Utility/Molten Orb', category: 'fire' },
      { id: 'Fire/Dragon Breath', iconPath: 'Fire/Dragon Breath', category: 'fire' },
      { id: 'Fire/Rising Inferno', iconPath: 'Fire/Rising Inferno', category: 'fire' },
      { id: 'Fire/Dragon Breath', iconPath: 'Fire/Dragon Breath', category: 'fire' },
      { id: 'Fire/Three Fire Pillars', iconPath: 'Fire/Three Fire Pillars', category: 'fire' },
      
      // Frost icons
      { id: 'Frost/Dripping Ice', iconPath: 'Frost/Dripping Ice', category: 'frost' },
      { id: 'Frost/Ice Shards', iconPath: 'Frost/Ice Shards', category: 'frost' },
      { id: 'Frost/Cursed Ice', iconPath: 'Frost/Cursed Ice', category: 'frost' },
      { id: 'Fire/Ice and FIre', iconPath: 'Fire/Ice and FIre', category: 'frost' },
      { id: 'Frost/Blow Frost', iconPath: 'Frost/Blow Frost', category: 'frost' },
      
      // Lightning icons
      { id: 'Lightning/Lightning Bolt', iconPath: 'Lightning/Lightning Bolt', category: 'lightning' },
      { id: 'Lightning/Lightning Storm', iconPath: 'Lightning/Lightning Storm', category: 'lightning' },
      
      // Radiant icons
      { id: 'Radiant/Holy Cross', iconPath: 'Radiant/Holy Cross', category: 'radiant' },
      { id: 'Radiant/Radiant Sunburst', iconPath: 'Radiant/Radiant Sunburst', category: 'radiant' },
      { id: 'Radiant/Radiant Sun', iconPath: 'Radiant/Radiant Sun', category: 'radiant' },
      { id: 'Radiant/Divine Blessing', iconPath: 'Radiant/Divine Blessing', category: 'radiant' },
      { id: 'Radiant/Divine Beam', iconPath: 'Radiant/Divine Beam', category: 'radiant' },
      { id: 'Radiant/Divine Illumination', iconPath: 'Radiant/Divine Illumination', category: 'radiant' },
      { id: 'Radiant/Radiant Aura', iconPath: 'Radiant/Radiant Aura', category: 'radiant' },
      { id: 'Radiant/Winged Angel', iconPath: 'Radiant/Winged Angel', category: 'radiant' },
      { id: 'Radiant/Celestial Arc', iconPath: 'Radiant/Celestial Arc', category: 'radiant' },
      { id: 'Radiant/Divine Ascension', iconPath: 'Radiant/Divine Ascension', category: 'radiant' },
      { id: 'Radiant/Divine Entity', iconPath: 'Radiant/Divine Entity', category: 'radiant' },
      { id: 'Radiant/Divine Halo', iconPath: 'Radiant/Divine Halo', category: 'radiant' },
      { id: 'Radiant/Divine Trio', iconPath: 'Radiant/Divine Trio', category: 'radiant' },
      { id: 'Radiant/Divine Radiance', iconPath: 'Radiant/Divine Radiance', category: 'radiant' },
      { id: 'Radiant/Radiant Core', iconPath: 'Radiant/Radiant Core', category: 'radiant' },
      { id: 'Radiant/Radiant Star', iconPath: 'Radiant/Radiant Star', category: 'radiant' },
      { id: 'Arcane/Magical Cross Emblem 2', iconPath: 'Arcane/Magical Cross Emblem 2', category: 'radiant' },
      { id: 'Utility/Winged Creature', iconPath: 'Utility/Winged Creature', category: 'radiant' },
      { id: 'Utility/Winged Crest', iconPath: 'Utility/Winged Crest', category: 'radiant' },
      { id: 'Utility/Winged Warrior', iconPath: 'Utility/Winged Warrior', category: 'radiant' },
      
      // Necrotic icons
      { id: 'Necrotic/Necrotic Skull', iconPath: 'Necrotic/Necrotic Skull', category: 'necrotic' },
      { id: 'Necrotic/Decayed Skull', iconPath: 'Necrotic/Decayed Skull', category: 'necrotic' },
      { id: 'Necrotic/Skull Burst', iconPath: 'Necrotic/Skull Burst', category: 'necrotic' },
      { id: 'Necrotic/Skull Explosion', iconPath: 'Necrotic/Skull Explosion', category: 'necrotic' },
      { id: 'Necrotic/Eclipse Shadow', iconPath: 'Necrotic/Eclipse Shadow', category: 'necrotic' },
      { id: 'Necrotic/Dark Sun Eclipse', iconPath: 'Necrotic/Dark Sun Eclipse', category: 'necrotic' },
      { id: 'Necrotic/Ghostly Menace', iconPath: 'Necrotic/Ghostly Menace', category: 'necrotic' },
      { id: 'Utility/Grim Reaper', iconPath: 'Utility/Grim Reaper', category: 'necrotic' },
      { id: 'Necrotic/Ethereal Skeleton', iconPath: 'Necrotic/Ethereal Skeleton', category: 'necrotic' },
      { id: 'Utility/Bloodshot Eye', iconPath: 'Utility/Bloodshot Eye', category: 'necrotic' },
      { id: 'Necrotic/Bloody Horse Skull', iconPath: 'Necrotic/Bloody Horse Skull', category: 'necrotic' },
      { id: 'Necrotic/Bloody Sacrifice', iconPath: 'Necrotic/Bloody Sacrifice', category: 'necrotic' },
      { id: 'Necrotic/Broken Heart', iconPath: 'Necrotic/Broken Heart', category: 'necrotic' },
      { id: 'Necrotic/Crowned Skull', iconPath: 'Necrotic/Crowned Skull', category: 'necrotic' },
      { id: 'Necrotic/Death Kanji', iconPath: 'Necrotic/Death Kanji', category: 'necrotic' },
      { id: 'Necrotic/Decapitated Spirit', iconPath: 'Necrotic/Decapitated Spirit', category: 'necrotic' },
      { id: 'Necrotic/Ethereal Head', iconPath: 'Necrotic/Ethereal Head', category: 'necrotic' },
      { id: 'Necrotic/Ethereal Spirit', iconPath: 'Necrotic/Ethereal Spirit', category: 'necrotic' },
      { id: 'Necrotic/Glowing Skull', iconPath: 'Necrotic/Glowing Skull', category: 'necrotic' },
      { id: 'Necrotic/Glowing Skull Warning', iconPath: 'Necrotic/Glowing Skull Warning', category: 'necrotic' },
      { id: 'Necrotic/Hanging Skull Emblem', iconPath: 'Necrotic/Hanging Skull Emblem', category: 'necrotic' },
      { id: 'Utility/Hooded Reaper', iconPath: 'Utility/Hooded Reaper', category: 'necrotic' },
      { id: 'Necrotic/Monstrous Skull Face', iconPath: 'Necrotic/Monstrous Skull Face', category: 'necrotic' },
      { id: 'Necrotic/Pile Skulls', iconPath: 'Necrotic/Pile Skulls', category: 'necrotic' },
      { id: 'Necrotic/Pixelated Skull Pattern', iconPath: 'Necrotic/Pixelated Skull Pattern', category: 'necrotic' },
      { id: 'Necrotic/Screaming Skull', iconPath: 'Necrotic/Screaming Skull', category: 'necrotic' },
      { id: 'Necrotic/Skull Grimoire', iconPath: 'Necrotic/Skull Grimoire', category: 'necrotic' },
      { id: 'Necrotic/Spiked Skull', iconPath: 'Necrotic/Spiked Skull', category: 'necrotic' },
      { id: 'Necrotic/Swirling Skull Face', iconPath: 'Necrotic/Swirling Skull Face', category: 'necrotic' },
      { id: 'Necrotic/Triple Skulls', iconPath: 'Necrotic/Triple Skulls', category: 'necrotic' },
      { id: 'Necrotic/Undead Rising', iconPath: 'Necrotic/Undead Rising', category: 'necrotic' },
      { id: 'Necrotic/Zombie Reach', iconPath: 'Necrotic/Zombie Reach', category: 'necrotic' },
      
      // Poison icons
      { id: 'Utility/Scorpion Creature', iconPath: 'Utility/Scorpion Creature', category: 'poison' },
      { id: 'Utility/Slime Blob', iconPath: 'Utility/Slime Blob', category: 'poison' },
      { id: 'Necrotic/Purple Skull', iconPath: 'Necrotic/Purple Skull', category: 'poison' },
      { id: 'Necrotic/Voodoo Doll', iconPath: 'Necrotic/Voodoo Doll', category: 'poison' },
      { id: 'Utility/Spider Creature', iconPath: 'Utility/Spider Creature', category: 'poison' },
      { id: 'Nature/Glowing Green Orb', iconPath: 'Nature/Glowing Green Orb', category: 'poison' },
      { id: 'Nature/Scorpion Stinger', iconPath: 'Nature/Scorpion Stinger', category: 'poison' },
      { id: 'Poison/Poison Venom', iconPath: 'Poison/Poison Venom', category: 'poison' },
      { id: 'Poison/Poison Flask', iconPath: 'Poison/Poison Flask', category: 'poison' },
      { id: 'Poison/Poison Concoction', iconPath: 'Poison/Poison Concoction', category: 'poison' },
      
      // Acid-like icons moved to poison (similar corrosive nature)
      { id: 'Fire/Dripping Lava', iconPath: 'Fire/Dripping Lava', category: 'poison' },
      { id: 'Poison/Poison Toxin', iconPath: 'Poison/Poison Toxin', category: 'poison' },
      { id: 'Poison/Poison Blight', iconPath: 'Poison/Poison Blight', category: 'poison' },
      
      // Psychic icons
      { id: 'Psychic/Brain Psionics', iconPath: 'Psychic/Brain Psionics', category: 'psychic' },
      { id: 'Psychic/Hypnotic Eye', iconPath: 'Psychic/Hypnotic Eye', category: 'psychic' },
      { id: 'Utility/All Seeing Eye', iconPath: 'Utility/All Seeing Eye', category: 'psychic' },
      { id: 'Psychic/Psychic Emanation', iconPath: 'Psychic/Psychic Emanation', category: 'psychic' },
      { id: 'Psychic/Puppet Control', iconPath: 'Psychic/Puppet Control', category: 'psychic' },
      { id: 'Psychic/Psionic Construct', iconPath: 'Psychic/Psionic Construct', category: 'psychic' },
      { id: 'Utility/Eyeball Optic Nerve', iconPath: 'Utility/Eyeball Optic Nerve', category: 'psychic' },
      { id: 'Psychic/Mind Read', iconPath: 'Psychic/Mind Read', category: 'psychic' },
      { id: 'Utility/Glowing Eyes', iconPath: 'Utility/Glowing Eyes', category: 'psychic' },
      { id: 'Utility/Glowing Eyed Entity', iconPath: 'Utility/Glowing Eyed Entity', category: 'psychic' },
      { id: 'Psychic/Mind Radiance', iconPath: 'Psychic/Mind Radiance', category: 'psychic' },
      { id: 'Utility/Reptilian Dragon Eye', iconPath: 'Utility/Reptilian Dragon Eye', category: 'psychic' },
      { id: 'Utility/Triangle Eye Symbol', iconPath: 'Utility/Triangle Eye Symbol', category: 'psychic' },
      { id: 'Utility/Watchful Eye', iconPath: 'Utility/Watchful Eye', category: 'psychic' },
      { id: 'Necrotic/Three Eyed Ghost', iconPath: 'Necrotic/Three Eyed Ghost', category: 'psychic' },
      
      // Force icons
      { id: 'Force/Force Touch', iconPath: 'Force/Force Touch', category: 'force' },
      { id: 'Force/Energy Blast', iconPath: 'Force/Energy Blast', category: 'force' },
      { id: 'Force/Energy Impact', iconPath: 'Force/Energy Impact', category: 'force' },
      { id: 'Force/Force Wave', iconPath: 'Force/Force Wave', category: 'force' },
      { id: 'Force/Energy Beam', iconPath: 'Force/Energy Beam', category: 'force' },
      { id: 'Force/Diagonal Energy Beam', iconPath: 'Force/Diagonal Energy Beam', category: 'force' },
      { id: 'Force/Energy Burst', iconPath: 'Force/Energy Burst', category: 'force' },
      { id: 'Force/Diagonal Energy Ray', iconPath: 'Force/Diagonal Energy Ray', category: 'force' },
      { id: 'Force/Diagonal Energy Waves', iconPath: 'Force/Diagonal Energy Waves', category: 'force' },
      { id: 'Force/Diagonal Energy', iconPath: 'Force/Diagonal Energy', category: 'force' },
      { id: 'Force/Energy Burst Hand', iconPath: 'Force/Energy Burst Hand', category: 'force' },
      { id: 'Force/Energy Impact', iconPath: 'Force/Energy Impact', category: 'force' },
      { id: 'Nature/Air Blow', iconPath: 'Nature/Air Blow', category: 'force' },
      { id: 'Force/Explosive Burst', iconPath: 'Force/Explosive Burst', category: 'force' },
      { id: 'Force/Explosive Burst', iconPath: 'Force/Explosive Burst', category: 'force' },
      
      // Thunder-like icons moved to lightning (similar sound/air effects)
      { id: 'magic/tornado-vortex', iconPath: 'magic/tornado-vortex', category: 'lightning' },
      { id: 'magic/wind-gust', iconPath: 'magic/wind-gust', category: 'lightning' },
      { id: 'combat/explosion-burst', iconPath: 'combat/explosion-burst', category: 'lightning' },
      { id: 'combat/bright-explosion', iconPath: 'combat/bright-explosion', category: 'lightning' },
      { id: 'combat/radial-explosion', iconPath: 'combat/radial-explosion', category: 'lightning' },
      { id: 'combat/starburst-explosion', iconPath: 'combat/starburst-explosion', category: 'lightning' },
      { id: 'combat/yellow-burst-explosion', iconPath: 'combat/yellow-burst-explosion', category: 'lightning' },
      
      // Nature icons
      { id: 'Nature/Nature Natural', iconPath: 'Nature/Nature Natural', category: 'nature' },
      { id: 'Nature/Nature Primal', iconPath: 'Nature/Nature Primal', category: 'nature' },
      { id: 'Nature/Gnarled Roots', iconPath: 'Nature/Gnarled Roots', category: 'nature' },
      { id: 'Nature/Root Network', iconPath: 'Nature/Root Network', category: 'nature' },
      { id: 'Nature/Tree', iconPath: 'Nature/Tree', category: 'nature' },
      { id: 'Nature/Thorned Flower', iconPath: 'Nature/Thorned Flower', category: 'nature' },
      { id: 'Nature/Nature Scene', iconPath: 'Nature/Nature Scene', category: 'nature' },
      { id: 'Nature/Elemental Bloom', iconPath: 'Nature/Elemental Bloom', category: 'nature' },
      { id: 'Necrotic/Glowing Aquatic', iconPath: 'Necrotic/Glowing Aquatic', category: 'nature' },
      { id: 'Nature/Lunar Howl', iconPath: 'Nature/Lunar Howl', category: 'nature' },
      { id: 'Nature/Spirit With Wisps', iconPath: 'Nature/Spirit With Wisps', category: 'nature' },
      { id: 'Nature/Starry Night', iconPath: 'Nature/Starry Night', category: 'nature' },
      { id: 'Nature/Maple Leaf', iconPath: 'Nature/Maple Leaf', category: 'nature' },
      { id: 'Nature/Single Leaf', iconPath: 'Nature/Single Leaf', category: 'nature' },
      { id: 'Nature/Stylized Maple Leaf', iconPath: 'Nature/Stylized Maple Leaf', category: 'nature' },
      { id: 'Nature/Stylized Tree', iconPath: 'Nature/Stylized Tree', category: 'nature' },
      { id: 'Nature/Fanned Leaf', iconPath: 'Nature/Fanned Leaf', category: 'nature' },
      { id: 'Nature/Leaf Water Droplets', iconPath: 'Nature/Leaf Water Droplets', category: 'nature' },
      
      // Shadow icons moved to void (similar dark/void themes)
      { id: 'Void/Shadow Entity', iconPath: 'Void/Shadow Entity', category: 'void' },
      { id: 'Shadow Hood', iconPath: 'Shadow Hood', category: 'void' },
      { id: 'Twin Shadows', iconPath: 'Twin Shadows', category: 'void' },
      { id: 'Necrotic/Ghostly Trio', iconPath: 'Necrotic/Ghostly Trio', category: 'void' },
      { id: 'Utility/Hooded Figure Archway', iconPath: 'Utility/Hooded Figure Archway', category: 'void' },
      { id: 'Utility/Hooded Mystic', iconPath: 'Utility/Hooded Mystic', category: 'void' },
      { id: 'Utility/Hooded Spirit', iconPath: 'Utility/Hooded Spirit', category: 'void' },
      { id: 'Necrotic/Screaming Ghost', iconPath: 'Necrotic/Screaming Ghost', category: 'void' },
      { id: 'Necrotic/Screaming Ghost Ornate', iconPath: 'Necrotic/Screaming Ghost Ornate', category: 'void' },
      { id: 'Necrotic/Spectral Mask', iconPath: 'Necrotic/Spectral Mask', category: 'void' },
      { id: 'Void/Twin Crescents', iconPath: 'Void/Twin Crescents', category: 'void' },
      { id: 'Void/Wraith Form', iconPath: 'Void/Wraith Form', category: 'void' },
      
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
      
      // Void icons
      { id: 'Void/Void Portal Mage', iconPath: 'Void/Void Portal Mage', category: 'void' },
      { id: 'Void/Black Hole', iconPath: 'Void/Black Hole', category: 'void' },
      { id: 'Necrotic/Eclipse Shadow', iconPath: 'Necrotic/Eclipse Shadow', category: 'void' },
      { id: 'Necrotic/Dark Sun Eclipse', iconPath: 'Necrotic/Dark Sun Eclipse', category: 'void' },
      { id: 'Necrotic/Cosmic Entity', iconPath: 'Necrotic/Cosmic Entity', category: 'void' },
      { id: 'Utility/Amorphous Entity', iconPath: 'Utility/Amorphous Entity', category: 'void' },
      { id: 'Utility/Emerging Figure', iconPath: 'Utility/Emerging Figure', category: 'void' },
      { id: 'Utility/Empowered Silhouette', iconPath: 'Utility/Empowered Silhouette', category: 'void' },
      { id: 'Utility/Glowing Silhouette', iconPath: 'Utility/Glowing Silhouette', category: 'void' },
      { id: 'Utility/Menacing Face', iconPath: 'Utility/Menacing Face', category: 'void' },
      { id: 'Void/Purple Star', iconPath: 'Void/Purple Star', category: 'void' },
      { id: 'Utility/Robed Figure', iconPath: 'Utility/Robed Figure', category: 'void' },
      
      // Piercing icons
      { id: 'Piercing/Scatter Shot', iconPath: 'Piercing/Scatter Shot', category: 'piercing' },
      { id: 'Piercing/Bow Arrow', iconPath: 'Piercing/Bow Arrow', category: 'piercing' },
      { id: 'Piercing/Arrow Intertwined Rings', iconPath: 'Piercing/Arrow Intertwined Rings', category: 'piercing' },
      { id: 'Piercing/Bleeding Arrow', iconPath: 'Piercing/Bleeding Arrow', category: 'piercing' },
      { id: 'Piercing/Dagger Pierce', iconPath: 'Piercing/Dagger Pierce', category: 'piercing' },
      { id: 'Piercing/Diagonal Spear', iconPath: 'Piercing/Diagonal Spear', category: 'piercing' },
      { id: 'Piercing/Spear Warrior', iconPath: 'Piercing/Spear Warrior', category: 'piercing' },
      { id: 'Piercing/Bone Spear', iconPath: 'Piercing/Bone Spear', category: 'piercing' },
      { id: 'Piercing/Javelin Throw', iconPath: 'Piercing/Javelin Throw', category: 'piercing' },
      { id: 'Piercing/Golden Spear Sparkles', iconPath: 'Piercing/Golden Spear Sparkles', category: 'piercing' },
      { id: 'Piercing/Javelin Throw', iconPath: 'Piercing/Javelin Throw', category: 'piercing' },
      { id: 'Piercing/Water Trident', iconPath: 'Piercing/Water Trident', category: 'piercing' },
      { id: 'Piercing/Water Trident', iconPath: 'Piercing/Water Trident', category: 'piercing' },
      { id: 'Piercing/Three Vertical Spears', iconPath: 'Piercing/Three Vertical Spears', category: 'piercing' },
      { id: 'Piercing/Upward Arrow', iconPath: 'Piercing/Upward Arrow', category: 'piercing' },
      { id: 'Piercing/Heart Pierce', iconPath: 'Piercing/Heart Pierce', category: 'piercing' },
      { id: 'Piercing/Syringe Dart', iconPath: 'Piercing/Syringe Dart', category: 'piercing' },
      { id: 'Piercing/Target Three Arrows', iconPath: 'Piercing/Target Three Arrows', category: 'piercing' },
      { id: 'Piercing/Triple Arrows', iconPath: 'Piercing/Triple Arrows', category: 'piercing' },
      { id: 'Piercing/Three Descending Arrows', iconPath: 'Piercing/Three Descending Arrows', category: 'piercing' },
      
      // Bludgeoning icons
      { id: 'Bludgeoning/Striking Hammer', iconPath: 'Bludgeoning/Striking Hammer', category: 'bludgeoning' },
      { id: 'Bludgeoning/Swinging Hammer', iconPath: 'Bludgeoning/Swinging Hammer', category: 'bludgeoning' },
      { id: 'Bludgeoning/Hammer', iconPath: 'Bludgeoning/Hammer', category: 'bludgeoning' },
      { id: 'Bludgeoning/Ceremonial Hammer', iconPath: 'Bludgeoning/Ceremonial Hammer', category: 'bludgeoning' },
      { id: 'Bludgeoning/Hard Step', iconPath: 'Bludgeoning/Hard Step', category: 'bludgeoning' },
      { id: 'Bludgeoning/Hammer Crush', iconPath: 'Bludgeoning/Hammer Crush', category: 'bludgeoning' },
      { id: 'Utility/Falling Block', iconPath: 'Utility/Falling Block', category: 'bludgeoning' },
      { id: 'Bludgeoning/Fist Strike', iconPath: 'Bludgeoning/Fist Strike', category: 'bludgeoning' },
      { id: 'Bludgeoning/Bone Fist', iconPath: 'Bludgeoning/Bone Fist', category: 'bludgeoning' },
      { id: 'Bludgeoning/Golden Fist', iconPath: 'Bludgeoning/Golden Fist', category: 'bludgeoning' },
      { id: 'Bludgeoning/Punch Impact', iconPath: 'Bludgeoning/Punch Impact', category: 'bludgeoning' },
      { id: 'Piercing/Impact Burst', iconPath: 'Piercing/Impact Burst', category: 'bludgeoning' },
      { id: 'Force/Impact Explosion', iconPath: 'Force/Impact Explosion', category: 'bludgeoning' },
      { id: 'Bludgeoning/Cranium Crush', iconPath: 'Bludgeoning/Cranium Crush', category: 'bludgeoning' },
      { id: 'Bludgeoning/Punch', iconPath: 'Bludgeoning/Punch', category: 'bludgeoning' },
      { id: 'Necrotic/Spiked Flail', iconPath: 'Necrotic/Spiked Flail', category: 'bludgeoning' },
      { id: 'Necrotic/Skeleton With Flail', iconPath: 'Necrotic/Skeleton With Flail', category: 'bludgeoning' },
      
      // Slashing icons
      { id: 'Slashing/Bloody Meat Cleaver', iconPath: 'Slashing/Bloody Meat Cleaver', category: 'slashing' },
      { id: 'Slashing/Bloody Slash', iconPath: 'Slashing/Bloody Slash', category: 'slashing' },
      { id: 'Slashing/Bloody Sword', iconPath: 'Slashing/Bloody Sword', category: 'slashing' },
      { id: 'Slashing/Bloody Blade', iconPath: 'Slashing/Bloody Blade', category: 'slashing' },
      { id: 'Slashing/Sword Strike', iconPath: 'Slashing/Sword Strike', category: 'slashing' },
      { id: 'Slashing/Striking Sword', iconPath: 'Slashing/Striking Sword', category: 'slashing' },
      { id: 'Arcane/Enchanted Sword', iconPath: 'Arcane/Enchanted Sword', category: 'slashing' },
      { id: 'Slashing/Flaming Sword', iconPath: 'Slashing/Flaming Sword', category: 'slashing' },
      { id: 'Fire/Fiery Slash', iconPath: 'Fire/Fiery Slash', category: 'slashing' },
      { id: 'Slashing/Quick Slash', iconPath: 'Slashing/Quick Slash', category: 'slashing' },
      { id: 'Slashing/Rapid Slash', iconPath: 'Slashing/Rapid Slash', category: 'slashing' },
      { id: 'Slashing/Cross Slash', iconPath: 'Slashing/Cross Slash', category: 'slashing' },
      { id: 'Slashing/Crossed Swords', iconPath: 'Slashing/Crossed Swords', category: 'slashing' },
      { id: 'Slashing/Curved Scythe', iconPath: 'Slashing/Curved Scythe', category: 'slashing' },
      { id: 'Slashing/Jagged Scythe', iconPath: 'Slashing/Jagged Scythe', category: 'slashing' },
      { id: 'Slashing/Shattering Blade', iconPath: 'Slashing/Shattering Blade', category: 'slashing' },
      { id: 'Slashing/Glowing Slash', iconPath: 'Slashing/Glowing Slash', category: 'slashing' },
      { id: 'Slashing/Energized Slash', iconPath: 'Slashing/Energized Slash', category: 'slashing' },
      { id: 'Slashing/Diagonal Energy Slash', iconPath: 'Slashing/Diagonal Energy Slash', category: 'slashing' },
      { id: 'Slashing/Dual Blades', iconPath: 'Slashing/Dual Blades', category: 'slashing' },
      { id: 'Piercing/Dual Daggers', iconPath: 'Piercing/Dual Daggers', category: 'slashing' },
      { id: 'Slashing/Crossed Scimitars', iconPath: 'Slashing/Crossed Scimitars', category: 'slashing' },
      
      // Utility icons
      { id: 'Utility/Ornate Symbol', iconPath: 'Utility/Ornate Symbol', category: 'utility' },
      { id: 'Utility/Glowing Orb', iconPath: 'Utility/Glowing Orb', category: 'utility' },
      { id: 'Utility/Summit Victory', iconPath: 'Utility/Summit Victory', category: 'utility' },
      { id: 'Utility/Ancient Coin', iconPath: 'Utility/Ancient Coin', category: 'utility' },
      { id: 'Utility/Atlas Burden', iconPath: 'Utility/Atlas Burden', category: 'utility' },
      { id: 'Utility/All Seeing Eye', iconPath: 'Utility/All Seeing Eye', category: 'utility' },
      { id: 'Utility/Healing Compass', iconPath: 'Utility/Healing Compass', category: 'utility' },
      { id: 'Utility/Flying Raven', iconPath: 'Utility/Flying Raven', category: 'utility' },
      { id: 'Utility/Underwater Bubbles', iconPath: 'Utility/Underwater Bubbles', category: 'utility' },
      { id: 'Utility/Mountain Summit', iconPath: 'Utility/Mountain Summit', category: 'utility' },
      { id: 'Utility/Pointing Comet', iconPath: 'Utility/Pointing Comet', category: 'utility' },
      { id: 'Utility/Stylized World Map', iconPath: 'Utility/Stylized World Map', category: 'utility' },
      { id: 'Utility/Parchment Bag Drawing', iconPath: 'Utility/Parchment Bag Drawing', category: 'utility' },
      { id: 'Utility/Serene Bust', iconPath: 'Utility/Serene Bust', category: 'utility' },
      { id: 'Utility/Generic Avatar', iconPath: 'Utility/Generic Avatar', category: 'utility' },
      { id: 'Utility/Blocked Action', iconPath: 'Utility/Blocked Action', category: 'utility' },
      { id: 'Utility/Sleep', iconPath: 'Utility/Sleep', category: 'utility' },
      { id: 'Utility/Interlocking Chains', iconPath: 'Utility/Interlocking Chains', category: 'utility' },
      { id: 'Utility/Skeleton Key', iconPath: 'Utility/Skeleton Key', category: 'utility' },
      { id: 'Utility/Stylized Key', iconPath: 'Utility/Stylized Key', category: 'utility' },
      { id: 'Utility/Compass Symbol', iconPath: 'Utility/Compass Symbol', category: 'utility' },
      { id: 'Utility/Balance Scale', iconPath: 'Utility/Balance Scale', category: 'utility' },
      { id: 'Utility/Hourglass', iconPath: 'Utility/Hourglass', category: 'utility' },
      { id: 'Utility/Lightbulb Insight', iconPath: 'Utility/Lightbulb Insight', category: 'utility' },
      { id: 'Utility/Utility', iconPath: 'Utility/Utility', category: 'utility' },
      { id: 'Utility/Exclamation Mark', iconPath: 'Utility/Exclamation Mark', category: 'utility' },
      { id: 'Utility/Cracked Surface', iconPath: 'Utility/Cracked Surface', category: 'utility' },
      { id: 'Utility/Lava Cracks', iconPath: 'Utility/Lava Cracks', category: 'utility' },
      { id: 'Utility/Lava Veins', iconPath: 'Utility/Lava Veins', category: 'utility' }
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

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Render the modal as a portal to document.body to avoid container constraints
  return ReactDOM.createPortal(
    <div className="icon-selector-overlay">
      <div className="icon-selector-modal" ref={modalRef}>
        <div className="icon-selector-header">
          <h3>Select a Spell Icon</h3>
          <button className="icon-selector-close-btn" onClick={onClose}>×</button>
        </div>

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
      </div>
    </div>,
    document.body
  );
};

export default IconSelector;
