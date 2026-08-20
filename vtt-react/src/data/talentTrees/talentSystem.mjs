/**
 * TALENT SYSTEM v2 — Constants, Schema, and Validation
 * ============================================
 *
 * CANONICAL ECONOMY (decision 2026-08-19):
 * - Character level cap: 10. Every level is meaningful and grants new spells.
 * - Talent points: 5 per level => 50 total points earned by a character.
 * - Each class has 3 talent trees. Each tree holds EXACTLY 50 investable points.
 * - 50 earned vs 150 capacity: a character can max exactly ONE tree, or hybrid
 *   across trees at the cost of capstones.
 *
 * TREE STRUCTURE:
 * - 7 tiers (rows). A talent in tier N becomes selectable once the character has
 *   spent (N - 1) * 5 points in that tree. Tier 7 (the capstone band) unlocks at
 *   30 points spent in-tree.
 * - Prerequisites (`requires`) must point to a talent in a STRICTLY LOWER tier,
 *   which makes cycles impossible and guarantees full-spend feasibility.
 *
 * TALENT NODE SCHEMA (v2):
 * {
 *   id: string            — unique within tree, kebab/snake case
 *   name: string
 *   icon: string          — WoW-style icon name
 *   position: { x, y }    — x: column 0-4, y: row 0-6 (tier = y + 1)
 *   maxRanks: 1 | 2 | 3 | 5
 *   requires: string | string[] | null   — prerequisite node id(s) in lower tiers
 *   requiresAll: boolean  — AND (true) vs OR (false) logic for multiple requires
 *   spell: object         — the FULL spell the talent grants at rank 1, in the
 *                           standard spell format (see spellTemplates.js).
 *                           Required keys: source: 'talent', class, treeId,
 *                           spellType: 'ACTIVE' | 'PASSIVE', category.
 *   rankUpgrades: object[] — hand-tuned overrides, one per additional rank.
 *                           Length MUST equal maxRanks - 1. Each entry is spread
 *                           (top-level, wholesale) over the previous rank's spell.
 *                           The spell at rank N (N > 1) is:
 *                             { ...spellAt(N-1), ...rankUpgrades[N - 2] }
 *                           Rank 1 = the least version; maxRanks = the empowered
 *                           version. Resolved descriptions must state concrete
 *                           numbers — never "per rank".
 * }
 *
 * The resolved spell at the character's purchased rank is what gets added to the
 * character's spellbook when the talent is learned.
 */

export const TALENT_SYSTEM = {
  LEVEL_CAP: 10,
  TALENT_POINTS_PER_LEVEL: 5,
  TOTAL_TALENT_POINTS: 50,      // 10 levels * 5 points
  TREES_PER_CLASS: 3,
  TREE_CAPACITY: 50,            // exact investable points per tree
  TIER_COUNT: 7,                // tiers 1..7
  POINTS_PER_TIER_GATE: 5,      // tier N unlocks at (N-1)*5 points in tree
  FINAL_TIER_REQUIREMENT: 30,   // tier 7 unlock threshold
  TREE_COLUMNS: 5,              // x: 0-4
  ALLOWED_MAX_RANKS: [1, 2, 3, 5],
  CAPSTONE_MIN_CAPACITY: 10,    // recommended band for tier 7 (warnings outside)
  CAPSTONE_MAX_CAPACITY: 25,
};

/**
 * Designed tier (1-7) for a node, from its `_tN_` id convention.
 * All v2 nodes carry their tier in the id (e.g. `sb_t4_mirror_field` -> 4),
 * which is the source of truth for gating/capacity — independent of layout.
 */
export const talentTier = (node) => {
  const m = String(node?.id || '').match(/_t([1-7])(?=_)/);
  return m ? parseInt(m[1], 10) : -1;
};

/**
 * Compute DAG depth for every node in a tree (longest prerequisite chain).
 * Depth 0 = entry talents. This — not the grid row — defines a talent's TIER
 * for gating and capacity, so shapes can place nodes anywhere on the grid.
 * Throws on prerequisite cycles.
 */
