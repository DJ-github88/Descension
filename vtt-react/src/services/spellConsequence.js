/** Original P9 only: supported immediate single-target DICE damage/healing.
 * Pure support adapter, approved formula reading, class-owned payment typing and
 * strict command preparation. No mitigation, defense, reactions or rules engine:
 * unsupported data stays manual with a precise diagnostic.
 */
import { CLASS_DATA_MAP } from '../data/classSpellGenerator';
import { getManagedSpellResourcePlan, normalizeManagedClassResource, getManagedResourceId, changeManagedClassResource } from '../data/classResourceContracts';
import { toCanonicalSphere, MINSTREL_PITCHES } from '../data/classResourceBanks';
import { canonical, depleteTempFirst, exactActor, sameExactRef } from './featherSlash';
import { authoredSupport } from './authoredAbilityRegistry';
import { CAPABILITY as AUTHORED, isAuthored } from './authoredAbility';
import { getStore } from '../store/storeRegistry';

/** Rollback switch (contract F9 rollback): false returns every producer to manual. */
export const P9_SPELL_EXECUTION = true;
export const P9_CAPABILITY = 'p9-spell:v1';
export const ATTRIBUTES = Object.freeze(['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma']);
export const REFUSED_TOKENS = Object.freeze(['int', 'str', 'agi', 'con', 'spi', 'cha', 'wis', 'dex', 'intellect']);
export const SUPPORTED_DOMAINS = Object.freeze(['none', 'elementalSpheres', 'musicalNotes', 'devotionGauge']);
const ABBREVIATION = { strength: 'STR', agility: 'AGI', constitution: 'CON', intelligence: 'INT', spirit: 'SPI', charisma: 'CHA' };
const isObject = value => !!value && typeof value === 'object' && !Array.isArray(value);
const onlyKeys = (value, allowed) => isObject(value) && Object.keys(value).every(key => allowed.includes(key));
const extraKeys = (value, allowed) => isObject(value) ? Object.keys(value).filter(key => !allowed.includes(key)) : [];
const manual = reason => ({ supported: false, reason });
const integer = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(value) && value >= min && value <= max;

// ── SHA-256 (synchronous, for the pinned definition identity) ───────────────
const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
export function sha256Hex(input) {
  // UTF-8 bytes without relying on TextEncoder (absent in some test/runtime hosts).
  const bytes = [];
  for (const char of String(input)) {
    const code = char.codePointAt(0);
    if (code < 0x80) bytes.push(code);
    else if (code < 0x800) bytes.push(0xc0 | (code >> 6), 0x80 | (code & 63));
    else if (code < 0x10000) bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 63), 0x80 | (code & 63));
    else bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 63), 0x80 | ((code >> 6) & 63), 0x80 | (code & 63));
  }
  const bitLength = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let shift = 56; shift >= 0; shift -= 8) bytes.push(shift >= 32 ? Math.floor(bitLength / 2 ** shift) & 0xff : (bitLength >>> shift) & 0xff);
  const h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const w = new Array(64);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let offset = 0; offset < bytes.length; offset += 64) {
    for (let i = 0; i < 16; i++) w[i] = (bytes[offset + 4 * i] << 24) | (bytes[offset + 4 * i + 1] << 16) | (bytes[offset + 4 * i + 2] << 8) | bytes[offset + 4 * i + 3];
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const t1 = (hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    [a, b, c, d, e, f, g, hh].forEach((value, i) => { h[i] = (h[i] + value) | 0; });
  }
  return h.map(value => (value >>> 0).toString(16).padStart(8, '0')).join('');
}
export const definitionHash = raw => `${P9_CAPABILITY}/${sha256Hex(canonical(raw))}`;

