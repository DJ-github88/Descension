/** P14-A1 thin A1a lookup. Installation stays with P7's admission owner. */
const definitions = require('./installedDefinitionRegistry');
const actors = require('./actorConsequences');
const pure = require('../shared/services/authoredAbility');
const authoredChanneled = require('../shared/services/authoredChanneled');
const sharedProfile = require('../shared/services/sharedConditionProfile');
const randomOutcome = require('../shared/services/randomOutcome');
const catalogueAbility = require('../shared/services/catalogueAbility.cjs');
function registry(room) {
  if (room.gameState.authoredSpellRegistry === undefined) return definitions.emptyRegistry(room.id);
  const result = definitions.decodeRegistry(JSON.stringify(room.gameState.authoredSpellRegistry));
  if (!result.ok || result.registry.roomId !== room.id) actors.fail('invalid_authored_registry');
  return result.registry;
}
function catalogueEligibility(entry) {
  if (entry.descriptor.catalogueSource === undefined) return null;
  const verified = catalogueAbility.verifyDefinition(entry.canonicalDefinition);
  return verified.ok ? { eligible: true } : { eligible: false, reason: verified.reason };
}
function list(room) {
  const r = registry(room);
  const sourceRequests = new Set((actors.ledger(room).authoredSourceAdmissions || []).map(e => e.requestId));
  return { revision: r.revision, entries: r.definitions.map(entry => {
    const eligibility = catalogueEligibility(entry);
    const rollEligibility = entry.descriptor.capabilityId === pure.AREA_CAPABILITY
      ? (pure.isAreaRollProcedureApproved() ? { eligible: true, procedure: pure.AREA_ROLL_PROCEDURE } : { eligible: false, procedure: pure.AREA_ROLL_PROCEDURE, reason: pure.AREA_ROLL_UNAPPROVED_REASON })
      : null;
    return { ...actors.clone(entry),
      creatureOnly: r.decisions.some(d => d.action === 'admit' && sourceRequests.has(d.requestId) && pure.actionId(d.definitionRef) === pure.actionId(entry.definitionRef)),
      revoked: r.decisions.some(d => d.action === 'revoke' && pure.actionId(d.definitionRef) === pure.actionId(entry.definitionRef)),
      ...(eligibility ? { catalogueEligibility: eligibility } : {}),
      ...(rollEligibility ? { areaRollEligibility: rollEligibility } : {}) };
  }) };
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
  const mapped = pure.definitionFromWizard(association.record, { roomId: room.id, classId: d.binding.classId, definitionVersion: d.definitionVersion, creatureSource: true });
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
  const mapped = pure.definitionFromWizard(source.association.record, { roomId: room.id, classId: 'arcanoneer', definitionVersion: data.definitionVersion, creatureSource: true });
  if (!mapped.ok) actors.fail(mapped.code, mapped.reason);
  // Creature-source eligibility (formula/health/deterministic/area, and immediate + periodic) is one shared check, also shown on the Bestiary card.
  const sourceRefusal = pure.creatureSourceRefusal(mapped.definition); if (sourceRefusal) actors.fail(sourceRefusal.code, sourceRefusal.reason);
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
function checkApproval(room, approval, primaryPc = false, stage = 'approval') {
  const entry = lookup(room, approval.spell), d = entry.canonicalDefinition, desc = entry.descriptor;
  require('./authoredCooldowns').check(room, approval, d);
  const condition = desc.capabilityId === pure.CONDITION_CAPABILITY, effect = desc.capabilityId === pure.EFFECT_CAPABILITY;
  const deterministic = desc.capabilityId === pure.DETERMINISTIC_CAPABILITY;
  const health = desc.capabilityId === pure.HEALTH_CAPABILITY || (deterministic && pure.readDeterministicFormula(d.effect.formula, Object.fromEntries(require('../shared/services/classEffect').ATTRIBUTES.map(n => [n, 10])), { current: 0, max: 0 }).readsHealth === true);
  const formula = desc.capabilityId === pure.FORMULA_CAPABILITY || health || deterministic, area = desc.capabilityId === pure.AREA_CAPABILITY;
  const isHunterFlow = desc.capabilityId === pure.FLOW_CAPABILITY;
  const outcome = desc.capabilityId === pure.OUTCOME_CAPABILITY;
  const channeled = desc.capabilityId === pure.CHANNELED_CAPABILITY;
  const wanted = { definitionId: pure.actionId(entry.definitionRef), definitionHash: `${desc.capabilityId}/${entry.definitionRef.definitionHash}`, name: d.name,
    kind: channeled ? 'channeled' : outcome ? 'outcome' : effect ? 'effect' : d.effect.kind,
    damageTypes: channeled ? desc.tickEffect.damageTypes || [] : outcome ? [] : effect ? desc.effects.direct?.damageTypes || [] : desc.effect.damageTypes || [] };
  if (actors.hash(approval.spell) !== actors.hash(wanted) || actors.hash(approval.price) !== actors.hash(desc.price)) actors.fail('authored_approval_mismatch');
  // Direct-damage save (handoff/direct-damage-save/CONTRACT.md): the approval carries exactly the admitted save term, or none. Checked at
  // owner approval and again at GM confirmation; while the outcome's creator policy is unanswered nothing is approved or applied.
  const directSave = pure.directSaveOf(d);
  if (directSave ? actors.hash(approval.saveTerms) !== actors.hash(directSave) : approval.saveTerms !== undefined) actors.fail('authored_approval_mismatch');
  if (directSave) {
    const unanswered = require('../shared/services/directSave').policyRefusal(directSave);
    if (unanswered) actors.fail('direct_save_policy_unanswered', unanswered);
    if (approval.source.kind !== 'character' || approval.target.kind !== 'creature' || actors.hash(approval.source) === actors.hash(approval.target)) actors.fail('unsupported_source_route', 'A GM-recorded save on the Direct Damage part is supported for a primary owner PC source and one other creature only.');
  }
  if (area) {
    if (!pure.isAreaRollProcedureApproved()) {
      actors.fail('area_roll_procedure_unapproved', pure.AREA_ROLL_UNAPPROVED_REASON);
    }
    if (desc.catalogueSource !== undefined || d.catalogueSource !== undefined) {
      if (!desc.catalogueSource || !d.catalogueSource || actors.hash(desc.catalogueSource) !== actors.hash(d.catalogueSource)) {
        actors.fail('catalogue_provenance_untrusted', 'The admitted descriptor and definition disagree on the catalogue source.');
      }
      const verified = catalogueAbility.verifyDefinition(d);
      if (!verified.ok) actors.fail('catalogue_provenance_untrusted', verified.reason);
    } else if (desc.classPayment || d.classPayment) {
      actors.fail('catalogue_provenance_untrusted', 'A typed class payment requires a pinned catalogue source.');
    }
    const payment = desc.classPayment || null;
    if (payment ? (!approval.classPayment || approval.classPayment.domain !== payment.domain ||
      actors.hash(approval.classPayment.price) !== actors.hash(payment.price)) : approval.classPayment !== null) actors.fail('authored_approval_mismatch');
    if (approval.source.kind !== 'character') actors.fail('unsupported_source_route');
    if (approval.areaRollProcedure !== pure.AREA_ROLL_PROCEDURE || actors.hash(approval.areaTerms) !== actors.hash(d.targeting)) actors.fail('authored_approval_mismatch');
    if (!Array.isArray(approval.targets) || approval.targets.length < 1) actors.fail('authored_target_mismatch');
    if (approval.targets.length > d.targeting.maxTargets || approval.targets.length > pure.MAX_AREA_TARGETS) {
      actors.fail('area_target_capacity_exceeded', 'Technical limit of 8 creature targets (9 actors including source) exceeded; do not truncate.');
    }
    const seen = new Set();
    for (const t of approval.targets) {
      if (actors.hash(t) === actors.hash(approval.source)) actors.fail('source_in_targets');
      if (t?.kind !== 'creature') actors.fail('unsupported_area_target_kind');
      if (t?.roomId !== room.id || t?.mapId !== approval.source.mapId) actors.fail('cross_map_area_target');
      const th = actors.hash(t);
      if (seen.has(th)) actors.fail('duplicate_target_actor');
      seen.add(th);
      const located = actors.locate(room, t);
      if (located.token?.state?.hiddenFromPlayers === true || located.token?.hiddenFromPlayers === true || located.token?.state?.isHidden === true || located.token?.isHidden === true) actors.fail('actor_not_found');
    }
    const names = pure.formulaAttributes(d.effect.formula);
    const attrs = names.length ? approval.rollAttributes : (approval.rollAttributes || {});
    const reading = pure.readScaledFormula(d.effect.formula, attrs), roll = approval.roll;
    if (!attrs || typeof attrs !== 'object' || Array.isArray(attrs) || Object.keys(attrs).sort().join() !== names.join() || !reading.supported || !roll ||
      roll.constant !== reading.constant || roll.reading !== reading.reading || roll.dice.length !== reading.dice.length ||
      reading.dice.some((group, i) => roll.dice[i].sides !== group.sides || roll.dice[i].faces.length !== group.count)) actors.fail('authored_roll_mismatch');
    if (names.length > 0 || approval.formulaSourceRevision !== undefined || approval.formulaSourceHash !== undefined) {
      const source = actors.locate(room, approval.source);
      const projected = require('./roomAccessService').projectTokenForClient(source.token);
      if (source.contract.revision !== approval.formulaSourceRevision || actors.hash({ character: projected.character, conditions: projected.state?.conditions || [] }) !== approval.formulaSourceHash)
        actors.fail('owner_reapproval_required', 'The caster snapshot changed. Review the formula inputs and approve again with the retained die faces; nothing was applied.');
    }
  } else if (formula) {
    const self = actors.hash(approval.source) === actors.hash(approval.target);
    if (d.targeting.restriction === 'self') {
      if (!self) actors.fail('authored_target_mismatch');
      if (!pure.ownerSelfHealing(d) || approval.source.kind !== 'character' || approval.target.kind !== 'character' || approval.classPayment !== null || health) actors.fail('unsupported_formula_target');
    } else {
      if ((health || deterministic) && (approval.target.kind !== 'creature' || approval.classPayment !== null || self)) actors.fail('unsupported_formula_target');
      // M4B repair R1: the admitted definition's catalogue identity and executable projection
      // must still match a reviewed server pin at consumption. A changed/removed pin refuses.
      if (desc.catalogueSource !== undefined) {
        if (actors.hash(desc.catalogueSource) !== actors.hash(d.catalogueSource)) actors.fail('catalogue_provenance_untrusted', 'The admitted descriptor and definition disagree on the catalogue source.');
        const verified = catalogueAbility.verifyDefinition(d);
        if (!verified.ok) actors.fail('catalogue_provenance_untrusted', verified.reason);
      } else if (desc.classPayment) {
        actors.fail('catalogue_provenance_untrusted', 'A typed class payment requires a pinned catalogue source.');
      }
      // M4B: the typed class price is pinned by the admitted definition and revalidated
      // against the existing bank/home; no client price can replace it.
      const payment = desc.classPayment || null;
      if (payment ? (!approval.classPayment || approval.classPayment.domain !== payment.domain ||
        actors.hash(approval.classPayment.price) !== actors.hash(payment.price)) : approval.classPayment !== null) actors.fail('authored_approval_mismatch');
      const targetRoute = desc.targetRoute || 'creature';
      if (targetRoute === 'primary-pc-healing') {
        if (approval.target.kind !== 'character' || self ||
          d.effect.kind !== 'healing' || d.targeting.restriction !== 'ally') actors.fail('unsupported_formula_target');
      } else if (approval.target.kind !== 'creature' || self) actors.fail('unsupported_formula_target');
    }
  } else if (effect) {
    // Same M4B authority boundary: the exact whole composition and payment are reviewed together.
    if (desc.catalogueSource !== undefined || d.catalogueSource !== undefined) {
      if (!desc.catalogueSource || !d.catalogueSource || actors.hash(desc.catalogueSource) !== actors.hash(d.catalogueSource)) actors.fail('catalogue_provenance_untrusted');
      const verified = catalogueAbility.verifyDefinition(d);
      if (!verified.ok) actors.fail('catalogue_provenance_untrusted', verified.reason);
    } else if (desc.classPayment || d.classPayment) actors.fail('catalogue_provenance_untrusted');
    const payment = desc.classPayment || null;
    if (payment ? (!approval.classPayment || approval.classPayment.domain !== payment.domain ||
      actors.hash(approval.classPayment.price) !== actors.hash(payment.price)) : approval.classPayment !== null) actors.fail('authored_approval_mismatch');
    if (payment) {
      const source = actors.locate(room, approval.source);
      if (approval.source.kind !== 'character' || !source.contract.primary || approval.target.kind !== 'creature' ||
        require('../shared/services/classEffect').classIdOf(source.token.character?.class) !== d.binding.classId) actors.fail('unsupported_source_route');
    }
  } else if (isHunterFlow) {
    const source = actors.locate(room, approval.source);
    const self = actors.hash(approval.source) === actors.hash(approval.target);
    if (approval.source.kind !== 'character' || !source.contract.primary || approval.target.kind !== 'creature' || self) {
      actors.fail('unsupported_source_route', 'Quick Draw Flow execution requires a primary Hunter owner PC targeting one creature.');
    }
    if (!approval.classPayment || approval.classPayment.domain !== 'hunterFlow') {
      actors.fail('authored_approval_mismatch');
    }
    const reading = pure.readFormula(d.effect.formula), roll = approval.roll;
    if (!roll || roll.constant !== reading.constant || roll.reading !== reading.reading || roll.dice.length !== 1 ||
        roll.dice[0].sides !== reading.dice[0].sides || roll.dice[0].faces.length !== reading.dice[0].count) {
      actors.fail('authored_roll_mismatch');
    }
  } else if (approval.classPayment !== null) actors.fail('authored_approval_mismatch');
  if (effect) {
    // A10: the whole admitted bundle (direct part, canonical effect, timing) is bound; no subset executes.
    if (!['creature', 'character'].includes(approval.target.kind) || actors.hash(approval.source) === actors.hash(approval.target)) actors.fail('unsupported_effect_target');
    if (actors.hash(approval.effectTerms) !== actors.hash(require('../shared/services/authoredEffect').termsFor(d))) actors.fail('authored_effect_mismatch');
    // M5 composition (review F1): the owner-PC-only bound is re-checked at every approval, not only at creature admission.
    if (approval.source.kind !== 'character') { const sourceRefusal = pure.creatureSourceRefusal(d); if (sourceRefusal) actors.fail(sourceRefusal.code, sourceRefusal.reason); }
    if (approval.target.kind === 'character') {
      // M3A: the existing consent boundary is chosen from the admitted terms; a combination with conflicting semantics refuses whole.
      const consent = require('../shared/services/authoredEffect').pcConsent(approval.effectTerms, approval.source.kind);
      if (!consent.ok) actors.fail(consent.code, consent.message);
      // A creature's direct part reaches a PC only through A5's owner response (primaryPc); its rider-only form only through A9-style acceptance.
      if (approval.source.kind === 'creature' && consent.a5 !== primaryPc) actors.fail('pc_target_route_mismatch', consent.a5 ? 'A creature\'s direct damage or healing on a player character needs the owner\'s response; use the offer route.' : 'A rider-only effect uses the condition route, not the attack-offer route.');
    }
    if (approval.source.kind === 'creature' && (approval.resolution?.gmConfirmed !== true || actors.hash(approval.resolution.timing) !== actors.hash(d.timing))) actors.fail('authored_effect_mismatch');
    if (!d.effects.direct) { if (approval.roll !== null) actors.fail('authored_roll_mismatch'); }
    else if (pure.formulaAttributes(d.effects.direct.formula).length) {
      // M5 composition + M4A: the same scaled reader, owner-attested inputs and caster-snapshot binding as an M4A formula action.
      // Re-run at approval and again at GM confirmation (checkAgainstRoom), so a caster change after approval needs reapproval.
      // Formula riders: the same branch serves a movement OR Stunned effect; that route is one placed creature target only.
      if (approval.source.kind !== 'character' || !pure.FORMULA_BUNDLE_CONDITIONS.includes(d.effects.condition.kind)) actors.fail('unsupported_source_route');
      if (approval.target.kind !== 'creature') {actors.fail('pc_target_effect_unsupported', 'An attribute-scaled immediate part with an effect applies to one placed creature only; a player character target stays manual. Refused whole.');}
      const names = pure.formulaAttributes(d.effects.direct.formula), attrs = approval.rollAttributes;
      const reading = attrs && typeof attrs === 'object' && !Array.isArray(attrs) ? pure.readScaledFormula(d.effects.direct.formula, attrs) : { supported: false }, roll = approval.roll;
      if (!attrs || typeof attrs !== 'object' || Array.isArray(attrs) || Object.keys(attrs).sort().join() !== names.join() || !reading.supported || !roll ||
        roll.constant !== reading.constant || roll.reading !== reading.reading || roll.dice.length !== reading.dice.length ||
        reading.dice.some((group, i) => roll.dice[i].sides !== group.sides || roll.dice[i].faces.length !== group.count)) actors.fail('authored_roll_mismatch');
      const source = actors.locate(room, approval.source);
      const projected = require('./roomAccessService').projectTokenForClient(source.token);
      if (source.contract.revision !== approval.formulaSourceRevision || actors.hash({ character: projected.character, conditions: projected.state?.conditions || [] }) !== approval.formulaSourceHash)
        actors.fail('owner_reapproval_required', 'The caster snapshot changed. Review the formula inputs and approve again with the retained die faces; nothing was applied.');
    } else {
      if (approval.rollAttributes !== undefined || approval.formulaSourceRevision !== undefined || approval.formulaSourceHash !== undefined) actors.fail('authored_roll_mismatch');
      const reading = pure.readFormula(d.effects.direct.formula), roll = approval.roll;
      if (!roll || roll.constant !== reading.constant || roll.reading !== reading.reading || roll.dice.length !== 1 || roll.dice[0].sides !== reading.dice[0].sides || roll.dice[0].faces.length !== reading.dice[0].count) actors.fail('authored_roll_mismatch');
    }
  } else if (condition) {
    if (!['character', 'creature'].includes(approval.target.kind) || actors.hash(approval.source) === actors.hash(approval.target) || approval.roll !== null) actors.fail('authored_condition_mismatch');
    if (approval.source.kind === 'creature' ? approval.resolution?.gmConfirmed !== true || actors.hash(approval.resolution?.timing) !== actors.hash(d.timing)
      : actors.hash(approval.conditionTerms) !== actors.hash({ conditionKey: 'stunned', timing: d.timing })) actors.fail('authored_condition_mismatch');
  } else if (formula) {
    if (approval.source.kind !== 'character') actors.fail('unsupported_source_route');
    const source = actors.locate(room, approval.source);
    const projected = require('./roomAccessService').projectTokenForClient(source.token);
    if (source.contract.revision !== approval.formulaSourceRevision || actors.hash({ character: projected.character, conditions: projected.state?.conditions || [] }) !== approval.formulaSourceHash)
      actors.fail('owner_reapproval_required', 'The caster snapshot changed. Review the formula inputs and approve again with the retained die faces; nothing was applied.');
    const hp = health ? actors.resources(source.token, 'character').hp : null;
    const inputs = health ? { current: hp.current, max: hp.max } : null;
    if (health && actors.hash(approval.rollHealth) !== actors.hash(inputs)) actors.fail('health_input_mismatch', 'Caster base HP must match the authoritative actor snapshot.');
    if (deterministic && !health && approval.rollHealth !== undefined) actors.fail('health_input_mismatch');
    const reading = deterministic ? pure.readDeterministicFormula(d.effect.formula, approval.rollAttributes, inputs || undefined) : health ? pure.readHealthFormula(d.effect.formula, approval.rollAttributes, inputs) : pure.readScaledFormula(d.effect.formula, approval.rollAttributes), roll = approval.roll;
    const names = pure.formulaAttributes(d.effect.formula);
    if (!approval.rollAttributes || typeof approval.rollAttributes !== 'object' || Array.isArray(approval.rollAttributes) || Object.keys(approval.rollAttributes).sort().join() !== names.join() || !reading.supported || !roll ||
      roll.constant !== reading.constant || roll.reading !== reading.reading || roll.dice.length !== reading.dice.length ||
      reading.dice.some((group, i) => roll.dice[i].sides !== group.sides || roll.dice[i].faces.length !== group.count)) actors.fail('authored_roll_mismatch');
  } else if (outcome) {
    if (approval.source.kind !== 'character' || approval.target.kind !== 'creature' || actors.hash(approval.source) === actors.hash(approval.target)) {
      actors.fail('unsupported_source_route', 'Outcome-branched spells require a primary owner PC source and one distinct creature target.');
    }
    if (approval.classPayment !== null) actors.fail('authored_approval_mismatch');
    const resolved = randomOutcome.resolveBranch(d.outcomeTable, approval.outcome);
    if (!resolved.ok) actors.fail(resolved.code || 'authored_outcome_mismatch', resolved.reason);
    if (actors.hash(approval.chosenBranch) !== actors.hash(resolved.branch)) actors.fail('authored_outcome_mismatch');
    const reading = randomOutcome.readBranchFormula(resolved.branch.effect.formula), roll = approval.roll;
    const validRoll = reading.dice.length === 0
      ? (roll && roll.mode === 'deterministic' && Array.isArray(roll.dice) && roll.dice.length === 0 &&
          roll.constant === reading.constant && roll.total === reading.constant && roll.reading === reading.reading)
      : (roll && ['digital', 'physical'].includes(roll.mode) && roll.constant === reading.constant && roll.reading === reading.reading &&
          roll.dice.length === 1 && roll.dice[0].sides === reading.dice[0].sides && roll.dice[0].faces.length === reading.dice[0].count);
    if (!validRoll) actors.fail('authored_roll_mismatch');
  } else if (channeled) {
    if (approval.classPayment !== null || approval.roll !== null) actors.fail('authored_approval_mismatch');
    if (approval.target?.kind !== 'creature' || actors.hash(approval.source) === actors.hash(approval.target)) {
      actors.fail('channeled_target_unsupported', 'Channeled spells currently support one distinct placed creature target only.');
    }
    if (actors.hash(approval.channelTerms) !== actors.hash(authoredChanneled.termsFor(d))) actors.fail('authored_approval_mismatch');
    if (approval.source.kind === 'creature' && (approval.resolution?.gmConfirmed !== true || actors.hash(approval.resolution?.timing) !== actors.hash(d.timing))) {
      actors.fail('authored_approval_mismatch');
    }
    const activeChannels = findActiveChannelsByCaster(room, approval.source);
    if (activeChannels.some(c => !sharedProfile.sameRef(c.target, approval.target))) {
      actors.fail('caster_already_channeling', 'This caster is already channeling on another target; end or break that channel before starting a new one.');
    }
    const rangeCheck = verifyChannelRange(room, approval.source, approval.target, d.channel.rangeFeet);
    if (!rangeCheck.ok) {
      actors.fail('target_out_of_range', Number.isFinite(rangeCheck.distanceFeet)
        ? `Target is ${Math.round(rangeCheck.distanceFeet * 10) / 10} ft away, beyond the spell's ${d.channel.rangeFeet} ft range.`
        : `Target range cannot be verified on this map (requires within ${d.channel.rangeFeet} ft).`);
    }
  } else if (!area && !isHunterFlow) {
    const reading = pure.readFormula(d.effect.formula), roll = approval.roll;
    if (roll.constant !== reading.constant || roll.reading !== reading.reading || roll.dice.length !== 1 || roll.dice[0].sides !== reading.dice[0].sides || roll.dice[0].faces.length !== reading.dice[0].count) actors.fail('authored_roll_mismatch');
  }
  const source = actors.locate(room, approval.source);
  if (approval.source.kind === 'creature') checkCreatureAuthority(room, approval, primaryPc || (condition || effect) && approval.target.kind === 'character');
  else {
    if (entry.creatureOnly) actors.fail('unsupported_source_route');
    const classId = String(source.token.character?.class || '').toLowerCase().replace(/ /g, '_');
    if (classId !== d.binding.classId) actors.fail('unsupported_binding');
  }
  if (!area && d.targeting.restriction === 'self' && (actors.hash(approval.source) !== actors.hash(approval.target) || d.effect?.kind !== 'healing' || d.targeting?.rangeFeet !== 0)) actors.fail('authored_target_mismatch');
  if (!area && actors.hash(approval.source) === actors.hash(approval.target) &&
      (d.effect?.kind !== 'healing' || !['self', 'any'].includes(d.targeting?.restriction) ||
       (approval.source.kind === 'character' && d.targeting?.restriction !== 'self'))) {
    actors.fail('authored_target_mismatch');
  }
  checkRelationshipTargets(room, approval, d);
  if (!area && d.targeting?.selectionMethod === 'lowest_health') {
    verifyLowestHealthTarget(room, approval, d.targeting, stage);
  }
  if (area && d.targeting?.aoeShape === 'line') {
    verifyLineAreaGeometry(room, approval, d.targeting, stage);
  } else if (area && d.targeting?.aoeShape === 'circle') {
    verifyCircleAreaGeometry(room, approval, d.targeting, stage);
  }
  return entry;
}
/** Server-authoritative range, relationship, visibility, and base-HP ranking check for selectionMethod === 'lowest_health'.
 * Visibility, relationship, and planar range filters apply strictly BEFORE ranking by current base HP. */
function verifyLowestHealthTarget(room, approval, targeting, stage = 'approval') {
  if (targeting?.selectionMethod !== 'lowest_health') return;
  if (approval.source?.kind !== 'character') {
    actors.fail('unsupported_source_route', 'Lowest-health target selection requires a primary owner PC source.');
  }
  if (!approval.target || approval.target.kind !== 'creature' || actors.hash(approval.source) === actors.hash(approval.target)) {
    actors.fail('authored_target_mismatch', 'Lowest-health target selection requires one distinct creature target.');
  }
  const source = actors.locate(room, approval.source);
  const target = actors.locate(room, approval.target);
  const targetHidden = Boolean(target.token?.state?.hiddenFromPlayers === true || target.token?.hiddenFromPlayers === true || target.token?.state?.isHidden === true || target.token?.isHidden === true);
  if (targetHidden) actors.fail('actor_not_found');
  const { map, gridSize, feetPerTile } = mapGridMetrics(room, approval.source.mapId);
  if (![source.token?.position?.x, source.token?.position?.y, target.token?.position?.x, target.token?.position?.y].every(Number.isFinite) ||
      !Number.isFinite(gridSize) || gridSize <= 0 || !Number.isFinite(feetPerTile) || feetPerTile <= 0) {
    actors.fail('manual_targeting_geometry_required', 'Caster and target tokens need valid grid coordinates to verify lowest-health range.');
  }
  const distFeet = (Math.hypot(target.token.position.x - source.token.position.x, target.token.position.y - source.token.position.y) / gridSize) * feetPerTile;
  if (distFeet > targeting.rangeFeet + 1e-6) {
    if (stage === 'commit') {
      actors.fail('owner_reapproval_required', 'The selected target moved out of range after approval. Nothing was applied or spent; review and approve again.');
    }
    actors.fail('target_out_of_range', `Target is ${distFeet.toFixed(1)} ft away, outside the authored ${targeting.rangeFeet} ft range. Nothing was applied or spent.`);
  }
  const relationships = require('./actorRelationships');
  const candidates = [];
  for (const [tokenId, tok] of Object.entries(map?.tokens || {})) {
    const c = tok?.state?.actorContract;
    if (!c || c.version !== 1 || c.kind !== 'creature') continue;
    const candRef = actors.refFor(c);
    if (candRef.mapId !== approval.source.mapId || candRef.roomId !== room.id || candRef.tokenId !== tokenId) continue;
    if (actors.hash(candRef) === actors.hash(approval.source)) continue;
    const hidden = Boolean(tok?.state?.hiddenFromPlayers === true || tok?.hiddenFromPlayers === true || tok?.state?.isHidden === true || tok?.isHidden === true);
    const hp = actors.resources(tok, 'creature').hp;
    candidates.push({
      key: actors.hash(candRef),
      kind: 'creature',
      position: tok.position,
      currentHp: hp.current,
      hidden,
      relationship: relationships.get(room, approval.source, candRef)
    });
  }
  const evalResult = pure.evaluateLowestHealthCandidates({
    sourcePos: source.token.position,
    rangeFeet: targeting.rangeFeet,
    restriction: targeting.restriction,
    gridSize,
    feetPerTile,
    candidates
  });
  if (!evalResult.ok) {
    if (stage === 'commit') {
      actors.fail('owner_reapproval_required', 'No eligible lowest-health target remains in range after approval. Nothing was applied or spent; review and approve again.');
    }
    actors.fail(evalResult.code, 'No eligible target found within range.');
  }
  const submittedKey = actors.hash(approval.target);
  if (!evalResult.lowest.some(item => item.key === submittedKey)) {
    if (stage === 'commit') {
      actors.fail('owner_reapproval_required', 'Eligible targets or HP changed after approval so the approved target is no longer lowest HP in range. Nothing was applied or spent; review and approve again.');
    }
    actors.fail('target_not_lowest_hp', 'Selected target does not have the lowest base HP among eligible targets in range. Nothing was applied or spent.');
  }
}
function mapGridMetrics(room, mapId) {
  const map = room?.gameState?.maps?.[mapId] || {};
  const gs = map.gridSettings || room?.gameState?.gridSettings || map.mapData?.gridSettings || {};
  const gridType = gs.gridType || gs.type || map.gridType || room?.gameState?.gridType || 'square';
  const gridSize = [gs.gridSize, gs.size, map.gridSize, room?.gameState?.gridSize].find(v => typeof v === 'number' && Number.isFinite(v) && v > 0) || 50;
  // The GM's configured grid scale (sync_gameplay_settings -> room.gameState.feetPerTile) is authoritative; map-level values and
  // the 5 ft default apply only when no scale has been configured.
  const feetPerTile = [room?.gameState?.feetPerTile, gs.feetPerTile, map.feetPerTile].find(v => typeof v === 'number' && Number.isFinite(v) && v > 0) || 5;
  const offsetX = [gs.gridOffsetX, gs.offsetX, map.gridOffsetX, room?.gameState?.gridOffsetX].find(v => typeof v === 'number' && Number.isFinite(v)) ?? 0;
  const offsetY = [gs.gridOffsetY, gs.offsetY, map.gridOffsetY, room?.gameState?.gridOffsetY].find(v => typeof v === 'number' && Number.isFinite(v)) ?? 0;
  return { map, gridType, gridSize, feetPerTile, offsetX, offsetY };
}
/** Server-authoritative geometry and target resolver for bounded Line AoE (uses shared pure.lineCellOverlap).
 * Client target lists are never trusted: verifies the origin is the caster (D-LINE-1), direction, positive-area overlap (G3/G3a),
 * and completeness against visible eligible creature tokens in the current room state. */
function verifyLineAreaGeometry(room, approval, targeting, stage = 'approval') {
  if (targeting?.aoeShape !== 'line') return;
  const origin = approval?.areaOrigin, aim = approval?.areaTarget;
  if (!origin || !aim || ![origin.x, origin.y, aim.x, aim.y].every(Number.isFinite)) {
    actors.fail('invalid_spell_approval', 'Line area placement requires finite origin and aim coordinates.');
  }
  const { map, gridType, gridSize, feetPerTile, offsetX, offsetY } = mapGridMetrics(room, approval.source.mapId);
  if (gridType !== 'square') {
    actors.fail('manual_area_geometry_required', 'Line geometry automation requires a calibrated square grid.');
  }
  if (Math.hypot(aim.x - origin.x, aim.y - origin.y) <= gridSize * 1e-8) {
    actors.fail('area_direction_required', 'Line placement requires a non-zero aim direction.');
  }
  const source = actors.locate(room, approval.source);
  if (![source.token?.position?.x, source.token?.position?.y].every(Number.isFinite)) {
    actors.fail('manual_area_geometry_required', 'Caster token must have a valid grid position to authorize a Line area.');
  }
  // Creator rule (2026-11-19): a Line starts at the caster. The origin must be the caster's position; only the direction is chosen.
  // A movable origin is a separate, unapproved rule.
  if (Math.hypot(origin.x - source.token.position.x, origin.y - source.token.position.y) > gridSize * 1e-6) {
    if (stage === 'commit') {
      actors.fail('owner_reapproval_required', 'The caster moved after approval; a Line starts at the caster. Re-aim and approve again.');
    }
    actors.fail('area_origin_out_of_range', 'A Line starts at the caster: the origin must be the caster position.');
  }
  const lengthPx = (targeting.lengthFeet / feetPerTile) * gridSize;
  const widthPx = (targeting.widthFeet / feetPerTile) * gridSize;
  const creaturesCatalog = map?.creatures || room?.gameState?.combat?.creatures || room?.gameState?.creatures || [];
  for (const tRef of approval.targets) {
    const located = actors.locate(room, tRef);
    if (![located.token?.position?.x, located.token?.position?.y].every(Number.isFinite)) {
      actors.fail('manual_area_geometry_required', 'Target token must have a valid grid position for Line resolution.');
    }
    const footprint = pure.tokenFootprintForArea(located.token, creaturesCatalog);
    const cells = pure.occupiedGridCells(located.token.position, footprint, gridSize, offsetX, offsetY);
    if (!cells) {
      actors.fail('manual_area_geometry_required', 'Target token is off-grid or has an unsupported footprint.');
    }
    const states = cells.map(cell => pure.lineCellOverlap(origin, aim, lengthPx, widthPx, cell, gridSize, offsetX, offsetY));
    if (!states.includes('candidate')) {
      if (stage === 'commit') {
        actors.fail('owner_reapproval_required', 'A target moved outside the placed line after approval; owner must re-aim and approve again.');
      }
      actors.fail('stale_area_placement', 'Submitted target list does not match the authoritative line geometry on the current map state.');
    }
  }
  const submittedHashes = new Set(approval.targets.map(t => actors.hash(t)));
  const relationships = require('./actorRelationships');
  const eligibleInLineHashes = [];
  for (const [tokenId, tok] of Object.entries(map?.tokens || {})) {
    const c = tok?.state?.actorContract;
    if (!c || c.version !== 1 || c.kind !== 'creature') continue;
    if (tok?.state?.hiddenFromPlayers === true || tok?.hiddenFromPlayers === true || tok?.state?.isHidden === true || tok?.isHidden === true) continue;
    const candRef = actors.refFor(c);
    if (candRef.mapId !== approval.source.mapId || candRef.roomId !== room.id || candRef.tokenId !== tokenId) continue;
    if (['ally', 'enemy'].includes(targeting.restriction) && relationships.get(room, approval.source, candRef) !== targeting.restriction) continue;
    if (![tok.position?.x, tok.position?.y].every(Number.isFinite)) continue;
    const footprint = pure.tokenFootprintForArea(tok, creaturesCatalog);
    const cells = pure.occupiedGridCells(tok.position, footprint, gridSize, offsetX, offsetY);
    if (!cells) continue;
    const states = cells.map(cell => pure.lineCellOverlap(origin, aim, lengthPx, widthPx, cell, gridSize, offsetX, offsetY));
    if (!states.includes('candidate')) continue;
    eligibleInLineHashes.push(actors.hash(candRef));
  }
  if (eligibleInLineHashes.length > targeting.maxTargets || eligibleInLineHashes.length > pure.MAX_AREA_TARGETS) {
    actors.fail('area_target_capacity_exceeded', 'Technical limit of creature targets in the placed line exceeded; re-aim or keep manual.');
  }
  if (eligibleInLineHashes.some(h => !submittedHashes.has(h))) {
    if (stage === 'commit') {
      actors.fail('owner_reapproval_required', 'An eligible creature entered the placed line after approval; owner must re-aim and approve again.');
    }
    actors.fail('stale_area_placement', 'Authoritative line resolution found eligible creature targets in the line omitted from the request.');
  }
}
/** Server-authoritative geometry and target resolver for bounded Circle AoE (uses approved G1/G3/G3a/G5 and shared pure.circleCellOverlap).
 * Client target lists are never trusted: verifies placed origin & G1 placement range (G5 free point), positive-area overlap (G3/G3a),
 * and completeness against visible eligible creature tokens in the current room state. */
function verifyCircleAreaGeometry(room, approval, targeting, stage = 'approval') {
  if (targeting?.aoeShape !== 'circle') return;
  const origin = approval?.areaOrigin;
  if (!origin || ![origin.x, origin.y].every(Number.isFinite)) {
    actors.fail('invalid_spell_approval', 'Circle area placement requires finite origin coordinates.');
  }
  const { map, gridType, gridSize, feetPerTile, offsetX, offsetY } = mapGridMetrics(room, approval.source.mapId);
  if (gridType !== 'square') {
    actors.fail('manual_area_geometry_required', 'Circle geometry automation requires a calibrated square grid.');
  }
  const source = actors.locate(room, approval.source);
  if (![source.token?.position?.x, source.token?.position?.y].every(Number.isFinite)) {
    actors.fail('manual_area_geometry_required', 'Caster token must have a valid grid position to authorize a Circle area.');
  }
  // Undecided G1b: Large / multi-cell caster origin range anchor awaits creator settlement; fail closed.
  const casterFootprint = pure.tokenFootprintForArea(source.token, []);
  if (casterFootprint.width > 1 || casterFootprint.height > 1) {
    actors.fail('manual_area_geometry_required', 'Large / multi-cell caster origin range (G1b) is undecided; resolve manually.');
  }
  // Approved G1 + G5: free-point circle center measured from caster position against authored rangeFeet.
  const originDistFeet = (Math.hypot(origin.x - source.token.position.x, origin.y - source.token.position.y) / gridSize) * feetPerTile;
  if (originDistFeet > targeting.rangeFeet + 1e-8) {
    if (stage === 'commit') {
      actors.fail('owner_reapproval_required', 'The placed circle origin is now outside the authored placement range; owner must re-place and approve again.');
    }
    actors.fail('area_origin_out_of_range', `Placed circle origin is ${Math.round(originDistFeet * 10) / 10} ft away, outside the authored ${targeting.rangeFeet} ft placement range.`);
  }
  const radiusPx = (targeting.radiusFeet / feetPerTile) * gridSize;
  const creaturesCatalog = map?.creatures || room?.gameState?.combat?.creatures || room?.gameState?.creatures || [];
  for (const tRef of approval.targets) {
    const located = actors.locate(room, tRef);
    if (![located.token?.position?.x, located.token?.position?.y].every(Number.isFinite)) {
      actors.fail('manual_area_geometry_required', 'Target token must have a valid grid position for Circle resolution.');
    }
    const footprint = pure.tokenFootprintForArea(located.token, creaturesCatalog);
    const cells = pure.occupiedGridCells(located.token.position, footprint, gridSize, offsetX, offsetY);
    if (!cells) {
      actors.fail('manual_area_geometry_required', 'Target token is off-grid or has an unsupported footprint.');
    }
    const states = cells.map(cell => pure.circleCellOverlap(origin, radiusPx, cell, gridSize, offsetX, offsetY));
    if (!states.includes('candidate')) {
      if (stage === 'commit') {
        actors.fail('owner_reapproval_required', 'A target moved outside the placed circle after approval; owner must re-place and approve again.');
      }
      actors.fail('stale_area_placement', 'Submitted target list does not match the authoritative circle geometry on the current map state.');
    }
  }
  const submittedHashes = new Set(approval.targets.map(t => actors.hash(t)));
  const relationships = require('./actorRelationships');
  const eligibleInCircleHashes = [];
  for (const [tokenId, tok] of Object.entries(map?.tokens || {})) {
    const c = tok?.state?.actorContract;
    if (!c || c.version !== 1 || c.kind !== 'creature') continue;
    if (tok?.state?.hiddenFromPlayers === true || tok?.hiddenFromPlayers === true || tok?.state?.isHidden === true || tok?.isHidden === true) continue;
    const candRef = actors.refFor(c);
    if (candRef.mapId !== approval.source.mapId || candRef.roomId !== room.id || candRef.tokenId !== tokenId) continue;
    if (['ally', 'enemy'].includes(targeting.restriction) && relationships.get(room, approval.source, candRef) !== targeting.restriction) continue;
    if (![tok.position?.x, tok.position?.y].every(Number.isFinite)) continue;
    const footprint = pure.tokenFootprintForArea(tok, creaturesCatalog);
    const cells = pure.occupiedGridCells(tok.position, footprint, gridSize, offsetX, offsetY);
    if (!cells) continue;
    const states = cells.map(cell => pure.circleCellOverlap(origin, radiusPx, cell, gridSize, offsetX, offsetY));
    if (!states.includes('candidate')) continue;
    eligibleInCircleHashes.push(actors.hash(candRef));
  }
  if (eligibleInCircleHashes.length > targeting.maxTargets || eligibleInCircleHashes.length > pure.MAX_AREA_TARGETS) {
    if (stage === 'commit') {
      actors.fail('owner_reapproval_required', 'More eligible creatures are now inside the placed circle than the area target limit allows; owner must re-place or resolve manually.');
    }
    actors.fail('area_target_capacity_exceeded', 'Technical limit of creature targets in the placed circle exceeded; re-place or keep manual.');
  }
  if (eligibleInCircleHashes.some(h => !submittedHashes.has(h))) {
    if (stage === 'commit') {
      actors.fail('owner_reapproval_required', 'An eligible creature entered the placed circle after approval; owner must re-place and approve again.');
    }
    actors.fail('stale_area_placement', 'Authoritative circle resolution found eligible creature targets in the circle omitted from the request.');
  }
}
// Approved source-relative symmetric relationship semantics: absent pair = neutral.
// Only admitted ally-only/enemy-only restrictions consult the store; self/any rules are unchanged.
function checkRelationshipTargets(room, approval, definition) {
  const restriction = definition?.targeting?.restriction;
  if (!['ally', 'enemy'].includes(restriction)) {return;}
  const refs = Array.isArray(approval.targets) ? approval.targets : [approval.target];
  if (!refs.length || refs.some(ref => !ref)) {return;}
  const relationships = require('./actorRelationships');
  for (let index = 0; index < refs.length; index += 1) {
    const target = refs[index];
    if (actors.hash(target) === actors.hash(approval.source)) {continue;}
    if (relationships.get(room, approval.source, target) === restriction) {continue;}
    const scope = refs.length > 1 ? ` (target ${index + 1} of ${refs.length})` : '';
    actors.fail('target_relationship_mismatch',
      `The admitted ability targets ${restriction === 'ally' ? 'allies' : 'enemies'} only${scope}. The selected target does not have that source-relative relationship. Nothing was applied or spent.`);
  }
}
function findActiveChannelsByCaster(room, sourceRef) {
  const out = [], seen = new Set();
  for (const map of Object.values(room?.gameState?.maps || {})) {
    for (const field of ['tokens', 'characterTokens']) {
      for (const token of Object.values(map?.[field] || {})) {
        const conditions = Array.isArray(token?.state?.conditions) ? token.state.conditions : [];
        for (const record of conditions) {
          if (sharedProfile.isChanneledTick(record) && sharedProfile.sameRef(record.sourceActor, sourceRef) && !seen.has(record.recordId)) {
            seen.add(record.recordId);
            out.push(record);
          }
        }
      }
    }
  }
  return out;
}
function verifyChannelRange(room, sourceRef, targetRef, rangeFeet) {
  if (!sourceRef || !targetRef || sourceRef.mapId !== targetRef.mapId || sourceRef.roomId !== room?.id) {
    return { ok: false, distanceFeet: Infinity, rangeFeet, reason: 'cross_map_or_room' };
  }
  let source, target;
  try {
    source = actors.locate(room, sourceRef);
    target = actors.locate(room, targetRef);
  } catch (_) {
    return { ok: false, distanceFeet: Infinity, rangeFeet, reason: 'actor_not_found' };
  }
  const sPos = source.token?.position, tPos = target.token?.position;
  if (![sPos?.x, sPos?.y, tPos?.x, tPos?.y].every(Number.isFinite)) {
    return { ok: false, distanceFeet: Infinity, rangeFeet, reason: 'missing_position' };
  }
  const metrics = mapGridMetrics(room, sourceRef.mapId);
  const dist = authoredChanneled.distanceFeet(sPos, tPos, metrics);
  return {
    ok: authoredChanneled.withinRange(sPos, tPos, metrics, rangeFeet),
    distanceFeet: dist,
    rangeFeet
  };
}
module.exports = { registry, list, lookup, checkApproval, creatureSource, creatureSources, planCreatureAdmission, checkCreatureAuthority, verifyLineAreaGeometry, verifyCircleAreaGeometry, verifyLowestHealthTarget, mapGridMetrics, verifyChannelRange, findActiveChannelsByCaster };
