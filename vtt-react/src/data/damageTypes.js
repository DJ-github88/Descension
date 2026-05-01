/**
 * Damage types with associated colors and descriptions for the spell wizard
 * Using standard D&D damage types
 */

const DAMAGE_TYPES = {
    bludgeoning: {
      name: 'Bludgeoning',
      description: 'Physical damage from blunt force impacts like clubs, hammers, or falling.',
      color: '#5C4033',
      icon: 'Bludgeoning/Hammer Crush'
    },
    frost: {
      name: 'Frost',
      description: 'Icy damage that can slow or freeze targets.',
      color: '#2C5F7C',
      icon: 'Frost/Frostbite Variant 2'
    },
    fire: {
      name: 'Fire',
      description: 'Burning damage that can ignite flammable objects and set targets ablaze.',
      color: '#8B1A1A',
      icon: 'Fire/Volcanic Corruption'
    },
    arcane: {
      name: 'Arcane',
      description: 'Pure magical energy from arcane sources.',
      color: '#5B3A8C',
      icon: 'Arcane/Ebon Blaze'
    },
    nature: {
      name: 'Nature',
      description: 'Natural energy from the living world and primal forces.',
      color: '#2D5A1E',
      icon: 'Nature/Nature Natural 11'
    },
    force: {
      name: 'Force',
      description: 'Pure magical energy that affects even incorporeal beings.',
      color: '#7A3B6E',
      icon: 'Force/Force Touch'
    },
    lightning: {
      name: 'Lightning',
      description: 'Electrical damage that can arc between targets and stun.',
      color: '#8B7328',
      icon: 'Lightning/Thunderstorm'
    },
    necrotic: {
      name: 'Necrotic',
      description: 'Dark energy that withers matter and saps life force.',
      color: '#3D1F4E',
      icon: 'Necrotic/Necrotic Wither'
    },
    piercing: {
      name: 'Piercing',
      description: 'Physical damage from pointed weapons that penetrate armor.',
      color: '#5A6A72',
      icon: 'Piercing/Piercing Thrust 3'
    },
    poison: {
      name: 'Poison',
      description: 'Toxic damage that can weaken and sicken targets over time.',
      color: '#2D6A3F',
      icon: 'Poison/Poison Venom 4'
    },
    psychic: {
      name: 'Psychic',
      description: 'Mental energy that affects the mind and consciousness.',
      color: '#7A2E6E',
      icon: 'Psychic/Psychic Telepathy'
    },
    radiant: {
      name: 'Radiant',
      description: 'Divine light that burns the unholy and purifies corruption.',
      color: '#8B7328',
      icon: 'Radiant/Radiant Light 5'
    },
    slashing: {
      name: 'Slashing',
      description: 'Physical damage from bladed weapons that cut and slice.',
      color: '#6B2D2D',
      icon: 'Slashing/Slashing Slash'
    },
    chaos: {
      name: 'Chaos',
      description: 'Unpredictable magical energy that defies categorization and creates random effects.',
      color: '#7A2040',
      icon: 'Chaos/Chaotic Shuffle'
    },
    void: {
      name: 'Void',
      description: 'The absence of existence, consuming all that it touches.',
      color: '#1A1A2E',
      icon: 'Void/Void Scream'
    },

    // End of standard D&D damage types
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