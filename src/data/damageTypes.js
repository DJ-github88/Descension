/**
 * Damage types with associated colors and descriptions for the spell wizard
 */

const DAMAGE_TYPES = {
    acid: {
      name: 'Acid',
      description: 'Corrosive damage that can melt armor and dissolve organic material.',
      color: '#32CD32', // Green
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_creature_poison_02.jpg'
    },
    bludgeoning: {
      name: 'Bludgeoning',
      description: 'Physical damage from blunt force impacts like clubs, hammers, or falling.',
      color: '#8B4513', // Brown
      icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_mace_02.jpg'
    },
    cold: {
      name: 'Cold',
      description: 'Icy damage that can slow or freeze targets.',
      color: '#87CEEB', // Light blue
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostbolt02.jpg'
    },
    fire: {
      name: 'Fire',
      description: 'Burning damage that can ignite flammable objects and set targets ablaze.',
      color: '#FF4500', // Orange-red
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fire.jpg'
    },
    force: {
      name: 'Force',
      description: 'Pure magical energy that affects even incorporeal beings.',
      color: '#ff66ff', // Pink
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_blast.jpg'
    },
    lightning: {
      name: 'Lightning',
      description: 'Electrical damage that can arc between targets and stun.',
      color: '#FFD700', // Gold
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_lightning.jpg'
    },
    necrotic: {
      name: 'Necrotic',
      description: 'Dark energy that withers matter and saps life force.',
      color: '#4B0082', // Indigo
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowbolt.jpg'
    },
    piercing: {
      name: 'Piercing',
      description: 'Physical damage from pointed weapons that penetrate armor.',
      color: '#C0C0C0', // Silver
      icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg'
    },
    poison: {
      name: 'Poison',
      description: 'Toxic damage that can weaken and sicken targets over time.',
      color: '#008000', // Dark green
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_dualweild.jpg'
    },
    psychic: {
      name: 'Psychic',
      description: 'Mental energy that affects the mind and consciousness.',
      color: '#FF00FF', // Magenta
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindtwisting.jpg'
    },
    radiant: {
      name: 'Radiant',
      description: 'Divine light that burns the unholy and purifies corruption.',
      color: '#FFFACD', // Light yellow
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holybolt.jpg'
    },
    slashing: {
      name: 'Slashing',
      description: 'Physical damage from bladed weapons that cut and slice.',
      color: '#A52A2A', // Brown-red
      icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_axe_01.jpg'
    },
    thunder: {
      name: 'Thunder',
      description: 'Concussive damage from sound waves and sonic energy.',
      color: '#0066ff', // Blue
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_thunderclap.jpg'
    },
    
    // Additional custom damage types can be added here
    void: {
      name: 'Void',
      description: 'Otherworldly energies from beyond reality that corrupt and consume.',
      color: '#9370DB', // Medium purple
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_priest_void-blast.jpg'
    },
    arcane: {
      name: 'Arcane',
      description: 'Pure magical energy manipulated directly from the weave of magic.',
      color: '#BA55D3', // Medium orchid
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg'
    },
    shadow: {
      name: 'Shadow',
      description: 'Darkness given form, sapping both physical and mental strength.',
      color: '#483D8B', // Dark slate blue
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowfury.jpg'
    },
    holy: {
      name: 'Holy',
      description: 'Divine energy that heals allies and harms the undead and fiends.',
      color: '#FFD700', // Gold
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holybolt.jpg'
    },
    nature: {
      name: 'Nature',
      description: 'Primal energy from the natural world that can heal or harm.',
      color: '#7CFC00', // Lawn green
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg'
    },
    chaos: {
      name: 'Chaos',
      description: 'Unpredictable magic that warps reality and defies conventional rules.',
      color: '#FF1493', // Deep pink
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_felflamebreath.jpg'
    }
  };
  
  // Function to get damage type details by ID
  export const getDamageType = (typeId) => {
    return DAMAGE_TYPES[typeId.toLowerCase()] || null;
  };
  
  // Function to get damage type color
  export const getDamageTypeColor = (typeId) => {
    const type = getDamageType(typeId);
    return type ? type.color : '#ffffff';
  };
  
  // Function to get all damage types as an array
  export const getAllDamageTypes = () => {
    return Object.entries(DAMAGE_TYPES).map(([id, data]) => ({
      id,
      ...data
    }));
  };
  
  export default DAMAGE_TYPES;