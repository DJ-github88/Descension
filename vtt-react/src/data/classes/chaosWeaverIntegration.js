/*
 * RI-1 integration adapter — Chaos Weaver (class id `chaos-weaver`).
 *
 * Projection of the closed CLASS-C1 packet (chaosWeaverData.js +
 * talentTrees/chaosWeaver.js) into the ordinary class-data shape consumed by
 * the catalogue, class detail, spell library and talent map. This file adds no
 * new authored mechanics: every record is transformed from the C1 constants
 * and keeps its typed source record, source ID and ruleset version under
 * `specialMechanics.chaosWeaver`. All entries are manual-tabletop only:
 * nothing in this adapter executes, grants or applies anything automatically.
 */

import {
  CHAOS_WEAVER_CLASS_ID,
  CHAOS_WEAVER_RULESET_VERSION,
  CHAOS_WEAVER_ICON,
  CHAOS_WEAVER_TILE_IDS,
  CHAOS_WEAVER_TILE_SYMBOLS,
  CHAOS_WEAVER_TILE_ZONES,
  CHAOS_WEAVER_TREE_IDS,
  CHAOS_WEAVER_MANUAL_ONLY_NOTICE,
  CHAOS_WEAVER_IDENTITY,
  CHAOS_WEAVER_ORIGIN,
  CHAOS_WEAVER_ACQUISITION_RECORDS,
  CHAOS_WEAVER_NATIVE_VARIANTS,
  CHAOS_WEAVER_PROGRESSION,
  CHAOS_WEAVER_PROGRESSION_RULES,
  CHAOS_WEAVER_CORE_SPELLS,
  CHAOS_WEAVER_ACTIVE_SPELLS,
  CHAOS_WEAVER_ACTIVE_COUNTS,
  CHAOS_WEAVER_RESOURCE_RULES,
  CHAOS_WEAVER_SETTLEMENT_RULES,
  CHAOS_WEAVER_RULESET
} from './chaosWeaverData';

import {
  CHAOS_WEAVER_TREE_META,
  CHAOS_WEAVER_TREES,
  CHAOS_WEAVER_TALENT_NODES,
  CHAOS_WEAVER_PASSIVE_SPELLS,
  CHAOS_WEAVER_TALENT_CAPACITY
} from '../talentTrees/chaosWeaver';

export const CHAOS_WEAVER_DISPLAY_NAME = 'Chaos Weaver';
export const CHAOS_WEAVER_DEVELOPMENT_STATUS = 'development';

/* ------------------------------------------------------------------ */
/* Spell projection                                                    */
/* ------------------------------------------------------------------ */

const GRANT_TREE_BY_SPELL_ID = Object.fromEntries(
  CHAOS_WEAVER_TALENT_NODES
    .filter((node) => node.grantId)
    .map((node) => [node.grantId, node.treeId])
);

const treeIdForRecord = (record) =>
  record.treeId || GRANT_TREE_BY_SPELL_ID[record.id] || null;

const damageConfigFor = (record) =>
  record.damage
    ? {
        formula: record.damage.formula,
        damageTypes: [...(record.damage.damageTypes || ['wyrd'])],
        elementType: 'wyrd',
        resolution: 'DICE'
      }
    : null;

const branchesHaveDamage = (record) =>
  Boolean(
    record.branchRule &&
      Object.values(record.branchRule.outcomes || {}).some((branch) => branch?.damage)
  );

const effectTypesFor = (record, damageConfig) => {
  if (damageConfig) return ['damage'];
  if (record.branchRule) return branchesHaveDamage(record) ? ['damage', 'sampled'] : ['sampled', 'utility'];
  return ['utility'];
};

