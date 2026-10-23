const RULESET_VERSION = 'cr-review-r1';
const instant = { durationType: 'instant', durationValue: 0, durationUnit: 'instant' };
const noCooldown = { cooldownType: 'none', cooldownValue: 0 };
const selfTarget = { targetingType: 'self', rangeType: 'self', rangeDistance: 0, targetRestrictions: ['self'], maxTargets: 1 };

const target = (roles, maxTargets = 1, rangeDistance = 30) => ({
  targetingType: maxTargets > 1 ? 'multiple' : 'single',
  rangeType: 'ranged', rangeDistance, targetRestrictions: roles, maxTargets
});
const targetFor = kind => kind === 'self' ? { ...selfTarget }
  : kind === 'ally' ? target(['ally', 'self'])
    : kind === 'enemy' ? target(['enemy']) : target(['ally', 'enemy', 'self']);

const apCost = actionPoints => ({
  actionPoints, mana: 0, resourceTypes: actionPoints > 0 ? ['actionPoints'] : [],
  resourceValues: { actionPoints, mana: 0 }, useFormulas: {},
  components: ['somatic'], somaticText: 'Present the class focus and declare the exact operation before resolution.'
});

const gates = [
  [1, 0, []], [1, 0, []], [1, 0, []], [2, 5, ['p01']],
  [3, 10, ['p03']], [3, 10, ['p04']], [4, 15, ['p05', 'signature']], [4, 15, ['p06']],
  [5, 20, ['p07']], [5, 20, ['p08']], [6, 25, ['p09']], [6, 25, ['p10']],
  [7, 30, ['p11']], [8, 35, ['p12']], [9, 40, ['p13']], [10, 45, ['p14']]
];
const makeFlags = (classId, notice) => ({
  classId, rulesetVersion: RULESET_VERSION, authoredOnly: true, manualOnly: true,
  executionEnabled: false, applicationMode: 'manual-tabletop',
  automatedCapabilities: [], manualNotice: notice
});

const normalizeManifest = (spell, flags, className, source, treeId = null) => {
  const record = {
    ...spell, ...flags, class: className, source, specialization: treeId, treeId, categoryIds: [],
    tags: [...new Set([...(spell.typeConfig?.tags || []), spell.classId, 'manual-only', source])],
    typeConfig: {
      ...(spell.typeConfig || {}),
      tags: [...new Set([...(spell.typeConfig?.tags || []), spell.classId, 'manual-only', source])]
    },
    manualMechanics: {
      price: spell.resourceCost || { actionPoints: 0, mana: 0 },
      effects: [{ kind: 'manual-resource-program', operation: spell.classResourceProgram?.op || 'manual', executable: false }],
      executable: false
    },
    manualRequirements: [flags.manualNotice],
    sourceRefs: ['R1 review payload']
  };
  Object.defineProperty(record, 'sourceSpell', { value: spell, enumerable: false });
  return record;
};

const makeOptional = (flags, classId, className, resourceDomain, row) => ({
  ...flags, id: `cr1_${classId}_${row.suffix}`, class: className, name: row.name, level: row.level,
  specialization: null, treeId: null, source: 'optional', spellType: 'ACTION',
  icon: row.icon || 'Psychic/Psychic Telepathy',
  typeConfig: { school: row.school || 'wyrd', castTimeType: 'IMMEDIATE', tags: [classId, 'optional', 'manual-only'] },
  resourceCost: apCost(row.ap || 1),
  targetingConfig: row.targetingConfig || targetFor(row.target || 'ally'),
  effectTypes: row.effectTypes || ['utility'], damageConfig: row.damageConfig || null,
  durationConfig: row.durationConfig || instant, cooldownConfig: row.cooldownConfig || noCooldown,
  reactionTiming: null, savingThrow: null, conditions: row.conditions || [], area: null,
  description: row.description,
  classResourceProgram: row.op ? { version: 1, domain: resourceDomain, op: row.op, args: row.args || {} } : null,
  manualMechanics: { price: { actionPoints: row.ap || 1, mana: 0 }, effects: row.effects || [], executable: false },
  manualRequirements: [flags.manualNotice], sourceRefs: ['HeadQ-authored content lock']
});

