const getInfernoStageName = (level) => {
  const stageNames = {
    0: 'Mortal',
    1: 'Ember',
    2: 'Smolder',
    3: 'Scorch',
    4: 'Blaze',
    5: 'Inferno',
    6: 'Conflagration',
    7: 'Cataclysm',
    8: 'Apocalypse',
    9: 'Oblivion'
  };
  return stageNames[level] || `Level ${level}`;
};

const getInfernoStageNameWithSuffix = (level) => {
  const stageNames = {
    0: 'Mortal',
    1: 'Embering',
    2: 'Smoldering',
    3: 'Scorching',
    4: 'Blazing',
    5: 'Inferno',
    6: 'Conflagration',
    7: 'Cataclysm',
    8: 'Apocalypse',
    9: 'Oblivion'
  };
  return stageNames[level] || `Level ${level}`;
};

const formatResourceName = (resourceType) => {
  if (!resourceType) return '';

  const resourceNameMap = {
    'action_points': 'Action Points',
    'action': 'Action',
    'bonus_action': 'Bonus Action',
    'reaction': 'Reaction',
    'spell_slot': 'Spell Slot',
    'astral_power': 'Astral Power',
    'runic_power': 'Runic Power',
    'soul_power': 'Soul Power',
    'arcane_power': 'Arcane Power',
    'arcane_energy_points': 'AEP',
    'combo_points': 'Combo Points',
    'soul_shards': 'Soul Shards',
    'holy_power': 'Holy Power',
    'health': 'Health',
    'mana': 'Mana',
    'inferno': 'Inferno',
    'rage': 'Rage',
    'energy': 'Energy',
    'focus': 'Focus',
    'chi': 'Chi'
  };
  if (resourceType === 'threads_spend' || resourceType === 'threads_generate') return 'Threads of Destiny';
  if (resourceType === 'chaos_sphere') return 'Chaos Sphere';

  return resourceNameMap[resourceType] || resourceType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const cleanFormula = (formula) => {
  if (formula === 0) return '0';
  if (!formula) return '';
  if (typeof formula === 'number') return String(formula);
  if (typeof formula !== 'string') return '';

  if (formula === 'HALF_DAMAGE_DEALT') {
    return 'Damage Dealt/2';
  }
  if (formula === 'DAMAGE_DEALT_TO_SELF' || formula === 'DAMAGE_DEALT') {
    return 'Damage Dealt';
  }
  if (formula === 'FULL_HEALTH' || formula === 'FULL_HP') {
    return 'Full Health';
  }
  if (formula === 'POKER_HAND_DAMAGE') {
    return 'Varies by Poker Hand';
  }

  let cleanedFormula = formula
    .replace(/\s*\+\s*/g, ' + ')
    .replace(/\s*\-\s*/g, ' - ')
    .replace(/\s*\*\s*/g, ' * ')
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\s+/g, ' ')
    .trim();

  const resourceVariableMap = {
    'action_points': 'Action Points',
    'astral_power': 'Astral Power',
    'runic_power': 'Runic Power',
    'soul_power': 'Soul Power',
    'arcane_power': 'Arcane Power',
    'combo_points': 'Combo Points',
    'soul_shards': 'Soul Shards',
    'holy_power': 'Holy Power',
    'max_health': 'Max Health',
    'current_health': 'Current Health',
    'max_mana': 'Max Mana',
    'current_mana': 'Current Mana',
    'max_action_points': 'Max Action Points',
    'current_action_points': 'Current Action Points',
    'health_regen': 'Health Regen',
    'mana_regen': 'Mana Regen',
    'damage_dealt': 'Damage Dealt',
    'damage dealt': 'Damage Dealt',
    'damage_taken': 'Damage Taken',
    'damage taken': 'Damage Taken',
    'drp_spent': 'DRP Spent',
    'drp': 'DRP',
    'health_spent': 'Health Spent',
    'health': 'Health',
    'permanent_health': 'Permanent Health',
    'health_sacrificed': 'Health Sacrificed',
    'health sacrificed': 'Health Sacrificed',
    'blood_tokens_spent': 'Blood Tokens Spent',
    'blood tokens spent': 'Blood Tokens Spent',
    'blood_tokens': 'Blood Tokens',
    'blood tokens': 'Blood Tokens',
    'healing_dealt': 'Healing Dealt',
    'drp_gain': 'DRP Gained',
    'strength': 'Strength',
    'agility': 'Agility',
    'constitution': 'Constitution',
    'intelligence': 'Intelligence',
    'spirit': 'Spirit',
    'charisma': 'Charisma',
    'str': 'Strength',
    'agi': 'Agility',
    'con': 'Constitution',
    'int': 'Intelligence',
    'spi': 'Spirit',
    'spir': 'Spirit',
    'cha': 'Charisma',
    'maxhitpoints': 'Maximum Hit Points',
    'max_hit_points': 'Maximum Hit Points',
    'hitpoints': 'Hit Points',
    'weapon_die': 'weapon_die',
    'weapon_damage': 'weapon_damage',
    'attribute_modifier': 'attribute_modifier'
  };

  Object.entries(resourceVariableMap).forEach(([variable, properName]) => {
    const regex = new RegExp(`\\b${variable}\\b`, 'gi');
    cleanedFormula = cleanedFormula.replace(regex, properName);
  });

  cleanedFormula = cleanedFormula.replace(/([a-z])([A-Z])/g, '$1 $2');

  const preservedPlaceholders = ['weapon_die', 'weapon_damage', 'attribute_modifier'];
  let hasPlaceholder = false;
  preservedPlaceholders.forEach(placeholder => {
    if (cleanedFormula.includes(placeholder)) {
      hasPlaceholder = true;
    }
  });

  if (!hasPlaceholder) {
    cleanedFormula = cleanedFormula.replace(/_/g, ' ');
  } else {
    preservedPlaceholders.forEach(placeholder => {
      cleanedFormula = cleanedFormula.replace(new RegExp(placeholder.replace(/_/g, ' '), 'g'), placeholder);
    });
    cleanedFormula = cleanedFormula.replace(/_/g, ' ');
    preservedPlaceholders.forEach(placeholder => {
      const spacedPlaceholder = placeholder.replace(/_/g, ' ');
      cleanedFormula = cleanedFormula.replace(new RegExp(spacedPlaceholder, 'g'), placeholder);
    });
  }

  cleanedFormula = cleanedFormula.replace(/([a-z])([A-Z])/g, '$1 $2');

  return cleanedFormula;
};

