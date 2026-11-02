/** M4B catalogue adapter: whole-record eligibility, one injected definition, no execution.
 * The source record is preserved by value; only its supported direct calculation is executable. */
const { canonical, sha256Hex } = require('./canonicalHash');
const { readFormula, formulaAttributes, ATTRIBUTES } = require('./classEffect');

const CLASS_DOMAIN = Object.freeze({ arcanoneer: 'elementalSpheres', minstrel: 'musicalNotes', martyr: 'devotionGauge' });
const DOMAINS = Object.freeze(['elementalSpheres', 'musicalNotes', 'devotionGauge']);
const PITCHES = Object.freeze(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']);
const SPHERE_ALIASES = Object.freeze({ holy: 'sacred', necrotic: 'blight', lightning: 'storm' });
const TOP_KEYS = Object.freeze(['id', 'name', 'description', 'level', 'spellType', 'icon', 'effectTypes', 'typeConfig', 'targetingConfig',
  'resourceCost', 'cooldownConfig', 'damageConfig', 'healingConfig', 'resolution', 'tags', 'devotionCost', 'devotionGain', 'devotionRequired',
  'musicalCombo', 'sphereCost', 'sphereGenerate', 'sphereGain', 'resourceGain', 'notes', 'noteGenerate', 'noteGain', '_arcanoneerElements',
  'elements', 'durationConfig']);
const TYPE_KEYS = Object.freeze(['school', 'icon', 'tags', 'castTime', 'castTimeType', 'element']);
const TARGET_KEYS = Object.freeze(['targetingType', 'rangeType', 'rangeDistance', 'maxTargets', 'targetRestrictions', 'targetRestriction',
  'selectionMethod', 'targetSelectionMethod', 'movementBehavior', 'aoeShape', 'aoeType', 'aoeParameters']);
const COST_KEYS = Object.freeze(['actionPoints', 'mana', 'resourceTypes', 'resourceValues', 'useFormulas', 'components', 'verbalText',
  'somaticText', 'materialText', 'classResource', 'spheres', 'notes']);
const DAMAGE_KEYS = Object.freeze(['formula', 'damageTypes', 'resolution', 'description', 'elementType']);
const HEALING_KEYS = Object.freeze(['formula', 'healingType', 'hasHotEffect', 'description', 'resolution']);
const int = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(value) && value >= min && value <= max;
const text = (value, max = 4000) => typeof value === 'string' && value.length > 0 && value.length <= max;
const keysOnly = (value, allowed) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).every(key => allowed.includes(key));
const refuse = reason => ({ ok: false, reason });
const sphere = value => {
  if (typeof value !== 'string') return null;
  const clean = value.trim().toLowerCase().replace(/_sphere$/, '');
  const id = SPHERE_ALIASES[clean] || clean;
  return ['arcane', 'sacred', 'blight', 'ember', 'rime', 'primal', 'storm', 'wyrd'].includes(id) ? id : null;
};
const pitch = value => {
  if (typeof value !== 'string') return null;
  const id = value.replace(/^note_/i, '').toUpperCase();
  return PITCHES.includes(id) ? id : null;
};
const listCounts = list => (Array.isArray(list) ? list : []).flatMap(entry => {
  const key = typeof entry === 'string' ? entry : entry?.note ?? entry?.id ?? entry?.sphere;
  const count = typeof entry === 'string' ? 1 : Number(entry?.count ?? 1);
  return Number.isSafeInteger(count) && count > 0 ? Array(count).fill(key) : [];
});

