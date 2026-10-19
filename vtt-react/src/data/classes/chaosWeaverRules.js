/*
 * CLASS-C1 — Chaos Weaver: pure class-local rules, validation and rehearsal
 * planning.
 *
 * Everything here is a pure data transformation over the authored records in
 * chaosWeaverData.js and talentTrees/chaosWeaver.js. It performs no RNG, no
 * server/client writes, no payments, no effect application and no scheduling:
 * a rehearsal session is a manual worksheet the table fills in, and every
 * transition returns a new immutable state or an explicit error list.
 */

import {
  CHAOS_WEAVER_CLASS_ID,
  CHAOS_WEAVER_RULESET_VERSION,
  CHAOS_WEAVER_TILE_IDS,
  CHAOS_WEAVER_TILE_SYMBOLS,
  CHAOS_WEAVER_TILE_ZONES,
  CHAOS_WEAVER_ACTIVE_SPELLS,
  CHAOS_WEAVER_SPELLS_BY_ID,
  CHAOS_WEAVER_OPTIONAL_SPELLS,
  CHAOS_WEAVER_CORE_SPELLS,
  CHAOS_WEAVER_TALENT_ACTIVE_SPELLS,
  CHAOS_WEAVER_PROGRESSION,
  CHAOS_WEAVER_RESOURCE_RULES,
  CHAOS_WEAVER_NATIVE_VARIANTS,
  CHAOS_WEAVER_IDENTITY,
  CHAOS_WEAVER_ORIGIN,
  CHAOS_WEAVER_ACQUISITION_RECORDS,
  CHAOS_WEAVER_RULESET,
  CHAOS_WEAVER_SETTLEMENT_RULES
} from './chaosWeaverData';
import {
  CHAOS_WEAVER_TREES,
  CHAOS_WEAVER_TALENT_NODES,
  CHAOS_WEAVER_TALENT_NODES_BY_ID,
  CHAOS_WEAVER_PASSIVE_SPELLS
} from '../talentTrees/chaosWeaver';

/* ------------------------------------------------------------------ */
/* Small shared helpers                                               */
/* ------------------------------------------------------------------ */

const isPlainObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const missingFields = (record, fields) => fields.filter((field) => !(field in record));

const extraFields = (record, fields) =>
  Object.keys(record).filter((field) => !fields.includes(field));

export const deepEqual = (left, right) => {
  if (left === right) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
    return left.every((entry, index) => deepEqual(entry, right[index]));
  }
  if (isPlainObject(left) && isPlainObject(right)) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) return false;
    return leftKeys.every((key) => key in right && deepEqual(left[key], right[key]));
  }
  return false;
};

/* ------------------------------------------------------------------ */
/* Closed record profile                                              */
/* ------------------------------------------------------------------ */

export const C1_RECORD_FIELDS = [
  'id',
  'classId',
  'rulesetVersion',
  'name',
  'level',
  'source',
  'treeId',
  'spellType',
  'icon',
  'resourceCost',
  'tileRule',
  'target',
  'branchRule',
  'outcome',
  'timing',
  'damage',
  'reaction',
  'savingThrow',
  'conditions',
  'area',
  'continuation',
  'rankValues',
  'requires',
  'effectText',
  'sourceRefs',
  'authoredOnly',
  'executionEnabled',
  'applicationMode',
  'automatedCapabilities',
  'manualRequirements'
];

export const C1_TILE_RULE_FIELDS = ['inputSymbols', 'zoneFrom', 'zoneTo', 'count', 'spendAllPrimary'];
export const C1_TARGET_FIELDS = ['roles', 'rangeFeet', 'maxSubjects'];
export const C1_TIMING_FIELDS = ['use', 'expiry', 'oncePerRest'];
export const C1_RESOURCE_COST_FIELDS = ['actionPoints', 'mana'];

const C1_OUTCOME_FIELDS = ['damage', 'ward', 'movement', 'penalty', 'note'];
const C1_WARD_FIELDS = ['amount', 'until', 'eventLimit', 'appliesTo'];
const C1_MOVEMENT_FIELDS = ['kind', 'feet', 'until', 'usesRemainingMovement', 'optional'];
const C1_MOVEMENT_KINDS = ['step', 'displacement', 'penalty', 'ends-remaining-movement'];
const C1_CONTINUATION_FIELDS = [
  'kind',
  'afterPrimaryResult',
  'choices',
  'reservationRule',
  'singleFollowUpRule',
  'chooseBeforeCommit'
];
const C1_CONTINUATION_CHOICE_FIELDS = [
  'id',
  'tileSymbols',
  'effectText',
  'requiresTalentId',
  'baseFeet',
  'baseWard'
];