const mapSpellIcon = (wowIconId) => {
  const iconMapping = {
    'ability_meleedamage': 'General/Combat Downward Strike',
    'ability_warrior_savageblow': 'General/Combat Downward Strike',
    'ability_warrior_charge': 'General/Combat Downward Strike',
    'ability_warrior_revenge': 'General/Combat Downward Strike',
    'ability_warrior_cleave': 'General/Combat Downward Strike',
    'ability_warrior_riposte': 'Utility/Parry',
    'ability_warrior_shieldbash': 'Utility/Shield',
    'ability_rogue_evasion': 'Utility/Speed Dash',
    'ability_rogue_feint': 'Utility/Parry',
    'ability_rogue_sprint': 'Utility/Speed Dash',
    'ability_rogue_tricksofthetrade': 'Utility/Speed Dash',
    'ability_stealth': 'Utility/Hide',
    'ability_hunter_snipershot': 'Utility/Target Crosshair',
    'ability_hunter_markedshot': 'Utility/Target Crosshair',
    'ability_hunter_markedfordeath': 'Utility/Target Crosshair',

    'inv_shield_05': 'Utility/Shield',
    'inv_shield_04': 'Utility/Shield',
    'ability_warrior_defensivestance': 'Utility/Shield',
    'spell_holy_powerwordshield': 'Utility/Shield',
    'spell_holy_devotionaura': 'Radiant/Divine Blessing',

    'spell_holy_greaterheal': 'Healing/Golden Heart',
    'spell_holy_heal02': 'Healing/Golden Heart',
    'spell_holy_flashheal': 'Healing/Golden Heart',
    'spell_holy_renew': 'Healing/Renewal',

    'spell_arcane_portaldalaran': 'Utility/Utility',
    'spell_arcane_teleportundercity': 'Utility/Utility',
    'spell_arcane_arcanetorrent': 'Arcane/Arcane Blast',
    'inv_misc_questionmark': 'Utility/Utility',
    'inv_misc_book_07': 'Utility/Utility',
    'inv_misc_bag_08': 'Utility/Utility',

    'spell_fire_fireball02': 'Fire/Swirling Fireball',
    'spell_fire_flamebolt': 'Fire/Flame Burst',
    'spell_frost_frostbolt02': 'Frost/Frozen in Ice',
    'spell_arcane_blast': 'Arcane/Magical Sword',
    'spell_shadow_shadowbolt': 'Shadow/Shadow Darkness',
    'spell_holy_holysmite': 'Radiant/Divine Blessing',
    'spell_nature_lightning': 'Lightning/Lightning Bolt',

    'spell_frost_chainsofice': 'Frost/Frozen in Ice',
    'spell_shadow_curseofsargeras': 'Necrotic/Necrotic Skull',

    'spell_holy_divineillumination': 'Radiant/Divine Blessing',
    'spell_holy_blessingofprotection': 'Radiant/Divine Blessing',

    'spell_shadow_summonvoidwalker': 'Utility/Summon Minion',
    'spell_shadow_summoninfernal': 'Utility/Summon Minion',

    'ability_druid_catform': 'Utility/Utility',

    'spell_fire_selfdestruct': 'Utility/Explosive Detonation',

    'spell_arcane_arcane04': 'Arcane/Magical Sword'
  };

  return iconMapping[wowIconId] || null;
};

