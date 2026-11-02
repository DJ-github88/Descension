/** A7 companion codec/planner for the SAME installed registry. Legacy-only snapshots delegate to
 * the protected A1a implementation. Schema2 permits both compiler versions with identical custody,
 * limits, decision hashes, sequential versions and current-GM authority. No execution flag grants use. */
const legacy = require('./authoredSpellDefinitions');
const checkpoint = require('./roomCheckpoint');
const { CONDITION_CAPABILITY, EFFECT_CAPABILITY, EFFECT_EXPIRY_POLICIES, COUNTED_EXPIRY_POLICIES, CLASS_IDS, readFormula } = require('../shared/services/authoredAbility');
const { FORMULA_CAPABILITY, FORMULA_COMPILER, readScaledFormula } = require('../shared/services/authoredAbility');
const { validMovementFeet, validOccurrences } = require('../shared/services/sharedConditionProfile');
// M2A: counted expiry policies (explicit target-turn boundary count 2…10) add exactly one key; every other policy keeps the exact A10 key set.
const validEffectTiming = t => !!t && typeof t === 'object' && EFFECT_EXPIRY_POLICIES.includes(t.expiryPolicy) &&
  (COUNTED_EXPIRY_POLICIES.includes(t.expiryPolicy) ? exact(t, ['expiryPolicy', 'durationText', 'authoredDuration', 'gmNote', 'occurrences']) && validOccurrences(t.occurrences)
    : exact(t, ['expiryPolicy', 'durationText', 'authoredDuration', 'gmNote']));
