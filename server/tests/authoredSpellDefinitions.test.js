const assert = require('assert');
const fs = require('fs');
const path = require('path');

const definitions = require('../services/authoredSpellDefinitions');
const roomCheckpoint = require('../services/roomCheckpoint');

const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'crA1aDefinitionVectors.json'), 'utf8'));
const serviceSource = fs.readFileSync(path.join(__dirname, '..', 'services', 'authoredSpellDefinitions.js'), 'utf8');

const ROOM = 'headq-pilot-room';
const GM = 'gm-1001';

const clone = (value) => JSON.parse(JSON.stringify(value));
const defBase = () => clone(fixture.vectors[0].definition);
const healingBase = () => clone(fixture.vectors[1].definition);
const uuid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

const reorderKeys = (value) => {
  if (Array.isArray(value)) { return value.map(reorderKeys); }
  if (value !== null && typeof value === 'object') {
    const output = {};
    for (const key of Object.keys(value).reverse()) { output[key] = reorderKeys(value[key]); }
    return output;
  }
  return value;
};

const successData = (roomId, uid) => ({
  ok: true,
  roomId,
  uid,
  gmUid: uid,
  principalBound: true,
  authorityCurrent: true,
  rulesetId: 'prism',
  rulesetVersion: 'cr-a1a-pilot-1'
});

const makeRegistry = (uid = GM) => definitions.createDefinitionRegistry({
  authorize: () => Promise.resolve(successData(ROOM, uid))
});

const admitReq = (n, definition, expectedRegistryRevision) => {
  const compiled = definitions.compileDefinition(definition);
  assert.strictEqual(compiled.ok, true, 'test definition must compile');
  return {
    roomId: ROOM,
    requestId: uuid(n),
    expectedRegistryRevision,
    definition: clone(definition),
    expectedDefinitionHash: compiled.definitionHash
  };
};

const revokeReq = (n, definitionRef, expectedRegistryRevision) => ({
  roomId: ROOM,
  requestId: uuid(n),
  expectedRegistryRevision,
  definitionRef: clone(definitionRef)
});

const defV = (version, name) => {
  const definition = defBase();
  definition.definitionVersion = version;
  definition.name = name;
  return definition;
};

const seeded = async() => {
  const registry = makeRegistry();
  const base = definitions.emptyRegistry(ROOM);
  const admitted = await registry.planAdmit(base, admitReq(1, defBase(), 0));
  assert.strictEqual(admitted.ok, true);
  return { registry, base, admitted };
};

const buildRich = async() => {
  const { registry, base, admitted } = await seeded();
  const second = await registry.planAdmit(admitted.nextRegistry, admitReq(12, defV(2, 'Pilot Arcane Dart II'), 1));
  assert.strictEqual(second.ok, true);
  const revoked = await registry.planRevoke(second.nextRegistry, revokeReq(13, admitted.definitionRef, 2));
  assert.strictEqual(revoked.ok, true);
  return { registry, base, first: admitted, second, revoked, snapshot: revoked.nextRegistry };
};

const entryRef = (snapshot, definitionVersion) => snapshot.definitions.find(
  (entry) => entry.definitionRef.definitionVersion === definitionVersion
).definitionRef;

const admitDecisionHash = (roomId, requestId, index, entry) => roomCheckpoint.canonicalHash({
  roomId,
  requestId,
  expectedRegistryRevision: index,
  definition: entry.canonicalDefinition,
  expectedDefinitionHash: entry.definitionRef.definitionHash
});

const revokeDecisionHash = (roomId, requestId, index, ref) => roomCheckpoint.canonicalHash({
  roomId,
  requestId,
  expectedRegistryRevision: index,
  definitionRef: ref
});

