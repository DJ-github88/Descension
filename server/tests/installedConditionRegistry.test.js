const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const registry = require('../services/installedDefinitionRegistry');
const legacy = require('../services/authoredSpellDefinitions');
const pure = require('../../vtt-react/src/services/authoredAbility');
function definition(name = 'Registry witness') {
  return { schemaVersion: 2, capability: pure.CONDITION_CAPABILITY, scope: { roomId: 'room' }, definitionId: uuid(), definitionVersion: 1,
    name, description: '', binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'arcanoneer' }, spellType: 'ACTION', castTimeType: 'IMMEDIATE',
    targeting: { kind: 'single', maxTargets: 1, rangeFeet: 30, restriction: 'any' }, resourceCost: { actionPoints: 0, mana: 0 },
    effect: { kind: 'condition', conditionKey: 'stunned' }, timing: { expiryPolicy: 'gm-manual', durationText: 'Unresolved authored boundary', authoredDuration: { durationType: 'other', note: 'No unit conversion' }, gmNote: 'GM rules eligibility and saves' } };
}
const authority = async() => ({ ok: true, roomId: 'room', uid: 'gm', gmUid: 'gm', principalBound: true, authorityCurrent: true, rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1' });
const request = (r, d) => ({ roomId: r.roomId, requestId: uuid(), expectedRegistryRevision: r.revision, definition: d, expectedDefinitionHash: registry.compileDefinition(d).definitionHash });
describe('A7 companion in the existing installed definition registry', () => {
  it('round-trips legacy + condition + legacy, sequential versions, revocation and immutable snapshots', async() => {
    let r = legacy.emptyRegistry('room'); const planner = registry.createDefinitionRegistry({ authorize: authority });
    const old = definition(); delete old.capability; delete old.timing; old.schemaVersion = 1; old.effect = { kind: 'healing', formula: '1d6' };
    let p = await planner.planAdmit(r, request(r, old)); assert.equal(p.ok, true); r = p.nextRegistry;
    const d = definition(); p = await planner.planAdmit(r, request(r, d)); assert.equal(p.ok, true); r = p.nextRegistry; assert.equal(r.schemaVersion, 2);
    old.definitionVersion = 2; p = await planner.planAdmit(r, request(r, old)); assert.equal(p.ok, true); r = p.nextRegistry;
    assert.equal(registry.decodeRegistry(registry.encodeRegistry(r).json).ok, true); assert.equal(legacy.decodeRegistry(JSON.stringify(r)).ok, false);
    const before = JSON.stringify(r), q = { roomId: 'room', requestId: uuid(), expectedRegistryRevision: r.revision, definitionRef: r.definitions[1].definitionRef };
    p = await planner.planRevoke(r, q); assert.equal(p.ok, true); assert.equal(JSON.stringify(r), before); assert.equal(registry.decodeRegistry(JSON.stringify(p.nextRegistry)).ok, true);
    assert.equal((await planner.planRevoke(p.nextRegistry, q)).kind, 'replay');
    for (const mutate of [v => { v.definitions[1].canonicalDefinition.timing.expiryPolicy = 'auto'; }, v => { v.definitions[1].descriptor.executionEnabled = true; }, v => { v.decisions[1].requestHash = 'a'.repeat(64); }, v => { v.decisions[1].definitionRef.definitionHash = 'a'.repeat(64); }]) { const v = JSON.parse(before); mutate(v); assert.equal(registry.decodeRegistry(JSON.stringify(v)).ok, false); }
  });
  it('captures request bytes before await and rejects lossy shapes without invoking getters', async() => {
    let release, entered; const gate = new Promise(r => { release = r; }), seen = new Promise(r => { entered = r; });
    const r = legacy.emptyRegistry('room'), d = definition(), q = request(r, d);
    const planner = registry.createDefinitionRegistry({ authorize: async() => { entered(); await gate; return authority(); } });
    const pending = planner.planAdmit(r, q); await seen; q.definition.name = 'Mutated while awaiting'; release(); const result = await pending;
    assert.equal(result.ok, true); assert.equal(result.nextRegistry.definitions[0].canonicalDefinition.name, 'Registry witness');
    let invoked = false; const v = definition(); Object.defineProperty(v, 'capability', { enumerable: true, get() { invoked = true; return pure.CONDITION_CAPABILITY; } });
    assert.equal(registry.compileDefinition(v).ok, false); assert.equal(invoked, false);
    const symbol = definition(); symbol[Symbol('hidden')] = true; assert.equal(registry.compileDefinition(symbol).ok, false);
  });
});
