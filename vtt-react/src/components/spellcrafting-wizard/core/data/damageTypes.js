
const DAMAGE_TYPES = [
    {
      id: 'physical',
      name: 'Physical',
      description: 'Martial damage from weapons, claws, and brute force. Bludgeoning, piercing, and slashing are weapon properties.',
      icon: '/assets/icons/abilities/Bludgeoning/Hammer.png',
      category: 'physical',
      commonResistance: 'heavy armor',
      commonVulnerability: 'constructs'
    },
    {
      id: 'ember',
      name: 'Ember',
      description: 'Scorching heat and divine light from Sol\'s buried warmth.',
      icon: '/assets/icons/abilities/Fire/Fire Orb.png',
      category: 'elemental',
      commonResistance: 'red dragons, fire elementals',
      commonVulnerability: 'undead, plants, ice creatures'
    },
    {
      id: 'rime',
      name: 'Rime',
      description: 'The frozen world\'s grip. Icy energy that slows, freezes, and shatters.',
      icon: '/assets/icons/abilities/Frost/Frost Bolt.png',
      category: 'elemental',
      commonResistance: 'ice elementals, white dragons',
      commonVulnerability: 'fire creatures, water elementals'
    },
    {
      id: 'storm',
      name: 'Storm',
      description: 'Kinetic fury from lightning, thunder, and concussive force.',
      icon: '/assets/icons/abilities/Lightning/Lightning Bolt.png',
      category: 'elemental',
      commonResistance: 'blue dragons, air elementals',
      commonVulnerability: 'creatures in metal armor, water-based creatures'
    },
    {
      id: 'arcane',
      name: 'Arcane',
      description: 'Pure magic. Binding ritual residue and raw arcane energy.',
      icon: '/assets/icons/abilities/Arcane/Arcane.png',
      category: 'arcane',
      commonResistance: 'arcane golems, magic-resistant creatures',
      commonVulnerability: 'non-magical creatures, constructs'
    },
    {
      id: 'primal',
      name: 'Primal',
      description: 'Living things and growth. The world\'s refusal to die.',
      icon: '/assets/icons/abilities/Nature/Natural.png',
      category: 'elemental',
      commonResistance: 'nature-aligned creatures, druids',
      commonVulnerability: 'undead, constructs, corrupted beings'
    },
    {
      id: 'blight',
      name: 'Blight',
      description: 'Keth-Amar\'s corruption. Necrotic decay, void consumption, poison, and acid.',
      icon: '/assets/icons/abilities/Necrotic/Drain Life.png',
      category: 'otherworldly',
      commonResistance: 'undead, constructs',
      commonVulnerability: 'living creatures, plants'
    },
    {
      id: 'wyrd',
      name: 'Wyrd',
      description: 'Spiritual rot. Chaotic and psychic energy that warps minds and fractures reality.',
      icon: '/assets/icons/abilities/Psychic/Purple Star.png',
      category: 'otherworldly',
      commonResistance: 'mindless creatures, constructs',
      commonVulnerability: 'intelligent creatures, psionic beings'
    },
    {
      id: 'healing',
      name: 'Healing',
      description: 'Restorative energy that repairs damage and restores vitality.',
      icon: '/assets/icons/abilities/Healing/Golden Heart.png',
      category: 'restorative',
      commonResistance: 'undead (reversed)',
      commonVulnerability: 'living creatures'
    },
];

const LEGACY_TYPE_MAP = {
    cold: 'rime',
    ice: 'rime',
    frost: 'rime',
    fire: 'ember',
    radiant: 'ember',
    holy: 'ember',
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

const PHYSICAL_TYPES = ['physical'];

const WEAPON_PROPERTIES = ['bludgeoning', 'piercing', 'slashing'];


const getDamageTypeById = (id) => {
    return DAMAGE_TYPES.find(damageType => damageType.id === id) || null;
};


const getDamageTypesByCategory = (category) => {
    if (!category) return DAMAGE_TYPES;
    return DAMAGE_TYPES.filter(damageType => damageType.category === category);
};


const getDamageTypesByIds = (ids) => {
    if (!ids || !Array.isArray(ids)) return [];
    return ids.map(id => getDamageTypeById(id)).filter(Boolean);
};


const doesDamageBypassResistance = (id) => {
    const damageType = getDamageTypeById(id);
    return damageType ? !!damageType.bypassesNormalResistance : false;
};


const calculateResistance = (damageTypeId, targetResistances = {}, spellPenetration = 0) => {
    const resistanceId = `${damageTypeId}_resistance`;
    let resistance = targetResistances[resistanceId] || 0;

    resistance = Math.max(0, resistance - spellPenetration);

    return Math.min(75, resistance);
};

const normalizeDamageType = (type) => {
    if (!type) return type;
    const lower = type.toLowerCase();
    return LEGACY_TYPE_MAP[lower] || lower;
};

export {
    DAMAGE_TYPES,
    LEGACY_TYPE_MAP,
    PHYSICAL_TYPES,
    WEAPON_PROPERTIES,
    getDamageTypeById,
    getDamageTypesByCategory,
    getDamageTypesByIds,
    doesDamageBypassResistance,
    calculateResistance,
    normalizeDamageType
};