const targetingConfigFor = (record) => {
  const roles = record.target?.roles || [];
  const rangeFeet = record.target?.rangeFeet ?? 0;
  if (roles.includes('self')) {
    return { targetingType: 'self', rangeType: 'self', targetRestrictions: roles };
  }
  if (roles.includes('anomaly') || roles.includes('point')) {
    return { targetingType: 'point', rangeType: 'ranged', rangeDistance: rangeFeet, targetRestrictions: roles };
  }
  return {
    targetingType: 'single',
    rangeType: rangeFeet >= 30 ? 'ranged' : rangeFeet > 0 ? 'melee' : 'self',
    rangeDistance: rangeFeet > 0 ? rangeFeet : undefined,
    targetRestrictions: roles
  };
};

const spellTagsFor = (record) => [
  'chaos-weaver',
  `chaos-weaver-${record.source}`,
  treeIdForRecord(record) || 'core',
  'manual-only',
  ...(record.branchRule ? ['sampled-branches'] : []),
  ...(record.continuation ? ['continuation'] : []),
  ...(record.area ? ['anomaly'] : [])
];

const projectActionRecord = (record) => {
  const treeId = treeIdForRecord(record);
  const damageConfig = damageConfigFor(record);
  const tags = spellTagsFor(record);
  const manualRequirements = [...(record.manualRequirements || [])];

  return {
    id: record.id,
    name: record.name,
    class: CHAOS_WEAVER_DISPLAY_NAME,
    classId: CHAOS_WEAVER_CLASS_ID,
    source: `chaos-weaver-${record.source}`,
    sourceRecordSource: record.source,
    level: record.level,
    treeId,
    specialization: treeId || 'core',
    spellType: record.spellType,
    icon: record.icon,
    description: record.effectText,
    flavorText: null,
    typeConfig: {
      school: 'wyrd',
      icon: record.icon,
      tags,
      castTime: 1,
      castTimeType: record.spellType === 'PASSIVE' ? 'PASSIVE' : 'IMMEDIATE'
    },
    targetingConfig: targetingConfigFor(record),
    resourceCost: {
      actionPoints: record.resourceCost?.actionPoints ?? 0,
      mana: record.resourceCost?.mana ?? 0,
      resourceTypes: [],
      resourceValues: {}
    },
    resolution: damageConfig ? 'DICE' : 'NONE',
    effectTypes: effectTypesFor(record, damageConfig),
    damageConfig,
    buffConfig: null,
    debuffConfig: null,
    healingConfig: null,
    utilityConfig: null,
    durationConfig: null,
    cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
    conditions: [],
    tags,
    categoryIds: [],
    manualOnly: true,
    executionEnabled: false,
    applicationMode: 'manual-tabletop',
    automatedCapabilities: [],
    manualRequirements,
    sourceRefs: [...(record.sourceRefs || [])],
    specialMechanics: {
      chaosWeaver: {
        classId: CHAOS_WEAVER_CLASS_ID,
        rulesetVersion: CHAOS_WEAVER_RULESET_VERSION,
        sourceRecordId: record.id,
        source: record.source,
        treeId,
        manualOnly: true,
        executionEnabled: false,
        applicationMode: 'manual-tabletop',
        tileRule: record.tileRule,
        target: record.target,
        branchRule: record.branchRule,
        outcome: record.outcome,
        timing: record.timing,
        area: record.area,
        continuation: record.continuation,
        requires: record.requires,
        rankValues: record.rankValues,
        damage: record.damage,
        sourceRefs: [...(record.sourceRefs || [])],
        manualRequirements
      }
    }
  };
};

export const CHAOS_WEAVER_PROJECTED_SPELLS = CHAOS_WEAVER_ACTIVE_SPELLS.map(projectActionRecord);

export const CHAOS_WEAVER_PROJECTED_SPELLS_BY_ID = Object.fromEntries(
  CHAOS_WEAVER_PROJECTED_SPELLS.map((spell) => [spell.id, spell])
);

/* ------------------------------------------------------------------ */
/* Spell pools (four authored options per level, from the progression) */
/* ------------------------------------------------------------------ */

export const CHAOS_WEAVER_SPELL_POOLS = Object.fromEntries(
  CHAOS_WEAVER_PROGRESSION.map((row) => [row.level, [...row.newChoiceIds]])
);

