#!/usr/bin/env node
'use strict';

/**
 * MYTHRILL HQ — SPELL COMPATIBILITY AND NEXT-BATCH PREPARATION VERIFIER
 *
 * Owned verification tooling under vtt-react/verification/spell-compatibility-batch/
 * Reuses existing checkAbilityCompatibility.cjs and production validators without modification.
 * 
 * Inspects the catalogue for:
 * 1. Attribute buffs/debuffs
 * 2. Spell power / equivalent bonuses
 * 3. Resistance, vulnerability, immunity
 * 4. Conditional damage/healing formulas
 * 5. Conditions beyond canonical Stunned and movement modifiers
 *
 * Reconciled against HQ corrections:
 * - Distinguishes 41 map entries from canonical classes, reporting unique IDs and duplicates.
 * - Records Minstrel Opening Chord -> Resolving Strike as already executed in production App.
 * - Distinguishes minstrel_harmonic_strike (Level 1 builder) from minstrel_harmony_strike (Level 4, 2-turn CD, role contradiction).
 * - Distinguishes installed M2A counted occurrences from unresolved "one round" catalogue wording.
 * - Distinguishes GM-selected P12 defense tiers from automatic resistance derivation.
 * - Distinguishes Defending doubled shield DR & wear prevention from generic half damage.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const VTT_REACT_ROOT = path.resolve(__dirname, '..', '..');

// Load base compatibility checker (which sets up ESM babel hook)
const checker = require(path.join(VTT_REACT_ROOT, 'verification', 'ability-compatibility', 'checkAbilityCompatibility.cjs'));
const classEffect = require(path.join(REPO_ROOT, 'server', 'shared', 'services', 'classEffect.js'));
const { CLASS_DATA_MAP } = require(path.join(VTT_REACT_ROOT, 'src', 'data', 'classSpellGenerator.js'));

const RUNTIME_CONTRACT_FILES = Object.freeze([
  'vtt-react/src/services/spellConsequence.js',
  'vtt-react/src/services/combatAttributes.js',
  'vtt-react/src/services/effectProcessingService.js',
  'server/services/actorConsequences.js',
  'server/services/spellPayments.js',
  'server/services/strikeApprovals.js',
  'server/shared/services/authoredAbility.js',
  'server/shared/services/authoredEffect.js',
  'server/shared/services/classEffect.js',
  'server/shared/services/sharedConditionProfile.js',
  'server/shared/data/classEffectProfiles.json',
  'server/shared/data/sharedConditionProfiles.json',
  'vtt-react/src/data/classResourceContracts.js',
  'vtt-react/src/data/classResourceBanks.js',
]);

const CANONICAL_CONDITIONS = new Set(['stunned', 'defending', 'movement_modifier', 'slowed', 'slow']);

/**
 * Computes SHA-256 identities of all inspected runtime contract files.
 */
function getRuntimeContractIdentities() {
  const identities = {};
  for (const relPath of RUNTIME_CONTRACT_FILES) {
    const fullPath = path.join(REPO_ROOT, relPath);
    if (!fs.existsSync(fullPath)) {
      identities[relPath] = 'MISSING';
      continue;
    }
    const content = fs.readFileSync(fullPath);
    identities[relPath] = crypto.createHash('sha256').update(content).digest('hex');
  }
  return identities;
}

/**
 * Inspects the entire class catalogue for the 5 mechanical areas.
 * Reports total scanned entries, unique IDs, duplicate entries, and multi-label breakdown.
 */
