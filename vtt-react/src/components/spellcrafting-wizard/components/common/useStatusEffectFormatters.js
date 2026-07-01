import { cleanFormula, extractDamageTypeFromResistanceName, getThematicResistanceDescription, normalizeSaveType } from './spellFormatterUtils';
import { GLOBAL_STAT_MAP, mapStatKeyToLabel, getAdvantageDisadvantageText } from './UnifiedSpellCard';

const useStatusEffectFormatters = ({ spell, library, categories, formatSavingThrow }) => {

  const formatStatusEffectDetails = (status, effectType = 'buff', parentConfig = null) => {
    const effectName = status.name || status.id || 'Status Effect';

    // Improved fallback descriptions - show warning if incomplete
    let description = status.description;
    if (!description) {
      // Try to infer from status name/id
      const statusId = (status.id || status.name || '').toLowerCase();
      if (statusId.includes('haste') || statusId.includes('speed')) {
        description = 'Increased movement and attack speed';
      } else if (statusId.includes('strength') || statusId.includes('might')) {
        description = 'Enhanced physical power';
      } else if (statusId.includes('intellect') || statusId.includes('spirit')) {
        description = 'Enhanced mental acuity';
      } else if (statusId.includes('shield') || statusId.includes('barrier')) {
        description = 'Protective magical barrier';
      } else if (statusId.includes('regen') || statusId.includes('heal')) {
        description = 'Gradual health restoration';
      } else if (statusId.includes('bless') || statusId.includes('divine')) {
        description = 'Divine blessing and protection';
      } else if (statusId.includes('invisible') || statusId.includes('invisibility')) {
        description = 'Cannot be seen';
      } else if (statusId.includes('flight') || statusId.includes('fly')) {
        description = 'Ability to fly';
      } else if (statusId.includes('stun')) {
        description = 'Unable to act';
      } else if (statusId.includes('charm')) {
        description = 'Magically influenced';
      } else if (statusId.includes('burn')) {
        description = 'Taking fire damage over time';
      } else {
        // Show clear warning for incomplete data
        description = effectType === 'buff'
          ? 'INCOMPLETE: Add description to status effect'
          : 'INCOMPLETE: Add description to status effect';
      }
    }

    let mechanicsText = '';
    const mechanicsParts = [];

    // Format based on specific effect types
    const effectId = (status.id || '').toLowerCase();
    const option = status.option || null;

    // ===== BUFF EFFECTS =====

    // LUCK EFFECT — popup writes option: minor|major|fate, rerollCount
    if (effectId === 'luck') {
      if (option === 'minor') {
        mechanicsParts.push(`Reroll ${status.rerollCount || 1} bad ${status.rerollCount === 1 ? 'roll' : 'rolls'}, keep the new result`);
      } else if (option === 'major') {
        mechanicsParts.push(`Reroll ${status.rerollCount || 1} failed ${status.rerollCount === 1 ? 'roll' : 'rolls'} during the duration`);
      } else if (option === 'fate') {
        mechanicsParts.push("Pick the number you want instead of rolling");
      }
    }

    // HASTE EFFECT — popup writes option: movement|action|casting, speedBonus, extraActions, castingReduction
    else if (effectId === 'haste') {
      if (option === 'movement') {
        const sb = status.speedBonus || '50';
        mechanicsParts.push(`+${sb}% movement speed`);
      } else if (option === 'action') {
        mechanicsParts.push(`+${status.extraActions || '1'} extra action${status.extraActions === '1' ? '' : 's'} per turn`);
      } else if (option === 'casting') {
        mechanicsParts.push(`${status.castingReduction || '50'}% faster spellcasting`);
      }
      if (status.hasLethargy) mechanicsParts.push('slowed when it wears off');
    }

    // COMBAT ADVANTAGE — popup writes advantageType, affectsMelee, affectsRanged, damageTypes, magnitude
    else if (effectId === 'combat_advantage') {
      const advType = status.advantageType || 'attack';
      if (advType === 'attack') {
        const types = [];
        if (status.affectsMelee) types.push('melee');
        if (status.affectsRanged) types.push('ranged');
        mechanicsParts.push(`Roll twice, keep best on ${types.length ? types.join(' and ') : 'all'} attacks`);
      } else if (advType === 'damage') {
        const dmgTypes = status.damageTypes?.length ? status.damageTypes.join(', ') : 'all';
        mechanicsParts.push(`+${status.magnitude || 2}${status.magnitudeType === 'percentage' ? '%' : ''} to ${dmgTypes} damage`);
      } else if (advType === 'healing') {
        mechanicsParts.push(`+${status.magnitude || 2}${status.magnitudeType === 'percentage' ? '%' : ''} to healing rolls`);
      } else if (advType === 'critical') {
        mechanicsParts.push(`Expanded crit range (+${status.magnitude || 2})`);
      }
    }

    // ATTACKERS ADVANTAGE — popup writes option: all|melee|ranged|spell, magnitude
    else if (effectId === 'attackers_advantage') {
      const target = option || 'all';
      mechanicsParts.push(`Attackers get +${status.magnitude || 0}${status.magnitudeType === 'percentage' ? '%' : ''} to hit with ${target} attacks`);
    }

    // SKILL MASTERY — popup writes option: physical|mental|social, magnitude
    else if (effectId === 'skill_mastery') {
      const skillArea = option || 'physical';
      mechanicsParts.push(`+${status.magnitude || 2} to ${skillArea} skill checks`);
    }

    // EMPOWER NEXT — popup writes option: spell|heal|weapon, multiplier
    else if (effectId === 'empower_next') {
      const mult = status.multiplier || '1.5';
      const pct = mult === 'max' ? 'maximum' : `${Math.round((parseFloat(mult) - 1) * 100)}% more`;
      if (option === 'spell') mechanicsParts.push(`Next spell deals ${pct} damage`);
      else if (option === 'heal') mechanicsParts.push(`Next heal restores ${pct} HP`);
      else if (option === 'weapon') mechanicsParts.push(`Next weapon hit deals ${pct} damage`);
    }

    // DAMAGE SHIELD — popup writes option: physical|magical|complete, reductionPercent, hitCount
    else if (effectId === 'damage_shield') {
      const shieldArea = option || 'physical';
      mechanicsParts.push(`${status.reductionPercent || '50'}% less ${shieldArea} damage for ${status.hitCount || 3} hit${(status.hitCount || 3) > 1 ? 's' : ''}`);
    }

    // ELEMENTAL INFUSION — popup writes option: ember|rime|storm, extraDamage, procChance
    else if (effectId === 'elemental_infusion') {
      const elem = option || 'ember';
      mechanicsParts.push(`+${status.extraDamage || '1d6'} ${elem} on every hit`);
      if (status.procChance && status.procChance !== '100') mechanicsParts.push(`${status.procChance}% chance to trigger`);
    }

    // INVISIBILITY — popup writes option: partial|complete|greater, detectionDC
    else if (effectId === 'invisibility' || effectId === 'invisible') {
      if (option === 'partial') mechanicsParts.push(`Advantage on stealth (detection DC ${status.detectionDC || 15})`);
      else if (option === 'complete') mechanicsParts.push("Can't be seen — breaks on attack or spell");
      else if (option === 'greater') mechanicsParts.push('Invisible even while attacking or casting');
    }

    // INSPIRATION — popup writes option: focus|insight|creativity, magnitude
    else if (effectId === 'inspiration') {
      const inspireType = option || 'focus';
      mechanicsParts.push(`+${status.magnitude || 3} to ${inspireType === 'focus' ? 'concentration checks' : inspireType === 'insight' ? 'Intelligence checks' : 'Charisma (Performance) checks'}`);
    }

    // LIFELINK — popup writes option: hp_to_hp|mana_to_mana|etc, transferRatio, maxTransfer
    else if (effectId === 'lifelink') {
      const linkMap = {
        'hp_to_hp': 'HP ↔ HP link',
        'mana_to_mana': 'Mana ↔ Mana link',
        'hp_to_mana': 'HP → Mana conversion',
        'mana_to_hp': 'Mana → HP conversion',
        'damage_to_healing': 'Damage → Healing conversion',
        'healing_to_damage': 'Healing → Damage conversion'
      };
      mechanicsParts.push(linkMap[option] || option || 'Life link');
      mechanicsParts.push(`${status.transferRatio || '50'}% transfer rate`);
      if (status.maxTransfer) mechanicsParts.push(`max ${status.maxTransfer} per trigger`);
    }

    // INSPIRED — popup writes option: bardic|guidance|heroism, inspirationDie, usesPerDuration, appliesTo
    else if (effectId === 'inspired') {
      const die = status.inspirationDie || 'd6';
      const uses = status.usesPerDuration || 1;
      const applyTo = status.appliesTo || 'any';
      const appliesText = applyTo === 'any' ? 'any roll' : applyTo === 'attacks' ? 'attack rolls' : applyTo === 'saves' ? 'saving throws' : 'skill checks';
      if (option === 'bardic') mechanicsParts.push(`Add ${die} to ${appliesText}, ${uses} ${uses === 1 ? 'use' : 'uses'}`);
      else if (option === 'guidance') mechanicsParts.push(`Add ${die} to one ${appliesText}`);
      else if (option === 'heroism') mechanicsParts.push(`Immune to fear, +${die} to saves`);
    }

    // BLESSED — popup writes option: protection|fortune|life, bonusType, rollBonus, bonusDie, affects...
    else if (effectId === 'blessed') {
      const bt = status.bonusType || 'flat';
      const bonusVal = bt === 'dice' ? (status.bonusDie || 'd4') : (status.rollBonus ? `+${status.rollBonus}` : '+2');
      const affects = [];
      if (status.affectsAttacks !== false) affects.push('attacks');
      if (status.affectsSaves !== false) affects.push('saves');
      if (status.affectsSkills) affects.push('skills');
      const affectsText = affects.length ? affects.join(', ') : 'all rolls';
      if (option === 'protection') mechanicsParts.push(`${bonusVal} to ${affectsText} and AC`);
      else if (option === 'fortune') mechanicsParts.push(`${bonusVal} to ${affectsText}`);
      else if (option === 'life') mechanicsParts.push(`${bonusVal} to saves + temp HP each turn`);
    }

    // STRENGTHENED — popup writes option: physical|magical|overall, damageBonus, strengthBonus
    else if (effectId === 'strengthened') {
      const dmgBonus = status.damageBonus || '+2';
      if (option === 'physical') mechanicsParts.push(`${dmgBonus} physical damage, +${status.strengthBonus || 2} STR`);
      else if (option === 'magical') mechanicsParts.push(`${dmgBonus} spell damage`);
      else if (option === 'overall') mechanicsParts.push(`${dmgBonus} to all damage`);
    }

    // RESISTANCE — popup writes option: elemental|physical|magical, damageTypes, resistanceValue, absorptionAmount
    else if (effectId === 'resistance') {
      const resistLevel = status.resistanceValue || '50';
      const levelMap = { '0': 'Immune', '25': 'Minor resistance', '50': 'Resistant (half damage)', '75': 'Guarded' };
      const dmgTypes = status.damageTypes?.length ? status.damageTypes.join(', ') : (option || 'all');
      mechanicsParts.push(`${levelMap[resistLevel] || `${resistLevel}% resistance`} to ${dmgTypes}`);
      if (status.absorptionAmount) mechanicsParts.push(`absorbs ${status.absorptionAmount} first`);
    }

    // VULNERABILITY — popup writes damageTypes, vulnerabilityValue
    else if (effectId === 'vulnerability') {
      const pct = status.vulnerabilityValue || '150';
      const dmgTypes = status.damageTypes?.length ? status.damageTypes.join(', ') : 'all';
      const label = pct === '125' ? 'Susceptible' : pct === '150' ? 'Vulnerable' : pct === '200' ? 'Highly vulnerable' : `${pct}% damage taken`;
      mechanicsParts.push(`${label} to ${dmgTypes}`);
    }

    // ===== DEBUFF EFFECTS =====

    // BLINDED — popup writes blindType: full|partial|darkness, attackPenalty
    else if (effectId === 'blinded' || effectId === 'blind') {
      const bt = status.blindType || option || 'full';
      if (bt === 'full') mechanicsParts.push(`Can't see anything (${status.attackPenalty || -5} to attacks)`);
      else if (bt === 'partial') mechanicsParts.push(`Reduced vision (${status.attackPenalty || -5} to attacks)`);
      else if (bt === 'darkness') mechanicsParts.push(`Magical darkness — can't see through it`);
    }

    // CHARMED — popup writes option: friendly|dominated|infatuated, saveDC, saveType
    else if (effectId === 'charmed' || effectId === 'charm') {
      if (option === 'friendly') mechanicsParts.push('Sees the caster as a trusted friend');
      else if (option === 'dominated') mechanicsParts.push('Must obey the caster\'s commands');
      else if (option === 'infatuated') mechanicsParts.push('Devoted — will defend the caster');
      if (status.saveDC) mechanicsParts.push(`${status.saveType || 'Spirit'} DC ${status.saveDC} to resist`);
      if (status.canAttackCharmer === false) mechanicsParts.push("can't attack the charmer");
    }

    // FRIGHTENED — popup writes option: shaken|terrified|panicked, fearRadius, penaltyMagnitude
    else if (effectId === 'frightened' || effectId === 'fear') {
      if (option === 'shaken') mechanicsParts.push(`-${status.penaltyMagnitude || 2} to checks while source is visible`);
      else if (option === 'terrified') mechanicsParts.push(`Won't approach the fear source (${status.fearRadius || 30}ft radius)`);
      else if (option === 'panicked') mechanicsParts.push('Must run away from the fear source');
      if (status.saveType) mechanicsParts.push(`${status.saveType} save to shake it off`);
    }

    // PARALYZED — popup writes option: partial|complete|magical, canSpeak, canCastNonSomatic
    else if (effectId === 'paralyzed' || effectId === 'paralyze') {
      if (option === 'partial') mechanicsParts.push('Speed reduced, limited movement');
      else if (option === 'complete') mechanicsParts.push("Can't move, act, or speak — attacks against them have advantage");
      else if (option === 'magical') mechanicsParts.push('Held in magical stasis');
      if (status.canSpeak) mechanicsParts.push('can still speak');
      if (status.canCastNonSomatic) mechanicsParts.push('can cast non-somatic spells');
    }

    // POISONED — popup writes option: weakening|debilitating|paralyzing, damagePerRound, saveDC
    else if (effectId === 'poisoned' || effectId === 'poison') {
      if (option === 'weakening') mechanicsParts.push('Disadvantage on STR and CON checks');
      else if (option === 'debilitating') mechanicsParts.push(`Takes ${status.damagePerRound || '1d4'} blight damage each round`);
      else if (option === 'paralyzing') mechanicsParts.push(`Takes ${status.damagePerRound || '1d4'} damage, may paralyze on failed save`);
      if (status.saveDC) mechanicsParts.push(`Constitution DC ${status.saveDC}`);
    }

    // RESTRAINED — popup writes option: ensnared|grappled|bound, escapeDC, struggleDamage
    else if (effectId === 'restrained' || effectId === 'restrain') {
      if (option === 'ensnared') mechanicsParts.push('Tangled up — speed drops to 0');
      else if (option === 'grappled') mechanicsParts.push(`Grappled — escape DC ${status.escapeDC || 15}`);
      else if (option === 'bound') mechanicsParts.push(`Trussed up — escape DC ${status.escapeDC || 15}, can't use hands`);
      if (status.struggleDamage && status.struggleDamage !== '0') mechanicsParts.push(`${status.struggleDamage} damage if you struggle`);
    }

    // SILENCED — popup writes option: magical|muted|temporal, silenceRadius, affectsSpells
    else if (effectId === 'silenced' || effectId === 'silence') {
      if (option === 'magical') mechanicsParts.push(`No sound in ${status.silenceRadius || 20}ft radius — can't cast verbal spells`);
      else if (option === 'muted') mechanicsParts.push("Can't speak at all");
      else if (option === 'temporal') mechanicsParts.push('Speech keeps glitching — verbal casting unreliable');
    }

    // SLOWED — popup writes option: hindered|lethargic|temporal, speedReduction, actionPointReduction
    else if (effectId === 'slowed' || effectId === 'slow') {
      const sr = status.speedReduction || '50';
      if (option === 'hindered') mechanicsParts.push(`Movement ${sr}% slower`);
      else if (option === 'lethargic') mechanicsParts.push(`-${status.actionPointReduction || 1} action point${(status.actionPointReduction || 1) > 1 ? 's' : ''} per turn`);
      else if (option === 'temporal') mechanicsParts.push(`Caught in time distortion — ${sr}% slower, -${status.actionPointReduction || 1} AP`);
    }

    // BURNING — popup writes option: mild|intense|magical, damagePerRound, spreadChance
    else if (effectId === 'burning' || effectId === 'burn') {
      mechanicsParts.push(`${status.damagePerRound || '1d6'} ember damage per round`);
      if (status.spreadChance && status.spreadChance !== '0') mechanicsParts.push(`${status.spreadChance}% chance to spread to nearby targets`);
      if (option === 'magical') mechanicsParts.push('ignores resistance');
    }

    // FROZEN — popup writes option: chilled|frostbitten|frozen, coldDamage, movementPenalty
    else if (effectId === 'frozen' || effectId === 'freeze') {
      const mp = status.movementPenalty || '50';
      if (option === 'chilled') mechanicsParts.push(`${mp}% slower`);
      else if (option === 'frostbitten') mechanicsParts.push(`${status.coldDamage || '1d6'} rime damage, ${mp}% slower, disadvantage on Agility`);
      else if (option === 'frozen') mechanicsParts.push(`Encased in ice — ${status.coldDamage || '1d4'} damage, can't move`);
    }

    // WEAKENED — popup writes option: fatigued|exhausted|drained, damageReduction, strengthPenalty
    else if (effectId === 'weakened' || effectId === 'weak') {
      const dr = status.damageReduction || '25';
      if (option === 'fatigued') mechanicsParts.push(`${dr}% less damage dealt`);
      else if (option === 'exhausted') mechanicsParts.push(`${dr}% less damage, disadvantage on physical checks`);
      else if (option === 'drained') mechanicsParts.push(`${dr}% less damage, -${status.strengthPenalty || 2} STR`);
    }

    // CONFUSED — popup writes option: disoriented|befuddled|insane, randomActionChance, accuracyPenalty
    else if (effectId === 'confused' || effectId === 'confusion') {
      const rac = status.randomActionChance || '25';
      if (option === 'disoriented') mechanicsParts.push(`-${status.accuracyPenalty || 2} to attacks, ${rac}% chance to lose action`);
      else if (option === 'befuddled') mechanicsParts.push(`${rac}% chance to attack random target`);
      else if (option === 'insane') mechanicsParts.push(`${rac}% chance to act randomly each turn`);
    }

    // DISEASED — popup writes option: infected|contagious|terminal, damagePerDay, contagionRadius
    else if (effectId === 'diseased' || effectId === 'disease') {
      if (option === 'infected') mechanicsParts.push("Can't regain HP naturally");
      else if (option === 'contagious') mechanicsParts.push(`${status.damagePerDay || '1d4'} damage/day, ${status.contagionRadius || 5}ft contagion`);
      else if (option === 'terminal') mechanicsParts.push(`${status.damagePerDay || '1d4'} damage/day, disadvantage on death saves`);
    }

    // BLEEDING — popup writes option: minor|severe|hemorrhaging, damagePerRound, healingDC
    else if (effectId === 'bleeding' || effectId === 'bleed') {
      mechanicsParts.push(`${status.damagePerRound || '1d4'} damage at start of each turn`);
      if (status.healingDC) mechanicsParts.push(`Healing DC ${status.healingDC} to stop the bleed`);
      if (option === 'hemorrhaging') mechanicsParts.push('incapacitated from blood loss');
    }

    // SLEPT — popup writes option: drowsy|asleep|comatose, wakeDC, wakesOnDamage
    else if (effectId === 'slept' || effectId === 'sleep') {
      if (option === 'drowsy') mechanicsParts.push('Disadvantage on Perception and initiative');
      else if (option === 'asleep') mechanicsParts.push(`Unconscious${status.wakesOnDamage ? ' — wakes on damage' : ''}`);
      else if (option === 'comatose') mechanicsParts.push('Deep magical sleep — only woken by magic');
      if (status.wakeDC) mechanicsParts.push(`Wake DC ${status.wakeDC}`);
    }

    // CURSED — popup writes option: jinxed|hexed|doomed, failureChance, rollPenalty
    else if (effectId === 'cursed' || effectId === 'curse') {
      const fc = status.failureChance || '10';
      if (option === 'jinxed') mechanicsParts.push(`${fc}% chance any roll fails, -${status.rollPenalty || 1} to all rolls`);
      else if (option === 'hexed') mechanicsParts.push(`${fc}% failure chance on specific rolls`);
      else if (option === 'doomed') mechanicsParts.push(`${fc}% failure chance, -${status.rollPenalty || 1} to everything, hard to remove`);
    }

    // DAZED — popup writes option: lightheaded|disoriented|concussed, focusPenalty, actionDelay
    else if (effectId === 'dazed' || effectId === 'daze') {
      const fp = status.focusPenalty || 2;
      if (option === 'lightheaded') mechanicsParts.push(`-${fp} to attack rolls`);
      else if (option === 'disoriented') mechanicsParts.push(`-${fp} to initiative, may move randomly`);
      else if (option === 'concussed') mechanicsParts.push(`-${fp} to attacks, can't take reactions`);
    }

    // REGENERATION EFFECT
    else if (effectId === 'regeneration' || effectId === 'regen') {
      const calculationType = status.calculationType || 'fixed';
      if (calculationType === 'fixed') {
        mechanicsParts.push(`Restore ${status.healAmount || 5} HP per round`);
      } else if (calculationType === 'percentage') {
        mechanicsParts.push(`Restore ${status.healPercentage || 5}% of max HP per round`);
      } else if (calculationType === 'dice') {
        mechanicsParts.push(`Restore ${status.diceCount || 1}${status.diceType || 'd6'} HP per round`);
      }
    }

    // SHIELD/SHIELDED EFFECT
    else if (effectId === 'shielded' || effectId === 'shield') {
      const shieldAmount = status.shieldAmount || 15;
      const shieldType = status.shieldType || 'absorb';
      if (shieldType === 'absorb') mechanicsParts.push(`Soaks up to ${shieldAmount} damage`);
      else if (shieldType === 'reflect') mechanicsParts.push(`Bounces ${shieldAmount} damage back at the attacker`);
      else if (shieldType === 'thorns') mechanicsParts.push(`Hits attackers for ${shieldAmount} damage`);
    }

    // STUNNED/STUN EFFECT
    else if (effectId === 'stunned' || effectId === 'stun') {
      mechanicsParts.push("Can't act or react");
    }

    // PRONE EFFECT
    else if (effectId === 'prone') {
      mechanicsParts.push('Disadvantage on attacks, others have advantage hitting them');
      mechanicsParts.push('Costs half movement to stand');
    }

    // FLIGHT EFFECT
    else if (effectId === 'flight' || effectId === 'flying') {
      mechanicsParts.push(`Fly speed ${status.flySpeed || status.flightSpeed || 60}ft`);
    }

    // TRUESIGHT EFFECT
    else if (effectId === 'truesight') {
      mechanicsParts.push(`See through illusions and darkness (${status.truesightRange || 60}ft)`);
    }

    // TEMPORARY HIT POINTS EFFECT
    else if (effectId === 'temporary_hp') {
      mechanicsParts.push(`Gain ${status.temporaryHitPoints || status.amount || '1d4'} temp HP`);
    }

    // Generic fallback — if we have a magnitude, show it
    else if (status.magnitude) {
      mechanicsParts.push(`${status.magnitudeType === 'percentage' ? `${status.magnitude}%` : `+${status.magnitude}`}`);
    }

    // Combine all mechanics parts
    mechanicsText = mechanicsParts.length > 0 ? mechanicsParts.join(', ') : (status.mechanicsText || '');

    return {
      name: effectName,
      description: description,
      mechanicsText: mechanicsText
    };
  };
  const formatBuffEffects = () => {
    if (!spell?.buffConfig) {
      // If spell has buff effect type but no config, show a basic effect
      if (spell?.effectTypes?.includes('buff')) {
        // buffConfig is undefined here, so just use a generic name
        const buffName = 'Buff Effect';
        return [{
          name: buffName,
          description: 'Provides beneficial effects',
          mechanicsText: 'Effect details not configured'
        }];
      }
      return null;
    }

    const { buffConfig } = spell;
    const effects = [];

    // Handle class spell format with statBonuses
    if (buffConfig.statBonuses && buffConfig.statBonuses.length > 0) {
      buffConfig.statBonuses.forEach(bonus => {
        const rawStat = bonus.stat?.toLowerCase() || '';
        const statName = GLOBAL_STAT_MAP[rawStat] || bonus.stat.charAt(0).toUpperCase() + bonus.stat.slice(1);
        const sign = bonus.amount >= 0 ? '+' : '';
        const typeText = bonus.type === 'percentage' ? '%' : '';
        effects.push({
          name: `${statName} Enhancement`,
          description: `${sign}${bonus.amount}${typeText} ${statName}`,
          mechanicsText: `Increases ${statName} by ${bonus.amount}${typeText}`,
          class: 'stat-bonus'
        });
      });
    }

    // Format stat modifiers with special handling for resistance and absorption
    if (buffConfig?.statModifiers && buffConfig.statModifiers.length > 0) {
      const regularStats = [];
      const resistanceStats = [];
      const absorptionStats = [];

      buffConfig.statModifiers.forEach(stat => {
        // Check if this is a resistance stat with special scaling - be more comprehensive
        const statName = (stat.name || stat.id || '').toLowerCase();
        const isResistanceStat = stat.category === 'resistance' ||
                                statName.includes('resistance') ||
                                statName.includes('resist') ||
                                statName.includes('wyrd') ||
                                statName.includes('ember') ||
                                statName.includes('rime') ||
                                statName.includes('rime') ||
                                statName.includes('storm') ||
                                statName.includes('arcane') ||
                                statName.includes('nature') ||
                                statName.includes('blight') ||
                                statName.includes('blight') ||
                                statName.includes('ember') ||
                                statName.includes('chaos') ||
                                statName.includes('blight') ||
                                statName.includes('arcane') ||
                                statName.includes('physical') ||
                                statName.includes('physical') ||
                                statName.includes('physical') ||
                                statName.includes('physical');

        const isAbsorptionStat = statName.includes('absorption');

        // Check for incomplete stat data and show warning
        const hasIncompleteName = !stat.name || stat.name.toLowerCase().includes('stat') && !stat.name.toLowerCase().includes('strength') && !stat.name.toLowerCase().includes('agility');

        const rawStatId = (stat.name || stat.id || '').toLowerCase();
        const statNameFromMap = GLOBAL_STAT_MAP[rawStatId] || stat.name || 'Stat Modifier';
        
        let statDisplay = {
          name: hasIncompleteName ? 'INCOMPLETE: Specify stat name' : statNameFromMap,
          value: '',
          class: hasIncompleteName ? 'incomplete-data' : ''
        };

        // Simple stat name formatting (no verbose descriptions)
        if (!hasIncompleteName) {
          // Use simple capitalized stat name
          statDisplay.name = stat.name.charAt(0).toUpperCase() + stat.name.slice(1);
        }

        if (typeof stat.magnitude === 'string') {
          // It's a dice formula - could be absorption or regular stat
          if (isAbsorptionStat) {
            const damageType = stat.name.toLowerCase().replace(/\s*absorption\s*/, '').trim();
            statDisplay.value = `Absorbs ${stat.magnitude} damage per hit`;
            if (damageType && damageType !== 'damage' && damageType !== 'all damage') {
              statDisplay.value += ` (${damageType} only)`;
            }
            statDisplay.class = 'absorption-formula';
          } else {
            // Simple dice formula display
            statDisplay.value = stat.magnitude;
            statDisplay.class = 'formula';
          }
        } else if (isAbsorptionStat) {
          // Handle flat absorption
          const damageType = stat.name.toLowerCase().replace(/\s*absorption\s*/, '').trim();
          statDisplay.value = `Absorbs up to ${Math.abs(stat.magnitude)} damage total`;
          if (damageType && damageType !== 'damage' && damageType !== 'all damage') {
            statDisplay.value += ` (${damageType} only)`;
          }
          statDisplay.class = 'absorption-flat';
        } else if (isResistanceStat) {
          // Handle resistance values with thematic descriptions
          const percentage = Math.round(parseFloat(stat.magnitude) || 0);
          const damageType = extractDamageTypeFromResistanceName(stat.name || stat.id);

          if (percentage === -200) {
            statDisplay.value = getThematicResistanceDescription('vampiric', damageType);
            statDisplay.class = 'vampiric';
          } else if (percentage === -100) {
            statDisplay.value = getThematicResistanceDescription('absorbing', damageType);
            statDisplay.class = 'absorbing';
          } else if (percentage === -50) {
            statDisplay.value = getThematicResistanceDescription('draining', damageType);
            statDisplay.class = 'draining';
          } else if (percentage === -25) {
            statDisplay.value = getThematicResistanceDescription('siphoning', damageType);
            statDisplay.class = 'siphoning';
          } else if (percentage === 0) {
            statDisplay.value = getThematicResistanceDescription('immune', damageType);
            statDisplay.class = 'immune';
          } else if (percentage === 25) {
            statDisplay.value = getThematicResistanceDescription('highly_resistant', damageType);
            statDisplay.class = 'highly_resistant';
          } else if (percentage === 50) {
            statDisplay.value = getThematicResistanceDescription('resistant', damageType);
            statDisplay.class = 'resistant';
          } else if (percentage === 75) {
            statDisplay.value = getThematicResistanceDescription('guarded', damageType);
            statDisplay.class = 'guarded';
          } else if (percentage === 100) {
            statDisplay.value = getThematicResistanceDescription('nullified', damageType);
            statDisplay.class = 'nullified';
          } else if (percentage === 125) {
            statDisplay.value = getThematicResistanceDescription('susceptible', damageType);
            statDisplay.class = 'susceptible';
          } else if (percentage === 150) {
            statDisplay.value = getThematicResistanceDescription('exposed', damageType);
            statDisplay.class = 'exposed';
          } else if (percentage === 200) {
            statDisplay.value = getThematicResistanceDescription('vulnerable', damageType);
            statDisplay.class = 'vulnerable';
          } else {
            // Create thematic description for any other percentage values
            const sign = percentage >= 0 ? '' : '';
            if (percentage > 0) {
              // Positive resistance values - create thematic descriptions
              if (percentage < 25) {
                statDisplay.value = `Minor ${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Protection`;
              } else if (percentage < 50) {
                statDisplay.value = `Moderate ${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Resistance`;
              } else if (percentage < 75) {
                statDisplay.value = `Strong ${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Defense`;
              } else if (percentage < 100) {
                statDisplay.value = `Major ${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Guard`;
              } else {
                statDisplay.value = `Overwhelming ${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Immunity`;
              }
            } else {
              // Negative resistance values (vulnerabilities)
              statDisplay.value = `${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Vulnerability`;
            }
            statDisplay.class = 'thematic-resistance';
          }
        } else {
          // Enhanced standard number or percentage display with thematic descriptions
          const magnitude = stat.magnitude || 0;
          const sign = magnitude >= 0 ? '+' : '';
          const isPercentage = stat.magnitudeType === 'percentage';

          if (isPercentage) {
            // Check if this is a resistance stat that should use thematic descriptions
            if (isResistanceStat) {
              // Handle resistance values with thematic descriptions
              const percentage = Math.round(parseFloat(magnitude) || 0);
              const damageType = extractDamageTypeFromResistanceName(stat.name || stat.id);

              if (percentage === -200) {
                statDisplay.value = getThematicResistanceDescription('vampiric', damageType);
                statDisplay.class = 'vampiric';
              } else if (percentage === -100) {
                statDisplay.value = getThematicResistanceDescription('absorbing', damageType);
                statDisplay.class = 'absorbing';
              } else if (percentage === -50) {
                statDisplay.value = getThematicResistanceDescription('draining', damageType);
                statDisplay.class = 'draining';
              } else if (percentage === -25) {
                statDisplay.value = getThematicResistanceDescription('siphoning', damageType);
                statDisplay.class = 'siphoning';
              } else if (percentage === 0) {
                statDisplay.value = getThematicResistanceDescription('immune', damageType);
                statDisplay.class = 'immune';
              } else if (percentage === 25) {
                statDisplay.value = getThematicResistanceDescription('highly_resistant', damageType);
                statDisplay.class = 'highly_resistant';
              } else if (percentage === 50) {
                statDisplay.value = getThematicResistanceDescription('resistant', damageType);
                statDisplay.class = 'resistant';
              } else if (percentage === 75) {
                statDisplay.value = getThematicResistanceDescription('guarded', damageType);
                statDisplay.class = 'guarded';
              } else if (percentage === 100) {
                statDisplay.value = getThematicResistanceDescription('nullified', damageType);
                statDisplay.class = 'nullified';
              } else if (percentage === 125) {
                statDisplay.value = getThematicResistanceDescription('susceptible', damageType);
                statDisplay.class = 'susceptible';
              } else if (percentage === 150) {
                statDisplay.value = getThematicResistanceDescription('exposed', damageType);
                statDisplay.class = 'exposed';
              } else if (percentage === 200) {
                statDisplay.value = getThematicResistanceDescription('vulnerable', damageType);
                statDisplay.class = 'vulnerable';
              } else {
                // Create thematic description for any other percentage values
                if (percentage > 0) {
                  // Positive resistance values - create thematic descriptions
                  if (percentage < 25) {
                    statDisplay.value = `Minor ${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Protection`;
                  } else if (percentage < 50) {
                    statDisplay.value = `Moderate ${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Resistance`;
                  } else if (percentage < 75) {
                    statDisplay.value = `Strong ${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Defense`;
                  } else if (percentage < 100) {
                    statDisplay.value = `Major ${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Guard`;
                  } else {
                    statDisplay.value = `Overwhelming ${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Immunity`;
                  }
                } else {
                  // Negative resistance values (vulnerabilities)
                  statDisplay.value = `${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Vulnerability`;
                }
                statDisplay.class = 'thematic-resistance';
              }
            } else {
              // Simple percentage formatting for non-resistance stats
              const sign = magnitude >= 0 ? '+' : '';
              statDisplay.value = `${sign}${magnitude}%`;
              statDisplay.class = magnitude >= 0 ? 'positive' : 'negative';
            }
          } else {
            // Special handling for damage_reduction stat
            if (stat.stat === 'damage_reduction' || statName.includes('damage_reduction') || statName.includes('damage reduction')) {
              if (stat.magnitudeType === 'dice' && stat.formula) {
                statDisplay.value = `Reduces incoming damage by ${stat.formula}`;
              } else {
                statDisplay.value = `Reduces incoming damage by ${Math.abs(magnitude)}`;
              }
              statDisplay.class = 'damage-reduction';
              } else {
                const advDis = getAdvantageDisadvantageText(stat.stat || stat.name || stat.id, magnitude, stat.magnitudeType);
                if (advDis.isAdvDis) {
                  statDisplay.name = advDis.type === 'advantage' ? 'Advantage' : 'Disadvantage';
                  statDisplay.value = `on ${mapStatKeyToLabel(stat.stat || stat.name || stat.id)}`;
                  statDisplay.class = advDis.type === 'advantage' ? 'positive' : 'negative';
                } else {
                  // Simple flat number formatting for other stats
                  // Always use simple format, never use verbose stat descriptions
                  const sign = magnitude >= 0 ? '+' : '';
                  statDisplay.value = `${sign}${magnitude}`;
                  statDisplay.class = magnitude >= 0 ? 'positive' : 'negative';
                }
              }
          }
        }

        // Group stats by type
        if (isResistanceStat) {
          resistanceStats.push(statDisplay);
        } else if (isAbsorptionStat) {
          absorptionStats.push(statDisplay);
        } else {
          regularStats.push(statDisplay);
        }
      });

      // Add grouped stat effects
      if (regularStats.length > 0) {
        effects.push({
          name: 'Stat Modifiers',
          description: '',
          mechanicsText: regularStats.map(stat => stat.value ? (stat.value.startsWith('on ') ? `${stat.name} ${stat.value}` : `${stat.name}: ${stat.value}`) : stat.name).join(', '),
          type: 'stats',
          data: regularStats
        });
      }

      if (resistanceStats.length > 0) {
        effects.push({
          name: 'Resistances',
          description: '',
          mechanicsText: '',
          type: 'resistance',
          data: resistanceStats
        });
      }

      if (absorptionStats.length > 0) {
        effects.push({
          name: 'Damage Absorption',
          description: '',
          mechanicsText: absorptionStats.map(stat => stat.value).join(', '),
          type: 'absorption',
          data: absorptionStats
        });
      }
    }
    // Format status effects with enhanced configuration display
    if (buffConfig?.statusEffects && buffConfig.statusEffects.length > 0) {
      buffConfig.statusEffects.forEach(effect => {
        // Handle both string IDs and full effect objects
        let effectName, effectData;

        if (typeof effect === 'string') {
          effectName = effect;
          effectData = {};
        } else {
          effectName = effect.name || effect.id || 'Status Effect';
          effectData = effect;
        }

        effectName = effectName.charAt(0).toUpperCase() + effectName.slice(1);

        let mechanicsText = '';
        const mechanicsParts = [];

        // Add configuration-specific details based on effect type
        if (effectData.option) {
          // For lifelink, use proper formatting
          if (effectData.id === 'lifelink') {
            const optionMap = {
              'hp_to_hp': 'Health Link',
              'mana_to_mana': 'Mana Link',
              'hp_to_mana': 'Life to Mana',
              'mana_to_hp': 'Mana to HP',
              'damage_to_healing': 'Damage to Healing',
              'healing_to_damage': 'Healing to Damage'
            };
            const optionName = optionMap[effectData.option] || effectData.option;
            effectName += ` (${optionName})`;
          } else {
            // For other effects, use standard formatting
            const optionName = effectData.option.charAt(0).toUpperCase() + effectData.option.slice(1);
            effectName += ` (${optionName})`;
          }
        }

        // Add specific effect mechanics based on effect ID with comprehensive configuration details
        if (effectData.id === 'lifelink') {
          // Lifelink configuration details - handle both old and new field naming
          const option = effectData.option; // Old system uses 'option' field

          // Handle old system (CleanStatusEffectConfigPopup) with option-based configuration
          if (option) {
            // Map option to readable format
            const optionMap = {
              'hp_to_hp': 'Health Link',
              'mana_to_mana': 'Mana Link',
              'hp_to_mana': 'Life to Mana',
              'mana_to_hp': 'Mana to HP',
              'damage_to_healing': 'Damage to Healing',
              'healing_to_damage': 'Healing to Damage'
            };
            mechanicsParts.push(optionMap[option] || option);

            // Get transfer ratio (old system uses transferRatio, new system uses percentage)
            const transferRatio = effectData.transferRatio || effectData.percentage || 25;
            mechanicsParts.push(`${transferRatio}% conversion`);

            // Add maximum transfer limit if specified
            if (effectData.maxTransfer && effectData.maxTransfer > 0) {
              mechanicsParts.push(`Max: ${effectData.maxTransfer} per trigger`);
            }
          } else {
            // Handle new system (StatusEffectConfigPopup) with detailed configuration
            const direction = effectData.direction || 'caster_to_target';
            const sourceResource = effectData.sourceResource || 'health';
            const targetResource = effectData.targetResource || 'health';
            const calculationType = effectData.calculationType || 'percentage';

            // Format direction
            const directionMap = {
              'caster_to_target': 'Caster → Target',
              'target_to_caster': 'Target → Caster',
              'bidirectional': 'Bidirectional'
            };
            mechanicsParts.push(directionMap[direction]);

            // Format resource link
            if (sourceResource === targetResource) {
              mechanicsParts.push(`${sourceResource.charAt(0).toUpperCase() + sourceResource.slice(1)} Link`);
            } else {
              mechanicsParts.push(`${sourceResource.charAt(0).toUpperCase() + sourceResource.slice(1)} → ${targetResource.charAt(0).toUpperCase() + targetResource.slice(1)}`);
            }

            // Format conversion details
            if (calculationType === 'percentage') {
              const percentage = effectData.percentage || 25;
              mechanicsParts.push(`${percentage}% conversion`);
            } else if (calculationType === 'fixed_amount') {
              const amount = effectData.fixedAmount || 5;
              mechanicsParts.push(`${amount} points per trigger`);
            } else if (calculationType === 'dice_roll') {
              const dice = effectData.diceFormula || '1d4';
              mechanicsParts.push(`${dice} conversion`);
            } else if (calculationType === 'custom_formula') {
              const formula = effectData.customFormula || 'SOURCE_AMOUNT * 0.25';
              mechanicsParts.push(`Formula: ${formula}`);
            }

            // Add maximum transfer limit if specified
            if (effectData.maxTransfer && effectData.maxTransfer > 0) {
              mechanicsParts.push(`Max: ${effectData.maxTransfer} per trigger`);
            }
          }

          // Add trigger conditions
          if (effectData.triggerCondition) {
            const triggerMap = {
              'damage_taken': 'when damaged',
              'damage_dealt': 'when dealing damage',
              'healing_received': 'when healed',
              'spell_cast': 'when casting spells',
              'continuous': 'continuous effect',
              'area_entry': 'when entering or starting turn in area'
            };
            mechanicsParts.push(triggerMap[effectData.triggerCondition] || effectData.triggerCondition);
          }

        } else if (effectData.id === 'damage_shield' || effectData.id === 'damageshield') {
          // Damage Shield configuration details
          const shieldType = effectData.shieldType || effectData.option || 'reflection';

          // Handle detailed shield types (StatusEffectConfigPopup system)
          if (shieldType === 'reflection') {
            const percentage = effectData.reflectionPercentage || 25;
            mechanicsParts.push(`Reflects ${percentage}% damage back to attacker`);
          } else if (shieldType === 'thorns') {
            // Handle both old format (thornsDamage) and new format (thornsDiceCount + thornsDiceType)
            let damage;
            if (effectData.thornsDiceCount && effectData.thornsDiceType) {
              damage = `${effectData.thornsDiceCount}${effectData.thornsDiceType}`;
            } else {
              damage = effectData.thornsDamage || '1d4';
            }
            mechanicsParts.push(`Deals ${damage} damage to attackers`);
          } else if (shieldType === 'absorption') {
            const amount = effectData.absorptionAmount || 15;
            mechanicsParts.push(`Absorbs ${amount} damage, converts to temporary HP`);
          }
          // Handle simple shield types (CleanStatusEffectConfigPopup system)
          else if (shieldType === 'physical') {
            mechanicsParts.push('Reduces physical damage taken');
          } else if (shieldType === 'magical') {
            mechanicsParts.push('Reduces magical damage taken');
          } else if (shieldType === 'complete') {
            mechanicsParts.push('Reduces all damage taken');
          }

          // Add damage type restrictions
          if (effectData.damageTypes && effectData.damageTypes.length > 0) {
            mechanicsParts.push(`vs ${effectData.damageTypes.join(', ')} damage`);
          }

          // Add shield charges/uses if specified
          if (effectData.charges || effectData.uses) {
            const charges = effectData.charges || effectData.uses;
            mechanicsParts.push(`${charges} charge${charges > 1 ? 's' : ''}`);
          }

        } else if (effectData.id === 'empower_next' || effectData.id === 'empower_next_spell') {
          // Empower Next configuration details
          const empowerType = effectData.option || 'spell';

          const empowerMap = {
            'spell': 'Next spell empowered',
            'heal': 'Next healing empowered',
            'weapon': 'Next weapon attack empowered',
            'ability': 'Next ability empowered'
          };

          mechanicsParts.push(empowerMap[empowerType] || `Next ${empowerType} empowered`);

          // Add empowerment details
          if (effectData.empowerAmount || effectData.bonusAmount) {
            const bonus = effectData.empowerAmount || effectData.bonusAmount;
            mechanicsParts.push(`+${bonus}% effectiveness`);
          }

          if (effectData.maxDamage || effectData.maximumEffect) {
            mechanicsParts.push('maximum effect');
          }

          if (effectData.criticalGuaranteed) {
            mechanicsParts.push('guaranteed critical');
          }

        } else if (effectData.id === 'invisibility' || effectData.id === 'invisible') {
          // Invisibility configuration details
          const invisibilityType = effectData.option || 'complete';

          const invisibilityMap = {
            'partial': 'Camouflage - advantage on stealth checks',
            'complete': 'Complete invisibility - invisible until attacking',
            'greater': 'Greater invisibility - remains invisible when attacking'
          };

          mechanicsParts.push(invisibilityMap[invisibilityType] || `${invisibilityType} invisibility`);

          // Add stealth bonus if specified
          if (effectData.stealthBonus) {
            mechanicsParts.push(`+${effectData.stealthBonus} stealth bonus`);
          }

          // Add detection DC if specified
          if (effectData.detectionDC) {
            mechanicsParts.push(`DC ${effectData.detectionDC} to detect`);
          }

          // Add attack bonus details
          if (effectData.attackBonus && effectData.attackBonusType) {
            if (effectData.attackBonusType === 'advantage') {
              mechanicsParts.push('advantage on attacks while invisible');
            } else {
              mechanicsParts.push(`+${effectData.attackBonus} attack bonus while invisible`);
            }
          }

          // Add breaking conditions
          if (effectData.breaks && effectData.breaks.length > 0) {
            const breakConditions = effectData.breaks.map(condition => {
              const conditionMap = {
                'attack': 'attacking',
                'castSpell': 'casting spells',
                'takeDamage': 'taking damage',
                'move': 'moving',
                'interact': 'interacting with objects'
              };
              return conditionMap[condition] || condition;
            });
            mechanicsParts.push(`breaks on: ${breakConditions.join(', ')}`);
          }

        } else if (effectData.id === 'inspiration' || effectData.id === 'inspire') {
          // Inspiration configuration details
          const inspirationType = effectData.option || 'focus';

          const inspirationMap = {
            'focus': 'Mental focus - bonus to concentration checks',
            'insight': 'Tactical insight - bonus to Intelligence checks',
            'creativity': 'Creative surge - bonus to Charisma checks'
          };

          mechanicsParts.push(inspirationMap[inspirationType] || `${inspirationType} inspiration`);

          // Add inspiration die if specified
          if (effectData.inspirationDie) {
            mechanicsParts.push(`add ${effectData.inspirationDie} to applicable rolls`);
          }

          // Add uses per duration
          if (effectData.usesPerDuration) {
            mechanicsParts.push(`${effectData.usesPerDuration} use${effectData.usesPerDuration > 1 ? 's' : ''} per duration`);
          }

          // Add what it applies to
          if (effectData.appliesTo) {
            mechanicsParts.push(`applies to ${effectData.appliesTo} checks`);
          }

        } else if (effectData.id === 'elemental_infusion' || effectData.id === 'elemental_affinity') {
          // Elemental Infusion configuration details
          const elementType = effectData.option || effectData.elementType || 'ember';

          const elementMap = {
            'ember': 'Fire infusion - weapon attacks deal fire damage',
            'rime': 'Frost infusion - weapon attacks deal cold damage',
            'storm': 'Lightning infusion - weapon attacks deal lightning damage',
            'earth': 'Earth infusion - weapon attacks deal earth damage',
            'air': 'Air infusion - weapon attacks deal air damage',
            'water': 'Water infusion - weapon attacks deal water damage'
          };

          mechanicsParts.push(elementMap[elementType] || `${elementType} elemental infusion`);

          // Add damage bonus if specified (check multiple possible field names)
          if (effectData.extraDamage || effectData.damageBonus || effectData.bonusDamage) {
            const bonus = effectData.extraDamage || effectData.damageBonus || effectData.bonusDamage;
            mechanicsParts.push(`+${bonus} ${elementType} damage`);
          }

          // Add proc chance if specified
          if (effectData.procChance && effectData.procChance !== '100') {
            mechanicsParts.push(`${effectData.procChance}% chance`);
          }

          // Add aura effects if specified
          if (effectData.auraRadius) {
            mechanicsParts.push(`${effectData.auraRadius} ft ${elementType} aura`);
          }

          // Add special effects
          if (effectData.chainTargets) {
            mechanicsParts.push(`chains to ${effectData.chainTargets} targets`);
          }

          if (effectData.setOnFire && elementType === 'ember') {
            mechanicsParts.push('sets targets on fire');
          }

          if (effectData.freezeTarget && elementType === 'rime') {
            mechanicsParts.push('reduces target speed to 0');
          }

        } else if (effectData.id === 'shielded' || effectData.id === 'shield') {
          // Shield configuration details
          const shieldAmount = effectData.shieldAmount || 15;
          const shieldType = effectData.shieldType || 'absorb';

          if (shieldType === 'absorb') {
            mechanicsParts.push(`${shieldAmount} absorption shield`);
          } else if (shieldType === 'reflect') {
            mechanicsParts.push(`${shieldAmount} HP reflective barrier`);
          } else if (shieldType === 'thorns') {
            mechanicsParts.push(`${shieldAmount} HP thorns barrier`);
          }

        } else if (effectData.id === 'regeneration' || effectData.id === 'regen') {
          // Regeneration configuration details
          const regenType = effectData.regenType || 'health';
          const regenDice = effectData.regenDice || effectData.regenAmount || '1d4';
          const frequency = effectData.frequency || 'start_of_turn';

          const freqMap = {
            'start_of_turn': 'start of turn',
            'end_of_turn': 'end of turn',
            'when_damaged': 'when damaged',
            'when_below_half': 'when below 50% HP'
          };

          mechanicsParts.push(`${regenDice} ${regenType} restored`);
          mechanicsParts.push(freqMap[frequency] || frequency);

          // Add conditions
          if (effectData.condition) {
            mechanicsParts.push(`if ${effectData.condition}`);
          }

        } else if (effectData.id === 'haste') {
          // Haste configuration details
          const speedMultiplier = effectData.speedMultiplier || 2;
          const actionBonus = effectData.actionBonus || false;
          const attackBonus = effectData.attackBonus || false;

          mechanicsParts.push(`${speedMultiplier}× movement speed`);
          if (actionBonus) mechanicsParts.push('extra action');
          if (attackBonus) mechanicsParts.push('extra attack');

        } else if (effectData.id === 'inspired') {
          if (effectData.inspirationDie) {
            mechanicsParts.push(`Add ${effectData.inspirationDie} to rolls`);
          }
          if (effectData.usesPerDuration) {
            mechanicsParts.push(`${effectData.usesPerDuration} use${effectData.usesPerDuration > 1 ? 's' : ''}`);
          }
        } else if (effectData.id === 'blessed') {
          if (effectData.rollBonus) {
            mechanicsParts.push(`+${effectData.rollBonus} bonus`);
          }
          if (effectData.bonusDie) {
            mechanicsParts.push(`+${effectData.bonusDie} to rolls`);
          }
        } else if (effectData.id === 'resistance') {
          if (effectData.damageTypes && effectData.damageTypes.length > 0) {
            mechanicsParts.push(`Resist ${effectData.damageTypes.join(', ')}`);
          }
          if (effectData.resistanceValue) {
            mechanicsParts.push(`${effectData.resistanceValue}% reduction`);
          }
        } else if (effectData.id === 'poisoned' || effectData.id === 'blight') {
          // Poison configuration details
          if (effectData.diceCount && effectData.diceType) {
            mechanicsParts.push(`${effectData.diceCount}${effectData.diceType} poison damage per round`);
          }
          if (effectData.poisonType) {
            mechanicsParts.push(`${effectData.poisonType} poison`);
          }
        } else if (effectData.id === 'energized') {
          // Energized configuration details
          if (effectData.bonusActionPoints) {
            mechanicsParts.push(`+${effectData.bonusActionPoints} action points`);
          }
          if (effectData.actionPointRegeneration) {
            mechanicsParts.push(`+${effectData.actionPointRegeneration} AP regen per turn`);
          }
          if (effectData.costReduction) {
            mechanicsParts.push(`-${effectData.costReduction} AP cost for abilities`);
          }
        } else if (effectData.id === 'damage_bonus') {
          // Damage bonus configuration details
          const option = effectData.option;
          if (option === 'elemental' && effectData.damageType && effectData.damageDice) {
            mechanicsParts.push(`+${effectData.damageDice} ${effectData.damageType} damage`);
          } else if (option === 'weapon' && effectData.effectDice) {
            mechanicsParts.push(`+${effectData.effectDice} weapon damage`);
          } else if (option === 'conditional' && effectData.damageDice) {
            mechanicsParts.push(`+${effectData.damageDice} conditional damage`);
          }
        } else if (effectData.id === 'damage_vulnerability') {
          // Vulnerability configuration details
          const option = effectData.option;
          if (option === 'physical') {
            mechanicsParts.push('Vulnerable to physical damage');
          } else if (option === 'elemental' && effectData.primaryElement) {
            mechanicsParts.push(`Vulnerable to ${effectData.primaryElement} damage`);
          } else if (option === 'magical') {
            mechanicsParts.push('Vulnerable to magical damage');
          }
          if (effectData.primaryStrength) {
            mechanicsParts.push(`+${effectData.primaryStrength}% damage taken`);
          }
        } else if (effectData.id === 'burning') {
          // Burning configuration details
          if (effectData.diceCount && effectData.diceType) {
            mechanicsParts.push(`${effectData.diceCount}${effectData.diceType} fire damage per round`);
          }
          if (effectData.extinguishDC) {
            mechanicsParts.push(`DC ${effectData.extinguishDC} to extinguish`);
          }
          if (effectData.extinguishMethod) {
            const methodMap = {
              'action': 'Action to extinguish',
              'water': 'Water/cold damage extinguishes',
              'dispel': 'Dispel magic removes',
              'special': 'Special method required'
            };
            mechanicsParts.push(methodMap[effectData.extinguishMethod] || effectData.extinguishMethod);
          }
        } else if (effectData.id === 'charmed' || effectData.id === 'charm') {
          // Charm configuration details
          if (effectData.commandComplexity) {
            const complexityMap = {
              'simple': 'Simple commands only',
              'moderate': 'Moderate complexity commands',
              'complex': 'Complex commands allowed',
              'any': 'Any command possible'
            };
            mechanicsParts.push(complexityMap[effectData.commandComplexity]);
          }
          if (effectData.maxCommands) {
            mechanicsParts.push(`Max ${effectData.maxCommands} command${effectData.maxCommands > 1 ? 's' : ''}`);
          }
        } else if (effectData.id === 'disadvantage_attack') {
          // Attack disadvantage configuration details
          const option = effectData.option;
          if (option === 'all') {
            mechanicsParts.push('Disadvantage on all attack rolls');
          } else if (option === 'melee') {
            mechanicsParts.push('Disadvantage on melee attack rolls');
          } else if (option === 'ranged') {
            mechanicsParts.push('Disadvantage on ranged attack rolls');
          } else if (option === 'spell') {
            mechanicsParts.push('Disadvantage on spell attack rolls');
          }
        } else if (effectData.id === 'disadvantage_save') {
          // Save disadvantage configuration details
          if (effectData.saveType) {
            mechanicsParts.push(`Disadvantage on ${effectData.saveType} saves`);
          }
          if (effectData.saveTypes && effectData.saveTypes.length > 0) {
            mechanicsParts.push(`Disadvantage on ${effectData.saveTypes.join(', ')} saves`);
          }
        } else if (effectData.id === 'stunned' || effectData.id === 'stun') {
          // Stun configuration details
          if (effectData.duration) {
            mechanicsParts.push(`${effectData.duration} round${effectData.duration > 1 ? 's' : ''}`);
          }
          if (effectData.untilDispelled) {
            mechanicsParts.push('Until dispelled');
          }
        } else if (effectData.id === 'flight' || effectData.id === 'flying') {
          // Flight configuration details
          const flightSpeed = effectData.flightSpeed || 30;
          const flightType = effectData.flightType || 'magical';
          const maneuverability = effectData.maneuverability || 'average';

          mechanicsParts.push(`${flightSpeed} ft flight speed`);
          mechanicsParts.push(`${flightType} flight`);
          if (maneuverability !== 'average') {
            mechanicsParts.push(`${maneuverability} maneuverability`);
          }
        } else if (effectData.id === 'frightened' || effectData.id === 'fear') {
          // Fear configuration details
          if (effectData.fearType || effectData.option) {
            const fearType = effectData.fearType || effectData.option;
            const typeMap = {
              'shaken': 'Shaken - disadvantage on ability checks while source visible',
              'terrified': 'Terrified - cannot move closer to fear source',
              'panicked': 'Panicked - must flee from fear source'
            };
            mechanicsParts.push(typeMap[fearType] || `${fearType} fear`);
          }
          if (effectData.fearRadius) {
            mechanicsParts.push(`${effectData.fearRadius} ft fear radius`);
          }
        } else if (effectData.id === 'blinded' || effectData.id === 'blind') {
          // Blind configuration details
          if (effectData.blindType || effectData.option) {
            const blindType = effectData.blindType || effectData.option;
            const typeMap = {
              'partial': 'Partially blinded - disadvantage on perception and attacks',
              'complete': 'Completely blinded - cannot see, fails sight-based checks',
              'magical': 'Magical blindness - supernatural darkness'
            };
            mechanicsParts.push(typeMap[blindType] || `${blindType} blindness`);
          }
        } else if (effectData.id === 'paralyzed' || effectData.id === 'paralyze') {
          // Paralysis configuration details
          if (effectData.paralysisType || effectData.option) {
            const paralysisType = effectData.paralysisType || effectData.option;
            const typeMap = {
              'partial': 'Partially paralyzed - reduced movement and actions',
              'complete': 'Completely paralyzed - cannot move or act',
              'magical': 'Magical paralysis - held by supernatural forces'
            };
            mechanicsParts.push(typeMap[paralysisType] || `${paralysisType} paralysis`);
          }
        } else if (effectData.id === 'confused' || effectData.id === 'confusion') {
          // Confusion configuration details
          if (effectData.confusionType || effectData.option) {
            const confusionType = effectData.confusionType || effectData.option;
            const typeMap = {
              'random': 'Random actions - roll for behavior each turn',
              'dazed': 'Dazed - reduced actions available',
              'disoriented': 'Disoriented - disadvantage on navigation and perception'
            };
            mechanicsParts.push(typeMap[confusionType] || `${confusionType} confusion`);
          }
        } else if (effectData.id === 'silenced' || effectData.id === 'silence') {
          // Silence configuration details
          if (effectData.silenceType || effectData.option) {
            const silenceType = effectData.silenceType || effectData.option;
            const typeMap = {
              'verbal': 'Cannot speak - no verbal spells',
              'magical': 'Magical silence - no spellcasting',
              'complete': 'Complete silence - no sound at all'
            };
            mechanicsParts.push(typeMap[silenceType] || `${silenceType} silence`);
          }
        } else if (effectData.id === 'slowed' || effectData.id === 'slow') {
          // Slow configuration details
          if (effectData.slowAmount || effectData.speedReduction) {
            const reduction = effectData.slowAmount || effectData.speedReduction || 50;
            mechanicsParts.push(`${reduction}% speed reduction`);
          }
          if (effectData.affectsActions) {
            mechanicsParts.push('reduced actions per turn');
          }
        }

        // Generic option-based formatting for effects that use the standard option system
        else if (effectData.option && !mechanicsParts.length) {
          // Handle common option patterns for effects not specifically handled above
          const option = effectData.option;

          // Common option mappings for various effect types
          if (effectData.id === 'strengthened' || effectData.id === 'strength_boost') {
            const optionMap = {
              'physical': 'Physical strength enhanced',
              'magical': 'Magical power enhanced',
              'mental': 'Mental fortitude enhanced',
              'all': 'All capabilities enhanced'
            };
            mechanicsParts.push(optionMap[option] || `${option} enhancement`);
          } else if (effectData.id === 'weakened' || effectData.id === 'weakness') {
            const optionMap = {
              'physical': 'Physical weakness - reduced strength and constitution',
              'mental': 'Mental weakness - reduced intelligence and spirit',
              'magical': 'Magical weakness - reduced spellcasting ability',
              'all': 'General weakness - all abilities reduced'
            };
            mechanicsParts.push(optionMap[option] || `${option} weakness`);
          } else if (effectData.id === 'diseased' || effectData.id === 'disease') {
            const optionMap = {
              'wasting': 'Wasting disease - gradual stat reduction',
              'fever': 'Fever - constitution penalties and confusion',
              'plague': 'Plague - contagious and debilitating',
              'magical': 'Magical disease - supernatural affliction'
            };
            mechanicsParts.push(optionMap[option] || `${option} disease`);
          } else if (effectData.id === 'cursed' || effectData.id === 'curse') {
            const optionMap = {
              'weakness': 'Curse of Weakness - reduced physical capabilities',
              'misfortune': 'Curse of Misfortune - disadvantage on rolls',
              'binding': 'Binding Curse - restricted actions',
              'doom': 'Curse of Doom - escalating negative effects'
            };
            mechanicsParts.push(optionMap[option] || `${option} curse`);
          } else if (effectData.id === 'bleeding' || effectData.id === 'bleed') {
            const optionMap = {
              'minor': 'Minor wound - light bleeding',
              'severe': 'Severe wound - heavy bleeding',
              'arterial': 'Arterial bleeding - critical blood loss',
              'internal': 'Internal bleeding - hidden damage'
            };
            mechanicsParts.push(optionMap[option] || `${option} bleeding`);
          } else {
            // Generic fallback - capitalize and format the option
            const formattedOption = option.charAt(0).toUpperCase() + option.slice(1).replace(/_/g, ' ');
            mechanicsParts.push(formattedOption);
          }
        }
        // Add more status effect configurations
        if (effectData.id === 'luck' || effectData.id === 'lucky') {
          // Handle both old and new luck configuration systems
          const luckType = effectData.luckType;
          const option = effectData.option; // Old system uses 'option' field

          // New system (luckType-based)
          if (luckType === 'bonus') {
            const luckBonus = effectData.luckBonus || 1;
            const appliesTo = effectData.appliesTo || 'all';

            if (appliesTo === 'all') {
              mechanicsParts.push(`+${luckBonus} luck bonus to all rolls`);
            } else if (appliesTo === 'd20') {
              mechanicsParts.push(`+${luckBonus} luck bonus to d20 rolls`);
            } else if (appliesTo === 'attack') {
              mechanicsParts.push(`+${luckBonus} luck bonus to attack rolls`);
            } else if (appliesTo === 'damage') {
              mechanicsParts.push(`+${luckBonus} luck bonus to damage rolls`);
            } else if (appliesTo === 'skill') {
              mechanicsParts.push(`+${luckBonus} luck bonus to skill checks`);
            } else if (appliesTo === 'save') {
              mechanicsParts.push(`+${luckBonus} luck bonus to saving throws`);
            } else if (appliesTo === 'custom' && effectData.customRollTypes) {
              mechanicsParts.push(`+${luckBonus} luck bonus to ${effectData.customRollTypes}`);
            } else {
              mechanicsParts.push(`+${luckBonus} luck bonus`);
            }
          } else if (luckType === 'reroll') {
            const rerollCount = effectData.rerollCount || 3;
            const appliesTo = effectData.appliesTo || 'd20';
            mechanicsParts.push(`${rerollCount} rerolls for ${appliesTo} rolls`);
            if (effectData.keepBetter) {
              mechanicsParts.push('keep better result');
            }
          } else if (luckType === 'minimum') {
            const minimumValue = effectData.minimumValue || 10;
            const appliesTo = effectData.appliesTo || 'd20';
            mechanicsParts.push(`minimum ${minimumValue} on ${appliesTo} rolls`);
          } else if (luckType === 'choose') {
            const choiceCount = effectData.choiceCount || 1;
            mechanicsParts.push(`choose result of ${choiceCount} roll${choiceCount > 1 ? 's' : ''}`);
            if (effectData.allowCritical) {
              mechanicsParts.push('can choose critical hits');
            }
          }
          // Old system (option-based) - this is what you're currently using
          else if (option === 'minor') {
            const rerollCount = effectData.rerollCount || 1;
            mechanicsParts.push(`${rerollCount} reroll${rerollCount > 1 ? 's' : ''} on failed rolls`);
          } else if (option === 'major') {
            const rerollCount = effectData.rerollCount || 3;
            mechanicsParts.push(`${rerollCount} reroll${rerollCount > 1 ? 's' : ''} on any rolls`);
          } else if (option === 'fate') {
            mechanicsParts.push('choose the result of one roll');
          }
          // Legacy fallback
          else if (luckType === 'general' || (!luckType && !option)) {
            const luckBonus = effectData.luckBonus || 1;
            mechanicsParts.push(`+${luckBonus} luck bonus to all rolls`);
          } else if (luckType === 'combat') {
            const luckBonus = effectData.luckBonus || 1;
            mechanicsParts.push(`+${luckBonus} luck bonus to combat rolls`);
          } else if (luckType === 'skill') {
            const luckBonus = effectData.luckBonus || 1;
            mechanicsParts.push(`+${luckBonus} luck bonus to skill checks`);
          }

        } else if (effectData.id === 'flight' || effectData.id === 'flying') {
          // Flight configuration details
          const flightSpeed = effectData.flightSpeed || 30;
          const flightType = effectData.flightType || 'magical';
          const maneuverability = effectData.maneuverability || 'average';

          mechanicsParts.push(`${flightSpeed} ft flight speed`);
          mechanicsParts.push(`${flightType} flight`);
          if (maneuverability !== 'average') {
            mechanicsParts.push(`${maneuverability} maneuverability`);
          }

        } else if (effectData.id === 'combat_advantage') {
          // Combat Advantage configuration details
          const advantageType = effectData.advantageType || effectData.option || 'attack';

          if (advantageType === 'attack' || advantageType === 'attack_rolls') {
            mechanicsParts.push('Advantage on attack rolls');

            // Add specific attack types if configured
            const attackTypes = [];
            if (effectData.affectsMelee) attackTypes.push('melee');
            if (effectData.affectsRanged) attackTypes.push('ranged');
            if (effectData.affectsSpell) attackTypes.push('spell');
            if (attackTypes.length > 0 && attackTypes.length < 3) {
              mechanicsParts.push(`(${attackTypes.join(', ')} attacks)`);
            }

          } else if (advantageType === 'damage' || advantageType === 'damage_rolls') {
            mechanicsParts.push('Advantage on damage rolls');

            // Add damage bonus dice if specified
            if (effectData.damageBonusDiceCount && effectData.damageBonusDiceType) {
              mechanicsParts.push(`+${effectData.damageBonusDiceCount}${effectData.damageBonusDiceType} bonus damage`);
            }

            // Add damage categories
            if (effectData.affectsAllDamageTypes) {
              mechanicsParts.push('for all damage types');
            } else {
              const damageCategories = [];
              if (effectData.affectsPhysical) damageCategories.push('physical');
              if (effectData.affectsMagical) damageCategories.push('magical');
              if (damageCategories.length > 0) {
                mechanicsParts.push(`for ${damageCategories.join(', ')} damage`);
              }

              // Add specific physical damage types
              if (effectData.affectsPhysical && !effectData.affectsAllDamageTypes) {
                const physicalTypes = [];
                if (effectData.affectsBludgeoning) physicalTypes.push('physical');
                if (effectData.affectsPiercing) physicalTypes.push('physical');
                if (effectData.affectsSlashing) physicalTypes.push('physical');
                if (physicalTypes.length > 0 && physicalTypes.length < 3) {
                  mechanicsParts.push(`(${physicalTypes.join(', ')})`);
                }
              }

              // Add specific magical damage types
              if (effectData.affectsMagical && !effectData.affectsAllDamageTypes) {
                const magicalTypes = [];
                if (effectData.affectsFire) magicalTypes.push('ember');
                if (effectData.affectsCold) magicalTypes.push('rime');
                if (effectData.affectsLightning) magicalTypes.push('storm');
                if (effectData.affectsVoid) magicalTypes.push('blight');
                if (effectData.affectsArcane) magicalTypes.push('arcane');
                if (magicalTypes.length > 0 && magicalTypes.length < 5) {
                  mechanicsParts.push(`(${magicalTypes.join(', ')})`);
                }
              }
            }

          } else if (advantageType === 'healing' || advantageType === 'healing_rolls') {
            mechanicsParts.push('Advantage on healing rolls');

            // Add healing bonus dice if specified
            if (effectData.healingBonusDiceCount && effectData.healingBonusDiceType) {
              mechanicsParts.push(`+${effectData.healingBonusDiceCount}${effectData.healingBonusDiceType} bonus healing`);
            }

            // Add healing types
            const healingTypes = [];
            if (effectData.affectsDirectHealing) healingTypes.push('direct healing');
            if (effectData.affectsHealingOverTime) healingTypes.push('healing over time');
            if (effectData.affectsAbsorptionShields) healingTypes.push('absorption shields');
            if (healingTypes.length > 0 && healingTypes.length < 3) {
              mechanicsParts.push(`(${healingTypes.join(', ')})`);
            }

          } else if (advantageType === 'critical' || advantageType === 'critical_hits') {
            mechanicsParts.push('Increased critical hit chance');

            if (effectData.criticalReduction) {
              mechanicsParts.push(`critical threshold reduced by ${effectData.criticalReduction}`);
            }

          } else if (advantageType === 'initiative') {
            mechanicsParts.push('Advantage on initiative rolls');

            if (effectData.initiativeBonus) {
              mechanicsParts.push(`+${effectData.initiativeBonus} initiative bonus`);
            }

          } else if (advantageType === 'saving_throws') {
            mechanicsParts.push('Advantage on saving throws');

            if (effectData.saveTypes && effectData.saveTypes.length > 0) {
              mechanicsParts.push(`(${effectData.saveTypes.join(', ')})`);
            }
          }

          // Add condition requirements
          const requirements = [];
          if (effectData.requiresHigherGround) requirements.push('higher ground');
          if (effectData.requiresFlank) requirements.push('flanking');
          if (effectData.requiresHidden) requirements.push('hidden/stealth');
          if (requirements.length > 0) {
            mechanicsParts.push(`requires: ${requirements.join(', ')}`);
          }

          // Add magnitude/bonus value information
          if (effectData.magnitude && effectData.magnitude > 0) {
            const magnitudeType = effectData.magnitudeType || 'flat';
            if (magnitudeType === 'percentage') {
              mechanicsParts.push(`+${effectData.magnitude}% bonus`);
            } else {
              mechanicsParts.push(`+${effectData.magnitude} bonus`);
            }
          }

          // Add duration information
          if (effectData.onlyNextAttack) {
            mechanicsParts.push('next attack only');
          } else if (effectData.duration && effectData.duration !== 3) {
            mechanicsParts.push(`${effectData.duration} rounds`);
          }

        } else if (effectData.id === 'skill_mastery' || effectData.id === 'skillmastery' || effectData.id === 'mastery') {
          // Skill Mastery configuration details
          const masteryType = effectData.masteryType || 'specific';

          if (masteryType === 'specific' && effectData.selectedSkills) {
            mechanicsParts.push(`Mastery in ${effectData.selectedSkills.join(', ')}`);
          } else if (masteryType === 'category' && effectData.skillCategory) {
            mechanicsParts.push(`Mastery in all ${effectData.skillCategory} skills`);
          } else if (masteryType === 'all') {
            mechanicsParts.push('Mastery in all skills');
          }

          const masteryBonus = effectData.masteryBonus || 2;
          mechanicsParts.push(`+${masteryBonus} bonus`);

          // Add additional mastery features
          if (effectData.criticalSuccess) {
            mechanicsParts.push('critical success on natural 20');
          }
          if (effectData.rerollOnes) {
            mechanicsParts.push('reroll natural 1s');
          }
          if (effectData.takeAverage) {
            mechanicsParts.push('can take average result');
          }

        } else if (effectData.id === 'elemental_affinity') {
          // Elemental Affinity configuration details
          const elements = effectData.elements || ['ember'];
          const affinityType = effectData.affinityType || 'damage_bonus';
          const bonusAmount = effectData.bonusAmount || 2;

          if (affinityType === 'damage_bonus') {
            mechanicsParts.push(`+${bonusAmount} ${elements.join('/')} damage`);
          } else if (affinityType === 'resistance') {
            mechanicsParts.push(`Resist ${bonusAmount} ${elements.join('/')} damage`);
          } else if (affinityType === 'spell_power') {
            mechanicsParts.push(`+${bonusAmount} ${elements.join('/')} spell power`);
          }

        } else if (effectData.id === 'flying' || effectData.id === 'flight') {
          // Flight configuration details (enhanced from existing)
          const flightSpeed = effectData.flightSpeed || 30;
          const flightType = effectData.flightType || 'magical';
          const maneuverability = effectData.maneuverability || 'average';

          mechanicsParts.push(`${flightSpeed} ft flight speed`);
          mechanicsParts.push(`${flightType} flight`);
          if (maneuverability !== 'average') {
            mechanicsParts.push(`${maneuverability} maneuverability`);
          }

          // Add altitude limits
          if (effectData.maxAltitude) {
            mechanicsParts.push(`max altitude ${effectData.maxAltitude} ft`);
          }

          // Add hover capability
          if (effectData.canHover) {
            mechanicsParts.push('can hover');
          }

        } else if (effectData.id === 'energized' || effectData.id === 'energy_boost') {
          // Energized configuration details (enhanced from existing)
          if (effectData.bonusActionPoints) {
            mechanicsParts.push(`+${effectData.bonusActionPoints} action points`);
          }
          if (effectData.actionPointRegeneration) {
            mechanicsParts.push(`+${effectData.actionPointRegeneration} AP regen per turn`);
          }
          if (effectData.costReduction) {
            mechanicsParts.push(`-${effectData.costReduction} AP cost for abilities`);
          }
          if (effectData.spellCostReduction) {
            mechanicsParts.push(`-${effectData.spellCostReduction} mana cost for spells`);
          }
        }

        // Add duration information with enhanced formatting (only if effect has specific duration)
        if (effectData.durationType) {
          if (effectData.durationType === 'until_used') {
            mechanicsParts.push('Until used');
          } else if (effectData.durationType === 'permanent') {
            mechanicsParts.push('Permanent');
          } else if (effectData.durationType === 'rest') {
            const restType = effectData.restType || 'long';
            mechanicsParts.push(`Until ${restType.charAt(0).toUpperCase() + restType.slice(1)} Rest`);
          } else if (effectData.durationType === 'time' && effectData.durationValue && effectData.durationUnit) {
            const unit = effectData.durationUnit === 'minutes' ? 'min' :
                        effectData.durationUnit === 'seconds' ? 'sec' :
                        effectData.durationUnit;
            mechanicsParts.push(`${effectData.durationValue} ${unit}`);
          } else if (effectData.durationValue) {
            const unit = effectData.durationType === 'minutes' ? 'min' : effectData.durationType;
            mechanicsParts.push(`${effectData.durationValue} ${unit}`);
          }
        }
        // Note: Removed automatic fallback to buffConfig duration to prevent unwanted duration text

        // Add common configuration details that apply to many effects

        // Add saving throw information
        if (effectData.saveType && effectData.saveType !== 'none') {
          const saveTypeMap = {
            'strength': 'Strength',
            'agility': 'Agility',
            'constitution': 'Constitution',
            'intelligence': 'Intelligence',
            'spirit': 'Spirit',
            'charisma': 'Charisma'
          };
          const saveType = saveTypeMap[effectData.saveType] || effectData.saveType;
          let saveText = `${saveType} save`;

          if (effectData.difficultyClass || effectData.saveDC) {
            const dc = effectData.difficultyClass || effectData.saveDC;
            saveText += ` DC ${dc}`;
          }

          if (effectData.saveOutcome) {
            const outcomeMap = {
              'negates': 'negate',
              'halves_effects': 'halves',
              'halves': 'halves'
            };
            saveText += ` (${outcomeMap[effectData.saveOutcome] || effectData.saveOutcome})`;
          }

          mechanicsParts.push(saveText);
        }

        // Add dispel information
        if (effectData.canBeDispelled === false) {
          mechanicsParts.push('cannot be dispelled');
        }

        // Add concentration requirement if applicable
        if (effectData.concentrationRequired || buffConfig.concentrationRequired) {
          mechanicsParts.push('(Concentration)');
        }

        // Enhanced fallback for any status effects that might not be specifically handled
        if (mechanicsParts.length === 0) {
          // Try to extract meaningful information from common configuration fields
          if (effectData.option) {
            const formattedOption = effectData.option.charAt(0).toUpperCase() + effectData.option.slice(1).replace(/_/g, ' ');
            mechanicsParts.push(formattedOption);
          }

          if (effectData.bonus && typeof effectData.bonus === 'number') {
            mechanicsParts.push(`+${effectData.bonus} bonus`);
          }

          if (effectData.percentage && typeof effectData.percentage === 'number') {
            mechanicsParts.push(`${effectData.percentage}% effect`);
          }

          if (effectData.amount && typeof effectData.amount === 'number') {
            mechanicsParts.push(`${effectData.amount} points`);
          }

          if (effectData.dice) {
            mechanicsParts.push(`${effectData.dice} dice`);
          }

          if (effectData.damageType) {
            mechanicsParts.push(`${effectData.damageType} damage`);
          }

          if (effectData.range && typeof effectData.range === 'number') {
            mechanicsParts.push(`${effectData.range} ft range`);
          }

          if (effectData.radius && typeof effectData.radius === 'number') {
            mechanicsParts.push(`${effectData.radius} ft radius`);
          }

          // If still no mechanics text, use a generic description
          if (mechanicsParts.length === 0) {
            mechanicsParts.push('Status effect active');
          }
        }

        mechanicsText = mechanicsParts.join(', ');

        // Create configuration-specific descriptions for certain effects
        let effectDescription = effectData.description || '';

        if (effectData.id === 'lifelink' && effectData.option) {
          // Provide specific descriptions based on lifelink type
          const descriptionMap = {
            'hp_to_hp': 'Establishes a health link between caster and target, sharing damage and healing',
            'mana_to_mana': 'Creates a mana link that allows sharing magical energy between entities',
            'hp_to_mana': 'Converts the caster\'s life force into magical energy for the target',
            'mana_to_hp': 'Transforms the caster\'s mana into healing energy for the target',
            'damage_to_healing': 'Converts damage dealt by the caster into healing for the target',
            'healing_to_damage': 'Transforms healing done by the caster into bonus damage output'
          };
          effectDescription = descriptionMap[effectData.option] || effectDescription;
        }

        effects.push({
          name: effectName,
          description: effectDescription,
          mechanicsText: mechanicsText,
          class: 'status-effect'
        });
      });
    }

    // Handle buffConfig.buffs array (used by enhanced spell library spells)
    if (buffConfig.buffs && buffConfig.buffs.length > 0) {
      buffConfig.buffs.forEach(buff => {
        // Use customName from buffConfig if buff doesn't have its own name
        const buffName = buff.name || buffConfig?.customName || 'Buff Effect';
        const buffDescription = buff.description || '';
        let mechanicsText = '';
        const mechanicsParts = [];

        // Handle stat modifiers within the buff
        if (buff.effects && buff.effects.statModifiers) {
          Object.entries(buff.effects.statModifiers).forEach(([stat, value]) => {
            const sign = value >= 0 ? '+' : '';
            mechanicsParts.push(`${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${sign}${value}`);
          });
        }

        // Handle special effects
        if (buff.effects) {
          if (buff.effects.temporaryHitPoints) {
            mechanicsParts.push(`+${buff.effects.temporaryHitPoints} temporary hit points`);
          }
          if (buff.effects.damageReduction) {
            mechanicsParts.push(`${buff.effects.damageReduction} damage reduction`);
          }
          if (buff.effects.attackBonus) {
            mechanicsParts.push(`+${buff.effects.attackBonus} attack bonus`);
          }
          if (buff.effects.damageBonus) {
            mechanicsParts.push(`+${buff.effects.damageBonus} damage`);
          }
          if (buff.effects.fearImmunity) {
            mechanicsParts.push('Immune to fear');
          }
          if (buff.effects.redirectAttack) {
            mechanicsParts.push('Redirects attacks to self');
          }
          if (buff.effects.radiantDamage) {
            mechanicsParts.push('Attacks deal radiant damage');
          }
          if (buff.effects.spellPowerBonus) {
            mechanicsParts.push(`Spell Power: +${buff.effects.spellPowerBonus}`);
          }
          if (buff.effects.initiativeBonus) {
            mechanicsParts.push(`Initiative: +${buff.effects.initiativeBonus}`);
          }
          if (buff.effects.surpriseImmunity) {
            mechanicsParts.push('Immune to surprise');
          }
          if (buff.effects.perceptionBonus) {
            mechanicsParts.push(`Perception: +${buff.effects.perceptionBonus}`);
          }
          if (buff.effects.insightBonus) {
            mechanicsParts.push(`Insight: +${buff.effects.insightBonus}`);
          }
          if (buff.effects.advantage && Array.isArray(buff.effects.advantage)) {
            mechanicsParts.push(`Advantage on ${buff.effects.advantage.join(', ')} checks`);
          }
        }

        mechanicsText = mechanicsParts.join(', ');

        effects.push({
          name: buffName,
          description: buffDescription,
          mechanicsText: mechanicsText
        });
      });
    }

    return effects.length > 0 ? effects : null;
  };







  const formatPurificationEffects = () => {
    if (!spell?.purificationConfig) return null;

    const { purificationConfig } = spell;
    const activeEffects = purificationConfig.selectedEffects || purificationConfig.effects;
    const effects = [];

    // Handle different purification types
    if (purificationConfig.purificationType === 'dispel') {
      // Format dispel effects - only show if there are selected effects
      if (activeEffects && activeEffects.length > 0) {
        // Filter effects to only show those that match the current purification type
        const dispelEffects = activeEffects.filter(effect =>
          !effect.purificationType || effect.purificationType === 'dispel'
        );

        dispelEffects.forEach(effect => {
          const effectName = effect.name || 'Unknown Effect';
          let effectDescription = effect.description || '';

          // Add specific effect types if available
          if (effect.specificEffectTypes && effect.specificEffectTypes.length > 0) {
            const specificTypes = effect.specificEffectTypes.join(', ');
            effectDescription += effectDescription ? ` (${specificTypes})` : `Targets: ${specificTypes}`;
          }

          // Add custom effects count if specified
          let mechanicsText = '';
          if (effect.customEffects && effect.customEffects > 1) {
            mechanicsText = `Removes up to ${effect.customEffects} effects`;
          }

          effects.push({
            name: effectName,
            description: effectDescription,
            mechanicsText: mechanicsText
          });
        });
      }
    } else if (purificationConfig.purificationType === 'cleanse') {
      // Format cleanse effects - only show if there are selected effects
      if (activeEffects && activeEffects.length > 0) {
        // Filter effects to only show those that match the current purification type
        const cleanseEffects = activeEffects.filter(effect =>
          !effect.purificationType || effect.purificationType === 'cleanse'
        );

        cleanseEffects.forEach(effect => {
          const effectName = effect.name || 'Unknown Effect';
          let effectDescription = effect.description || '';

          // Add specific effect types if available
          if (effect.specificEffectTypes && effect.specificEffectTypes.length > 0) {
            const specificTypes = effect.specificEffectTypes.join(', ');
            effectDescription += effectDescription ? ` (${specificTypes})` : `Targets: ${specificTypes}`;
          }

          // Add custom effects count if specified
          let mechanicsText = '';
          if (effect.customEffects && effect.customEffects > 1) {
            mechanicsText = `Removes up to ${effect.customEffects} effects`;
          }

          effects.push({
            name: effectName,
            description: effectDescription,
            mechanicsText: mechanicsText
          });
        });
      } else {
        // Show default cleanse effect if no specific effects are selected
        effects.push({
          name: 'Cleanse',
          description: 'Remove physical effects like poison, disease, or bleeds',
          mechanicsText: 'Removes harmful physical effects'
        });
      }
    } else if (purificationConfig.purificationType === 'resurrection') {
      // Format resurrection effects
      if (activeEffects && activeEffects.length > 0) {
        // Filter effects to only show those that match the current purification type
        const resurrectionEffects = activeEffects.filter(effect =>
          !effect.purificationType || effect.purificationType === 'resurrection'
        );

        resurrectionEffects.forEach(effect => {
          const resolution = effect.resolution || purificationConfig.resolution || 'DICE';
          const formula = effect.resurrectionFormula || purificationConfig.resurrectionFormula || '2d8 + SPI';

          let resolutionText = '';
          switch (resolution) {
            case 'CARDS':
              resolutionText = 'Draw cards';
              break;
            case 'COINS':
              resolutionText = 'Flip coins';
              break;
            case 'DICE':
            default:
              resolutionText = 'Roll dice';
              break;
          }

          effects.push({
            name: effect.name || 'Resurrection',
            description: resolutionText,
            mechanicsText: `${cleanFormula(formula)} health restored`
          });
        });
      } else {
        // Show default resurrection effect if no specific effects are selected
        const resolution = purificationConfig.resolution || 'DICE';
        const formula = purificationConfig.resurrectionFormula || '2d8 + SPI';

        let resolutionText = '';
        switch (resolution) {
          case 'CARDS':
            resolutionText = 'Draw cards';
            break;
          case 'COINS':
            resolutionText = 'Flip coins';
            break;
          case 'DICE':
          default:
            resolutionText = 'Roll dice';
            break;
        }

        effects.push({
          name: 'Resurrection',
          description: resolutionText,
          mechanicsText: `${cleanFormula(formula)} health restored`
        });
      }
    } else {
      // Handle any other purification types or general purification effects
      if (activeEffects && activeEffects.length > 0) {
        activeEffects.forEach(effect => {
          const effectName = effect.name || 'Unknown Effect';
          let effectDescription = effect.description || '';

          // Add specific effect types if available
          if (effect.specificEffectTypes && effect.specificEffectTypes.length > 0) {
            const specificTypes = effect.specificEffectTypes.join(', ');
            effectDescription += effectDescription ? ` (${specificTypes})` : `Targets: ${specificTypes}`;
          }

          // Add custom effects count if specified
          let mechanicsText = '';
          if (effect.customEffects && effect.customEffects > 1) {
            mechanicsText = `Removes up to ${effect.customEffects} effects`;
          }

          effects.push({
            name: effectName,
            description: effectDescription,
            mechanicsText: mechanicsText
          });
        });
      } else {
        // Show default purification effect if no specific type or effects are selected
        const purificationType = purificationConfig.purificationType || 'purification';
        const typeName = purificationType.charAt(0).toUpperCase() + purificationType.slice(1);

        effects.push({
          name: typeName,
          description: 'Remove harmful effects from targets',
          mechanicsText: 'Removes negative effects'
        });
      }
    }

    return effects.length > 0 ? effects : null;
  };
  const formatDebuffEffects = () => {
    if (!spell?.debuffConfig) return null;

    const { debuffConfig } = spell;
    const effects = [];

    // Format stat modifiers with special handling for resistance and absorption
    if (debuffConfig.statPenalties && debuffConfig.statPenalties.length > 0) {
      const regularStats = [];
      const resistanceStats = [];
      const absorptionStats = [];

      debuffConfig.statPenalties.forEach(stat => {
        // Check if this is a resistance stat with special scaling - be more comprehensive
        const statName = (stat.name || stat.id || '').toLowerCase();
        const isResistanceStat = stat.category === 'resistance' ||
                                statName.includes('resistance') ||
                                statName.includes('resist') ||
                                statName.includes('wyrd') ||
                                statName.includes('ember') ||
                                statName.includes('rime') ||
                                statName.includes('rime') ||
                                statName.includes('storm') ||
                                statName.includes('arcane') ||
                                statName.includes('nature') ||
                                statName.includes('blight') ||
                                statName.includes('blight') ||
                                statName.includes('ember') ||
                                statName.includes('chaos') ||
                                statName.includes('blight') ||
                                statName.includes('arcane') ||
                                statName.includes('physical') ||
                                statName.includes('physical') ||
                                statName.includes('physical') ||
                                statName.includes('physical');

        const isAbsorptionStat = statName.includes('absorption');

        let statDisplay = {
          name: stat.name || 'Stat Penalty',
          value: '',
          class: ''
        };

        if (typeof stat.magnitude === 'string') {
          // It's a dice formula - could be absorption or regular stat
          if (isAbsorptionStat) {
            const damageType = stat.name.toLowerCase().replace(/\s*absorption\s*/, '').trim();
            const typeText = damageType && damageType !== 'damage' && damageType !== 'all damage' ? ` ${damageType}` : '';
            statDisplay.value = `Weakens${typeText} absorption barriers, reducing protection by ${stat.magnitude} per impact`;
            statDisplay.class = 'absorption-formula';
          } else {
            statDisplay.value = stat.magnitude;
            statDisplay.class = 'formula';
          }
        } else if (isAbsorptionStat) {
          // Handle flat absorption reduction
          const damageType = stat.name.toLowerCase().replace(/\s*absorption\s*/, '').trim();
          const typeText = damageType && damageType !== 'damage' && damageType !== 'all damage' ? ` ${damageType}` : '';
          statDisplay.value = `Shatters${typeText} absorption barriers, permanently reducing protection by ${Math.abs(stat.magnitude)} points`;
          statDisplay.class = 'absorption-flat';
        } else if (isResistanceStat) {
          // Handle resistance values with thematic descriptions
          const percentage = Math.round(parseFloat(stat.magnitude) || 0);
          const damageType = extractDamageTypeFromResistanceName(stat.name || stat.id);
          if (percentage === -200) {
            statDisplay.value = getThematicResistanceDescription('vampiric', damageType);
            statDisplay.class = 'vampiric';
          } else if (percentage === -100) {
            statDisplay.value = getThematicResistanceDescription('absorbing', damageType);
            statDisplay.class = 'absorbing';
          } else if (percentage === -50) {
            statDisplay.value = getThematicResistanceDescription('draining', damageType);
            statDisplay.class = 'draining';
          } else if (percentage === -25) {
            statDisplay.value = getThematicResistanceDescription('siphoning', damageType);
            statDisplay.class = 'siphoning';
          } else if (percentage === 0) {
            statDisplay.value = getThematicResistanceDescription('immune', damageType);
            statDisplay.class = 'immune';
          } else if (percentage === 25) {
            statDisplay.value = getThematicResistanceDescription('slight_reduction', damageType);
            statDisplay.class = 'slight_reduction';
          } else if (percentage === 50) {
            statDisplay.value = getThematicResistanceDescription('resistant', damageType);
            statDisplay.class = 'resistant';
          } else if (percentage === 75) {
            statDisplay.value = getThematicResistanceDescription('guarded', damageType);
            statDisplay.class = 'guarded';
          } else if (percentage === 100) {
            statDisplay.value = getThematicResistanceDescription('nullified', damageType);
            statDisplay.class = 'nullified';
          } else if (percentage === 125) {
            statDisplay.value = getThematicResistanceDescription('susceptible', damageType);
            statDisplay.class = 'susceptible';
          } else if (percentage === 150) {
            statDisplay.value = getThematicResistanceDescription('exposed', damageType);
            statDisplay.class = 'exposed';
          } else if (percentage === 200) {
            statDisplay.value = getThematicResistanceDescription('vulnerable', damageType);
            statDisplay.class = 'vulnerable';
          } else {
            // Create thematic description for any other percentage values
            if (percentage > 0) {
              // Positive resistance values - create thematic descriptions
              if (percentage < 25) {
                statDisplay.value = `Minor ${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Protection`;
              } else if (percentage < 50) {
                statDisplay.value = `Moderate ${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Resistance`;
              } else if (percentage < 75) {
                statDisplay.value = `Strong ${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Defense`;
              } else if (percentage < 100) {
                statDisplay.value = `Major ${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Guard`;
              } else {
                statDisplay.value = `Overwhelming ${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Immunity`;
              }
            } else {
              // Negative resistance values (vulnerabilities)
              statDisplay.value = `${damageType === 'storm' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Vulnerability`;
            }
            statDisplay.class = 'thematic-resistance';
          }
        } else {
          // Standard number or percentage display
          const magnitude = stat.magnitude || 0;
          const advDis = getAdvantageDisadvantageText(stat.stat || stat.name || stat.id, magnitude, stat.magnitudeType);
          if (advDis.isAdvDis) {
            statDisplay.name = advDis.type === 'advantage' ? 'Advantage' : 'Disadvantage';
            statDisplay.value = `on ${mapStatKeyToLabel(stat.stat || stat.name || stat.id)}`;
            statDisplay.class = advDis.type === 'advantage' ? 'positive' : 'negative';
          } else {
            const sign = magnitude >= 0 ? '+' : '';
            const displayValue = stat.magnitudeType === 'percentage'
              ? `${sign}${magnitude}%`
              : `${sign}${magnitude}`;
            statDisplay.value = displayValue;
            statDisplay.class = 'regular';
          }
        }

        // Group stats by type
        if (isResistanceStat) {
          resistanceStats.push(statDisplay);
        } else if (isAbsorptionStat) {
          absorptionStats.push(statDisplay);
        } else {
          regularStats.push(statDisplay);
        }
      });

      // Add grouped stat effects
      if (regularStats.length > 0) {
        effects.push({
          name: 'Stat Penalties',
          description: '',
          mechanicsText: regularStats.map(stat => stat.value ? (stat.value.startsWith('on ') ? `${stat.name} ${stat.value}` : `${stat.name}: ${stat.value}`) : stat.name).join(', '),
          type: 'stats',
          data: regularStats
        });
      }

      if (resistanceStats.length > 0) {
        effects.push({
          name: 'Resistance Penalties',
          description: '',
          mechanicsText: '',
          type: 'resistance',
          data: resistanceStats
        });
      }

      if (absorptionStats.length > 0) {
        effects.push({
          name: 'Absorption Penalties',
          description: '',
          mechanicsText: absorptionStats.map(stat => stat.value).join(', '),
          type: 'absorption',
          data: absorptionStats
        });
      }
    }

    // Helper function to get default save type for status effects
    const getDefaultSaveType = (effectId) => {
      const defaultSaves = {
        'charmed': 'spirit',
        'frightened': 'spirit',
        'fear': 'spirit',

        'blinded': 'constitution',
        'blind': 'constitution',
        'paralyzed': 'constitution',
        'poisoned': 'constitution',
        'restrained': 'strength',
        'silenced': 'constitution',

        'weakened': 'constitution',
        'confused': 'spirit',
        'diseased': 'constitution',
        'bleeding': 'constitution',
        'cursed': 'spirit'
      };
      return defaultSaves[effectId] || 'constitution';
    };

    // Format status effects with enhanced configuration display
    if (debuffConfig?.statusEffects && debuffConfig.statusEffects.length > 0) {
      debuffConfig.statusEffects.forEach(effect => {
        // Handle both string IDs and full effect objects
        let displayName, effectData;

        if (typeof effect === 'string') {
          displayName = effect;
          effectData = {};
        } else {
          displayName = effect.name || effect.id || effect;
          effectData = effect;
        }

        // Ensure displayName is a string before calling charAt
        if (displayName && typeof displayName === 'string') {
          displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
        } else {
          displayName = 'Unknown Effect';
        }

        // Initialize description and mechanicsText variables
        let description = '';
        let mechanicsText = '';
        const mechanicsParts = [];

        // Add level information if it's not 'moderate' (default)
        if (effectData.level && effectData.level !== 'moderate' && effectData.level !== 'medium') {
          const levelMap = {
            'minor': 'Minor',
            'major': 'Major',
            'severe': 'Severe',
            'extreme': 'Extreme'
          };
          const levelDisplay = levelMap[effectData.level] || effectData.level;
          if (levelDisplay) {
            displayName = `${levelDisplay} ${displayName}`;
          }
        }

        // Add configuration-specific details
        if (effectData.option) {
          const optionName = effectData.option.charAt(0).toUpperCase() + effectData.option.slice(1);
          displayName += ` (${optionName})`;
        }

        // Enhanced formatting for specific debuff effects
        if (effectData.id === 'charmed' || effectData.id === 'charm') {
          const charmType = effectData.charmType || effectData.option || 'friendly';
          const charmDescriptions = {
            'friendly': 'sees the caster as a friend but keeps free will',
            'dominated': 'must obey commands without question',
            'infatuated': 'is devoted and will protect the caster at any cost'
          };

          description = `${displayName} — target ${charmDescriptions[charmType] || 'is charmed'}`;

          // Add restrictions based on configuration
          const restrictions = [];
          if (effectData.canAttackCharmer === false) {
            restrictions.push('cannot attack charmer');
          }
          if (effectData.canSelfHarm === false) {
            restrictions.push('cannot be commanded to self-harm');
          }
          if (effectData.retainsMemory === true) {
            restrictions.push('retains memory of actions');
          }

          if (restrictions.length > 0) {
            description += ` (${restrictions.join(', ')})`;
          }

        } else if (effectData.id === 'blinded' || effectData.id === 'blind') {
          if (effectData.blindType || effectData.option) {
            const blindType = effectData.blindType || effectData.option;
            const typeMap = {
              'partial': 'Partially blind — limited vision, disadvantage on perception and ranged attacks',
              'complete': 'Totally blind — can\'t see at all, auto-fails sight checks',
              'flash': 'Flash-blinded — temporary blindness that fades quickly'
            };
            description = typeMap[blindType] || `${displayName} — can't see and has disadvantage on attacks`;
          } else {
            description = `${displayName} — can't see and has disadvantage on attacks`;
          }

        } else if (effectData.id === 'paralyzed' || effectData.id === 'paralyze') {
          if (effectData.option) {
            const typeMap = {
              'partial': 'Partially paralyzed — some limbs affected, reduced movement',
              'complete': 'Completely paralyzed — can\'t move or act, attacks against them have advantage',
              'magical': 'Magically paralyzed — held in place by supernatural forces, aware but helpless'
            };
            description = typeMap[effectData.option] || `${displayName} — can't move or act`;
          } else {
            description = `${displayName} — can't move or act`;
          }

        } else if (effectData.id === 'frightened' || effectData.id === 'fear') {
          if (effectData.option) {
            const typeMap = {
              'shaken': 'Shaken — on edge, disadvantage on checks while the scary thing is visible',
              'terrified': 'Terrified — absolutely refuses to go near the source of fear',
              'panicked': 'Panicked — using all their actions to run away from the fear'
            };
            description = typeMap[effectData.option] || `${displayName} — overcome with dread`;
          } else {
            description = `${displayName} — overcome with dread`;
          }

        } else {
          // General status effect formatting
          description = displayName;
        }

        // Add comprehensive effect mechanics based on configuration
        if (effectData.id === 'silenced') {
          if (effectData.silenceRadius && effectData.silenceRadius > 0) {
            mechanicsParts.push(`${effectData.silenceRadius}ft radius`);
          }
          if (effectData.affectsVerbalSpells) {
            mechanicsParts.push('Blocks verbal spells');
          }
          if (effectData.affectsSomatic) {
            mechanicsParts.push('Blocks somatic components');
          }

        } else if (effectData.id === 'poisoned') {
          const poisonType = effectData.option || 'standard';
          if (poisonType === 'lethal') {
            mechanicsParts.push('Lethal poison - ongoing damage');
          } else if (poisonType === 'paralytic') {
            mechanicsParts.push('Paralytic poison - movement impaired');
          } else if (poisonType === 'hallucinogenic') {
            mechanicsParts.push('Hallucinogenic poison - perception altered');
          }

          if (effectData.diceCount && effectData.diceType) {
            mechanicsParts.push(`${effectData.diceCount}${effectData.diceType} damage per round`);
          }

        } else if (effectData.id === 'bleeding') {
          const bleedType = effectData.option || 'minor';
          if (bleedType === 'minor') {
            mechanicsParts.push('Minor wound - light bleeding');
          } else if (bleedType === 'severe') {
            mechanicsParts.push('Severe wound - heavy bleeding');
          } else if (bleedType === 'hemorrhaging') {
            mechanicsParts.push('Hemorrhaging - critical blood loss');
          }

          if (effectData.diceCount && effectData.diceType) {
            mechanicsParts.push(`${effectData.diceCount}${effectData.diceType} damage per round`);
          }

        } else if (effectData.id === 'cursed') {
          const curseType = effectData.option || 'general';
          if (curseType === 'weakness') {
            mechanicsParts.push('Curse of Weakness - reduced physical capabilities');
          } else if (curseType === 'misfortune') {
            mechanicsParts.push('Curse of Misfortune - disadvantage on rolls');
          } else if (curseType === 'vulnerability') {
            mechanicsParts.push('Curse of Vulnerability - increased damage taken');
          }

        } else if (effectData.id === 'diseased') {
          const diseaseType = effectData.option || 'wasting';
          if (diseaseType === 'wasting') {
            mechanicsParts.push('Wasting disease - gradual stat reduction');
          } else if (diseaseType === 'fever') {
            mechanicsParts.push('Fever - constitution penalties');
          } else if (diseaseType === 'plague') {
            mechanicsParts.push('Plague - contagious and debilitating');
          }

        } else if (effectData.id === 'stunned' || effectData.id === 'stun') {
          const stunType = effectData.option || 'physical';
          if (stunType === 'physical') {
            mechanicsParts.push('Physical stun - cannot act or move');
          } else if (stunType === 'mental') {
            mechanicsParts.push('Mental stun - mind overwhelmed');
          } else if (stunType === 'magical') {
            mechanicsParts.push('Magical stun - held by arcane forces');
          }

        } else if (effectData.id === 'confused') {
          const confusionType = effectData.option || 'random';
          if (confusionType === 'random') {
            mechanicsParts.push('Random actions - roll for behavior');
          } else if (confusionType === 'dazed') {
            mechanicsParts.push('Dazed - reduced actions available');
          } else if (confusionType === 'disoriented') {
            mechanicsParts.push('Disoriented - cannot distinguish friend from foe');
          }

        } else if (effectData.id === 'weakened') {
          const weaknessType = effectData.option || 'physical';
          if (weaknessType === 'physical') {
            mechanicsParts.push('Physical weakness - reduced strength and constitution');
          } else if (weaknessType === 'mental') {
            mechanicsParts.push('Mental weakness - reduced intelligence and spirit');
          } else if (weaknessType === 'magical') {
            mechanicsParts.push('Magical weakness - reduced spell effectiveness');
          }
        }

        // Add save information for any status effect with save configuration
        const saveDC = effectData.saveDC || debuffConfig.difficultyClass || 15;
        const saveType = effectData.saveType || getDefaultSaveType(effectData.id || effect);

        if (saveType && saveType !== 'none') {
          const outcomeText = effectData.saveOutcome === 'negates' ? 'to shake it off' :
                              effectData.saveOutcome === 'ends_early' ? 'ends next turn on success' :
                              effectData.saveOutcome === 'reduces_level' ? 'to reduce severity' :
                              `(${effectData.saveOutcome})`;
          mechanicsParts.push(`${normalizeSaveType(saveType)} DC ${saveDC} ${outcomeText}`);

          // Add save frequency information
          if (effectData.saveFrequency && effectData.saveFrequency !== 'initial') {
            const frequencyMap = {
              'end_of_turn': 'can retry each turn',
              'when_damaged': 'can retry when hit',
              'out_of_sight': 'can retry when out of sight',
              'ally_help': 'can retry when an ally helps',
              'special_trigger': 'retries on special trigger'
            };
            mechanicsParts.push(frequencyMap[effectData.saveFrequency] || 'repeated saves allowed');
          }
        }

        // Add enhanced duration information
        if (effectData.durationType) {
          if (effectData.durationType === 'permanent') {
            mechanicsParts.push('Permanent');
          } else if (effectData.durationType === 'until_dispelled') {
            mechanicsParts.push('Until dispelled');
          } else if (effectData.durationType === 'until_used') {
            mechanicsParts.push('Until used');
          } else if (effectData.durationType === 'rest') {
            const restType = effectData.restType || 'long';
            mechanicsParts.push(`Until ${restType.charAt(0).toUpperCase() + restType.slice(1)} Rest`);
          } else if (effectData.durationType === 'time' && effectData.durationValue && effectData.durationUnit) {
            const unit = effectData.durationUnit === 'minutes' ? 'min' :
                        effectData.durationUnit === 'seconds' ? 'sec' :
                        effectData.durationUnit;
            mechanicsParts.push(`${effectData.durationValue} ${unit}`);
          } else if (effectData.durationValue) {
            const unit = effectData.durationType === 'minutes' ? 'min' : effectData.durationType;
            mechanicsParts.push(`${effectData.durationValue} ${unit}`);
          }
        } else if (debuffConfig.durationType && debuffConfig.durationValue) {
          if (debuffConfig.durationType === 'permanent') {
            mechanicsParts.push('Permanent');
          } else if (debuffConfig.durationType === 'rest') {
            const restType = debuffConfig.restType || 'long';
            mechanicsParts.push(`Until ${restType} rest`);
          } else if (debuffConfig.durationType === 'time' && debuffConfig.durationUnit) {
            const unit = debuffConfig.durationUnit === 'minutes' ? 'min' :
                        debuffConfig.durationUnit === 'seconds' ? 'sec' :
                        debuffConfig.durationUnit;
            mechanicsParts.push(`${debuffConfig.durationValue} ${unit}`);
          } else {
            const unit = debuffConfig.durationType === 'minutes' ? 'min' : debuffConfig.durationType;
            mechanicsParts.push(`${debuffConfig.durationValue} ${unit}`);
          }
        }

        if (effectData.concentrationRequired || debuffConfig.concentrationRequired) {
          mechanicsParts.push('requires concentration');
        }

        // Add specific effect mechanics
        if (effectData.magnitude) {
          mechanicsParts.push(`Magnitude: ${effectData.magnitude}`);
        }

        if (effectData.diceCount && effectData.diceType) {
          mechanicsParts.push(`${effectData.diceCount}${effectData.diceType} per round`);
        }

        // Enhanced fallback for any debuff status effects that might not be specifically handled
        if (mechanicsParts.length === 0) {
          // Try to extract meaningful information from common configuration fields
          if (effectData.option && !description.includes(effectData.option)) {
            const formattedOption = effectData.option.charAt(0).toUpperCase() + effectData.option.slice(1).replace(/_/g, ' ');
            mechanicsParts.push(formattedOption);
          }

          if (effectData.penalty && typeof effectData.penalty === 'number') {
            mechanicsParts.push(`-${effectData.penalty} penalty`);
          }

          if (effectData.percentage && typeof effectData.percentage === 'number') {
            mechanicsParts.push(`${effectData.percentage}% reduction`);
          }

          if (effectData.amount && typeof effectData.amount === 'number') {
            mechanicsParts.push(`${effectData.amount} points damage`);
          }

          if (effectData.dice) {
            mechanicsParts.push(`${effectData.dice} damage per round`);
          }

          if (effectData.damageType) {
            mechanicsParts.push(`${effectData.damageType} damage`);
          }

          if (effectData.range && typeof effectData.range === 'number') {
            mechanicsParts.push(`${effectData.range} ft range`);
          }

          if (effectData.radius && typeof effectData.radius === 'number') {
            mechanicsParts.push(`${effectData.radius} ft radius`);
          }

          // If still no mechanics text, use a generic description
          if (mechanicsParts.length === 0) {
            mechanicsParts.push('Debuff effect active');
          }
        }

        mechanicsText = mechanicsParts.join(', ');

        // Add the status effect to the effects array
        effects.push({
          name: displayName,
          description: description,
          mechanicsText: mechanicsText,
          class: 'status-effect'
        });
      });
    }

    // Add saving throw information only if not already included in effect descriptions
    const hasSaveInDescription = effects.some(effect =>
      effect.description && (
        effect.description.includes('save DC') ||
        effect.description.includes('save DC') ||
        effect.description.includes('saving throw')
      )
    );

    const hasSavingThrow = debuffConfig.savingThrow && (
      typeof debuffConfig.savingThrow === 'object' ||
      debuffConfig.difficultyClass
    );

    if (!hasSaveInDescription && hasSavingThrow) {
      const saveInfo = formatSavingThrow(debuffConfig, 'debuff');
      if (saveInfo) {
        effects.push({
          name: 'Saving Throw',
          description: `${saveInfo.saveType} save DC ${saveInfo.dc}`,
          mechanicsText: saveInfo.outcome
        });
      }
    }

    // Add dispellable information for permanent effects
    if (debuffConfig.durationType === 'permanent') {
      if (debuffConfig.canBeDispelled === false) {
        effects.push({
          name: 'Dispel Resistance',
          description: 'Cannot be dispelled',
          mechanicsText: ''
        });
      } else if (debuffConfig.canBeDispelled === true) {
        effects.push({
          name: 'Dispellable',
          description: 'Can be dispelled',
          mechanicsText: ''
        });
      }
    }

    return effects.length > 0 ? effects : null;
  };

  // ===== EVENT HANDLERS =====


  return {
    formatStatusEffectDetails,
    formatBuffEffects,
    formatPurificationEffects,
    formatDebuffEffects,
  };
};

export default useStatusEffectFormatters;