/** M1 `class-effect:v1`: one class-paid composed effect — one direct DICE damage OR healing plus one flat
 * movement rider — compiled from an exact class record and admitted only through a reviewed, hash-pinned
 * profile entry. Pure data/validation: no evaluator, clock, payment engine or save math.
 * P9 owns payment typing and conservation, A10/A11 own the movement record and its combination, P7 installs.
 * Keep this Node/client module free of object-spread Babel helper imports (CRA otherwise marks CommonJS as ESM). */
const profile = require('./sharedConditionProfile');
const data = require('../data/classEffectProfiles.json');

const CAPABILITY = 'class-effect:v1';
const COMPILER = 'class-effect-1';
const OCCURRENCE_PREFIX = 'class-effect:';
const ATTRIBUTES = ['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'];
const SHA = /^[0-9a-f]{64}$/;
const SLUG = /^[a-z][a-z0-9_]{0,63}$/;

// Exact port of the P9 client formula reader (spellConsequence.readFormula) so the server can bind a roll to the
// pinned formula: same vocabulary, same floor rounding, same reading text. Attribute scores are owner-attested inputs.
const ABBREVIATION = { strength: 'STR', agility: 'AGI', constitution: 'CON', intelligence: 'INT', spirit: 'SPI', charisma: 'CHA' };
const REFUSED_TOKENS = ['int', 'str', 'agi', 'con', 'spi', 'cha', 'wis', 'dex', 'intellect'];
const whole = (value, min, max) => Number.isSafeInteger(value) && value >= min && value <= max;
function readFormula(formula, stats = {}) {
  const manual = reason => ({ supported: false, reason });
  if (typeof formula !== 'string' || !formula.trim() || formula.length > 120) return manual('Formula is missing or too long.');
  const clean = formula.replace(/\s+/g, '').toLowerCase(), parts = clean.match(/[+-]?[^+-]+/g) || [];
  if (parts.join('') !== clean) return manual('Formula is outside the approved vocabulary.');
  const dice = [], terms = [], attributes = [];
  let constant = 0;
  const score = name => { attributes.push(name); const v = stats?.[name]; return Number.isInteger(v) ? v : null; };
  for (const part of parts) {
    const sign = part.startsWith('-') ? -1 : 1, body = part.replace(/^[+-]/, '');
    let m;
    if ((m = body.match(/^(\d+)d(\d+)$/))) {
      const count = Number(m[1]), sides = Number(m[2]);
      if (sign < 0 || !whole(count, 1, 50) || !whole(sides, 2, 100)) return manual('Dice term is outside the supported bounds.');
      dice.push({ count, sides }); terms.push(`${count}d${sides}`);
    } else if ((m = body.match(/^(\d+)$/))) {
      const value = Number(m[1]); if (!whole(value, 0, 10000)) return manual('Constant is outside the supported bounds.');
      constant += sign * value; terms.push(`${sign < 0 ? '-' : '+'} ${value}`);
    } else if ((m = body.match(/^([a-z]+)\/(\d+)$/))) {
      const name = m[1], divisor = Number(m[2]);
      if (REFUSED_TOKENS.includes(name) || !ATTRIBUTES.includes(name) || !whole(divisor, 1, 100)) return manual('Term is outside the approved vocabulary.');
      const value = score(name); if (value === null) return manual(`${ABBREVIATION[name]} score is unavailable.`);
      const quotient = Math.floor(value / divisor);
      constant += sign * quotient; terms.push(`${sign < 0 ? '-' : '+'} ${quotient} (${ABBREVIATION[name]} ${value} ÷ ${divisor}, rounded down)`);
    } else if ((m = body.match(/^([a-z]+?)(_modifier|mod)$/))) {
      const name = m[1]; if (REFUSED_TOKENS.includes(name) || !ATTRIBUTES.includes(name)) return manual('Term is outside the approved vocabulary.');
      const value = score(name); if (value === null) return manual(`${ABBREVIATION[name]} score is unavailable.`);
      const modifier = Math.floor((value - 10) / 2);
      constant += sign * modifier; terms.push(`${sign * modifier < 0 ? '-' : '+'} ${Math.abs(modifier)} (${ABBREVIATION[name]} modifier, score ${value})`);
    } else if ((m = body.match(/^([a-z]+)$/))) {
      const name = m[1]; if (REFUSED_TOKENS.includes(name) || !ATTRIBUTES.includes(name)) return manual('Term is outside the approved vocabulary.');
      const value = score(name); if (value === null) return manual(`${ABBREVIATION[name]} score is unavailable.`);
      constant += sign * value; terms.push(`${sign < 0 ? '-' : '+'} ${value} (${ABBREVIATION[name]} score)`);
    } else return manual('Term is outside the approved vocabulary.');
  }
  if (!dice.length) return manual('At least one die is required.');
  return { supported: true, dice, constant, attributes: [...new Set(attributes)].sort(), reading: `${formula.trim()} → ${terms.join(' ')}`.slice(0, 300) };
}
/** Attributes a formula reads (for the owner-attested `rollAttributes` map). */
const formulaAttributes = formula => (String(formula || '').toLowerCase().match(/[a-z]+/g) || []).map(t => t.replace(/(_modifier|mod)$/, '')).filter(t => ATTRIBUTES.includes(t)).filter((t, i, a) => a.indexOf(t) === i).sort();
/** The roll must be exactly the pinned formula read with the owner-attested scores (dice shape, constant, reading). */
function rollMatches(formula, roll, rollAttributes) {
  if (!isObject(rollAttributes) || Object.keys(rollAttributes).sort().join() !== formulaAttributes(formula).join() ||
      Object.values(rollAttributes).some(v => !whole(v, 0, 1000))) return false;
  const expected = readFormula(formula, rollAttributes);
  return expected.supported === true && !!roll && roll.constant === expected.constant && roll.reading === expected.reading && Array.isArray(roll.dice) &&
    roll.dice.length === expected.dice.length && expected.dice.every((g, i) => roll.dice[i].sides === g.sides && roll.dice[i].faces.length === g.count);
}
const isObject = value => !!value && typeof value === 'object' && !Array.isArray(value);
const extra = (value, allowed) => isObject(value) ? Object.keys(value).filter(key => !allowed.includes(key)) : ['(missing)'];
const refuse = reason => ({ ok: false, reason });
const text = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
const clone = value => JSON.parse(JSON.stringify(value));