const makeCapstone = (flags, classId, className, resourceDomain, row) => ({
  ...flags, id: `cr1_${classId}_${row.suffix}`, class: className, name: row.name, level: 10,
  specialization: row.treeId, treeId: row.treeId, source: 'talent-capstone', spellType: 'ACTION',
  icon: row.icon || 'Psychic/Psychic Telepathy',
  typeConfig: { school: row.school || 'wyrd', castTimeType: 'IMMEDIATE', tags: [classId, 'talent-capstone', 'manual-only'] },
  resourceCost: apCost(row.ap || 2),
  targetingConfig: row.targetingConfig || targetFor(row.target || 'ally'),
  effectTypes: row.effectTypes || ['utility'], damageConfig: row.damageConfig || null,
  durationConfig: row.durationConfig || instant, cooldownConfig: noCooldown,
  reactionTiming: null, savingThrow: null, conditions: row.conditions || [], area: null,
  description: row.description,
  classResourceProgram: { version: 1, domain: resourceDomain, op: row.op, args: row.args || {} },
  manualMechanics: { price: { actionPoints: row.ap || 2, mana: 0 }, effects: row.effects || [], executable: false },
  manualRequirements: [flags.manualNotice, 'Capstone: once per completed long rest.'], sourceRefs: ['HeadQ-authored content lock']
});

const buildTrees = ({ classId, trees, signatureNames, capstoneNames }) => trees.map(meta => {
  const nodeId = slot => slot === 'signature' ? meta.signatureNode
    : slot === 'capstone' ? meta.capstoneNode : `cr1_${classId}_${meta.short}_${slot}`;
  const nodes = meta.rows.map(([suffix, name, values, mechanic, text], index) => {
    const [minLevel, requiresPoints, predecessors] = gates[index];
    const slot = `p${String(index + 1).padStart(2, '0')}`;
    return {
      classId, rulesetVersion: RULESET_VERSION, authoredOnly: true, manualOnly: true,
      executionEnabled: false, applicationMode: 'manual-tabletop', automatedCapabilities: [],
      id: nodeId(slot), treeId: meta.id, name,
      passiveSpellId: `cr1_${classId}_${meta.short}_${suffix}`, grantId: null,
      maxRanks: 3, minLevel, requiresPoints, requires: predecessors.map(nodeId), requiresAll: true,
      column: index < 3 ? index : index === 3 ? 0 : index % 2 === 0 ? 0 : 2,
      row: minLevel - 1, effectText: text.replaceAll('{v}', values.join(' / ')), parameterKeys: [mechanic],
      rankValues: values.map((value, i) => ({
        rank: i + 1, text: text.replaceAll('{v}', String(value)), values: { [mechanic]: value }
      }))
    };
  });
  nodes.push(...[
    ['signature', meta.signatureId, 3, 10, ['p01', 'p02'], 2],
    ['capstone', meta.capstoneId, 10, 45, ['p15', 'signature'], 10]
  ].map(([slot, spell, minLevel, requiresPoints, predecessors, row]) => ({
    classId, rulesetVersion: RULESET_VERSION, authoredOnly: true, manualOnly: true,
    executionEnabled: false, applicationMode: 'manual-tabletop', automatedCapabilities: [],
    id: nodeId(slot), treeId: meta.id,
    name: slot === 'signature' ? signatureNames[spell] : capstoneNames[spell],
    grantId: `cr1_${classId}_${spell}`, passiveSpellId: null, maxRanks: 1,
    minLevel, requiresPoints, requires: predecessors.map(nodeId), requiresAll: true, column: 1, row,
    effectText: `Grant cr1_${classId}_${spell}; manual ACTION, no optional pick consumed.`,
    rankValues: [{ rank: 1, text: `Grant cr1_${classId}_${spell}.`, values: {} }]
  })));
  return {
    classId, rulesetVersion: RULESET_VERSION, authoredOnly: true, manualOnly: true,
    executionEnabled: false, applicationMode: 'manual-tabletop', automatedCapabilities: [],
    id: meta.id, name: meta.name, stem: meta.stem, short: meta.short,
    signature: meta.signatureId, capstone: meta.capstoneId,
    signatureNode: meta.signatureNode, capstoneNode: meta.capstoneNode, tagline: meta.tagline, meta, nodes
  };
});

