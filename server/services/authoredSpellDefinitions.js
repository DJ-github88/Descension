const { canonicalize, stableStringify, sha256Hex, canonicalHash } = require('./roomCheckpoint');

const COMPILER_VERSION = 'cr-a1a-1';
const CAPABILITY_ID = 'authored-immediate:v1';
const DEFINITION_HASH_PREFIX = 'mythrill:authored-definition:v1\n';
const REGISTRY_SCHEMA_VERSION = 1;

const MAX_STRUCTURE_DEPTH = 8;
const MAX_DEFINITION_BYTES = 16 * 1024;
const MAX_SNAPSHOT_BYTES = 256 * 1024;
const MAX_REGISTRY_DEFINITIONS = 128;
const MAX_REGISTRY_DECISIONS = 256;
const MAX_DEFINITION_VERSION = 1000000;
const MAX_NAME_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 4000;
const MAX_ROOM_ID_LENGTH = 200;
const MAX_UID_LENGTH = 200;
const MAX_ACTION_POINTS = 20;
const MAX_MANA = 10000;
const MAX_RANGE_FEET = 300;
const MAX_DICE_COUNT = 50;
const MIN_DICE_SIDES = 2;
const MAX_DICE_SIDES = 100;
const MAX_FORMULA_CONSTANT = 10000;

const RULESET_ID = 'prism';
const RULESET_VERSION = 'cr-a1a-pilot-1';

const CLASS_IDS = new Set([
  'arcanoneer', 'berserker', 'shaper', 'harbinger', 'chronarch', 'inquisitor', 'revenant',
  'false_prophet', 'gambit', 'apex', 'animist', 'lunarch', 'martyr', 'minstrel', 'plaguebringer',
  'pyrofiend', 'spellguard', 'toxicologist', 'warden', 'augur', 'crusader'
]);

const DAMAGE_TYPES = new Set([
  'arcane', 'sacred', 'blight', 'ember', 'rime', 'primal', 'storm', 'wyrd',
  'slicing', 'stabbing', 'smashing'
]);

const TARGET_RESTRICTIONS = new Set(['self', 'ally', 'enemy', 'any']);

const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const HASH_PATTERN = /^[0-9a-f]{64}$/;
const FORMULA_PATTERN = /^([1-9][0-9]?)d([1-9][0-9]{0,2})(?:([+-])([1-9][0-9]{0,4}))?$/;
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const UNSAFE_KEY_PATTERN = /^__.*__$/;

const DEFINITION_KEYS = [
  'schemaVersion', 'scope', 'definitionId', 'definitionVersion', 'name', 'description',
  'binding', 'spellType', 'castTimeType', 'targeting', 'resourceCost', 'effect'
];
const SCOPE_KEYS = ['roomId'];
const BINDING_KEYS = ['rulesetId', 'rulesetVersion', 'classId'];
const TARGETING_KEYS = ['kind', 'maxTargets', 'rangeFeet', 'restriction'];
const RESOURCE_COST_KEYS = ['actionPoints', 'mana'];
const DAMAGE_EFFECT_KEYS = ['kind', 'formula', 'damageTypes'];
const HEALING_EFFECT_KEYS = ['kind', 'formula'];
const DEFINITION_REF_KEYS = ['roomId', 'definitionId', 'definitionVersion', 'definitionHash'];
const REGISTRY_KEYS = ['schemaVersion', 'roomId', 'revision', 'definitions', 'decisions'];
const REGISTRY_DEFINITION_KEYS = ['definitionRef', 'canonicalDefinition', 'compilerVersion', 'descriptor'];
const DECISION_KEYS = ['requestId', 'requestHash', 'byUid', 'sequence', 'action', 'definitionRef'];
const ADMIT_REQUEST_KEYS = ['roomId', 'requestId', 'expectedRegistryRevision', 'definition', 'expectedDefinitionHash'];
const REVOKE_REQUEST_KEYS = ['roomId', 'requestId', 'expectedRegistryRevision', 'definitionRef'];
const DESCRIBE_PARAM_KEYS = ['definitionRef', 'expectedBinding'];

const fail = (code, path) => (
  path === undefined ? Object.freeze({ ok: false, code }) : Object.freeze({ ok: false, code, path })
);

const utf8Bytes = (value) => Buffer.byteLength(String(value), 'utf8');

const codePointLength = (value) => Array.from(value).length;

const isWellFormedString = (value) => Buffer.from(value, 'utf8').toString('utf8') === value;

const isPlainObject = (value) => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) { return false; }
  return Object.getPrototypeOf(value) === Object.prototype;
};

const hasExactKeys = (value, keys) => {
  const names = Object.keys(value);
  return names.length === keys.length && keys.every((key) => Object.prototype.hasOwnProperty.call(value, key));
};

const isRoomId = (value) => (
  typeof value === 'string' && value.length > 0 && codePointLength(value) <= MAX_ROOM_ID_LENGTH && isWellFormedString(value)
);

const isUid = (value) => (
  typeof value === 'string' && value.length > 0 && codePointLength(value) <= MAX_UID_LENGTH && isWellFormedString(value)
);