// Fields the effect compiler executes or validates. Everything else that is present is preserved and must be disclosed.
const DIRECT_KEYS = { damage: ['formula', 'damageTypes', 'resolution', 'description', 'elementType'], healing: ['formula', 'healingType', 'description', 'resolution'] };
const DEBUFF_KEYS = ['debuffType', 'effects', 'durationValue', 'durationType', 'durationUnit', 'saveDC', 'saveType', 'saveOutcome'];
const RIDER_KEYS = ['id', 'name', 'description', 'statusType', 'level', 'statPenalty', 'movementPenalty', 'mechanicsText'];
const SAVE_KEYS = ['saveDC', 'saveType', 'saveOutcome'];
// Present-but-not-executed record fields that a reviewed profile must name explicitly (never silently discarded).
const PRESERVED_PATHS = ['description', 'tags', 'typeConfig.school', 'typeConfig.tags', 'enhancesCombo', 'flavorText', 'specialization', 'categoryIds',
  'resourceCost.components', 'resourceCost.verbalText', 'resourceCost.somaticText', 'resourceCost.materialText', 'verbalText', 'somaticText', 'materialText',
  'debuffConfig.debuffType', 'debuffConfig.durationValue', 'debuffConfig.durationType', 'debuffConfig.durationUnit',
  'debuffConfig.effects[0].id', 'debuffConfig.effects[0].description', 'debuffConfig.effects[0].statusType', 'debuffConfig.effects[0].level',
  'debuffConfig.effects[0].mechanicsText', 'damageConfig.description', 'healingConfig.description'];
const at = (raw, path) => path.split('.').reduce((value, part) => {
  if (value === undefined || value === null) return undefined;
  const indexed = /^([a-zA-Z]+)\[(\d+)\]$/.exec(part);
  return indexed ? (value[indexed[1]] || [])[+indexed[2]] : value[part];
}, raw);
const present = value => value !== undefined && value !== null && !(Array.isArray(value) && !value.length) && value !== '';

/**
 * Compiles the effect-specific part of an exact class record. Price, targeting, cooldown and formula
 * vocabulary are validated by the unchanged P9 support helpers on the client (`supportShape` on the
 * direct projection) — this function covers only the composed effect, its branches and its timing text.
 */