// ── Original definition ─────────────────────────────────────────────────────
export const baseClassName = className => String(className || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
/** Raw authored class entry only: never a slot copy, alias card or formulation. */
export function resolveOriginalSpell(className, spellId) {
  const data = CLASS_DATA_MAP[baseClassName(className)];
  const matches = (Array.isArray(data?.spells) ? data.spells : []).filter(spell => spell?.id === spellId);
  return matches.length === 1 ? matches[0] : null;
}

// ── Approved formula vocabulary ─────────────────────────────────────────────
export function readFormula(formula, stats = {}) {
  if (typeof formula !== 'string' || !formula.trim() || formula.length > 120) return manual('Formula is missing or too long.');
  const clean = formula.replace(/\s+/g, '').toLowerCase();
  const parts = clean.match(/[+-]?[^+-]+/g) || [];
  if (parts.join('') !== clean) return manual(`Formula "${formula}" is outside the approved vocabulary.`);
  const dice = [], terms = [];
  let constant = 0;
  const score = attribute => {
    const value = stats?.[attribute];
    return typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value) ? value : null;
  };
  for (const part of parts) {
    const sign = part.startsWith('-') ? -1 : 1;
    const body = part.replace(/^[+-]/, '');
    let match;
    if ((match = body.match(/^(\d+)d(\d+)$/))) {
      const count = Number(match[1]), sides = Number(match[2]);
      if (sign < 0 || !integer(count, 1, 50) || !integer(sides, 2, 100)) return manual(`Dice term "${body}" is outside the supported bounds.`);
      dice.push({ count, sides }); terms.push(`${count}d${sides}`);
    } else if ((match = body.match(/^(\d+)$/))) {
      const value = Number(match[1]);
      if (!integer(value, 0, 10000)) return manual(`Constant "${body}" is outside the supported bounds.`);
      constant += sign * value; terms.push(`${sign < 0 ? '-' : '+'} ${value}`);
    } else if ((match = body.match(/^([a-z]+)\/(\d+)$/))) {
      const [, name, divisorText] = match, divisor = Number(divisorText);
      if (REFUSED_TOKENS.includes(name)) return manual(`"${name}" is not an approved attribute token; use the full attribute name.`);
      if (!ATTRIBUTES.includes(name) || !integer(divisor, 1, 100)) return manual(`Term "${body}" is outside the approved vocabulary.`);
      const value = score(name);
      if (value === null) return manual(`${ABBREVIATION[name]} score is unavailable on the selected character.`);
      const quotient = Math.floor(value / divisor);
      constant += sign * quotient; terms.push(`${sign < 0 ? '-' : '+'} ${quotient} (${ABBREVIATION[name]} ${value} ÷ ${divisor}, rounded down)`);
    } else if ((match = body.match(/^([a-z]+?)(_modifier|mod)$/))) {
      const name = match[1];
      if (REFUSED_TOKENS.includes(name)) return manual(`"${name}" is not an approved attribute token; use the full attribute name.`);
      if (!ATTRIBUTES.includes(name)) return manual(`Term "${body}" is outside the approved vocabulary.`);
      const value = score(name);
      if (value === null) return manual(`${ABBREVIATION[name]} score is unavailable on the selected character.`);
      const modifier = Math.floor((value - 10) / 2);
      constant += sign * modifier; terms.push(`${sign * modifier < 0 ? '-' : '+'} ${Math.abs(modifier)} (${ABBREVIATION[name]} modifier, score ${value})`);
    } else if ((match = body.match(/^([a-z]+)$/))) {
      const name = match[1];
      if (REFUSED_TOKENS.includes(name)) return manual(`"${name}" is not an approved attribute token; use the full attribute name.`);
      if (!ATTRIBUTES.includes(name)) return manual(`"${name}" is not part of the approved formula vocabulary.`);
      const value = score(name);
      if (value === null) return manual(`${ABBREVIATION[name]} score is unavailable on the selected character.`);
      constant += sign * value; terms.push(`${sign < 0 ? '-' : '+'} ${value} (${ABBREVIATION[name]} score)`);
    } else return manual(`Term "${body}" is outside the approved vocabulary (no multiplication, parentheses or percentages).`);
  }
  if (!dice.length) return manual('Supported spells must roll at least one die (DICE resolution).');
  return { supported: true, dice, constant, reading: `${formula.trim()} → ${terms.join(' ')}`.slice(0, 300) };
}