const extractDamageTypeFromResistanceName = (resistanceName) => {
  if (!resistanceName) return 'damage';

  const name = resistanceName.toLowerCase();
  if (name.includes('ember') || name.includes('fire')) return 'ember';
  if (name.includes('rime') || name.includes('ice') || name.includes('frost') || name.includes('cold')) return 'rime';
  if (name.includes('storm') || name.includes('lightning') || name.includes('electric') || name.includes('thunder')) return 'storm';
  if (name.includes('arcane')) return 'arcane';
  if (name.includes('nature') || name.includes('primal')) return 'primal';
  if (name.includes('blight') || name.includes('necrotic') || name.includes('death') || name.includes('shadow')) return 'blight';
  if (name.includes('wyrd') || name.includes('mental') || name.includes('chaos') || name.includes('psychic')) return 'wyrd';
  if (name.includes('divine') || name.includes('radiant') || name.includes('holy')) return 'divine';
  if (name.includes('physical')) return 'physical';
  if (name.includes('all')) return 'all damage';

  return 'damage';
};

const getThematicResistanceDescription = (resistanceLevel, damageType) => {
  const thematicDescriptions = {
    vampiric: {
      fire: 'Flame Feast (heals for 200% of fire damage taken)',
      frost: 'Frost Drain (heals for 200% of frost damage taken)',
      lightning: 'Storm Siphon (heals for 200% of lightning damage taken)',
      arcane: 'Arcane Feast (heals for 200% of arcane damage taken)',
      nature: 'Nature Feast (heals for 200% of nature damage taken)',
      poison: 'Toxin Feast (heals for 200% of poison damage taken)',
      necrotic: 'Death Feast (heals for 200% of necrotic damage taken)',
      radiant: 'Light Drain (heals for 200% of radiant damage taken)',
      psychic: 'Mind Feast (heals for 200% of psychic damage taken)',
      chaos: 'Chaos Feast (heals for 200% of chaos damage taken)',
      void: 'Void Feast (heals for 200% of void damage taken)',
      force: 'Energy Feast (heals for 200% of force damage taken)',
      physical: 'Blood Feast (heals for 200% of physical damage taken)',
      slashing: 'Wound Feast (heals for 200% of slashing damage taken)',
      piercing: 'Pierce Drain (heals for 200% of piercing damage taken)',
      bludgeoning: 'Impact Feed (heals for 200% of bludgeoning damage taken)',
      'all damage': 'Life Feast (heals for 200% of all damage taken)',
      damage: 'Vampiric (heals for 200% of damage taken)'
    },
    absorbing: {
      fire: 'Flame Absorb (heals for 100% of fire damage taken)',
      frost: 'Frost Absorb (heals for 100% of frost damage taken)',
      lightning: 'Storm Absorb (heals for 100% of lightning damage taken)',
      arcane: 'Arcane Absorb (heals for 100% of arcane damage taken)',
      nature: 'Nature Absorb (heals for 100% of nature damage taken)',
      poison: 'Toxin Absorb (heals for 100% of poison damage taken)',
      necrotic: 'Death Absorb (heals for 100% of necrotic damage taken)',
      radiant: 'Light Absorb (heals for 100% of radiant damage taken)',
      psychic: 'Mind Absorb (heals for 100% of psychic damage taken)',
      chaos: 'Chaos Absorb (heals for 100% of chaos damage taken)',
      void: 'Void Absorb (heals for 100% of void damage taken)',
      force: 'Force Absorb (heals for 100% of force damage taken)',
      physical: 'Impact Absorb (heals for 100% of physical damage taken)',
      slashing: 'Cut Absorb (heals for 100% of slashing damage taken)',
      piercing: 'Pierce Absorb (heals for 100% of piercing damage taken)',
      bludgeoning: 'Crush Absorb (heals for 100% of bludgeoning damage taken)',
      'all damage': 'Full Absorb (heals for 100% of all damage taken)',
      damage: 'Absorbing (heals for 100% of damage taken)'
    },
    draining: {
      fire: 'Flame Sap (heals for 50% of fire damage taken)',
      frost: 'Frost Sap (heals for 50% of frost damage taken)',
      lightning: 'Storm Sap (heals for 50% of lightning damage taken)',
      arcane: 'Arcane Sap (heals for 50% of arcane damage taken)',
      nature: 'Nature Sap (heals for 50% of nature damage taken)',
      poison: 'Toxin Sap (heals for 50% of poison damage taken)',
      necrotic: 'Death Sap (heals for 50% of necrotic damage taken)',
      radiant: 'Light Sap (heals for 50% of radiant damage taken)',
      psychic: 'Mind Sap (heals for 50% of psychic damage taken)',
      chaos: 'Chaos Sap (heals for 50% of chaos damage taken)',
      void: 'Void Sap (heals for 50% of void damage taken)',
      force: 'Force Sap (heals for 50% of force damage taken)',
      physical: 'Vigor Sap (heals for 50% of physical damage taken)',
      slashing: 'Cut Sap (heals for 50% of slashing damage taken)',
      piercing: 'Pierce Sap (heals for 50% of piercing damage taken)',
      bludgeoning: 'Crush Sap (heals for 50% of bludgeoning damage taken)',
      'all damage': 'Life Sap (heals for 50% of all damage taken)',
      damage: 'Draining (heals for 50% of damage taken)'
    },
    siphoning: {
      fire: 'Flame Siphon (heals for 25% of fire damage taken)',
      frost: 'Frost Siphon (heals for 25% of frost damage taken)',
      lightning: 'Storm Siphon (heals for 25% of lightning damage taken)',
      arcane: 'Arcane Siphon (heals for 25% of arcane damage taken)',
      nature: 'Nature Siphon (heals for 25% of nature damage taken)',
      poison: 'Toxin Siphon (heals for 25% of poison damage taken)',
      necrotic: 'Death Siphon (heals for 25% of necrotic damage taken)',
      radiant: 'Light Siphon (heals for 25% of radiant damage taken)',
      psychic: 'Mind Siphon (heals for 25% of psychic damage taken)',
      chaos: 'Chaos Siphon (heals for 25% of chaos damage taken)',
      void: 'Void Siphon (heals for 25% of void damage taken)',
      force: 'Force Siphon (heals for 25% of force damage taken)',
      physical: 'Blood Siphon (heals for 25% of physical damage taken)',
      slashing: 'Cut Siphon (heals for 25% of slashing damage taken)',
      piercing: 'Pierce Siphon (heals for 25% of piercing damage taken)',
      bludgeoning: 'Crush Siphon (heals for 25% of bludgeoning damage taken)',
      'all damage': 'Life Siphon (heals for 25% of all damage taken)',
      damage: 'Siphoning (heals for 25% of damage taken)'
    },
    immune: {
      fire: 'Flame Immunity (takes no fire damage)',
      frost: 'Frost Immunity (takes no frost damage)',
      lightning: 'Storm Immunity (takes no lightning damage)',
      arcane: 'Arcane Immunity (takes no arcane damage)',
      nature: 'Nature Immunity (takes no nature damage)',
      poison: 'Toxin Immunity (takes no poison damage)',
      necrotic: 'Death Immunity (takes no necrotic damage)',
      radiant: 'Light Immunity (takes no radiant damage)',
      psychic: 'Mind Immunity (takes no psychic damage)',
      chaos: 'Chaos Immunity (takes no chaos damage)',
      void: 'Void Immunity (takes no void damage)',
      force: 'Force Immunity (takes no force damage)',
      physical: 'Physical Immunity (takes no physical damage)',
      slashing: 'Cut Immunity (takes no slashing damage)',
      piercing: 'Pierce Immunity (takes no piercing damage)',
      bludgeoning: 'Crush Immunity (takes no bludgeoning damage)',
      'all damage': 'Full Immunity (takes no damage)',
      damage: 'Immune (takes no damage)'
    },
    resistant: {
      fire: 'Flame Ward (takes half fire damage)',
      frost: 'Frost Ward (takes half frost damage)',
      lightning: 'Storm Ward (takes half lightning damage)',
      arcane: 'Arcane Ward (takes half arcane damage)',
      nature: 'Nature Ward (takes half nature damage)',
      poison: 'Toxin Ward (takes half poison damage)',
      necrotic: 'Death Ward (takes half necrotic damage)',
      radiant: 'Light Ward (takes half radiant damage)',
      psychic: 'Mind Ward (takes half psychic damage)',
      chaos: 'Chaos Ward (takes half chaos damage)',
      void: 'Void Ward (takes half void damage)',
      force: 'Force Ward (takes half force damage)',
      physical: 'Iron Skin (takes half physical damage)',
      slashing: 'Cut Ward (takes half slashing damage)',
      piercing: 'Pierce Ward (takes half piercing damage)',
      bludgeoning: 'Crush Ward (takes half bludgeoning damage)',
      'all damage': 'Full Ward (takes half damage)',
      damage: 'Resistant (takes half damage)'
    },
    highly_resistant: {
      fire: 'Flame Barrier (takes 25% fire damage)',
      frost: 'Frost Barrier (takes 25% frost damage)',
      lightning: 'Storm Barrier (takes 25% lightning damage)',
      arcane: 'Arcane Barrier (takes 25% arcane damage)',
      nature: 'Nature Barrier (takes 25% nature damage)',
      poison: 'Toxin Barrier (takes 25% poison damage)',
      necrotic: 'Death Barrier (takes 25% necrotic damage)',
      radiant: 'Light Barrier (takes 25% radiant damage)',
      psychic: 'Mind Barrier (takes 25% psychic damage)',
      chaos: 'Chaos Barrier (takes 25% chaos damage)',
      void: 'Void Barrier (takes 25% void damage)',
      force: 'Force Barrier (takes 25% force damage)',
      physical: 'Adamant Skin (takes 25% physical damage)',
      slashing: 'Cut Barrier (takes 25% slashing damage)',
      piercing: 'Pierce Barrier (takes 25% piercing damage)',
      bludgeoning: 'Crush Barrier (takes 25% bludgeoning damage)',
      'all damage': 'Full Barrier (takes 25% damage)',
      damage: 'Highly Resistant (takes 25% damage)'
    },
    guarded: {
      fire: 'Flame Guard (takes 75% fire damage)',
      frost: 'Frost Guard (takes 75% frost damage)',
      lightning: 'Storm Guard (takes 75% lightning damage)',
      arcane: 'Arcane Guard (takes 75% arcane damage)',
      nature: 'Nature Guard (takes 75% nature damage)',
      poison: 'Toxin Guard (takes 75% poison damage)',
      necrotic: 'Death Guard (takes 75% necrotic damage)',
      radiant: 'Light Guard (takes 75% radiant damage)',
      psychic: 'Mind Guard (takes 75% psychic damage)',
      chaos: 'Chaos Guard (takes 75% chaos damage)',
      void: 'Void Guard (takes 75% void damage)',
      force: 'Force Guard (takes 75% force damage)',
      physical: 'Steel Skin (takes 75% physical damage)',
      slashing: 'Cut Guard (takes 75% slashing damage)',
      piercing: 'Pierce Guard (takes 75% piercing damage)',
      bludgeoning: 'Crush Guard (takes 75% bludgeoning damage)',
      'all damage': 'Full Guard (takes 75% damage)',
      damage: 'Guarded (takes 75% damage)'
    },
    slight_reduction: {
      fire: 'Flame Reduction (reduces fire resistance by 25%)',
      frost: 'Frost Reduction (reduces frost resistance by 25%)',
      lightning: 'Storm Reduction (reduces lightning resistance by 25%)',
      arcane: 'Arcane Reduction (reduces arcane resistance by 25%)',
      nature: 'Nature Reduction (reduces nature resistance by 25%)',
      poison: 'Toxin Reduction (reduces poison resistance by 25%)',
      necrotic: 'Death Reduction (reduces necrotic resistance by 25%)',
      radiant: 'Light Reduction (reduces radiant resistance by 25%)',
      psychic: 'Mind Reduction (reduces psychic resistance by 25%)',
      chaos: 'Chaos Reduction (reduces chaos resistance by 25%)',
      void: 'Void Reduction (reduces void resistance by 25%)',
      force: 'Force Reduction (reduces force resistance by 25%)',
      physical: 'Armor Breach (reduces physical resistance by 25%)',
      slashing: 'Cut Breach (reduces slashing resistance by 25%)',
      piercing: 'Pierce Breach (reduces piercing resistance by 25%)',
      bludgeoning: 'Crush Breach (reduces bludgeoning resistance by 25%)',
      'all damage': 'Resistance Breach (reduces all resistances by 25%)',
      damage: 'Slight Reduction (reduces resistance by 25%)'
    },
    nullified: {
      fire: 'Flame Nullification (removes all fire resistance)',
      frost: 'Frost Nullification (removes all frost resistance)',
      lightning: 'Storm Nullification (removes all lightning resistance)',
      arcane: 'Arcane Nullification (removes all arcane resistance)',
      nature: 'Nature Nullification (removes all nature resistance)',
      poison: 'Toxin Nullification (removes all poison resistance)',
      necrotic: 'Death Nullification (removes all necrotic resistance)',
      radiant: 'Light Nullification (removes all radiant resistance)',
      psychic: 'Mind Nullification (removes all psychic resistance)',
      chaos: 'Chaos Nullification (removes all chaos resistance)',
      void: 'Void Nullification (removes all void resistance)',
      force: 'Force Nullification (removes all force resistance)',
      physical: 'Armor Nullification (removes all physical resistance)',
      slashing: 'Cut Nullification (removes all slashing resistance)',
      piercing: 'Pierce Nullification (removes all piercing resistance)',
      bludgeoning: 'Crush Nullification (removes all bludgeoning resistance)',
      'all damage': 'Full Nullification (removes all resistances)',
      damage: 'Nullified (removes all resistance)'
    },
    susceptible: {
      fire: 'Flame Weakness (takes 125% fire damage)',
      frost: 'Frost Weakness (takes 125% frost damage)',
      lightning: 'Storm Weakness (takes 125% lightning damage)',
      arcane: 'Arcane Weakness (takes 125% arcane damage)',
      nature: 'Nature Weakness (takes 125% nature damage)',
      poison: 'Toxin Weakness (takes 125% poison damage)',
      necrotic: 'Death Weakness (takes 125% necrotic damage)',
      radiant: 'Light Weakness (takes 125% radiant damage)',
      psychic: 'Mind Weakness (takes 125% psychic damage)',
      chaos: 'Chaos Weakness (takes 125% chaos damage)',
      void: 'Void Weakness (takes 125% void damage)',
      force: 'Force Weakness (takes 125% force damage)',
      physical: 'Soft Skin (takes 125% physical damage)',
      slashing: 'Cut Weakness (takes 125% slashing damage)',
      piercing: 'Pierce Weakness (takes 125% piercing damage)',
      bludgeoning: 'Crush Weakness (takes 125% bludgeoning damage)',
      'all damage': 'Full Weakness (takes 125% damage)',
      damage: 'Susceptible (takes 125% damage)'
    },
    exposed: {
      fire: 'Flame Exposure (takes 150% fire damage)',
      frost: 'Frost Exposure (takes 150% frost damage)',
      lightning: 'Storm Exposure (takes 150% lightning damage)',
      arcane: 'Arcane Exposure (takes 150% arcane damage)',
      nature: 'Nature Exposure (takes 150% nature damage)',
      poison: 'Toxin Exposure (takes 150% poison damage)',
      necrotic: 'Death Exposure (takes 150% necrotic damage)',
      radiant: 'Light Exposure (takes 150% radiant damage)',
      psychic: 'Mind Exposure (takes 150% psychic damage)',
      chaos: 'Chaos Exposure (takes 150% chaos damage)',
      void: 'Void Exposure (takes 150% void damage)',
      force: 'Force Exposure (takes 150% force damage)',
      physical: 'Tender Flesh (takes 150% physical damage)',
      slashing: 'Cut Exposure (takes 150% slashing damage)',
      piercing: 'Pierce Exposure (takes 150% piercing damage)',
      bludgeoning: 'Crush Exposure (takes 150% bludgeoning damage)',
      'all damage': 'Full Exposure (takes 150% damage)',
      damage: 'Exposed (takes 150% damage)'
    },
    vulnerable: {
      fire: 'Flame Curse (takes double fire damage)',
      frost: 'Frost Curse (takes double frost damage)',
      lightning: 'Storm Curse (takes double lightning damage)',
      arcane: 'Arcane Curse (takes double arcane damage)',
      nature: 'Nature Curse (takes double nature damage)',
      poison: 'Toxin Curse (takes double poison damage)',
      necrotic: 'Death Curse (takes double necrotic damage)',
      radiant: 'Light Curse (takes double radiant damage)',
      psychic: 'Mind Curse (takes double psychic damage)',
      chaos: 'Chaos Curse (takes double chaos damage)',
      void: 'Void Curse (takes double void damage)',
      force: 'Force Curse (takes double force damage)',
      physical: 'Brittle Bones (takes double physical damage)',
      slashing: 'Cut Curse (takes double slashing damage)',
      piercing: 'Pierce Curse (takes double piercing damage)',
      bludgeoning: 'Crush Curse (takes double bludgeoning damage)',
      'all damage': 'Full Curse (takes double damage)',
      damage: 'Vulnerable (takes double damage)'
    }
  };

  return thematicDescriptions[resistanceLevel]?.[damageType] ||
         thematicDescriptions[resistanceLevel]?.damage ||
         resistanceLevel;
};