export function computeTalentDepths(tree) {
  const byId = new Map(tree.map((n) => [n.id, n]));
  const depths = new Map();
  const visiting = new Set();

  const depthOf = (id, stack = []) => {
    if (depths.has(id)) return depths.get(id);
    if (visiting.has(id)) {
      throw new Error(`prerequisite cycle: ${[...stack, id].join(' -> ')}`);
    }
    const node = byId.get(id);
    if (!node) throw new Error(`unknown prerequisite '${id}'`);
    visiting.add(id);
    let depth = 0;
    const reqs = node.requires
      ? (Array.isArray(node.requires) ? node.requires : [node.requires])
      : [];
    for (const reqId of reqs) {
      depth = Math.max(depth, depthOf(reqId, [...stack, id]) + 1);
    }
    visiting.delete(id);
    depths.set(id, depth);
    return depth;
  };

  tree.forEach((n) => depthOf(n.id));
  return depths;
}

/** Points that must be spent in-tree before `tier` (1-7) becomes selectable. */
export const tierUnlockCost = (tier) => (tier - 1) * TALENT_SYSTEM.POINTS_PER_TIER_GATE;

/**
 * Resolve the concrete spell a character owns at a given purchased rank.
 * Rank 1 returns the base spell; higher ranks apply hand-tuned overrides
 * cumulatively (each rankUpgrades entry spreads over the previous rank).
 */
export function resolveTalentSpell(node, rank) {
  if (!node?.spell) return null;
  const clamped = Math.max(1, Math.min(rank ?? 1, node.maxRanks ?? 1));
  let resolved = { ...node.spell };
  for (let r = 2; r <= clamped; r++) {
    const upgrade = node.rankUpgrades?.[r - 2];
    if (upgrade) resolved = { ...resolved, ...upgrade };
  }
  return resolved;
}

/**
 * Extract human-readable trigger condition from spell/passive description
 */
export function extractTriggerFromDescription(desc) {
  if (!desc || typeof desc !== 'string') return null;
  // Match Reaction triggers: "As a reaction when [trigger], [effect]" or "Reaction: when [trigger], [effect]"
  const reactionMatch = desc.match(/(?:as a reaction|reaction(?:\s*\([^)]*\))?)\s*(?:when|upon|if|after)?\s*:\s*([^,.;]+)/i) ||
                        desc.match(/(?:as a reaction|reaction(?:\s*\([^)]*\))?)\s+(?:when|upon|if|after)\s+([^,.;]+)/i);
  if (reactionMatch) {
    let t = reactionMatch[1].trim();
    if (!t.toLowerCase().startsWith('when') && !t.toLowerCase().startsWith('upon') && !t.toLowerCase().startsWith('if') && !t.toLowerCase().startsWith('after')) {
      t = 'When ' + t;
    }
    return t;
  }
  // Match Passive triggers: "Passive: Whenever [trigger], [effect]"
  const passiveMatch = desc.match(/passive\s*:\s*(?:whenever|when|upon|if|after)\s+([^,.;]+)/i) ||
                       desc.match(/^(?:whenever|when|upon|if|after)\s+([^,.;]+)/i);
  if (passiveMatch) {
    let t = passiveMatch[1].trim();
    if (!t.toLowerCase().startsWith('when') && !t.toLowerCase().startsWith('whenever') && !t.toLowerCase().startsWith('upon') && !t.toLowerCase().startsWith('if') && !t.toLowerCase().startsWith('after')) {
      t = 'Whenever ' + t;
    }
    return t;
  }
  return null;
}

/**
 * Convert a resolved talent spell into the standard Mythrill Spell Library schema
 * (adhering strictly to SPELL_DATA_REFERENCE.md).
 */