export const CHAOS_WEAVER_PROGRESSION_POLICY = {
  classId: CHAOS_WEAVER_CLASS_ID,
  rulesetVersion: CHAOS_WEAVER_RULESET_VERSION,
  levelCap: CHAOS_WEAVER_PROGRESSION_RULES.levelCap,
  startingSpellPicks: 1,
  optionalPicksPerLevel: 1,
  allowEarlierUnchosen: true,
  grantedCoreSpellIds: CHAOS_WEAVER_CORE_SPELLS.map((record) => record.id),
  randomizeStartingSpells: false,
  autoTopUpOnLoad: false,
  talentActivesAreGrants: true,
  manualOnly: true,
  rules: CHAOS_WEAVER_PROGRESSION_RULES
};

/* ------------------------------------------------------------------ */
/* Specializations                                                     */
/* ------------------------------------------------------------------ */

const TREE_SPEC_PRESENTATION = {
  'probability-sculptor': {
    color: '#7A2040',
    strengths: [
      'Bias the Draw improves an already published, honest S/F split.',
      'Flat Surge/Fracture bonuses apply at max-rank absolute values.',
      'No hidden reroll or invisible outcome is ever added.'
    ],
    weaknesses: [
      'Every draw is still uniform; the odds only improve, never guarantee.',
      'No healing of any kind on any branch.'
    ]
  },
  'anomaly-binder': {
    color: '#2D5A1E',
    strengths: [
      'One visible, avoidable anomaly apparatus with a published trigger.',
      'Cheap 1-AP dismissal or natural endT+2 expiry sends both IDs to spent.'
    ],
    weaknesses: [
      'One anomaly at a time across all casts.',
      'No damage, refund, second target or forced movement is added.'
    ]
  },
  'cascade-weaver': {
    color: '#5B3A8C',
    strengths: [
      'Retains one predeclared continuation for a willing ally.',
      'Continuations never enter the primary sample.'
    ],
    weaknesses: [
      'Exactly one derived follow-up per action.',
      'The optional continuation must be reserved before the primary draw.'
    ]
  }
};

export const CHAOS_WEAVER_SPECIALIZATIONS = {
  title: 'Chaos Weaver Specializations',
  subtitle: 'Three Disciplines of Contained Variance (proposed reconstruction)',
  description:
    'Every Chaos Weaver invests in one of three disciplines that shape which possibilities they publish. ' +
    'Points are spent level by level; the first tree invested in is the primary specialization. ' +
    'Signatures open after 10 points in a tree and capstones after 45 points and character level 10.',
  specs: CHAOS_WEAVER_TREE_META.map((tree, index) => ({
    id: tree.id,
    name: tree.name,
    icon: CHAOS_WEAVER_ICON,
    color: TREE_SPEC_PRESENTATION[tree.id]?.color,
    theme: tree.tagline,
    description:
      `${tree.tagline} The ${tree.name} is one of three Chaos Weaver disciplines; ` +
      'its ranks modify published possibilities and never add hidden outcomes.',
    playstyle: tree.tagline,
    strengths: TREE_SPEC_PRESENTATION[tree.id]?.strengths,
    weaknesses: TREE_SPEC_PRESENTATION[tree.id]?.weaknesses,
    order: index
  }))
};

/* ------------------------------------------------------------------ */
/* Overview, provenance and restrictions                               */
/* ------------------------------------------------------------------ */

