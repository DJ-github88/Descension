'use strict';

/**
 * Representative Batch Loader for the Mythrill Ability Compatibility Checker.
 *
 * Pulls live Class HQ records from CLASS_DATA_MAP (without mutating or normalizing them)
 * alongside canonical Wizard-authored records (authored-immediate:v1, authored-condition:v1,
 * authored-effect:v1) to cover all seven representative categories requested by HQ:
 *   1. Accepted immediate damage/healing
 *   2. Canonical Stunned
 *   3. A resource-heavy class ability
 *   4. A passive
 *   5. A mixed effect
 *   6. An area or chain
 *   7. A summon/transformation or persistent effect
 */

const path = require('path');

const VTT_REACT_ROOT = path.resolve(__dirname, '..', '..');

const CLASS_FILES = Object.freeze({
  Arcanoneer: 'vtt-react/src/data/classes/arcanoneerData.js',
  Martyr: 'vtt-react/src/data/classes/martyrData.js',
  Minstrel: 'vtt-react/src/data/classes/minstrelData.js',
  Berserker: 'vtt-react/src/data/classes/berserkerData.js',
  Chronarch: 'vtt-react/src/data/classes/chronarchData.js',
  Doomsayer: 'vtt-react/src/data/classes/doomsayerData.js',
  Druid: 'vtt-react/src/data/classes/druidData.js',
});

const CLASS_HQ_REPRESENTATIVE_SELECTIONS = Object.freeze([
  // 1. Accepted immediate damage/healing (p9-spell:v1)
  {
    category: '1. Accepted immediate damage/healing',
    className: 'Arcanoneer',
    spellId: 'arc_spark_bolt',
  },
  {
    category: '1. Accepted immediate damage/healing',
    className: 'Martyr',
    spellId: 'martyr_restorative_prayer',
  },
  {
    category: '1. Accepted immediate damage/healing (explicit 0 mana)',
    className: 'Minstrel',
    spellId: 'minstrel_opening_chord',
  },
  {
    category: '1. Accepted immediate damage/healing',
    className: 'Minstrel',
    spellId: 'minstrel_harmonic_strike',
  },

  // 2. Canonical Stunned vs Class Control
  {
    category: '2. Control / Stasis outside Wizard Stunned profile',
    className: 'Chronarch',
    spellId: 'stasis_field',
  },

  // 3. Resource-heavy class abilities & resource conflicts
  {
    category: '3. Resource-heavy class ability (Minstrel cadence resolution)',
    className: 'Minstrel',
    spellId: 'minstrel_resolving_strike',
  },
  {
    category: '3. Resource-heavy class ability (Time Shards + Temporal Strain + permanent max HP tax)',
    className: 'Chronarch',
    spellId: 'temporal_flux_speed',
  },
  {
    category: '3. Resource-heavy class ability with ambiguous sphere recipe encoding',
    className: 'Arcanoneer',
    spellId: 'arc_arcane_missile',
  },
  {
    category: '3. R1 CR1 class ability with classResourceProgram & manualOnly envelope',
    className: 'Doomsayer',
    spellId: 'cr1_doomsayer_doom_bolt',
  },

  // 4. Passives
  {
    category: '4. Passive class ability',
    className: 'Berserker',
    spellId: 'berserk_calloused_hide',
  },
  {
    category: '4. Passive class flaw/trait',
    className: 'Chronarch',
    spellId: 'chrono_frailty',
  },

  // 5. Mixed effects
  {
    category: '5. Mixed effect (damage + self-recoil debuff + execute trigger + 50 Rage)',
    className: 'Berserker',
    spellId: 'berserk_obliterating_strike',
  },
  {
    category: '5. Mixed effect (damage + reaction-lock debuff + crit config + Time Shard gain)',
    className: 'Chronarch',
    spellId: 'temporal_fracture',
  },
  {
    category: '5. Mixed effect (damage + slow debuff)',
    className: 'Arcanoneer',
    spellId: 'arc_frost_touch',
  },

  // 6. Area or chain
  {
    category: '6. Chain propagation on primary single-target damage',
    className: 'Arcanoneer',
    spellId: 'arc_fire_bolt',
  },
  {
    category: '6. Area-of-Effect damage + debuff',
    className: 'Arcanoneer',
    spellId: 'arc_steam_burst',
  },
  {
    category: '6. Area-of-Effect damage + control + saving throw',
    className: 'Berserker',
    spellId: 'bsk_caldera_slam',
  },
  {
    category: '6. R1 Area-of-Effect control zone',
    className: 'Doomsayer',
    spellId: 'cr1_doomsayer_calamity_zone',
  },

  // 7. Summon / transformation / persistent effect
  {
    category: '7. Transformation + persistent multi-round buff',
    className: 'Berserker',
    spellId: 'berserk_avatar_of_slaughter',
  },
  {
    category: '7. R1 Druid form/loadout adoption state ability',
    className: 'Druid',
    spellId: 'cr1_druid_adopt_loadout',
  },
]);