export function convertTalentSpellToLibrarySpell(talent, rank = 1) {
  if (!talent?.spell) return null;
  const resolved = resolveTalentSpell(talent, rank);
  if (!resolved) return null;

  const stableId = `talent-spell-${talent.id}`;

  // Smart detection of Reaction vs Passive vs Action
  const isExplicitReaction = resolved.spellType === 'REACTION' || resolved.actionType === 'reaction' ||
    (Array.isArray(resolved.tags) && resolved.tags.some(t => String(t).toLowerCase() === 'reaction'));
  const isDescriptionReaction = /(?:as a reaction|reaction(?:\s*\([^)]*\))?)/i.test(resolved.description || '');
  const isReaction = isExplicitReaction || isDescriptionReaction;

  const isExplicitPassive = resolved.spellType === 'PASSIVE' || resolved.actionType === 'passive' ||
    (Array.isArray(resolved.tags) && resolved.tags.some(t => String(t).toLowerCase() === 'passive'));
  const isDescriptionPassive = /passive\s*:/i.test(resolved.description || '') || /^passive/i.test(resolved.description || '') || /gain passive/i.test(resolved.description || '');
  const isPassive = !isReaction && (isExplicitPassive || isDescriptionPassive);

  const determinedSpellType = isReaction ? 'REACTION' : (isPassive ? 'PASSIVE' : 'ACTION');
  const determinedActionType = isReaction ? 'reaction' : (isPassive ? 'passive' : 'action');

  const reactionTrigger = isReaction ? (resolved.reactionTrigger || resolved.trigger || extractTriggerFromDescription(resolved.description)) : null;
  const trigger = isPassive ? (resolved.trigger || extractTriggerFromDescription(resolved.description)) : null;

  const rankSuffix = talent.maxRanks > 1 ? ` (Rank ${rank})` : '';

  // 1. School mapping: must be one of the canonical damage types
  const primaryDamageType = Array.isArray(resolved.damageTypes) && resolved.damageTypes.length > 0
    ? resolved.damageTypes[0]
    : (resolved.visualTheme === 'ember' || resolved.visualTheme === 'fire' ? 'ember'
       : resolved.visualTheme === 'rime' || resolved.visualTheme === 'frost' ? 'rime'
       : resolved.visualTheme === 'storm' || resolved.visualTheme === 'lightning' ? 'storm'
       : resolved.visualTheme === 'wyrd' || resolved.visualTheme === 'shadow' ? 'wyrd'
       : resolved.visualTheme === 'sacred' || resolved.visualTheme === 'holy' ? 'sacred'
       : resolved.visualTheme === 'blight' ? 'blight'
       : resolved.visualTheme === 'primal' ? 'primal'
       : 'arcane');

  // 2. Resource cost mapping: actionPoints (1-5), mana/class resources
  const resourceTypes = [];
  const resourceValues = {};
  if (resolved.resourceCosts) {
    if (resolved.resourceCosts.mana?.baseAmount) {
      resourceTypes.push('mana');
      resourceValues.mana = resolved.resourceCosts.mana.baseAmount;
    }
    Object.entries(resolved.resourceCosts).forEach(([key, val]) => {
      if (key !== 'mana' && val?.baseAmount) {
        resourceValues[key] = val.baseAmount;
        if (!resourceTypes.includes(key)) {
          resourceTypes.push(key);
        }
      }
    });
  }

  const resourceCost = {
    actionPoints: isPassive ? 0 : (isReaction ? (resolved.actionPoints ?? 0) : (resolved.actionPoints ?? 1)),
    components: resolved.components || ['verbal', 'somatic'],
    resourceTypes,
    resourceValues,
    ...(resolved.resourceCosts?.mana?.baseAmount ? { mana: resolved.resourceCosts.mana.baseAmount } : {})
  };

  // 3. Effect Types & Configs
  const effectTypes = [];
  const damageConfig = resolved.primaryDamage ? {
    formula: resolved.primaryDamage.dice || '2d6',
    damageTypes: resolved.damageTypes || [primaryDamageType],
    resolution: 'DICE',
    procChance: resolved.primaryDamage.procChance ?? 100,
    ...(resolved.isDot ? {
      dotConfig: {
        enabled: true,
        damagePerTick: resolved.dotTick || '1d6',
        damageType: primaryDamageType,
        tickFrequency: 'round',
        duration: resolved.dotDuration || 3
      }
    } : {})
  } : null;
  if (damageConfig) effectTypes.push('damage');

  const healingConfig = resolved.healing ? {
    formula: resolved.healing.dice || '2d8',
    healingType: resolved.healing.isHoT ? 'hot' : 'direct',
    resolution: 'DICE',
    ...(resolved.healing.isHoT ? {
      hotConfig: {
        enabled: true,
        healingPerTick: resolved.healing.hotTick || '1d6',
        tickFrequency: 'round',
        duration: resolved.healing.hotDuration || 3
      }
    } : {})
  } : null;
  if (healingConfig) effectTypes.push('healing');

  const buffConfig = (resolved.buffs && resolved.buffs.length > 0) || resolved.category === 'buff' ? {
    buffType: 'custom',
    effects: (resolved.buffs || [resolved.name]).map((b) => ({
      id: typeof b === 'string' ? b.toLowerCase().replace(/\s+/g, '_') : 'buff_effect',
      name: typeof b === 'string' ? b : resolved.name,
      description: resolved.description
    }))
  } : null;
  if (buffConfig && !effectTypes.includes('buff')) effectTypes.push('buff');

  const debuffConfig = (resolved.debuffs && resolved.debuffs.length > 0) || resolved.category === 'debuff' ? {
    debuffType: 'statReduction',
    effects: (resolved.debuffs || [resolved.name]).map((d) => ({
      id: typeof d === 'string' ? d.toLowerCase().replace(/\s+/g, '_') : 'debuff_effect',
      name: typeof d === 'string' ? d : resolved.name,
      description: resolved.description
    }))
  } : null;
  if (debuffConfig && !effectTypes.includes('debuff')) effectTypes.push('debuff');

  if (effectTypes.length === 0) effectTypes.push('utility');

  // 4. Standard Spell Library Object
  return {
    ...resolved,
    id: stableId,
    name: `${resolved.name}${rankSuffix}`,
    talentId: talent.id,
    talentRank: rank,
    maxRanks: talent.maxRanks || 1,
    source: 'talent',
    isCustom: false,
    level: Math.max(1, Math.min(10, Math.ceil((talent.position?.y ?? 0) + 1))),
    spellType: determinedSpellType,
    actionType: determinedActionType,
    reactionTrigger,
    trigger,
    icon: talent.icon || resolved.icon || 'Utility/Utility',
    effectTypes,
    typeConfig: {
      school: primaryDamageType,
      icon: talent.icon || resolved.icon || 'Utility/Utility',
      tags: resolved.tags || ['talent', resolved.class?.toLowerCase() || 'general'],
      castTime: isReaction ? 'Reaction' : (isPassive ? 'Passive' : (resolved.castTimeValue || 0)),
      castTimeType: isReaction ? 'REACTION' : (isPassive ? 'PASSIVE' : (resolved.castTimeType === 'instant' ? 'IMMEDIATE' : 'CAST'))
    },
    targetingConfig: {
      targetingType: resolved.targetingMode || 'single',
      rangeType: resolved.rangeType || 'ranged',
      rangeDistance: resolved.range || (resolved.rangeType === 'melee' ? 5 : 30),
      targetRestrictions: ['enemies'],
      ...(resolved.targetingMode === 'aoe' ? {
        areaShape: resolved.aoeShape || 'circle',
        areaSize: resolved.aoeSize || 20
      } : {})
    },
    resourceCost,
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: resolved.cooldownValue || 0
    },
    damageConfig,
    healingConfig,
    buffConfig,
    debuffConfig,
    tags: resolved.tags || ['talent', resolved.class?.toLowerCase() || 'general']
  };
}

