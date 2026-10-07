import {
  HERITAGE_TRADITIONS, getClassNativeHeritageIds, resolveClassHeritageName,
  resolveClassHeritageId, getClassHeritageAccess
} from './classHeritageRegistry';
import { getHeritageEdge, evaluateHeritageEdge } from './heritageEdgeContract';

// Blueprint §12 Pass 5: the consumer translates authored edges into bounded
// engine modifiers and named capabilities. Numeric fields are clamped to the
// schema caps so no sequence of effects can exceed a single bounded edge.
export const HERITAGE_MODIFIER_CAPS = Object.freeze({
  attackBonus: 3, damageBonus: 4, defenseBonus: 3, saveBonus: 3,
  movement: 15, resourceGain: 5, resourceDiscount: 3, criticalThreshold: 1, healing: 10
});

const ZERO_MODIFIERS = Object.freeze({
  attackBonus: 0, damageBonus: 0, defenseBonus: 0, saveBonus: 0,
  movement: 0, resourceGain: 0, resourceDiscount: 0, criticalThreshold: 0, healing: 0
});

const EDGE_FIELD = {
  attack_bonus: 'attackBonus', damage_bonus: 'damageBonus', defense_bonus: 'defenseBonus',
  save_bonus: 'saveBonus', movement: 'movement', resource_gain: 'resourceGain',
  resource_discount: 'resourceDiscount', critical_threshold: 'criticalThreshold', healing: 'healing'
};

const clampModifier = (field, value) => {
  const cap = HERITAGE_MODIFIER_CAPS[field];
  if (cap === undefined) return value;
  return Math.max(-cap, Math.min(cap, value));
};

export function translateHeritageEdge(entry) {
  const modifiers = { ...ZERO_MODIFIERS };
  const capabilities = [];
  const costCapabilities = [];
  const resourceCosts = [];
  const selfDamage = [];
  if (!entry) return { modifiers, capabilities, costCapabilities, resourceCosts, selfDamage };

  const field = EDGE_FIELD[entry.edge.kind];
  if (field && Number.isFinite(entry.edge.magnitude)) modifiers[field] = clampModifier(field, modifiers[field] + entry.edge.magnitude);
  if (entry.edge.kind === 'capability' && entry.edge.capability) capabilities.push(entry.edge.capability);

  const cost = entry.cost;
  if (cost.kind === 'resource_loss' && cost.resource && Number.isFinite(cost.magnitude)) {
    resourceCosts.push({ resource: cost.resource, magnitude: cost.magnitude });
  } else if (cost.kind === 'self_damage') {
    selfDamage.push({ dice: cost.dice || 1, sides: cost.sides || 4 });
  } else if (cost.kind === 'mobility_penalty' && Number.isFinite(cost.magnitude)) {
    modifiers.movement = clampModifier('movement', modifiers.movement - cost.magnitude);
  } else if (cost.capability) {
    costCapabilities.push(cost.capability);
  }

  return { modifiers, capabilities, costCapabilities, resourceCosts, selfDamage };
}

export function isNativeHeritagePair(className, heritageId) {
  return getClassNativeHeritageIds(className).includes(heritageId);
}

// Applies only for the character's actual class+heritage pair, only after the
// acquisition gate is satisfied (native, or a recorded qualified exception for
// an E route), and only when the edge's checkable condition is met.
export function collectHeritageModifiers(character = {}, context = {}) {
  const base = resolveClassHeritageName(character.class);
  const heritageId = resolveClassHeritageId(character.race, character.subrace);
  const entry = base && heritageId ? getHeritageEdge(base, heritageId) : null;
  if (!entry) return { applies: false, reason: 'no-edge', ...translateHeritageEdge(null), events: [] };

  if (!isNativeHeritagePair(base, heritageId)) {
    const acquisition = character.classAcquisition?.[base] || {};
    const access = getClassHeritageAccess(base, character.race, character.subrace, {
      method: acquisition.method,
      qualification: acquisition.qualification,
      bodyStates: Array.isArray(character.bodyStates) ? character.bodyStates : []
    });
    if (access.status !== 'qualified-exception') {
      return { applies: false, reason: 'not-qualified', ...translateHeritageEdge(null), events: [] };
    }
  }

  const evaluation = evaluateHeritageEdge(entry, context);
  return {
    applies: evaluation.applies,
    reason: evaluation.reason,
    ...(evaluation.applies ? translateHeritageEdge(entry) : translateHeritageEdge(null)),
    entry: evaluation.applies ? entry : null,
    events: evaluation.events
  };
}

// Capability-oriented view for combat consumers: which named abilities and cost
// events are active for this character under the supplied context.
export function getActiveHeritageAbilities(character = {}, context = {}) {
  const result = collectHeritageModifiers(character, context);
  return {
    applies: result.applies,
    reason: result.reason,
    capabilities: result.capabilities,
    costCapabilities: result.costCapabilities,
    resourceCosts: result.resourceCosts,
    selfDamage: result.selfDamage,
    events: result.events
  };
}

export function summarizeHeritageEdgesForClass(className) {
  const base = resolveClassHeritageName(className);
  if (!base) return [];
  return getClassNativeHeritageIds(className).map(heritageId => {
    const entry = getHeritageEdge(base, heritageId);
    return {
      heritageId,
      heritageName: HERITAGE_TRADITIONS[heritageId]?.name || heritageId,
      edge: entry?.description || null,
      cost: entry?.costDescription || null,
      implemented: Boolean(entry)
    };
  });
}