const validateOutcomeShape = (outcome, label, errors) => {
  if (!isPlainObject(outcome)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const missing = missingFields(outcome, C1_OUTCOME_FIELDS);
  if (missing.length > 0) errors.push(`${label} missing: ${missing.join(', ')}`);
  const extra = extraFields(outcome, C1_OUTCOME_FIELDS);
  if (extra.length > 0) errors.push(`${label} unknown fields: ${extra.join(', ')}`);
  if (outcome.damage !== null) {
    if (!isPlainObject(outcome.damage) || typeof outcome.damage.formula !== 'string') {
      errors.push(`${label}.damage must be null or a formula object`);
    }
  }
  if (outcome.ward !== null) {
    if (!isPlainObject(outcome.ward)) {
      errors.push(`${label}.ward must be null or an object`);
    } else {
      const wardExtra = extraFields(outcome.ward, C1_WARD_FIELDS);
      if (wardExtra.length > 0) errors.push(`${label}.ward unknown fields: ${wardExtra.join(', ')}`);
      const wardMissing = missingFields(outcome.ward, C1_WARD_FIELDS);
      if (wardMissing.length > 0) errors.push(`${label}.ward missing: ${wardMissing.join(', ')}`);
    }
  }
  if (outcome.movement !== null) {
    if (!isPlainObject(outcome.movement)) {
      errors.push(`${label}.movement must be null or an object`);
    } else {
      const movementExtra = extraFields(outcome.movement, C1_MOVEMENT_FIELDS);
      if (movementExtra.length > 0) errors.push(`${label}.movement unknown fields: ${movementExtra.join(', ')}`);
      const movementMissing = missingFields(outcome.movement, C1_MOVEMENT_FIELDS);
      if (movementMissing.length > 0) errors.push(`${label}.movement missing: ${movementMissing.join(', ')}`);
      if (!C1_MOVEMENT_KINDS.includes(outcome.movement.kind)) {
        errors.push(`${label}.movement.kind invalid`);
      }
    }
  }
  if (outcome.penalty !== null) {
    if (!isPlainObject(outcome.penalty)) {
      errors.push(`${label}.penalty must be null or an object`);
    } else {
      const penaltyMissing = missingFields(outcome.penalty, C1_MOVEMENT_FIELDS);
      if (penaltyMissing.length > 0) errors.push(`${label}.penalty missing: ${penaltyMissing.join(', ')}`);
      if (outcome.penalty.kind !== 'penalty') errors.push(`${label}.penalty.kind must be penalty`);
    }
  }
  if (typeof outcome.note !== 'string') errors.push(`${label}.note must be a string`);
};

export const validateRecordProfile = (record) => {
  const errors = [];
  if (!isPlainObject(record)) {
    return { ok: false, errors: ['record is not an object'], extra: [] };
  }
  const missing = missingFields(record, C1_RECORD_FIELDS);
  if (missing.length > 0) errors.push(`missing fields: ${missing.join(', ')}`);
  const extra = extraFields(record, C1_RECORD_FIELDS);
  if (extra.length > 0) errors.push(`unknown fields prevent C1 validation: ${extra.join(', ')}`);
  if (record.classId !== CHAOS_WEAVER_CLASS_ID) errors.push('classId mismatch');
  if (record.rulesetVersion !== CHAOS_WEAVER_RULESET_VERSION) errors.push('rulesetVersion mismatch');
  if (record.authoredOnly !== true) errors.push('authoredOnly must be true');
  if (record.executionEnabled !== false) errors.push('executionEnabled must be false');
  if (record.applicationMode !== 'manual-tabletop') errors.push('applicationMode must be manual-tabletop');
  if (!Array.isArray(record.automatedCapabilities) || record.automatedCapabilities.length !== 0) {
    errors.push('automatedCapabilities must be an empty array');
  }
  if (!Array.isArray(record.manualRequirements) || record.manualRequirements.length === 0) {
    errors.push('manualRequirements must be a non-empty array');
  }
  if (!isPlainObject(record.resourceCost)) {
    errors.push('resourceCost missing');
  } else {
    const costMissing = missingFields(record.resourceCost, C1_RESOURCE_COST_FIELDS);
    if (costMissing.length > 0) errors.push(`resourceCost missing: ${costMissing.join(', ')}`);
    const costExtra = extraFields(record.resourceCost, C1_RESOURCE_COST_FIELDS);
    if (costExtra.length > 0) errors.push(`resourceCost unknown fields: ${costExtra.join(', ')}`);
    if (!Number.isInteger(record.resourceCost.actionPoints) || record.resourceCost.actionPoints < 0) {
      errors.push('resourceCost.actionPoints must be a non-negative integer');
    }
    if (record.resourceCost.mana !== 0) errors.push('resourceCost.mana must be exactly 0');
  }
  if (!isPlainObject(record.tileRule)) {
    errors.push('tileRule missing');
  } else {
    const ruleMissing = missingFields(record.tileRule, C1_TILE_RULE_FIELDS);
    if (ruleMissing.length > 0) errors.push(`tileRule missing: ${ruleMissing.join(', ')}`);
    const ruleExtra = extraFields(record.tileRule, C1_TILE_RULE_FIELDS);
    if (ruleExtra.length > 0) errors.push(`tileRule unknown fields: ${ruleExtra.join(', ')}`);
    if (!Array.isArray(record.tileRule.inputSymbols)) errors.push('tileRule.inputSymbols must be an array');
    if (!Number.isInteger(record.tileRule.count) || record.tileRule.count < 0) {
      errors.push('tileRule.count must be a non-negative integer');
    }
    if (typeof record.tileRule.spendAllPrimary !== 'boolean') errors.push('tileRule.spendAllPrimary must be boolean');
    const zoneFrom = record.tileRule.zoneFrom;
    const zoneTo = record.tileRule.zoneTo;
    if (zoneFrom !== null && !CHAOS_WEAVER_TILE_ZONES.includes(zoneFrom)) errors.push('tileRule.zoneFrom invalid');
    if (zoneTo !== null && !CHAOS_WEAVER_TILE_ZONES.includes(zoneTo)) errors.push('tileRule.zoneTo invalid');
    if (record.tileRule.count === 0 && zoneTo !== null) errors.push('zero-count tile rules must have null zoneTo');
    if (record.tileRule.count > 0 && (zoneFrom === null || zoneTo === null)) {
      errors.push('tile costs must declare zoneFrom and zoneTo');
    }
  }
  if (!isPlainObject(record.target)) {
    errors.push('target missing');
  } else {
    const targetMissing = missingFields(record.target, C1_TARGET_FIELDS);
    if (targetMissing.length > 0) errors.push(`target missing: ${targetMissing.join(', ')}`);
    const targetExtra = extraFields(record.target, C1_TARGET_FIELDS);
    if (targetExtra.length > 0) errors.push(`target unknown fields: ${targetExtra.join(', ')}`);
    if (!Array.isArray(record.target.roles)) errors.push('target.roles must be an array');
    if (!Number.isInteger(record.target.rangeFeet) || record.target.rangeFeet < 0) {
      errors.push('target.rangeFeet must be a non-negative integer');
    }
    if (!Number.isInteger(record.target.maxSubjects) || record.target.maxSubjects < 0) {
      errors.push('target.maxSubjects must be a non-negative integer');
    }
  }
  if (!isPlainObject(record.timing)) {
    errors.push('timing missing');
  } else {
    const timingMissing = missingFields(record.timing, C1_TIMING_FIELDS);
    if (timingMissing.length > 0) errors.push(`timing missing: ${timingMissing.join(', ')}`);
    const timingExtra = extraFields(record.timing, C1_TIMING_FIELDS);
    if (timingExtra.length > 0) errors.push(`timing unknown fields: ${timingExtra.join(', ')}`);
    if (record.timing.use !== 'own-turn' && record.timing.use !== 'passive') errors.push('timing.use invalid');
    if (typeof record.timing.oncePerRest !== 'boolean') errors.push('timing.oncePerRest must be boolean');
    if (record.timing.expiry !== null && typeof record.timing.expiry !== 'string') {
      errors.push('timing.expiry must be null or a string');
    }
  }
  if (record.branchRule !== null) {
    if (!isPlainObject(record.branchRule)) {
      errors.push('branchRule must be null or an object');
    } else {
      if (record.branchRule.selection !== 'uniform-by-primary-tile-id') {
        errors.push('branchRule.selection must be uniform-by-primary-tile-id');
      }
      if (typeof record.branchRule.sampleNote !== 'string') errors.push('branchRule.sampleNote must be a string');
      if (!isPlainObject(record.branchRule.outcomes)) {
        errors.push('branchRule.outcomes must be an object');
      } else {
        const symbols = Object.keys(record.branchRule.outcomes);
        if (symbols.length === 0) errors.push('branchRule.outcomes must declare at least one branch');
        symbols.forEach((symbol) => {
          if (!['S', 'M', 'F'].includes(symbol)) errors.push(`branchRule.outcomes unknown symbol ${symbol}`);
          else validateOutcomeShape(record.branchRule.outcomes[symbol], `branchRule.outcomes.${symbol}`, errors);
        });
      }
    }
  }
  if (record.damage !== null) {
    if (!isPlainObject(record.damage) || typeof record.damage.formula !== 'string') {
      errors.push('damage must be null or a formula object');
    }
  }
  if (record.outcome !== null) {
    if (!isPlainObject(record.outcome)) {
      errors.push('outcome must be null or an object');
    } else {
      validateOutcomeShape(record.outcome, 'outcome', errors);
      if (record.branchRule !== null) {
        errors.push('outcome is only valid on deterministic records (branchRule null)');
      }
      if (record.damage === null && record.outcome.damage !== null) {
        errors.push('outcome.damage requires a deterministic record damage');
      }
      if (record.damage !== null && !deepEqual(record.outcome.damage, record.damage)) {
        errors.push('outcome.damage must retain the authored deterministic damage');
      }
    }
  }
  if (record.continuation !== null) {
    if (!isPlainObject(record.continuation)) {
      errors.push('continuation must be null or an object');
    } else {
      const continuationExtra = extraFields(record.continuation, C1_CONTINUATION_FIELDS);
      if (continuationExtra.length > 0) {
        errors.push(`continuation unknown fields: ${continuationExtra.join(', ')}`);
      }
      const continuationMissing = missingFields(record.continuation, C1_CONTINUATION_FIELDS);
      if (continuationMissing.length > 0) {
        errors.push(`continuation missing: ${continuationMissing.join(', ')}`);
      }
      if (!Array.isArray(record.continuation.choices) || record.continuation.choices.length === 0) {
        errors.push('continuation.choices must be a non-empty array');
      } else {
        record.continuation.choices.forEach((choice, index) => {
          if (!isPlainObject(choice)) {
            errors.push(`continuation.choices[${index}] must be an object`);
            return;
          }
          const choiceKeys = Object.keys(choice);
          const choiceMissing = C1_CONTINUATION_CHOICE_FIELDS.filter(
            (field) => !choiceKeys.includes(field) && field !== 'baseFeet' && field !== 'baseWard'
          );
          if (choiceMissing.length > 0) {
            errors.push(`continuation.choices[${index}] missing: ${choiceMissing.join(', ')}`);
          }
          const choiceExtra = extraFields(choice, C1_CONTINUATION_CHOICE_FIELDS);
          if (choiceExtra.length > 0) {
            errors.push(`continuation.choices[${index}] unknown fields: ${choiceExtra.join(', ')}`);
          }
          if (!Array.isArray(choice.tileSymbols) || choice.tileSymbols.length === 0) {
            errors.push(`continuation.choices[${index}].tileSymbols must be a non-empty array`);
          }
          if (choice.requiresTalentId !== null && typeof choice.requiresTalentId !== 'string') {
            errors.push(`continuation.choices[${index}].requiresTalentId must be null or a node ID`);
          }
          if ('baseFeet' in choice && !Number.isInteger(choice.baseFeet)) {
            errors.push(`continuation.choices[${index}].baseFeet must be an integer`);
          }
          if (choice.baseFeet === undefined && choice.baseWard === undefined) {
            errors.push(`continuation.choices[${index}] must declare baseFeet or baseWard`);
          }
          if ('baseWard' in choice && !Number.isInteger(choice.baseWard)) {
            errors.push(`continuation.choices[${index}].baseWard must be an integer`);
          }
        });
      }
    }
  }
  if (record.area !== null) {
    if (!isPlainObject(record.area)) {
      errors.push('area must be null or an object');
    } else {
      if (!['anomaly', 'inert-preservation'].includes(record.area.kind)) {
        errors.push('area.kind must be anomaly or inert-preservation');
      }
      if (!Number.isInteger(record.area.radiusFeet) || record.area.radiusFeet < 0) {
        errors.push('area.radiusFeet must be a non-negative integer');
      }
      if (!Number.isInteger(record.area.placementRangeFeet) || record.area.placementRangeFeet < 0) {
        errors.push('area.placementRangeFeet must be a non-negative integer');
      }
      if (typeof record.area.trigger !== 'string') errors.push('area.trigger must be a string');
      if (!isPlainObject(record.area.dismissal)) {
        errors.push('area.dismissal missing');
      } else if (!Number.isInteger(record.area.dismissal.costAP) || record.area.dismissal.costAP < 0) {
        errors.push('area.dismissal.costAP must be a non-negative integer');
      }
      if (record.area.branches !== null) {
        if (!isPlainObject(record.area.branches)) {
          errors.push('area.branches must be null or an object');
        } else {
          Object.keys(record.area.branches).forEach((symbol) => {
            if (!['S', 'M', 'F'].includes(symbol)) errors.push(`area.branches unknown symbol ${symbol}`);
            else validateOutcomeShape(record.area.branches[symbol], `area.branches.${symbol}`, errors);
          });
        }
      }
    }
  }
  if (record.rankValues !== null) {
    if (!Array.isArray(record.rankValues) || record.rankValues.length === 0) {
      errors.push('rankValues must be null or a non-empty array');
    } else {
      record.rankValues.forEach((entry, index) => {
        if (!isPlainObject(entry) || !Number.isInteger(entry.rank) || typeof entry.text !== 'string') {
          errors.push(`rankValues[${index}] must be a rank/text entry`);
        } else if (!isPlainObject(entry.values)) {
          errors.push(`rankValues[${index}].values must be an object`);
        }
      });
    }
  }
  if (record.requires !== null) {
    if (!isPlainObject(record.requires)) {
      errors.push('requires must be null or an object');
    } else {
      if (typeof record.requires.nodeId !== 'string') errors.push('requires.nodeId must be a string');
      if (!Number.isInteger(record.requires.requiresPoints) || record.requires.requiresPoints < 0) {
        errors.push('requires.requiresPoints must be a non-negative integer');
      }
      if (record.requires.requiresAll !== true) errors.push('requires.requiresAll must be true');
      if (!Array.isArray(record.requires.predecessorNodeIds)) {
        errors.push('requires.predecessorNodeIds must be an array');
      }
      if (!Number.isInteger(record.requires.minLevel) || record.requires.minLevel < 1) {
        errors.push('requires.minLevel must be a positive integer');
      }
    }
  }
  return { ok: errors.length === 0, errors, extra };
};

export const ALL_CHAOS_WEAVER_RECORDS = [
  ...CHAOS_WEAVER_ACTIVE_SPELLS,
  ...CHAOS_WEAVER_PASSIVE_SPELLS
];

export const validateContentPackage = () => {
  const errors = [];
  const ids = ALL_CHAOS_WEAVER_RECORDS.map((record) => record.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) errors.push(`duplicate record IDs: ${[...new Set(duplicateIds)].join(', ')}`);
  ALL_CHAOS_WEAVER_RECORDS.forEach((record) => {
    const result = validateRecordProfile(record);
    if (!result.ok) errors.push(`${record.id}: ${result.errors.join('; ')}`);
  });
  CHAOS_WEAVER_ACTIVE_SPELLS.forEach((record) => {
    if (record.treeId !== null && !CHAOS_WEAVER_TREES.some((tree) => tree.id === record.treeId)) {
      errors.push(`${record.id}: treeId ${record.treeId} does not resolve`);
    }
    if (record.requires !== null) {
      const node = CHAOS_WEAVER_TALENT_NODES_BY_ID[record.requires.nodeId];
      if (!node) {
        errors.push(`${record.id}: grant node ${record.requires.nodeId} does not resolve`);
      } else if (node.grantId !== record.id) {
        errors.push(`${record.id}: node ${node.id} grants ${node.grantId}`);
      }
    }
  });
  CHAOS_WEAVER_PASSIVE_SPELLS.forEach((record) => {
    const node = CHAOS_WEAVER_TALENT_NODES_BY_ID[record.requires.nodeId];
    if (!node) errors.push(`${record.id}: node missing`);
    else if (node.maxRanks !== 3) errors.push(`${record.id}: node is not a three-rank passive`);
  });
  const levelOptions = CHAOS_WEAVER_PROGRESSION.map((level) => ({
    level: level.level,
    options: CHAOS_WEAVER_OPTIONAL_SPELLS.filter((record) => record.level === level.level),
    declared: level.newChoiceIds
  }));
  levelOptions.forEach((entry) => {
    if (entry.options.length !== entry.declared.length) {
      errors.push(`level ${entry.level}: declared ${entry.declared.length} options, authored ${entry.options.length}`);
    }
    entry.options.forEach((record, index) => {
      if (entry.declared[index] !== record.id) {
        errors.push(`level ${entry.level}: declared option order mismatch at index ${index}`);
      }
    });
  });
  return {
    ok: errors.length === 0,
    errors,
    counts: {
      optional: CHAOS_WEAVER_OPTIONAL_SPELLS.length,
      core: CHAOS_WEAVER_CORE_SPELLS.length,
      talentActives: CHAOS_WEAVER_TALENT_ACTIVE_SPELLS.length,
      passives: CHAOS_WEAVER_PASSIVE_SPELLS.length,
      total: ALL_CHAOS_WEAVER_RECORDS.length,
      nodes: CHAOS_WEAVER_TALENT_NODES.length,
      trees: CHAOS_WEAVER_TREES.length
    }
  };
};

/* ------------------------------------------------------------------ */
/* Four-zone tile conservation                                        */
/* ------------------------------------------------------------------ */

const tileOrderIndex = (id) => CHAOS_WEAVER_TILE_IDS.indexOf(id);

export const sortTileIds = (ids) => [...ids].sort((a, b) => tileOrderIndex(a) - tileOrderIndex(b));

export const createTileState = () => ({
  version: 1,
  rulesetVersion: CHAOS_WEAVER_RULESET_VERSION,
  available: [...CHAOS_WEAVER_TILE_IDS],
  committed: [],
  bound: [],
  spent: []
});

export const zoneOfTile = (tiles, tileId) => {
  const zone = CHAOS_WEAVER_TILE_ZONES.find((name) => tiles[name].includes(tileId));
  return zone === undefined ? null : zone;
};

export const validateTileState = (tiles) => {
  const errors = [];
  if (!isPlainObject(tiles)) return { ok: false, errors: ['tile state is not an object'] };
  const seen = [];
  CHAOS_WEAVER_TILE_ZONES.forEach((zone) => {
    if (!Array.isArray(tiles[zone])) {
      errors.push(`zone ${zone} missing`);
      return;
    }
    tiles[zone].forEach((tileId) => {
      if (!CHAOS_WEAVER_TILE_IDS.includes(tileId)) errors.push(`foreign tile ID ${tileId}`);
      else if (seen.includes(tileId)) errors.push(`duplicate tile ID ${tileId}`);
      else seen.push(tileId);
    });
  });
  CHAOS_WEAVER_TILE_IDS.forEach((tileId) => {
    if (!seen.includes(tileId)) errors.push(`missing tile ID ${tileId}`);
  });
  if (tiles.rulesetVersion !== CHAOS_WEAVER_RULESET_VERSION) errors.push('rulesetVersion mismatch');
  return { ok: errors.length === 0, errors };
};

const transitionTile = (tiles, tileId, fromZone, toZone) => {
  if (!tiles[fromZone].includes(tileId)) return null;
  const next = {
    ...tiles,
    [fromZone]: tiles[fromZone].filter((id) => id !== tileId),
    [toZone]: sortTileIds([...tiles[toZone], tileId])
  };
  return next;
};

const transitionTiles = (tiles, tileIds, fromZone, toZone) => {
  let next = tiles;
  for (const tileId of tileIds) {
    next = transitionTile(next, tileId, fromZone, toZone);
    if (next === null) return null;
  }
  return next;
};

export const countZones = (tiles) => ({
  available: tiles.available.length,
  committed: tiles.committed.length,
  bound: tiles.bound.length,
  spent: tiles.spent.length
});

export const resourceSummaryText = (tiles, pending, anomaly) => {
  const counts = countZones(tiles);
  const zoneText = `Six tiles: ${counts.available} available, ${counts.committed} committed, ${counts.bound} bound, ${counts.spent} spent`;
  const anomalyText = anomaly === null || anomaly === undefined ? 'no anomaly' : 'one anomaly';
  const pendingText = pending === null || pending === undefined ? 'no unresolved draw' : 'one unresolved draw';
  return `${zoneText}; ${anomalyText}; ${pendingText}.`;
};

/* ------------------------------------------------------------------ */
/* Tile requirement descriptors                                       */
/* ------------------------------------------------------------------ */

export const tileSymbol = (tileId) => CHAOS_WEAVER_TILE_SYMBOLS[tileId];

const descriptorTileCount = (descriptor) => {
  if (descriptor.symbol !== undefined) return descriptor.count === undefined ? 1 : descriptor.count;
  if (descriptor.anyOf !== undefined) return descriptor.count === undefined ? 1 : descriptor.count;
  if (descriptor.tileIds !== undefined) return descriptor.tileIds.length;
  if (descriptor.anyTiles !== undefined) return descriptor.anyTiles;
  return 0;
};

const descriptorCountRange = (descriptor) => {
  if (descriptor.minCount !== undefined) {
    return [descriptor.minCount, descriptor.maxCount === undefined ? descriptor.minCount : descriptor.maxCount];
  }
  const count = descriptorTileCount(descriptor);
  return [count, count];
};

export const tileRuleTotalCount = (tileRule) =>
  tileRule.inputSymbols.reduce((sum, descriptor) => sum + descriptorCountRange(descriptor)[1], 0);

/* Legal combinations are token lists: { kind:'tile', tileId } for exact ID
 * descriptors, { kind:'symbol', symbol } for symbol descriptors and
 * { kind:'any', count } for "any N distinct" descriptors. Matching compares
 * the authored tokens against the actual committed tile IDs, never against a
 * lossy symbol-only view. */
export const legalSymbolCombos = (spell) => {
  const results = [];
  const walk = (descriptors, index, chosen) => {
    if (index === descriptors.length) {
      results.push(chosen);
      return;
    }
    const descriptor = descriptors[index];
    if (descriptor.tileIds !== undefined) {
      walk(
        descriptors,
        index + 1,
        [...chosen, ...descriptor.tileIds.map((tileId) => ({ kind: 'tile', tileId }))]
      );
    } else if (descriptor.anyTiles !== undefined) {
      walk(descriptors, index + 1, [...chosen, { kind: 'any', count: descriptor.anyTiles }]);
    } else if (descriptor.anyOf !== undefined) {
      const lengths =
        descriptor.minCount !== undefined
          ? Array.from(
              {
                length:
                  (descriptor.maxCount === undefined ? descriptor.minCount : descriptor.maxCount) -
                  descriptor.minCount +
                  1
              },
              (_, offset) => descriptor.minCount + offset
            )
          : [descriptor.count === undefined ? 1 : descriptor.count];
      lengths.forEach((repeats) => {
        const expand = (remaining, picked) => {
          if (remaining === 0) {
            walk(descriptors, index + 1, [...chosen, ...picked]);
            return;
          }
          descriptor.anyOf.forEach((symbol) => {
            if (descriptor.sameSymbol && picked.length > 0 && picked[picked.length - 1].symbol !== symbol) return;
            expand(remaining - 1, [...picked, { kind: 'symbol', symbol }]);
          });
        };
        expand(repeats, []);
      });
    } else if (descriptor.symbol !== undefined) {
      const repeats = descriptor.count === undefined ? 1 : descriptor.count;
      walk(
        descriptors,
        index + 1,
        [...chosen, ...Array.from({ length: repeats }, () => ({ kind: 'symbol', symbol: descriptor.symbol }))]
      );
    }
  };
  walk(spell.tileRule.inputSymbols, 0, []);
  return results;
};

const tokensMatchTileIds = (tileIds, tokens) => {
  if (tokens.length === 0) return tileIds.length === 0;
  const [token, ...rest] = tokens;
  if (token.kind === 'tile') {
    const index = tileIds.indexOf(token.tileId);
    if (index === -1) return false;
    return tokensMatchTileIds([...tileIds.slice(0, index), ...tileIds.slice(index + 1)], rest);
  }
  if (token.kind === 'symbol') {
    const index = tileIds.findIndex((tileId) => tileSymbol(tileId) === token.symbol);
    if (index === -1) return false;
    return tokensMatchTileIds([...tileIds.slice(0, index), ...tileIds.slice(index + 1)], rest);
  }
  if (token.kind === 'any') {
    if (tileIds.length < token.count) return false;
    const choose = (remaining, picked) => {
      if (picked.length === token.count) return tokensMatchTileIds(remaining, rest);
      for (let index = 0; index < remaining.length; index += 1) {
        if (
          choose(
            [...remaining.slice(0, index), ...remaining.slice(index + 1)],
            [...picked, remaining[index]]
          )
        ) {
          return true;
        }
      }
      return false;
    };
    return choose(tileIds, []);
  }
  return false;
};

const comboTileTotal = (combo) =>
  combo.reduce((sum, token) => sum + (token.kind === 'any' ? token.count : 1), 0);

export const comboForTileIds = (spell, tileIds) => {
  if (!spell || !Array.isArray(tileIds)) return null;
  const min = spell.tileRule.inputSymbols.reduce((sum, descriptor) => sum + descriptorCountRange(descriptor)[0], 0);
  const max = tileRuleTotalCount(spell.tileRule);
  if (tileIds.length < min || tileIds.length > max) return null;
  return (
    legalSymbolCombos(spell).find(
      (combo) => comboTileTotal(combo) === tileIds.length && tokensMatchTileIds(tileIds, combo)
    ) || null
  );
};

/* ------------------------------------------------------------------ */
/* Odds and mapping (derived, never a second table)                   */
/* ------------------------------------------------------------------ */

export const buildMapping = (primaryTileIds) => {
  const order = sortTileIds(primaryTileIds);
  if (order.length === 2) {
    return {
      order,
      dice: 'd6',
      rule: 'two-ids-d6-1-3-4-6',
      entries: [
        { tileId: order[0], faces: [1, 2, 3] },
        { tileId: order[1], faces: [4, 5, 6] }
      ]
    };
  }
  if (order.length === 3) {
    return {
      order,
      dice: 'd6',
      rule: 'three-ids-d6-1-2-3-4-5-6',
      entries: [
        { tileId: order[0], faces: [1, 2] },
        { tileId: order[1], faces: [3, 4] },
        { tileId: order[2], faces: [5, 6] }
      ]
    };
  }
  if (order.length === 4) {
    return {
      order,
      dice: 'd4',
      rule: 'four-ids-d4-direct',
      entries: [
        { tileId: order[0], faces: [1] },
        { tileId: order[1], faces: [2] },
        { tileId: order[2], faces: [3] },
        { tileId: order[3], faces: [4] }
      ]
    };
  }
  return null;
};

/* Deterministic records (branchRule null, authored outcome) settle without a
 * physical draw. Their pending still carries a closed mapping-shaped marker so
 * every pending in a worksheet has the same shape and no face is implied. */
export const deterministicMappingFor = (primaryTileIds) => ({
  order: sortTileIds(primaryTileIds),
  dice: null,
  rule: 'deterministic-no-sample',
  entries: []
});

export const resolveFace = (mapping, faceValue) => {
  if (mapping === null) return { ok: false, errors: ['no mapping'] };
  const maxFace = mapping.dice === 'd4' ? 4 : 6;
  if (!Number.isInteger(faceValue) || faceValue < 1 || faceValue > maxFace) {
    return { ok: false, errors: [`face must be 1..${maxFace} on ${mapping.dice}`] };
  }
  const entry = mapping.entries.find((candidate) => candidate.faces.includes(faceValue));
  if (!entry) return { ok: false, errors: ['face does not match the fixed mapping'] };
  return { ok: true, tileId: entry.tileId };
};

export const symbolWeightsForCommit = (primaryTileIds) => {
  const weights = { S: 0, M: 0, F: 0 };
  primaryTileIds.forEach((tileId) => {
    weights[tileSymbol(tileId)] += 1;
  });
  return weights;
};

const greatestCommonDivisor = (a, b) => (b === 0 ? a : greatestCommonDivisor(b, a % b));

export const oddsForCommit = (primaryTileIds) => {
  const weights = symbolWeightsForCommit(primaryTileIds);
  const total = primaryTileIds.length;
  const odds = {};
  Object.keys(weights).forEach((symbol) => {
    if (weights[symbol] === 0) return;
    const divisor = greatestCommonDivisor(weights[symbol], total);
    odds[symbol] = { numerator: weights[symbol] / divisor, denominator: total / divisor, raw: `${weights[symbol]}/${total}` };
  });
  return odds;
};

/* ------------------------------------------------------------------ */
/* Rehearsal session (manual worksheet, no execution)                 */
/* ------------------------------------------------------------------ */

export const createUninitializedSession = () => ({
  status: 'uninitialized',
  label: '',
  turn: { ownTurnNumber: 0, apAvailable: 0, remainingMovementFeet: 0 },
  tiles: createTileState(),
  pending: null,
  anomaly: null,
  penalties: [],
  usage: { completedRestId: null, oncePerRest: [] },
  settlements: [],
  log: [],
  actionSeq: 0
});

export const createRehearsalSession = ({ label }) => ({
  ...createUninitializedSession(),
  status: 'active',
  label: typeof label === 'string' && label.length > 0 ? label : 'Manual rehearsal',
  turn: { ownTurnNumber: 1, apAvailable: 0, remainingMovementFeet: 0 },
  log: [{ id: 'log-0', kind: 'session', text: 'Rehearsal started. Local rehearsal — does not spend AP, move tokens or apply effects.' }]
});

const withLog = (session, kind, text) => ({
  ...session,
  log: [...session.log, { id: `log-${session.log.length}`, kind, text }]
});

export const setWorksheetCounters = (session, { apAvailable, remainingMovementFeet, ownTurnNumber } = {}) => {
  if (session.status !== 'active') return { ok: false, errors: ['session is not active'] };
  const errors = [];
  const checked = (label, value, minimum) => {
    if (value === undefined || value === null) return null;
    if (!Number.isInteger(value) || value < minimum) {
      errors.push(`${label} must be an integer of at least ${minimum}`);
      return null;
    }
    return value;
  };
  const ap = checked('apAvailable', apAvailable, 0);
  const movement = checked('remainingMovementFeet', remainingMovementFeet, 0);
  const turnNumber = checked('ownTurnNumber', ownTurnNumber, 1);
  if (errors.length > 0) return { ok: false, errors };
  const turn = {
    ownTurnNumber: turnNumber === null ? session.turn.ownTurnNumber : turnNumber,
    apAvailable: ap === null ? session.turn.apAvailable : ap,
    remainingMovementFeet: movement === null ? session.turn.remainingMovementFeet : movement
  };
  return { ok: true, session: { ...session, turn } };
};

const payLocalAP = (session, actionPoints, errors) => {
  if (session.turn.apAvailable < actionPoints) {
    errors.push(`local AP counter has ${session.turn.apAvailable}, cost is ${actionPoints} (enter real AP manually)`);
    return null;
  }
  return { ...session, turn: { ...session.turn, apAvailable: session.turn.apAvailable - actionPoints } };
};

const activePenaltyFeet = (penalties) =>
  penalties.reduce((highest, entry) => Math.max(highest, entry.feet), 0);

export const aggregateMovementPenalty = (session) => activePenaltyFeet(session.penalties);

const addPenalty = (session, { sourceActionId, feet, boundary, ownTurnNumber }) => {
  const expiresOwnTurn = ownTurnNumber + 1;
  return {
    ...session,
    penalties: [
      ...session.penalties,
      { sourceActionId, feet, expiresBoundary: boundary, expiresOwnTurn }
    ]
  };
};

const recordOncePerRestUse = (session, spell) => {
  if (!spell.timing.oncePerRest || session.usage.oncePerRest.includes(spell.id)) return session;
  return {
    ...session,
    usage: { ...session.usage, oncePerRest: [...session.usage.oncePerRest, spell.id] }
  };
};

/* The closed C1 outcome shape may carry a movement component and an
 * additional caster penalty component (for example cw1_31/cw1_39 Fracture:
 * 5ft displacement plus movement−10ft). Both are retained verbatim. */
const outcomePenaltyComponents = (outcome) => {
  const components = [];
  if (outcome && outcome.movement && outcome.movement.kind === 'penalty') {
    components.push({ feet: outcome.movement.feet, until: outcome.movement.until });
  }
  if (outcome && outcome.penalty) {
    components.push({ feet: outcome.penalty.feet, until: outcome.penalty.until });
  }
  return components;
};

export const outcomeConfirmationLabels = (outcome) => {
  if (!outcome) return [];
  const labels = [];
  if (outcome.damage) labels.push('damage');
  if (outcome.ward) labels.push('ward');
  if (outcome.movement) labels.push('movement');
  if (outcome.penalty) labels.push('penalty');
  return labels;
};

const applyOutcomePenalties = (session, outcome, sourceActionId) => {
  let next = session;
  outcomePenaltyComponents(outcome).forEach((component) => {
    next = addPenalty(next, {
      sourceActionId,
      feet: component.feet,
      boundary: component.until,
      ownTurnNumber: session.turn.ownTurnNumber
    });
  });
  return next;
};

const validateConfirmations = (confirmations, requiredLabels, errors) => {
  if (confirmations === undefined) return [];
  if (!Array.isArray(confirmations) || confirmations.some((entry) => typeof entry !== 'string')) {
    errors.push('confirmations must be an array of manual confirmation labels');
    return null;
  }
  const missing = requiredLabels.filter((label) => !confirmations.includes(label));
  if (missing.length > 0) {
    errors.push(`confirm the retained authored result first: missing ${missing.join(', ')}`);
    return null;
  }
  return [...new Set(confirmations)];
};

/* ------------------------------------------------------------------ */
/* Commit paths                                                       */
/* ------------------------------------------------------------------ */

const anomalyClosureSpells = ['cw1_30', 'cw1_35', 'cw1_dismiss_anomaly'];

const validateCommitInput = (session, spell, primaryTileIds) => {
  const errors = [];
  if (session.status !== 'active') errors.push('session is not active');
  if (session.pending !== null) errors.push('one unresolved action already exists');
  if (!spell) errors.push('unknown spell');
  if (spell && spell.level > 10) errors.push('spell level out of range');
  const stateCheck = validateTileState(session.tiles);
  if (!stateCheck.ok) errors.push(...stateCheck.errors);
  if (spell && !Array.isArray(primaryTileIds)) errors.push('primaryTileIds must be an array');
  return errors;
};

const validateAnomalyPrecondition = (session, spell, errors) => {
  if (!anomalyClosureSpells.includes(spell.id)) return;
  const anomaly = session.anomaly;
  if (anomaly === null) {
    errors.push(
      spell.id === 'cw1_35'
        ? 'Unbind the Test requires your own inert Hold Sample/Signal Coin record'
        : `${spell.name} requires your own existing anomaly`
    );
    return;
  }
  if (spell.id === 'cw1_30' && (!anomaly.profile || anomaly.profile.kind !== 'anomaly')) {
    errors.push('Counterseal requires your own triggered anomaly record');
  }
  if (spell.id === 'cw1_35' && (!anomaly.profile || anomaly.profile.kind !== 'inert-preservation')) {
    errors.push('Unbind the Test requires your own inert Hold Sample/Signal Coin record');
  }
  if (anomaly.dismissalActionId) {
    errors.push('a paid dismissal is already staged for this record');
  }
};

export const canCommitSpell = (
  session,
  spellId,
  { primaryTileIds = [], continuationTileId = null, knownTalentIds = [] } = {}
) => {
  const spell = CHAOS_WEAVER_SPELLS_BY_ID[spellId];
  const errors = validateCommitInput(session, spell, primaryTileIds);
  if (!spell) return { ok: false, errors };
  if (spell.timing.use === 'passive') errors.push('passive records cannot be committed');
  validateAnomalyPrecondition(session, spell, errors);
  const rule = spell.tileRule;
  if (rule.count === 0) {
    if (primaryTileIds.length !== 0) errors.push('this action takes no tiles');
    if (continuationTileId !== null) errors.push('this action has no continuation');
    if (spell.timing.oncePerRest && session.usage.oncePerRest.includes(spell.id)) {
      errors.push('once/rest use already spent; only a completed long rest clears it');
    }
    return { ok: errors.length === 0, errors, spell };
  }
  if (rule.zoneFrom === 'available' && rule.zoneTo === 'spent') {
    const combo = comboForTileIds(spell, primaryTileIds);
    if (combo === null) errors.push('chosen tiles do not satisfy the authored symbol requirement');
    primaryTileIds.forEach((tileId) => {
      if (zoneOfTile(session.tiles, tileId) !== 'available') errors.push(`tile ${tileId} is not available`);
    });
    const distinct = new Set(primaryTileIds);
    if (distinct.size !== primaryTileIds.length) errors.push('duplicate tile IDs in the commitment');
    if (continuationTileId !== null) {
      if (spell.continuation === null) {
        errors.push('this action has no continuation profile');
      } else if (!CHAOS_WEAVER_TILE_IDS.includes(continuationTileId)) {
        errors.push('continuation must be a real tile ID');
      } else {
        const symbol = tileSymbol(continuationTileId);
        const choice = spell.continuation.choices.find((candidate) => candidate.tileSymbols.includes(symbol));
        if (!choice) {
          const allowed = spell.continuation.choices
            .map((candidate) => candidate.tileSymbols.join('/'))
            .join(', ');
          errors.push(`continuation ${continuationTileId} is not an authored continuation choice (${allowed})`);
        } else if (choice.requiresTalentId !== null && !knownTalentIds.includes(choice.requiresTalentId)) {
          errors.push(`continuation ${continuationTileId} requires the learned talent ${choice.requiresTalentId}`);
        }
      }
      if (primaryTileIds.includes(continuationTileId)) errors.push('continuation must be excluded from the primary sample');
      if (
        CHAOS_WEAVER_TILE_IDS.includes(continuationTileId) &&
        zoneOfTile(session.tiles, continuationTileId) !== 'available'
      ) {
        errors.push(`continuation tile ${continuationTileId} is not available`);
      }
    }
  }
  if (rule.zoneFrom === 'available' && rule.zoneTo === 'bound') {
    const combo = comboForTileIds(spell, primaryTileIds);
    if (combo === null) errors.push('chosen tiles do not satisfy the authored symbol requirement');
    primaryTileIds.forEach((tileId) => {
      if (zoneOfTile(session.tiles, tileId) !== 'available') errors.push(`tile ${tileId} is not available`);
    });
    const distinct = new Set(primaryTileIds);
    if (distinct.size !== primaryTileIds.length) errors.push('duplicate tile IDs in the commitment');
    if (session.anomaly !== null) errors.push('one anomaly already exists');
    if (continuationTileId !== null) errors.push('this action has no continuation');
  }
  if (rule.zoneFrom === 'spent' && rule.zoneTo === 'available') {
    const combo = comboForTileIds(spell, primaryTileIds);
    if (combo === null) errors.push('chosen tiles do not satisfy the authored requirement');
    primaryTileIds.forEach((tileId) => {
      if (zoneOfTile(session.tiles, tileId) !== 'spent') errors.push(`tile ${tileId} is not spent`);
    });
    const distinct = new Set(primaryTileIds);
    if (distinct.size !== primaryTileIds.length) errors.push('duplicate tile IDs in the commitment');
    if (continuationTileId !== null) errors.push('this action has no continuation');
  }
  if (spell.timing.oncePerRest && session.usage.oncePerRest.includes(spell.id)) {
    errors.push('once/rest use already spent; only a completed long rest clears it');
  }
  return { ok: errors.length === 0, errors, spell };
};

export const commitSpell = (
  session,
  { spellId, primaryTileIds = [], continuationTileId = null, knownTalentIds = [], sourceLabel = '', targetLabel = '' } = {}
) => {
  const check = canCommitSpell(session, spellId, { primaryTileIds, continuationTileId, knownTalentIds });
  if (!check.ok) return check;
  const spell = check.spell;
  const payErrors = [];
  let paid = payLocalAP(session, spell.resourceCost.actionPoints, payErrors);
  if (paid === null) {
    return { ok: false, errors: payErrors };
  }
  const actionId = `action-${session.actionSeq + 1}`;
  let next = recordOncePerRestUse({ ...paid, actionSeq: session.actionSeq + 1 }, spell);
  const rule = spell.tileRule;

  if (spell.id === 'cw1_dismiss_anomaly') {
    const anomaly = { ...next.anomaly, dismissalActionId: actionId };
    next = withLog(
      { ...next, anomaly },
      'anomaly',
      `${spell.name}: ${spell.resourceCost.actionPoints} AP paid locally — dismissal staged; resolve it to send bound ${anomaly.tileIds.join(', ')} to spent.`
    );
    return { ok: true, session: next, actionId };
  }

  if (spell.id === 'cw1_35') {
    const anomaly = next.anomaly;
    const tiles = transitionTiles(next.tiles, primaryTileIds, 'available', 'spent');
    const closed = tiles === null ? null : transitionTiles(tiles, anomaly.tileIds, 'bound', 'spent');
    if (closed === null) return { ok: false, errors: ['tile transition failed; the worksheet is unchanged'] };
    const settlements = [
      ...next.settlements,
      {
        actionId,
        kind: 'unbind',
        spellId: spell.id,
        primaryTileIds: sortTileIds(primaryTileIds),
        closedAnomaly: { actionId: anomaly.actionId, spellId: anomaly.spellId, tileIds: [...anomaly.tileIds] }
      }
    ];
    next = withLog(
      { ...next, tiles: closed, anomaly: null, settlements },
      'anomaly',
      `${spell.name}: spent ${sortTileIds(primaryTileIds).join(', ')} and closed the inert record (${anomaly.tileIds.join(', ')} to spent); one observable failure-mode question is answered manually.`
    );
    return { ok: true, session: next, actionId };
  }

  if (rule.zoneFrom === 'spent') {
    const tiles = transitionTiles(next.tiles, primaryTileIds, 'spent', 'available');
    if (tiles === null) return { ok: false, errors: ['tile transition failed; the worksheet is unchanged'] };
    next = withLog(
      { ...next, tiles },
      'recover',
      `${spell.name}: recovered ${sortTileIds(primaryTileIds).join(', ')} from spent to available (${spell.resourceCost.actionPoints} AP paid locally).`
    );
    return { ok: true, session: next, actionId };
  }

  if (rule.zoneTo === 'bound') {
    const tiles = transitionTiles(next.tiles, primaryTileIds, 'available', 'bound');
    if (tiles === null) return { ok: false, errors: ['tile transition failed; the worksheet is unchanged'] };
    const tileIds = sortTileIds(primaryTileIds);
    const expiresTurns = spell.area && spell.area.expires === 'endT+3' ? 3 : 2;
    const anomaly = {
      actionId,
      spellId: spell.id,
      sourceLabel: sourceLabel || spell.name,
      tileIds,
      centerLabel: targetLabel || 'unnamed point',
      radiusFeet: spell.area ? spell.area.radiusFeet : 5,
      placementRangeFeet: spell.area ? spell.area.placementRangeFeet : 30,
      trigger: spell.area ? spell.area.trigger : 'first-enemy-original-voluntary-entry',
      createdOwnTurn: next.turn.ownTurnNumber,
      expiresEndOwnTurn: next.turn.ownTurnNumber + expiresTurns,
      profile: spell.area,
      mapping: buildMapping(tileIds),
      dismissalActionId: null
    };
    next = withLog(
      { ...next, tiles, anomaly },
      'anomaly',
      `${spell.name}: bound ${anomaly.tileIds.join(', ')}; one anomaly at ${anomaly.centerLabel} (${anomaly.radiusFeet}ft), expires end of own turn ${anomaly.expiresEndOwnTurn}${anomaly.mapping ? `; mapping ${anomaly.mapping.rule} published before any face` : ''}.`
    );
    return { ok: true, session: next, actionId };
  }

  if (spell.branchRule === null) {
    if (!spell.outcome) {
      const tiles = transitionTiles(next.tiles, primaryTileIds, 'available', 'spent');
      if (tiles === null) return { ok: false, errors: ['tile transition failed; the worksheet is unchanged'] };
      next = withLog(
        { ...next, tiles },
        'cast',
        `${spell.name}: spent ${sortTileIds(primaryTileIds).join(', ')} (${spell.resourceCost.actionPoints} AP paid locally).`
      );
      return { ok: true, session: next, actionId };
    }
    const tiles = transitionTiles(next.tiles, primaryTileIds, 'available', 'committed');
    if (tiles === null) return { ok: false, errors: ['tile transition failed; the worksheet is unchanged'] };
    const pending = {
      actionId,
      spellId: spell.id,
      sourceLabel: sourceLabel || spell.name,
      targetLabel: targetLabel || 'unnamed target',
      primaryTileIds: sortTileIds(primaryTileIds),
      continuationTileId: null,
      mapping: deterministicMappingFor(primaryTileIds),
      selectedTileId: null,
      recordedFaces: null,
      phase: 'face-recorded'
    };
    next = withLog(
      { ...next, tiles, pending },
      'commit',
      `${spell.name}: deterministic authored result fixed — ${pending.primaryTileIds.join(', ')} committed; no physical face. Confirm the retained result to settle.`
    );
    return { ok: true, session: next, actionId };
  }

  const committed = transitionTiles(next.tiles, primaryTileIds, 'available', 'committed');
  const withContinuation =
    continuationTileId === null
      ? committed
      : committed === null
        ? null
        : transitionTile(committed, continuationTileId, 'available', 'committed');
  if (withContinuation === null) {
    return { ok: false, errors: ['tile transition failed; the worksheet is unchanged'] };
  }
  const mapping = buildMapping(primaryTileIds);
  const pending = {
    actionId,
    spellId: spell.id,
    sourceLabel: sourceLabel || spell.name,
    targetLabel: targetLabel || 'unnamed target',
    primaryTileIds: sortTileIds(primaryTileIds),
    continuationTileId,
    mapping,
    selectedTileId: null,
    recordedFaces: null,
    phase: 'committed'
  };
  next = withLog(
    { ...next, tiles: withContinuation, pending },
    'commit',
    `${spell.name}: commitment fixed — ${pending.primaryTileIds.join(', ')}${continuationTileId ? ` + reserved continuation ${continuationTileId}` : ''}; mapping ${mapping.rule} retained before the face.`
  );
  return { ok: true, session: next, actionId };
};

/* ------------------------------------------------------------------ */
/* Face, continuation and settlement                                  */
/* ------------------------------------------------------------------ */

export const recordFace = (session, { faceValue } = {}) => {
  const pending = session.pending;
  if (pending === null) return { ok: false, errors: ['no unresolved action'] };
  if (pending.phase !== 'committed') {
    const pendingSpell = CHAOS_WEAVER_SPELLS_BY_ID[pending.spellId];
    return {
      ok: false,
      errors: [
        pendingSpell && pendingSpell.branchRule === null
          ? 'this deterministic result has no physical face; settle it with its authored confirmations'
          : 'this action already recorded a face'
      ]
    };
  }
  const resolved = resolveFace(pending.mapping, faceValue);
  if (!resolved.ok) return resolved;
  const spell = CHAOS_WEAVER_SPELLS_BY_ID[pending.spellId];
  const hasContinuation =
    pending.kind !== 'anomaly-trigger' && spell.continuation !== null && pending.continuationTileId !== null;
  const phase = hasContinuation ? 'continuation-pending' : 'face-recorded';
  const nextPending = {
    ...pending,
    selectedTileId: resolved.tileId,
    recordedFaces: [faceValue],
    phase
  };
  return {
    ok: true,
    session: withLog(
      { ...session, pending: nextPending },
      'face',
      `${pending.sourceLabel}: ${pending.mapping.dice} face ${faceValue} selects ${resolved.tileId}.`
    )
  };
};

const retentionForPending = (session, pending) => {
  const spell = CHAOS_WEAVER_SPELLS_BY_ID[pending.spellId];
  if (pending.kind === 'anomaly-trigger') {
    const anomaly = session.anomaly;
    if (anomaly === null || anomaly.actionId !== pending.actionId) {
      return { ok: false, errors: ['the triggering anomaly no longer matches the unresolved action'] };
    }
    const symbol = tileSymbol(pending.selectedTileId);
    const outcome =
      anomaly.profile && anomaly.profile.branches ? anomaly.profile.branches[symbol] : null;
    if (!outcome) return { ok: false, errors: ['the selected ID has no authored anomaly branch'] };
    return { ok: true, spell, outcome, labels: outcomeConfirmationLabels(outcome) };
  }
  if (spell && spell.branchRule === null && pending.phase !== 'committed') {
    const outcome = spell.outcome || null;
    if (!outcome) return { ok: false, errors: ['the deterministic record has no authored retained outcome'] };
    return { ok: true, spell, outcome, labels: outcomeConfirmationLabels(outcome) };
  }
  const symbol = tileSymbol(pending.selectedTileId);
  const outcome = spell && spell.branchRule ? spell.branchRule.outcomes[symbol] : null;
  if (spell && spell.branchRule && !outcome) {
    return { ok: false, errors: ['the selected ID has no authored branch'] };
  }
  return { ok: true, spell, outcome, labels: outcomeConfirmationLabels(outcome) };
};

export const pendingSettlementPreview = (session) => {
  const pending = session.pending;
  if (!pending || (pending.phase !== 'face-recorded' && pending.phase !== 'continuation-pending')) return null;
  const retention = retentionForPending(session, pending);
  if (!retention.ok) return null;
  return {
    kind: pending.kind === 'anomaly-trigger' ? 'anomaly-trigger' : 'spell',
    spellId: pending.spellId,
    selectedTileId: pending.selectedTileId,
    outcome: retention.outcome,
    labels: retention.labels
  };
};

const finalizePending = (
  session,
  { extraAP = 0, logText = null, continuationChoice = null, confirmations = undefined } = {}
) => {
  const errors = [];
  const paid = extraAP > 0 ? payLocalAP(session, extraAP, errors) : session;
  if (paid === null) return { ok: false, errors };
  const pending = paid.pending;
  const retention = retentionForPending(paid, pending);
  if (!retention.ok) return retention;
  const confirmed = validateConfirmations(confirmations, retention.labels, errors);
  if (confirmed === null) return { ok: false, errors };

  const isAnomalyTrigger = pending.kind === 'anomaly-trigger';
  const anomaly = paid.anomaly;
  let tiles = isAnomalyTrigger
    ? transitionTiles(paid.tiles, anomaly.tileIds, 'bound', 'spent')
    : transitionTiles(paid.tiles, pending.primaryTileIds, 'committed', 'spent');
  if (tiles === null) return { ok: false, errors: ['tile transition failed; the worksheet is unchanged'] };

  let continuation = null;
  if (!isAnomalyTrigger && continuationChoice === 'accept') {
    const symbol = tileSymbol(pending.continuationTileId);
    continuation =
      retention.spell.continuation &&
      retention.spell.continuation.choices.find((candidate) => candidate.tileSymbols.includes(symbol));
    if (!continuation) return { ok: false, errors: ['the reserved continuation has no authored choice'] };
    tiles = transitionTile(tiles, pending.continuationTileId, 'committed', 'spent');
    if (tiles === null) return { ok: false, errors: ['tile transition failed; the worksheet is unchanged'] };
  }

  const closedAnomaly =
    !isAnomalyTrigger && retention.spell.id === 'cw1_30' && anomaly !== null
      ? { actionId: anomaly.actionId, spellId: anomaly.spellId, tileIds: [...anomaly.tileIds] }
      : null;
  if (closedAnomaly) {
    tiles = transitionTiles(tiles, anomaly.tileIds, 'bound', 'spent');
    if (tiles === null) return { ok: false, errors: ['tile transition failed; the worksheet is unchanged'] };
  }

  const settlements = [
    ...paid.settlements,
    {
      actionId: pending.actionId,
      kind: isAnomalyTrigger ? 'anomaly-trigger' : 'settlement',
      spellId: pending.spellId,
      primaryTileIds: pending.primaryTileIds,
      continuationTileId: pending.continuationTileId,
      selectedTileId: pending.selectedTileId,
      recordedFaces: pending.recordedFaces,
      merged: !isAnomalyTrigger && continuationChoice === 'accept',
      outcome: retention.outcome,
      continuation,
      confirmed,
      closedAnomaly
    }
  ];
  const penalized = applyOutcomePenalties(
    { ...paid, tiles, pending: null, settlements, anomaly: isAnomalyTrigger || closedAnomaly ? null : paid.anomaly },
    retention.outcome,
    pending.actionId
  );
  const defaultLog = isAnomalyTrigger
    ? `${pending.sourceLabel}: trigger settled — branch retained, ${anomaly.tileIds.join(', ')} spent with no refund.`
    : `${pending.sourceLabel}: settlement recorded; primary tiles spent${continuation ? ' with the accepted continuation' : ''}${closedAnomaly ? `; Counterseal closed the anomaly (${closedAnomaly.tileIds.join(', ')} to spent)` : ''}.`;
  return {
    ok: true,
    session: withLog(penalized, 'settle', logText || defaultLog)
  };
};

export const resolveContinuation = (session, { choice, confirmations } = {}) => {
  const pending = session.pending;
  if (pending === null) return { ok: false, errors: ['no unresolved action'] };
  if (pending.phase !== 'continuation-pending') {
    return { ok: false, errors: ['no continuation choice is pending'] };
  }
  if (choice !== 'accept' && choice !== 'decline') {
    return { ok: false, errors: ['choice must be accept or decline'] };
  }
  if (choice === 'accept') {
    const errors = [];
    const confirmed = validateConfirmations(confirmations, ['continuation'], errors);
    if (confirmed === null) return { ok: false, errors };
    const accepted = finalizePending(session, {
      continuationChoice: 'accept',
      confirmations: confirmations === undefined ? undefined : confirmed
    });
    if (!accepted.ok) return accepted;
    return {
      ok: true,
      session: withLog(
        { ...accepted.session, log: accepted.session.log.slice(0, -1) },
        'settle',
        `${pending.sourceLabel}: continuation accepted — ${pending.continuationTileId} spent with the retained primary result; one derived follow-up recorded.`
      )
    };
  }
  const declineErrors = [];
  const declineRetention = retentionForPending(session, pending);
  if (!declineRetention.ok) return declineRetention;
  if (confirmations === undefined) {
    return {
      ok: false,
      errors: [
        `confirm the retained authored result first: missing ${declineRetention.labels.join(', ') || 'nothing'} before declining`
      ]
    };
  }
  const confirmed = validateConfirmations(confirmations, declineRetention.labels, declineErrors);
  if (confirmed === null) return { ok: false, errors: declineErrors };
  const tiles = transitionTile(session.tiles, pending.continuationTileId, 'committed', 'available');
  if (tiles === null) return { ok: false, errors: ['tile transition failed; the worksheet is unchanged'] };
  const spell = CHAOS_WEAVER_SPELLS_BY_ID[pending.spellId];
  const symbol = tileSymbol(pending.selectedTileId);
  const outcome = spell && spell.branchRule ? spell.branchRule.outcomes[symbol] : null;
  const declined = finalizePending({ ...session, tiles }, { confirmations: confirmed });
  if (!declined.ok) return declined;
  return {
    ok: true,
    session: withLog(
      declined.session,
      'settle',
      `${pending.sourceLabel}: continuation declined — reserved ${pending.continuationTileId} returns to available; primary result and its authored ${outcome ? 'branch ' : ''}tiles stand.`
    )
  };
};

export const settlePending = (session, { confirmations } = {}) => {
  const pending = session.pending;
  if (pending === null) return { ok: false, errors: ['no unresolved action'] };
  if (pending.phase !== 'face-recorded') {
    return {
      ok: false,
      errors: [
        pending.phase === 'committed'
          ? 'enter the physical face before settlement'
          : 'resolve the pending continuation choice before settlement'
      ]
    };
  }
  return finalizePending(session, { confirmations });
};

export const voidPending = (session, { reason } = {}) => {
  const pending = session.pending;
  if (pending === null) return { ok: false, errors: ['no unresolved action'] };
  if (typeof reason !== 'string' || reason.trim().length === 0) {
    return { ok: false, errors: ['a GM void requires a recorded reason'] };
  }
  let tiles = session.tiles;
  let anomaly = session.anomaly;
  if (pending.kind !== 'anomaly-trigger') {
    const transitioned = transitionTiles(session.tiles, pending.primaryTileIds, 'committed', 'spent');
    const withContinuation =
      transitioned === null || pending.continuationTileId === null
        ? transitioned
        : transitionTile(transitioned, pending.continuationTileId, 'committed', 'spent');
    if (withContinuation === null) {
      return { ok: false, errors: ['tile transition failed; the worksheet is unchanged'] };
    }
    tiles = withContinuation;
  } else {
    if (anomaly === null) {
      return { ok: false, errors: ['the unresolved trigger has no anomaly record'] };
    }
    const closed = transitionTiles(session.tiles, anomaly.tileIds, 'bound', 'spent');
    if (closed === null) {
      return { ok: false, errors: ['tile transition failed; the worksheet is unchanged'] };
    }
    tiles = closed;
    anomaly = null;
  }
  const settlements = [
    ...session.settlements,
    {
      actionId: pending.actionId,
      kind: 'void',
      reason,
      spellId: pending.spellId,
      primaryTileIds: pending.primaryTileIds,
      continuationTileId: pending.continuationTileId,
      selectedTileId: pending.selectedTileId,
      recordedFaces: pending.recordedFaces
    }
  ];
  return {
    ok: true,
    session: withLog(
      { ...session, tiles, anomaly, pending: null, settlements },
      'void',
      pending.kind === 'anomaly-trigger'
        ? `${pending.sourceLabel}: GM void recorded (${reason}); the trigger closed without refund or redraw — its bound IDs are spent.`
        : `${pending.sourceLabel}: GM void recorded (${reason}); no refund and no new face.`
    )
  };
};

/* ------------------------------------------------------------------ */
/* Anomaly lifecycle                                                  */
/* ------------------------------------------------------------------ */

export const resolveAnomaly = (session, { reason } = {}) => {
  if (session.status !== 'active') return { ok: false, errors: ['session is not active'] };
  const anomaly = session.anomaly;
  if (anomaly === null || anomaly === undefined) return { ok: false, errors: ['no anomaly exists'] };
  const allowed = ['trigger', 'expiry', 'dismissal'];
  if (!allowed.includes(reason)) {
    return { ok: false, errors: [`reason must be one of ${allowed.join(', ')}; Counterseal and Unbind are their own paid actions`] };
  }

  if (reason === 'trigger') {
    if (session.pending !== null) {
      return { ok: false, errors: ['resolve the current pending action before triggering the anomaly'] };
    }
    if (!anomaly.profile || anomaly.profile.branches === null) {
      return { ok: false, errors: ['this record has no trigger branches; close it by release, expiry or dismissal'] };
    }
    if (!anomaly.mapping) {
      return { ok: false, errors: ['the anomaly mapping was not published at placement'] };
    }
    const pending = {
      kind: 'anomaly-trigger',
      actionId: anomaly.actionId,
      spellId: anomaly.spellId,
      sourceLabel: anomaly.sourceLabel,
      targetLabel: anomaly.centerLabel,
      primaryTileIds: [...anomaly.tileIds],
      continuationTileId: null,
      mapping: anomaly.mapping,
      selectedTileId: null,
      recordedFaces: null,
      phase: 'committed'
    };
    return {
      ok: true,
      session: withLog(
        { ...session, pending },
        'anomaly',
        `${anomaly.sourceLabel}: trigger confirmed by the table — ${anomaly.mapping.rule} mapping retained; enter the physical face before settlement.`
      )
    };
  }

  if (reason === 'expiry') {
    if (session.pending !== null) {
      return { ok: false, errors: ['resolve the unresolved action before the anomaly can expire'] };
    }
    if (session.turn.ownTurnNumber < anomaly.expiresEndOwnTurn) {
      return {
        ok: false,
        errors: [`early expiry is invalid; this anomaly expires at the end of own turn ${anomaly.expiresEndOwnTurn}`]
      };
    }
  }

  if (reason === 'dismissal') {
    if (session.pending !== null) {
      return { ok: false, errors: ['resolve the unresolved action before dismissal'] };
    }
    if (!anomaly.dismissalActionId) {
      return { ok: false, errors: ['dismissal requires the paid Dismiss Anomaly action first'] };
    }
  }

  const tiles = transitionTiles(session.tiles, anomaly.tileIds, 'bound', 'spent');
  if (tiles === null) return { ok: false, errors: ['tile transition failed; the worksheet is unchanged'] };
  const settlements =
    reason === 'dismissal'
      ? [
          ...session.settlements,
          {
            actionId: anomaly.dismissalActionId,
            kind: 'dismissal',
            spellId: 'cw1_dismiss_anomaly',
            closedAnomaly: { actionId: anomaly.actionId, spellId: anomaly.spellId, tileIds: [...anomaly.tileIds] }
          }
        ]
      : session.settlements;
  return {
    ok: true,
    session: withLog(
      { ...session, tiles, anomaly: null, settlements },
      'anomaly-resolved',
      `Anomaly at ${anomaly.centerLabel} closed by ${reason}; bound ${anomaly.tileIds.join(', ')} spent with no refund.`
    )
  };
};

/* ------------------------------------------------------------------ */
/* Turn and rest boundaries                                           */
/* ------------------------------------------------------------------ */

export const startOwnTurn = (session, { apAvailable } = {}) => {
  if (session.status !== 'active') return { ok: false, errors: ['session is not active'] };
  const errors = [];
  if (apAvailable !== undefined && apAvailable !== null && (!Number.isInteger(apAvailable) || apAvailable < 0)) {
    errors.push('apAvailable must be a nonnegative integer');
  }
  if (errors.length > 0) return { ok: false, errors };
  const ownTurnNumber = session.turn.ownTurnNumber + 1;
  const penalties = session.penalties.filter(
    (entry) => !(entry.expiresBoundary === 'next-own-turn-start' && entry.expiresOwnTurn <= ownTurnNumber)
  );
  return {
    ok: true,
    session: withLog(
      {
        ...session,
        turn: {
          ownTurnNumber,
          apAvailable: Number.isInteger(apAvailable) ? apAvailable : session.turn.apAvailable,
          remainingMovementFeet: session.turn.remainingMovementFeet
        },
        penalties
      },
      'turn',
      `Start of own turn ${ownTurnNumber}; ${penalties.length} movement penalty record(s) remain; remaining movement reset manually by the table.`
    )
  };
};

export const endOwnTurn = (session) => {
  if (session.status !== 'active') return { ok: false, errors: ['session is not active'] };
  let next = { ...session };
  const expired =
    next.anomaly !== null &&
    next.pending === null &&
    next.turn.ownTurnNumber >= next.anomaly.expiresEndOwnTurn;
  if (expired) {
    const resolved = resolveAnomaly(next, { reason: 'expiry' });
    if (!resolved.ok) return resolved;
    next = resolved.session;
  }
  const penalties = next.penalties.filter(
    (entry) => !(entry.expiresBoundary !== 'next-own-turn-start' && entry.expiresOwnTurn <= next.turn.ownTurnNumber)
  );
  return {
    ok: true,
    session: withLog(
      { ...next, penalties },
      'turn',
      `End of own turn ${next.turn.ownTurnNumber}${expired ? '; anomaly expired and its bound IDs went to spent' : ''}.`
    )
  };
};

export const completeRest = (session, { restLabel } = {}) => {
  if (session.status !== 'active') return { ok: false, errors: ['session is not active'] };
  const errors = [];
  if (typeof restLabel !== 'string' || restLabel.trim().length === 0) {
    errors.push('a new manual rest label is required');
  } else if (restLabel === session.usage.completedRestId) {
    errors.push('this rest label was already completed; enter a new manual rest label');
  }
  if (session.pending !== null) errors.push('an unresolved action must settle before the rest');
  if (session.anomaly !== null) errors.push('the anomaly must be resolved before the rest');
  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    session: withLog(
      {
        ...session,
        tiles: createTileState(),
        penalties: [],
        usage: { completedRestId: restLabel, oncePerRest: [] }
      },
      'rest',
      `${restLabel}: completed long rest confirmation — all six tiles available, once/rest uses cleared.`
    )
  };
};