/** Parse a dice formula like '2d6', '1d8+3', '3d6-1' into its average value. */
export function diceAverage(formula) {
  if (!formula || typeof formula !== 'string') return null;
  const match = formula.trim().match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if (!match) return null;
  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const mod = match[3] ? parseInt(match[3], 10) : 0;
  return count * ((sides + 1) / 2) + mod;
}

const SPELL_CATEGORIES = ['damage', 'healing', 'buff', 'debuff', 'utility'];
const CANONICAL_DAMAGE_TYPES = [
  'smashing', 'stabbing', 'slicing',
  'ember', 'rime', 'storm', 'primal', 'arcane', 'blight', 'wyrd', 'sacred',
];

/** Structural + format validation of one resolved talent spell. */
function checkTalentSpell(spell, node, rank, errors, warnings) {
  const where = `${node.id} [rank ${rank}/${node.maxRanks}]`;

  if (!spell.name || typeof spell.name !== 'string') {
    errors.push(`${where}: spell has no name`);
  }
  if (!spell.description || typeof spell.description !== 'string' || spell.description.trim().length < 10) {
    errors.push(`${where}: spell has no meaningful description`);
  } else if (/per rank/i.test(spell.description)) {
    errors.push(`${where}: description says "per rank" — rank-resolved spells must state concrete values`);
  }
  if (spell.spellType !== 'ACTIVE' && spell.spellType !== 'PASSIVE') {
    errors.push(`${where}: spellType must be 'ACTIVE' or 'PASSIVE' (got '${spell.spellType}')`);
  }
  if (spell.source !== 'talent') {
    errors.push(`${where}: spell.source must be 'talent'`);
  }
  if (!spell.class) errors.push(`${where}: spell.class is required (owning class name)`);
  if (!spell.treeId) errors.push(`${where}: spell.treeId is required (owning tree id)`);
  if (!SPELL_CATEGORIES.includes(spell.category)) {
    errors.push(`${where}: category must be one of ${SPELL_CATEGORIES.join(', ')} (got '${spell.category}')`);
  }
  if (spell.flavorText) {
    const flavor = String(spell.flavorText);
    const desc = String(spell.description || '');
    // Lore sentences leaked into mechanical text by the old description transform
    if (desc.length > 0 && flavor === desc) {
      warnings.push(`${where}: description is identical to flavorText — description should be mechanical`);
    }
  } else {
    warnings.push(`${where}: no flavorText (lore-first project — flavor encouraged)`);
  }
  if (!spell.visualTheme) warnings.push(`${where}: no visualTheme`);

  // Damage / healing shape
  if (spell.primaryDamage) {
    if (!Array.isArray(spell.damageTypes) || spell.damageTypes.length === 0) {
      errors.push(`${where}: primaryDamage present but no damageTypes`);
    } else {
      const bad = spell.damageTypes.filter((t) => !CANONICAL_DAMAGE_TYPES.includes(t));
      if (bad.length) {
        errors.push(`${where}: non-canonical damage type(s): ${bad.join(', ')} — use the 11 Mythrill types`);
      }
    }
    if (spell.primaryDamage.dice && diceAverage(spell.primaryDamage.dice) === null) {
      errors.push(`${where}: invalid damage dice formula '${spell.primaryDamage.dice}'`);
    }
  }
  if (spell.isDot && (!spell.dotTick || diceAverage(spell.dotTick) === null)) {
    errors.push(`${where}: isDot spell needs a valid dotTick dice formula`);
  }
  if (spell.healing?.dice && diceAverage(spell.healing.dice) === null) {
    errors.push(`${where}: invalid healing dice formula '${spell.healing.dice}'`);
  }
  if (spell.healing?.isHoT && (!spell.healing.hotTick || diceAverage(spell.healing.hotTick) === null)) {
    errors.push(`${where}: isHoT spell needs a valid hotTick dice formula`);
  }

  // Active vs passive discipline
  if (spell.spellType === 'PASSIVE') {
    if (spell.resourceCosts && Object.keys(spell.resourceCosts).length > 0) {
      errors.push(`${where}: PASSIVE must not have resourceCosts`);
    }
  } else if (spell.spellType === 'ACTIVE') {
    if (!spell.cooldownValue || !spell.cooldownUnit) {
      errors.push(`${where}: ACTIVE spell needs cooldownValue and cooldownUnit`);
    }
    if (!spell.resourceCosts || Object.keys(spell.resourceCosts).length === 0) {
      warnings.push(`${where}: ACTIVE spell has no resourceCosts (free cast — intentional?)`);
    }
    if (!spell.castTimeType) {
      warnings.push(`${where}: ACTIVE spell has no castTimeType (defaults to instant)`);
    }
  }

  // buff/debuff completeness + damage-type sanity (reuses the spell validator)
  // Lazy import-free: inlined call contract is validateSpell(spell) -> { issues }
  // Imported by caller to avoid a circular dependency in node contexts.
}