export const CHAOS_WEAVER_OVERVIEW = {
  title: 'The Chaos Weaver',
  subtitle: 'Variance Containment (proposed reconstruction — manual tabletop only)',
  description:
    `${CHAOS_WEAVER_IDENTITY.pitch} ${CHAOS_WEAVER_IDENTITY.groupVerb}`,
  quickOverview: {
    title: 'Class Overview',
    content:
      '**Who they are**: A Chaos Weaver publishes a finite set of possible consequences and pays to recover ' +
      'possibilities already spent. Six exact tile IDs move between four zones (available, committed, bound, spent); ' +
      'no symbol ever changes and no free draw or exchange exists.\n\n' +
      '**The hook**: Every action names its input symbols before the face. Sampled spells use a uniform physical ' +
      'mapping published in advance — the table always knows the denominator before the die lands.\n\n' +
      '**The resource bar & costs**: Mayhem is not used here. The class record is the six-tile state; ' +
      'Fold the Odds costs 1 AP and recovers one or two spent IDs. There is no free per-turn recovery.\n\n' +
      '**Bring one for**: Wyrd pressure, uncertainty control and observational utility — with explicitly paid recovery ' +
      'and unavoidable published downsides. Nothing in this class is applied automatically.'
  },
  combatRole: {
    title: 'Combat Role',
    content:
      `**Primary role**: ${CHAOS_WEAVER_IDENTITY.role}\n` +
      '**Why Bring Me**: Publishes exactly which possibilities may happen, then spends them deliberately — ' +
      'playing a fair, fully disclosed denominator instead of hidden luck.'
  },
  playstyle: {
    title: 'Playstyle & Turn 1 Flow',
    content:
      '**Your Turn 1 in Combat**:\n' +
      '1. **Read the zones**: Check which of the six IDs are available, committed, bound or spent.\n' +
      '2. **Publish the action**: Choose an optional or core action and name its input symbols and all branches first.\n' +
      '3. **Resolve manually**: Enter the face, apply only the published branch, and confirm the retained result before settlement.'
  },
  roleplayIdentity: {
    title: 'Roleplay Identity',
    content:
      `${CHAOS_WEAVER_ORIGIN.longForm} Institution: ${CHAOS_WEAVER_ORIGIN.institution.name}. ` +
      `Teaching phrase: "${CHAOS_WEAVER_ORIGIN.teachingPhrase.text}" (${CHAOS_WEAVER_ORIGIN.teachingPhrase.attribution}).`
  },
  philosophy: {
    coreTenet: CHAOS_WEAVER_ORIGIN.teachingPhrase.text,
    relationship: CHAOS_WEAVER_ORIGIN.institution.note,
    paradox: CHAOS_WEAVER_ORIGIN.crisis
  },
  currentCrisis: CHAOS_WEAVER_ORIGIN.crisis
};

export const CHAOS_WEAVER_SUBRACE_VARIANTS = {
  drall_fexric: {
    subraceName: 'Alchemite - Fex',
    title: 'The Sump Variance-Worker',
    status: 'proposed',
    reframe:
      'Alchemite variance containment around the Roulette Manifold and Sump workshops: apprenticeship ' +
      'means surviving a real anomaly and maintaining a finite stabilizing interface, not improvising one.',
    signatureAbility: {
      name: CHAOS_WEAVER_NATIVE_VARIANTS[0].edge.name,
      description:
        `${CHAOS_WEAVER_NATIVE_VARIANTS[0].edge.effect} ` +
        `Cost: ${CHAOS_WEAVER_NATIVE_VARIANTS[0].edge.cost.actionPoints} AP. ` +
        `Frequency: ${CHAOS_WEAVER_NATIVE_VARIANTS[0].edge.frequency}.`
    },
    signatureQuote: null,
    currentCrisisAngle: CHAOS_WEAVER_ORIGIN.crisis,
    acquisition: CHAOS_WEAVER_NATIVE_VARIANTS[0].acquisition,
    brokenStabilizer: CHAOS_WEAVER_NATIVE_VARIANTS[0].brokenStabilizer,
    manualNote: CHAOS_WEAVER_NATIVE_VARIANTS[0].edge.manualNote,
    requirements: [...CHAOS_WEAVER_NATIVE_VARIANTS[0].edge.requirements],
    cannot: [...CHAOS_WEAVER_NATIVE_VARIANTS[0].edge.cannot]
  }
};