function makeWizardLibraryRecord(draft, authoredDefinitionId) {
  return {
    ...JSON.parse(JSON.stringify(draft)),
    authoredDefinitionId,
    authoredDraft: JSON.parse(JSON.stringify(draft)),
  };
}

function buildWizardRepresentativeRecords() {
  const emberLanceDraft = {
    id: 'wizard_immediate_ember_lance',
    name: 'Ember Lance',
    description: 'A focused bolt of ember force costing 0 AP and 0 Mana.',
    spellType: 'ACTION',
    effectTypes: ['damage'],
    typeConfig: {
      school: 'ember',
      castTime: 0,
      castTimeType: 'IMMEDIATE',
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 60,
      targetRestrictions: ['enemy'],
      maxTargets: 1,
    },
    resourceCost: {
      actionPoints: 0,
      mana: 0,
      resourceTypes: ['mana', 'actionPoints'],
      primaryResourceType: 'mana',
      resourceValues: { actionPoints: 0, mana: 0 },
    },
    damageConfig: {
      formula: '2d6+3',
      elementType: 'ember',
      damageTypes: ['ember'],
      damageType: 'direct',
      resolution: 'DICE',
      globalResolution: 'DICE',
      hasDotEffect: false,
    },
    durationConfig: {
      durationType: 'instant',
    },
    cooldownConfig: {
      cooldownType: 'none',
      cooldownValue: 0,
    },
  };

  const selfMendDraft = {
    id: 'wizard_creature_self_mend',
    name: 'Carapace Mend',
    description: 'Creature self-only immediate healing with explicit 0ft range.',
    spellType: 'ACTION',
    effectTypes: ['healing'],
    typeConfig: {
      castTime: 0,
      castTimeType: 'IMMEDIATE',
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'self',
      rangeDistance: 0,
      targetRestrictions: ['self'],
      maxTargets: 1,
    },
    resourceCost: {
      actionPoints: 1,
      mana: 0,
      resourceTypes: ['mana', 'actionPoints'],
      primaryResourceType: 'mana',
      resourceValues: { actionPoints: 1, mana: 0 },
    },
    healingConfig: {
      formula: '1d8+2',
      healingType: 'direct',
      resolution: 'DICE',
      globalResolution: 'DICE',
      hasHotEffect: false,
      hasShieldEffect: false,
    },
    durationConfig: {
      durationType: 'instant',
    },
  };

  const stunBindDraft = {
    id: 'wizard_canonical_stun_bind',
    name: 'Aetheric Lock',
    description: 'Canonical Stunned condition under GM manual expiry.',
    spellType: 'ACTION',
    effectTypes: ['control'],
    typeConfig: {
      school: 'arcane',
      castTime: 0,
      castTimeType: 'IMMEDIATE',
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemy'],
      maxTargets: 1,
    },
    resourceCost: {
      actionPoints: 2,
      mana: 10,
      resourceTypes: ['mana', 'actionPoints'],
      primaryResourceType: 'mana',
      resourceValues: { actionPoints: 2, mana: 10 },
    },
    controlConfig: {
      authoredCondition: {
        profile: 'authored-condition:v1',
        conditionKey: 'stunned',
        expiryPolicy: 'gm-manual',
        durationText: 'Until the GM clears the lock at end of target turn',
        gmNote: 'Target is Stunned; clear manually after adjudication.',
      },
    },
    durationConfig: {
      durationType: 'instant',
    },
  };

  const a10StunShockDraft = {
    id: 'wizard_a10_stun_shock',
    name: 'Synaptic Jolt',
    description: 'Applies canonical Stunned until target-next-end and deals 1d6+2 storm damage.',
    spellType: 'ACTION',
    effectTypes: ['control', 'damage'],
    typeConfig: {
      school: 'storm',
      castTime: 0,
      castTimeType: 'IMMEDIATE',
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemy'],
      maxTargets: 1,
    },
    resourceCost: {
      actionPoints: 2,
      mana: 8,
      resourceTypes: ['mana', 'actionPoints'],
      primaryResourceType: 'mana',
      resourceValues: { actionPoints: 2, mana: 8 },
    },
    controlConfig: {
      authoredCondition: {
        profile: 'authored-effect:v1',
        effect: 'stunned',
        expiryPolicy: 'target-next-end',
        durationText: 'Until the end of the target creature next turn',
        gmNote: 'Auto-expires on target-next-end under shared-turn-boundary:v1.',
      },
    },
    damageConfig: {
      formula: '1d6+2',
      elementType: 'storm',
      damageTypes: ['storm'],
      damageType: 'direct',
      resolution: 'DICE',
      globalResolution: 'DICE',
      hasDotEffect: false,
    },
    durationConfig: {
      durationType: 'instant',
    },
  };

  const a10KineticShoveDraft = {
    id: 'wizard_a10_kinetic_shove',
    name: 'Rime Ankle-Bind',
    description: 'Reduces target creature movement by -10 ft and deals 1d4+1 rime damage.',
    spellType: 'ACTION',
    effectTypes: ['control', 'damage'],
    typeConfig: {
      school: 'rime',
      castTime: 0,
      castTimeType: 'IMMEDIATE',
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 25,
      targetRestrictions: ['enemy'],
      maxTargets: 1,
    },
    resourceCost: {
      actionPoints: 1,
      mana: 5,
      resourceTypes: ['mana', 'actionPoints'],
      primaryResourceType: 'mana',
      resourceValues: { actionPoints: 1, mana: 5 },
    },
    controlConfig: {
      authoredCondition: {
        profile: 'authored-effect:v1',
        effect: 'movement',
        movementFeet: -10,
        label: 'Rime-Bound (-10 ft)',
        expiryPolicy: 'target-next-start',
        durationText: 'Until the start of the target creature next turn',
        gmNote: 'Reduces target movement by 10 ft until start of its next turn.',
      },
    },
    damageConfig: {
      formula: '1d4+1',
      elementType: 'rime',
      damageTypes: ['rime'],
      damageType: 'direct',
      resolution: 'DICE',
      globalResolution: 'DICE',
      hasDotEffect: false,
    },
    durationConfig: {
      durationType: 'instant',
    },
  };

  return [
    {
      category: '1. Accepted Wizard immediate damage (explicit 0 AP, 0 mana)',
      context: {
        profileMode: 'wizard',
        classId: 'arcanoneer',
        collectionPath: 'WIZARD_REPRESENTATIVE[0]',
      },
      record: makeWizardLibraryRecord(emberLanceDraft, '11111111-2222-4333-8444-555555555501'),
    },
    {
      category: '1. Accepted Wizard creature self-healing (explicit 0 range, self restriction)',
      context: {
        profileMode: 'wizard',
        classId: 'martyr',
        requestedRoute: { sourceKind: 'creature', targetKind: 'creature', sameActor: true },
        collectionPath: 'WIZARD_REPRESENTATIVE[1]',
      },
      record: makeWizardLibraryRecord(selfMendDraft, '11111111-2222-4333-8444-555555555502'),
    },
    {
      category: '2. Canonical Stunned (authored-condition:v1)',
      context: {
        profileMode: 'wizard',
        classId: 'arcanoneer',
        collectionPath: 'WIZARD_REPRESENTATIVE[2]',
      },
      record: makeWizardLibraryRecord(stunBindDraft, '11111111-2222-4333-8444-555555555503'),
    },
    {
      category: '2 & 5. Composable Stunned + Damage with turn-boundary expiry (authored-effect:v1)',
      context: {
        profileMode: 'wizard',
        classId: 'arcanoneer',
        requestedRoute: { sourceKind: 'pc', targetKind: 'creature', sameActor: false },
        collectionPath: 'WIZARD_REPRESENTATIVE[3]',
      },
      record: makeWizardLibraryRecord(a10StunShockDraft, '11111111-2222-4333-8444-555555555504'),
    },
    {
      category: '5. Composable Movement modifier + Damage (authored-effect:v1)',
      context: {
        profileMode: 'wizard',
        classId: 'arcanoneer',
        requestedRoute: { sourceKind: 'pc', targetKind: 'creature', sameActor: false },
        collectionPath: 'WIZARD_REPRESENTATIVE[4]',
      },
      record: makeWizardLibraryRecord(a10KineticShoveDraft, '11111111-2222-4333-8444-555555555505'),
    },
  ];
}

