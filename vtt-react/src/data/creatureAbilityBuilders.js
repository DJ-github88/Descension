/**
 * Creature Ability Builders
 *
 * Compact helpers that expand to the FULL advanced spell-card format defined in
 * docs/SPELL_DATA_REFERENCE.md. Each builder guarantees:
 *   - effectTypes array matches an existing *Config
 *   - damageTypes is always an array
 *   - typeConfig.school is a valid damage-type id (lowercase)
 *   - resourceCost.actionPoints is always set
 *   - cooldownConfig uses { cooldownType, cooldownValue }
 *   - resolution lives inside the effect config
 *   - spellType is UPPERCASE
 *
 * Usage: see creatureAbilitiesAdvanced.js
 */

const DEFAULT_ICON = 'spell_misc_emotion';

// Normalize a school/damage-type id to one of the 9 canonical Mythrill types:
// physical, ember, rime, storm, arcane, primal, blight, wyrd, divine.
// (Mirrors LEGACY_TYPE_MAP in damageTypes.js so creatures render the right badge.)
const normalizeType = (t) => {
  if (!t) return 'physical';
  const map = {
    psychic: 'wyrd', chaos: 'wyrd',
    radiant: 'divine', holy: 'divine',
    necrotic: 'blight', poison: 'blight', acid: 'blight', void: 'blight', shadow: 'blight',
    cold: 'rime', frost: 'rime', ice: 'rime',
    fire: 'ember',
    lightning: 'storm', thunder: 'storm', force: 'storm', electric: 'storm', sonic: 'storm',
    nature: 'primal', viscera: 'primal',
    slashing: 'physical', bludgeoning: 'physical', piercing: 'physical',
  };
  return map[t] || String(t).toLowerCase();
};

// Build the shared base fields every advanced ability needs
const base = (o) => {
  const school = normalizeType(o.school || o.element);
  const tags = Array.from(new Set([school, ...(o.tags || [])]));
  const spellType = (o.spellType || 'ACTION').toUpperCase();
  const ability = {
    id: o.id,
    name: o.name,
    description: o.description || o.desc || '',
    level: o.level || 1,
    spellType,
    icon: o.icon || DEFAULT_ICON,
    typeConfig: {
      school,
      icon: o.icon || DEFAULT_ICON,
      tags,
      castTime: o.castTime || 1,
      castTimeType: o.castTimeType || 'IMMEDIATE',
    },
    targetingConfig: {
      targetingType: o.targetingType || o.type || 'single',
      rangeType: o.rangeType || (o.range && o.range > 0 ? 'ranged' : 'self'),
      rangeDistance: o.range != null ? o.range : 30,
      targetRestrictions: o.targetRestrictions || (o.target ? [o.target] : ['enemies']),
      ...(o.areaShape ? { areaShape: o.areaShape } : {}),
      ...(o.areaSize != null ? { areaSize: o.areaSize } : {}),
    },
    resourceCost: {
      actionPoints: o.ap != null ? o.ap : 1,
      mana: o.mana || 0,
      ...(o.components ? { components: o.components } : { components: ['somatic'] }),
    },
    cooldownConfig: {
      cooldownType: o.cooldownType || 'turn_based',
      cooldownValue: o.cd || 0,
    },
    tags,
  };
  if (o.priorityRange) ability.priorityRange = o.priorityRange;
  if (o.duration) {
    ability.durationConfig = {
      durationType: o.durationUnit || 'rounds',
      durationValue: o.duration,
      durationUnit: o.durationUnit || 'rounds',
    };
  }
  return { ability, school };
};

// Normalize a save spec: ['spirit', 14] or { ability, dc, outcome }
const buildSave = (save, defaultOutcome = 'half_damage') => {
  if (!save) return undefined;
  if (Array.isArray(save)) {
    return { ability: save[0], difficultyClass: save[1], saveOutcome: save[2] || defaultOutcome };
  }
  return {
    ability: save.ability,
    difficultyClass: save.dc || save.difficultyClass,
    saveOutcome: save.outcome || save.saveOutcome || defaultOutcome,
  };
};

// ─── DAMAGE ──────────────────────────────────────────────────────────────
export const dmg = (o) => {
  const { ability, school } = base(o);
  const damageTypes = (o.types && (Array.isArray(o.types) ? o.types : [o.types])) || [school];
  ability.effectTypes = ['damage'];
  ability.damageConfig = {
    formula: o.formula || '1d6',
    damageTypes: damageTypes.map(normalizeType),
    resolution: (o.resolution || 'DICE').toUpperCase(),
  };
  const save = buildSave(o.save, 'half_damage');
  if (save) ability.damageConfig.savingThrow = save;
  if (o.dot) {
    ability.damageConfig.dotConfig = {
      enabled: true,
      damagePerTick: o.dot.formula || o.dot.tick || '1d4',
      damageType: normalizeType(o.dot.type || damageTypes[0]),
      tickFrequency: 'round',
      duration: o.dot.duration || o.duration || 3,
      canStack: false,
      maxStacks: 1,
    };
  }
  if (o.chain) {
    ability.damageConfig.chainConfig = {
      enabled: true,
      chainCount: o.chain.count || 3,
      chainRange: o.chain.range || 15,
      damageFalloff: o.chain.falloff || 0.7,
    };
  }
  if (o.crit) {
    ability.damageConfig.criticalConfig = {
      enabled: true,
      critMultiplier: o.crit.mult || 2,
      ...(o.crit.bonus ? { critBonusDamage: o.crit.bonus } : {}),
    };
  }
  return ability;
};