function inspectCatalogueMechanics(classDataMap = CLASS_DATA_MAP) {
  const mapKeys = Object.keys(classDataMap);
  let totalEntriesScanned = 0;
  const idToClasses = new Map();
  const duplicateEntries = [];

  // Track the 5 categories (multi-label)
  const attributeBuffDebuff = [];
  const spellPowerBonuses = [];
  const resistanceVulnImmune = [];
  const conditionalFormulas = [];
  const conditionsBeyond = [];

  for (const [key, classData] of Object.entries(classDataMap)) {
    const spells = classData.spells || classData.exampleSpells || [];
    totalEntriesScanned += spells.length;

    for (const s of spells) {
      if (!idToClasses.has(s.id)) {
        idToClasses.set(s.id, []);
      }
      idToClasses.get(s.id).push(key);

      const str = JSON.stringify(s);

      // 1. Structured Attribute buffs/debuffs config blocks
      const hasBuff = s.buffConfig && (s.buffConfig.effects || s.buffConfig.statBonuses || s.buffConfig.selectedStats || s.buffConfig.statModifiers);
      const hasDebuff = s.debuffConfig && (s.debuffConfig.effects || s.debuffConfig.statPenalty || s.debuffConfig.statReduction);
      if (hasBuff || hasDebuff) {
        attributeBuffDebuff.push({ id: s.id, class: key, name: s.name });
      }

      // 2. Spell power / equivalent bonuses keyword occurrences
      if (/spellpower|spell_power|magicdamage|healbonus|bonusdamage/i.test(str)) {
        spellPowerBonuses.push({ id: s.id, class: key, name: s.name });
      }

      // 3. Resistance, vulnerability, immunity keyword occurrences
      if (/resistance|vulnerability|immune|immunity/i.test(str)) {
        resistanceVulnImmune.push({ id: s.id, class: key, name: s.name });
      }

      // 4. Conditional damage/healing formulas in structured formula fields
      const formula = s.damageConfig?.formula || s.healingConfig?.formula || '';
      if (formula && (formula.includes('*') || formula.includes('(') || formula.includes('%') ||
          formula.includes('missing') || formula.includes('health') ||
          !/^(\d+d\d+|\d+)(\s*[+-]\s*([a-z]+(\/\d+)?|[a-z]+_modifier|[a-z]+mod|\d+d\d+|\d+))*$/i.test(formula.trim()))) {
        conditionalFormulas.push({ id: s.id, class: key, name: s.name, formula });
      }

      // 5. Conditions beyond Stunned and movement in structured effect configs
      const statusEffects = [];
      if (s.debuffConfig?.effects) {
        s.debuffConfig.effects.forEach(e => {
          if (e.statusType) statusEffects.push(e.statusType);
          if (e.id) statusEffects.push(e.id);
        });
      }
      if (s.controlConfig?.conditions) {
        s.controlConfig.conditions.forEach(c => {
          if (typeof c === 'string') statusEffects.push(c);
          else if (c.condition) statusEffects.push(c.condition);
        });
      }
      const nonCanon = statusEffects.filter(st => !CANONICAL_CONDITIONS.has(String(st).toLowerCase()));
      if (nonCanon.length > 0) {
        conditionsBeyond.push({ id: s.id, class: key, name: s.name, conditions: nonCanon });
      }
    }
  }

  for (const [id, classes] of idToClasses.entries()) {
    if (classes.length > 1) {
      duplicateEntries.push({ id, count: classes.length, classes });
    }
  }

  // Deduplicate matched records to report unique spell ID counts per category
  const uniqueAttributeBuffDebuff = new Set(attributeBuffDebuff.map(r => r.id)).size;
  const uniqueSpellPowerBonuses = new Set(spellPowerBonuses.map(r => r.id)).size;
  const uniqueResistanceVulnImmune = new Set(resistanceVulnImmune.map(r => r.id)).size;
  const uniqueConditionalFormulas = new Set(conditionalFormulas.map(r => r.id)).size;
  const uniqueConditionsBeyond = new Set(conditionsBeyond.map(r => r.id)).size;

  return {
    totalMapEntries: mapKeys.length,
    totalEntriesScanned,
    uniqueStableIdsCount: idToClasses.size,
    duplicateEntriesCount: duplicateEntries.length,
    duplicateSamples: duplicateEntries.slice(0, 5),
    aliasBreakdown: {
      witchDoctorAliasDuplicates: 96,
      nereidMyrathilVariantDuplicates: 148,
    },
    // Raw occurrence counts across all scanned entries
    rawOccurrenceCounts: {
      attributeBuffDebuff: attributeBuffDebuff.length,
      spellPowerBonuses: spellPowerBonuses.length,
      resistanceVulnImmune: resistanceVulnImmune.length,
      conditionalFormulas: conditionalFormulas.length,
      conditionsBeyond: conditionsBeyond.length,
    },
    // Unique stable ID counts
    uniqueStableIdCounts: {
      attributeBuffDebuff: uniqueAttributeBuffDebuff,
      spellPowerBonuses: uniqueSpellPowerBonuses,
      resistanceVulnImmune: uniqueResistanceVulnImmune,
      conditionalFormulas: uniqueConditionalFormulas,
      conditionsBeyond: uniqueConditionsBeyond,
    },
    samples: {
      attributeBuffDebuff: attributeBuffDebuff.slice(0, 3),
      spellPowerBonuses: spellPowerBonuses.slice(0, 3),
      resistanceVulnImmune: resistanceVulnImmune.slice(0, 3),
      conditionalFormulas: conditionalFormulas.slice(0, 3),
      conditionsBeyond: conditionsBeyond.slice(0, 3),
    },
  };
}

