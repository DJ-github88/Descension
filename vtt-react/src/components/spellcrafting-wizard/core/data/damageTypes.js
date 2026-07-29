
const DAMAGE_TYPES = [
    {
      id: 'smashing',
      name: 'Smashing',
      description: 'Concussive physical impact from heavy warhammers, blunt strikes, kinetic shockwaves, and stone crushing.',
      icon: '/assets/icons/abilities/Bludgeoning/Hammer.png',
      category: 'physical',
      commonResistance: 'heavy armor',
      commonVulnerability: 'brittle constructs'
    },
    {
      id: 'stabbing',
      name: 'Stabbing',
      description: 'Piercing physical thrusts from spears, daggers, rapiers, stakes, and armor-puncturing strikes.',
      icon: '/assets/icons/abilities/Piercing/Piercing Thrust 3.png',
      category: 'physical',
      commonResistance: 'padded armor',
      commonVulnerability: 'unarmored beasts'
    },
    {
      id: 'slicing',
      name: 'Slicing',
      description: 'Cutting physical edges from glaives, longswords, crescent blades, and razor-sharp kinetic sweeps.',
      icon: '/assets/icons/abilities/Slashing/Slashing Slash.png',
      category: 'physical',
      commonResistance: 'plate armor',
      commonVulnerability: 'soft flesh'
    },
    {
      id: 'ember',
      name: 'Ember',
      description: 'Scorching heat from Sol\'s subterranean furnace and Scathrach\'s vents.',
      icon: '/assets/icons/abilities/Fire/Burning Ember.png',
      category: 'elemental',
      commonResistance: 'volcanic beasts, fire elementals',
      commonVulnerability: 'undead, plants, rime creatures'
    },
    {
      id: 'rime',
      name: 'Rime',
      description: 'The frozen world\'s grip. Icy energy that slows, freezes, and shatters.',
      icon: '/assets/icons/abilities/Frost/Dripping Ice.png',
      category: 'elemental',
      commonResistance: 'ice elementals, glacier beasts',
      commonVulnerability: 'ember creatures, water elementals'
    },
    {
      id: 'storm',
      name: 'Storm',
      description: 'Kinetic fury from lightning, thunder, and concussive pressure-veins.',
      icon: '/assets/icons/abilities/Lightning/Lightning Bolt.png',
      category: 'elemental',
      commonResistance: 'storm elementals',
      commonVulnerability: 'creatures in metal armor, water-based creatures'
    },
    {
      id: 'primal',
      name: 'Primal',
      description: 'Living roots, beast instincts, and the planet\'s raw refusal to die.',
      icon: '/assets/icons/abilities/Nature/Beast Mark.png',
      category: 'elemental',
      commonResistance: 'nature-aligned creatures',
      commonVulnerability: 'undead, constructs, corrupted beings'
    },
    {
      id: 'arcane',
      name: 'Arcane',
      description: 'Pure magic force and legalist contract syntax.',
      icon: '/assets/icons/abilities/Arcane/Ebon Blaze.png',
      category: 'arcane',
      commonResistance: 'magic-resistant constructs',
      commonVulnerability: 'non-magical creatures'
    },
    {
      id: 'blight',
      name: 'Blight',
      description: 'Corrosive spores, peat-decay, acidic runoff, poison, and pestilence.',
      icon: '/assets/icons/abilities/Necrotic/Blood Book.png',
      category: 'otherworldly',
      commonResistance: 'undead, constructs',
      commonVulnerability: 'living creatures, plants'
    },
    {
      id: 'wyrd',
      name: 'Wyrd',
      description: 'Entropic chaos, fate manipulation, mind magic, and psychic decay.',
      icon: '/assets/icons/abilities/Psychic/Psychic Mind.png',
      category: 'otherworldly',
      commonResistance: 'mindless creatures, constructs',
      commonVulnerability: 'intelligent creatures'
    },
    {
      id: 'sacred',
      name: 'Sacred',
      description: 'Golden harmonic light, divine protection, and binding order.',
      icon: '/assets/icons/abilities/Radiant/Radiant Sunburst.png',
      category: 'sacred',
      commonResistance: 'sacred sentinels',
      commonVulnerability: 'corrupted beings, breach-beasts'
    },
    {
      id: 'healing',
      name: 'Healing',
      description: 'Restorative energy that repairs damage and restores vitality.',
      icon: '/assets/icons/abilities/Healing/Golden Heart.png',
      category: 'restorative',
      commonResistance: 'none',
      commonVulnerability: 'living creatures'
    },
];

const LEGACY_TYPE_MAP = {
    physical: 'smashing',
    bludgeoning: 'smashing',
    smashing: 'smashing',
    piercing: 'stabbing',
    stabbing: 'stabbing',
    slashing: 'slicing',
    slicing: 'slicing',
    ranged: 'stabbing',
    arrow: 'stabbing',
    cold: 'rime',
    ice: 'rime',
    frost: 'rime',
    fire: 'ember',
    radiant: 'sacred',
    sacred: 'sacred',
    holy: 'sacred',
    divine: 'sacred',
    electric: 'storm',
    lightning: 'storm',
    force: 'arcane',
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
};

const PHYSICAL_TYPES = ['smashing', 'stabbing', 'slicing'];

const WEAPON_PROPERTIES = ['smashing', 'stabbing', 'slicing'];


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