// ── Spell shape ─────────────────────────────────────────────────────────────
const TOP_KEYS = ['id', 'name', 'description', 'level', 'spellType', 'icon', 'typeConfig', 'targetingConfig', 'resourceCost', 'effectTypes', 'damageConfig', 'healingConfig',
  'cooldownConfig', 'tags', 'specialization', 'categoryIds', 'resolution', 'enhancesCombo', 'flavorText', 'devotionRequired', 'devotionGain', 'devotionCost', 'musicalCombo', 'sphereCost', 'durationConfig',
  'verbalText', 'somaticText', 'materialText'];
const RESOURCE_KEYS = ['resourceTypes', 'resourceValues', 'useFormulas', 'actionPoints', 'mana', 'components', 'verbalText', 'somaticText', 'materialText', 'spheres', 'classResource', 'notes'];
function commonPrice(raw) {
  const cost = raw.resourceCost;
  if (!onlyKeys(cost, RESOURCE_KEYS)) return manual(`Resource cost has unsupported fields: ${extraKeys(cost, RESOURCE_KEYS).join(', ') || 'missing'}.`);
  if (cost.useFormulas !== undefined && (!isObject(cost.useFormulas) || Object.keys(cost.useFormulas).length)) return manual('Formula-based resource costs stay manual.');
  if (!integer(cost.actionPoints, 0, 20)) return manual('Action point cost must be an explicit whole number.');
  const values = isObject(cost.resourceValues) ? cost.resourceValues : {};
  const allowedValueKey = key => ['mana', 'classResource', 'devotion_cost', 'devotion_required', 'devotion_gain'].includes(key) || /_sphere$/i.test(key) || /^note_/i.test(key);
  const odd = Object.keys(values).filter(key => !allowedValueKey(key));
  if (odd.length) return manual(`Resource values ${odd.join(', ')} have no supported P9 payer (stays manual).`);
  const manaSources = [values.mana, cost.mana].filter(value => value !== undefined);
  if (manaSources.some(value => !integer(value, 0, 10000)) || new Set(manaSources).size > 1) return manual('Mana cost encodings are missing or disagree.');
  return { supported: true, ap: cost.actionPoints, mana: manaSources[0] ?? 0 };
}
function cooldownOf(raw) {
  const config = raw.cooldownConfig;
  if (config === undefined) return { supported: true, type: 'none', value: 0 };
  if (!onlyKeys(config, ['cooldownType', 'cooldownValue']) || !['turn_based', 'real_time', 'none'].includes(config.cooldownType) || !integer(config.cooldownValue, 0, 1000)) {
    return manual('Cooldown configuration is outside the supported shape.');
  }
  return { supported: true, type: config.cooldownType, value: config.cooldownValue };
}
/** Positive validation of the authored spell itself (independent of the caster). */
export function supportShape(raw) {
  if (!isObject(raw)) return manual('Original authored definition unavailable — library, custom, formulation and weapon actions stay manual.');
  const extra = extraKeys(raw, TOP_KEYS);
  if (extra.length) return manual(`Authored fields ${extra.join(', ')} are not executed by P9 (manual).`);
  if (raw.spellType !== 'ACTION') return manual(`${raw.spellType || 'Untyped'} spells stay manual; P9 executes immediate actions only.`);
  if (raw.typeConfig?.castTimeType !== 'IMMEDIATE' || extraKeys(raw.typeConfig, ['school', 'icon', 'tags', 'castTime', 'castTimeType', 'element']).length) return manual('Only immediate casts are supported.');
  if (raw.durationConfig !== undefined && canonical(raw.durationConfig) !== canonical({ durationType: 'instant' })) return manual('Durations stay manual.');
  const targeting = raw.targetingConfig;
  if (targeting?.targetingType !== 'single' || extraKeys(targeting, ['targetingType', 'rangeType', 'rangeDistance', 'targetRestrictions', 'maxTargets']).length ||
    (targeting.maxTargets !== undefined && targeting.maxTargets !== 1)) return manual('Only single-target spells are supported (area, chain and multi-target stay manual).');
  const effects = raw.effectTypes;
  const kind = canonical(effects) === canonical(['damage']) ? 'damage' : canonical(effects) === canonical(['healing']) ? 'healing' : null;
  if (!kind) return manual(`Effect types ${JSON.stringify(effects || [])} are not exactly damage or healing (mixed effects stay manual).`);
  const config = kind === 'damage' ? raw.damageConfig : raw.healingConfig;
  if (raw[kind === 'damage' ? 'healingConfig' : 'damageConfig'] !== undefined) return manual('Damage and healing configurations are mixed.');
  const allowed = kind === 'damage' ? ['formula', 'damageTypes', 'resolution', 'description', 'elementType'] : ['formula', 'healingType', 'hasHotEffect', 'description', 'resolution'];
  const configExtra = extraKeys(config, allowed);
  if (!isObject(config) || configExtra.length) return manual(`${kind} fields ${configExtra.join(', ') || 'missing'} (critical, save, over-time, chain, auto-hit …) stay manual.`);
  if ((config.resolution ?? raw.resolution) !== 'DICE' || (config.resolution && raw.resolution && config.resolution !== raw.resolution)) return manual('Only DICE resolution is supported.');
  if (kind === 'damage' && (!Array.isArray(config.damageTypes) || !config.damageTypes.length || config.damageTypes.some(type => typeof type !== 'string' || !type))) return manual('Damage spells need a declared damage type.');
  if (kind === 'healing' && (config.healingType !== 'direct' || config.hasHotEffect === true)) return manual('Only direct healing is supported (healing over time stays manual).');
  const price = commonPrice(raw);
  if (!price.supported) return price;
  const cooldown = cooldownOf(raw);
  if (!cooldown.supported) return cooldown;
  return { supported: true, kind, formula: config.formula, damageTypes: kind === 'damage' ? [...config.damageTypes] : [], price: { ap: price.ap, mana: price.mana }, cooldown };
}