/* ------------------------------------------------------------------ */
/* Native edge (proposed): Prepared Exchange                          */
/* ------------------------------------------------------------------ */

export const preparedExchange = (session, { spentTileId, availableTileId, partLabel } = {}) => {
  if (session.status !== 'active') return { ok: false, errors: ['session is not active'] };
  const errors = [];
  if (typeof partLabel !== 'string' || partLabel.trim().length === 0) {
    errors.push('one actual prepared spare part must be named and consumed at the table');
  }
  if (session.pending !== null) errors.push('no pending action may exist');
  if (!CHAOS_WEAVER_TILE_IDS.includes(spentTileId)) errors.push('spentTileId must be a real tile ID');
  if (!CHAOS_WEAVER_TILE_IDS.includes(availableTileId)) errors.push('availableTileId must be a real tile ID');
  if (spentTileId && availableTileId && tileSymbol(spentTileId) === tileSymbol(availableTileId)) {
    errors.push('the exchange requires different symbols');
  }
  if (spentTileId && zoneOfTile(session.tiles, spentTileId) !== 'spent') errors.push(`${spentTileId} is not spent`);
  if (availableTileId && zoneOfTile(session.tiles, availableTileId) !== 'available') {
    errors.push(`${availableTileId} is not available`);
  }
  if (session.usage.oncePerRest.includes('native:prepared-exchange')) {
    errors.push('Prepared Exchange was already used this rest');
  }
  if (errors.length > 0) return { ok: false, errors };
  const tiles = transitionTiles(
    transitionTiles(session.tiles, [spentTileId], 'spent', 'available'),
    [availableTileId],
    'available',
    'spent'
  );
  if (tiles === null) return { ok: false, errors: ['tile transition failed; the worksheet is unchanged'] };
  const withPenalty = addPenalty(
    { ...session, tiles, usage: { ...session.usage, oncePerRest: [...session.usage.oncePerRest, 'native:prepared-exchange'] } },
    { sourceActionId: 'native:prepared-exchange', feet: 5, boundary: 'next-own-turn-start', ownTurnNumber: session.turn.ownTurnNumber }
  );
  return {
    ok: true,
    session: withLog(
      withPenalty,
      'native',
      `Prepared Exchange: consumed “${partLabel}”; ${spentTileId}→available, ${availableTileId}→spent; movement−5ft until next own-turn start.`
    )
  };
};

