/**
 * Status effects and conditions with details for the spell wizard
 */

const STATUS_EFFECTS = {
    // Movement Control Effects
    stun: {
      name: 'Stun',
      description: 'Target cannot act or move for the duration.',
      type: 'control',
      severity: 'severe',
      color: '#FFD700', // Gold
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_stun.jpg',
      oppositeOf: ['immune']
    },
    slow: {
      name: 'Slow',
      description: 'Target\'s movement speed is reduced by a percentage.',
      type: 'control',
      severity: 'minor',
      color: '#87CEEB', // Light blue
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_timestop.jpg',
      oppositeOf: ['haste']
    },
    root: {
      name: 'Root',
      description: 'Target cannot move but can still perform other actions.',
      type: 'control',
      severity: 'moderate',
      color: '#006400', // Dark green
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_stranglevines.jpg',
      oppositeOf: ['immune']
    },
    knockback: {
      name: 'Knockback',
      description: 'Target is pushed away from the caster.',
      type: 'control',
      severity: 'minor',
      color: '#B8860B', // Dark goldenrod
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_druid_typhoon.jpg',
      oppositeOf: ['immune']
    },
    pull: {
      name: 'Pull',
      description: 'Target is pulled toward the caster.',
      type: 'control',
      severity: 'minor',
      color: '#708090', // Slate gray
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
      oppositeOf: ['immune']
    },
    
    // Action Control Effects
    silence: {
      name: 'Silence',
      description: 'Target cannot cast spells or use abilities.',
      type: 'control',
      severity: 'moderate',
      color: '#4B0082', // Indigo
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_impphaseshift.jpg',
      oppositeOf: ['immune']
    },
    disarm: {
      name: 'Disarm',
      description: 'Target cannot use weapon attacks.',
      type: 'control',
      severity: 'moderate',
      color: '#CD5C5C', // Indian red
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_disarm.jpg',
      oppositeOf: ['immune']
    },
    blind: {
      name: 'Blind',
      description: 'Target has decreased accuracy and perception.',
      type: 'control',
      severity: 'moderate',
      color: '#2F4F4F', // Dark slate gray
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindsteal.jpg',
      oppositeOf: ['immune']
    },
    
    // Mental Control Effects
    fear: {
      name: 'Fear',
      description: 'Target runs away uncontrollably.',
      type: 'mental',
      severity: 'severe',
      color: '#800080', // Purple
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_possession.jpg',
      oppositeOf: ['immune', 'fearless']
    },
    charm: {
      name: 'Charm',
      description: 'Target is temporarily controlled by the caster.',
      type: 'mental',
      severity: 'severe',
      color: '#FF1493', // Deep pink
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_charm.jpg',
      oppositeOf: ['immune']
    },
    confuse: {
      name: 'Confuse',
      description: 'Target attacks random targets including allies.',
      type: 'mental',
      severity: 'moderate',
      color: '#9932CC', // Dark orchid
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindtwisting.jpg',
      oppositeOf: ['immune']
    },
    sleep: {
      name: 'Sleep',
      description: 'Target falls asleep and is incapacitated until damaged.',
      type: 'mental',
      severity: 'severe',
      color: '#5F9EA0', // Cadet blue
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_sleep.jpg',
      oppositeOf: ['immune', 'wakeful']
    },
    
    // Damage Over Time Effects
    bleed: {
      name: 'Bleed',
      description: 'Target takes physical damage over time that can stack.',
      type: 'dot',
      damageType: 'physical',
      severity: 'moderate',
      color: '#8B0000', // Dark red
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_rupture.jpg',
      oppositeOf: ['immune']
    },
    poison: {
      name: 'Poison',
      description: 'Target takes poison damage over time and may have reduced stats.',
      type: 'dot',
      damageType: 'poison',
      severity: 'moderate',
      color: '#006400', // Dark green
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_deadlybrew.jpg',
      oppositeOf: ['immune']
    },
    burning: {
      name: 'Burning',
      description: 'Target takes fire damage over time.',
      type: 'dot',
      damageType: 'fire',
      severity: 'moderate',
      color: '#FF4500', // Orange red
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_immolation.jpg',
      oppositeOf: ['immune']
    },
    disease: {
      name: 'Disease',
      description: 'Target takes damage over time and has reduced healing.',
      type: 'dot',
      damageType: 'necrotic',
      severity: 'moderate',
      color: '#556B2F', // Dark olive green
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_plaguecloud.jpg',
      oppositeOf: ['immune']
    },
    
    // Stat Modifiers
    weakness: {
      name: 'Weakness',
      description: 'Target\'s damage output is reduced.',
      type: 'debuff',
      severity: 'minor',
      color: '#778899', // Light slate gray
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_weaknesscurse.jpg',
      oppositeOf: ['strengthened']
    },
    vulnerability: {
      name: 'Vulnerability',
      description: 'Target takes increased damage of a specific type.',
      type: 'debuff',
      severity: 'minor',
      color: '#B22222', // Firebrick
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowwordpain.jpg',
      oppositeOf: ['resistance']
    },
    curse: {
      name: 'Curse',
      description: 'Target suffers a magical affliction with varied negative effects.',
      type: 'debuff',
      severity: 'moderate',
      color: '#4B0082', // Indigo
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_curseofsargeras.jpg',
      oppositeOf: ['immune', 'blessed']
    },
    
    // Special Combat Effects
    disoriented: {
      name: 'Disoriented',
      description: 'Target has disoriented movement and reduced accuracy.',
      type: 'debuff',
      severity: 'minor',
      color: '#9370DB', // Medium purple
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindtwisting.jpg',
      oppositeOf: ['immune']
    },
    marked: {
      name: 'Marked',
      description: 'Target is marked, making them more vulnerable to specific attacks.',
      type: 'debuff',
      severity: 'minor',
      color: '#8A2BE2', // Blue violet
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_snipershot.jpg',
      oppositeOf: ['hidden']
    },
    taunt: {
      name: 'Taunt',
      description: 'Target is forced to attack the caster.',
      type: 'control',
      severity: 'moderate',
      color: '#CD5C5C', // Indian red
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_reincarnation.jpg',
      oppositeOf: ['immune']
    },
    
    // Positive Status Effects (Buffs)
    haste: {
      name: 'Haste',
      description: 'Target\'s movement and attack speed are increased.',
      type: 'buff',
      severity: 'minor',
      color: '#FFD700', // Gold
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
      oppositeOf: ['slow']
    },
    strengthened: {
      name: 'Strengthened',
      description: 'Target\'s damage output is increased.',
      type: 'buff',
      severity: 'minor',
      color: '#DC143C', // Crimson
      icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_strengthofarms.jpg',
      oppositeOf: ['weakness']
    },
    resistance: {
      name: 'Resistance',
      description: 'Target takes reduced damage of a specific type.',
      type: 'buff',
      severity: 'minor',
      color: '#4682B4', // Steel blue
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_dispelmagic.jpg',
      oppositeOf: ['vulnerability']
    },
    immune: {
      name: 'Immune',
      description: 'Target is immune to specific types of damage or effects.',
      type: 'buff',
      severity: 'major',
      color: '#FFD700', // Gold
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_divineshield.jpg',
      oppositeOf: ['vulnerable']
    },
    regen: {
      name: 'Regeneration',
      description: 'Target recovers health over time.',
      type: 'buff',
      severity: 'minor',
      color: '#32CD32', // Lime green
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_rejuvenation.jpg',
      oppositeOf: ['wounded']
    },
    shielded: {
      name: 'Shielded',
      description: 'Target has an absorption shield that blocks a set amount of damage.',
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