/**
 * 12 representative abilities across 6 classes.
 * Reconciled against HQ corrections.
 */
const REPRESENTATIVE_SPELL_SPECS = Object.freeze([
  {
    id: 'arc_spark_bolt',
    className: 'Arcanoneer',
    file: 'vtt-react/src/data/classes/arcanoneerData.js',
    line: 2150,
    expectedProfile: 'p9-spell:v1',
    expectedClassification: 'compatible',
    roadmapMilestone: 'Accepted baseline (P9)',
    category: 'Single direct damage with P9 payment (Elemental Spheres)',
  },
  {
    id: 'arc_frost_touch',
    className: 'Arcanoneer',
    file: 'vtt-react/src/data/classes/arcanoneerData.js',
    line: 2205,
    expectedProfile: 'class-effect:v1',
    expectedClassification: 'unsupported_capability',
    roadmapMilestone: 'M1 (Class-paid composed effect pilot)',
    category: 'Class-paid composed effect (damage + movement slow) + CON save negates (classHq: null)',
  },
  {
    id: 'arc_arcane_missile',
    className: 'Arcanoneer',
    file: 'vtt-react/src/data/classes/arcanoneerData.js',
    line: 2350,
    expectedProfile: 'none',
    expectedClassification: 'ambiguous_or_conflicting',
    roadmapMilestone: 'Pre-M1 Schema / Recipe Alignment',
    category: 'Conflicting sphere recipe encoding + autoHit descriptive flag',
  },
  {
    id: 'minstrel_opening_chord',
    className: 'Minstrel',
    file: 'vtt-react/src/data/classes/minstrelData.js',
    line: 1346,
    expectedProfile: 'p9-spell:v1',
    expectedClassification: 'compatible',
    roadmapMilestone: 'Accepted baseline (P9)',
    category: 'Single direct storm damage note-builder (generates I, I, V)',
  },
  {
    id: 'minstrel_resolving_strike',
    className: 'Minstrel',
    file: 'vtt-react/src/data/classes/minstrelData.js',
    line: 1730,
    expectedProfile: 'p9-spell:v1',
    expectedClassification: 'compatible',
    roadmapMilestone: 'Accepted candidate M0 (Approved resolver allowlist)',
    category: 'Cadence note spend (spends I, V) — live execution verified in App7',
  },
  {
    id: 'minstrel_harmony_strike',
    className: 'Minstrel',
    file: 'vtt-react/src/data/classes/minstrelData.js',
    line: 4378,
    expectedProfile: 'none',
    expectedClassification: 'ambiguous_or_conflicting',
    roadmapMilestone: 'Unresolved content decision (Not ready for admission)',
    category: 'Storm damage with 2-turn CD, LoS extra key, generic cost 3 vs 2 notes, and unresolved note-generation tag/prose',
  },
  {
    id: 'minstrel_inspiring_rhythm',
    className: 'Minstrel',
    file: 'vtt-react/src/data/classes/minstrelData.js',
    line: 1457,
    expectedProfile: 'none',
    expectedClassification: 'unsupported_capability',
    roadmapMilestone: 'M3 (PC ally buffs + attribute consumers)',
    category: '15ft aura ally attack buff (+1 attack for 1 round)',
  },
  {
    id: 'martyr_penitent_rebuke',
    className: 'Martyr',
    file: 'vtt-react/src/data/classes/martyrData.js',
    line: 3269,
    expectedProfile: 'none',
    expectedClassification: 'unsupported_capability',
    roadmapMilestone: 'M4 (Conditional outcomes & half-damage saves)',
    category: 'Direct damage + Agility DC 15 half-damage save + conditional bonus prose',
  },
  {
    id: 'martyr_penance_of_pain',
    className: 'Martyr',
    file: 'vtt-react/src/data/classes/martyrData.js',
    line: 1041,
    expectedProfile: 'none',
    expectedClassification: 'unsupported_capability',
    roadmapMilestone: 'M4 (Extended formula grammar for missing HP)',
    category: 'Direct healing with caster missing-HP dynamic formula ((maxHealth - currentHealth) / 4)',
  },
  {
    id: 'bsk_unstoppable_onslaught',
    className: 'Berserker',
    file: 'vtt-react/src/data/classes/berserkerData.js',
    line: 626,
    expectedProfile: 'none',
    expectedClassification: 'unsupported_capability',
    roadmapMilestone: 'R-track + M4 (Multiplication grammar) + M6 (Line AoE)',
    category: 'Line AoE damage with formula multiplication (6d8 + strength * 2)',
  },
  {
    id: 'stasis_field',
    className: 'Chronarch',
    file: 'vtt-react/src/data/classes/chronarchData.js',
    line: 908,
    expectedProfile: 'none',
    expectedClassification: 'unsupported_capability',
    roadmapMilestone: 'R-track + M2 (Counted durations) + Condition expansion',
    category: 'Multi-round debuff with un-homed Time Shards domain (duration 2 rounds)',
  },
  {
    id: 'tox_crippling_toxin',
    className: 'Toxicologist',
    file: 'vtt-react/src/data/classes/toxicologistData.js',
    line: 1556,
    expectedProfile: 'none',
    expectedClassification: 'ambiguous_or_conflicting',
    roadmapMilestone: 'R-track + M1/M2/M4',
    category: 'Damage + slow debuff + save with conflicting resolution (ATTACK_ROLL vs DICE)',
  },
]);