function buildRepresentativeBatch() {
  const { CLASS_DATA_MAP } = require(path.join(VTT_REACT_ROOT, 'src', 'data', 'classSpellGenerator.js'));
  const entries = [];

  for (const sel of CLASS_HQ_REPRESENTATIVE_SELECTIONS) {
    const classData = CLASS_DATA_MAP[sel.className];
    if (!classData) {
      throw new Error(`Representative class "${sel.className}" not found in CLASS_DATA_MAP.`);
    }
    const collectionField = Array.isArray(classData.spells)
      ? 'spells'
      : Array.isArray(classData.exampleSpells)
      ? 'exampleSpells'
      : null;
    const list = collectionField ? classData[collectionField] : [];
    const index = list.findIndex((s) => s.id === sel.spellId);
    if (index === -1) {
      throw new Error(`Representative spell "${sel.spellId}" not found in ${sel.className}.${collectionField}.`);
    }

    entries.push({
      __isWrappedEntry: true,
      category: sel.category,
      record: list[index],
      context: {
        className: sel.className,
        classResource: classData.classResource ? { type: classData.classResource.type } : null,
        file: CLASS_FILES[sel.className],
        collectionPath: `${sel.className}.${collectionField}[${index}]`,
        index,
      },
    });
  }

  for (const wiz of buildWizardRepresentativeRecords()) {
    entries.push({
      __isWrappedEntry: true,
      category: wiz.category,
      record: wiz.record,
      context: {
        ...wiz.context,
        file: 'vtt-react/verification/ability-compatibility/representativeBatch.cjs',
      },
    });
  }

  return {
    batchName: 'representative-hq-batch',
    entries,
  };
}

module.exports = {
  CLASS_HQ_REPRESENTATIVE_SELECTIONS,
   makeWizardLibraryRecord,
  buildWizardRepresentativeRecords,
  buildRepresentativeBatch,
};