// ─── HEALING ─────────────────────────────────────────────────────────────
export const heal = (o) => {
  const { ability } = base(o);
  ability.effectTypes = ['healing'];
  ability.healingConfig = {
    formula: o.formula || '2d8',
    healingType: o.healingType || 'direct',
    resolution: (o.resolution || 'DICE').toUpperCase(),
  };
  if (o.shield) {
    ability.healingConfig.shieldConfig = {
      enabled: true,
      shieldAmount: o.shield.amount || o.shield,
      shieldDuration: o.shield.duration || 3,
      shieldDurationType: 'rounds',
    };
  }
  if (o.hot) {
    ability.healingConfig.hotConfig = {
      enabled: true,
      healingPerTick: o.hot.formula || '1d6',
      tickFrequency: 'round',
      duration: o.hot.duration || 3,
    };
  }
  // Healing that also deals damage (vampiric)
  if (o.vampiric) {
    ability.effectTypes = ['healing', 'damage'];
    ability.damageConfig = {
      formula: o.vampiric.formula || o.formula || '2d6',
      damageTypes: [normalizeType(o.vampiric.type || o.school || 'blight')],
      resolution: 'DICE',
    };
    ability.healingConfig.healingType = 'vampiric';
  }
  return ability;
};

// ─── BUFF ────────────────────────────────────────────────────────────────
export const buff = (o) => {
  const { ability } = base(o);
  ability.effectTypes = ['buff'];
  ability.buffConfig = {
    buffType: o.buffType || 'statEnhancement',
    effects: (o.effects || []).map((e, i) => ({
      id: e.id || `${o.id}_eff_${i}`,
      name: e.name || e.stat ? `${e.stat} modification` : 'Buff',
      description: e.description || '',
      mechanicsText: e.mechanicsText || '',
      ...(e.statModifier ? { statModifier: e.statModifier } : {}),
      ...(e.stat ? { statModifier: { stat: e.stat, magnitude: e.magnitude || 2, magnitudeType: e.magnitudeType || 'flat' } } : {}),
    })),
    durationType: 'rounds',
    durationValue: o.duration || 3,
    durationUnit: 'rounds',
    concentrationRequired: o.concentration || false,
    canBeDispelled: o.dispellable !== false,
  };
  return ability;
};

// ─── DEBUFF ──────────────────────────────────────────────────────────────
export const debuff = (o) => {
  const { ability } = base(o);
  ability.effectTypes = ['debuff'];
  ability.debuffConfig = {
    debuffType: o.debuffType || 'statusEffect',
    effects: (o.effects || []).map((e, i) => ({
      id: e.id || `${o.id}_eff_${i}`,
      name: e.name || 'Hindered',
      description: e.description || '',
      mechanicsText: e.mechanicsText || '',
      ...(e.stat ? { statPenalty: { stat: e.stat, value: e.magnitude || -2, magnitudeType: e.magnitudeType || 'flat' } } : {}),
    })),
    ...(o.statPenalties ? { statPenalties: o.statPenalties } : {}),
    durationType: 'rounds',
    durationValue: o.duration || 2,
    durationUnit: 'rounds',
    canBeDispelled: o.dispellable !== false,
  };
  const save = buildSave(o.save, 'negates');
  if (save) ability.debuffConfig.savingThrow = save;
  return ability;
};

// ─── CONTROL ─────────────────────────────────────────────────────────────
export const ctrl = (o) => {
  const { ability } = base(o);
  ability.effectTypes = ['control'];
  ability.controlConfig = {
    controlType: o.controlType || 'incapacitation',
    duration: o.duration || 1,
    durationUnit: 'rounds',
    effects: (o.effects || []).map((e, i) => ({
      id: e.id || `${o.id}_eff_${i}`,
      name: e.name || 'Controlled',
      description: e.description || '',
      mechanicsText: e.mechanicsText || '',
      config: e.config || {},
    })),
  };
  const save = buildSave(o.save, o.saveOutcome || 'negates');
  if (save) ability.controlConfig.savingThrow = save;
  return ability;
};