const isSafeKey = (key) => !UNSAFE_KEYS.has(key) && !UNSAFE_KEY_PATTERN.test(key);

const deepFreeze = (value) => {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.keys(value)) { deepFreeze(value[key]); }
  }
  return value;
};

const strictCopy = (value, path, depth, code) => {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') {
    if (typeof value === 'string' && !isWellFormedString(value)) { return fail(code, path); }
    return { ok: true, value };
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) { return fail(code, path); }
    return { ok: true, value };
  }

  if (typeof value === 'undefined' || typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint') {
    return fail(code, path);
  }

  if (depth > MAX_STRUCTURE_DEPTH) { return fail(code, path); }

  if (Array.isArray(value)) {
    const names = Object.getOwnPropertyNames(value);
    if (names.length !== value.length + 1) { return fail(code, path); }
    const output = [];
    for (let index = 0; index < value.length; index += 1) {
      const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
      if (!descriptor || !('value' in descriptor) || !descriptor.enumerable) {
        return fail(code, `${path}[${index}]`);
      }
      const child = strictCopy(descriptor.value, `${path}[${index}]`, depth + 1, code);
      if (!child.ok) { return child; }
      output.push(child.value);
    }
    return { ok: true, value: output };
  }

  if (!isPlainObject(value)) { return fail(code, path); }

  const output = {};
  for (const key of Object.getOwnPropertyNames(value)) {
    if (!isSafeKey(key)) { return fail(code, `${path}.${key}`); }
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !('value' in descriptor) || !descriptor.enumerable) {
      return fail(code, `${path}.${key}`);
    }
    const child = strictCopy(descriptor.value, `${path}.${key}`, depth + 1, code);
    if (!child.ok) { return child; }
    output[key] = child.value;
  }
  return { ok: true, value: output };
};

const parseFormula = (formula) => {
  if (typeof formula !== 'string') { return fail('INVALID_DEFINITION', 'effect.formula'); }
  const match = FORMULA_PATTERN.exec(formula);
  if (!match) { return fail('UNSUPPORTED_SHAPE', 'effect.formula'); }
  const count = Number(match[1]);
  const sides = Number(match[2]);
  if (count < 1 || count > MAX_DICE_COUNT) { return fail('UNSUPPORTED_SHAPE', 'effect.formula'); }
  if (sides < MIN_DICE_SIDES || sides > MAX_DICE_SIDES) { return fail('UNSUPPORTED_SHAPE', 'effect.formula'); }
  let constant = 0;
  if (match[3]) {
    const magnitude = Number(match[4]);
    if (magnitude < 1 || magnitude > MAX_FORMULA_CONSTANT) { return fail('UNSUPPORTED_SHAPE', 'effect.formula'); }
    constant = match[3] === '-' ? -magnitude : magnitude;
  }
  return { ok: true, count, sides, constant };
};