const VERSION = 'p14-a7-condition-1';
const EFFECT_VERSION = 'p14-a10-effect-1';
const FORMULA_PAYMENT_COMPILER = 'p14-m4b-class-payment-1';
// Same damage vocabulary as the protected A1a compiler (not exported there; kept in parity here).
const DAMAGE_TYPES = ['arcane', 'sacred', 'blight', 'ember', 'rime', 'primal', 'storm', 'wyrd', 'slicing', 'stabbing', 'smashing'];
const PAYMENT_DOMAINS = Object.freeze({ arcanoneer: 'elementalSpheres', minstrel: 'musicalNotes', martyr: 'devotionGauge' });
const ELEMENTS = Object.freeze(['arcane', 'sacred', 'blight', 'ember', 'rime', 'primal', 'storm', 'wyrd']);
const PITCHES = Object.freeze(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']);
const clone = v => JSON.parse(JSON.stringify(v));
const hash = checkpoint.canonicalHash;
const equal = (a, b) => hash(a) === hash(b);
const uuid = v => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(v || '');
const text = (v, max) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
const int = (v, min, max) => Number.isSafeInteger(v) && v >= min && v <= max;
const exact = (o, fields) => o && Object.getPrototypeOf(o) === Object.prototype && Object.keys(o).sort().join('|') === fields.slice().sort().join('|');
const no = (code = 'INVALID_REGISTRY') => ({ ok: false, code });
// Reject lossy/non-JSON shapes before reading any user property, matching the protected compiler's
// ownership boundary. The room transport supplies plain JSON; codec/helper callers receive the same fence.
function snapshot(value, depth = 0) {
  if (depth > 16) throw Error('depth');
  if (value === null || typeof value === 'boolean' || typeof value === 'string' && Buffer.from(value).toString('utf8') === value || typeof value === 'number' && Number.isFinite(value)) return value;
  if (!value || typeof value !== 'object' || Object.getOwnPropertySymbols(value).length) throw Error('shape');
  const array = Array.isArray(value);
  if (Object.getPrototypeOf(value) !== (array ? Array.prototype : Object.prototype)) throw Error('prototype');
  const names = Object.getOwnPropertyNames(value), out = array ? [] : {};
  if (array && names.length !== value.length + 1) throw Error('array');
  for (const key of names) {
    if (array && key === 'length') continue;
    const d = Object.getOwnPropertyDescriptor(value, key);
    if (!d.enumerable || !Object.hasOwn(d, 'value') || ['__proto__', 'constructor', 'prototype'].includes(key) || /^__.*__$/.test(key)) throw Error('property');
    out[key] = snapshot(d.value, depth + 1);
  }
  if (array && out.length !== value.length) throw Error('sparse');
  return out;
}
// A10 companion: one exact bundle. Unknown/partial vocabulary refuses; it never executes a subset.
function validDirect(direct) {
  if (direct === null) return true;
  try { readFormula(direct?.formula); } catch (_) { return false; }
  if (direct.kind === 'healing') return exact(direct, ['kind', 'formula']);
  return direct.kind === 'damage' && exact(direct, ['kind', 'formula', 'damageTypes']) && Array.isArray(direct.damageTypes) && direct.damageTypes.length >= 1 &&
    direct.damageTypes.length <= 8 && direct.damageTypes.every(t => DAMAGE_TYPES.includes(t));
}
function validEffectCondition(c) {
  if (c?.kind === 'stunned') return exact(c, ['kind']);
  return c?.kind === 'movement' && exact(c, ['kind', 'feet', 'label']) && validMovementFeet(c.feet) && text(c.label, 60) && c.label === c.label.trim();
}
function compileEffect(d) {
  const canonical = checkpoint.canonicalize(d, 'definition');
  if (canonical.error || Buffer.byteLength(JSON.stringify(d)) > 16384 || !equal(d, canonical.value)) return no('INVALID_DEFINITION');
  if (!exact(d, ['schemaVersion', 'capability', 'scope', 'definitionId', 'definitionVersion', 'name', 'description', 'binding', 'spellType', 'castTimeType', 'targeting', 'resourceCost', 'effects', 'timing']) ||
      d.schemaVersion !== 3 || !exact(d.scope, ['roomId']) || !text(d.scope.roomId, 200) || !uuid(d.definitionId) || !int(d.definitionVersion, 1, 1000000) ||
      !text(d.name, 120) || typeof d.description !== 'string' || d.description.length > 4000 ||
      !exact(d.binding, ['rulesetId', 'rulesetVersion', 'classId']) || d.binding.rulesetId !== 'prism' || d.binding.rulesetVersion !== 'cr-a1a-pilot-1' || !CLASS_IDS.includes(d.binding.classId) ||
      d.spellType !== 'ACTION' || d.castTimeType !== 'IMMEDIATE' ||
      !exact(d.targeting, ['kind', 'maxTargets', 'rangeFeet', 'restriction']) || d.targeting.kind !== 'single' || d.targeting.maxTargets !== 1 || !int(d.targeting.rangeFeet, 1, 300) || !['any', 'ally', 'enemy'].includes(d.targeting.restriction) ||
      !exact(d.resourceCost, ['actionPoints', 'mana']) || !int(d.resourceCost.actionPoints, 0, 20) || !int(d.resourceCost.mana, 0, 10000) ||
      !exact(d.effects, ['direct', 'condition']) || !validDirect(d.effects.direct) || !validEffectCondition(d.effects.condition) ||
      !validEffectTiming(d.timing) ||
      !text(d.timing.durationText, 300) || !text(d.timing.gmNote, 1000) ||
      ![null, '{}', '{"durationType":"instant"}'].includes(d.timing.authoredDuration === null ? null : JSON.stringify(d.timing.authoredDuration))) return no('INVALID_DEFINITION');
  const canonicalDefinition = canonical.value;
  const definitionHash = checkpoint.sha256Hex('mythrill:authored-effect:v1\n' + checkpoint.stableStringify(canonicalDefinition));
  const definitionRef = { roomId: d.scope.roomId, definitionId: d.definitionId, definitionVersion: d.definitionVersion, definitionHash };
  return { ok: true, canonicalDefinition, definitionHash, descriptor: { schemaVersion: 3, capabilityId: EFFECT_CAPABILITY, compilerVersion: EFFECT_VERSION,
    definitionRef, binding: clone(d.binding), price: { ap: d.resourceCost.actionPoints, mana: d.resourceCost.mana }, targeting: clone(d.targeting), effects: clone(d.effects), timing: clone(d.timing), executionEnabled: false } };
}
function validClassPayment(payment, classId) {
  const domain = PAYMENT_DOMAINS[classId];
  if (!domain || !exact(payment, ['domain', 'price']) || payment.domain !== domain) return false;
  const price = payment.price;
  if (domain === 'devotionGauge') return exact(price, ['cost', 'gain', 'required']) &&
    [price.cost, price.gain, price.required].every(value => int(value, 0, 6));
  if (!exact(price, ['costs', 'gains']) || !Array.isArray(price.costs) || !Array.isArray(price.gains) ||
    price.costs.length > 35 || price.gains.length > 35) return false;
  const vocabulary = domain === 'elementalSpheres' ? ELEMENTS : PITCHES;
  return price.costs.concat(price.gains).every(value => vocabulary.includes(value)) &&
    !(domain === 'musicalNotes' && price.costs.length > 0 && price.gains.length > 0);
}
function validCatalogueSource(source, classId) {
  return exact(source, ['spellId', 'classId', 'recordHash']) && text(source.spellId, 120) &&
    source.classId === classId && /^[0-9a-f]{64}$/.test(source.recordHash || '');
}
function compileFormula(d) {
  if (d.schemaVersion !== 4 || d.capability !== FORMULA_CAPABILITY) return no('INVALID_DEFINITION');
  const extended = d.classPayment !== undefined || d.targetRoute !== undefined || d.catalogueSource !== undefined;
  if (extended) {
    if (d.classPayment !== undefined && (d.catalogueSource === undefined || !validClassPayment(d.classPayment, d.binding?.classId))) return no('UNSUPPORTED_SHAPE');
    if (d.catalogueSource !== undefined && !validCatalogueSource(d.catalogueSource, d.binding?.classId)) return no('UNSUPPORTED_SHAPE');
    if (d.targetRoute !== undefined && (d.targetRoute !== 'primary-pc-healing' || d.effect?.kind !== 'healing' || d.targeting?.restriction !== 'ally')) return no('UNSUPPORTED_SHAPE');
  }
  // Reuse A1's whole-definition fences; only formula syntax and capability/version differ.
  const projection = clone(d); delete projection.capability;
  delete projection.classPayment; delete projection.targetRoute; delete projection.catalogueSource;
  projection.schemaVersion = 1;
  if (!projection.effect) return no('INVALID_DEFINITION');
  projection.effect.formula = '1d2';
  const base = legacy.compileDefinition(projection);
  const reading = readScaledFormula(d.effect.formula, Object.fromEntries(CLASS_ATTRIBUTES.map(name => [name, 10])));
  if (!base.ok || !reading.supported) return no('UNSUPPORTED_SHAPE');
  const canonicalDefinition = checkpoint.canonicalize(d, 'definition').value;
  const definitionHash = checkpoint.sha256Hex('mythrill:authored-immediate:v2\n' + checkpoint.stableStringify(canonicalDefinition));
  const definitionRef = Object.assign({}, base.descriptor.definitionRef, { definitionHash });
  const descriptor = Object.assign({}, base.descriptor, { schemaVersion: 4, capabilityId: FORMULA_CAPABILITY,
    compilerVersion: extended ? FORMULA_PAYMENT_COMPILER : FORMULA_COMPILER, definitionRef,
    effect: Object.assign({}, clone(d.effect), { dice: reading.dice, attributes: require('../shared/services/classEffect').formulaAttributes(d.effect.formula) }) });
  if (d.classPayment !== undefined) descriptor.classPayment = clone(d.classPayment);
  if (d.targetRoute !== undefined) descriptor.targetRoute = d.targetRoute;
  if (d.catalogueSource !== undefined) descriptor.catalogueSource = clone(d.catalogueSource);
  return { ok: true, canonicalDefinition, definitionHash, descriptor };
}
const CLASS_ATTRIBUTES = require('../shared/services/classEffect').ATTRIBUTES;
function compileDefinition(d) {
  try { d = snapshot(d); } catch (_) { return no('INVALID_DEFINITION'); }
  if (d?.capability === FORMULA_CAPABILITY) return compileFormula(d);
  if (d?.capability === EFFECT_CAPABILITY) return compileEffect(d);
  if (d?.capability !== CONDITION_CAPABILITY) return legacy.compileDefinition(d);
  const canonical = checkpoint.canonicalize(d, 'definition');
  if (canonical.error || Buffer.byteLength(JSON.stringify(d)) > 16384 || !equal(d, canonical.value)) return no('INVALID_DEFINITION');
  if (!exact(d, ['schemaVersion', 'capability', 'scope', 'definitionId', 'definitionVersion', 'name', 'description', 'binding', 'spellType', 'castTimeType', 'targeting', 'resourceCost', 'effect', 'timing']) ||
      d.schemaVersion !== 2 || !exact(d.scope, ['roomId']) || !text(d.scope.roomId, 200) || !uuid(d.definitionId) || !int(d.definitionVersion, 1, 1000000) ||
      !text(d.name, 120) || typeof d.description !== 'string' || d.description.length > 4000 ||
      !equal(d.binding, { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'arcanoneer' }) || d.spellType !== 'ACTION' || d.castTimeType !== 'IMMEDIATE' ||
      !exact(d.targeting, ['kind', 'maxTargets', 'rangeFeet', 'restriction']) || d.targeting.kind !== 'single' || d.targeting.maxTargets !== 1 || !int(d.targeting.rangeFeet, 1, 300) || !['any', 'ally', 'enemy'].includes(d.targeting.restriction) ||
      !exact(d.resourceCost, ['actionPoints', 'mana']) || !int(d.resourceCost.actionPoints, 0, 20) || !int(d.resourceCost.mana, 0, 10000) || !equal(d.effect, { kind: 'condition', conditionKey: 'stunned' }) ||
      !exact(d.timing, ['expiryPolicy', 'durationText', 'authoredDuration', 'gmNote']) || d.timing.expiryPolicy !== 'gm-manual' || !text(d.timing.durationText, 300) || !text(d.timing.gmNote, 1000)) return no('INVALID_DEFINITION');
  const canonicalDefinition = canonical.value;
  const definitionHash = checkpoint.sha256Hex('mythrill:authored-condition:v1\n' + checkpoint.stableStringify(canonicalDefinition));
  const definitionRef = { roomId: d.scope.roomId, definitionId: d.definitionId, definitionVersion: d.definitionVersion, definitionHash };
  return { ok: true, canonicalDefinition, definitionHash, descriptor: { schemaVersion: 2, capabilityId: CONDITION_CAPABILITY, compilerVersion: VERSION,
    definitionRef, binding: clone(d.binding), price: { ap: d.resourceCost.actionPoints, mana: d.resourceCost.mana }, targeting: clone(d.targeting), effect: clone(d.effect), timing: clone(d.timing), executionEnabled: false } };
}
function validateRegistrySnapshot(r) {
  try { r = snapshot(r); } catch (_) { return no(); }
  if (r?.schemaVersion !== 2) return legacy.decodeRegistry(JSON.stringify(r));
  if (!exact(r, ['schemaVersion', 'roomId', 'revision', 'definitions', 'decisions']) || !text(r.roomId, 200) || !Array.isArray(r.definitions) || !Array.isArray(r.decisions) || r.revision !== r.decisions.length) return no();
  if (r.definitions.length > 128 || r.decisions.length > 256 || Buffer.byteLength(JSON.stringify(r)) > 262144) return no('CAPACITY');
  const entries = new Map(), requests = new Set(), admitted = new Set(), revoked = new Set(), versions = new Map();
  for (const e of r.definitions) {
    if (!exact(e, ['definitionRef', 'canonicalDefinition', 'compilerVersion', 'descriptor'])) return no();
    const c = compileDefinition(e.canonicalDefinition), ref = c.descriptor?.definitionRef;
    if (!c.ok || ref.roomId !== r.roomId || !equal(e.definitionRef, ref) || e.compilerVersion !== c.descriptor.compilerVersion || !equal(e.descriptor, c.descriptor)) return no();
    const key = `${ref.definitionId}:${ref.definitionVersion}`;
    if (entries.has(key)) return no();
    entries.set(key, e);
  }
  for (let i = 0; i < r.decisions.length; i++) {
    const d = r.decisions[i], key = `${d.definitionRef?.definitionId}:${d.definitionRef?.definitionVersion}`, e = entries.get(key);
    if (!exact(d, ['requestId', 'requestHash', 'byUid', 'sequence', 'action', 'definitionRef']) || !uuid(d.requestId) || requests.has(d.requestId) || !text(d.byUid, 200) || d.sequence !== i + 1 || !e || !equal(e.definitionRef, d.definitionRef)) return no();
    const request = { roomId: r.roomId, requestId: d.requestId, expectedRegistryRevision: i };
    if (d.action === 'admit') {
      if (admitted.has(key) || e.definitionRef.definitionVersion !== (versions.get(e.definitionRef.definitionId) || 1)) return no();
      versions.set(e.definitionRef.definitionId, e.definitionRef.definitionVersion + 1); admitted.add(key);
      Object.assign(request, { definition: e.canonicalDefinition, expectedDefinitionHash: e.definitionRef.definitionHash });
    } else if (d.action === 'revoke' && admitted.has(key) && !revoked.has(key)) { revoked.add(key); request.definitionRef = e.definitionRef; }
    else return no();
    if (hash(request) !== d.requestHash) return no();
    requests.add(d.requestId);
  }
  if (admitted.size !== entries.size) return no();
  return { ok: true, registry: clone(r) };
}
function decodeRegistry(json) { try { return validateRegistrySnapshot(JSON.parse(json)); } catch (_) { return no(); } }
function createDefinitionRegistry({ authorize }) {
  async function plan(operation, input, request) {
    try { input = snapshot(input); request = snapshot(request); } catch (_) { return no('INVALID_DEFINITION'); }
    if (input.schemaVersion !== 2 && ![CONDITION_CAPABILITY, EFFECT_CAPABILITY, FORMULA_CAPABILITY].includes(request.definition?.capability)) return legacy.createDefinitionRegistry({ authorize })[operation === 'admit' ? 'planAdmit' : 'planRevoke'](input, request);
    const valid = validateRegistrySnapshot(input);
    if (!valid.ok) return valid;
    const r = clone(valid.registry);
    if (!exact(request, operation === 'admit' ? ['roomId', 'requestId', 'expectedRegistryRevision', 'definition', 'expectedDefinitionHash'] : ['roomId', 'requestId', 'expectedRegistryRevision', 'definitionRef']) || !uuid(request.requestId) || !int(request.expectedRegistryRevision, 0, Number.MAX_SAFE_INTEGER)) return no('INVALID_DEFINITION');
    let a;
    try { a = await authorize({ operation, roomId: r.roomId }); } catch (_) { return no('AUTHORITY_UNAVAILABLE'); }
    if (!a?.ok || a.roomId !== r.roomId || !text(a.uid, 200) || a.uid !== a.gmUid || a.principalBound !== true || a.authorityCurrent !== true || a.rulesetId !== 'prism' || a.rulesetVersion !== 'cr-a1a-pilot-1') return no('FORBIDDEN');
    if (request.roomId !== r.roomId) return no('SCOPE_MISMATCH');
    const requestHash = hash(request), old = r.decisions.find(d => d.requestId === request.requestId);
    if (old) return old.requestHash === requestHash && old.byUid === a.uid ? { ok: true, kind: 'replay', definitionRef: old.definitionRef } : no('REQUEST_ID_CONFLICT');
    if (request.expectedRegistryRevision !== r.revision) return no('REVISION_CONFLICT');
    let definitionRef;
    if (operation === 'admit') {
      const c = compileDefinition(request.definition);
      if (!c.ok) return c;
      definitionRef = c.descriptor.definitionRef;
      if (definitionRef.roomId !== r.roomId || c.definitionHash !== request.expectedDefinitionHash) return no('HASH_MISMATCH');
      const version = 1 + Math.max(0, ...r.definitions.filter(e => e.definitionRef.definitionId === definitionRef.definitionId).map(e => e.definitionRef.definitionVersion));
      if (version !== definitionRef.definitionVersion) return no('VERSION_CONFLICT');
      r.definitions.push({ definitionRef, canonicalDefinition: c.canonicalDefinition, compilerVersion: c.descriptor.compilerVersion, descriptor: c.descriptor });
    } else {
      const e = r.definitions.find(e => equal(e.definitionRef, request.definitionRef));
      if (!e) return no('DEFINITION_NOT_FOUND');
      definitionRef = e.definitionRef;
      if (r.decisions.some(d => d.action === 'revoke' && equal(d.definitionRef, definitionRef))) return no('DEFINITION_REVOKED');
    }
    r.schemaVersion = 2; r.revision++;
    r.decisions.push({ requestId: request.requestId, requestHash, byUid: a.uid, sequence: r.revision, action: operation, definitionRef });
    const checked = validateRegistrySnapshot(r);
    return checked.ok ? { ok: true, kind: 'transition', nextRegistry: checked.registry, definitionRef } : checked;
  }
  return { planAdmit: (r, q) => plan('admit', r, q), planRevoke: (r, q) => plan('revoke', r, q) };
}
module.exports = { ...legacy, compileDefinition, validateRegistrySnapshot, decodeRegistry, encodeRegistry: r => { const v = validateRegistrySnapshot(r); return v.ok ? { ok: true, json: checkpoint.stableStringify(v.registry) } : v; }, createDefinitionRegistry };
