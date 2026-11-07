/** M4B catalogue adapter: whole-record eligibility, one injected definition, no execution.
 * The source record is preserved by value; only its supported direct calculation is executable. */
const { canonical, sha256Hex } = require('./canonicalHash');
const { readFormula, formulaAttributes, ATTRIBUTES } = require('./classEffect');
const profileData = require('../data/catalogueAbilityProfiles.json');

const CAPABILITY = 'authored-immediate:v2';
const AREA_CAPABILITY = 'authored-area:v1';
const MAX_AREA_TARGETS = 8;
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

/** Reviewed server/shared catalogue pins. A record and its self-computed hash are never
 * authority on their own: the exact class, spell and whole-record hash must be pinned here. */
function profileFor(source, expectedCapability = null) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return refuse('The catalogue source identity is missing.');
  const { classId, spellId, recordHash } = source;
  if (typeof classId !== 'string' || typeof spellId !== 'string' || !/^[0-9a-f]{64}$/.test(recordHash || '')) {
    return refuse('The catalogue source identity is incomplete.');
  }
  const matches = (Array.isArray(profileData.profiles) ? profileData.profiles : [])
    .filter(entry => entry.recordHash === recordHash && entry.classId === classId && entry.spellId === spellId);
  if (matches.length !== 1) return refuse('No reviewed catalogue profile pins this exact class/spell record (it may have changed); manual play only.');
  const entry = matches[0];
  if (![CAPABILITY, AREA_CAPABILITY].includes(entry.capability)) return refuse('Catalogue profile capability mismatch.');
  if (expectedCapability && entry.capability !== expectedCapability) return refuse('Catalogue profile capability mismatch.');
  return { ok: true, entry };
}

/** The executable projection a pin authorises. Identity and scope are added per admission. */
function definitionProjection(definition) {
  if (!definition || typeof definition !== 'object' || Array.isArray(definition)) return null;
  const projection = JSON.parse(JSON.stringify(definition));
  delete projection.scope;
  delete projection.definitionId;
  delete projection.definitionVersion;
  delete projection.catalogueSource;
  return projection;
}

/** Admission and cast share this exact check; an unknown or changed pin refuses the definition. */
function verifyDefinition(definition, entry) {
  if (!entry) {
    const found = profileFor(definition?.catalogueSource, definition?.capability);
    if (!found.ok) return found;
    entry = found.entry;
  }
  const source = definition?.catalogueSource;
  if (definition?.capability !== entry.capability || definition?.binding?.classId !== entry.classId ||
    source?.classId !== entry.classId || source?.spellId !== entry.spellId || source?.recordHash !== entry.recordHash) {
    return refuse('The catalogue definition identity does not match its trusted profile.');
  }
  if (canonical(definitionProjection(definition)) !== canonical(entry.executable)) {
    return refuse('The catalogue definition projection does not match its reviewed profile; manual play only.');
  }
  return { ok: true, entry };
}

/** The whole record must hash to a pinned identity before any projection is executable. */
function verifyRecord(record, classId) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return refuse('A whole catalogue record is required.');
  if (typeof record.id !== 'string') return refuse('The catalogue record has no spell id.');
  const recordHash = sha256Hex(canonical(record));
  const found = profileFor({ classId, spellId: record.id, recordHash });
  if (!found.ok) return found;
  return { ok: true, entry: found.entry, recordHash };
}
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