const validateDefinition = (input) => {
  const copied = strictCopy(input, 'definition', 1, 'INVALID_DEFINITION');
  if (!copied.ok) { return copied; }
  const dto = copied.value;
  if (!isPlainObject(dto) || !hasExactKeys(dto, DEFINITION_KEYS)) { return fail('INVALID_DEFINITION'); }
  if (dto.schemaVersion !== REGISTRY_SCHEMA_VERSION) { return fail('INVALID_DEFINITION', 'schemaVersion'); }

  const scope = dto.scope;
  if (!isPlainObject(scope) || !hasExactKeys(scope, SCOPE_KEYS)) { return fail('INVALID_DEFINITION', 'scope'); }
  if (!isRoomId(scope.roomId)) { return fail('INVALID_DEFINITION', 'scope.roomId'); }

  if (typeof dto.definitionId !== 'string' || !UUID_V4_PATTERN.test(dto.definitionId)) {
    return fail('INVALID_DEFINITION', 'definitionId');
  }
  if (!Number.isSafeInteger(dto.definitionVersion) || dto.definitionVersion < 1 || dto.definitionVersion > MAX_DEFINITION_VERSION) {
    return fail('INVALID_DEFINITION', 'definitionVersion');
  }

  if (typeof dto.name !== 'string' || codePointLength(dto.name) < 1 || codePointLength(dto.name) > MAX_NAME_LENGTH) {
    return fail('INVALID_DEFINITION', 'name');
  }
  if (typeof dto.description !== 'string' || codePointLength(dto.description) > MAX_DESCRIPTION_LENGTH) {
    return fail('INVALID_DEFINITION', 'description');
  }

  const binding = dto.binding;
  if (!isPlainObject(binding) || !hasExactKeys(binding, BINDING_KEYS)) { return fail('INVALID_DEFINITION', 'binding'); }
  if (typeof binding.rulesetId !== 'string' || typeof binding.rulesetVersion !== 'string' || typeof binding.classId !== 'string') {
    return fail('INVALID_DEFINITION', 'binding');
  }
  if (binding.rulesetId !== RULESET_ID || binding.rulesetVersion !== RULESET_VERSION) {
    return fail('UNSUPPORTED_BINDING', 'binding');
  }
  if (!CLASS_IDS.has(binding.classId)) { return fail('UNSUPPORTED_BINDING', 'binding.classId'); }

  if (typeof dto.spellType !== 'string') { return fail('INVALID_DEFINITION', 'spellType'); }
  if (dto.spellType !== 'ACTION') { return fail('UNSUPPORTED_SHAPE', 'spellType'); }
  if (typeof dto.castTimeType !== 'string') { return fail('INVALID_DEFINITION', 'castTimeType'); }
  if (dto.castTimeType !== 'IMMEDIATE') { return fail('UNSUPPORTED_SHAPE', 'castTimeType'); }

  const targeting = dto.targeting;
  if (!isPlainObject(targeting) || !hasExactKeys(targeting, TARGETING_KEYS)) { return fail('INVALID_DEFINITION', 'targeting'); }
  if (typeof targeting.kind !== 'string') { return fail('INVALID_DEFINITION', 'targeting.kind'); }
  if (targeting.kind !== 'single') { return fail('UNSUPPORTED_SHAPE', 'targeting.kind'); }
  if (typeof targeting.maxTargets !== 'number') { return fail('INVALID_DEFINITION', 'targeting.maxTargets'); }
  if (targeting.maxTargets !== 1) { return fail('UNSUPPORTED_SHAPE', 'targeting.maxTargets'); }
  if (!Number.isSafeInteger(targeting.rangeFeet) || targeting.rangeFeet < 0 || targeting.rangeFeet > MAX_RANGE_FEET) {
    return fail('INVALID_DEFINITION', 'targeting.rangeFeet');
  }
  if (typeof targeting.restriction !== 'string') { return fail('INVALID_DEFINITION', 'targeting.restriction'); }
  if (!TARGET_RESTRICTIONS.has(targeting.restriction)) { return fail('UNSUPPORTED_SHAPE', 'targeting.restriction'); }
  if (targeting.restriction === 'self' && targeting.rangeFeet !== 0) {
    return fail('UNSUPPORTED_SHAPE', 'targeting.rangeFeet');
  }

  const resourceCost = dto.resourceCost;
  if (!isPlainObject(resourceCost) || !hasExactKeys(resourceCost, RESOURCE_COST_KEYS)) {
    return fail('INVALID_DEFINITION', 'resourceCost');
  }
  if (!Number.isSafeInteger(resourceCost.actionPoints) || resourceCost.actionPoints < 0 || resourceCost.actionPoints > MAX_ACTION_POINTS) {
    return fail('INVALID_DEFINITION', 'resourceCost.actionPoints');
  }
  if (!Number.isSafeInteger(resourceCost.mana) || resourceCost.mana < 0 || resourceCost.mana > MAX_MANA) {
    return fail('INVALID_DEFINITION', 'resourceCost.mana');
  }

  const effect = dto.effect;
  if (!isPlainObject(effect) || typeof effect.kind !== 'string') { return fail('INVALID_DEFINITION', 'effect'); }
  let parsed;
  let damageType = null;
  if (effect.kind === 'damage') {
    if (!hasExactKeys(effect, DAMAGE_EFFECT_KEYS)) { return fail('INVALID_DEFINITION', 'effect'); }
    parsed = parseFormula(effect.formula);
    if (!parsed.ok) { return parsed; }
    if (!Array.isArray(effect.damageTypes) || effect.damageTypes.length !== 1 || typeof effect.damageTypes[0] !== 'string') {
      return fail('INVALID_DEFINITION', 'effect.damageTypes');
    }
    if (!DAMAGE_TYPES.has(effect.damageTypes[0])) { return fail('UNSUPPORTED_SHAPE', 'effect.damageTypes'); }
    damageType = effect.damageTypes[0];
  } else if (effect.kind === 'healing') {
    if (!hasExactKeys(effect, HEALING_EFFECT_KEYS)) { return fail('INVALID_DEFINITION', 'effect'); }
    parsed = parseFormula(effect.formula);
    if (!parsed.ok) { return parsed; }
  } else {
    return fail('UNSUPPORTED_SHAPE', 'effect.kind');
  }

  const definition = {
    schemaVersion: REGISTRY_SCHEMA_VERSION,
    scope: { roomId: scope.roomId },
    definitionId: dto.definitionId,
    definitionVersion: dto.definitionVersion,
    name: dto.name,
    description: dto.description,
    binding: { rulesetId: binding.rulesetId, rulesetVersion: binding.rulesetVersion, classId: binding.classId },
    spellType: dto.spellType,
    castTimeType: dto.castTimeType,
    targeting: {
      kind: targeting.kind,
      maxTargets: targeting.maxTargets,
      rangeFeet: targeting.rangeFeet,
      restriction: targeting.restriction
    },
    resourceCost: { actionPoints: resourceCost.actionPoints, mana: resourceCost.mana },
    effect: effect.kind === 'damage'
      ? { kind: effect.kind, formula: effect.formula, damageTypes: [damageType] }
      : { kind: effect.kind, formula: effect.formula }
  };

  return { ok: true, definition, parsed: { count: parsed.count, sides: parsed.sides, constant: parsed.constant } };
};