/**
 * Full validation of one talent tree (array of nodes).
 * Returns { format: 'v2' | 'legacy', stats, errors, warnings }.
 * Legacy trees (nodes without `spell`) are NOT error'd — they are reported as
 * pending conversion with their current stats for the migration backlog.
 */
export function validateTalentTree(tree, validateSpellFn) {
  const errors = [];
  const warnings = [];
  const nodes = Array.isArray(tree) ? tree : [];

  const isV2 = nodes.length > 0 && nodes.every((n) => n && n.spell && typeof n.spell === 'object');

  // ---- DAG depths (tier source of truth for v2) ----
  let depths = null;
  try {
    depths = computeTalentDepths(nodes);
  } catch (err) {
    return {
      format: isV2 ? 'v2' : 'legacy',
      stats: { nodes: nodes.length, totalCapacity: 0, tiers: 0, tierCapacity: {} },
      errors: [err.message],
      warnings,
    };
  }

  // ---- Basic node shape (both formats) ----
  const ids = new Set();
  const positions = new Set();
  const tierCapacity = {};

  nodes.forEach((node, idx) => {
    const label = node?.id || `node#${idx}`;
    if (!node.id) errors.push(`${label}: node has no id`);
    if (ids.has(node.id)) errors.push(`${node.id}: duplicate id in tree`);
    ids.add(node.id);

    if (!node.name) errors.push(`${label}: node has no name`);
    if (!node.icon) warnings.push(`${label}: node has no icon`);

    if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
      errors.push(`${label}: node needs numeric position {x, y}`);
    } else {
      const posKey = `${node.position.x},${node.position.y}`;
      if (positions.has(posKey)) errors.push(`${label}: duplicate grid position ${posKey}`);
      positions.add(posKey);
      if (node.position.x < 0 || node.position.x >= TALENT_SYSTEM.TREE_COLUMNS) {
        errors.push(`${label}: position.x ${node.position.x} outside columns 0-${TALENT_SYSTEM.TREE_COLUMNS - 1}`);
      }
      if (node.position.y < 0 || node.position.y > 8) {
        errors.push(`${label}: position.y ${node.position.y} outside grid rows 0-8`);
      }
    }

    if (!TALENT_SYSTEM.ALLOWED_MAX_RANKS.includes(node.maxRanks)) {
      errors.push(`${label}: maxRanks ${node.maxRanks} not in {${TALENT_SYSTEM.ALLOWED_MAX_RANKS.join(',')}}`);
    }
  });

  // Tier capacity by DAG depth (tiers 1..7 = depth 0..6) — shape-independent
  nodes.forEach((node) => {
    const tier = talentTier(node);
    if (tier >= 1 && tier <= TALENT_SYSTEM.TIER_COUNT) {
      tierCapacity[tier] = (tierCapacity[tier] || 0) + (node.maxRanks || 0);
    }
  });

  const totalCapacity = nodes.reduce((sum, n) => sum + (n.maxRanks || 0), 0);

  // ---- Prerequisites: cycles already caught by computeTalentDepths; ids checked here ----
  nodes.forEach((node) => {
    if (!node.requires) return;
    const reqs = Array.isArray(node.requires) ? node.requires : [node.requires];
    reqs.forEach((reqId) => {
      const target = nodes.find((n) => n.id === reqId);
      if (!target) {
        errors.push(`${node.id}: requires unknown talent '${reqId}'`);
        return;
      }
      if (talentTier(target) >= talentTier(node)) {
        errors.push(`${node.id}: prerequisite '${reqId}' must be in a strictly lower tier`);
      }
    });
  });

  if (!isV2) {
    const maxRow = Math.max(...nodes.map((n) => n?.position?.y ?? 0), 0);
    return {
      format: 'legacy',
      stats: { nodes: nodes.length, totalCapacity, tiers: maxRow + 1, tierCapacity },
      errors,
      warnings,
    };
  }

  // ---- v2 tree economy ----
  if (totalCapacity !== TALENT_SYSTEM.TREE_CAPACITY) {
    errors.push(`tree capacity ${totalCapacity} != ${TALENT_SYSTEM.TREE_CAPACITY} required`);
  }

  for (let tier = 2; tier <= TALENT_SYSTEM.TIER_COUNT; tier++) {
    const gate = tierUnlockCost(tier);
    let cum = 0;
    for (let t = 1; t < tier; t++) cum += tierCapacity[t] || 0;
    if (cum < gate) {
      errors.push(
        `tier ${tier} gate (needs ${gate} pts spendable below) unreachable: tiers 1-${tier - 1} only hold ${cum} pts`
      );
    }
  }

  for (let tier = 1; tier <= TALENT_SYSTEM.TIER_COUNT; tier++) {
    if ((tierCapacity[tier] || 0) === 0) {
      errors.push(`tier ${tier} has no talents`);
    }
  }

  // Capstone band shape: 1 ultimate (1/1) + 2-3 rankables
  const t7Nodes = nodes.filter((n) => talentTier(n) === TALENT_SYSTEM.TIER_COUNT);
  const t7Capacity = tierCapacity[TALENT_SYSTEM.TIER_COUNT] || 0;
  if (!t7Nodes.some((n) => n.maxRanks === 1)) {
    errors.push('tier 7 has no 1/1 ultimate');
  }
  if (t7Nodes.filter((n) => n.maxRanks > 1).length < 2) {
    warnings.push('tier 7 should hold 2-3 rankable capstones alongside the ultimate');
  }
  if (t7Capacity < TALENT_SYSTEM.CAPSTONE_MIN_CAPACITY || t7Capacity > TALENT_SYSTEM.CAPSTONE_MAX_CAPACITY) {
    warnings.push(`tier 7 capacity ${t7Capacity} outside recommended band ${TALENT_SYSTEM.CAPSTONE_MIN_CAPACITY}-${TALENT_SYSTEM.CAPSTONE_MAX_CAPACITY}`);
  }

  // ---- v2 spell format, per rank ----
  nodes.forEach((node) => {
    if (Array.isArray(node.rankUpgrades) && node.rankUpgrades.length !== node.maxRanks - 1) {
      errors.push(`${node.id}: rankUpgrades length ${node.rankUpgrades.length} != maxRanks-1 (${node.maxRanks - 1})`);
    }
    if (!Array.isArray(node.rankUpgrades) && node.maxRanks > 1) {
      errors.push(`${node.id}: maxRanks ${node.maxRanks} but no rankUpgrades`);
    }

    let prev = null;
    for (let rank = 1; rank <= node.maxRanks; rank++) {
      const resolved = resolveTalentSpell(node, rank);
      checkTalentSpell(resolved, node, rank, errors, warnings);

      if (validateSpellFn) {
        const result = validateSpellFn(resolved);
        (result.issues || []).forEach((issue) => errors.push(`${node.id} [rank ${rank}]: ${issue}`));
        (result.warnings || []).forEach((w) => warnings.push(`${node.id} [rank ${rank}]: ${w}`));
      }

      if (prev) {
        const dmgA = diceAverage(resolved.primaryDamage?.dice);
        const dmgB = diceAverage(prev.primaryDamage?.dice);
        if (dmgA !== null && dmgB !== null && dmgA < dmgB) {
          errors.push(`${node.id}: rank ${rank} damage (${resolved.primaryDamage.dice}) is LOWER than rank ${rank - 1} (${prev.primaryDamage.dice})`);
        }
        const healA = diceAverage(resolved.healing?.dice);
        const healB = diceAverage(prev.healing?.dice);
        if (healA !== null && healB !== null && healA < healB) {
          errors.push(`${node.id}: rank ${rank} healing (${resolved.healing.dice}) is LOWER than rank ${rank - 1} (${prev.healing.dice})`);
        }
        if (JSON.stringify(resolved) === JSON.stringify(prev)) {
          warnings.push(`${node.id}: rank ${rank} spell identical to rank ${rank - 1} — hand-tune the upgrade`);
        }
      }
      prev = resolved;
    }
  });

  return {
    format: 'v2',
    stats: { nodes: nodes.length, totalCapacity, tiers: TALENT_SYSTEM.TIER_COUNT, tierCapacity },
    errors,
    warnings,
  };
}