function compile(raw) {
  if (!isObject(raw)) return refuse('Original class record unavailable.');
  const types = Array.isArray(raw.effectTypes) ? raw.effectTypes : [];
  const kind = types.length === 2 && types.includes('debuff') ? types.find(type => type !== 'debuff') : null;
  if (!['damage', 'healing'].includes(kind)) return refuse(`Effect types ${JSON.stringify(types)} are not exactly one direct damage or healing plus one debuff.`);
  if (raw.buffConfig !== undefined || raw[kind === 'damage' ? 'healingConfig' : 'damageConfig'] !== undefined) return refuse('Additional effect blocks stay manual.');
  const direct = kind === 'damage' ? raw.damageConfig : raw.healingConfig;
  const directExtra = extra(direct, DIRECT_KEYS[kind]);
  if (directExtra.length) return refuse(`${kind} fields ${directExtra.join(', ')} (save, critical, over-time, chain …) stay manual.`);
  const debuff = raw.debuffConfig, debuffExtra = extra(debuff, DEBUFF_KEYS);
  if (debuffExtra.length) return refuse(`Debuff fields ${debuffExtra.join(', ')} stay manual.`);
  if (debuff.debuffType !== 'statusEffect' || !Array.isArray(debuff.effects) || debuff.effects.length !== 1) return refuse('Exactly one status debuff is supported.');
  const rider = debuff.effects[0], riderExtra = extra(rider, RIDER_KEYS);
  if (riderExtra.length) return refuse(`Debuff effect fields ${riderExtra.join(', ')} stay manual.`);
  const penalty = rider.statPenalty;
  if (!isObject(penalty) || extra(penalty, ['stat', 'value']).length || penalty.stat !== 'movement_speed') return refuse('Only a flat movement-speed change is supported as the rider.');
  const feet = penalty.value;
  if (!profile.validMovementFeet(feet) || feet >= 0) return refuse('The movement change must be a whole-5 ft reduction within the supported range.');
  if (rider.movementPenalty !== undefined && rider.movementPenalty !== feet) return refuse('Movement penalty encodings disagree.');
  if (!text(rider.name, 60) || rider.name !== rider.name.trim()) return refuse('The rider needs a name of at most 60 characters.');
  // The roll must be bindable server-side: the formula must be in the shared reader's vocabulary.
  if (!readFormula(direct.formula, Object.fromEntries(ATTRIBUTES.map(a => [a, 10]))).supported) return refuse('Formula is outside the bindable vocabulary (manual).');
  // Branches come only from this definition's own structure: a save is supported only inside the rider block,
  // and only with the authored outcome "negates" (the block it sits in is not applied on a success).
  const saveFields = SAVE_KEYS.filter(key => debuff[key] !== undefined);
  let save = null;
  if (saveFields.length) {
    if (saveFields.length !== SAVE_KEYS.length) return refuse('Partial save configuration stays manual.');
    if (debuff.saveOutcome !== 'negates') return refuse(`Save outcome "${debuff.saveOutcome}" stays manual (only a rider-local "negates" is supported).`);
    if (!ATTRIBUTES.includes(debuff.saveType) || !Number.isSafeInteger(debuff.saveDC) || debuff.saveDC < 1 || debuff.saveDC > 40) return refuse('Save ability or DC is outside the supported shape.');
    save = { ability: debuff.saveType, dc: debuff.saveDC, outcome: 'negates', scope: 'debuffConfig' };
  }
  // Timing is never mapped: the authored duration is carried verbatim and the GM removes the instance.
  const durationText = [rider.mechanicsText, rider.description].find(value => text(value, 700));
  if (!durationText) return refuse('The rider needs its authored duration text.');
  const terms = {
    capability: CAPABILITY, compiler: COMPILER,
    direct: kind === 'damage' ? { kind, formula: direct.formula, damageTypes: clone(direct.damageTypes || []) } : { kind, formula: direct.formula },
    rider: { kind: 'movement', feet, label: rider.name },
    save,
    timing: { expiryPolicy: 'gm-manual', durationText,
      authored: { durationValue: debuff.durationValue ?? null, durationType: debuff.durationType ?? null, durationUnit: debuff.durationUnit ?? null } }
  };
  const preserved = PRESERVED_PATHS.filter(path => present(at(raw, path)));
  return { ok: true, kind, terms, preserved };
}

/** Exact profile entry for this record hash, or a refusal. Admission requires a recorded Class HQ confirmation. */
function profileFor(recordHash, { requireConfirmation = true } = {}) {
  if (!SHA.test(recordHash || '')) return refuse('Exact class record hash required.');
  const matches = (Array.isArray(data.profiles) ? data.profiles : []).filter(entry => entry.recordHash === recordHash);
  if (matches.length !== 1) return refuse('No reviewed class-effect profile pins this exact record (it may have changed); manual play only.');
  const entry = matches[0];
  if (entry.capability !== CAPABILITY || entry.compiler !== COMPILER) return refuse('Profile capability/compiler mismatch.');
  if (requireConfirmation && !(isObject(entry.review?.classHq) && text(entry.review.classHq.reference, 300))) {
    return refuse('Class HQ has not confirmed this profile yet; manual play only.');
  }
  return { ok: true, entry };
}