const buildPassiveRecords = ({ classId, className, trees }) => trees.flatMap(tree => tree.nodes
  .filter(node => node.passiveSpellId)
  .map(node => ({
    classId, rulesetVersion: RULESET_VERSION, authoredOnly: true, manualOnly: true,
    executionEnabled: false, applicationMode: 'manual-tabletop', automatedCapabilities: [],
    id: node.passiveSpellId, class: className, name: node.name, level: node.minLevel,
    treeId: node.treeId, source: 'talent-passive', spellType: 'PASSIVE',
    description: `${node.effectText} Highest learned rank only; this grants no optional pick. Manual tabletop only.`,
    resourceCost: { actionPoints: 0, mana: 0 }, targetingConfig: { ...selfTarget },
    damageConfig: null, effectTypes: ['buff'], durationConfig: null, cooldownConfig: { ...noCooldown },
    reactionTiming: null, savingThrow: null, area: null, conditions: [], rankValues: node.rankValues,
    requires: {
      nodeId: node.id, requiresPoints: node.requiresPoints,
      predecessorNodeIds: node.requires, requiresAll: true, minLevel: node.minLevel
    },
    manualMechanics: { kind: 'ranked-modifier', rankValues: node.rankValues, executable: false },
    sourceRefs: ['HeadQ-authored content lock']
  })));

const projectRecord = ({ flags, classId, className, record, node }) => ({
  ...flags, id: record.id, name: record.name, class: className, level: record.level,
  source: `${classId}-${record.source}`, sourceRecordSource: record.source,
  spellType: record.spellType, icon: record.icon, description: record.description,
  specialization: node?.treeId || record.treeId || 'core', treeId: node?.treeId || record.treeId || null,
  typeConfig: record.typeConfig, resourceCost: record.resourceCost,
  targetingConfig: record.targetingConfig, effectTypes: record.effectTypes || [],
  damageConfig: record.damageConfig || null, durationConfig: record.durationConfig || null,
  cooldownConfig: record.cooldownConfig || { ...noCooldown },
  classResourceProgram: record.classResourceProgram || null,
  manualRequirements: record.manualRequirements || [flags.manualNotice],
  tags: [...new Set([classId, 'manual-only', record.source])], categoryIds: [],
  specialMechanics: {
    [classId]: {
      ...flags, sourceRecordId: record.id, authoredSpell: record.sourceSpell || record,
      rankValues: record.rankValues || null, requires: record.requires || null
    }
  }
});

const validator = (classId, errorsFor) => state => {
  const errors = errorsFor(state);
  return { classId, valid: errors.length === 0, initialized: state?.initialized === true, errors };
};

const projection = (classId, project) => (resource, isOwner = false) => {
  if (!resource || resource.initialized !== true || !resource.state) {
    return {
      classId, initialized: false, valid: false, isOwner: Boolean(isOwner),
      summary: 'Uninitialized manual resource. No value is invented.',
      errors: ['resource state is uninitialized']
    };
  }
  const result = project(resource.state, isOwner);
  return { classId, initialized: true, isOwner: Boolean(isOwner), valid: result.errors.length === 0, ...result };
};