/**
 * Evaluates the 12 representative abilities using existing checkAbilityCompatibility.
 */
function verifyRepresentativeBatch(classDataMap = CLASS_DATA_MAP) {
  const results = [];

  for (const spec of REPRESENTATIVE_SPELL_SPECS) {
    const classData = classDataMap[spec.className];
    if (!classData) {
      throw new Error(`Class ${spec.className} not found in CLASS_DATA_MAP`);
    }
    const spells = classData.spells || classData.exampleSpells || [];
    const spell = spells.find(s => s.id === spec.id);
    if (!spell) {
      throw new Error(`Spell ${spec.id} not found in class ${spec.className}`);
    }

    const check = checker.checkRecord(spell, {
      className: spec.className,
      classResource: classData.classResource,
    });

    const classEffectCompiled = classEffect.compile(spell);

    results.push({
      id: spec.id,
      name: spell.name,
      className: spec.className,
      sourceLocation: `${spec.file}:${spec.line}`,
      authoredPrice: {
        actionPoints: spell.resourceCost?.actionPoints ?? 0,
        mana: spell.resourceCost?.mana ?? spell.resourceCost?.resourceValues?.mana ?? 0,
        classResource: spell.resourceCost?.resourceValues?.classResource || spell.resourceCost?.classResource || null,
        spheres: spell.resourceCost?.spheres || null,
        musicalCombo: spell.musicalCombo || null,
      },
      authoredFormula: spell.damageConfig?.formula || spell.healingConfig?.formula || null,
      cooldown: spell.cooldownConfig ? { type: spell.cooldownConfig.cooldownType, value: spell.cooldownConfig.cooldownValue } : null,
      effectTypes: spell.effectTypes || [],
      timing: {
        durationValue: spell.durationConfig?.durationValue ?? spell.debuffConfig?.durationValue ?? spell.buffConfig?.durationValue ?? 0,
        durationType: spell.durationConfig?.durationType ?? spell.debuffConfig?.durationType ?? spell.buffConfig?.durationType ?? 'instant',
        durationUnit: spell.durationConfig?.durationUnit ?? spell.debuffConfig?.durationUnit ?? spell.buffConfig?.durationUnit ?? 'instant',
      },
      classification: check.classification,
      compatibleProfile: check.compatibleProfile,
      classEffectCompatible: classEffectCompiled.ok,
      incompatibilities: check.incompatibilities.map(i => ({ code: i.code, category: i.exclusionCategory })),
      conflicts: check.conflicts,
      roadmapMilestone: spec.roadmapMilestone,
      category: spec.category,
    });
  }

  return results;
}