// ── Class-owned payment (existing planners, typed results) ──────────────────
const countMap = list => list.reduce((map, item) => ({ ...map, [item]: (map[item] || 0) + 1 }), {});
function classComponent(raw) {
  const cost = raw.resourceCost || {}, values = cost.resourceValues || {};
  return cost.classResource !== undefined || values.classResource !== undefined || cost.spheres !== undefined || cost.notes !== undefined ||
    raw.sphereCost !== undefined || raw.musicalCombo !== undefined || raw.devotionCost !== undefined || raw.devotionGain !== undefined || raw.devotionRequired !== undefined ||
    Object.keys(values).some(key => /_sphere$/i.test(key) || /^note_/i.test(key) || /^devotion_/.test(key));
}
function encodingConflict(raw, domain) {
  const cost = raw.resourceCost || {}, values = cost.resourceValues || {};
  const generic = cost.classResource ?? values.classResource;
  if (generic !== undefined && (!onlyKeys(generic, ['type', 'cost', 'gain']) || [generic.cost, generic.gain].some(value => value !== undefined && !integer(value, 0, 35)))) {
    return `Class resource fields ${JSON.stringify(generic)} need a mechanic P9 does not execute (manual).`;
  }
  if (cost.classResource !== undefined && values.classResource !== undefined && canonical(cost.classResource) !== canonical(values.classResource)) return 'Duplicate class resource encodings disagree.';
  if (domain === 'elementalSpheres') {
    const explicit = raw._arcanoneerElements ?? raw.elements ?? cost.spheres ?? raw.sphereCost;
    const typed = Object.entries(values).filter(([key]) => /_sphere$/i.test(key) && !/generate|gain/i.test(key))
      .flatMap(([key, amount]) => Array(Number(amount) || 0).fill(toCanonicalSphere(key)));
    if (explicit !== undefined && typed.length && canonical(countMap((Array.isArray(explicit) ? explicit : []).map(toCanonicalSphere))) !== canonical(countMap(typed))) {
      return 'Sphere recipe encodings disagree (explicit list vs typed sphere counts); creator resolution required.';
    }
  }
  if (domain === 'musicalNotes') {
    const typed = Object.entries(values).filter(([key]) => /^note_/i.test(key));
    if (typed.length && raw.musicalCombo) return 'Note recipe encodings disagree (musical combo vs typed note values).';
  }
  if (domain === 'devotionGauge') {
    for (const [dedicated, nested, genericKey] of [[raw.devotionCost, values.devotion_cost, 'cost'], [raw.devotionGain, values.devotion_gain, 'gain']]) {
      const sources = [dedicated, nested, generic?.[genericKey]].filter(value => value !== undefined && !(value === 0 && genericKey === 'cost'));
      if (new Set(sources.map(Number)).size > 1) return 'Devotion encodings disagree.';
    }
  }
  return null;
}
export function typedClassValue(resource, className, domain) {
  const normalized = normalizeManagedClassResource(resource, className);
  if (!normalized) return null;
  if (domain === 'elementalSpheres') return { type: domain, spheres: [...(normalized.spheres || [])] };
  if (domain === 'musicalNotes') return { type: domain, notes: [...(normalized.notes || [])] };
  if (domain === 'devotionGauge') {
    const { current, max, damage, earnedLevels, spentLevels, bonusLevels } = normalized;
    return { type: domain, current, max, damage, earnedLevels, spentLevels, bonusLevels };
  }
  return null;
}
/** Reads the caster's class payment through the unchanged owning planner. */
export function planClassPayment(raw, classResource, className) {
  const normalized = normalizeManagedClassResource(classResource, className);
  const plan = getManagedSpellResourcePlan(raw, normalized, className);
  if (!plan.handled) {
    if (classComponent(raw)) return manual('This class component has no supported P9 payer (stays manual).');
    return { supported: true, domain: 'none', affordable: true, classPayment: null };
  }
  const domain = plan.bank ? plan.id : plan.id === 'devotionGauge' ? 'devotionGauge' : plan.id;
  if (!SUPPORTED_DOMAINS.includes(domain)) return manual(`${plan.label || domain} payments have no revisioned room home in P9 (stays manual).`);
  const conflict = encodingConflict(raw, domain);
  if (conflict) return manual(conflict);
  if (getManagedResourceId(normalized, className) !== domain) return manual(`This spell is paid with ${plan.label}; the selected character does not own that resource.`);
  if (!plan.affordable) return { supported: true, domain, affordable: false, reason: `Requires ${plan.label}${plan.bank ? ` (${plan.costs.join(', ') || 'recipe'})` : ` ${Math.max(plan.cost, plan.required)}`}; current class state cannot pay.` };
  const before = typedClassValue(normalized, className, domain);
  let after, price;
  if (domain === 'devotionGauge') {
    let next = normalized;
    if (plan.cost > 0) next = changeManagedClassResource(next, className, -plan.cost, plan.resourceKey);
    if (plan.gain > 0) next = changeManagedClassResource(next, className, plan.gain, plan.resourceKey);
    after = typedClassValue(next, className, domain);
    price = { cost: plan.cost, gain: plan.gain, required: plan.required };
  } else {
    after = typedClassValue(plan.nextResource, className, domain);
    price = { costs: [...plan.costs], gains: [...plan.gains] };
  }
  return { supported: true, domain, affordable: true, classPayment: { domain, before, after, price }, label: plan.label };
}
/** Complete support decision for one caster (shape, payer, formula). */
export function supportSpell(spellLike, character) {
  try { return supportSpellUnchecked(spellLike, character); } catch (error) {
    // Repair N3: malformed or missing class state is a manual diagnostic, never an exception.
    return manual(`Class resource state is unavailable or malformed (${error.message}); manual play only.`);
  }
}
function supportSpellUnchecked(spellLike, character) {
  if (!P9_SPELL_EXECUTION) return manual('P9 execution is disabled (rollback); manual play only.');
  if (isAuthored(spellLike)) return authoredSupport(spellLike.id, getStore('gameStore')?.getState().multiplayerRoom?.id, character?.class);
  const raw = resolveOriginalSpell(character?.class, spellLike?.id);
  if (!raw) return manual('No original class definition or admitted execution reference for this card. Use Admitted abilities for a GM-admitted Wizard version; other library, formulation and weapon actions stay manual.');
  // A slot/library copy that carries different mechanics is not the authored original.
  const mechanics = ['spellType', 'typeConfig', 'targetingConfig', 'resourceCost', 'effectTypes', 'damageConfig', 'healingConfig'];
  const altered = mechanics.filter(key => spellLike[key] !== undefined && canonical(spellLike[key]) !== canonical(raw[key]));
  if (altered.length) return manual(`This copy's ${altered.join(', ')} differ from the authored original; edited or library versions stay manual.`);
  const shape = supportShape(raw);
  if (!shape.supported) return shape;
  const payment = planClassPayment(raw, character.classResource, character.class);
  if (!payment.supported) return payment;
  const reading = readFormula(shape.formula, character.stats);
  if (!reading.supported) return reading;
  return { ...shape, raw, payment, reading, definitionId: raw.id, definitionHash: definitionHash(raw), name: raw.name };
}