const buildDescriptor = (definitionRef, definition, parsed) => ({
  schemaVersion: REGISTRY_SCHEMA_VERSION,
  capabilityId: CAPABILITY_ID,
  compilerVersion: COMPILER_VERSION,
  definitionRef: {
    roomId: definitionRef.roomId,
    definitionId: definitionRef.definitionId,
    definitionVersion: definitionRef.definitionVersion,
    definitionHash: definitionRef.definitionHash
  },
  binding: {
    rulesetId: definition.binding.rulesetId,
    rulesetVersion: definition.binding.rulesetVersion,
    classId: definition.binding.classId
  },
  price: { ap: definition.resourceCost.actionPoints, mana: definition.resourceCost.mana },
  targeting: {
    kind: definition.targeting.kind,
    maxTargets: definition.targeting.maxTargets,
    rangeFeet: definition.targeting.rangeFeet,
    restriction: definition.targeting.restriction
  },
  effect: {
    kind: definition.effect.kind,
    dice: [{ count: parsed.count, sides: parsed.sides }],
    constant: parsed.constant,
    damageTypes: definition.effect.kind === 'damage' ? [definition.effect.damageTypes[0]] : []
  },
  executionEnabled: false
});

const compileDefinition = (input) => {
  const validated = validateDefinition(input);
  if (!validated.ok) { return validated; }

  const canonicalResult = canonicalize(validated.definition, 'definition');
  if (canonicalResult.error) { return fail('INVALID_DEFINITION'); }
  const canonicalDefinition = canonicalResult.value;
  const canonicalJson = stableStringify(canonicalDefinition);
  if (utf8Bytes(canonicalJson) > MAX_DEFINITION_BYTES) { return fail('INVALID_DEFINITION'); }

  const definitionHash = sha256Hex(DEFINITION_HASH_PREFIX + canonicalJson);
  const definitionRef = {
    roomId: canonicalDefinition.scope.roomId,
    definitionId: canonicalDefinition.definitionId,
    definitionVersion: canonicalDefinition.definitionVersion,
    definitionHash
  };
  const descriptor = buildDescriptor(definitionRef, canonicalDefinition, validated.parsed);

  return deepFreeze({ ok: true, canonicalDefinition, definitionHash, descriptor });
};

const validateDefinitionRefShape = (ref, code) => {
  if (!isPlainObject(ref) || !hasExactKeys(ref, DEFINITION_REF_KEYS)) { return fail(code); }
  if (!isRoomId(ref.roomId)) { return fail(code); }
  if (typeof ref.definitionId !== 'string' || !UUID_V4_PATTERN.test(ref.definitionId)) { return fail(code); }
  if (!Number.isSafeInteger(ref.definitionVersion) || ref.definitionVersion < 1 || ref.definitionVersion > MAX_DEFINITION_VERSION) {
    return fail(code);
  }
  if (typeof ref.definitionHash !== 'string' || !HASH_PATTERN.test(ref.definitionHash)) { return fail(code); }
  return { ok: true, value: ref };
};

const sameRef = (left, right) => (
  left.roomId === right.roomId
  && left.definitionId === right.definitionId
  && left.definitionVersion === right.definitionVersion
  && left.definitionHash === right.definitionHash
);