const validateDeathcaller = state => {
  if (!state || typeof state !== 'object') return ['state must be an object'];
  const errors = [];
  if (state.capacityMax !== 2) errors.push('capacityMax must be 2');
  if (!Array.isArray(state.preparedPatterns)) errors.push('preparedPatterns must be an array');
  else if (state.preparedPatterns.length > 3) errors.push('preparedPatterns cannot exceed 3');
  if (!Array.isArray(state.manifestations)) errors.push('manifestations must be an array');
  else if (state.manifestations.length > 2) errors.push('manifestations cannot exceed 2');
  if (!Number.isInteger(state.ordersUsed) || state.ordersUsed < 0 || state.ordersUsed > 2) errors.push('ordersUsed must be 0..2');
  if (!Number.isInteger(state.questionsUsed) || state.questionsUsed < 0 || state.questionsUsed > 2) errors.push('questionsUsed must be 0..2');
  if (state.questionRestId !== null && typeof state.questionRestId !== 'string') errors.push('questionRestId must be null or a string');
  if (state.exhaustedUntilRest !== undefined && !Array.isArray(state.exhaustedUntilRest)) errors.push('exhaustedUntilRest must be an array');
  return errors;
};

const projectDeathcaller = (state, isOwner) => {
  const errors = validateDeathcaller(state);
  return {
    errors,
    summary: `${state.preparedPatterns?.length || 0}/3 patterns prepared; ${state.manifestations?.length || 0}/2 manifestations; ${state.ordersUsed || 0}/2 orders used.`,
    capacity: state.capacityMax, preparedCount: state.preparedPatterns?.length || 0,
    manifestationCount: state.manifestations?.length || 0, ordersUsed: state.ordersUsed,
    questionsUsed: state.questionsUsed,
    details: isOwner ? state : {
      preparedCount: state.preparedPatterns?.length || 0,
      manifestationCount: state.manifestations?.length || 0,
      capacity: state.capacityMax, ordersUsed: state.ordersUsed
    }
  };
};

const validateLichborne = state => {
  if (!state || typeof state !== 'object') return ['state must be an object'];
  const errors = [];
  if (!state.anchor || typeof state.anchor !== 'object') errors.push('anchor is required');
  else {
    if (!state.anchor.id) errors.push('anchor.id is required');
    if (!['intact', 'destroyed'].includes(state.anchor.status)) errors.push('anchor.status must be intact or destroyed');
    if (typeof state.anchor.location !== 'string' || !state.anchor.location.trim()) errors.push('anchor.location is required');
    if (state.anchor.ward !== null && typeof state.anchor.ward !== 'object') errors.push('anchor.ward must be null or an object');
  }
  if (!Number.isInteger(state.integrity) || state.integrity < 0 || state.integrity > 12) errors.push('integrity must be 0..12');
  if (!Number.isInteger(state.undeathStage) || state.undeathStage < 0 || state.undeathStage > 2) errors.push('undeathStage must be 0..2');
  if (!Array.isArray(state.preparedTraits) || state.preparedTraits.length !== 2) errors.push('exactly two prepared traits are required');
  if (!Array.isArray(state.activeTraits)) errors.push('activeTraits must be an array');
  else if (state.activeTraits.length > state.undeathStage) errors.push('activeTraits cannot exceed undeathStage');
  if (!['active', 'dormant', 'dead'].includes(state.lifeState)) errors.push('lifeState must be active, dormant or dead');
  if (state.suppressedUntilOwnTurn !== null && state.suppressedUntilOwnTurn !== true) errors.push('suppressedUntilOwnTurn must be null or true');
  return errors;
};

const projectLichborne = (state, isOwner) => {
  const errors = validateLichborne(state);
  return {
    errors,
    summary: `Anchor ${state.anchor?.status || 'unknown'}; integrity ${state.integrity}/12; undeath stage ${state.undeathStage}; ${state.lifeState}.`,
    anchor: isOwner ? state.anchor : { status: state.anchor?.status || 'unknown' },
    integrity: state.integrity, maxIntegrity: 12, undeathStage: state.undeathStage,
    preparedTraitCount: state.preparedTraits?.length || 0,
    activeTraitCount: state.activeTraits?.length || 0, lifeState: state.lifeState,
    ...(isOwner ? {
      preparedTraits: state.preparedTraits,
      activeTraits: state.activeTraits,
      suppressedUntilOwnTurn: state.suppressedUntilOwnTurn
    } : {})
  };
};