/** Full admission check: compiled terms equal the pinned terms and every preserved field is disclosed. */
function admit(raw, recordHash, options) {
  const compiled = compile(raw);
  if (!compiled.ok) return compiled;
  const found = profileFor(recordHash, options);
  if (!found.ok) return found;
  const { entry } = found;
  if (entry.classId !== undefined && !SLUG.test(entry.classId)) return refuse('Profile class id is malformed.');
  if (entry.spellId !== raw.id) return refuse('Profile spell id does not match the record.');
  if (profile.canonical(entry.terms) !== profile.canonical(compiled.terms)) return refuse('Pinned profile terms differ from the record; manual play only.');
  const disclosed = new Set((entry.disclosure?.preserved || []).map(item => item.path));
  const missing = compiled.preserved.filter(path => !disclosed.has(path));
  if (missing.length) return refuse(`Profile does not disclose preserved fields: ${missing.join(', ')}.`);
  return { ok: true, kind: compiled.kind, terms: compiled.terms, entry };
}

const definitionHash = recordHash => `${CAPABILITY}/${recordHash}`;
const isClassEffect = approval => String(approval?.spell?.definitionHash || '').startsWith(`${CAPABILITY}/`);
const recordHashOf = approval => String(approval?.spell?.definitionHash || '').slice(CAPABILITY.length + 1);
/** Stable effect identity for A11 combination: `class:<classId>:<spellId>:<recordHash>`. */
const effectDefinition = entry => `class:${entry.classId}:${entry.spellId}:${entry.recordHash}`;
const branches = terms => terms.save ? ['saved', 'failed'] : ['applied'];
const riderApplies = (terms, branch) => branch === 'failed' || branch === 'applied';
const occurrence = approvalId => OCCURRENCE_PREFIX + approvalId;
/** True for a record installed by a class-effect approval (never creatable by a generic write). */
const namedRecord = record => String(record?.sourceEntityId || '').startsWith(OCCURRENCE_PREFIX) && record?.effectOrigin === profile.MOVEMENT.origin;
/** Exact class id of a character's class name ("Arcanoneer (Prismatic)" → arcanoneer). */
const classIdOf = name => String(name || '').replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase().replace(/[\s-]+/g, '_');

/** The exact movement record a rider-applying branch installs on the target. */
function recordFor(approval, entry) {
  const terms = approval.effectTerms;
  return profile.makeMovementRecord(approval.target, approval.approvalId, {
    sourceOccurrence: occurrence(approval.approvalId), timing: 'manual', sourceActor: approval.source,
    authoredDuration: terms.timing.durationText, feet: terms.rider.feet, label: terms.rider.label, effectDefinition: effectDefinition(entry) });
}
/** The GM's bound choice: one branch the owner approved, plus the existing direct-result fields. */
function resultFor(approval, branch, combination = null) {
  const terms = approval.effectTerms;
  return Object.assign({ capability: CAPABILITY, approvalId: approval.approvalId, kind: 'class-effect', gmConfirmed: true, roll: approval.roll,
    direct: clone(terms.direct), branch, riderApplied: riderApplies(terms, branch), conditionInstanceId: riderApplies(terms, branch) ? approval.approvalId : null,
    rider: clone(terms.rider), automation: 'partial', spellName: approval.spell.name }, combination ? { combination: clone(combination) } : {});
}
function riderText(terms) {
  return `${terms.rider.label} (movement −${Math.abs(terms.rider.feet)} ft)`;
}
const ABILITY = { strength: 'Strength', agility: 'Agility', constitution: 'Constitution', intelligence: 'Intelligence', spirit: 'Spirit', charisma: 'Charisma' };
/** One line per outcome branch, as both owner and GM see it before confirmation. */
function branchLines(terms) {
  const direct = terms.direct.kind === 'damage' ? `${terms.direct.damageTypes.join('/')} damage ${terms.direct.formula}` : `healing ${terms.direct.formula}`;
  if (!terms.save) return [{ branch: 'applied', text: `${direct} + ${riderText(terms)}` }];
  const save = `${ABILITY[terms.save.ability]} DC ${terms.save.dc}`;
  return [{ branch: 'saved', text: `Target saves (${save}, GM records): ${direct}; no ${terms.rider.label}` },
    { branch: 'failed', text: `Target fails (${save}, GM records): ${direct} + ${riderText(terms)}` }];
}
/** Public disclosure: what is automated, what the GM manages and what is not automated. */
function disclosure(entry) {
  const d = entry.disclosure || {};
  return { automated: clone(d.automated || []), gmManaged: clone(d.gmManaged || []), notAutomated: clone(d.notAutomated || []),
    preserved: clone((d.preserved || []).map(item => ({ path: item.path, note: item.note }))), status: 'Partially automated' };
}

module.exports = { CAPABILITY, COMPILER, OCCURRENCE_PREFIX, PRESERVED_PATHS, compile, profileFor, admit, definitionHash, isClassEffect, recordHashOf,
  effectDefinition, branches, riderApplies, occurrence, namedRecord, classIdOf, readFormula, formulaAttributes, rollMatches, recordFor, resultFor, branchLines, disclosure, riderText };
