/**
 * Mythrill Damage Types
 * 9 core types + Healing (separate restorative category)
 */

const DAMAGE_TYPES = {
    physical: {
      name: 'Physical',
      description: 'Martial damage from weapons, claws, and brute force. Bludgeoning, piercing, and slashing are weapon properties, not separate damage types.',
      color: '#6B4226',
      icon: 'Bludgeoning/Hammer Crush'
    },
    ember: {
      name: 'Ember',
      description: 'Scorching heat and divine light. Sol\'s buried warmth made manifest, burning the impure and igniting the hopeless.',
      color: '#D4380D',
      icon: 'Fire/Volcanic Corruption'
    },
    rime: {
      name: 'Rime',
      description: 'The frozen world\'s grip. Icy energy that slows, freezes, and shatters.',
      color: '#2C5F7C',
      icon: 'Frost/Frostbite Variant 2'
    },
    storm: {
      name: 'Storm',
      description: 'Kinetic fury from lightning, thunder, and concussive force. Energy that arcs, stuns, and shatters barriers.',
      color: '#8B7328',
      icon: 'Lightning/Thunderstorm'
    },
    arcane: {
      name: 'Arcane',
      description: 'Pure magic. Binding ritual residue and raw arcane energy that affects even the incorporeal.',
      color: '#5B3A8C',
      icon: 'Arcane/Ebon Blaze'
    },
    primal: {
      name: 'Primal',
      description: 'Living things and growth. The world\'s refusal to die, channeling natural energy and life force.',
      color: '#2D5A1E',
      icon: 'Nature/Nature Natural 11'
    },
    blight: {
      name: 'Blight',
      description: 'Keth-Amar\'s corruption. Necrotic decay, void consumption, toxic poison, and caustic acid that withers all it touches.',
      color: '#3D1F4E',
      icon: 'Necrotic/Necrotic Wither'
    },
    wyrd: {
      name: 'Wyrd',
      description: 'Spiritual rot. Chaotic and psychic energy that warps minds and fractures reality.',
      color: '#7A2040',
      icon: 'Psychic/Psychic Telepathy'
    },
    divine: {
      name: 'Divine',
      description: 'Sacred radiance drawn from the upper spheres. Smite the unholy, bless the faithful, and burn corruption with pure celestial light.',
      color: '#DAA520',
      icon: 'Radiant/Radiant Divinity'
    },
    healing: {
      name: 'Healing',
      description: 'Restorative energy that repairs damage and restores vitality. Separate from damage types.',
      color: '#2E8B57',
      icon: 'Healing/Golden Heart'
    },
  };

  export const LEGACY_TYPE_MAP = {
    cold: 'rime',
    ice: 'rime',
    frost: 'rime',
    fire: 'ember',
    radiant: 'divine',
    holy: 'divine',
    electric: 'storm',
    lightning: 'storm',
    force: 'storm',
    thunder: 'storm',
    shadow: 'blight',
    necrotic: 'blight',
    void: 'blight',
    poison: 'blight',
    acid: 'blight',
    viscera: 'primal',
    nature: 'primal',
    chaos: 'wyrd',
    psychic: 'wyrd',
    bludgeoning: 'physical',
    piercing: 'physical',
    slashing: 'physical',
  };

  export const ALL_DAMAGE_TYPE_IDS = Object.keys(DAMAGE_TYPES);

  export const PHYSICAL_TYPES = ['physical'];

  export const WEAPON_PROPERTIES = ['bludgeoning', 'piercing', 'slashing'];

  export const SPELL_DAMAGE_TYPES = ALL_DAMAGE_TYPE_IDS.filter(
    t => t !== 'healing'
  );

  export const normalizeDamageType = (type) => {
    if (!type) return type;
    const lower = type.toLowerCase();
    return LEGACY_TYPE_MAP[lower] || lower;
  };

  export const getDamageType = (typeId) => {
    return DAMAGE_TYPES[typeId.toLowerCase()] || null;
  };

  export const getDamageTypeColor = (typeId) => {
    const type = getDamageType(typeId);
    return type ? type.color : '#ffffff';
  };

  export const getAllDamageTypes = () => {
    return Object.entries(DAMAGE_TYPES).map(([id, data]) => ({
      id,
      ...data
    }));
  };

  export { DAMAGE_TYPES as default };