// ─── UTILITY ─────────────────────────────────────────────────────────────
export const util = (o) => {
  const { ability } = base(o);
  ability.effectTypes = ['utility'];
  ability.utilityConfig = {
    utilityType: o.utilityType || 'movement',
    selectedEffects: (o.effects || []).map((e, i) => ({
      id: e.id || `${o.id}_eff_${i}`,
      name: e.name || 'Utility',
      description: e.description || '',
    })),
    duration: o.duration || 1,
    durationUnit: o.durationUnit || 'rounds',
    concentration: o.concentration || false,
    power: o.power || 'minor',
  };
  if (o.choices) {
    ability.utilityConfig.choiceConfig = {
      mode: o.choiceMode || 'pick_one',
      pickCount: o.choiceCount || 1,
      label: o.choiceLabel || 'Choose One',
      options: o.choices.map((c, i) => ({
        id: c.id || `${o.id}_choice_${i}`,
        name: c.name || `Option ${i + 1}`,
        description: c.description || '',
      })),
    };
  }
  return ability;
};

// ─── SUMMON ──────────────────────────────────────────────────────────────
export const summon = (o) => {
  const { ability } = base(o);
  ability.effectTypes = ['summoning'];
  ability.summoningConfig = {
    summonType: o.summonType || 'temporary',
    creatureName: o.creatureName || 'Summoned Creature',
    creatureType: o.creatureType || 'Beast',
    quantity: o.quantity || 1,
    maxQuantity: o.maxQuantity || o.quantity || 1,
    ...(o.quantityFormula ? { quantityFormula: o.quantityFormula } : {}),
    statsFormula: o.hpFormula || '2d6 + 3',
    attackFormula: o.attackFormula || '1d6 + 2',
    duration: o.duration || 4,
    durationUnit: 'rounds',
    commandable: o.commandable !== false,
    actionsPerTurn: o.actionsPerTurn || 1,
    abilities: o.abilities || [],
    difficultyLevel: o.difficulty || 'moderate',
  };
  return ability;
};

// ─── TRANSFORMATION ──────────────────────────────────────────────────────
export const transform = (o) => {
  const { ability } = base(o);
  ability.effectTypes = ['transformation'];
  ability.transformationConfig = {
    transformationType: o.transformationType || o.transformType || 'physical',
    targetType: 'self',
    duration: o.duration || 3,
    durationUnit: 'rounds',
    power: o.power || 'major',
    newForm: o.newForm || o.formName || 'Altered Form',
    description: o.description || o.desc || '',
    concentration: o.concentration || false,
    maintainEquipment: o.maintainEquipment !== false,
    grantedAbilities: (o.grantedAbilities || []).map((e, i) => ({
      id: e.id || `${o.id}_ability_${i}`,
      name: e.name || 'Granted Ability',
      description: e.description || '',
    })),
    ...(o.statModifiers ? { statModifiers: o.statModifiers } : {}),
  };
  return ability;
};

// ─── PASSIVE ─────────────────────────────────────────────────────────────
// For innate passive traits (auras, regeneration, immunities)
export const passive = (o) => {
  const school = normalizeType(o.school || o.element);
  const tags = Array.from(new Set([school, 'passive', ...(o.tags || [])]));
  return {
    id: o.id,
    name: o.name,
    description: o.description || o.desc || '',
    level: o.level || 1,
    spellType: 'PASSIVE',
    icon: o.icon || DEFAULT_ICON,
    typeConfig: {
      school,
      icon: o.icon || DEFAULT_ICON,
      tags,
      castTime: 0,
      castTimeType: 'PASSIVE',
    },
    targetingConfig: {
      targetingType: o.targetingType || 'self',
      rangeType: 'self',
      rangeDistance: o.range || 0,
      targetRestrictions: ['self'],
      ...(o.areaShape ? { areaShape: o.areaShape } : {}),
      ...(o.areaSize != null ? { areaSize: o.areaSize } : {}),
    },
    resourceCost: { actionPoints: 0, mana: 0 },
    cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
    effectTypes: ['passive'],
    buffConfig: {
      buffType: o.buffType || 'auraEffect',
      effects: (o.effects || []).map((e, i) => ({
        id: e.id || `${o.id}_eff_${i}`,
        name: e.name || 'Passive',
        description: e.description || '',
        mechanicsText: e.mechanicsText || '',
      })),
      durationType: 'permanent',
      durationValue: 0,
      durationUnit: 'permanent',
      concentrationRequired: false,
      canBeDispelled: false,
    },
    tags,
    ...(o.priorityRange ? { priorityRange: o.priorityRange } : {}),
  };
};

// Combine multiple effect builders into one ability (multi-effect)
export const combine = (...parts) => {
  if (!parts.length) return undefined;
  const merged = { ...parts[0] };
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i];
    merged.effectTypes = Array.from(new Set([...(merged.effectTypes || []), ...(p.effectTypes || [])]));
    Object.keys(p).forEach((k) => {
      if (k === 'effectTypes') return;
      if (p[k] != null) merged[k] = p[k];
    });
  }
  return merged;
};

export { normalizeType };
