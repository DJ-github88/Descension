/**
 * Mythrill Damage Types
 * 9 core types + Healing (separate restorative category)
 */

const DAMAGE_TYPES = {
    smashing: {
      name: 'Smashing',
      description: 'Concussive physical impact from heavy warhammers, blunt strikes, kinetic shockwaves, and stone crushing.',
      color: '#8B5A2B',
      icon: 'Bludgeoning/Hammer Crush'
    },
    stabbing: {
      name: 'Stabbing',
      description: 'Piercing physical thrusts from spears, daggers, rapiers, stakes, and precision armor-puncturing strikes.',
      color: '#704214',
      icon: 'Piercing/Spear Thrust'
    },
    slicing: {
      name: 'Slicing',
      description: 'Cutting physical edges from glaives, longswords, crescent blades, and razor-sharp kinetic sweeps.',
      color: '#5C3317',
      icon: 'Slashing/Sword Slash'
    },
    ranged: {
      name: 'Ranged',
      description: 'Physical projectile damage from longbows, crossbow bolts, thrown daggers, and kinetic missiles.',
      color: '#A0522D',
      icon: 'Ranged/Arrow Shot'
    },
    ember: {
      name: 'Ember',
      description: 'Born from Sol\'s dying stellar core, Emberspire\'s subterranean furnace, and Scathrach\'s vents. Scorching heat that ignites desperate combatants.',
      color: '#D4380D',
      icon: 'Fire/Volcanic Corruption'
    },
    rime: {
      name: 'Rime',
      description: 'Born from Keth-Amar\'s cosmic vacuum-cold and Nordhalla\'s glaciers. Frigid energy that numbs movement and shatters defenses.',
      color: '#2C5F7C',
      icon: 'Frost/Frostbite Variant 2'
    },
    storm: {
      name: 'Storm',
      description: 'Born from Shard-Window gale-vortexes and concussive pressure-veins. Kinetic atmospheric fury that arcs lightning and shatters barriers.',
      color: '#8B7328',
      icon: 'Lightning/Thunderstorm'
    },
    primal: {
      name: 'Primal',
      description: 'Born from Vereth\'s wild ironwood roots and living ocean spindrift. Raw nature energy, animal instincts, and wild growth.',
      color: '#2D5A1E',
      icon: 'Nature/Nature Natural 11'
    },
    arcane: {
      name: 'Arcane',
      description: 'Born from Aethil\'s grammar of consequence and Valerius\'s legalist contract syntax. Pure magical force and structured spellwork clauses.',
      color: '#5B3A8C',
      icon: 'Arcane/Ebon Blaze'
    },
    blight: {
      name: 'Blight',
      description: 'Born from Morvane\'s peat-decay, broken contract debts, and acidic vat-runoff. Corrosive spores, poisons, and pestilence.',
      color: '#3D1F4E',
      icon: 'Necrotic/Necrotic Wither'
    },
    wyrd: {
      name: 'Wyrd',
      description: 'The entropic predator-breath of Keth-Amar. Mind magic, fate manipulation, psychic resonance, and temporal chaos.',
      color: '#7A2040',
      icon: 'Psychic/Psychic Telepathy'
    },
    sacred: {
      name: 'Sacred',
      description: 'Born from Aex\'s original binding song and the Willing Sacrifice. Golden harmonic light and divine protective order.',
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
    physical: 'smashing',
    bludgeoning: 'smashing',
    smashing: 'smashing',
    piercing: 'stabbing',
    stabbing: 'stabbing',
    slashing: 'slicing',
    slicing: 'slicing',
    ranged: 'ranged',
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
    silence: 'blight',
    poison: 'blight',
    acid: 'blight',
    viscera: 'primal',
    nature: 'primal',
    chaos: 'wyrd',
    psychic: 'wyrd',
  };

  export const ALL_DAMAGE_TYPE_IDS = Object.keys(DAMAGE_TYPES);

  export const PHYSICAL_TYPES = ['smashing', 'stabbing', 'slicing', 'ranged'];

  export const WEAPON_PROPERTIES = ['smashing', 'stabbing', 'slicing', 'ranged'];

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