const validateRegistrySnapshot = (input) => {
  const copied = strictCopy(input, 'registry', 1, 'INVALID_REGISTRY');
  if (!copied.ok) { return copied; }
  const snapshot = copied.value;
  if (!isPlainObject(snapshot) || !hasExactKeys(snapshot, REGISTRY_KEYS)) { return fail('INVALID_REGISTRY'); }
  if (!Number.isSafeInteger(snapshot.schemaVersion)) { return fail('INVALID_REGISTRY'); }
  if (snapshot.schemaVersion !== REGISTRY_SCHEMA_VERSION) { return fail('UNSUPPORTED_REGISTRY_VERSION'); }
  if (!isRoomId(snapshot.roomId)) { return fail('INVALID_REGISTRY'); }
  if (!Number.isSafeInteger(snapshot.revision) || snapshot.revision < 0) { return fail('INVALID_REGISTRY'); }
  if (!Array.isArray(snapshot.definitions)) { return fail('INVALID_REGISTRY'); }
  if (snapshot.definitions.length > MAX_REGISTRY_DEFINITIONS) { return fail('CAPACITY'); }
  if (!Array.isArray(snapshot.decisions)) { return fail('INVALID_REGISTRY'); }
  if (snapshot.decisions.length > MAX_REGISTRY_DECISIONS) { return fail('CAPACITY'); }
  if (snapshot.revision !== snapshot.decisions.length) { return fail('INVALID_REGISTRY'); }

  const entries = [];
  const entryKeys = new Set();
  for (const rawEntry of snapshot.definitions) {
    if (!isPlainObject(rawEntry) || !hasExactKeys(rawEntry, REGISTRY_DEFINITION_KEYS)) { return fail('INVALID_REGISTRY'); }
    if (rawEntry.compilerVersion !== COMPILER_VERSION) { return fail('UNSUPPORTED_REGISTRY_VERSION'); }
    const refShape = validateDefinitionRefShape(rawEntry.definitionRef, 'INVALID_REGISTRY');
    if (!refShape.ok) { return refShape; }
    const ref = refShape.value;
    const compiled = validateDefinition(rawEntry.canonicalDefinition);
    if (!compiled.ok) { return fail('INVALID_REGISTRY'); }
    const canonicalResult = canonicalize(compiled.definition, 'definition');
    if (canonicalResult.error) { return fail('INVALID_REGISTRY'); }
    const canonicalDefinition = canonicalResult.value;
    const canonicalJson = stableStringify(canonicalDefinition);
    if (utf8Bytes(canonicalJson) > MAX_DEFINITION_BYTES) { return fail('INVALID_REGISTRY'); }
    if (ref.roomId !== canonicalDefinition.scope.roomId
      || ref.definitionId !== canonicalDefinition.definitionId
      || ref.definitionVersion !== canonicalDefinition.definitionVersion) { return fail('INVALID_REGISTRY'); }
    if (ref.roomId !== snapshot.roomId || canonicalDefinition.scope.roomId !== snapshot.roomId) { return fail('INVALID_REGISTRY'); }
    const definitionHash = sha256Hex(DEFINITION_HASH_PREFIX + canonicalJson);
    if (ref.definitionHash !== definitionHash) { return fail('INVALID_REGISTRY'); }
    const descriptor = buildDescriptor(ref, canonicalDefinition, {
      count: compiled.parsed.count,
      sides: compiled.parsed.sides,
      constant: compiled.parsed.constant
    });
    const descriptorCanonical = canonicalize(rawEntry.descriptor, 'descriptor');
    if (descriptorCanonical.error) { return fail('INVALID_REGISTRY'); }
    const descriptorBuiltCanonical = canonicalize(descriptor, 'descriptor');
    if (descriptorBuiltCanonical.error) { return fail('INVALID_REGISTRY'); }
    if (stableStringify(descriptorCanonical.value) !== stableStringify(descriptorBuiltCanonical.value)) {
      return fail('INVALID_REGISTRY');
    }
    const entryKey = `${ref.definitionId}:${ref.definitionVersion}`;
    if (entryKeys.has(entryKey)) { return fail('INVALID_REGISTRY'); }
    entryKeys.add(entryKey);
    entries.push({
      definitionRef: {
        roomId: ref.roomId,
        definitionId: ref.definitionId,
        definitionVersion: ref.definitionVersion,
        definitionHash: ref.definitionHash
      },
      canonicalDefinition,
      compilerVersion: COMPILER_VERSION,
      descriptor
    });
  }

  const decisions = [];
  const requestIds = new Set();
  const admittedAt = new Map();
  const revokedAt = new Map();
  const admitCounts = new Map();
  const nextVersionByDefinition = new Map();

  for (let index = 0; index < snapshot.decisions.length; index += 1) {
    const rawDecision = snapshot.decisions[index];
    if (!isPlainObject(rawDecision) || !hasExactKeys(rawDecision, DECISION_KEYS)) { return fail('INVALID_REGISTRY'); }
    if (rawDecision.sequence !== index + 1) { return fail('INVALID_REGISTRY'); }
    if (typeof rawDecision.requestId !== 'string' || !UUID_V4_PATTERN.test(rawDecision.requestId)) { return fail('INVALID_REGISTRY'); }
    if (requestIds.has(rawDecision.requestId)) { return fail('INVALID_REGISTRY'); }
    requestIds.add(rawDecision.requestId);
    if (!isUid(rawDecision.byUid)) { return fail('INVALID_REGISTRY'); }
    if (typeof rawDecision.requestHash !== 'string' || !HASH_PATTERN.test(rawDecision.requestHash)) { return fail('INVALID_REGISTRY'); }
    if (rawDecision.action !== 'admit' && rawDecision.action !== 'revoke') { return fail('INVALID_REGISTRY'); }
    const refShape = validateDefinitionRefShape(rawDecision.definitionRef, 'INVALID_REGISTRY');
    if (!refShape.ok) { return refShape; }
    const ref = refShape.value;

    const entryIndex = entries.findIndex((entry) => (
      entry.definitionRef.definitionId === ref.definitionId && entry.definitionRef.definitionVersion === ref.definitionVersion
    ));
    if (entryIndex === -1) { return fail('INVALID_REGISTRY'); }
    const entry = entries[entryIndex];
    if (!sameRef(entry.definitionRef, ref)) { return fail('INVALID_REGISTRY'); }

    const entryKey = `${ref.definitionId}:${ref.definitionVersion}`;

    if (rawDecision.action === 'admit') {
      const expectedVersion = nextVersionByDefinition.get(ref.definitionId) || 1;
      if (ref.definitionVersion !== expectedVersion) { return fail('INVALID_REGISTRY'); }
      nextVersionByDefinition.set(ref.definitionId, ref.definitionVersion + 1);
      admittedAt.set(entryKey, index);
      admitCounts.set(entryKey, (admitCounts.get(entryKey) || 0) + 1);
      const expectedHash = canonicalHash({
        roomId: snapshot.roomId,
        requestId: rawDecision.requestId,
        expectedRegistryRevision: index,
        definition: entry.canonicalDefinition,
        expectedDefinitionHash: entry.definitionRef.definitionHash
      });
      if (!expectedHash || expectedHash !== rawDecision.requestHash) { return fail('INVALID_REGISTRY'); }
    } else {
      const admitIndex = admittedAt.get(entryKey);
      if (admitIndex === undefined || admitIndex >= index) { return fail('INVALID_REGISTRY'); }
      if (revokedAt.has(entryKey)) { return fail('INVALID_REGISTRY'); }
      revokedAt.set(entryKey, index);
      const expectedHash = canonicalHash({
        roomId: snapshot.roomId,
        requestId: rawDecision.requestId,
        expectedRegistryRevision: index,
        definitionRef: {
          roomId: entry.definitionRef.roomId,
          definitionId: entry.definitionRef.definitionId,
          definitionVersion: entry.definitionRef.definitionVersion,
          definitionHash: entry.definitionRef.definitionHash
        }
      });
      if (!expectedHash || expectedHash !== rawDecision.requestHash) { return fail('INVALID_REGISTRY'); }
    }

    decisions.push({
      requestId: rawDecision.requestId,
      requestHash: rawDecision.requestHash,
      byUid: rawDecision.byUid,
      sequence: rawDecision.sequence,
      action: rawDecision.action,
      definitionRef: {
        roomId: ref.roomId,
        definitionId: ref.definitionId,
        definitionVersion: ref.definitionVersion,
        definitionHash: ref.definitionHash
      }
    });
  }

  for (const entry of entries) {
    const entryKey = `${entry.definitionRef.definitionId}:${entry.definitionRef.definitionVersion}`;
    if ((admitCounts.get(entryKey) || 0) !== 1) { return fail('INVALID_REGISTRY'); }
  }

  const rebuilt = {
    schemaVersion: REGISTRY_SCHEMA_VERSION,
    roomId: snapshot.roomId,
    revision: snapshot.revision,
    definitions: entries,
    decisions
  };
  if (utf8Bytes(stableStringify(rebuilt)) > MAX_SNAPSHOT_BYTES) { return fail('CAPACITY'); }

  return { ok: true, registry: deepFreeze(rebuilt) };
};

