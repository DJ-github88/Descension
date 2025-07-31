
const DAMAGE_TYPES = [
    // Physical types
    {
      id: 'bludgeoning',
      name: 'Bludgeoning',
      description: 'Blunt force trauma from hammers, falling, constriction',
      icon: 'inv_mace_2h_blacksmithing_01',
      category: 'physical',
      commonResistance: 'heavy armor',
      commonVulnerability: 'constructs'
    },
    {
      id: 'piercing',
      name: 'Piercing',
      description: 'Punctures and impalement from spears, arrows, bites',
      icon: 'inv_sword_33',
      category: 'physical',
      commonResistance: 'medium armor',
      commonVulnerability: 'unarmored'
    },
    {
      id: 'slashing',
      name: 'Slashing',
      description: 'Cuts, gashes, and tears from swords, axes, claws',
      icon: 'ability_warrior_cleave',
      category: 'physical',
      commonResistance: 'plate armor',
      commonVulnerability: 'cloth armor'
    },

    // Elemental types
    {
      id: 'fire',
      name: 'Fire',
      description: 'Burning damage from flames, heat, and combustion',
      icon: 'spell_fire_fire',
      category: 'elemental',
      commonResistance: 'red dragons, fire elementals',
      commonVulnerability: 'undead, plants, ice creatures'
    },
    {
      id: 'cold',
      name: 'Cold',
      description: 'Freezing damage from ice and extreme low temperatures',
      icon: 'spell_frost_frostbolt02',
      category: 'elemental',
      commonResistance: 'ice elementals, white dragons',
      commonVulnerability: 'fire creatures, water elementals'
    },
    {
      id: 'lightning',
      name: 'Lightning',
      description: 'Electrical damage from lightning and electrical energy',
      icon: 'spell_lightning_lightningbolt01',
      category: 'elemental',
      commonResistance: 'blue dragons, air elementals',
      commonVulnerability: 'creatures in metal armor, water-based creatures'
    },
    {
      id: 'thunder',
      name: 'Thunder',
      description: 'Concussive damage from sound and sonic energy',
      icon: 'spell_nature_thunderclap',
      category: 'elemental',
      commonResistance: 'constructs, air elementals',
      commonVulnerability: 'crystalline creatures, creatures with sensitive hearing'
    },
    {
      id: 'acid',
      name: 'Acid',
      description: 'Corrosive damage from acid and dissolving substances',
      icon: 'spell_nature_acid_01',
      category: 'elemental',
      commonResistance: 'oozes, black dragons',
      commonVulnerability: 'metal armor, constructs'
    },

    // Magical types
    {
      id: 'force',
      name: 'Force',
      description: 'Pure magical energy forming invisible constructs',
      icon: 'spell_arcane_blast',
      category: 'arcane',
      commonResistance: 'arcane golems',
      commonVulnerability: 'ethereal creatures',
      bypassesNormalResistance: true
    },
    {
      id: 'necrotic',
      name: 'Necrotic',
      description: 'Life-draining decay and negative energy',
      icon: 'spell_shadow_deathcoil',
      category: 'otherworldly',
      commonResistance: 'undead, constructs',
      commonVulnerability: 'living creatures, plants'
    },
    {
      id: 'radiant',
      name: 'Radiant',
      description: 'Holy energy that burns the impure',
      icon: 'spell_holy_holysmite',
      category: 'otherworldly',
      commonResistance: 'celestials, light elementals',
      commonVulnerability: 'undead, fiends, shadows'
    },
    {
      id: 'poison',
      name: 'Poison',
      description: 'Toxic substances that damage the body',
      icon: 'ability_rogue_poisonousanimosity',
      category: 'elemental',
      commonResistance: 'undead, constructs, plants',
      commonVulnerability: 'beasts, humanoids'
    },
    {
      id: 'psychic',
      name: 'Psychic',
      description: 'Mental energy that damages the mind',
      icon: 'spell_shadow_mindtwisting',
      category: 'otherworldly',
      commonResistance: 'mindless creatures, constructs',
      commonVulnerability: 'intelligent creatures, psionic beings'
    },
    // End of standard D&D damage types
];


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

    // Apply spell penetration
    resistance = Math.max(0, resistance - spellPenetration);

    // Cap at 75% unless specifically allowing higher
    return Math.min(75, resistance);
};

export {
    DAMAGE_TYPES,
    getDamageTypeById,
    getDamageTypesByCategory,
    getDamageTypesByIds,
    doesDamageBypassResistance,
    calculateResistance
};