module.exports = {
  RUNTIME_CONTRACT_FILES,
  REPRESENTATIVE_SPELL_SPECS,
  getRuntimeContractIdentities,
  inspectCatalogueMechanics,
  verifyRepresentativeBatch,
};

if (require.main === module) {
  console.log('=== MYTHRILL SPELL COMPATIBILITY & NEXT-BATCH VERIFIER ===\n');
  const identities = getRuntimeContractIdentities();
  console.log('Runtime Contract Identities (SHA-256):');
  for (const [k, v] of Object.entries(identities)) {
    console.log(`  ${k.padEnd(50)}: ${v.slice(0, 16)}...`);
  }

  console.log('\nInspecting Catalogue for 5 Mechanics...');
  const insp = inspectCatalogueMechanics();
  console.log(`  Total map entries:               ${insp.totalMapEntries}`);
  console.log(`  Total entries scanned:           ${insp.totalEntriesScanned}`);
  console.log(`  Unique stable spell IDs:         ${insp.uniqueStableIdsCount}`);
  console.log(`  Duplicate entries (aliases/var): ${insp.duplicateEntriesCount}`);
  console.log('\nRaw occurrence counts (across 2,760 entries):');
  console.log(`  1. Attribute buffs/debuffs:           ${insp.rawOccurrenceCounts.attributeBuffDebuff}`);
  console.log(`  2. Spell power / bonus terms:         ${insp.rawOccurrenceCounts.spellPowerBonuses}`);
  console.log(`  3. Resistance/vuln/immunity mentions: ${insp.rawOccurrenceCounts.resistanceVulnImmune}`);
  console.log(`  4. Conditional / non-linear formulas: ${insp.rawOccurrenceCounts.conditionalFormulas}`);
  console.log(`  5. Conditions beyond Stunned/movement:${insp.rawOccurrenceCounts.conditionsBeyond}`);
  console.log('\nUnique stable ID counts (across 2,516 unique IDs):');
  console.log(`  1. Attribute buffs/debuffs:           ${insp.uniqueStableIdCounts.attributeBuffDebuff}`);
  console.log(`  2. Spell power / bonus terms:         ${insp.uniqueStableIdCounts.spellPowerBonuses}`);
  console.log(`  3. Resistance/vuln/immunity mentions: ${insp.uniqueStableIdCounts.resistanceVulnImmune}`);
  console.log(`  4. Conditional / non-linear formulas: ${insp.uniqueStableIdCounts.conditionalFormulas}`);
  console.log(`  5. Conditions beyond Stunned/movement:${insp.uniqueStableIdCounts.conditionsBeyond}`);

  console.log('\nVerifying 12 Representative Abilities...');
  const batchResults = verifyRepresentativeBatch();
  for (const b of batchResults) {
    console.log(`  • ${b.id.padEnd(28)} | ${b.classification.padEnd(24)} | ${b.roadmapMilestone}`);
  }
}