/* ------------------------------------------------------------------ */
/* Talent allocation                                                  */
/* ------------------------------------------------------------------ */

export const createEmptyAllocation = () => ({ ranks: {}, order: [] });

export const allocationPoints = (allocation) =>
  Object.values(allocation.ranks).reduce((sum, rank) => sum + rank, 0);

export const treePoints = (allocation, treeId) =>
  CHAOS_WEAVER_TALENT_NODES.filter((node) => node.treeId === treeId).reduce(
    (sum, node) => sum + (allocation.ranks[node.id] || 0),
    0
  );

export const pointBudgetForLevel = (characterLevel) => Math.min(50, characterLevel * 5);

const normalizeOrder = (allocation, ranks) =>
  (Array.isArray(allocation.order) ? allocation.order : []).filter(
    (treeId) => treePoints({ ranks }, treeId) > 0
  );

export const canAllocateRank = (allocation, nodeId, characterLevel) => {
  const errors = [];
  const node = CHAOS_WEAVER_TALENT_NODES_BY_ID[nodeId];
  if (!node) return { ok: false, errors: [`unknown node ${nodeId}`] };
  const currentRank = allocation.ranks[nodeId] || 0;
  if (currentRank >= node.maxRanks) errors.push(`${node.name} is already at rank ${node.maxRanks}`);
  if (node.minLevel > characterLevel) {
    errors.push(`${node.name} is only available at character level ${node.minLevel}`);
  }
  const points = allocationPoints(allocation);
  if (points + 1 > pointBudgetForLevel(characterLevel)) {
    errors.push(`5×level budget reached (${points}/+1 > ${pointBudgetForLevel(characterLevel)})`);
  }
  if (points + 1 > 50) errors.push('character talent cap 50 reached');
  const sameTreePoints = treePoints(allocation, node.treeId) - currentRank;
  if (sameTreePoints < node.requiresPoints) {
    errors.push(`${node.name} needs ${node.requiresPoints} points in its tree gate (have ${sameTreePoints})`);
  }
  node.requires.forEach((predecessorId) => {
    const predecessor = CHAOS_WEAVER_TALENT_NODES_BY_ID[predecessorId];
    if (!predecessor) {
      errors.push(`missing prerequisite ${predecessorId}`);
      return;
    }
    if ((allocation.ranks[predecessorId] || 0) !== predecessor.maxRanks) {
      errors.push(`prerequisite ${predecessor.name} must be fully ranked`);
    }
  });
  return { ok: errors.length === 0, errors, node };
};