const formatAoeShape = (shape, parameters = {}) => {
  if (!shape) return '';

  switch (shape) {
    case 'circle':
      return `${parameters.radius || 10}ft radius`;
    case 'square':
      return `${parameters.size || 10}ft square`;
    case 'rectangle':
      return `${parameters.width || 10}×${parameters.height || 20}ft`;
    case 'line':
      return `${parameters.length || 30}ft line`;
    case 'cone':
      return `${parameters.length || 15}ft cone`;
    case 'cylinder':
      return `${parameters.radius || 10}ft radius, ${parameters.height || 20}ft high`;
    case 'sphere':
      return `${parameters.radius || 10}ft sphere`;
    case 'wall':
      return `${parameters.length || 60}ft wall`;
    case 'none':
      return '';
    default:
      return shape;
  }
};

const formatDurationText = (durationValue, durationType, durationUnit, restType) => {
  if (durationType === 'permanent') return 'Permanent';
  if (durationType === 'rounds') return `${durationValue} ${durationValue === 1 ? 'round' : 'rounds'}`;
  if (durationType === 'turns') return `${durationValue} ${durationValue === 1 ? 'turn' : 'turns'}`;
  if (durationType === 'rest') {
    const rt = restType || 'long';
    return `Until ${rt.charAt(0).toUpperCase() + rt.slice(1)} Rest`;
  }
  if (durationType === 'minutes') return `${durationValue} ${durationValue === 1 ? 'minute' : 'minutes'}`;
  if (durationType === 'hours') return `${durationValue} ${durationValue === 1 ? 'hour' : 'hours'}`;
  if (durationType === 'time' && durationValue) {
    const unit = durationUnit || 'rounds';
    return `${durationValue} ${unit}`;
  }
  if (durationValue) return `${durationValue} rounds`;
  return 'Instant';
};