export const CHAOS_WEAVER_RESTRICTIONS = {
  allowedSubraces: [],
  hardBlocks: [],
  narrativeUnlock: true,
  justification:
    'No ancestry is a hard block and ancestry alone is not competence. Access is a positive requirement: ' +
    'the recorded acquisition checks below, plus a table-confirmed stabilizer that is not broken.',
  acquisition: {
    note: CHAOS_WEAVER_NATIVE_VARIANTS[0].acquisition.note,
    records: CHAOS_WEAVER_ACQUISITION_RECORDS.map((record) => ({
      id: record.id,
      label: record.label,
      text: record.text,
      proposedOnly: record.proposedOnly
    }))
  }
};

/* ------------------------------------------------------------------ */
/* Resource system (data-only; the guide lives in resourceSystems/)    */
/* ------------------------------------------------------------------ */

const inputSymbolText = (record) => {
  const entries = record.tileRule?.inputSymbols || [];
  if (entries.length === 0) return '—';
  return entries
    .map((entry) => entry.symbol || (entry.anyOf ? entry.anyOf.join('/') : '?'))
    .join(' + ');
};

const zoneMovementText = (record) => {
  const rule = record.tileRule || {};
  if (!rule.count || rule.count === 0) return 'no tile movement';
  return `${rule.zoneFrom} → ${rule.zoneTo} × ${rule.count}`;
};

const sourceLabel = (record) =>
  record.source === 'core' ? 'Core' : record.source === 'talent' ? 'Talent active' : 'Optional';