const emptyRegistry = (roomId) => {
  if (!isRoomId(roomId)) { return fail('INVALID_REGISTRY'); }
  return deepFreeze({
    schemaVersion: REGISTRY_SCHEMA_VERSION,
    roomId,
    revision: 0,
    definitions: [],
    decisions: []
  });
};

const encodeRegistry = (snapshot) => {
  const validated = validateRegistrySnapshot(snapshot);
  if (!validated.ok) { return validated; }
  return Object.freeze({ ok: true, json: stableStringify(validated.registry) });
};

const decodeRegistry = (json) => {
  if (typeof json !== 'string') { return fail('INVALID_REGISTRY'); }
  if (!isWellFormedString(json)) { return fail('INVALID_REGISTRY'); }
  if (utf8Bytes(json) > MAX_SNAPSHOT_BYTES) { return fail('CAPACITY'); }
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (error) {
    return fail('INVALID_REGISTRY');
  }
  return validateRegistrySnapshot(parsed);
};

const validatePlannerRequest = (input, operation) => {
  const copied = strictCopy(input, 'request', 1, 'INVALID_DEFINITION');
  if (!copied.ok) { return copied; }
  const request = copied.value;
  if (!isPlainObject(request)) { return fail('INVALID_DEFINITION'); }
  const expectedKeys = operation === 'admit' ? ADMIT_REQUEST_KEYS : REVOKE_REQUEST_KEYS;
  if (!hasExactKeys(request, expectedKeys)) { return fail('INVALID_DEFINITION'); }
  if (!isRoomId(request.roomId)) { return fail('INVALID_DEFINITION', 'roomId'); }
  if (typeof request.requestId !== 'string' || !UUID_V4_PATTERN.test(request.requestId)) {
    return fail('INVALID_DEFINITION', 'requestId');
  }
  if (!Number.isSafeInteger(request.expectedRegistryRevision) || request.expectedRegistryRevision < 0) {
    return fail('INVALID_DEFINITION', 'expectedRegistryRevision');
  }
  if (operation === 'admit') {
    if (typeof request.expectedDefinitionHash !== 'string' || !HASH_PATTERN.test(request.expectedDefinitionHash)) {
      return fail('INVALID_DEFINITION', 'expectedDefinitionHash');
    }
    if (!isPlainObject(request.definition)) { return fail('INVALID_DEFINITION', 'definition'); }
  } else {
    if (!isPlainObject(request.definitionRef)) { return fail('INVALID_DEFINITION', 'definitionRef'); }
    const refShape = validateDefinitionRefShape(request.definitionRef, 'INVALID_DEFINITION');
    if (!refShape.ok) { return refShape; }
  }
  return { ok: true, value: request };
};