// ── Rolls ───────────────────────────────────────────────────────────────────
export function recordRoll(mode, reading, faces) {
  if (!['digital', 'physical'].includes(mode) || !Array.isArray(faces) || faces.length !== reading.dice.length) throw Error('Enter every die face for this formula.');
  const dice = reading.dice.map((group, index) => {
    const values = faces[index];
    if (!Array.isArray(values) || values.length !== group.count || values.some(face => !Number.isInteger(face) || face < 1 || face > group.sides)) {
      throw Error(`Enter ${group.count} whole d${group.sides} face${group.count > 1 ? 's' : ''} from 1 to ${group.sides}.`);
    }
    return { sides: group.sides, faces: [...values] };
  });
  const total = dice.reduce((sum, group) => sum + group.faces.reduce((a, b) => a + b, 0), reading.constant);
  return { mode, dice, constant: reading.constant, total, reading: reading.reading };
}
export function digitalRoll(reading, random = Math.random) {
  return recordRoll('digital', reading, reading.dice.map(group => Array.from({ length: group.count }, () => Math.floor(random() * group.sides) + 1)));
}

// ── Owner approval and GM command ───────────────────────────────────────────
export function sourcePools(token) {
  if (token?.state?.actorContract?.kind === 'creature') return {
    ap: { current: token.state.currentActionPoints, temp: token.state.tempActionPoints ?? 0 },
    mana: { current: token.state.currentMana, temp: token.state.tempMana ?? 0 }
  };
  const c = token?.character || {};
  return { ap: { current: c.actionPoints?.current, temp: c.tempActionPoints || 0 }, mana: { current: c.mana?.current, temp: c.tempMana || 0 } };
}
export function affordable(pools, price) {
  return ['ap', 'mana'].every(pool => price[pool] === 0 || (Number.isFinite(pools[pool].current) && pools[pool].current + pools[pool].temp >= price[pool]));
}
/** Truthful wording (repair B2): only a refusal of the FIRST submission proves nothing
 * was recorded. A refused re-check can never be read as "no payment". */
