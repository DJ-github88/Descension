/**
 * Status effects and conditions with details for the spell wizard
 */

const STATUS_EFFECTS = {
    // Movement Control Effects
    stun: {
      name: 'Stun',
      description: 'The body remembers what the mind would forget. target cannot act or move for the duration.',
      type: 'control',
      severity: 'severe',
      color: '#FFD700', // Gold
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_stun.jpg',
      oppositeOf: ['immune']
    },
    slow: {
      name: 'Slow',
      description: 'The body remembers what the mind would forget. target\'s movement speed is reduced by a percentage.',
      type: 'control',
      severity: 'minor',
      color: '#87CEEB', // Light blue
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_timestop.jpg',
      oppositeOf: ['haste']
    },
    root: {
      name: 'Root',
      description: 'The body remembers what the mind would forget. target cannot move but can still perform other actions.',
      type: 'control',
      severity: 'moderate',
      color: '#006400', // Dark green
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_stranglevines.jpg',
      oppositeOf: ['immune']
    },
    knockback: {
      name: 'Knockback',
      description: 'The body remembers what the mind would forget. target is pushed away from the caster.',
      type: 'control',
      severity: 'minor',
      color: '#B8860B', // Dark goldenrod
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_druid_typhoon.jpg',
      oppositeOf: ['immune']
    },
    pull: {
      name: 'Pull',
      description: 'The body remembers what the mind would forget. target is pulled toward the caster.',
      type: 'control',
      severity: 'minor',
      color: '#708090', // Slate gray
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
      oppositeOf: ['immune']
    },

    // Action Control Effects
    silence: {
      name: 'Silence',
      description: 'The body remembers what the mind would forget. target cannot cast spells or use abilities.',
      type: 'control',
      severity: 'moderate',
      color: '#4B0082', // Indigo
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_impphaseshift.jpg',
      oppositeOf: ['immune']
    },
    disarm: {
      name: 'Disarm',
      description: 'The body remembers what the mind would forget. target cannot use weapon attacks.',
      type: 'control',
      severity: 'moderate',
      color: '#CD5C5C', // Indian red
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_disarm.jpg',
      oppositeOf: ['immune']
    },
    blind: {
      name: 'Blind',
      description: 'The body remembers what the mind would forget. target has decreased accuracy and perception.',
      type: 'control',
      severity: 'moderate',
      color: '#2F4F4F', // Dark slate gray
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindsteal.jpg',
      oppositeOf: ['immune']
    },

    // Mental Control Effects
    fear: {
      name: 'Fear',
      description: 'The body remembers what the mind would forget. target runs away uncontrollably.',
      type: 'mental',
      severity: 'severe',
      color: '#800080', // Purple
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_possession.jpg',
      oppositeOf: ['immune', 'fearless']
    },
    charm: {
      name: 'Charm',
      description: 'The body remembers what the mind would forget. target is temporarily controlled by the caster.',
      type: 'mental',
      severity: 'severe',
      color: '#FF1493', // Deep pink
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_charm.jpg',
      oppositeOf: ['immune']
    },
    confuse: {
      name: 'Confuse',
      description: 'The body remembers what the mind would forget. target attacks random targets including allies.',
      type: 'mental',
      severity: 'moderate',
      color: '#9932CC', // Dark orchid
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindtwisting.jpg',
      oppositeOf: ['immune']
    },
    sleep: {
      name: 'Sleep',
      description: 'The body remembers what the mind would forget. target falls asleep and is incapacitated until damaged.',
      type: 'mental',
      severity: 'severe',
      color: '#5F9EA0', // Cadet blue
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_sleep.jpg',
      oppositeOf: ['immune', 'wakeful']
    },

    // Damage Over Time Effects
    bleed: {
      name: 'Bleed',
      description: 'The body remembers what the mind would forget. target takes physical damage over time that can stack.',
      type: 'dot',
      damageType: 'smashing',
      severity: 'moderate',
      color: '#8B0000', // Dark red
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_rupture.jpg',
      oppositeOf: ['immune']
    },
    poison: {
      name: 'Poison',
      description: 'The body remembers what the mind would forget. target takes poison damage over time and may have reduced stats.',
      type: 'dot',
      damageType: 'blight',
      severity: 'moderate',
      color: '#006400', // Dark green
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_deadlybrew.jpg',
      oppositeOf: ['immune']
    },
    burning: {
      name: 'Burning',
      description: 'The body remembers what the mind would forget. target takes fire damage over time.',
      type: 'dot',
      damageType: 'ember',
      severity: 'moderate',
      color: '#FF4500', // Orange red
      icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_elemental_primal_fire.jpg',
      oppositeOf: ['immune']
    },
    disease: {
      name: 'Disease',
      description: 'The body remembers what the mind would forget. target takes damage over time and has reduced healing.',
      type: 'dot',
      damageType: 'blight',
      severity: 'moderate',
      color: '#556B2F', // Dark olive green
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_plaguecloud.jpg',
      oppositeOf: ['immune']
    },

    // Stat Modifiers
    weakness: {
      name: 'Weakness',
      description: 'The body remembers what the mind would forget. target\'s damage output is reduced.',
      type: 'debuff',
      severity: 'minor',
      color: '#778899', // Light slate gray
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_weaknesscurse.jpg',
      oppositeOf: ['strengthened']
    },
    vulnerability: {
      name: 'Vulnerability',
      description: 'The body remembers what the mind would forget. target takes increased damage of a specific type.',
      type: 'debuff',
      severity: 'minor',
      color: '#B22222', // Firebrick
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowwordpain.jpg',
      oppositeOf: ['resistance']
    },
    curse: {
      name: 'Curse',
      description: 'The body remembers what the mind would forget. target suffers a magical affliction with varied negative effects.',
      type: 'debuff',
      severity: 'moderate',
      color: '#4B0082', // Indigo
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_curseofsargeras.jpg',
      oppositeOf: ['immune', 'blessed']
    },

    // Special Combat Effects
    disoriented: {
      name: 'Disoriented',
      description: 'The body remembers what the mind would forget. target has disoriented movement and reduced accuracy.',
      type: 'debuff',
      severity: 'minor',
      color: '#9370DB', // Medium purple
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindtwisting.jpg',
      oppositeOf: ['immune']
    },
    marked: {
      name: 'Marked',
      description: 'The body remembers what the mind would forget. target is marked, making them more vulnerable to specific attacks.',
      type: 'debuff',
      severity: 'minor',
      color: '#8A2BE2', // Blue violet
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_snipershot.jpg',
      oppositeOf: ['hidden']
    },
    taunt: {
      name: 'Taunt',
      description: 'The body remembers what the mind would forget. target is forced to attack the caster.',
      type: 'control',
      severity: 'moderate',
      color: '#CD5C5C', // Indian red
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_reincarnation.jpg',
      oppositeOf: ['immune']
    },

    // Petrified (Groven Still-Claiming)
    petrified: {
      name: 'Petrified',
      description: 'The body remembers what the mind would forget. target is turned to stone, immune to all damage but unable to move, speak, or act. Incapacitated and weight is multiplied by 10.',
      type: 'control',
      severity: 'severe',
      color: '#A9A9A9',
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_stoneformtotem.jpg',
      oppositeOf: ['immune']
    },

    // Positive Status Effects (Buffs)
    haste: {
      name: 'Haste',
      description: 'The body remembers what the mind would forget. target\'s movement and attack speed are increased.',
      type: 'buff',
      severity: 'minor',
      color: '#FFD700', // Gold
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
      oppositeOf: ['slow']
    },
    strengthened: {
      name: 'Strengthened',
      description: 'The body remembers what the mind would forget. target\'s damage output is increased.',
      type: 'buff',
      severity: 'minor',
      color: '#DC143C', // Crimson
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_strengthofarms.jpg',
      oppositeOf: ['weakness']
    },
    resistance: {
      name: 'Resistance',
      description: 'The body remembers what the mind would forget. target takes reduced damage of a specific type.',
      type: 'buff',
      severity: 'minor',
      color: '#4682B4', // Steel blue
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_dispelmagic.jpg',
      oppositeOf: ['vulnerability']
    },
    immune: {
      name: 'Immune',
      description: 'The body remembers what the mind would forget. target is immune to specific types of damage or effects.',
      type: 'buff',
      severity: 'major',
      color: '#FFD700', // Gold
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_divineshield.jpg',
      oppositeOf: ['vulnerable']
    },
    regen: {
      name: 'Regeneration',
      description: 'The body remembers what the mind would forget. target recovers health over time.',
      type: 'buff',
      severity: 'minor',
      color: '#32CD32', // Lime green
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_rejuvenation.jpg',
      oppositeOf: ['wounded']
    },
    shielded: {
      name: 'Shielded',
      description: 'The body remembers what the mind would forget. target has an absorption shield that blocks a set amount of damage.',
      type: 'buff',
      severity: 'moderate',
      color: '#4169E1', // Royal blue
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
      oppositeOf: []
    }
  };

  // Group effects by type
  export const EFFECT_TYPES = {
    movement: ['stun', 'slow', 'root', 'knockback', 'pull'],
    action: ['silence', 'disarm', 'blind'],
    mental: ['fear', 'charm', 'confuse', 'sleep'],
    dot: ['bleed', 'poison', 'burning', 'disease'],
    debuff: ['weakness', 'vulnerability', 'curse', 'disoriented', 'marked', 'taunt'],
    control: ['stun', 'slow', 'root', 'knockback', 'pull', 'silence', 'disarm', 'blind', 'petrified'],
    buff: ['haste', 'strengthened', 'resistance', 'immune', 'regen', 'shielded']
  };

  // Function to get status effect details by ID
  export const getStatusEffect = (effectId) => {
    return STATUS_EFFECTS[effectId.toLowerCase()] || null;
  };

  // Function to get status effect color
  export const getStatusEffectColor = (effectId) => {
    const effect = getStatusEffect(effectId);
    return effect ? effect.color : '#ffffff';
  };

  // Function to get all status effects as an array
  export const getAllStatusEffects = () => {
    return Object.entries(STATUS_EFFECTS).map(([id, data]) => ({
      id,
      ...data
    }));
  };

  // Function to get all status effects by type
  export const getStatusEffectsByType = (type) => {
    const effectIds = EFFECT_TYPES[type] || [];
    return effectIds.map(id => ({
      id,
      ...STATUS_EFFECTS[id]
    }));
  };

  export default STATUS_EFFECTS;