/** Typed price from the record's existing class-resource encodings, or null for AP/mana only. */
function classPaymentFor(record, classId) {
  const cost = record.resourceCost || {}, values = cost.resourceValues || {};
  const generic = cost.classResource ?? values.classResource;
  const genericType = String(generic?.type || generic?.resource || '').toLowerCase();
  const devotionValues = Object.entries(values).filter(([key]) => /^devotion_/i.test(key));
  const hasDevotion = record.devotionCost !== undefined || record.devotionGain !== undefined || record.devotionRequired !== undefined ||
    genericType.includes('devotion') || devotionValues.length > 0 || values.devotion === 'all';
  const sphereExplicit = record._arcanoneerElements ?? record.elements ?? cost.spheres ?? record.sphereCost;
  const sphereCostKeys = Object.entries(values).filter(([key]) => /_sphere$/i.test(key) && !/gain|generate/i.test(key));
  const sphereGainExplicit = record.sphereGenerate ?? record.sphereGain ?? record.resourceGain?.spheres;
  const sphereGainKeys = Object.entries(values).filter(([key]) => /_sphere$/i.test(key) && /gain|generate/i.test(key));
  const hasSpheres = sphereExplicit !== undefined || sphereCostKeys.length > 0 || sphereGainExplicit !== undefined || sphereGainKeys.length > 0 ||
    genericType.includes('sphere');
  const combo = record.musicalCombo ?? record.specialMechanics?.musicalCombo;
  const noteCost = combo?.requires ?? cost.notes ?? record.notes;
  const noteGain = combo?.generates ?? record.noteGenerate ?? record.noteGain ?? record.resourceGain?.notes;
  const noteValues = Object.entries(values).filter(([key]) => /^note_/i.test(key));
  const hasNotes = noteCost !== undefined || noteGain !== undefined || noteValues.length > 0 || genericType.includes('note');
  if ([hasDevotion, hasSpheres, hasNotes].filter(Boolean).length > 1) return refuse('Conflicting class-resource encodings.');
  if (hasDevotion) {
    if (classId !== 'martyr') return refuse('Devotion is the Martyr class domain.');
    if (values.devotion === 'all') return refuse('Spend-all Devotion is outside the typed price contract.');
    const pick = (...candidates) => candidates.find(value => value !== undefined);
    const spent = pick(record.devotionCost, values.devotion_cost, genericType.includes('devotion') ? generic?.cost : undefined) ?? 0;
    const gain = pick(record.devotionGain, values.devotion_gain, genericType.includes('devotion') ? generic?.gain : undefined) ?? 0;
    const required = pick(record.devotionRequired, values.devotion_required, genericType.includes('devotion') ? generic?.required : undefined) ?? 0;
    if (![spent, gain, required].every(value => Number.isSafeInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 6)) {
      return refuse('Devotion price is outside the existing 0Ã¢â‚¬Â¦6 contract.');
    }
    return { ok: true, payment: { domain: 'devotionGauge', price: { cost: Number(spent), gain: Number(gain), required: Number(required) } } };
  }
  if (hasSpheres) {
    if (classId !== 'arcanoneer') return refuse('Elemental Spheres are the Arcanoneer class domain.');
    const rawCosts = sphereExplicit !== undefined ? listCounts(Array.isArray(sphereExplicit) ? sphereExplicit : [sphereExplicit])
      : sphereCostKeys.flatMap(([key, amount]) => Array(Math.max(0, Number(amount) || 0)).fill(key));
    const rawGains = sphereGainExplicit !== undefined ? listCounts(Array.isArray(sphereGainExplicit) ? sphereGainExplicit : [sphereGainExplicit])
      : sphereGainKeys.flatMap(([key, amount]) => Array(Math.max(0, Number(amount) || 0)).fill(key));
    const costs = rawCosts.map(sphere), gains = rawGains.map(sphere);
    if (costs.some(value => !value) || gains.some(value => !value)) return refuse('Sphere price names are outside the existing vocabulary.');
    return { ok: true, payment: { domain: 'elementalSpheres', price: { costs, gains } } };
  }
  if (hasNotes) {
    if (classId !== 'minstrel') return refuse('Musical Notes are the Minstrel class domain.');
    const costs = listCounts(Array.isArray(noteCost) ? noteCost : noteCost !== undefined ? [noteCost] : []).map(pitch);
    const gains = listCounts(Array.isArray(noteGain) ? noteGain : noteGain !== undefined ? [noteGain] : []).map(pitch);
    for (const [key, amount] of noteValues) {
      const value = Number(amount);
      if (!Number.isSafeInteger(value)) return refuse('Note counts must be whole numbers.');
      const target = value < 0 ? costs : gains;
      for (let i = 0; i < Math.abs(value); i++) target.push(pitch(key));
    }
    if (costs.some(value => !value) || gains.some(value => !value)) return refuse('Note names are outside the existing vocabulary.');
    if (costs.length && gains.length) return refuse('Notes cannot both cost and gain in the existing typed price contract.');
    return { ok: true, payment: { domain: 'musicalNotes', price: { costs, gains } } };
  }
  if (genericType && !DOMAINS.some(domain => genericType.includes(domain.toLowerCase()))) {
    return refuse('The class-resource domain has no existing typed payment contract.');
  }
  return null;
}