export const makeCr1ResourceSystem = ({ classId, id, name, shortName, type, description, mechanics, tooltip, rules }) => ({
  classId, rulesetVersion: RULESET_VERSION,
  resourceDefinition: {
    id, name, shortName, type, description,
    visual: { type, baseColor: '#2f3b45', activeColor: '#8fa3bf' },
    mechanics, tooltip
  },
  rules,
  validate: validator(classId, classId === 'deathcaller' ? validateDeathcaller : validateLichborne),
  project: projection(classId, classId === 'deathcaller' ? projectDeathcaller : projectLichborne)
});

export const createCr1Package = ({
  classId, className, icon, manualNotice, description, overview, manifestSpells,
  coreIds, optionalPayloadIds, optionalRows, capstones, trees, signatureNames,
  capstoneNames, resource, heritageRecommendation, acquisitionRequirements
}) => {
  const flags = makeFlags(classId, manualNotice);
  const manifestById = Object.fromEntries(manifestSpells.map(spell => [spell.id, spell]));
  const builtTrees = buildTrees({ classId, trees, signatureNames, capstoneNames });
  const nodeForRecord = record => builtTrees.flatMap(tree => tree.nodes)
    .find(node => node.grantId === record.id || node.passiveSpellId === record.id);
  const coreRecords = coreIds.map(id => normalizeManifest(manifestById[id], flags, className, 'core'));
  const optionalRecords = [
    ...optionalPayloadIds.map(id => normalizeManifest(manifestById[id], flags, className, 'optional')),
    ...optionalRows.map(row => makeOptional(flags, classId, className, resource.resourceDefinition.id, row))
  ];
  const signatureRecords = builtTrees.flatMap(tree => tree.nodes.filter(node => node.grantId && node.minLevel === 3))
    .map(node => normalizeManifest(manifestById[node.grantId], flags, className, 'talent-signature', node.treeId));
  const capstoneRecords = capstones.map(row => makeCapstone(flags, classId, className, resource.resourceDefinition.id, row));
  const talentActives = [...signatureRecords, ...capstoneRecords];
  const passiveRecords = buildPassiveRecords({ classId, className, trees: builtTrees });
  const authoredRecords = [...coreRecords, ...optionalRecords, ...talentActives, ...passiveRecords];
  const projectedSpells = authoredRecords.map(record => projectRecord({
    flags, classId, className, record, node: nodeForRecord(record)
  }));
  const projectedById = Object.fromEntries(projectedSpells.map(spell => [spell.id, spell]));
  const spellPools = Object.fromEntries(Array.from({ length: 10 }, (_, index) => {
    const level = index + 1;
    return [level, optionalRecords.filter(spell => spell.level === level).map(spell => spell.id)];
  }));
  const progressionPolicy = {
    classId, rulesetVersion: RULESET_VERSION, levelCap: 10, startingSpellPicks: 1,
    optionalPicksPerLevel: 1, allowEarlierUnchosen: true,
    grantedCoreSpellIds: coreRecords.map(spell => spell.id), randomizeStartingSpells: false,
    autoTopUpOnLoad: false, talentActivesAreGrants: true, manualOnly: true
  };
  const data = {
    name: className, classId, rulesetVersion: RULESET_VERSION, icon, description,
    overview, spells: projectedSpells, spellPools,
    progression: {
      levelCap: 10, policy: progressionPolicy,
      levels: Array.from({ length: 10 }, (_, index) => ({
        level: index + 1, newChoiceIds: spellPools[index + 1],
        optionalPicks: 1, talentBudget: (index + 1) * 5
      }))
    },
    talentTrees: {
      trees: 3, nodes: 54,
      perTreeRanks: builtTrees.map(tree => ({ treeId: tree.id, maxRanks: tree.nodes.reduce((total, node) => total + node.maxRanks, 0) })),
      totalRankCapacity: 150, characterPointCap: 50
    },
    resourceSystem: resource,
    restrictions: {
      allowedSubraces: [], hardBlocks: [], narrativeUnlock: true,
      justification: 'HeadQ-review-R1 proposed class; acquisition records are required. No native heritage effect is registered.',
      acquisition: { status: 'proposed', records: acquisitionRequirements }
    },
    heritageRecommendation, heritageEffectsImplemented: false, nativeAccess: []
  };
  const manifest = {
    ...flags, contentLock: 'HeadQ Deathcaller/Lichborne complete content lock',
    optional: optionalRecords.map(record => record.id), core: coreRecords.map(record => record.id),
    talentActives: talentActives.map(record => record.id), passives: passiveRecords.map(record => record.id),
    records: authoredRecords.map(record => ({
      id: record.id, name: record.name, level: record.level, source: record.source,
      treeId: nodeForRecord(record)?.treeId || null, ap: record.resourceCost.actionPoints, mana: record.resourceCost.mana || 0
    })),
    nodes: builtTrees.flatMap(tree => tree.nodes).map(node => ({
      id: node.id, treeId: node.treeId, spellId: node.grantId || node.passiveSpellId,
      ranks: node.maxRanks, minimumLevel: node.minLevel, requiresPoints: node.requiresPoints,
      prerequisites: node.requires
    })),
    uniqueRecords: authoredRecords.length, activeRecords: 48, passiveRecords: 48,
    talentNodes: 54, talentCapacity: data.talentTrees, nativeAccess: [],
    acquisitionRequirements: acquisitionRequirements.map(record => record.id),
    heritageEffectsImplemented: false, resourceRules: resource.rules,
    trees: builtTrees.map(tree => tree.id), dependencies: ['CR-R1', 'CR-E1', 'manual-tabletop'],
    automaticConversion: false
  };
  return {
    data, manifest, flags, trees: builtTrees, nodes: builtTrees.flatMap(tree => tree.nodes),
    coreRecords, optionalRecords, talentActives, passiveRecords, authoredRecords,
    projectedSpells, projectedById, spellPools, progressionPolicy, nodeForRecord
  };
};