export const allocateRank = (allocation, nodeId, characterLevel) => {
  const check = canAllocateRank(allocation, nodeId, characterLevel);
  if (!check.ok) return check;
  const ranks = { ...allocation.ranks, [nodeId]: (allocation.ranks[nodeId] || 0) + 1 };
  const order = Array.isArray(allocation.order) ? [...allocation.order] : [];
  if (!order.includes(check.node.treeId)) order.push(check.node.treeId);
  return { ok: true, allocation: { ranks, order } };
};

const pruneRanks = (ranks, characterLevel) => {
  let changed = true;
  while (changed) {
    changed = false;
    CHAOS_WEAVER_TALENT_NODES.forEach((node) => {
      if (!ranks[node.id]) return;
      if (characterLevel !== null && node.minLevel > characterLevel) {
        delete ranks[node.id];
        changed = true;
        return;
      }
      const gatePoints = treePoints({ ranks }, node.treeId) - ranks[node.id];
      if (gatePoints < node.requiresPoints) {
        delete ranks[node.id];
        changed = true;
        return;
      }
      const predecessorMissing = node.requires.some((predecessorId) => {
        const predecessor = CHAOS_WEAVER_TALENT_NODES_BY_ID[predecessorId];
        if (!predecessor) return true;
        return (ranks[predecessorId] || 0) !== predecessor.maxRanks;
      });
      if (predecessorMissing) {
        delete ranks[node.id];
        changed = true;
      }
    });
  }
};