const formatComponentName = (name) => {
  if (!name || typeof name !== 'string') return name;

  if (name.includes(' ') && /[A-Z]/.test(name)) {
    return name;
  }

  return name
    .split(/[-_]/)
    .map(word => {
      const lowerWord = word.toLowerCase();
      if (lowerWord === 'of' || lowerWord === 'the' || lowerWord === 'and' || lowerWord === 'in' || lowerWord === 'on') {
        return lowerWord;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ')
    .replace(/^[a-z]/, match => match.toUpperCase());
};

const normalizeSaveType = (saveType) => {
  if (!saveType) return 'Constitution';

  let typeStr = '';
  if (typeof saveType === 'object') {
    typeStr = saveType.ability || saveType.savingThrowType || saveType.name || 'constitution';
  } else {
    typeStr = String(saveType);
  }

  const saveTypeMap = {
    'dexterity': 'agility',
    'dex': 'agility',
    'wisdom': 'spirit',
    'wis': 'spirit',
    'strength': 'strength',
    'str': 'strength',
    'constitution': 'constitution',
    'con': 'constitution',
    'intelligence': 'intelligence',
    'int': 'intelligence',
    'spirit': 'spirit',
    'spi': 'spirit',
    'charisma': 'charisma',
    'cha': 'charisma'
  };

  const normalized = saveTypeMap[typeStr.toLowerCase()] || typeStr.toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const getEnhancedStatName = (statName, magnitude, magnitudeType) => {
  if (!statName) return 'Stat Modifier';

  const baseName = statName.toLowerCase();
  const isPositive = magnitude > 0;
  const isPercentage = magnitudeType === 'percentage';

  const statEnhancements = {
    'strength': isPositive ? 'Might' : 'Strength Drain',
    'agility': isPositive ? 'Grace' : 'Agility Drain',
    'constitution': isPositive ? 'Vitality' : 'Constitution Drain',
    'intelligence': isPositive ? 'Mental Acuity' : 'Mind Fog',
    'spirit': isPositive ? 'Spiritual Power' : 'Spirit Drain',
    'charisma': isPositive ? 'Presence' : 'Charisma Drain',

    'health': isPositive ? 'Vigor' : 'Health Penalty',
    'mana': isPositive ? 'Arcane Reservoir' : 'Mana Drain',
    'stamina': isPositive ? 'Endurance' : 'Fatigue',
    'speed': isPositive ? 'Swiftness' : 'Sluggishness',
    'damage': isPositive ? 'Combat Prowess' : 'Damage Penalty',
    'damage_reduction': 'Toughness'
  };

  return statEnhancements[baseName] || (statName.charAt(0).toUpperCase() + statName.slice(1));
};

const getStatType = (statName) => {
  if (!statName) return 'general';

  const baseName = statName.toLowerCase();
  const physicalStats = ['strength', 'agility', 'constitution', 'health', 'stamina'];
  const mentalStats = ['intelligence', 'spirit', 'perception'];
  const magicalStats = ['mana', 'spell_power', 'magical_resistance'];

  if (physicalStats.includes(baseName)) return 'physical';
  if (mentalStats.includes(baseName)) return 'mental';
  if (magicalStats.includes(baseName)) return 'magical';
  return 'general';
};

export {
  getInfernoStageName,
  getInfernoStageNameWithSuffix,
  formatResourceName,
  cleanFormula,
  mapSpellIcon,
  extractDamageTypeFromResistanceName,
  getThematicResistanceDescription,
  formatAoeShape,
  formatDurationText,
  formatComponentName,
  normalizeSaveType,
  getEnhancedStatName,
  getStatType
};