describe('CR-A1a authoredSpellDefinitions', () => {
  describe('golden vectors', () => {
    fixture.vectors.forEach((vector) => {
      it(`compiles ${vector.label} to the frozen canonical definition, hash and descriptor`, () => {
        const result = definitions.compileDefinition(clone(vector.definition));
        assert.strictEqual(result.ok, true);
        assert.strictEqual(roomCheckpoint.stableStringify(result.canonicalDefinition), vector.canonicalJSON);
        assert.strictEqual(result.definitionHash, vector.definitionHash);
        assert.deepStrictEqual(result.descriptor, vector.descriptor);
      });
    });

    it('hashes object key reordering identically', () => {
      const reordered = reorderKeys(defBase());
      const result = definitions.compileDefinition(reordered);
      assert.strictEqual(result.ok, true);
      assert.strictEqual(result.definitionHash, fixture.vectors[0].definitionHash);
      assert.strictEqual(roomCheckpoint.stableStringify(result.canonicalDefinition), fixture.vectors[0].canonicalJSON);
    });

    it('keeps zero AP and zero mana explicit and distinct from other prices', () => {
      const zeroAp = definitions.compileDefinition(defBase());
      const healing = definitions.compileDefinition(healingBase());
      const changed = definitions.compileDefinition(clone(fixture.vectors[2].definition));
      assert.strictEqual(zeroAp.descriptor.price.ap, 0);
      assert.strictEqual(healing.descriptor.price.mana, 0);
      assert.notStrictEqual(zeroAp.definitionHash, changed.definitionHash);
      assert.strictEqual(changed.definitionHash, fixture.vectors[2].definitionHash);
    });

    it('changes identity for name, version and class changes and rejects ruleset changes', () => {
      const base = definitions.compileDefinition(defBase());
      const renamed = defBase();
      renamed.name = 'Pilot Arcane Dart Renamed';
      const renamedResult = definitions.compileDefinition(renamed);
      assert.strictEqual(renamedResult.ok, true);
      assert.notStrictEqual(renamedResult.definitionHash, base.definitionHash);

      const reversioned = defBase();
      reversioned.definitionVersion = 2;
      const reversionedResult = definitions.compileDefinition(reversioned);
      assert.strictEqual(reversionedResult.ok, true);
      assert.notStrictEqual(reversionedResult.definitionHash, base.definitionHash);

      const reclassed = defBase();
      reclassed.binding.classId = 'warden';
      const reclassedResult = definitions.compileDefinition(reclassed);
      assert.strictEqual(reclassedResult.ok, true);
      assert.notStrictEqual(reclassedResult.definitionHash, base.definitionHash);

      const reruleset = defBase();
      reruleset.binding.rulesetId = 'dnd5e';
      const rerulesetResult = definitions.compileDefinition(reruleset);
      assert.strictEqual(rerulesetResult.ok, false);
      assert.strictEqual(rerulesetResult.code, 'UNSUPPORTED_BINDING');
    });

    it('parses the frozen formula subset with signed constants', () => {
      const flat = defV(1, 'Flat');
      flat.effect.formula = '1d6';
      const flatResult = definitions.compileDefinition(flat);
      assert.strictEqual(flatResult.ok, true);
      assert.deepStrictEqual(flatResult.descriptor.effect.dice, [{ count: 1, sides: 6 }]);
      assert.strictEqual(flatResult.descriptor.effect.constant, 0);

      const negative = defV(1, 'Negative');
      negative.effect.formula = '1d6-2';
      const negativeResult = definitions.compileDefinition(negative);
      assert.strictEqual(negativeResult.ok, true);
      assert.strictEqual(negativeResult.descriptor.effect.constant, -2);

      const maximum = defV(1, 'Maximum');
      maximum.effect.formula = '50d100+10000';
      const maximumResult = definitions.compileDefinition(maximum);
      assert.strictEqual(maximumResult.ok, true);
      assert.deepStrictEqual(maximumResult.descriptor.effect.dice, [{ count: 50, sides: 100 }]);
      assert.strictEqual(maximumResult.descriptor.effect.constant, 10000);
    });

    it('keeps the descriptor staged and execution disabled', () => {
      const result = definitions.compileDefinition(defBase());
      assert.strictEqual(result.descriptor.executionEnabled, false);
      assert.strictEqual(result.descriptor.capabilityId, 'authored-immediate:v1');
      assert.strictEqual(result.descriptor.compilerVersion, 'cr-a1a-1');
      assert.strictEqual(result.descriptor.definitionRef.definitionHash, result.definitionHash);
    });
  });

  describe('definition rejection matrix', () => {
    const failures = [
      ['missing actionPoints', (d) => { delete d.resourceCost.actionPoints; }, 'INVALID_DEFINITION'],
      ['null actionPoints', (d) => { d.resourceCost.actionPoints = null; }, 'INVALID_DEFINITION'],
      ['string actionPoints', (d) => { d.resourceCost.actionPoints = '0'; }, 'INVALID_DEFINITION'],
      ['negative actionPoints', (d) => { d.resourceCost.actionPoints = -1; }, 'INVALID_DEFINITION'],
      ['fractional actionPoints', (d) => { d.resourceCost.actionPoints = 1.5; }, 'INVALID_DEFINITION'],
      ['out-of-range actionPoints', (d) => { d.resourceCost.actionPoints = 21; }, 'INVALID_DEFINITION'],
      ['NaN actionPoints', (d) => { d.resourceCost.actionPoints = NaN; }, 'INVALID_DEFINITION'],
      ['missing mana', (d) => { delete d.resourceCost.mana; }, 'INVALID_DEFINITION'],
      ['string mana', (d) => { d.resourceCost.mana = '4'; }, 'INVALID_DEFINITION'],
      ['out-of-range mana', (d) => { d.resourceCost.mana = 10001; }, 'INVALID_DEFINITION'],
      ['negative mana', (d) => { d.resourceCost.mana = -5; }, 'INVALID_DEFINITION'],
      ['extra root field', (d) => { d.cooldown = 3; }, 'INVALID_DEFINITION'],
      ['extra effect field', (d) => { d.effect.materials = []; }, 'INVALID_DEFINITION'],
      ['mixed effect kind', (d) => { d.effect.kind = 'mixed'; }, 'UNSUPPORTED_SHAPE'],
      ['unsupported spellType', (d) => { d.spellType = 'BONUS'; }, 'UNSUPPORTED_SHAPE'],
      ['non-string spellType', (d) => { d.spellType = 3; }, 'INVALID_DEFINITION'],
      ['unsupported castTimeType', (d) => { d.castTimeType = 'CHANNELED'; }, 'UNSUPPORTED_SHAPE'],
      ['unsupported targeting kind', (d) => { d.targeting.kind = 'multi'; }, 'UNSUPPORTED_SHAPE'],
      ['unsupported maxTargets', (d) => { d.targeting.maxTargets = 2; }, 'UNSUPPORTED_SHAPE'],
      ['string maxTargets', (d) => { d.targeting.maxTargets = '1'; }, 'INVALID_DEFINITION'],
      ['unsupported restriction', (d) => { d.targeting.restriction = 'none'; }, 'UNSUPPORTED_SHAPE'],
      ['self restriction with range', (d) => { d.targeting.restriction = 'self'; }, 'UNSUPPORTED_SHAPE'],
      ['out-of-range rangeFeet', (d) => { d.targeting.rangeFeet = 301; }, 'INVALID_DEFINITION'],
      ['negative rangeFeet', (d) => { d.targeting.rangeFeet = -1; }, 'INVALID_DEFINITION'],
      ['fractional rangeFeet', (d) => { d.targeting.rangeFeet = 2.5; }, 'INVALID_DEFINITION'],
      ['unknown classId', (d) => { d.binding.classId = 'druid'; }, 'UNSUPPORTED_BINDING'],
      ['unknown rulesetId', (d) => { d.binding.rulesetId = 'dnd5e'; }, 'UNSUPPORTED_BINDING'],
      ['unknown rulesetVersion', (d) => { d.binding.rulesetVersion = '1.0'; }, 'UNSUPPORTED_BINDING'],
      ['missing description', (d) => { delete d.description; }, 'INVALID_DEFINITION'],
      ['oversized description', (d) => { d.description = 'a'.repeat(4001); }, 'INVALID_DEFINITION'],
      ['empty name', (d) => { d.name = ''; }, 'INVALID_DEFINITION'],
      ['oversized name', (d) => { d.name = 'a'.repeat(121); }, 'INVALID_DEFINITION'],
      ['uppercase definitionId', (d) => { d.definitionId = 'AAAAAAAA-AAAA-4AAA-8AAA-AAAAAAAAAAAA'; }, 'INVALID_DEFINITION'],
      ['non-v4 definitionId', (d) => { d.definitionId = '11111111-1111-1111-8111-111111111111'; }, 'INVALID_DEFINITION'],
      ['zero definitionVersion', (d) => { d.definitionVersion = 0; }, 'INVALID_DEFINITION'],
      ['fractional definitionVersion', (d) => { d.definitionVersion = 1.5; }, 'INVALID_DEFINITION'],
      ['oversized definitionVersion', (d) => { d.definitionVersion = 1000001; }, 'INVALID_DEFINITION'],
      ['bigint definitionVersion', (d) => { d.definitionVersion = 2n; }, 'INVALID_DEFINITION'],
      ['future schemaVersion', (d) => { d.schemaVersion = 2; }, 'INVALID_DEFINITION'],
      ['string schemaVersion', (d) => { d.schemaVersion = '1'; }, 'INVALID_DEFINITION'],
      ['empty scope roomId', (d) => { d.scope.roomId = ''; }, 'INVALID_DEFINITION'],
      ['extra scope field', (d) => { d.scope.extra = 1; }, 'INVALID_DEFINITION'],
      ['empty damageTypes', (d) => { d.effect.damageTypes = []; }, 'INVALID_DEFINITION'],
      ['multiple damageTypes', (d) => { d.effect.damageTypes = ['arcane', 'ember']; }, 'INVALID_DEFINITION'],
      ['unknown damageType', (d) => { d.effect.damageTypes = ['fire']; }, 'UNSUPPORTED_SHAPE'],
      ['non-array damageTypes', (d) => { d.effect.damageTypes = 'arcane'; }, 'INVALID_DEFINITION'],
      ['healing with damageTypes', (d) => { d.effect = { kind: 'healing', formula: '2d8', damageTypes: ['sacred'] }; }, 'INVALID_DEFINITION'],
      ['code-like formula', (d) => { d.effect.formula = 'return 1;'; }, 'UNSUPPORTED_SHAPE'],
      ['spaced formula', (d) => { d.effect.formula = '1d6 + 2'; }, 'UNSUPPORTED_SHAPE'],
      ['leading-zero constant', (d) => { d.effect.formula = '1d6+02'; }, 'UNSUPPORTED_SHAPE'],
      ['zero dice count', (d) => { d.effect.formula = '0d6'; }, 'UNSUPPORTED_SHAPE'],
      ['oversized dice count', (d) => { d.effect.formula = '51d6'; }, 'UNSUPPORTED_SHAPE'],
      ['oversized dice sides', (d) => { d.effect.formula = '1d101'; }, 'UNSUPPORTED_SHAPE'],
      ['undersized dice sides', (d) => { d.effect.formula = '1d1'; }, 'UNSUPPORTED_SHAPE'],
      ['oversized formula constant', (d) => { d.effect.formula = '1d6+10001'; }, 'UNSUPPORTED_SHAPE'],
      ['multiplication formula', (d) => { d.effect.formula = '1d6*2'; }, 'UNSUPPORTED_SHAPE'],
      ['multi-group formula', (d) => { d.effect.formula = '1d6+2d4'; }, 'UNSUPPORTED_SHAPE'],
      ['non-string formula', (d) => { d.effect.formula = 6; }, 'INVALID_DEFINITION'],
      ['deep unknown structure', (d) => { d.extra = { a: { b: { c: { e: { f: { g: { h: [1] } } } } } } }; }, 'INVALID_DEFINITION'],
      ['lone surrogate name', (d) => { d.name = 'broken \uD800'; }, 'INVALID_DEFINITION'],
      ['date description', (d) => { d.description = new Date(0); }, 'INVALID_DEFINITION'],
      ['function name', (d) => { d.name = () => 'x'; }, 'INVALID_DEFINITION']
    ];

    failures.forEach(([label, apply, expectedCode]) => {
      it(`rejects ${label} with ${expectedCode}`, () => {
        const dto = defBase();
        apply(dto);
        const result = definitions.compileDefinition(dto);
        assert.strictEqual(result.ok, false);
        assert.strictEqual(result.code, expectedCode);
      });
    });

    it('rejects an own __proto__ key', () => {
      const dto = defBase();
      Object.defineProperty(dto, '__proto__', { value: {}, enumerable: true, writable: true, configurable: true });
      const result = definitions.compileDefinition(dto);
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'INVALID_DEFINITION');
    });

    it('rejects sparse arrays', () => {
      const dto = defBase();
      const sparse = new Array(2);
      sparse[1] = 'arcane';
      dto.effect.damageTypes = sparse;
      const result = definitions.compileDefinition(dto);
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'INVALID_DEFINITION');
    });

    it('rejects non-enumerable injected properties without invoking getters', () => {
      const dto = defBase();
      let invoked = 0;
      Object.defineProperty(dto, 'snuck', {
        enumerable: false,
        get() { invoked += 1; return 1; }
      });
      const result = definitions.compileDefinition(dto);
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'INVALID_DEFINITION');
      assert.strictEqual(invoked, 0);
    });

    it('rejects canonical definitions over the 16 KiB byte budget while accepting a near-limit one', () => {
      const huge = defBase();
      huge.name = '\u{1D49C}'.repeat(120);
      huge.description = '\u{1D49C}'.repeat(4000);
      const hugeResult = definitions.compileDefinition(huge);
      assert.strictEqual(hugeResult.ok, false);
      assert.strictEqual(hugeResult.code, 'INVALID_DEFINITION');

      const nearLimit = defBase();
      nearLimit.description = 'a'.repeat(4000);
      const nearLimitResult = definitions.compileDefinition(nearLimit);
      assert.strictEqual(nearLimitResult.ok, true);
    });
  });

  describe('compiler purity and detachment', () => {
    it('does not mutate or freeze its input and returns detached equal results', () => {
      const dto = defBase();
      const before = clone(dto);
      const first = definitions.compileDefinition(dto);
      const second = definitions.compileDefinition(dto);
      assert.deepStrictEqual(dto, before);
      assert.strictEqual(Object.isFrozen(dto), false);
      assert.strictEqual(Object.isFrozen(dto.effect), false);
      assert.deepStrictEqual(first.canonicalDefinition, second.canonicalDefinition);
      assert.notStrictEqual(first.canonicalDefinition, second.canonicalDefinition);
      assert.notStrictEqual(first.descriptor, second.descriptor);
      assert.strictEqual(Object.isFrozen(first.canonicalDefinition), true);
      assert.strictEqual(Object.isFrozen(first.descriptor), true);
      assert.strictEqual(Object.isFrozen(first.descriptor.effect.dice[0]), true);
    });
  });

  describe('registry codec', () => {
    it('creates a valid frozen revision-zero snapshot', () => {
      const snapshot = definitions.emptyRegistry(ROOM);
      assert.deepStrictEqual(snapshot, {
        schemaVersion: 1,
        roomId: ROOM,
        revision: 0,
        definitions: [],
        decisions: []
      });
      assert.strictEqual(Object.isFrozen(snapshot), true);
      const bad = definitions.emptyRegistry('');
      assert.strictEqual(bad.ok, false);
      assert.strictEqual(bad.code, 'INVALID_REGISTRY');
    });

    it('round-trips an encoded admitted registry deterministically', async() => {
      const { admitted } = await seeded();
      const encoded = definitions.encodeRegistry(admitted.nextRegistry);
      assert.strictEqual(encoded.ok, true);
      const decoded = definitions.decodeRegistry(encoded.json);
      assert.strictEqual(decoded.ok, true);
      assert.deepStrictEqual(decoded.registry, admitted.nextRegistry);
      const reencoded = definitions.encodeRegistry(decoded.registry);
      assert.strictEqual(reencoded.json, encoded.json);
    });

    it('rejects malformed codec inputs', () => {
      assert.strictEqual(definitions.encodeRegistry(null).code, 'INVALID_REGISTRY');
      assert.strictEqual(definitions.encodeRegistry(42).code, 'INVALID_REGISTRY');
      assert.strictEqual(definitions.decodeRegistry('not json').code, 'INVALID_REGISTRY');
      assert.strictEqual(definitions.decodeRegistry(42).code, 'INVALID_REGISTRY');
      assert.strictEqual(definitions.decodeRegistry('[]').code, 'INVALID_REGISTRY');
    });

    it('rejects future registry and compiler versions without migrating', async() => {
      const { admitted } = await seeded();
      const future = clone(admitted.nextRegistry);
      future.schemaVersion = 2;
      const encoded = definitions.encodeRegistry(future);
      assert.strictEqual(encoded.code, 'UNSUPPORTED_REGISTRY_VERSION');
      const decoded = definitions.decodeRegistry(JSON.stringify(future));
      assert.strictEqual(decoded.code, 'UNSUPPORTED_REGISTRY_VERSION');

      const unknownCompiler = clone(admitted.nextRegistry);
      unknownCompiler.definitions[0].compilerVersion = 'cr-a1a-2';
      assert.strictEqual(definitions.encodeRegistry(unknownCompiler).code, 'UNSUPPORTED_REGISTRY_VERSION');
    });

    it('rejects stored definitions whose hash, descriptor or reference was altered', async() => {
      const { admitted } = await seeded();
      const alteredHash = clone(admitted.nextRegistry);
      alteredHash.definitions[0].definitionRef.definitionHash = 'f'.repeat(64);
      assert.strictEqual(definitions.encodeRegistry(alteredHash).code, 'INVALID_REGISTRY');

      const alteredDescriptor = clone(admitted.nextRegistry);
      alteredDescriptor.definitions[0].descriptor.price.ap = 9;
      assert.strictEqual(definitions.encodeRegistry(alteredDescriptor).code, 'INVALID_REGISTRY');

      const alteredLegacyField = clone(admitted.nextRegistry);
      alteredLegacyField.definitions[0].canonicalDefinition.resourceCost.actionPoints = 3;
      assert.strictEqual(definitions.encodeRegistry(alteredLegacyField).code, 'INVALID_REGISTRY');
    });
  });

  describe('planner happy paths', () => {
    it('plans a staged, uninstalled admit transition with frozen outputs', async() => {
      const { admitted } = await seeded();
      assert.strictEqual(admitted.kind, 'transition');
      assert.strictEqual(admitted.installed, false);
      assert.strictEqual(admitted.expectedRegistryRevision, 0);
      assert.strictEqual(admitted.nextRegistry.revision, 1);
      assert.strictEqual(admitted.nextRegistry.definitions.length, 1);
      assert.strictEqual(admitted.nextRegistry.decisions.length, 1);
      assert.strictEqual(admitted.decision.action, 'admit');
      assert.strictEqual(admitted.decision.sequence, 1);
      assert.strictEqual(admitted.decision.byUid, GM);
      assert.strictEqual(admitted.definitionRef.definitionHash, fixture.vectors[0].definitionHash);
      assert.deepStrictEqual(admitted.descriptor, fixture.vectors[0].descriptor);
      assert.ok(/^[0-9a-f]{64}$/.test(admitted.requestHash));
      assert.strictEqual(Object.isFrozen(admitted), true);
      assert.strictEqual(Object.isFrozen(admitted.nextRegistry), true);
      assert.strictEqual(Object.isFrozen(admitted.nextRegistry.definitions[0].canonicalDefinition), true);
      assert.strictEqual(Reflect.set(admitted.nextRegistry, 'revision', 99), false);
      assert.strictEqual(Reflect.set(admitted.descriptor.price, 'ap', 7), false);
      assert.strictEqual(admitted.nextRegistry.revision, 1);
      assert.strictEqual(admitted.descriptor.price.ap, 0);
    });

    it('returns an idempotent replay for the same request without new revision or events', async() => {
      const { registry, admitted } = await seeded();
      const originalRequest = admitReq(1, defBase(), 0);
      const replay = await registry.planAdmit(admitted.nextRegistry, originalRequest);
      assert.strictEqual(replay.ok, true);
      assert.strictEqual(replay.kind, 'replay');
      assert.strictEqual(replay.installed, false);
      assert.strictEqual(replay.requestHash, admitted.requestHash);
      assert.strictEqual(replay.currentRegistryRevision, 1);
      assert.deepStrictEqual(replay.definitionRef, admitted.definitionRef);
      assert.strictEqual('nextRegistry' in replay, false);
      assert.strictEqual('decision' in replay, false);
    });

    it('treats re-ordered request keys as the same replay', async() => {
      const { registry, admitted } = await seeded();
      const shuffled = reorderKeys(admitReq(1, defBase(), 0));
      const replay = await registry.planAdmit(admitted.nextRegistry, shuffled);
      assert.strictEqual(replay.ok, true);
      assert.strictEqual(replay.kind, 'replay');
    });

    it('invokes the authorizer freshly even for replays', async() => {
      let calls = 0;
      const registry = definitions.createDefinitionRegistry({
        authorize: () => {
          calls += 1;
          return Promise.resolve(successData(ROOM, GM));
        }
      });
      const base = definitions.emptyRegistry(ROOM);
      const first = await registry.planAdmit(base, admitReq(1, defBase(), 0));
      assert.strictEqual(first.ok, true);
      const replay = await registry.planAdmit(first.nextRegistry, admitReq(1, defBase(), 0));
      assert.strictEqual(replay.kind, 'replay');
      assert.strictEqual(calls, 2);
    });

    it('plans a revoke transition that appends without modifying stored definition bytes', async() => {
      const { registry, admitted } = await seeded();
      const before = clone(admitted.nextRegistry);
      const revoked = await registry.planRevoke(admitted.nextRegistry, revokeReq(2, admitted.definitionRef, 1));
      assert.strictEqual(revoked.ok, true);
      assert.strictEqual(revoked.kind, 'transition');
      assert.strictEqual(revoked.expectedRegistryRevision, 1);
      assert.strictEqual(revoked.nextRegistry.revision, 2);
      assert.strictEqual(revoked.decision.action, 'revoke');
      assert.deepStrictEqual(revoked.nextRegistry.definitions, before.definitions);
      assert.strictEqual('descriptor' in revoked, false);
      assert.strictEqual(revoked.installed, false);
    });

    it('supports admitting a new version after a revocation', async() => {
      const { registry, first, revoked } = await buildRich();
      const third = await registry.planAdmit(revoked.nextRegistry, admitReq(14, defV(3, 'Pilot Arcane Dart III'), 3));
      assert.strictEqual(third.ok, true);
      assert.strictEqual(third.nextRegistry.revision, 4);
      const described = registry.describe(third.nextRegistry, {
        definitionRef: third.definitionRef,
        expectedBinding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'arcanoneer' }
      });
      assert.strictEqual(described.ok, true);
      assert.strictEqual(first.definitionRef.definitionVersion, 1);
    });
  });

  describe('planner failure matrix', () => {
    it('fails closed on revision conflicts before other semantic checks', async() => {
      const { registry, admitted } = await seeded();
      const result = await registry.planAdmit(admitted.nextRegistry, admitReq(50, defBase(), 5));
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'REVISION_CONFLICT');
    });

    it('rejects altered expected definition hashes', async() => {
      const { registry, admitted } = await seeded();
      const request = admitReq(51, defBase(), 1);
      request.expectedDefinitionHash = '0'.repeat(64);
      const result = await registry.planAdmit(admitted.nextRegistry, request);
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'HASH_MISMATCH');
    });

    it('rejects definition scope room mismatches', async() => {
      const { registry, admitted } = await seeded();
      const request = admitReq(52, defBase(), 1);
      request.definition.scope.roomId = 'other-room';
      const result = await registry.planAdmit(admitted.nextRegistry, request);
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'SCOPE_MISMATCH');
    });

    it('rejects request room mismatches against the registry', async() => {
      const { registry, admitted } = await seeded();
      const request = admitReq(53, defBase(), 1);
      request.roomId = 'other-room';
      const result = await registry.planAdmit(admitted.nextRegistry, request);
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'SCOPE_MISMATCH');
    });

    it('rejects existing-version overwrites with VERSION_EXISTS', async() => {
      const { registry, admitted } = await seeded();
      const result = await registry.planAdmit(admitted.nextRegistry, admitReq(54, defV(1, 'Renamed At Same Version'), 1));
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'VERSION_EXISTS');
    });

    it('rejects version gaps with VERSION_SEQUENCE', async() => {
      const { registry, admitted } = await seeded();
      const result = await registry.planAdmit(admitted.nextRegistry, admitReq(55, defV(3, 'Skipped Version'), 1));
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'VERSION_SEQUENCE');
    });

    it('rejects same requestId with changed content with REQUEST_ID_CONFLICT', async() => {
      const { registry, admitted } = await seeded();
      const result = await registry.planAdmit(admitted.nextRegistry, admitReq(1, defV(2, 'Changed Content'), 1));
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'REQUEST_ID_CONFLICT');
    });

    it('rejects a replay under a different principal with REQUEST_ID_CONFLICT', async() => {
      const { admitted } = await seeded();
      const otherRegistry = makeRegistry('gm-2002');
      const result = await otherRegistry.planAdmit(admitted.nextRegistry, admitReq(1, defBase(), 0));
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'REQUEST_ID_CONFLICT');
    });

    it('rejects revoking unknown versions with DEFINITION_NOT_FOUND', async() => {
      const { registry, admitted } = await seeded();
      const result = await registry.planRevoke(admitted.nextRegistry, revokeReq(56, {
        roomId: ROOM,
        definitionId: '11111111-1111-4111-8111-111111111111',
        definitionVersion: 9,
        definitionHash: admitted.definitionRef.definitionHash
      }, 1));
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'DEFINITION_NOT_FOUND');
    });

    it('rejects revokes with altered reference hashes with HASH_MISMATCH', async() => {
      const { registry, admitted } = await seeded();
      const ref = clone(admitted.definitionRef);
      ref.definitionHash = 'a'.repeat(64);
      const result = await registry.planRevoke(admitted.nextRegistry, revokeReq(57, ref, 1));
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'HASH_MISMATCH');
    });

    it('rejects revokes for other rooms with SCOPE_MISMATCH', async() => {
      const { registry, admitted } = await seeded();
      const ref = clone(admitted.definitionRef);
      ref.roomId = 'other-room';
      const result = await registry.planRevoke(admitted.nextRegistry, revokeReq(58, ref, 1));
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'SCOPE_MISMATCH');
    });

    it('rejects double revokes with ALREADY_REVOKED and re-admits with DEFINITION_REVOKED', async() => {
      const { registry, revoked, first } = await buildRich();
      const doubleRevoke = await registry.planRevoke(revoked.nextRegistry, revokeReq(59, first.definitionRef, 3));
      assert.strictEqual(doubleRevoke.ok, false);
      assert.strictEqual(doubleRevoke.code, 'ALREADY_REVOKED');

      const reAdmit = await registry.planAdmit(revoked.nextRegistry, admitReq(60, defBase(), 3));
      assert.strictEqual(reAdmit.ok, false);
      assert.strictEqual(reAdmit.code, 'DEFINITION_REVOKED');
    });

    it('keeps an original admit replay idempotent after later revocation', async() => {
      const { registry, revoked } = await buildRich();
      const replay = await registry.planAdmit(revoked.nextRegistry, admitReq(1, defBase(), 0));
      assert.strictEqual(replay.ok, true);
      assert.strictEqual(replay.kind, 'replay');
      assert.strictEqual(replay.currentRegistryRevision, 3);
    });

    it('rejects malformed request envelopes before authorization', async() => {
      let calls = 0;
      const registry = definitions.createDefinitionRegistry({
        authorize: () => { calls += 1; return Promise.resolve(successData(ROOM, GM)); }
      });
      const base = definitions.emptyRegistry(ROOM);

      const badId = admitReq(61, defBase(), 0);
      badId.requestId = 'not-a-uuid';
      assert.strictEqual((await registry.planAdmit(base, badId)).code, 'INVALID_DEFINITION');

      const extra = admitReq(62, defBase(), 0);
      extra.isGM = true;
      assert.strictEqual((await registry.planAdmit(base, extra)).code, 'INVALID_DEFINITION');

      const missing = admitReq(63, defBase(), 0);
      delete missing.expectedDefinitionHash;
      assert.strictEqual((await registry.planAdmit(base, missing)).code, 'INVALID_DEFINITION');

      const badRev = revokeReq(64, { roomId: ROOM, definitionId: uuid(1), definitionVersion: 1, definitionHash: 'z'.repeat(64) }, 0);
      assert.strictEqual((await registry.planRevoke(base, badRev)).code, 'INVALID_DEFINITION');

      const corruptRegistry = { schemaVersion: 1, roomId: ROOM, revision: 1, definitions: [], decisions: [] };
      assert.strictEqual((await registry.planAdmit(corruptRegistry, admitReq(65, defBase(), 0))).code, 'INVALID_REGISTRY');
      assert.strictEqual(calls, 0);

      const scopeRevoke = await registry.planRevoke(
        base,
        revokeReq(66, { roomId: 'other-room', definitionId: uuid(1), definitionVersion: 1, definitionHash: 'a'.repeat(64) }, 0)
      );
      assert.strictEqual(scopeRevoke.code, 'SCOPE_MISMATCH');
    });

    it('rejects requests carrying getters without invoking them and without authorizing', async() => {
      let getterCalls = 0;
      let authorizeCalls = 0;
      const registry = definitions.createDefinitionRegistry({
        authorize: () => { authorizeCalls += 1; return Promise.resolve(successData(ROOM, GM)); }
      });
      const base = definitions.emptyRegistry(ROOM);
      const evil = admitReq(67, defBase(), 0);
      delete evil.roomId;
      Object.defineProperty(evil, 'roomId', {
        enumerable: true,
        get() { getterCalls += 1; return ROOM; }
      });
      const result = await registry.planAdmit(base, evil);
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'INVALID_DEFINITION');
      assert.strictEqual(getterCalls, 0);
      assert.strictEqual(authorizeCalls, 0);
    });
  });

  describe('authority port', () => {
    const attempt = async(authorize) => {
      const registry = definitions.createDefinitionRegistry({ authorize });
      return registry.planAdmit(definitions.emptyRegistry(ROOM), admitReq(70, defBase(), 0));
    };

    it('throws TypeError for missing or non-function authorizers', () => {
      assert.throws(() => definitions.createDefinitionRegistry(), TypeError);
      assert.throws(() => definitions.createDefinitionRegistry({}), TypeError);
      assert.throws(() => definitions.createDefinitionRegistry({ authorize: 'x' }), TypeError);
      assert.throws(() => definitions.createDefinitionRegistry(null), TypeError);
    });

    const authorityFailures = [
      ['absent result', () => Promise.resolve(undefined), 'AUTHORITY_UNAVAILABLE'],
      ['false result', () => Promise.resolve({ ok: false, reason: 'nginx' }), 'AUTHORITY_UNAVAILABLE'],
      ['thrown result', () => Promise.reject(new Error('boom')), 'AUTHORITY_UNAVAILABLE'],
      ['non-record result', () => Promise.resolve('gm'), 'AUTHORITY_UNAVAILABLE'],
      ['wrong room', () => Promise.resolve({ ...successData('other-room', GM) }), 'SCOPE_MISMATCH'],
      ['unbound principal', () => Promise.resolve({ ...successData(ROOM, GM), principalBound: false }), 'FORBIDDEN'],
      ['uid and gmUid mismatch', () => Promise.resolve({ ...successData(ROOM, GM), gmUid: 'gm-9999' }), 'FORBIDDEN'],
      ['stale authority', () => Promise.resolve({ ...successData(ROOM, GM), authorityCurrent: false }), 'AUTHORITY_UNAVAILABLE'],
      ['wrong policy', () => Promise.resolve({ ...successData(ROOM, GM), rulesetId: 'dnd5e' }), 'AUTHORITY_UNAVAILABLE'],
      ['empty uid', () => Promise.resolve({ ...successData(ROOM, GM), uid: '', gmUid: '' }), 'AUTHORITY_UNAVAILABLE']
    ];

    authorityFailures.forEach(([label, authorize, expectedCode]) => {
      it(`fails closed for ${label} with ${expectedCode}`, async() => {
        const result = await attempt(authorize);
        assert.strictEqual(result.ok, false);
        assert.strictEqual(result.code, expectedCode);
      });
    });
  });

  describe('HeadQ input ownership before authorization', () => {
    it('binds admit results to pre-await snapshots and never mutates or freezes caller inputs', async() => {
      let release;
      const gate = new Promise((resolve) => { release = resolve; });
      const registry = definitions.createDefinitionRegistry({
        authorize: () => gate.then(() => successData(ROOM, GM))
      });

      const callerRegistry = clone(definitions.emptyRegistry(ROOM));
      const request = admitReq(7, defBase(), 0);
      const pending = registry.planAdmit(callerRegistry, request);

      request.requestId = uuid(9999);
      request.expectedRegistryRevision = 50;
      request.expectedDefinitionHash = 'f'.repeat(64);
      request.definition.definitionVersion = 77;
      request.definition.resourceCost.actionPoints = 9;
      request.definition.effect.formula = '9d9';
      callerRegistry.revision = 50;
      callerRegistry.definitions.push({ forged: true });
      callerRegistry.decisions.push({ forged: true });

      release();
      const result = await pending;

      assert.strictEqual(result.ok, true);
      assert.strictEqual(result.kind, 'transition');
      assert.strictEqual(result.expectedRegistryRevision, 0);
      assert.strictEqual(result.decision.requestId, uuid(7));
      assert.strictEqual(result.definitionRef.definitionVersion, 1);
      assert.strictEqual(result.definitionRef.definitionHash, fixture.vectors[0].definitionHash);
      assert.strictEqual(result.nextRegistry.revision, 1);
      assert.strictEqual(result.nextRegistry.definitions.length, 1);
      assert.strictEqual(result.nextRegistry.definitions[0].canonicalDefinition.resourceCost.actionPoints, 0);
      assert.strictEqual(result.nextRegistry.definitions[0].canonicalDefinition.effect.formula, '1d6+2');

      assert.strictEqual(request.requestId, uuid(9999));
      assert.strictEqual(request.definition.resourceCost.actionPoints, 9);
      assert.strictEqual(callerRegistry.revision, 50);
      assert.strictEqual(callerRegistry.definitions.length, 1);
      assert.strictEqual(Object.isFrozen(request), false);
      assert.strictEqual(Object.isFrozen(request.definition), false);
      assert.strictEqual(Object.isFrozen(callerRegistry), false);
      assert.strictEqual(Object.isFrozen(callerRegistry.definitions), false);
    });

    it('binds revoke results to pre-await snapshots under mutation while pending', async() => {
      let release;
      const gate = new Promise((resolve) => { release = resolve; });
      let deferred = false;
      const registry = definitions.createDefinitionRegistry({
        authorize: () => (deferred ? gate.then(() => successData(ROOM, GM)) : Promise.resolve(successData(ROOM, GM)))
      });

      const base = definitions.emptyRegistry(ROOM);
      const admitted = await registry.planAdmit(base, admitReq(8, defBase(), 0));
      assert.strictEqual(admitted.ok, true);

      deferred = true;
      const callerRegistry = clone(admitted.nextRegistry);
      const request = revokeReq(9, admitted.definitionRef, 1);
      const pending = registry.planRevoke(callerRegistry, request);

      request.expectedRegistryRevision = 40;
      request.definitionRef.definitionHash = 'f'.repeat(64);
      request.definitionRef.definitionVersion = 40;
      callerRegistry.revision = 40;
      callerRegistry.decisions.push({ forged: true });

      release();
      const result = await pending;

      assert.strictEqual(result.ok, true);
      assert.strictEqual(result.kind, 'transition');
      assert.strictEqual(result.expectedRegistryRevision, 1);
      assert.strictEqual(result.decision.requestId, uuid(9));
      assert.strictEqual(result.decision.action, 'revoke');
      assert.strictEqual(result.definitionRef.definitionHash, fixture.vectors[0].definitionHash);
      assert.strictEqual(result.nextRegistry.revision, 2);
      assert.strictEqual(result.nextRegistry.decisions.length, 2);

      assert.strictEqual(request.expectedRegistryRevision, 40);
      assert.strictEqual(callerRegistry.revision, 40);
      assert.strictEqual(Object.isFrozen(request), false);
      assert.strictEqual(Object.isFrozen(request.definitionRef), false);
      assert.strictEqual(Object.isFrozen(callerRegistry), false);
    });

    it('rejects malformed original inputs before the authorizer is invoked', async() => {
      let calls = 0;
      const registry = definitions.createDefinitionRegistry({
        authorize: () => { calls += 1; return Promise.resolve(successData(ROOM, GM)); }
      });
      const base = definitions.emptyRegistry(ROOM);
      const invalid = admitReq(71, defBase(), 0);
      invalid.expectedRegistryRevision = -1;
      const result = await registry.planAdmit(base, invalid);
      assert.strictEqual(result.ok, false);
      assert.strictEqual(result.code, 'INVALID_DEFINITION');
      assert.strictEqual(calls, 0);
    });
  });

  describe('HeadQ complete history validation', () => {
    const describeParams = (snapshot, definitionVersion) => ({
      definitionRef: clone(entryRef(snapshot, definitionVersion)),
      expectedBinding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'arcanoneer' }
    });

    const assertCorrupt = async(snapshot, expectedCode = 'INVALID_REGISTRY') => {
      const encoded = definitions.encodeRegistry(clone(snapshot));
      assert.strictEqual(encoded.ok, false, 'encode must reject');
      assert.strictEqual(encoded.code, expectedCode, 'encode code');

      const decoded = definitions.decodeRegistry(JSON.stringify(snapshot));
      assert.strictEqual(decoded.ok, false, 'decode must reject');
      assert.strictEqual(decoded.code, expectedCode, 'decode code');

      const registry = makeRegistry();
      const admitted = await registry.planAdmit(clone(snapshot), admitReq(801, defBase(), 0));
      assert.strictEqual(admitted.ok, false, 'planAdmit must reject');
      assert.strictEqual(admitted.code, expectedCode, 'planAdmit code');

      const revoked = await registry.planRevoke(clone(snapshot), revokeReq(802, {
        roomId: ROOM,
        definitionId: '11111111-1111-4111-8111-111111111111',
        definitionVersion: 1,
        definitionHash: 'a'.repeat(64)
      }, 0));
      assert.strictEqual(revoked.ok, false, 'planRevoke must reject');
      assert.strictEqual(revoked.code, expectedCode, 'planRevoke code');

      const described = registry.describe(clone(snapshot), describeParams(
        snapshot,
        snapshot.definitions.length > 0 ? snapshot.definitions[0].definitionRef.definitionVersion : 1
      ));
      assert.strictEqual(described.ok, false, 'describe must reject');
      assert.strictEqual(described.code, expectedCode, 'describe code');
    };

    it('accepts the rich valid registry and rejects nothing about it', async() => {
      const { snapshot } = await buildRich();
      assert.strictEqual(definitions.encodeRegistry(snapshot).ok, true);
      const decoded = definitions.decodeRegistry(JSON.stringify(snapshot));
      assert.strictEqual(decoded.ok, true);
      assert.deepStrictEqual(decoded.registry, snapshot);
    });

    it('rejects duplicate request IDs across admit and revoke', async() => {
      const { snapshot } = await buildRich();
      const corrupt = clone(snapshot);
      const duplicateId = corrupt.decisions[0].requestId;
      corrupt.decisions[2].requestId = duplicateId;
      corrupt.decisions[2].requestHash = revokeDecisionHash(ROOM, duplicateId, 2, corrupt.decisions[2].definitionRef);
      await assertCorrupt(corrupt);
    });

    it('rejects version gaps and out-of-order admissions', async() => {
      const { snapshot } = await buildRich();
      const entry = clone(snapshot.definitions[1]);
      const requestId = uuid(321);
      const versionGap = {
        schemaVersion: 1,
        roomId: ROOM,
        revision: 1,
        definitions: [entry],
        decisions: [{
          requestId,
          requestHash: admitDecisionHash(ROOM, requestId, 0, entry),
          byUid: GM,
          sequence: 1,
          action: 'admit',
          definitionRef: clone(entry.definitionRef)
        }]
      };
      await assertCorrupt(versionGap);

      const first = clone(snapshot.definitions[0]);
      const second = clone(snapshot.definitions[1]);
      const idFirst = uuid(331);
      const idSecond = uuid(332);
      const outOfOrder = {
        schemaVersion: 1,
        roomId: ROOM,
        revision: 2,
        definitions: [first, second],
        decisions: [
          { requestId: idFirst, requestHash: admitDecisionHash(ROOM, idFirst, 0, second), byUid: GM, sequence: 1, action: 'admit', definitionRef: clone(second.definitionRef) },
          { requestId: idSecond, requestHash: admitDecisionHash(ROOM, idSecond, 1, first), byUid: GM, sequence: 2, action: 'admit', definitionRef: clone(first.definitionRef) }
        ]
      };
      await assertCorrupt(outOfOrder);
    });

    it('rejects orphan and duplicate admissions', async() => {
      const { snapshot } = await buildRich();
      const first = clone(snapshot.definitions[0]);
      const second = clone(snapshot.definitions[1]);
      const idOne = uuid(341);
      const idTwo = uuid(342);
      const orphan = {
        schemaVersion: 1,
        roomId: ROOM,
        revision: 2,
        definitions: [first],
        decisions: [
          { requestId: idOne, requestHash: admitDecisionHash(ROOM, idOne, 0, first), byUid: GM, sequence: 1, action: 'admit', definitionRef: clone(first.definitionRef) },
          { requestId: idTwo, requestHash: admitDecisionHash(ROOM, idTwo, 1, second), byUid: GM, sequence: 2, action: 'admit', definitionRef: clone(second.definitionRef) }
        ]
      };
      await assertCorrupt(orphan);

      const idThree = uuid(343);
      const duplicate = {
        schemaVersion: 1,
        roomId: ROOM,
        revision: 2,
        definitions: [first],
        decisions: [
          { requestId: idOne, requestHash: admitDecisionHash(ROOM, idOne, 0, first), byUid: GM, sequence: 1, action: 'admit', definitionRef: clone(first.definitionRef) },
          { requestId: idThree, requestHash: admitDecisionHash(ROOM, idThree, 1, first), byUid: GM, sequence: 2, action: 'admit', definitionRef: clone(first.definitionRef) }
        ]
      };
      await assertCorrupt(duplicate);
    });

    it('rejects dangling, wrong-hash, unknown, doubled and early revocations', async() => {
      const { snapshot } = await buildRich();
      const first = clone(snapshot.definitions[0]);

      const unknownRef = clone(first.definitionRef);
      unknownRef.definitionVersion = 9;
      const idOne = uuid(351);
      const unknownRevoke = {
        schemaVersion: 1,
        roomId: ROOM,
        revision: 2,
        definitions: [first],
        decisions: [
          { requestId: idOne, requestHash: admitDecisionHash(ROOM, idOne, 0, first), byUid: GM, sequence: 1, action: 'admit', definitionRef: clone(first.definitionRef) },
          { requestId: uuid(352), requestHash: revokeDecisionHash(ROOM, uuid(352), 1, unknownRef), byUid: GM, sequence: 2, action: 'revoke', definitionRef: unknownRef }
        ]
      };
      await assertCorrupt(unknownRevoke);

      const wrongHashRef = clone(first.definitionRef);
      wrongHashRef.definitionHash = 'b'.repeat(64);
      const idThree = uuid(353);
      const wrongHash = {
        schemaVersion: 1,
        roomId: ROOM,
        revision: 2,
        definitions: [first],
        decisions: [
          { requestId: idOne, requestHash: admitDecisionHash(ROOM, idOne, 0, first), byUid: GM, sequence: 1, action: 'admit', definitionRef: clone(first.definitionRef) },
          { requestId: idThree, requestHash: revokeDecisionHash(ROOM, idThree, 1, wrongHashRef), byUid: GM, sequence: 2, action: 'revoke', definitionRef: wrongHashRef }
        ]
      };
      await assertCorrupt(wrongHash);

      const idFour = uuid(354);
      const idFive = uuid(355);
      const doubleRevoke = {
        schemaVersion: 1,
        roomId: ROOM,
        revision: 3,
        definitions: [first],
        decisions: [
          { requestId: idOne, requestHash: admitDecisionHash(ROOM, idOne, 0, first), byUid: GM, sequence: 1, action: 'admit', definitionRef: clone(first.definitionRef) },
          { requestId: idFour, requestHash: revokeDecisionHash(ROOM, idFour, 1, first.definitionRef), byUid: GM, sequence: 2, action: 'revoke', definitionRef: clone(first.definitionRef) },
          { requestId: idFive, requestHash: revokeDecisionHash(ROOM, idFive, 2, first.definitionRef), byUid: GM, sequence: 3, action: 'revoke', definitionRef: clone(first.definitionRef) }
        ]
      };
      await assertCorrupt(doubleRevoke);

      const idSix = uuid(356);
      const idSeven = uuid(357);
      const earlyRevoke = {
        schemaVersion: 1,
        roomId: ROOM,
        revision: 2,
        definitions: [first],
        decisions: [
          { requestId: idSix, requestHash: revokeDecisionHash(ROOM, idSix, 0, first.definitionRef), byUid: GM, sequence: 1, action: 'revoke', definitionRef: clone(first.definitionRef) },
          { requestId: idSeven, requestHash: admitDecisionHash(ROOM, idSeven, 1, first), byUid: GM, sequence: 2, action: 'admit', definitionRef: clone(first.definitionRef) }
        ]
      };
      await assertCorrupt(earlyRevoke);
    });

    it('rejects gapped sequences, revision mismatches and inconsistent request hashes', async() => {
      const { snapshot } = await buildRich();

      const gapped = clone(snapshot);
      gapped.decisions[0].sequence = 2;
      await assertCorrupt(gapped);

      const revisionMismatch = clone(snapshot);
      revisionMismatch.revision = 4;
      await assertCorrupt(revisionMismatch);

      const inconsistentHash = clone(snapshot);
      inconsistentHash.decisions[0].requestHash = '0'.repeat(64);
      await assertCorrupt(inconsistentHash);

      const countMismatch = clone(snapshot);
      countMismatch.decisions.pop();
      await assertCorrupt(countMismatch);
    });

    it('rejects future registry schemas and unknown compiler versions through every consumer', async() => {
      const { snapshot } = await buildRich();
      const future = clone(snapshot);
      future.schemaVersion = 2;
      await assertCorrupt(future, 'UNSUPPORTED_REGISTRY_VERSION');

      const unknownCompiler = clone(snapshot);
      unknownCompiler.definitions[0].compilerVersion = 'cr-a1a-2';
      await assertCorrupt(unknownCompiler, 'UNSUPPORTED_REGISTRY_VERSION');
    });
  });

  describe('describe operation', () => {
    it('describes a valid non-revoked version as modeled-only', async() => {
      const { registry, snapshot, second } = await buildRich();
      const described = registry.describe(snapshot, {
        definitionRef: second.definitionRef,
        expectedBinding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'arcanoneer' }
      });
      assert.strictEqual(described.ok, true);
      assert.strictEqual(described.admissionState, 'modeled-only');
      assert.deepStrictEqual(described.descriptor, {
        ...clone(fixture.vectors[0].descriptor),
        definitionRef: clone(second.definitionRef)
      });
      assert.strictEqual(Object.isFrozen(described.descriptor), true);
    });

    it('returns no descriptor for unknown, modified, mismatched or revoked records', async() => {
      const { registry, snapshot, first } = await buildRich();

      const unknown = registry.describe(snapshot, {
        definitionRef: { ...clone(first.definitionRef), definitionVersion: 9 },
        expectedBinding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'arcanoneer' }
      });
      assert.strictEqual(unknown.code, 'DEFINITION_NOT_FOUND');

      const modified = registry.describe(snapshot, {
        definitionRef: { ...clone(first.definitionRef), definitionHash: 'c'.repeat(64) },
        expectedBinding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'arcanoneer' }
      });
      assert.strictEqual(modified.code, 'HASH_MISMATCH');

      const wrongRoom = registry.describe(snapshot, {
        definitionRef: { ...clone(first.definitionRef), roomId: 'other-room' },
        expectedBinding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'arcanoneer' }
      });
      assert.strictEqual(wrongRoom.code, 'SCOPE_MISMATCH');

      const wrongBinding = registry.describe(snapshot, {
        definitionRef: clone(first.definitionRef),
        expectedBinding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'warden' }
      });
      assert.strictEqual(wrongBinding.code, 'UNSUPPORTED_BINDING');

      const revoked = registry.describe(snapshot, {
        definitionRef: clone(first.definitionRef),
        expectedBinding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'arcanoneer' }
      });
      assert.strictEqual(revoked.code, 'DEFINITION_REVOKED');
    });

    it('rejects malformed describe params', async() => {
      const { registry, snapshot } = await buildRich();
      assert.strictEqual(registry.describe(snapshot, null).code, 'INVALID_DEFINITION');
      assert.strictEqual(registry.describe(snapshot, {}).code, 'INVALID_DEFINITION');
      assert.strictEqual(registry.describe(snapshot, {
        definitionRef: { roomId: ROOM },
        expectedBinding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'arcanoneer' }
      }).code, 'INVALID_DEFINITION');
    });
  });

  describe('capacity bounds', () => {
    it('refuses a 129th definition version with CAPACITY instead of evicting', async() => {
      const registry = makeRegistry();
      let snapshot = definitions.emptyRegistry(ROOM);
      const refs = [];
      for (let version = 1; version <= 128; version += 1) {
        const result = await registry.planAdmit(snapshot, admitReq(1000 + version, defV(version, `Capacity ${version}`), version - 1));
        assert.strictEqual(result.ok, true, `admit version ${version}`);
        snapshot = result.nextRegistry;
        refs.push(result.definitionRef);
      }
      assert.strictEqual(snapshot.definitions.length, 128);
      const overflow = await registry.planAdmit(snapshot, admitReq(9999, defV(129, 'Capacity 129'), 128));
      assert.strictEqual(overflow.ok, false);
      assert.strictEqual(overflow.code, 'CAPACITY');
      assert.strictEqual(snapshot.definitions.length, 128);
    });

    it('refuses over-count snapshots with CAPACITY instead of evicting', async() => {
      const { registry, snapshot } = await buildRich();
      const ref = entryRef(snapshot, 2);

      const paddedDecisions = [];
      while (paddedDecisions.length <= 256) { paddedDecisions.push(clone(snapshot.decisions[0])); }
      const overDecisions = {
        schemaVersion: snapshot.schemaVersion,
        roomId: snapshot.roomId,
        revision: paddedDecisions.length,
        definitions: clone(snapshot.definitions),
        decisions: paddedDecisions
      };
      assert.strictEqual(definitions.encodeRegistry(overDecisions).code, 'CAPACITY');
      assert.strictEqual(definitions.decodeRegistry(JSON.stringify(overDecisions)).code, 'CAPACITY');
      assert.strictEqual((await registry.planAdmit(overDecisions, admitReq(88, defBase(), 3))).code, 'CAPACITY');
      assert.strictEqual((await registry.planRevoke(overDecisions, revokeReq(89, ref, 3))).code, 'CAPACITY');
      assert.strictEqual(registry.describe(overDecisions, {
        definitionRef: ref,
        expectedBinding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'arcanoneer' }
      }).code, 'CAPACITY');

      const paddedDefinitions = [];
      while (paddedDefinitions.length <= 128) { paddedDefinitions.push(clone(snapshot.definitions[1])); }
      const overDefinitions = { ...clone(snapshot), definitions: paddedDefinitions };
      assert.strictEqual(definitions.encodeRegistry(overDefinitions).code, 'CAPACITY');
      assert.strictEqual((await registry.planAdmit(overDefinitions, admitReq(90, defBase(), 3))).code, 'CAPACITY');
    });

    it('refuses snapshots over the 256 KiB byte budget with CAPACITY', async() => {
      const registry = makeRegistry();
      let snapshot = definitions.emptyRegistry(ROOM);
      let capacitySeen = false;
      for (let version = 1; version <= 90; version += 1) {
        const definition = defV(version, `Bytes ${version}`);
        definition.description = 'a'.repeat(3900);
        const result = await registry.planAdmit(snapshot, admitReq(7000 + version, definition, version - 1));
        if (!result.ok) {
          assert.strictEqual(result.code, 'CAPACITY');
          capacitySeen = true;
          break;
        }
        snapshot = result.nextRegistry;
      }
      assert.strictEqual(capacitySeen, true);
      assert.strictEqual(definitions.encodeRegistry(snapshot).ok, true);
    });
  });

  describe('module hygiene', () => {
    it('requires only the read-only roomCheckpoint helpers', () => {
      const requires = serviceSource.match(/require\([^)]*\)/g) || [];
      assert.deepStrictEqual(requires, ['require(\'./roomCheckpoint\')']);
    });

    it('contains no execution, network, filesystem or dynamic code paths', () => {
      assert.strictEqual(/\beval\s*\(/.test(serviceSource), false);
      assert.strictEqual(/new\s+Function/.test(serviceSource), false);
      assert.strictEqual(/require\('vm'\)|require\("vm"\)/.test(serviceSource), false);
      assert.strictEqual(/\b(child_process|http|https|net|fs|firebase|react|socket)\b/i.test(serviceSource), false);
    });

    it('keeps all compiled artifacts execution-disabled', async() => {
      const { admitted } = await seeded();
      assert.strictEqual(admitted.descriptor.executionEnabled, false);
      assert.strictEqual(admitted.installed, false);
      assert.strictEqual(admitted.nextRegistry.definitions[0].descriptor.executionEnabled, false);
    });
  });
});