export const removeRank = (allocation, nodeId) => {
  const currentRank = allocation.ranks[nodeId] || 0;
  if (currentRank === 0) return { ok: false, errors: [`${nodeId} has no ranks to remove`] };
  const ranks = { ...allocation.ranks };
  ranks[nodeId] = currentRank - 1;
  if (ranks[nodeId] === 0) delete ranks[nodeId];
  pruneRanks(ranks, null);
  return { ok: true, allocation: { ranks, order: normalizeOrder(allocation, ranks) } };
};

export const pruneAllocationForLevel = (allocation, characterLevel) => {
  const ranks = { ...allocation.ranks };
  pruneRanks(ranks, characterLevel);
  let guard = 0;
  while (allocationPoints({ ranks }) > pointBudgetForLevel(characterLevel) && guard < 200) {
    guard += 1;
    let target = null;
    CHAOS_WEAVER_TALENT_NODES.forEach((node) => {
      if (!ranks[node.id]) return;
      if (target === null || node.minLevel >= CHAOS_WEAVER_TALENT_NODES_BY_ID[target].minLevel) target = node.id;
    });
    if (target === null) break;
    ranks[target] -= 1;
    if (ranks[target] === 0) delete ranks[target];
    pruneRanks(ranks, characterLevel);
  }
  return { ok: true, allocation: { ranks, order: normalizeOrder(allocation, ranks) } };
};

export const grantedSpellIds = (allocation) =>
  CHAOS_WEAVER_TALENT_NODES.filter(
    (node) => node.grantId && (allocation.ranks[node.id] || 0) === node.maxRanks
  ).map((node) => node.grantId);

const capstoneSlugFor = (node) => {
  if (!node.capstoneExtension || !node.capstoneExtension.capstoneId) return null;
  const capstone = CHAOS_WEAVER_TALENT_NODES_BY_ID[node.capstoneExtension.capstoneId];
  if (!capstone || !capstone.grantId) return null;
  return capstone.grantId.replace(/^cw1_/, '').replace(/_/g, '-');
};

const PARAMETER_ALIAS_GROUPS = [
  ['second-possibility.allyStepFeet', 'second-possibility.continuationFeet'],
  ['second-possibility.allyWard', 'second-possibility.continuationWard']
];

export const previewParameterValues = (allocation) => {
  const values = {};
  const ranks = allocation && allocation.ranks ? allocation.ranks : {};
  CHAOS_WEAVER_TALENT_NODES.forEach((node) => {
    const rank = ranks[node.id] || 0;
    if (rank === 0 || node.maxRanks !== 3) return;
    const extensionSlug = capstoneSlugFor(node);
    const capstoneLearned =
      node.capstoneExtension && node.capstoneExtension.capstoneId
        ? (ranks[node.capstoneExtension.capstoneId] || 0) > 0
        : false;
    const rankEntry = node.rankValues[rank - 1];
    if (!rankEntry || !isPlainObject(rankEntry.values)) return;
    Object.entries(rankEntry.values).forEach(([key, value]) => {
      if (extensionSlug && key.startsWith(`${extensionSlug}.`) && !capstoneLearned) return;
      const previous = values[key];
      if (previous === undefined) {
        values[key] = { value, nodeId: node.id, rank };
        return;
      }
      const numeric = typeof value === 'number';
      const previousNumeric = typeof previous.value === 'number';
      if (numeric && previousNumeric) {
        if (Math.abs(value) > Math.abs(previous.value)) values[key] = { value, nodeId: node.id, rank };
      } else if (rank > previous.rank) {
        values[key] = { value, nodeId: node.id, rank };
      }
    });
  });
  PARAMETER_ALIAS_GROUPS.forEach((group) => {
    const present = group.filter((key) => values[key] !== undefined);
    if (present.length === 0) return;
    let winner = present[0];
    present.forEach((key) => {
      const candidate = values[key];
      const current = values[winner];
      const candidateNumeric = typeof candidate.value === 'number';
      const currentNumeric = typeof current.value === 'number';
      if (candidateNumeric && currentNumeric) {
        if (Math.abs(candidate.value) > Math.abs(current.value)) winner = key;
      } else if (candidate.rank > current.rank) {
        winner = key;
      }
    });
    const winning = { ...values[winner] };
    group.forEach((key) => {
      values[key] = { ...winning };
    });
  });
  return values;
};

export const allocationSummary = (allocation) => {
  const points = allocationPoints(allocation);
  const perTree = CHAOS_WEAVER_TREES.map((tree) => ({
    treeId: tree.id,
    name: tree.meta.name,
    points: treePoints(allocation, tree.id),
    maxPoints: 50
  }));
  const pointsFor = (treeId) => {
    const entry = perTree.find((candidate) => candidate.treeId === treeId);
    return entry ? entry.points : 0;
  };
  const recordedOrder = Array.isArray(allocation.order) ? allocation.order : [];
  const insertedOrder = Object.keys(allocation.ranks || {})
    .map((nodeId) => (CHAOS_WEAVER_TALENT_NODES_BY_ID[nodeId] ? CHAOS_WEAVER_TALENT_NODES_BY_ID[nodeId].treeId : null))
    .filter((treeId) => treeId !== null);
  const primaryTreeId =
    [...recordedOrder, ...insertedOrder].find((treeId) => pointsFor(treeId) > 0) || null;
  return {
    points,
    perTree,
    primaryTreeId,
    grantedSpellIds: grantedSpellIds(allocation)
  };
};

/* ------------------------------------------------------------------ */
/* Optional spell picks and build preview                             */
/* ------------------------------------------------------------------ */

export const canPickSpell = (spellId, { characterLevel, pickedSpellIds } = {}) => {
  const errors = [];
  const picked = Array.isArray(pickedSpellIds) ? pickedSpellIds : [];
  const spell = CHAOS_WEAVER_SPELLS_BY_ID[spellId];
  if (typeof spellId === 'string' && spellId.startsWith('talent_spell_')) {
    return { ok: false, errors: ['passive talent records are not optional picks'] };
  }
  if (!spell) return { ok: false, errors: [`unknown spell ${spellId}`] };
  if (spell.source !== 'level-pick') errors.push('only optional level-pick records can be chosen');
  if (spell.level > characterLevel) errors.push(`requires level ${spell.level}`);
  if (picked.includes(spellId)) errors.push('already chosen');
  if (picked.length >= characterLevel) {
    errors.push('one optional pick per level; no pool pick remains');
  }
  return { ok: errors.length === 0, errors, spell };
};

export const validateAllocation = (allocation, characterLevel) => {
  const errors = [];
  if (!isPlainObject(allocation) || !isPlainObject(allocation.ranks)) {
    return { ok: false, errors: ['allocation must be an object with a ranks map'] };
  }
  Object.entries(allocation.ranks).forEach(([nodeId, rank]) => {
    const node = CHAOS_WEAVER_TALENT_NODES_BY_ID[nodeId];
    if (!node) {
      errors.push(`unknown allocation node ${nodeId}`);
      return;
    }
    if (!Number.isInteger(rank) || rank < 1 || rank > node.maxRanks) {
      errors.push(`${node.name} rank must be an integer 1..${node.maxRanks}`);
      return;
    }
    if (node.minLevel > characterLevel) {
      errors.push(`${node.name} requires character level ${node.minLevel}`);
    }
    const gatePoints = treePoints(allocation, node.treeId) - rank;
    if (gatePoints < node.requiresPoints) {
      errors.push(`${node.name} needs ${node.requiresPoints} points in its tree gate (have ${gatePoints})`);
    }
    node.requires.forEach((predecessorId) => {
      const predecessor = CHAOS_WEAVER_TALENT_NODES_BY_ID[predecessorId];
      if (!predecessor || (allocation.ranks[predecessorId] || 0) !== predecessor.maxRanks) {
        errors.push(`${node.name} requires its predecessor ${predecessor ? predecessor.name : predecessorId} at full ranks`);
      }
    });
  });
  const points = allocationPoints(allocation);
  if (points > pointBudgetForLevel(characterLevel)) {
    errors.push(`talent points exceed the 5×level budget (${points} > ${pointBudgetForLevel(characterLevel)})`);
  }
  if (points > 50) errors.push('talent points exceed the cap of 50');
  return { ok: errors.length === 0, errors };
};

export const buildPreview = ({ characterLevel = 1, pickedSpellIds = [], allocation = createEmptyAllocation() } = {}) => {
  const errors = [];
  if (!Number.isInteger(characterLevel) || characterLevel < 1 || characterLevel > 10) {
    errors.push('characterLevel must be an integer 1..10');
  }
  if (!Array.isArray(pickedSpellIds)) {
    errors.push('pickedSpellIds must be an array');
    return { ok: false, errors, characterLevel, picks: [], talentPoints: 0, talentBudget: 0, primaryTreeId: null, grantedSpellIds: [], previewParameters: {} };
  }
  const seen = new Set();
  pickedSpellIds.forEach((spellId) => {
    if (seen.has(spellId)) errors.push(`duplicate pick ${spellId}`);
    seen.add(spellId);
    const spell = CHAOS_WEAVER_SPELLS_BY_ID[spellId];
    if (!spell) {
      errors.push(`${spellId}: unknown spell`);
      return;
    }
    if (spell.source !== 'level-pick') {
      errors.push(`${spellId}: only optional level-pick records can be a known pick`);
    }
    if (spell.level > characterLevel) errors.push(`${spellId}: requires level ${spell.level}`);
  });
  if (seen.size > characterLevel) {
    errors.push(`known picks exceed one optional pick per level (${seen.size} > ${characterLevel})`);
  }
  const effectiveLevel = Number.isInteger(characterLevel) ? characterLevel : null;
  const baseAllocation =
    isPlainObject(allocation) && isPlainObject(allocation.ranks) ? allocation : null;
  if (baseAllocation === null) {
    errors.push('allocation must be an object with a ranks map');
  } else {
    const highestRankedMinLevel = Object.keys(baseAllocation.ranks).reduce((highest, nodeId) => {
      const node = CHAOS_WEAVER_TALENT_NODES_BY_ID[nodeId];
      return Math.max(highest, node ? node.minLevel : 1);
    }, 1);
    const structuralLevel = Math.min(10, Math.max(effectiveLevel || 1, highestRankedMinLevel));
    errors.push(...validateAllocation(baseAllocation, structuralLevel).errors);
  }
  const pruned =
    baseAllocation === null
      ? createEmptyAllocation()
      : pruneAllocationForLevel(baseAllocation, effectiveLevel).allocation;
  const allocationCheck = validateAllocation(pruned, characterLevel);
  errors.push(...allocationCheck.errors);
  const summary = allocationSummary(pruned);
  const points = allocationPoints(pruned);
  return {
    ok: errors.length === 0,
    errors,
    characterLevel,
    picks: pickedSpellIds.map((id) => CHAOS_WEAVER_SPELLS_BY_ID[id]),
    talentPoints: points,
    talentBudget: pointBudgetForLevel(characterLevel),
    primaryTreeId: summary.primaryTreeId,
    grantedSpellIds: summary.grantedSpellIds,
    previewParameters: previewParameterValues(pruned),
    allocation: pruned
  };
};

/* ------------------------------------------------------------------ */
/* Export / import packet                                             */
/* ------------------------------------------------------------------ */

export const CHAOS_WEAVER_EXPORT_FIELDS = [
  'schemaVersion',
  'classId',
  'rulesetVersion',
  'authoredOnly',
  'executionEnabled',
  'classData',
  'resourceRules',
  'progression',
  'spells',
  'talents',
  'nativeVariants',
  'rehearsal'
];