const validateAuthorityResult = (result, roomId) => {
  if (!isPlainObject(result) || result.ok !== true) { return fail('AUTHORITY_UNAVAILABLE'); }
  if (result.roomId !== roomId) { return fail('SCOPE_MISMATCH'); }
  if (!isUid(result.uid) || !isUid(result.gmUid)) { return fail('AUTHORITY_UNAVAILABLE'); }
  if (result.principalBound !== true) { return fail('FORBIDDEN'); }
  if (result.authorityCurrent !== true) { return fail('AUTHORITY_UNAVAILABLE'); }
  if (result.uid !== result.gmUid) { return fail('FORBIDDEN'); }
  if (result.rulesetId !== RULESET_ID || result.rulesetVersion !== RULESET_VERSION) { return fail('AUTHORITY_UNAVAILABLE'); }
  return { ok: true, uid: result.uid };
};

const isVersionRevoked = (registry, definitionRef) => registry.decisions.some((decision) => (
  decision.action === 'revoke'
  && decision.definitionRef.definitionId === definitionRef.definitionId
  && decision.definitionRef.definitionVersion === definitionRef.definitionVersion
));

const planTransition = async(operation, registryInput, requestInput, authorize) => {
  const requestValidated = validatePlannerRequest(requestInput, operation);
  if (!requestValidated.ok) { return requestValidated; }
  const request = requestValidated.value;

  const registryValidated = validateRegistrySnapshot(registryInput);
  if (!registryValidated.ok) { return registryValidated; }
  const registry = registryValidated.registry;

  const requestHash = canonicalHash(request);
  if (!requestHash) { return fail('INVALID_DEFINITION'); }

  let authorityResult;
  try {
    authorityResult = await authorize({ operation, roomId: registry.roomId });
  } catch (error) {
    return fail('AUTHORITY_UNAVAILABLE');
  }
  const authority = validateAuthorityResult(authorityResult, registry.roomId);
  if (!authority.ok) { return authority; }

  if (request.roomId !== registry.roomId) { return fail('SCOPE_MISMATCH'); }

  const existingDecision = registry.decisions.find((decision) => decision.requestId === request.requestId);
  if (existingDecision) {
    if (existingDecision.requestHash !== requestHash || existingDecision.byUid !== authority.uid) {
      return fail('REQUEST_ID_CONFLICT');
    }
    return deepFreeze({
      ok: true,
      kind: 'replay',
      installed: false,
      requestId: existingDecision.requestId,
      requestHash,
      definitionRef: existingDecision.definitionRef,
      currentRegistryRevision: registry.revision
    });
  }

  if (request.expectedRegistryRevision !== registry.revision) { return fail('REVISION_CONFLICT'); }

  if (operation === 'admit') {
    const compiled = compileDefinition(request.definition);
    if (!compiled.ok) { return compiled; }
    if (compiled.canonicalDefinition.scope.roomId !== registry.roomId) { return fail('SCOPE_MISMATCH'); }
    if (compiled.definitionHash !== request.expectedDefinitionHash) { return fail('HASH_MISMATCH'); }

    const definitionId = compiled.canonicalDefinition.definitionId;
    const definitionVersion = compiled.canonicalDefinition.definitionVersion;
    const existingVersions = registry.definitions.filter((entry) => entry.definitionRef.definitionId === definitionId);
    const sameVersion = existingVersions.find((entry) => entry.definitionRef.definitionVersion === definitionVersion);
    if (sameVersion) {
      return fail(isVersionRevoked(registry, sameVersion.definitionRef) ? 'DEFINITION_REVOKED' : 'VERSION_EXISTS');
    }
    const maxVersion = existingVersions.reduce((max, entry) => Math.max(max, entry.definitionRef.definitionVersion), 0);
    if (definitionVersion !== maxVersion + 1) { return fail('VERSION_SEQUENCE'); }

    if (registry.definitions.length + 1 > MAX_REGISTRY_DEFINITIONS) { return fail('CAPACITY'); }
    if (registry.decisions.length + 1 > MAX_REGISTRY_DECISIONS) { return fail('CAPACITY'); }

    const definitionRef = {
      roomId: registry.roomId,
      definitionId,
      definitionVersion,
      definitionHash: compiled.definitionHash
    };
    const decision = {
      requestId: request.requestId,
      requestHash,
      byUid: authority.uid,
      sequence: registry.revision + 1,
      action: 'admit',
      definitionRef
    };
    const nextValidated = validateRegistrySnapshot({
      schemaVersion: REGISTRY_SCHEMA_VERSION,
      roomId: registry.roomId,
      revision: registry.revision + 1,
      definitions: [
        ...registry.definitions,
        {
          definitionRef,
          canonicalDefinition: compiled.canonicalDefinition,
          compilerVersion: COMPILER_VERSION,
          descriptor: compiled.descriptor
        }
      ],
      decisions: [...registry.decisions, decision]
    });
    if (!nextValidated.ok) { return nextValidated; }

    return deepFreeze({
      ok: true,
      kind: 'transition',
      installed: false,
      expectedRegistryRevision: registry.revision,
      requestHash,
      nextRegistry: nextValidated.registry,
      definitionRef,
      decision,
      descriptor: compiled.descriptor
    });
  }

  const ref = request.definitionRef;
  if (ref.roomId !== registry.roomId) { return fail('SCOPE_MISMATCH'); }
  const entry = registry.definitions.find((candidate) => (
    candidate.definitionRef.definitionId === ref.definitionId
    && candidate.definitionRef.definitionVersion === ref.definitionVersion
  ));
  if (!entry) { return fail('DEFINITION_NOT_FOUND'); }
  if (entry.definitionRef.definitionHash !== ref.definitionHash) { return fail('HASH_MISMATCH'); }
  if (isVersionRevoked(registry, entry.definitionRef)) { return fail('ALREADY_REVOKED'); }
  if (registry.decisions.length + 1 > MAX_REGISTRY_DECISIONS) { return fail('CAPACITY'); }

  const decision = {
    requestId: request.requestId,
    requestHash,
    byUid: authority.uid,
    sequence: registry.revision + 1,
    action: 'revoke',
    definitionRef: {
      roomId: entry.definitionRef.roomId,
      definitionId: entry.definitionRef.definitionId,
      definitionVersion: entry.definitionRef.definitionVersion,
      definitionHash: entry.definitionRef.definitionHash
    }
  };
  const nextValidated = validateRegistrySnapshot({
    schemaVersion: REGISTRY_SCHEMA_VERSION,
    roomId: registry.roomId,
    revision: registry.revision + 1,
    definitions: registry.definitions,
    decisions: [...registry.decisions, decision]
  });
  if (!nextValidated.ok) { return nextValidated; }

  return deepFreeze({
    ok: true,
    kind: 'transition',
    installed: false,
    expectedRegistryRevision: registry.revision,
    requestHash,
    nextRegistry: nextValidated.registry,
    definitionRef: decision.definitionRef,
    decision
  });
};

