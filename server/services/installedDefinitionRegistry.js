/** A7 companion codec/planner for the SAME installed registry. Legacy-only snapshots delegate to
 * the protected A1a implementation. Schema2 permits both compiler versions with identical custody,
 * limits, decision hashes, sequential versions and current-GM authority. No execution flag grants use. */
const legacy = require('./authoredSpellDefinitions');
const checkpoint = require('./roomCheckpoint');
const { CONDITION_CAPABILITY } = require('../shared/services/authoredAbility');
const VERSION = 'p14-a7-condition-1';
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
function compileDefinition(d) {
  try { d = snapshot(d); } catch (_) { return no('INVALID_DEFINITION'); }
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
    if (input.schemaVersion !== 2 && request.definition?.capability !== CONDITION_CAPABILITY) return legacy.createDefinitionRegistry({ authorize })[operation === 'admit' ? 'planAdmit' : 'planRevoke'](input, request);
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