export const buildExportPacket = ({ rehearsal = null } = {}) => ({
  schemaVersion: 1,
  classId: CHAOS_WEAVER_CLASS_ID,
  rulesetVersion: CHAOS_WEAVER_RULESET_VERSION,
  authoredOnly: true,
  executionEnabled: false,
  classData: {
    identity: CHAOS_WEAVER_IDENTITY,
    origin: CHAOS_WEAVER_ORIGIN,
    acquisitionRecords: CHAOS_WEAVER_ACQUISITION_RECORDS,
    ruleset: CHAOS_WEAVER_RULESET,
    settlementRules: CHAOS_WEAVER_SETTLEMENT_RULES
  },
  resourceRules: CHAOS_WEAVER_RESOURCE_RULES,
  progression: CHAOS_WEAVER_PROGRESSION,
  spells: CHAOS_WEAVER_ACTIVE_SPELLS,
  talents: {
    trees: CHAOS_WEAVER_TREES,
    passiveSpells: CHAOS_WEAVER_PASSIVE_SPELLS
  },
  nativeVariants: CHAOS_WEAVER_NATIVE_VARIANTS,
  rehearsal
});

const REHEARSAL_FIELDS = [
  'status',
  'label',
  'turn',
  'tiles',
  'pending',
  'anomaly',
  'penalties',
  'usage',
  'settlements',
  'log',
  'actionSeq'
];
const PENDING_FIELDS = [
  'actionId',
  'spellId',
  'sourceLabel',
  'targetLabel',
  'primaryTileIds',
  'continuationTileId',
  'mapping',
  'selectedTileId',
  'recordedFaces',
  'phase'
];
const ANOMALY_FIELDS = [
  'actionId',
  'spellId',
  'sourceLabel',
  'tileIds',
  'centerLabel',
  'radiusFeet',
  'placementRangeFeet',
  'trigger',
  'createdOwnTurn',
  'expiresEndOwnTurn',
  'profile',
  'mapping',
  'dismissalActionId'
];
const PENALTY_FIELDS = ['sourceActionId', 'feet', 'expiresBoundary', 'expiresOwnTurn'];
const PENALTY_BOUNDARIES = ['next-own-turn-start', 'end-next-own-turn'];
const SETTLEMENT_KINDS = ['settlement', 'void', 'anomaly-trigger', 'dismissal', 'unbind'];

const validatePendingShape = (pending, session, errors) => {
  if (!isPlainObject(pending)) {
    errors.push('pending must be null or an object');
    return;
  }
  const missing = missingFields(pending, PENDING_FIELDS);
  if (missing.length > 0) errors.push(`pending missing ${missing.join(', ')}`);
  const allowed = pending.kind === undefined ? PENDING_FIELDS : [...PENDING_FIELDS, 'kind'];
  const extra = extraFields(pending, allowed);
  if (extra.length > 0) errors.push(`pending unknown fields ${extra.join(', ')}`);
  if (pending.kind !== undefined && pending.kind !== 'anomaly-trigger') {
    errors.push('pending.kind must be anomaly-trigger when present');
  }
  if (typeof pending.actionId !== 'string') errors.push('pending.actionId must be a string');
  const spell = typeof pending.spellId === 'string' ? CHAOS_WEAVER_SPELLS_BY_ID[pending.spellId] : null;
  if (!spell) errors.push('pending.spellId does not resolve');
  if (typeof pending.sourceLabel !== 'string') errors.push('pending.sourceLabel must be a string');
  if (typeof pending.targetLabel !== 'string') errors.push('pending.targetLabel must be a string');
  if (!Array.isArray(pending.primaryTileIds) || pending.primaryTileIds.some((tileId) => !CHAOS_WEAVER_TILE_IDS.includes(tileId))) {
    errors.push('pending.primaryTileIds must list real tile IDs');
    return;
  }
  if (
    pending.primaryTileIds.length === 0 ||
    pending.primaryTileIds.length > 4 ||
    !deepEqual(pending.primaryTileIds, sortTileIds(pending.primaryTileIds))
  ) {
    errors.push('pending.primaryTileIds must be a sorted non-empty ID list');
  }
  const deterministicPending =
    pending.kind !== 'anomaly-trigger' &&
    spell !== null &&
    spell.branchRule === null &&
    spell.outcome !== null &&
    spell.outcome !== undefined;
  if (pending.kind !== 'anomaly-trigger' && spell && spell.branchRule === null && !deterministicPending) {
    errors.push('a deterministic record without an authored retained outcome cannot hold a pending action');
  }
  if (spell) {
    const combo = comboForTileIds(spell, pending.primaryTileIds);
    if (combo === null) {
      errors.push('pending primary IDs do not satisfy the authored symbol requirement');
    }
  }
  const expectedMapping =
    pending.kind === 'anomaly-trigger'
      ? buildMapping(pending.primaryTileIds)
      : deterministicPending
        ? deterministicMappingFor(pending.primaryTileIds)
        : buildMapping(pending.primaryTileIds);
  if (expectedMapping === null) {
    errors.push('a sampled pending action needs two to four committed IDs');
  } else if (!deepEqual(pending.mapping, expectedMapping)) {
    errors.push('pending mapping does not match the fixed mapping for the committed IDs');
  }
  if (pending.continuationTileId !== null && !CHAOS_WEAVER_TILE_IDS.includes(pending.continuationTileId)) {
    errors.push('pending.continuationTileId must be null or a real tile ID');
  }
  if (pending.continuationTileId !== null && pending.kind !== 'anomaly-trigger') {
    if (!spell || !spell.continuation) {
      errors.push('this action has no authored continuation profile');
    } else if (
      !spell.continuation.choices.some((choice) =>
        choice.tileSymbols.includes(tileSymbol(pending.continuationTileId))
      )
    ) {
      errors.push('the reserved continuation must match an authored continuation choice symbol');
    }
  }
  if (Array.isArray(pending.primaryTileIds) && pending.primaryTileIds.includes(pending.continuationTileId)) {
    errors.push('continuation tile must be excluded from the primary sample');
  }
  const validPhases = ['committed', 'continuation-pending', 'face-recorded'];
  if (!validPhases.includes(pending.phase)) {
    errors.push('pending.phase invalid');
  }
  if (deterministicPending) {
    if (pending.phase !== 'face-recorded') {
      errors.push('a deterministic retained result settles without a physical face');
    }
    if (pending.selectedTileId !== null) {
      errors.push('a deterministic retained result selects no tile');
    }
    if (pending.recordedFaces !== null) {
      errors.push('a deterministic retained result records no face');
    }
  } else if (pending.phase === 'committed') {
    if (pending.selectedTileId !== null || pending.recordedFaces !== null) {
      errors.push('a committed pending action has no recorded face yet');
    }
  } else {
    if (!Array.isArray(pending.recordedFaces) || pending.recordedFaces.length !== 1) {
      errors.push('pending.recordedFaces must hold exactly one recorded face');
    } else if (!resolveFace(expectedMapping, pending.recordedFaces[0]).ok) {
      errors.push('pending.recordedFaces does not match the fixed mapping');
    } else if (resolveFace(expectedMapping, pending.recordedFaces[0]).tileId !== pending.selectedTileId) {
      errors.push('pending.selectedTileId does not match the recorded face');
    }
    if (!pending.primaryTileIds.includes(pending.selectedTileId)) {
      errors.push('pending.selectedTileId must be one of the primary IDs');
    }
    if (pending.phase === 'continuation-pending') {
      if (!spell || !spell.continuation || pending.continuationTileId === null) {
        errors.push('a continuation-pending action needs an authored continuation and a reserved ID');
      }
    }
    if (pending.phase === 'face-recorded' && spell && spell.continuation && pending.continuationTileId !== null) {
      errors.push('this action still owes a continuation choice');
    }
  }
  if (pending.kind === 'anomaly-trigger') {
    const anomaly = session.anomaly;
    if (anomaly === null) {
      errors.push('an anomaly-trigger action needs its anomaly record');
    } else {
      if (anomaly.actionId !== pending.actionId || anomaly.spellId !== pending.spellId) {
        errors.push('the unresolved trigger must belong to the retained anomaly');
      }
      if (!deepEqual(pending.primaryTileIds, [...anomaly.tileIds])) {
        errors.push('the unresolved trigger must keep the anomaly tile IDs');
      }
      if (!deepEqual(pending.mapping, anomaly.mapping)) {
        errors.push('the unresolved trigger must retain the published anomaly mapping');
      }
    }
    if (!spell || !spell.area || !spell.area.branches) {
      errors.push('only a record with authored trigger branches can be triggered');
    }
    if (!pending.primaryTileIds.every((tileId) => zoneOfTile(session.tiles, tileId) === 'bound')) {
      errors.push('the unresolved trigger keeps its IDs bound');
    }
  } else {
    if (!pending.primaryTileIds.every((tileId) => zoneOfTile(session.tiles, tileId) === 'committed')) {
      errors.push('pending primary tiles must be committed');
    }
    if (
      pending.continuationTileId !== null &&
      (!CHAOS_WEAVER_TILE_IDS.includes(pending.continuationTileId) ||
        zoneOfTile(session.tiles, pending.continuationTileId) !== 'committed')
    ) {
      errors.push('pending continuation tile must be committed');
    }
  }
};

const validateAnomalyShape = (anomaly, errors) => {
  if (!isPlainObject(anomaly)) {
    errors.push('anomaly must be null or an object');
    return;
  }
  const missing = missingFields(anomaly, ANOMALY_FIELDS);
  if (missing.length > 0) errors.push(`anomaly missing ${missing.join(', ')}`);
  const extra = extraFields(anomaly, ANOMALY_FIELDS);
  if (extra.length > 0) errors.push(`anomaly unknown fields ${extra.join(', ')}`);
  const spell = typeof anomaly.spellId === 'string' ? CHAOS_WEAVER_SPELLS_BY_ID[anomaly.spellId] : null;
  if (!spell) errors.push('anomaly.spellId does not resolve');
  else if (spell.tileRule.zoneTo !== 'bound') errors.push('anomaly.spellId must be a binding record');
  if (!Array.isArray(anomaly.tileIds) || anomaly.tileIds.some((tileId) => !CHAOS_WEAVER_TILE_IDS.includes(tileId))) {
    errors.push('anomaly.tileIds must list real tile IDs');
  } else if (!deepEqual(anomaly.tileIds, sortTileIds(anomaly.tileIds))) {
    errors.push('anomaly.tileIds must be sorted');
  }
  if (typeof anomaly.sourceLabel !== 'string') errors.push('anomaly.sourceLabel must be a string');
  if (typeof anomaly.centerLabel !== 'string') errors.push('anomaly.centerLabel must be a string');
  if (!Number.isInteger(anomaly.radiusFeet) || anomaly.radiusFeet < 0) errors.push('anomaly.radiusFeet must be a non-negative integer');
  if (!Number.isInteger(anomaly.placementRangeFeet) || anomaly.placementRangeFeet < 0) {
    errors.push('anomaly.placementRangeFeet must be a non-negative integer');
  }
  if (typeof anomaly.trigger !== 'string') errors.push('anomaly.trigger must be a string');
  if (!Number.isInteger(anomaly.createdOwnTurn) || anomaly.createdOwnTurn < 1) {
    errors.push('anomaly.createdOwnTurn must be a positive integer');
  }
  if (!Number.isInteger(anomaly.expiresEndOwnTurn) || anomaly.expiresEndOwnTurn <= anomaly.createdOwnTurn) {
    errors.push('anomaly.expiresEndOwnTurn must be after creation');
  }
  if (spell && !deepEqual(anomaly.profile, spell.area)) {
    errors.push('anomaly.profile must match the authored area record');
  }
  if (Array.isArray(anomaly.tileIds)) {
    const expectedMapping = buildMapping(anomaly.tileIds);
    if (!deepEqual(anomaly.mapping, expectedMapping)) {
      errors.push('anomaly.mapping must match the published mapping for its IDs');
    }
  }
  if (anomaly.dismissalActionId !== null && typeof anomaly.dismissalActionId !== 'string') {
    errors.push('anomaly.dismissalActionId must be null or an action ID');
  }
};