const createDefinitionRegistry = (options) => {
  const authorize = isPlainObject(options) ? options.authorize : undefined;
  if (typeof authorize !== 'function') {
    throw new TypeError('createDefinitionRegistry requires an authorize function');
  }

  const planAdmit = (registry, request) => planTransition('admit', registry, request, authorize);
  const planRevoke = (registry, request) => planTransition('revoke', registry, request, authorize);

  const describe = (registryInput, paramsInput) => {
    const registryValidated = validateRegistrySnapshot(registryInput);
    if (!registryValidated.ok) { return registryValidated; }
    const registry = registryValidated.registry;

    const copied = strictCopy(paramsInput, 'params', 1, 'INVALID_DEFINITION');
    if (!copied.ok) { return copied; }
    const params = copied.value;
    if (!isPlainObject(params) || !hasExactKeys(params, DESCRIBE_PARAM_KEYS)) { return fail('INVALID_DEFINITION'); }

    const refShape = validateDefinitionRefShape(params.definitionRef, 'INVALID_DEFINITION');
    if (!refShape.ok) { return refShape; }
    const ref = refShape.value;

    const binding = params.expectedBinding;
    if (!isPlainObject(binding) || !hasExactKeys(binding, BINDING_KEYS)) { return fail('INVALID_DEFINITION'); }
    if (typeof binding.rulesetId !== 'string' || typeof binding.rulesetVersion !== 'string' || typeof binding.classId !== 'string') {
      return fail('INVALID_DEFINITION');
    }

    if (ref.roomId !== registry.roomId) { return fail('SCOPE_MISMATCH'); }
    const entry = registry.definitions.find((candidate) => (
      candidate.definitionRef.definitionId === ref.definitionId
      && candidate.definitionRef.definitionVersion === ref.definitionVersion
    ));
    if (!entry) { return fail('DEFINITION_NOT_FOUND'); }
    if (entry.definitionRef.definitionHash !== ref.definitionHash) { return fail('HASH_MISMATCH'); }
    if (binding.rulesetId !== entry.canonicalDefinition.binding.rulesetId
      || binding.rulesetVersion !== entry.canonicalDefinition.binding.rulesetVersion
      || binding.classId !== entry.canonicalDefinition.binding.classId) {
      return fail('UNSUPPORTED_BINDING');
    }
    if (isVersionRevoked(registry, entry.definitionRef)) { return fail('DEFINITION_REVOKED'); }

    return deepFreeze({
      ok: true,
      descriptor: entry.descriptor,
      admissionState: 'modeled-only'
    });
  };

  return Object.freeze({ planAdmit, planRevoke, describe });
};

module.exports = {
  compileDefinition,
  emptyRegistry,
  encodeRegistry,
  decodeRegistry,
  createDefinitionRegistry
};