const codeLabel = code => String(code || 'refused').replace(/_/g, ' ');
export function ownerRefusal(firstSubmission, code) {
  if (code === 'approval_consumed') return { phase: 'unresolved', message: 'This approval was already used; the payment was recorded (its receipt is no longer retained). Reconcile with the GM.' };
  if (firstSubmission && code !== 'retry_window_expired') return { phase: 'refused', message: `Not registered (${codeLabel(code)}) — no payment was recorded.` };
  return { phase: 'unresolved', message: `The server can no longer confirm this approval (${codeLabel(code)}). A payment may have been recorded; reconcile with the GM. It is never re-sent automatically.` };
}
export function gmRefusal(isRetry, code) {
  if (code === 'actor_stunned') return { phase: 'retry', message: 'Stunned: no actions or reactions. Nothing applied. Retain the command and roll; remove all source instances, then review and accept again.' };
  if (isRetry || code === 'retry_window_expired') return { phase: 'unresolved', message: `The server can no longer confirm this command (${codeLabel(code)}). It may have been applied; reconcile before acting again. It was not resubmitted.` };
  if (code === 'owner_reapproval_required') return { phase: 'reapproval', message: 'The class price or typed result changed. The owner must approve again; nothing was applied.' };
  if (['stale_actor_revision', 'insufficient_resources'].includes(code)) return { phase: 'retry', message: `Actors changed (${codeLabel(code)}). Nothing was applied; review and accept again.` };
  return { phase: 'refused', message: `Refused (${codeLabel(code)}); nothing was applied.` };
}
export function buildApproval({ support, tokens, sourceRef, targetRef, roomId, mapId, actionEpoch, baseCommitSequence, roll, approvalId }) {
  const source = exactActor(tokens, sourceRef, roomId, mapId);
  exactActor(tokens, targetRef, roomId, mapId);
  if (sourceRef.kind !== 'character') throw Error('The caster must be your exact primary character attachment.');
  if (!support?.supported || !support.payment?.affordable) throw Error(support?.payment?.reason || 'This spell cannot be paid right now.');
  if (!affordable(sourcePools(source), support.price)) throw Error('Insufficient AP or mana (temporary pools count first); nothing submitted.');
  if (!roll || roll.reading !== support.reading.reading) throw Error('Record one roll for this exact formula first.');
  if (!Number.isSafeInteger(baseCommitSequence) || baseCommitSequence < 0) throw Error('Current room snapshot required (commit sequence).');
  return Object.freeze(JSON.parse(JSON.stringify({ version: 1, roomId, approvalId, actionEpoch, baseCommitSequence, source: sourceRef, target: targetRef,
    spell: { definitionId: support.definitionId, definitionHash: support.definitionHash, name: support.name, kind: support.kind, damageTypes: support.damageTypes },
    roll, price: support.price, classPayment: support.payment.classPayment })));
}
export function planSpellCommand({ approval, contentHash, tokens, roomId, mapId, finalAmount, reason = '', adjudicated }) {
  if (adjudicated !== true) throw Error('GM must explicitly adjudicate legality, range, defense and mitigation.');
  if (!integer(finalAmount, 0, 100000)) throw Error('Enter a whole, nonnegative final amount.');
  if (typeof reason !== 'string' || reason.length > 2000 || (finalAmount !== approval.roll.total && !reason.trim())) throw Error('Explain the adjustment from the recorded total.');
  const source = exactActor(tokens, approval.source, roomId, mapId), target = exactActor(tokens, approval.target, roomId, mapId);
  const pools = sourcePools(source), payment = {};
  for (const pool of ['ap', 'mana']) if (approval.price[pool] > 0) payment[pool] = depleteTempFirst(pools[pool].current, pools[pool].temp, approval.price[pool], true);
  const targetValues = approval.target.kind === 'character' ? { current: target.character?.health?.current, temp: target.character?.tempHealth || 0, max: target.character?.health?.max }
    : { current: target.state?.currentHp, temp: target.state?.tempHealth || 0, max: target.state?.maxHp ?? target.stats?.maxHp };
  const hp = approval.spell.kind === 'damage' ? depleteTempFirst(targetValues.current, targetValues.temp, finalAmount)
    : { current: Math.min(targetValues.max, targetValues.current + finalAmount), temp: targetValues.temp };
  if (![hp.current, hp.temp].every(Number.isFinite)) throw Error('Target resources are unavailable; refresh the room snapshot.');
  const self = sameExactRef(approval.source, approval.target);
  if (isAuthored(approval.spell) && !self && !Object.keys(payment).length) payment.ap = depleteTempFirst(pools.ap.current, pools.ap.temp, 0, true);
  const classPayment = approval.classPayment ? { classPayment: { mode: 'spell', domain: approval.classPayment.domain, approvalHash: contentHash } } : {};
  const entries = [{ ref: approval.source, expectedRevision: source.state.actorContract.revision, finalResources: self ? { ...payment, hp } : payment, ...classPayment }];
  if (!self) entries.push({ ref: approval.target, expectedRevision: target.state.actorContract.revision, finalResources: { hp } });
  const names = { sourceName: source.character?.name || source.name || source.id, targetName: target.character?.name || target.state?.customName || target.name || target.id };
  return { entries, extra: { source: approval.source, target: approval.target, approval: { approvalId: approval.approvalId, contentHash },
    adjudication: { definitionId: approval.spell.definitionId, definitionVersionOrHash: approval.spell.definitionHash,
      chosenResult: JSON.stringify({ capability: isAuthored(approval.spell) ? AUTHORED : P9_CAPABILITY, approvalId: approval.approvalId, roll: approval.roll, kind: approval.spell.kind,
        damageTypes: approval.spell.damageTypes, spellName: approval.spell.name, ...names, gmConfirmed: true }),
      finalAmount, adjustmentReason: reason.trim() } } };
}
/** Parses an accepted P9 receipt for presentation; null for anything else. */
export function spellReceipt(result) {
  const receipt = result?.receipt, adjudication = receipt?.adjudication;
  if (!result?.success || receipt?.version !== 1 || !['owner-approval-gm', 'gm-creature-ability'].includes(receipt.authorization?.kind) || ![P9_CAPABILITY, AUTHORED].some(cap => String(adjudication?.definitionVersionOrHash || '').startsWith(`${cap}/`))) return null;
  try {
    const recorded = JSON.parse(adjudication.chosenResult);
    if (![P9_CAPABILITY, AUTHORED].includes(recorded.capability) || recorded.approvalId !== receipt.authorization.proposalId || !integer(adjudication.finalAmount, 0, 100000)) return null;
    const source = receipt.actors.find(actor => sameExactRef(actor.ref, receipt.source)), target = receipt.actors.find(actor => sameExactRef(actor.ref, receipt.target));
    if (!source || !target) return null;
    return { receipt, recorded, source, target, approvalId: receipt.authorization.proposalId,
      status: receipt.checkpointRevision === null ? 'live-only' : result.status === 'checkpoint-confirmed' ? 'checkpoint-confirmed' : 'accepted-live / checkpoint pending' };
  } catch (_) { return null; }
}
export function describeClassPublic(value) {
  if (!value) return '';
  if (value.type === 'elementalSpheres') return `${(value.spheres || []).join(', ') || 'no spheres'} (${value.current ?? value.spheres?.length}/12)`;
  if (value.type === 'musicalNotes' && Array.isArray(value.notes)) return MINSTREL_PITCHES.map((pitch, index) => `${pitch}×${value.notes[index]}`).join(' ');
  if (value.type === 'devotionGauge') return `Devotion ${value.current}/6${value.spentLevels !== undefined ? ` (spent ${value.spentLevels}, damage bank ${value.damage})` : ''}`;
  return `${value.current ?? '?'}/${value.max ?? '?'}`;
}