export const pruneCr1Talents = (talents, characterLevel, nodes) => {
  const ranks = talents && typeof talents === 'object' ? { ...talents } : {};
  const level = Number.isInteger(characterLevel) ? Math.max(1, characterLevel) : 10;
  const nodeById = Object.fromEntries(nodes.map(node => [node.id, node]));
  Object.keys(ranks).forEach(nodeId => {
    const node = nodeById[nodeId];
    if (!node || !Number.isInteger(ranks[nodeId]) || ranks[nodeId] < 1 || ranks[nodeId] > node.maxRanks) delete ranks[nodeId];
  });
  const treePoints = treeId => nodes.filter(node => node.treeId === treeId)
    .reduce((total, node) => total + (ranks[node.id] || 0), 0);
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of nodes) {
      const rank = ranks[node.id];
      if (!rank) continue;
      const gatePoints = treePoints(node.treeId) - rank;
      const predecessorMissing = node.requires.some(id => {
        const predecessor = nodeById[id];
        return !predecessor || (ranks[id] || 0) !== predecessor.maxRanks;
      });
      if (node.minLevel > level || gatePoints < node.requiresPoints || predecessorMissing) {
        delete ranks[node.id];
        changed = true;
      }
    }
  }
  const budget = Math.min(50, level * 5);
  let guard = 0;
  while (Object.values(ranks).reduce((total, rank) => total + rank, 0) > budget && guard < 200) {
    guard += 1;
    let target = null;
    nodes.forEach(node => {
      if (!ranks[node.id]) return;
      if (target === null || node.minLevel >= nodeById[target].minLevel) target = node.id;
    });
    if (target === null) break;
    ranks[target] -= 1;
    if (ranks[target] === 0) delete ranks[target];
    changed = true;
    while (changed) {
      changed = false;
      for (const node of nodes) {
        const rank = ranks[node.id];
        if (!rank) continue;
        const gatePoints = treePoints(node.treeId) - rank;
        const predecessorMissing = node.requires.some(id => {
          const predecessor = nodeById[id];
          return !predecessor || (ranks[id] || 0) !== predecessor.maxRanks;
        });
        if (node.minLevel > level || gatePoints < node.requiresPoints || predecessorMissing) {
          delete ranks[node.id];
          changed = true;
        }
      }
    }
  }
  return ranks;
};