/** The complete executable projection for one catalogue record. Metadata is retained in the source record. */
function catalogueExecutable(record, classId, { roomId, definitionId, definitionVersion } = {}) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return refuse('A whole catalogue record is required.');
  if (!text(record.id, 120) || !text(record.name, 120) || typeof record.description !== 'string' || record.description.length > 4000) return refuse('Catalogue identity or description is incomplete.');
  if (!CLASS_DOMAIN[classId]) return refuse('This class has no M4B typed payment domain.');
  const unknown = Object.keys(record).filter(key => !TOP_KEYS.includes(key));
  if (unknown.length) return refuse(`Catalogue fields ${unknown.join(', ')} are not covered by this route.`);
  if (record.spellType !== 'ACTION' || record.typeConfig?.castTimeType !== 'IMMEDIATE' || !keysOnly(record.typeConfig, TYPE_KEYS)) return refuse('An immediate ACTION is required.');
  if (record.typeConfig.castTime !== undefined && !int(record.typeConfig.castTime, 0, 10)) return refuse('Cast-time metadata is outside the supported integer range.');
  const targeting = record.targetingConfig;
  if (!keysOnly(targeting, TARGET_KEYS) || targeting.targetingType !== 'single' || (targeting.maxTargets !== undefined && targeting.maxTargets !== 1) ||
    !int(targeting.rangeDistance, 1, 300) || !['ranged', 'melee', 'touch'].includes(targeting.rangeType) ||
    !Array.isArray(targeting.targetRestrictions) || targeting.targetRestrictions.length !== 1 ||
    !['ally', 'enemy', 'any'].includes(targeting.targetRestrictions[0]) ||
    (targeting.targetRestriction && targeting.targetRestriction !== targeting.targetRestrictions[0]) ||
    (targeting.selectionMethod !== undefined && targeting.selectionMethod !== 'manual') ||
    (targeting.targetSelectionMethod !== undefined && targeting.targetSelectionMethod !== 'manual') ||
    (targeting.movementBehavior !== undefined && targeting.movementBehavior !== 'static') ||
    (targeting.aoeShape !== undefined && targeting.aoeShape !== '') || (targeting.aoeType !== undefined && !['', 'sphere'].includes(targeting.aoeType)) ||
    ((targeting.aoeParameters !== undefined && !keysOnly(targeting.aoeParameters, [])) || (targeting.aoeParameters && Object.keys(targeting.aoeParameters).length))) {
    return refuse('Only one manual single-target action with an explicit range is supported.');
  }
  if (record.durationConfig !== undefined && canonical(record.durationConfig) !== canonical({ durationType: 'instant' })) return refuse('Durations remain manual.');
  if (record.cooldownConfig !== undefined && (!keysOnly(record.cooldownConfig, ['cooldownType', 'cooldownValue']) ||
    !['none', 'turn_based'].includes(record.cooldownConfig.cooldownType) || !int(record.cooldownConfig.cooldownValue, 0, 1000) ||
    (record.cooldownConfig.cooldownType === 'turn_based' && record.cooldownConfig.cooldownValue !== 0))) return refuse('A nonzero cooldown is not supported.');
  const cost = record.resourceCost;
  if (!keysOnly(cost, COST_KEYS) || !int(cost.actionPoints, 0, 20) || (cost.useFormulas !== undefined &&
    (!cost.useFormulas || typeof cost.useFormulas !== 'object' || Object.keys(cost.useFormulas).length))) return refuse('An explicit AP/mana price is required.');
  const values = cost.resourceValues || {};
  if (!keysOnly(values, COST_KEYS) || Object.keys(values).some(key => !['mana', 'classResource', 'devotion_cost', 'devotion_required', 'devotion_gain'].includes(key) &&
    !/_sphere$/i.test(key) && !/^note_/i.test(key))) return refuse('Class-resource price fields are outside the supported vocabulary.');
  const mana = values.mana ?? cost.mana;
  if (!int(mana, 0, 10000)) return refuse('An explicit whole mana price is required.');
  const types = Array.isArray(cost.resourceTypes) ? cost.resourceTypes : [];
  if (types.some(type => type !== 'mana' && !/_sphere$/i.test(type) && !/^note_/i.test(type))) return refuse('An unsupported resource type is present.');
  const effects = record.effectTypes;
  const kind = canonical(effects) === canonical(['damage']) ? 'damage' : canonical(effects) === canonical(['healing']) ? 'healing' : null;
  if (!kind) return refuse('Exactly one direct damage or healing effect is required.');
  const config = kind === 'damage' ? record.damageConfig : record.healingConfig;
  if (!config || !keysOnly(config, kind === 'damage' ? DAMAGE_KEYS : HEALING_KEYS)) return refuse('Only one direct DICE configuration is supported.');
  if ((config.resolution ?? record.resolution) !== 'DICE' || (config.resolution && record.resolution && config.resolution !== record.resolution)) return refuse('Only DICE resolution is supported.');
  if (kind === 'damage' && (!Array.isArray(config.damageTypes) || !config.damageTypes.length || config.damageTypes.length > 8 ||
    config.damageTypes.some(type => !text(type, 40)))) return refuse('A declared damage type is required.');
  if (kind === 'healing' && (config.healingType !== 'direct' || config.hasHotEffect === true)) return refuse('Only direct healing is supported.');
  if (kind === 'healing' && targeting.targetRestrictions[0] !== 'ally') return refuse('M4B catalogue healing requires an ally target.');
  if (kind === 'damage' && targeting.targetRestrictions[0] === 'ally') return refuse('Damage cannot use the healing ally route.');
  const reading = readFormula(config.formula, Object.fromEntries(ATTRIBUTES.map(name => [name, 10])), { integerScaling: true });
  if (!reading.supported || !formulaAttributes(config.formula).length) return refuse(reading.reason || 'The formula must use at least one caster score.');
  const paymentResult = classPaymentFor(record, classId);
  if (paymentResult && !paymentResult.ok) return paymentResult;
  const payment = paymentResult?.payment || null;
  const catalogueSource = { spellId: record.id, classId, recordHash: sha256Hex(canonical(record)) };
  const definition = {
    schemaVersion: 4, capability: 'authored-immediate:v2', scope: { roomId }, definitionId, definitionVersion,
    name: record.name, description: record.description,
    binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId },
    spellType: 'ACTION', castTimeType: 'IMMEDIATE',
    targeting: { kind: 'single', maxTargets: 1, rangeFeet: targeting.rangeDistance, restriction: targeting.targetRestrictions[0] },
    resourceCost: { actionPoints: cost.actionPoints, mana },
    effect: kind === 'damage' ? { kind, formula: config.formula, damageTypes: [...config.damageTypes] } : { kind, formula: config.formula },
    ...(kind === 'healing' && targeting.targetRestrictions[0] === 'ally' ? { targetRoute: 'primary-pc-healing' } : {}),
    ...(payment ? { classPayment: payment } : {}),
    catalogueSource
  };
  return { ok: true, definition, classPayment: payment, targetRoute: kind === 'healing' ? 'primary-pc-healing' : 'creature' };
}