const validateSettlementShape = (entry, session, errors) => {
  const label = `settlement ${entry && entry.actionId ? entry.actionId : '?'}`;
  if (!isPlainObject(entry)) {
    errors.push('settlement entries must be objects');
    return;
  }
  if (typeof entry.actionId !== 'string') errors.push(`${label}: actionId must be a string`);
  if (!SETTLEMENT_KINDS.includes(entry.kind)) {
    errors.push(`${label}: kind invalid`);
    return;
  }
  const spell = typeof entry.spellId === 'string' ? CHAOS_WEAVER_SPELLS_BY_ID[entry.spellId] : null;
  if (!spell) errors.push(`${label}: spellId does not resolve`);
  if (entry.kind === 'void') {
    const allowed = ['actionId', 'kind', 'reason', 'spellId', 'primaryTileIds', 'continuationTileId', 'selectedTileId', 'recordedFaces'];
    const extra = extraFields(entry, allowed);
    if (extra.length > 0) errors.push(`${label}: unknown fields ${extra.join(', ')}`);
    if (typeof entry.reason !== 'string' || entry.reason.trim().length === 0) errors.push(`${label}: void needs a reason`);
    return;
  }
  if (entry.kind === 'dismissal' || entry.kind === 'unbind') {
    const expectedSpell = entry.kind === 'dismissal' ? 'cw1_dismiss_anomaly' : 'cw1_35';
    if (entry.spellId !== expectedSpell) errors.push(`${label}: ${entry.kind} must reference ${expectedSpell}`);
    const allowed =
      entry.kind === 'unbind'
        ? ['actionId', 'kind', 'spellId', 'primaryTileIds', 'closedAnomaly']
        : ['actionId', 'kind', 'spellId', 'closedAnomaly'];
    const extra = extraFields(entry, allowed);
    if (extra.length > 0) errors.push(`${label}: unknown fields ${extra.join(', ')}`);
    const closed = entry.closedAnomaly;
    if (!isPlainObject(closed) || typeof closed.actionId !== 'string' || !Array.isArray(closed.tileIds)) {
      errors.push(`${label}: closedAnomaly must retain the closed record`);
    }
    return;
  }
  const allowed = [
    'actionId',
    'kind',
    'spellId',
    'primaryTileIds',
    'continuationTileId',
    'selectedTileId',
    'recordedFaces',
    'merged',
    'outcome',
    'continuation',
    'confirmed',
    'closedAnomaly'
  ];
  const extra = extraFields(entry, allowed);
  if (extra.length > 0) errors.push(`${label}: unknown fields ${extra.join(', ')}`);
  if (!Array.isArray(entry.primaryTileIds) || entry.primaryTileIds.length === 0) {
    errors.push(`${label}: primaryTileIds must be a non-empty array`);
    return;
  }
  const symbol = entry.selectedTileId === null ? null : tileSymbol(entry.selectedTileId);
  const deterministicSettlement =
    entry.kind !== 'anomaly-trigger' && spell !== null && spell.branchRule === null;
  if (entry.kind === 'anomaly-trigger') {
    const authoredOutcome =
      spell && spell.area && spell.area.branches ? spell.area.branches[symbol] : null;
    if (!authoredOutcome) errors.push(`${label}: the selected ID has no authored anomaly branch`);
    else if (!deepEqual(entry.outcome, authoredOutcome)) errors.push(`${label}: retained outcome must match the authored anomaly branch`);
  } else if (deterministicSettlement) {
    if (entry.selectedTileId !== null) {
      errors.push(`${label}: a deterministic settlement selects no tile`);
    }
    if (!spell.outcome || !deepEqual(entry.outcome, spell.outcome)) {
      errors.push(`${label}: retained outcome must match the authored deterministic result`);
    }
  } else {
    const authoredOutcome =
      spell && spell.branchRule ? spell.branchRule.outcomes[symbol] : null;
    if (authoredOutcome && !deepEqual(entry.outcome, authoredOutcome)) {
      errors.push(`${label}: retained outcome must match the authored branch`);
    } else if (!authoredOutcome && entry.outcome !== null && entry.outcome !== undefined) {
      errors.push(`${label}: this recall has no authored branch outcome`);
    }
    if (entry.continuation !== null && entry.continuation !== undefined) {
      const authoredChoice =
        spell && spell.continuation
          ? spell.continuation.choices.find((candidate) => deepEqual(candidate, entry.continuation))
          : null;
      if (!authoredChoice) errors.push(`${label}: retained continuation must match an authored choice`);
    }
  }
  if (!Array.isArray(entry.confirmed)) errors.push(`${label}: confirmed must be an array`);
  if (entry.closedAnomaly !== null && entry.closedAnomaly !== undefined && !isPlainObject(entry.closedAnomaly)) {
    errors.push(`${label}: closedAnomaly must be null or a record`);
  }
  if (entry.selectedTileId !== null) {
    if (!entry.primaryTileIds.includes(entry.selectedTileId)) {
      errors.push(`${label}: the selected ID must be one of the settled primary IDs`);
    }
    if (!Array.isArray(entry.recordedFaces) || entry.recordedFaces.length !== 1) {
      errors.push(`${label}: a face-selected settlement must retain exactly one recorded face`);
    } else if (entry.kind === 'anomaly-trigger' || (spell && spell.branchRule !== null)) {
      const settlementMapping = buildMapping(entry.primaryTileIds);
      const resolved = settlementMapping === null ? null : resolveFace(settlementMapping, entry.recordedFaces[0]);
      if (resolved === null || !resolved.ok || resolved.tileId !== entry.selectedTileId) {
        errors.push(`${label}: the recorded face must resolve to the selected ID`);
      }
    }
  }
};

export const validateRehearsalState = (rehearsal) => {
  const errors = [];
  if (rehearsal === null || rehearsal === undefined) return { ok: true, errors, state: null };
  if (!isPlainObject(rehearsal)) return { ok: false, errors: ['rehearsal is not an object'], state: null };
  const missing = missingFields(rehearsal, REHEARSAL_FIELDS);
  if (missing.length > 0) errors.push(`rehearsal missing ${missing.join(', ')}`);
  const extra = extraFields(rehearsal, REHEARSAL_FIELDS);
  if (extra.length > 0) errors.push(`rehearsal unknown fields ${extra.join(', ')}`);
  if (rehearsal.status !== 'active' && rehearsal.status !== 'uninitialized') {
    errors.push('rehearsal.status must be active or uninitialized');
  }
  if (typeof rehearsal.label !== 'string') errors.push('rehearsal.label must be a string');
  if (!Number.isInteger(rehearsal.actionSeq) || rehearsal.actionSeq < 0) {
    errors.push('rehearsal.actionSeq must be a non-negative integer');
  }
  if (!isPlainObject(rehearsal.turn)) {
    errors.push('rehearsal.turn must be an object');
  } else {
    ['ownTurnNumber', 'apAvailable', 'remainingMovementFeet'].forEach((field) => {
      const value = rehearsal.turn[field];
      if (!Number.isInteger(value) || value < 0) errors.push(`rehearsal.turn.${field} must be a non-negative integer`);
    });
    const turnExtra = extraFields(rehearsal.turn, ['ownTurnNumber', 'apAvailable', 'remainingMovementFeet']);
    if (turnExtra.length > 0) errors.push(`rehearsal.turn unknown fields ${turnExtra.join(', ')}`);
    if (rehearsal.status === 'active' && rehearsal.turn.ownTurnNumber < 1) {
      errors.push('an active rehearsal starts at own turn 1');
    }
  }
  const stateCheck = validateTileState(rehearsal.tiles);
  if (!stateCheck.ok) errors.push(...stateCheck.errors);
  if (!Array.isArray(rehearsal.penalties)) {
    errors.push('rehearsal.penalties must be an array');
  } else {
    rehearsal.penalties.forEach((penalty, index) => {
      if (!isPlainObject(penalty)) {
        errors.push(`penalty ${index} must be an object`);
        return;
      }
      const penaltyMissing = missingFields(penalty, PENALTY_FIELDS);
      if (penaltyMissing.length > 0) errors.push(`penalty ${index} missing ${penaltyMissing.join(', ')}`);
      const penaltyExtra = extraFields(penalty, PENALTY_FIELDS);
      if (penaltyExtra.length > 0) errors.push(`penalty ${index} unknown fields ${penaltyExtra.join(', ')}`);
      if (typeof penalty.sourceActionId !== 'string') errors.push(`penalty ${index} sourceActionId must be a string`);
      if (!Number.isInteger(penalty.feet) || penalty.feet <= 0) errors.push(`penalty ${index} feet must be positive`);
      if (!PENALTY_BOUNDARIES.includes(penalty.expiresBoundary)) {
        errors.push(`penalty ${index} expiresBoundary invalid`);
      }
      if (!Number.isInteger(penalty.expiresOwnTurn) || penalty.expiresOwnTurn < 1) {
        errors.push(`penalty ${index} expiresOwnTurn must be a positive integer`);
      }
    });
  }
  if (!isPlainObject(rehearsal.usage)) {
    errors.push('rehearsal.usage must be an object');
  } else {
    const usageExtra = extraFields(rehearsal.usage, ['completedRestId', 'oncePerRest']);
    if (usageExtra.length > 0) errors.push(`rehearsal.usage unknown fields ${usageExtra.join(', ')}`);
    if (rehearsal.usage.completedRestId !== null && typeof rehearsal.usage.completedRestId !== 'string') {
      errors.push('rehearsal.usage.completedRestId must be null or a string');
    }
    if (!Array.isArray(rehearsal.usage.oncePerRest)) {
      errors.push('rehearsal.usage.oncePerRest must be an array');
    } else {
      const seenUsage = new Set();
      rehearsal.usage.oncePerRest.forEach((spellId) => {
        if (typeof spellId !== 'string') {
          errors.push('once/rest uses must be string IDs');
          return;
        }
        if (seenUsage.has(spellId)) errors.push(`duplicate once/rest use ${spellId}`);
        seenUsage.add(spellId);
        if (spellId === 'native:prepared-exchange') return;
        const spell = CHAOS_WEAVER_SPELLS_BY_ID[spellId];
        if (!spell || !spell.timing.oncePerRest) errors.push(`once/rest use ${spellId} does not resolve to a once/rest record`);
      });
    }
  }
  if (!Array.isArray(rehearsal.settlements)) {
    errors.push('rehearsal.settlements must be an array');
  } else {
    rehearsal.settlements.forEach((entry) => validateSettlementShape(entry, rehearsal, errors));
  }
  if (!Array.isArray(rehearsal.log)) {
    errors.push('rehearsal.log must be an array');
  } else {
    rehearsal.log.forEach((entry, index) => {
      if (!isPlainObject(entry) || typeof entry.id !== 'string' || typeof entry.kind !== 'string' || typeof entry.text !== 'string') {
        errors.push(`log ${index} must be an id/kind/text entry`);
      }
    });
  }
  if (rehearsal.pending === null || rehearsal.pending === undefined) {
    // no pending action
  } else {
    validatePendingShape(rehearsal.pending, rehearsal, errors);
  }
  if (rehearsal.anomaly === null || rehearsal.anomaly === undefined) {
    // no anomaly
  } else {
    validateAnomalyShape(rehearsal.anomaly, errors);
    if (Array.isArray(rehearsal.anomaly.tileIds)) {
      rehearsal.anomaly.tileIds.forEach((tileId) => {
        if (CHAOS_WEAVER_TILE_IDS.includes(tileId) && zoneOfTile(rehearsal.tiles, tileId) !== 'bound') {
          errors.push(`anomaly tile ${tileId} must be bound`);
        }
      });
    }
  }
  if (isPlainObject(rehearsal.tiles) && Array.isArray(rehearsal.tiles.committed)) {
    const ownedCommitted = new Set();
    if (isPlainObject(rehearsal.pending) && rehearsal.pending.kind !== 'anomaly-trigger') {
      (Array.isArray(rehearsal.pending.primaryTileIds) ? rehearsal.pending.primaryTileIds : []).forEach((tileId) =>
        ownedCommitted.add(tileId)
      );
      if (typeof rehearsal.pending.continuationTileId === 'string') {
        ownedCommitted.add(rehearsal.pending.continuationTileId);
      }
    }
    rehearsal.tiles.committed.forEach((tileId) => {
      if (!ownedCommitted.has(tileId)) {
        errors.push(`committed tile ${tileId} has no unresolved action owner`);
      }
    });
  }
  if (isPlainObject(rehearsal.tiles) && Array.isArray(rehearsal.tiles.bound)) {
    const ownedBound = new Set(
      isPlainObject(rehearsal.anomaly) && Array.isArray(rehearsal.anomaly.tileIds) ? rehearsal.anomaly.tileIds : []
    );
    rehearsal.tiles.bound.forEach((tileId) => {
      if (!ownedBound.has(tileId)) {
        errors.push(`bound tile ${tileId} has no visible anomaly owner`);
      }
    });
  }
  if (rehearsal.status === 'uninitialized') {
    if (rehearsal.pending !== null && rehearsal.pending !== undefined) errors.push('an uninitialized worksheet has no pending action');
    if (rehearsal.anomaly !== null && rehearsal.anomaly !== undefined) errors.push('an uninitialized worksheet has no anomaly');
    if (Array.isArray(rehearsal.penalties) && rehearsal.penalties.length > 0) {
      errors.push('an uninitialized worksheet has no penalties');
    }
    if (Array.isArray(rehearsal.settlements) && rehearsal.settlements.length > 0) {
      errors.push('an uninitialized worksheet has no settlements');
    }
  }
  return { ok: errors.length === 0, errors, state: errors.length === 0 ? rehearsal : null };
};

export const serializePacket = (rawPacket) => JSON.stringify(rawPacket);

const AUTHENTIC_CLASS_DATA = {
  identity: CHAOS_WEAVER_IDENTITY,
  origin: CHAOS_WEAVER_ORIGIN,
  acquisitionRecords: CHAOS_WEAVER_ACQUISITION_RECORDS,
  ruleset: CHAOS_WEAVER_RULESET,
  settlementRules: CHAOS_WEAVER_SETTLEMENT_RULES
};
const AUTHENTIC_TALENTS = {
  trees: CHAOS_WEAVER_TREES,
  passiveSpells: CHAOS_WEAVER_PASSIVE_SPELLS
};

export const importPacket = (rawText) => {
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    return { ok: false, errors: [`import is not valid JSON: ${error.message}`], packet: null, draftText: rawText };
  }
  if (!isPlainObject(parsed)) {
    return { ok: false, errors: ['import must be a JSON object'], packet: null, draftText: rawText };
  }
  const errors = [];
  const unknownTopLevel = Object.keys(parsed).filter((key) => !CHAOS_WEAVER_EXPORT_FIELDS.includes(key));
  if (unknownTopLevel.length > 0) {
    errors.push(`unknown extensions prevent C1 validation: ${unknownTopLevel.join(', ')}`);
  }
  const missingTopLevel = CHAOS_WEAVER_EXPORT_FIELDS.filter((field) => !(field in parsed));
  if (missingTopLevel.length > 0) {
    errors.push(`packet missing members: ${missingTopLevel.join(', ')}`);
  }
  if (parsed.schemaVersion !== 1) errors.push('schemaVersion must be exactly 1');
  if (parsed.classId !== CHAOS_WEAVER_CLASS_ID) errors.push('classId mismatch');
  if (parsed.rulesetVersion !== CHAOS_WEAVER_RULESET_VERSION) errors.push('rulesetVersion mismatch');
  if (parsed.authoredOnly !== true) errors.push('authoredOnly must be true');
  if (parsed.executionEnabled !== false) errors.push('executionEnabled must be false');

  if (!deepEqual(parsed.classData, AUTHENTIC_CLASS_DATA)) {
    errors.push('classData must match the certified C1 class record exactly');
  }
  if (!deepEqual(parsed.resourceRules, CHAOS_WEAVER_RESOURCE_RULES)) {
    errors.push('resourceRules must match the certified C1 resource rules exactly');
  }
  if (!deepEqual(parsed.progression, CHAOS_WEAVER_PROGRESSION)) {
    errors.push('progression must match the certified C1 progression exactly');
  }
  if (!deepEqual(parsed.spells, CHAOS_WEAVER_ACTIVE_SPELLS)) {
    errors.push('spells must match the 49 certified C1 active records exactly');
  }
  if (!deepEqual(parsed.talents, AUTHENTIC_TALENTS)) {
    errors.push('talents must match the certified C1 trees and passive records exactly');
  }
  if (!deepEqual(parsed.nativeVariants, CHAOS_WEAVER_NATIVE_VARIANTS)) {
    errors.push('nativeVariants must match the certified C1 native variant exactly');
  }

  let rehearsalState = null;
  if (parsed.rehearsal !== null && parsed.rehearsal !== undefined) {
    const rehearsalCheck = validateRehearsalState(parsed.rehearsal);
    if (!rehearsalCheck.ok) {
      errors.push(...rehearsalCheck.errors.map((message) => `rehearsal: ${message}`));
    } else {
      rehearsalState = rehearsalCheck.state;
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors, packet: null, draft: parsed, draftText: rawText };
  }
  return { ok: true, errors, packet: buildExportPacket({ rehearsal: rehearsalState }), draftText: rawText };
};

export const exportPacketText = ({ rehearsal = null } = {}) =>
  serializePacket(buildExportPacket({ rehearsal }));