/** Typed price from the record's existing class-resource encodings, or null for AP/mana only.
 * Only the top-level encodings consumed here are supported. Nested resourceValues
 * devotion_* / *_sphere / note_* fields stay outside the catalogue route. */
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
    const agree = (label, candidates) => {
      const present = candidates.filter(value => value !== undefined);
      if (!present.length) return { ok: true, value: 0 };
      const numbers = present.map(Number);
      if (numbers.some(value => !Number.isSafeInteger(value)) || new Set(numbers).size !== 1) {
        return refuse(`Conflicting ${label} encodings.`);
      }
      return { ok: true, value: numbers[0] };
    };
    const spent = agree('Devotion cost', [record.devotionCost, values.devotion_cost, genericType.includes('devotion') ? generic?.cost : undefined]);
    const gain = agree('Devotion gain', [record.devotionGain, values.devotion_gain, genericType.includes('devotion') ? generic?.gain : undefined]);
    const required = agree('Devotion requirement', [record.devotionRequired, values.devotion_required, genericType.includes('devotion') ? generic?.required : undefined]);
    for (const result of [spent, gain, required]) if (!result.ok) return result;
    if (![spent.value, gain.value, required.value].every(value => value >= 0 && value <= 6)) {
      return refuse('Devotion price is outside the existing 0-6 contract.');
    }
    return { ok: true, payment: { domain: 'devotionGauge', price: { cost: spent.value, gain: gain.value, required: required.value } } };
  }
  if (hasSpheres) {
    if (classId !== 'arcanoneer') return refuse('Elemental Spheres are the Arcanoneer class domain.');
    const agreeSpheres = (label, candidates) => {
      const lists = candidates.filter(value => value !== undefined)
        .map(value => listCounts(Array.isArray(value) ? value : [value]).map(sphere));
      if (!lists.length) return { ok: true, value: [] };
      if (lists.some(list => canonical(list) !== canonical(lists[0]))) return refuse(`Conflicting ${label} encodings.`);
      return { ok: true, value: lists[0] };
    };
    const costs = agreeSpheres('Elemental Sphere cost', [record._arcanoneerElements, record.elements, cost.spheres, record.sphereCost,
      ...(sphereCostKeys.length ? [sphereCostKeys.flatMap(([key, amount]) => Array(Math.max(0, Number(amount) || 0)).fill(key))] : [])]);
    const gains = agreeSpheres('Elemental Sphere gain', [record.sphereGenerate, record.sphereGain, record.resourceGain?.spheres,
      ...(sphereGainKeys.length ? [sphereGainKeys.flatMap(([key, amount]) => Array(Math.max(0, Number(amount) || 0)).fill(key))] : [])]);
    for (const result of [costs, gains]) if (!result.ok) return result;
    if (costs.value.some(value => !value) || gains.value.some(value => !value)) return refuse('Sphere price names are outside the existing vocabulary.');
    return { ok: true, payment: { domain: 'elementalSpheres', price: { costs: costs.value, gains: gains.value } } };
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
  const isArea = targeting?.targetingType === 'area';
  if (isArea) {
    if (!keysOnly(targeting, TARGET_KEYS) || targeting.aoeShape !== 'circle' ||
      (targeting.aoeType !== undefined && !['', 'sphere', 'circle'].includes(targeting.aoeType)) ||
      targeting.rangeType !== 'ranged' || !int(targeting.rangeDistance, 1, 300) ||
      !keysOnly(targeting.aoeParameters, ['radius', 'size', 'range', 'angle', 'length', 'width', 'height']) ||
      !int(targeting.aoeParameters.radius, 5, 60) || targeting.aoeParameters.radius % 5 !== 0 ||
      Object.entries(targeting.aoeParameters).some(([k, v]) => k !== 'radius' && !int(v, 0, 10000)) ||
      (targeting.maxTargets !== undefined && !int(targeting.maxTargets, 1, MAX_AREA_TARGETS)) ||
      !Array.isArray(targeting.targetRestrictions) || targeting.targetRestrictions.length !== 1 ||
      !['ally', 'enemy', 'any'].includes(targeting.targetRestrictions[0]) ||
      (targeting.targetRestriction && targeting.targetRestriction !== targeting.targetRestrictions[0]) ||
      (targeting.selectionMethod !== undefined && targeting.selectionMethod !== 'manual') ||
      (targeting.targetSelectionMethod !== undefined && targeting.targetSelectionMethod !== 'manual') ||
      (targeting.movementBehavior !== undefined && targeting.movementBehavior !== 'static')) {
      return refuse('Only a ranged circle area action within the bounded 8-target technical limit is supported.');
    }
  } else if (!keysOnly(targeting, TARGET_KEYS) || targeting.targetingType !== 'single' || (targeting.maxTargets !== undefined && targeting.maxTargets !== 1) ||
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
  if (!isArea && kind === 'healing' && targeting.targetRestrictions[0] !== 'ally') return refuse('M4B catalogue healing requires an ally target.');
  if (!isArea && kind === 'damage' && targeting.targetRestrictions[0] === 'ally') return refuse('Damage cannot use the healing ally route.');
  const reading = readFormula(config.formula, Object.fromEntries(ATTRIBUTES.map(name => [name, 10])), { integerScaling: true });
  if (!reading.supported || (!isArea && !formulaAttributes(config.formula).length)) return refuse(reading.reason || 'The formula must use at least one caster score.');
  const paymentResult = classPaymentFor(record, classId);
  if (paymentResult && !paymentResult.ok) return paymentResult;
  const payment = paymentResult?.payment || null;
  const catalogueSource = { spellId: record.id, classId, recordHash: sha256Hex(canonical(record)) };
  const targetCapability = isArea ? AREA_CAPABILITY : CAPABILITY;
  const pinned = profileFor(catalogueSource, targetCapability);
  if (!pinned.ok) return pinned;
  const maxTargets = isArea ? (targeting.maxTargets !== undefined && targeting.maxTargets > 1 ? targeting.maxTargets : MAX_AREA_TARGETS) : 1;
  const definition = isArea ? {
    schemaVersion: 5, capability: AREA_CAPABILITY, scope: { roomId }, definitionId, definitionVersion,
    name: record.name, description: record.description,
    binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId },
    spellType: 'ACTION', castTimeType: 'IMMEDIATE',
    targeting: { kind: 'area', aoeShape: 'circle', radiusFeet: targeting.aoeParameters.radius, rangeFeet: targeting.rangeDistance, maxTargets, restriction: targeting.targetRestrictions[0] },
    resourceCost: { actionPoints: cost.actionPoints, mana },
    effect: kind === 'damage' ? { kind, formula: config.formula, damageTypes: [...config.damageTypes] } : { kind, formula: config.formula },
    ...(payment ? { classPayment: payment } : {}),
    catalogueSource
  } : {
    schemaVersion: 4, capability: CAPABILITY, scope: { roomId }, definitionId, definitionVersion,
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
  const verified = verifyDefinition(definition, pinned.entry);
  if (!verified.ok) return verified;
  return { ok: true, definition, classPayment: payment, targetRoute: isArea ? 'creature' : (kind === 'healing' ? 'primary-pc-healing' : 'creature') };
}

/** Wizard record that preserves the whole catalogue source and carries only the supported projection. */
function catalogueDraft(record, classId, { authoredDefinitionId, id } = {}) {
  const executable = catalogueExecutable(record, classId, {
    roomId: 'diagnostic', definitionId: authoredDefinitionId || '00000000-0000-4000-8000-000000000000', definitionVersion: 1
  });
  if (!executable.ok) return executable;
  const definition = executable.definition;
  const isArea = definition.capability === AREA_CAPABILITY;
  const draft = {
    id: id || `catalogue-${record.id}`,
    name: record.name, description: record.description, level: record.level || 1, icon: record.icon || 'inv_misc_questionmark',
    school: record.typeConfig?.school || '', spellType: 'ACTION', typeConfig: JSON.parse(JSON.stringify(record.typeConfig)),
    effectTypes: [...record.effectTypes], effectsMap: { [definition.effect.kind]: true },
    damageConfig: definition.effect.kind === 'damage' ? { ...record.damageConfig, formula: definition.effect.formula } : null,
    healingConfig: definition.effect.kind === 'healing' ? { ...record.healingConfig, formula: definition.effect.formula, healingType: 'direct' } : null,
    targetingConfig: isArea ? {
      ...JSON.parse(JSON.stringify(record.targetingConfig)),
      targetingType: 'area', aoeShape: 'circle', rangeType: 'ranged',
      rangeDistance: definition.targeting.rangeFeet, aoeParameters: { radius: definition.targeting.radiusFeet },
      maxTargets: definition.targeting.maxTargets, targetRestrictions: [definition.targeting.restriction]
    } : {
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

module.exports = { CAPABILITY, AREA_CAPABILITY, MAX_AREA_TARGETS, CLASS_DOMAIN, DOMAINS, catalogueExecutable, catalogueDraft, classPaymentFor,
  profileFor, verifyRecord, verifyDefinition, definitionProjection };