export const CHAOS_WEAVER_RESOURCE_SYSTEM = {
  type: 'chaos-weaver-tiles',
  classId: CHAOS_WEAVER_CLASS_ID,
  title: 'Six Tiles, Four Zones',
  subtitle: 'Every ID in exactly one zone; every price and face published before it is paid.',
  summary:
    'Six exact IDs (S1, S2, M1, M2, F1, F2) each occupy exactly one zone: available, committed, bound or spent. ' +
    'Symbols never change; recovery is paid; one unresolved action and one anomaly at a time.',
  tileIds: [...CHAOS_WEAVER_TILE_IDS],
  tileSymbols: { ...CHAOS_WEAVER_TILE_SYMBOLS },
  zones: [...CHAOS_WEAVER_TILE_ZONES],
  rules: CHAOS_WEAVER_RESOURCE_RULES,
  settlement: CHAOS_WEAVER_SETTLEMENT_RULES,
  mechanics: {
    title: 'How the Zones Work',
    content:
      'Each of the six IDs occupies exactly one zone. **available** tiles may be chosen as inputs; **committed** tiles ' +
      'back an unresolved published action; **bound** tiles fuel a placed anomaly; **spent** tiles are used and only ' +
      'paid recovery may return them. A tile never changes symbol. Duplicate, foreign or missing IDs and contradictory ' +
      'pending/anomaly ownership are rejected as drafts, never repaired into a playable state.'
  },
  practicalExample: {
    title: 'A Full Fold Cycle',
    content:
      'Fixed pair of a Fracture action publishes one available F and one available S or M, both committed, then both ' +
      'spent after the retained face. Later, Fold the Odds costs 1 real AP to recover one or two spent IDs — never the ' +
      'committed or bound ones. A completed long rest, explicitly confirmed with nothing pending, returns all six to available.'
  },
  strategicConsiderations: {
    title: 'Strategic Considerations',
    content:
      'Recovery is a paid action, so the six-tile budget is the real clock of the class. Publishing both branches first ' +
      'makes every sample honest; the table always knows the denominator. One unresolved action and one anomaly at a time ' +
      'means sequencing matters more than any single roll.'
  },
  resourceBarExplanation: {
    title: 'The Six-Tile Display',
    content:
      'The display shows the six IDs in their zones and is driven by typed state, not by map pixels. The personal record ' +
      'starts uninitialized — there is no silent refill of six usable tiles — and every manual edit validates the whole ' +
      'candidate state before it is accepted. A rehearsal worksheet is never room authority.'
  },
  zoneTable: {
    title: 'The Four Zones',
    headers: ['Zone', 'Meaning', 'How tiles enter / leave'],
    rows: [
      ['available', 'Ready to be chosen as an input', 'Enters at a confirmed completed long rest or paid Fold'],
      ['committed', 'Backing an unresolved published action', 'Enters when the action is published; leaves to spent on settlement'],
      ['bound', 'Fueling a placed anomaly', 'Enters on placement; leaves to spent on trigger, endT+2 or 1-AP dismissal'],
      ['spent', 'Used and unavailable', 'Leaves only through Fold the Odds (1 AP, one or two IDs) or a confirmed completed long rest']
    ],
    footnote: 'A tile never changes symbol; invalid operations are atomically refused.'
  },
  activePricingTable: {
    title: 'Active Record Prices (49)',
    headers: ['Record', 'Price', 'Input symbols', 'Zone movement', 'Source'],
    rows: CHAOS_WEAVER_ACTIVE_SPELLS.map((record) => [
      record.name,
      `${record.resourceCost.actionPoints} AP`,
      inputSymbolText(record),
      zoneMovementText(record),
      sourceLabel(record)
    ]),
    footnote: 'Manual tabletop only: no AP, tile, movement or effect is applied automatically.'
  },
  faceMappingTable: {
    title: 'Published Face Mapping',
    headers: ['Case', 'Mapping', 'Rule'],
    rows: [
      ['Two committed IDs', 'd6: 1–3 first, 4–6 second', 'Sort committed IDs in S1, S2, M1, M2, F1, F2 order'],
      ['Three committed IDs', 'd6: 1–2 first, 3–4 second, 5–6 third', 'Retain the mapping before entering the face'],
      ['Four committed IDs', 'd4 direct', 'One die per ID'],
      ['Order', 'S1, S2, M1, M2, F1, F2', 'Never reorder after the pair is published'],
      ['Damage dice', 'Separate original dice', 'The selection face is never reused as damage']
    ],
    footnote: 'Uniform physical mapping is fixed before the face; no digital RNG is required.'
  },
  penaltyTable: {
    title: 'Penalties and Wards',
    headers: ['Case', 'Rule', 'Limit'],
    rows: [
      ['Same-source Fracture penalty', 'Refreshes its published expiry', 'Nearest expiry replaces, never extends'],
      ['Different actions', 'Largest feet reduction only', 'Minimum 0 remaining movement; used movement never refunds'],
      ['Wards', 'Strongest eligible C1 ward only', 'Stops the stated assigned Wyrd damage once, before temp HP'],
      ['Recovery', 'Fold the Odds: 1 AP', 'One or two spent IDs only; committed and bound are never recovered']
    ],
    footnote: 'Manual order rules: no fate-transfer or stacking interaction is inferred.'
  },
  playingInPerson: {
    title: 'Playing in Person',
    content:
      '**Zone board**: lay the six tokens on four labelled spaces — available, committed, bound, spent.\n\n' +
      '---\n\n' +
      '**Face tracking**: write the committed order in S1, S2, M1, M2, F1, F2 sequence and the d6 mapping before rolling; keep damage dice separate.\n\n' +
      '---\n\n' +
      '**Rest label**: only mark the completed long rest after every pending action and anomaly has settled. Short rests and reconnects never refill.'
  },
  manualOnly: true,
  notice: CHAOS_WEAVER_MANUAL_ONLY_NOTICE
};

/* ------------------------------------------------------------------ */
/* Assembly                                                            */
/* ------------------------------------------------------------------ */

const SPEC_BY_TREE = Object.fromEntries(
  CHAOS_WEAVER_SPECIALIZATIONS.specs.map((spec) => [spec.id, spec])
);

