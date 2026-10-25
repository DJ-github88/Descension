/** P14-A1 thin A1a lookup. Installation stays with P7's admission owner. */
const definitions = require('./installedDefinitionRegistry');
const actors = require('./actorConsequences');
const pure = require('../../vtt-react/src/services/authoredAbility');
function registry(room) {
  if (room.gameState.authoredSpellRegistry === undefined) return definitions.emptyRegistry(room.id);
  const result = definitions.decodeRegistry(JSON.stringify(room.gameState.authoredSpellRegistry));
  if (!result.ok || result.registry.roomId !== room.id) actors.fail('invalid_authored_registry');
  return result.registry;
}
function list(room) {
  const r = registry(room);
  const sourceRequests = new Set((actors.ledger(room).authoredSourceAdmissions || []).map(e => e.requestId));
  return { revision: r.revision, entries: r.definitions.map(entry => ({ ...actors.clone(entry),
    creatureOnly: r.decisions.some(d => d.action === 'admit' && sourceRequests.has(d.requestId) && pure.actionId(d.definitionRef) === pure.actionId(entry.definitionRef)),
    revoked: r.decisions.some(d => d.action === 'revoke' && pure.actionId(d.definitionRef) === pure.actionId(entry.definitionRef)) })) };
}
function lookup(room, spell) {
  const entry = list(room).entries.find(e => pure.actionId(e.definitionRef) === spell.definitionId);
  if (!entry) actors.fail('definition_not_admitted');
  if (entry.revoked) actors.fail('definition_revoked');
  return entry;
}
// A4: an exact placed binding, never the compiler's legacy class vocabulary, grants this route.
function creatureSource(room, ref) {
  if (ref.kind !== 'creature') actors.fail('creature_source_required');
  const source = actors.locate(room, ref);
  if (source.token.character || source.token.id !== ref.tokenId) actors.fail('creature_source_required');
  const association = source.token.authoredAbility;
  if (association?.schemaVersion !== 1 || !association.record) actors.fail('creature_association_required');
  return { ...source, association };
}
function matchAssociation(room, association, entry) {
  const d = entry.canonicalDefinition;
  const mapped = pure.definitionFromWizard(association.record, { roomId: room.id, classId: d.binding.classId, definitionVersion: d.definitionVersion });
  if (!mapped.ok || actors.hash(mapped.definition) !== actors.hash(d)) actors.fail('creature_association_mismatch');
}
function creatureSources(room) {
  return Object.values(room.gameState.maps || {}).flatMap(map => Object.values(map.tokens || {}).flatMap(token => {
    const c = token.state?.actorContract;
    return c?.kind === 'creature' ? [{ source: actors.refFor(c), admission: c.authoredAdmission ? actors.clone(c.authoredAdmission) : null,
      ...(token.authoredAbility !== undefined ? { association: actors.clone(token.authoredAbility) } : {}),
      defenses: actors.clone({ flatDR: token.stats?.damageReduction ?? token.creature?.stats?.damageReduction ?? null,
        resistances: token.resistances ?? token.stats?.resistances ?? {}, vulnerabilities: token.vulnerabilities ?? token.stats?.vulnerabilities ?? {}, authoredAbilities: token.abilities ?? [] }) }] : [];
  }));
}
async function planCreatureAdmission(room, uid, data, authorize) {
  const source = creatureSource(room, data.source), before = registry(room), requestHash = actors.hash(data);
  const ledgerBefore = actors.clone(actors.ledger(room)), history = ledgerBefore.authoredSourceAdmissions || [];
  if (!Array.isArray(history) || history.length > 256) actors.fail('invalid_authored_admissions');
  const priorRequest = history.find(e => e.requestId === data.requestId);
  if (priorRequest && (priorRequest.requestHash !== requestHash || priorRequest.gmUid !== uid)) actors.fail('REQUEST_ID_CONFLICT');
  if (!priorRequest && before.decisions.some(e => e.requestId === data.requestId)) actors.fail('REQUEST_ID_CONFLICT');
  const old = source.contract.authoredAdmission;
  if (old?.requestId === data.requestId) {
    if (old.requestHash !== requestHash || old.gmUid !== uid) actors.fail('REQUEST_ID_CONFLICT');
    await authorize();
    const latest = creatureSource(room, data.source);
    if (actors.hash(latest.contract.authoredAdmission) !== actors.hash(old) || actors.hash(latest.association) !== old.associationHash) actors.fail('creature_admission_changed');
    lookup(room, { definitionId: pure.actionId(old.definitionRef) });
    return { definitionRef: old.definitionRef };
  }
  if (priorRequest) actors.fail('creature_admission_changed');
  if (history.length >= 256) actors.fail('admission_capacity');
  if (!Number.isSafeInteger(data.expectedSourceRevision) || source.contract.revision !== data.expectedSourceRevision) actors.fail('stale_actor_revision');
  if (data.expectedRegistryRevision !== before.revision) actors.fail('REVISION_CONFLICT');
  if (!/^[0-9a-f-]{36}$/i.test(data.requestId || '')) actors.fail('invalid_consequence');
  const mapped = pure.definitionFromWizard(source.association.record, { roomId: room.id, classId: 'arcanoneer', definitionVersion: data.definitionVersion });
  if (!mapped.ok) actors.fail(mapped.code, mapped.reason);
  const compiled = definitions.compileDefinition(mapped.definition);
  if (!compiled.ok) actors.fail(compiled.code, compiled.path);
  const matching = before.definitions.find(e => actors.hash(e.canonicalDefinition) === actors.hash(compiled.canonicalDefinition));
  const snapshotHash = actors.hash(source.token);
  let plan;
  if (matching) { await authorize(); plan = { definitionRef: matching.definitionRef }; }
  else {
    const planner = definitions.createDefinitionRegistry({ authorize });
    plan = await planner.planAdmit(before, { roomId: room.id, requestId: data.requestId, expectedRegistryRevision: data.expectedRegistryRevision,
      definition: compiled.canonicalDefinition, expectedDefinitionHash: compiled.definitionHash });
    if (!plan.ok) actors.fail(plan.code, plan.path);
    // A registry replay alone can never create a grant for a different source/request.
    if (plan.kind !== 'transition') actors.fail('creature_admission_changed');
  }
  const latest = creatureSource(room, data.source);
  if (actors.hash(latest.token) !== snapshotHash || actors.hash(registry(room)) !== actors.hash(before) || actors.hash(actors.ledger(room)) !== actors.hash(ledgerBefore)) actors.fail('stale_actor_revision');
  const next = actors.clone(room.gameState);
  if (plan.nextRegistry) next.authoredSpellRegistry = actors.clone(plan.nextRegistry);
  const entry = list({ ...room, gameState: next }).entries.find(e => pure.actionId(e.definitionRef) === pure.actionId(plan.definitionRef));
  if (!entry || entry.revoked) actors.fail('definition_revoked');
  const contract = next.maps[data.source.mapId][latest.field][data.source.tokenId].state.actorContract;
  if (!Number.isSafeInteger(contract.revision + 1)) actors.fail('revision_exhausted');
  contract.revision += 1;
  contract.authoredAdmission = { requestId: data.requestId, requestHash, gmUid: uid, source: actors.clone(data.source),
    associationHash: actors.hash(latest.association), definitionRef: actors.clone(plan.definitionRef) };
  next.actorConsequences = { ...ledgerBefore, authoredSourceAdmissions: [...history, actors.clone(contract.authoredAdmission)] };
  require('./actorProjection').advance(room, next);
  const mirrors = require('./roomCheckpoint').deriveRootMirrors(next.maps); next.tokens = mirrors.tokens; next.characterTokens = mirrors.characterTokens;
  return { next, definitionRef: plan.definitionRef };
}
function checkCreatureAuthority(room, approval, primaryPc = false) {
  const source = creatureSource(room, approval.source), grant = source.contract.authoredAdmission;
  const authority = approval.sourceAuthority;
  if (!grant || !authority || grant.gmUid !== room.gmId || authority.gmUid !== room.gmId ||
    grant.requestId !== authority.admissionId || grant.associationHash !== authority.associationHash ||
    actors.hash(grant.source) !== actors.hash(approval.source) || actors.hash(source.association) !== grant.associationHash ||
    pure.actionId(grant.definitionRef) !== approval.spell.definitionId) actors.fail('creature_admission_changed');
  const self = actors.hash(approval.source) === actors.hash(approval.target);
  if (approval.target.kind !== (primaryPc ? 'character' : 'creature') || approval.source.mapId !== approval.target.mapId || (primaryPc && self)) actors.fail('unsupported_creature_target');
  const target = actors.locate(room, approval.target);
  if ((!primaryPc && target.token.character) || target.token.id !== approval.target.tokenId) actors.fail('unsupported_creature_target');
  const entry = lookup(room, approval.spell);
  matchAssociation(room, source.association, entry);
  if (self) {
    if (!pure.creatureSelfHealing(entry.canonicalDefinition, source.association.record)) actors.fail('unsupported_creature_target');
  } else if (entry.canonicalDefinition.targeting.rangeFeet === 0 || entry.canonicalDefinition.targeting.restriction === 'self') actors.fail('distinct_target_range_required');
  return entry;
}
function checkApproval(room, approval, primaryPc = false) {
  const entry = lookup(room, approval.spell), d = entry.canonicalDefinition, desc = entry.descriptor;
  const condition = desc.capabilityId === pure.CONDITION_CAPABILITY;
  const wanted = { definitionId: pure.actionId(entry.definitionRef), definitionHash: `${desc.capabilityId}/${entry.definitionRef.definitionHash}`, name: d.name, kind: d.effect.kind, damageTypes: desc.effect.damageTypes || [] };
  if (actors.hash(approval.spell) !== actors.hash(wanted) || actors.hash(approval.price) !== actors.hash(desc.price) || approval.classPayment !== null) actors.fail('authored_approval_mismatch');
  if (condition) {
    if (!['character', 'creature'].includes(approval.target.kind) || actors.hash(approval.source) === actors.hash(approval.target) || approval.roll !== null) actors.fail('authored_condition_mismatch');
    if (approval.source.kind === 'creature' ? approval.resolution?.gmConfirmed !== true || actors.hash(approval.resolution?.timing) !== actors.hash(d.timing)
      : actors.hash(approval.conditionTerms) !== actors.hash({ conditionKey: 'stunned', timing: d.timing })) actors.fail('authored_condition_mismatch');
  } else {
    const reading = pure.readFormula(d.effect.formula), roll = approval.roll;
    if (roll.constant !== reading.constant || roll.reading !== reading.reading || roll.dice.length !== 1 || roll.dice[0].sides !== reading.dice[0].sides || roll.dice[0].faces.length !== reading.dice[0].count) actors.fail('authored_roll_mismatch');
  }
  const source = actors.locate(room, approval.source);
  if (approval.source.kind === 'creature') checkCreatureAuthority(room, approval, primaryPc || condition && approval.target.kind === 'character');
  else {
    if (entry.creatureOnly) actors.fail('unsupported_source_route');
    const classId = String(source.token.character?.class || '').toLowerCase().replace(/ /g, '_');
    if (classId !== d.binding.classId) actors.fail('unsupported_binding');
  }
  if (d.targeting.restriction === 'self' && actors.hash(approval.source) !== actors.hash(approval.target)) actors.fail('authored_target_mismatch');
  return entry;
}
module.exports = { registry, list, lookup, checkApproval, creatureSource, creatureSources, planCreatureAdmission, checkCreatureAuthority };
