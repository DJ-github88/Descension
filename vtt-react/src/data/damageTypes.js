/**
 * Mythrill Damage Types
 * 9 core types + Healing (separate restorative category)
 */

const DAMAGE_TYPES = {
    physical: {
      name: 'Physical',
      description: 'Grounded kinetic force from weapons, claws, and Groven stone-scales. Bludgeoning, piercing, and slashing are weapon properties, not separate damage types.',
      color: '#6B4226',
      icon: 'Bludgeoning/Hammer Crush'
    },
    ember: {
      name: 'Ember',
      description: 'Born from Sol\'s dying stellar core, Emberspire\'s subterranean furnace, and Scathrach\'s vents. Scorching heat that burns the impure and ignites desperate souls.',
      color: '#D4380D',
      icon: 'Fire/Volcanic Corruption'
    },
    rime: {
      name: 'Rime',
      description: 'Born from Keth-Amar\'s cosmic vacuum-cold, House Skalvyr\'s Hunger Pact, and Nordhalla\'s glaciers. Frigid energy that numbs, slows, and shatters bone.',
      color: '#2C5F7C',
      icon: 'Frost/Frostbite Variant 2'
    },
    storm: {
      name: 'Storm',
      description: 'Born from the Shard-Window gale-vortexes and Emberspire\'s concussive pressure-veins. Kinetic atmospheric fury that arcs, stuns, and shatters barriers.',
      color: '#8B7328',
      icon: 'Lightning/Thunderstorm'
    },
    arcane: {
      name: 'Arcane',
      description: 'Born from Aethil\'s grammar of consequence and Valerius\'s legalist contract syntax. Siphoned ritual residue and balanced spellwork clauses that affect all targets.',
      color: '#5B3A8C',
      icon: 'Arcane/Ebon Blaze'
    },
    primal: {
      name: 'Primal',
      description: 'Born from Vereth\'s wild ironwood roots and Mareth\'s living ocean spindrift. The planet\'s raw, unyielding refusal to die under Keth-Amar\'s predation.',
      color: '#2D5A1E',
      icon: 'Nature/Nature Natural 11'
    },
    blight: {
      name: 'Blight',
      description: 'Born from Morvane\'s peat-decay, broken contract debts, and acidic vat-runoff. Rotting necrotic decay that consumes vitality.',
      color: '#3D1F4E',
      icon: 'Necrotic/Necrotic Wither'
    },
    wyrd: {
      name: 'Wyrd',
      description: 'The entropic predator-breath of Keth-Amar. A spiritual contagion and psychic decay breathed into mortal fears, leaking through cracks in the binding seal.',
      color: '#7A2040',
      icon: 'Psychic/Psychic Telepathy'
    },
    sacred: {
      name: 'Sacred',
      description: 'Born from Aex\'s original binding song, the Willing Sacrifice, and Aethil\'s grammar of consequence. Golden harmonic resonance that burns breached vows.',
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
    radiant: 'sacred',
    sacred: 'sacred',
    electric: 'storm',
    lightning: 'storm',
    force: 'storm',
    thunder: 'storm',
    shadow: 'blight',
    necrotic: 'blight',
    void: 'blight',
    silence: 'blight',
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