/** Wizard record that preserves the whole catalogue source and carries only the supported projection. */
function catalogueDraft(record, classId, { authoredDefinitionId, id } = {}) {
  const executable = catalogueExecutable(record, classId, {
    roomId: 'diagnostic', definitionId: authoredDefinitionId || '00000000-0000-4000-8000-000000000000', definitionVersion: 1
  });
  if (!executable.ok) return executable;
  const definition = executable.definition;
  const draft = {
    id: id || `catalogue-${record.id}`,
    name: record.name, description: record.description, level: record.level || 1, icon: record.icon || 'inv_misc_questionmark',
    school: record.typeConfig?.school || '', spellType: 'ACTION', typeConfig: JSON.parse(JSON.stringify(record.typeConfig)),
    effectTypes: [...record.effectTypes], effectsMap: { [definition.effect.kind]: true },
    damageConfig: definition.effect.kind === 'damage' ? { ...record.damageConfig, formula: definition.effect.formula } : null,
    healingConfig: definition.effect.kind === 'healing' ? { ...record.healingConfig, formula: definition.effect.formula, healingType: 'direct' } : null,
    targetingConfig: {
      ...JSON.parse(JSON.stringify(record.targetingConfig)),
      maxTargets: 1, targetingType: 'single', rangeType: record.targetingConfig.rangeType,
      rangeDistance: record.targetingConfig.rangeDistance, targetRestrictions: [...record.targetingConfig.targetRestrictions]
    },
    resourceCost: { actionPoints: definition.resourceCost.actionPoints, mana: definition.resourceCost.mana, resourceTypes: ['mana'], resourceValues: { mana: definition.resourceCost.mana }, useFormulas: {}, components: [] },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
    resolution: 'DICE', effectResolutions: { [definition.effect.kind]: 'DICE' },
    tags: Array.isArray(record.tags) ? [...record.tags] : [],
    catalogueSource: { spellId: record.id, classId, recordHash: definition.catalogueSource.recordHash, record: JSON.parse(JSON.stringify(record)) },
    authoredDefinitionId: authoredDefinitionId || '00000000-0000-4000-8000-000000000000',
    isCustom: true, source: 'wizard'
  };
  draft.authoredDraft = JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(draft).filter(([key]) => key !== 'authoredDraft' && key !== 'isCustom' && key !== 'source'))));
  return { ok: true, draft, definition: executable.definition, classPayment: executable.classPayment, targetRoute: executable.targetRoute };
}

module.exports = { CLASS_DOMAIN, DOMAINS, catalogueExecutable, catalogueDraft, classPaymentFor };