export const CHAOS_WEAVER_DATA = {
  id: CHAOS_WEAVER_CLASS_ID,
  name: CHAOS_WEAVER_DISPLAY_NAME,
  variantName: CHAOS_WEAVER_DISPLAY_NAME,
  icon: CHAOS_WEAVER_ICON,
  imageIcon: '/assets/icons/classes/chaos_weaver.png',
  role: 'Wyrd damage / uncertainty control',
  damageTypes: ['wyrd'],
  resource: 'Possibility Tiles',
  primaryStat: 'Intelligence',
  secondaryStat: 'Spirit',
  developmentStatus: CHAOS_WEAVER_DEVELOPMENT_STATUS,
  statusLabel: CHAOS_WEAVER_IDENTITY.statusLabel,
  manualOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  rulesetVersion: CHAOS_WEAVER_RULESET_VERSION,
  restrictions: CHAOS_WEAVER_RESTRICTIONS,
  classResource: {
    type: 'chaos-weaver-tiles',
    base: 0,
    max: CHAOS_WEAVER_TILE_IDS.length,
    generationNote:
      'No automatic generation. All six IDs are set available only at one explicitly confirmed completed long rest.'
  },
  equipment: {
    weapons: ['staff', 'dagger'],
    protectiveGear: ['light_ward', 'robes'],
    offHand: ['empty', 'tome']
  },
  subraceVariants: CHAOS_WEAVER_SUBRACE_VARIANTS,
  overview: CHAOS_WEAVER_OVERVIEW,
  characterCreation: {
    title: 'Chaos Weaver',
    subtitle: 'Variance Containment',
    description:
      'Chaos Weavers train by surviving a real anomaly and maintaining a finite interface. ' +
      'All strengths and downsides are published; nothing is executed automatically.',
    steps: [
      { step: 1, title: 'Choose your first optional', content: 'Pick exactly one level-1 optional action.' },
      { step: 2, title: 'Learn the zones', content: 'Six IDs, four zones, one zone each; no exchange.' },
      { step: 3, title: 'Confirm the manual contract', content: 'All outcomes are recorded and confirmed at the table.' }
    ]
  },
  specializations: CHAOS_WEAVER_SPECIALIZATIONS,
  spellPools: CHAOS_WEAVER_SPELL_POOLS,
  spells: CHAOS_WEAVER_PROJECTED_SPELLS,
  progression: {
    levelCap: CHAOS_WEAVER_PROGRESSION_RULES.levelCap,
    policy: CHAOS_WEAVER_PROGRESSION_POLICY,
    levels: CHAOS_WEAVER_PROGRESSION.map((row) => ({ ...row, newChoiceIds: [...row.newChoiceIds] }))
  },
  resourceSystem: CHAOS_WEAVER_RESOURCE_SYSTEM,
  talentTrees: CHAOS_WEAVER_TALENT_CAPACITY,
  specMetaById: SPEC_BY_TREE,
  sourceModules: {
    data: 'data/classes/chaosWeaverData.js',
    trees: 'data/talentTrees/chaosWeaver.js',
    rules: 'data/classes/chaosWeaverRules.js'
  }
};

export const CHAOS_WEAVER_INTEGRATION_MANIFEST = {
  classId: CHAOS_WEAVER_CLASS_ID,
  rulesetVersion: CHAOS_WEAVER_RULESET_VERSION,
  displayName: CHAOS_WEAVER_DISPLAY_NAME,
  developmentStatus: CHAOS_WEAVER_DEVELOPMENT_STATUS,
  activeCounts: { ...CHAOS_WEAVER_ACTIVE_COUNTS },
  uniqueAuthoredIdentities: CHAOS_WEAVER_ACTIVE_COUNTS.total + CHAOS_WEAVER_PASSIVE_SPELLS.length,
  passiveRecords: CHAOS_WEAVER_PASSIVE_SPELLS.length,
  talentNodes: CHAOS_WEAVER_TALENT_NODES.length,
  trees: CHAOS_WEAVER_TREES.length,
  treeIds: [...CHAOS_WEAVER_TREE_IDS],
  tileIds: [...CHAOS_WEAVER_TILE_IDS],
  zones: [...CHAOS_WEAVER_TILE_ZONES],
  ruleset: CHAOS_WEAVER_RULESET,
  activeSpellIds: CHAOS_WEAVER_ACTIVE_SPELLS.map((record) => record.id),
  passiveSpellIds: CHAOS_WEAVER_PASSIVE_SPELLS.map((record) => record.id)
};

export default CHAOS_WEAVER_DATA;
