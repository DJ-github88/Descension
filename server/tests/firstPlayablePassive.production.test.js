'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { createPassiveHarness } = require('./helpers/passiveReadinessHarness');
const profile = require('./helpers/profiles');

const HEIGHTENED_SENSES = profile.readFixture('heightened-senses.record.json');
const UNRELATED_PASSIVE = profile.readFixture('vat-knit-flesh.record.json');
const P0 = profile.readFixture('p0-no-trigger.record.json');
const P1 = profile.readFixture('p1-whole-trigger.record.json');
const P2 = profile.readFixture('p2-component-trigger.record.json');

const testPolicy = require('./helpers/passiveActivationTestPolicy');
const passives = require('../services/passiveActivation');
const combatRoster = require('../services/combatRoster');
const roomAccessService = require('../services/roomAccessService');
const roomCheckpoint = require('../services/roomCheckpoint');
const { definitionFromWizard } = require('../shared/services/authoredAbility');
const executionPlan = require('../shared/services/executionPlan');

describe('first playable passive implementation — Heightened Senses (+2 flat initiative)', function() {
  let h;

  beforeEach(async() => {
    testPolicy.resetPolicyForTest();
    h = await createPassiveHarness();
  });

  afterEach(async() => {
    testPolicy.resetPolicyForTest();
    if (h) {await h.stop();}
  });

  describe('0. Approval boundary & creator-approved shipped policy (P1-P5)', function() {
    it('ships passiveActivationPolicy.js with explicit creator approval (approved() === true, P1-P5) and byte-identical client/server mirrors', () => {
      const fs = require('node:fs');
      const serverShippedPath = path.resolve(__dirname, '../shared/services/passiveActivationPolicy.js');
      const clientShippedPath = path.resolve(__dirname, '../../vtt-react/src/services/passiveActivationPolicy.js');
      const serverBytes = fs.readFileSync(serverShippedPath, 'utf8');
      const clientBytes = fs.readFileSync(clientShippedPath, 'utf8');
      assert.equal(serverBytes, clientBytes, 'client and server passiveActivationPolicy.js must be byte-identical');

      // Load the raw shipped file directly via vm to bypass the test loader hook
      const vm = require('node:vm');
      const sandbox = { module: { exports: {} }, exports: {}, Object, Array };
      vm.runInNewContext(serverBytes, sandbox, { filename: serverShippedPath });
      const shipped = sandbox.module.exports;
      assert.ok(shipped.POLICY.creatorApproval, 'creatorApproval must be recorded');
      assert.equal(shipped.POLICY.creatorApproval.date, '2026-11-14');
      assert.equal(shipped.POLICY.creatorApproval.conversationId, '35c44bc6-9afd-4967-80a4-49f31d81ce8e');
      assert.equal(
        shipped.POLICY.creatorApproval.reference,
        'handoff/first-playable-passive-implementation-successor-20261114/CREATOR_APPROVAL.md#creator-approval-14-november-2026'
      );
      assert.deepEqual(Array.from(shipped.POLICY.creatorApproval.scope), ['P1', 'P2', 'P3', 'P4', 'P5']);
      assert.equal(shipped.approved(), true);
      assert.equal(shipped.stackingMode(), 'one-copy-additive');
      assert.equal(shipped.HEIGHTENED_SENSES_PASSIVE.passiveId, 'heightened-senses');
      assert.equal(shipped.HEIGHTENED_SENSES_PASSIVE.sourceRecordId, 'skill_perception_heightened_senses');
      assert.equal(shipped.HEIGHTENED_SENSES_PASSIVE.effect.magnitude, 2);
      assert.equal(shipped.HEIGHTENED_SENSES_PASSIVE.effect.stat, 'initiative');
    });

    it('refuses actor_passive_activate with passive_activation_unapproved and applies +0 initiative when policy is unapproved', async() => {
      testPolicy.setApprovedForTest(false);
      h.token(h.pc).character.stats.agility = 14;
      h.token(h.pc).character.stats.initiativeMod = 2;

      let writerCalled = 0;
      const realAdmit = h.writer.admitConsequence.bind(h.writer);
      h.writer.admitConsequence = (...args) => { writerCalled += 1; return realAdmit(...args); };

      await h.refused(h.gm, 'actor_passive_activate', h.activationPayload(h.pc), 'passive_activation_unapproved');
      assert.equal(writerCalled, 0);
      assert.equal(h.live().gameState.passiveLedger, undefined);

      const listed = await h.list(h.gm);
      assert.equal(listed.success, true);
      assert.equal(listed.capability, 'unapproved');
      assert.equal(listed.status, 'inactive');
      assert.equal(listed.displayStatus, 'Inactive — creator approval pending');
      assert.equal(listed.executableClaim, false);

      const entry = await h.startCombat({ pc: 12, foe: 9 });
      assert.equal(entry.initiative, 12);
      assert.equal(entry.initiativeMod, undefined);
    });
  });

  describe('A. Canonical passive descriptor & real record admission', function() {
    it('represents Heightened Senses with exact identity, Perception NOVICE eligibility, and provenance while refusing unrelated passives', async() => {
      const spells = h.storeRecord(HEIGHTENED_SENSES);
      assert.equal(spells[0].id, 'skill_perception_heightened_senses');

      const compiled = definitionFromWizard(HEIGHTENED_SENSES, { roomId: h.room.id, classId: 'arcanoneer', definitionVersion: 1 });
      assert.equal(compiled.ok, false);
      assert.equal(compiled.code, 'unsupported_wizard_record');
      const compiledP0 = definitionFromWizard(P0, { roomId: h.room.id, classId: 'arcanoneer', definitionVersion: 1 });
      assert.equal(compiledP0.ok, false);
      assert.equal(compiledP0.code, 'unsupported_wizard_record');
      assert.match(compiledP0.reason, /^Immediate ACTION required:/);
      const explained = executionPlan.explain(HEIGHTENED_SENSES, compiled);
      assert.equal(explained.authority, 'stored');
      assert.equal(explained.executableClaim, false);

      const initialList = await h.list(h.gm);
      assert.equal(initialList.success, true);
      assert.equal(initialList.status, 'stored');
      assert.equal(initialList.displayStatus, 'Stored — not active');
      assert.equal(initialList.activations.length, 0);

      for (const bad of [
        { passiveId: 'unknown-passive', sourceRecordId: 'skill_perception_heightened_senses' },
        { passiveId: 'heightened-senses', sourceRecordId: 'ithran_vat_knit_flesh' },
        { passiveId: P0.id, sourceRecordId: P0.id },
        { passiveId: P1.id, sourceRecordId: P1.id },
        { passiveId: P2.id, sourceRecordId: P2.id },
        { passiveId: UNRELATED_PASSIVE.id, sourceRecordId: UNRELATED_PASSIVE.id }
      ]) {
        await h.refused(h.gm, 'actor_passive_activate', h.activationPayload(h.pc, bad), 'unsupported_passive');
      }
    });

    it('strictly requires explicit Perception NOVICE or higher skill rank and refuses missing or untrained skillRanks', async() => {
      delete h.token(h.pc).character.skillRanks;
      await h.refused(h.gm, 'actor_passive_activate', h.activationPayload(h.pc), 'passive_source_ineligible');

      h.token(h.pc).character.skillRanks = { perception: 'UNTRAINED' };
      await h.refused(h.gm, 'actor_passive_activate', h.activationPayload(h.pc), 'passive_source_ineligible');

      h.token(h.pc).character.skillRanks = {};
      await h.refused(h.gm, 'actor_passive_activate', h.activationPayload(h.pc), 'passive_source_ineligible');

      h.token(h.pc).character.skillRanks = { perception: 'NOVICE' };
      const activated = await h.activate(h.pc);
      assert.equal(activated.success, true);
      assert.equal(activated.status, 'active');
      assert.equal(activated.displayStatus, 'Active — +2 initiative');
      assert.equal(activated.effectText, '+2 initiative');
    });

    it('refuses client-supplied stacking profile overrides that contradict the active policy and tampered passive records', async() => {
      await h.refused(
        h.gm,
        'actor_passive_activate',
        h.activationPayload(h.pc, { profile: 'both-copies' }),
        'unsupported_passive_profile'
      );
      await h.refused(
        h.gm,
        'actor_passive_activate',
        h.activationPayload(h.pc, { record: { ...HEIGHTENED_SENSES, description: 'tampered' } }),
        'unsupported_passive'
      );
    });
  });

  describe('B. Explicit activation, idempotence, stacking profiles & authority', function() {
    it('refuses non-GM activation/revocation, creatures, and secondary attachments', async() => {
      await h.refused(h.owner, 'actor_passive_activate', h.activationPayload(h.pc), 'forbidden');
      await h.refused(h.observer, 'actor_passive_activate', h.activationPayload(h.pc), 'forbidden');
      await h.refused(h.gm, 'actor_passive_activate', h.activationPayload(h.foe), 'unsupported_passive_target');

      h.token(h.ally).state.actorContract.primary = false;
      await h.refused(h.gm, 'actor_passive_activate', h.activationPayload(h.ally), 'secondary_attachment');

      const act = await h.activate(h.pc);
      assert.equal(act.success, true);
      await h.refused(h.owner, 'actor_passive_revoke', h.revokePayload(act.activation.activationId), 'forbidden');
      await h.refused(h.observer, 'actor_passive_revoke', h.revokePayload(act.activation.activationId), 'forbidden');
    });

    it('handles exact requestId replay, REQUEST_ID_CONFLICT, and REVISION_CONFLICT', async() => {
      let writerCalls = 0;
      const realAdmit = h.writer.admitConsequence.bind(h.writer);
      h.writer.admitConsequence = (...args) => { writerCalls += 1; return realAdmit(...args); };

      const payload = h.activationPayload(h.pc);
      const first = await h.ack(h.gm, 'actor_passive_activate', payload);
      assert.equal(first.success, true);
      assert.equal(first.replayed, false);
      assert.equal(writerCalls, 1);

      const replay = await h.ack(h.gm, 'actor_passive_activate', payload);
      assert.equal(replay.success, true);
      assert.equal(replay.replayed, true);
      assert.equal(replay.activation.activationId, first.activation.activationId);
      assert.equal(writerCalls, 1);

      // Same requestId with different target -> REQUEST_ID_CONFLICT
      await h.refused(
        h.gm,
        'actor_passive_activate',
        { ...payload, target: h.ally },
        'REQUEST_ID_CONFLICT'
      );

      // Wrong expectedRevision -> REVISION_CONFLICT
      await h.refused(
        h.gm,
        'actor_passive_activate',
        h.activationPayload(h.ally, { expectedRevision: 99 }),
        'REVISION_CONFLICT'
      );
    });

    it('supports all three P4 stacking modes in isolated test policy', async() => {
      h.token(h.pc).character.stats.agility = 14;
      h.token(h.pc).character.stats.initiativeMod = 2;

      // Default P4-a: one-copy-additive
      testPolicy.setStackingModeForTest('one-copy-additive');
      const first = await h.activate(h.pc);
      assert.equal(first.success, true);
      await h.refused(h.gm, 'actor_passive_activate', h.activationPayload(h.pc), 'passive_already_active');

      // P4-c: both-copies allows a second copy and stacks +4
      testPolicy.setStackingModeForTest('both-copies');
      const second = await h.activate(h.pc);
      assert.equal(second.success, true);
      const entryBoth = await h.startCombat({ pc: 10, foe: 8 });
      assert.equal(entryBoth.initiativeMod, 6);
      assert.equal(entryBoth.initiative, 16);
      await h.endCombat();

      // P4-b: exclusive refuses a second copy when one is already active
      testPolicy.setStackingModeForTest('exclusive');
      await h.refused(h.gm, 'actor_passive_activate', h.activationPayload(h.pc), 'passive_already_active');
    });
  });

  describe('C. Authoritative initiative consumption & anti-forgery', function() {
    it('applies +2 once on combat_started, avoids double-counting when client pre-includes +2 with d20Roll, and preserves custom totals without d20Roll', async() => {
      h.token(h.pc).character.stats.agility = 14;
      h.token(h.pc).character.stats.initiativeMod = 2;
      await h.activate(h.pc);

      // Client sends d20Roll: 11 -> server composes 11 + (2 + 2) = 15
      const first = await h.startCombat({ pc: 11, foe: 9 });
      assert.equal(first.initiativeMod, 4);
      assert.equal(first.initiative, 15);
      await h.endCombat();

      // Client already pre-includes +2 in initiative (15) with d20Roll: 11 -> server still computes 15, never 17
      const startedPreIncluded = await h.ack(h.gm, 'combat_started', {
        roomId: h.room.id,
        currentTurnIndex: 0,
        turnOrder: [
          { tokenId: 'pc', name: 'Hero', actorRef: h.pc, isCharacterToken: true, d20Roll: 11, initiative: 15, initiativeMod: 4 },
          { tokenId: 'foe', name: 'Ghoul', actorRef: h.foe, isCharacterToken: false, d20Roll: 9, initiative: 9 }
        ]
      });
      assert.equal(startedPreIncluded.success, true);
      const preIncluded = h.entry(h.pc);
      assert.equal(preIncluded.initiativeMod, 4);
      assert.equal(preIncluded.initiative, 15);
      await h.endCombat();

      // Custom initiative total without d20Roll -> server preserves custom total 19, keeps base initiativeMod: 2, and reports passiveApplied: false
      const startedCustom = await h.ack(h.gm, 'combat_started', {
        roomId: h.room.id,
        currentTurnIndex: 0,
        turnOrder: [
          { tokenId: 'pc', name: 'Hero', actorRef: h.pc, isCharacterToken: true, initiative: 19 },
          { tokenId: 'foe', name: 'Ghoul', actorRef: h.foe, isCharacterToken: false, initiative: 9, d20Roll: 9 }
        ]
      });
      assert.equal(startedCustom.success, true);
      const customEntry = h.entry(h.pc);
      assert.equal(customEntry.initiativeMod, 2);
      assert.equal(customEntry.initiative, 19);
      assert.equal(customEntry.passiveApplied, false);
      await h.endCombat();

      // Custom initiative total flagged via customInitiative: true (even with client-derived d20Roll) -> preserves custom total 19, passiveApplied: false
      const startedCustomFlagged = await h.ack(h.gm, 'combat_started', {
        roomId: h.room.id,
        currentTurnIndex: 0,
        turnOrder: [
          { tokenId: 'pc', name: 'Hero', actorRef: h.pc, isCharacterToken: true, initiative: 19, d20Roll: 17, customInitiative: true, initiativeMod: 2 },
          { tokenId: 'foe', name: 'Ghoul', actorRef: h.foe, isCharacterToken: false, initiative: 9, d20Roll: 9 }
        ]
      });
      assert.equal(startedCustomFlagged.success, true);
      const customFlaggedEntry = h.entry(h.pc);
      assert.equal(customFlaggedEntry.initiativeMod, 2);
      assert.equal(customFlaggedEntry.initiative, 19);
      assert.equal(customFlaggedEntry.passiveApplied, false);
    });

    it('applies +2 on authoritative combatRoster join and avoids double-counting', async() => {
      h.token(h.pc).character.stats.agility = 14;
      h.token(h.pc).character.stats.initiativeMod = 2;
      await h.activate(h.pc);

      // Start combat with only foe and ally so pc can join later
      const started = await h.ack(h.gm, 'combat_started', {
        roomId: h.room.id,
        currentTurnIndex: 0,
        turnOrder: [
          { tokenId: 'ally', name: 'Scout', actorRef: h.ally, isCharacterToken: true, initiative: 12, d20Roll: 11 },
          { tokenId: 'foe', name: 'Ghoul', actorRef: h.foe, isCharacterToken: false, initiative: 8, d20Roll: 8 }
        ]
      });
      assert.equal(started.success, true);

      const room = h.live();
      const ledger = h.actors.ledger(room);
      const clock = room.gameState.combat.effectLifecycle
        ? { id: room.gameState.combat.effectLifecycle.id, sequence: room.gameState.combat.effectLifecycle.sequence }
        : null;
      const pcRevision = h.token(h.pc).state.actorContract.revision;
      const staged = combatRoster.stage(room, { id: h.gmUid, isGM: true }, h.gmUid, {
        version: 1,
        roomId: room.id,
        commandId: h.uuid(),
        actionEpoch: h.actors.epoch(room),
        baseCommitSequence: ledger.commitSequence,
        combatHash: h.actors.hash(room.gameState.combat),
        expectedClock: clock,
        op: 'join',
        target: h.pc,
        targetState: 'bound',
        expectedTargetRevision: pcRevision,
        placement: { kind: 'before', ref: h.ally },
        entry: { initiative: 13, d20Roll: 11 }
      }, 1);

      const joinedPc = staged.next.combat.turnOrder.find(item => item.tokenId === 'pc');
      assert.ok(joinedPc);
      assert.equal(joinedPc.initiativeMod, 4);
      assert.equal(joinedPc.initiative, 15);
    });

    it('strips client-forged passive fields and overwrites forged initiative totals when no activation exists', async() => {
      h.token(h.pc).character.stats.agility = 14;
      h.token(h.pc).character.stats.initiativeMod = 2;

      const started = await h.ack(h.gm, 'combat_started', {
        roomId: h.room.id,
        currentTurnIndex: 0,
        turnOrder: [
          {
            tokenId: 'pc',
            name: 'Hero',
            actorRef: h.pc,
            isCharacterToken: true,
            d20Roll: 10,
            initiative: 99,
            initiativeMod: 9,
            passiveBonus: 2,
            activePassives: ['heightened-senses'],
            passiveContributions: [{ passiveId: 'heightened-senses', amount: 2 }]
          },
          { tokenId: 'foe', name: 'Ghoul', actorRef: h.foe, isCharacterToken: false, initiative: 8, d20Roll: 8 }
        ]
      });
      assert.equal(started.success, true);
      const entry = h.entry(h.pc);
      assert.equal(entry.initiativeMod, 2);
      assert.equal(entry.initiative, 12);
      assert.equal(entry.passiveBonus, undefined);
      assert.equal(entry.activePassives, undefined);
      assert.equal(entry.passiveContributions, undefined);
    });
  });

  describe('D/E. Revocation, stale transitions, persistence, privacy & rollback compatibility', function() {
    it('transitions activation to stale on loss of Perception NOVICE eligibility, ownership change, or incarnation rebind', async() => {
      h.token(h.pc).character.stats.agility = 14;
      h.token(h.pc).character.stats.initiativeMod = 2;
      h.token(h.pc).character.skillRanks = { perception: 'NOVICE' };

      const act = await h.activate(h.pc);
      assert.equal(act.success, true);

      // Drop skill rank to UNTRAINED -> activation becomes stale ('Inactive — requires Perception NOVICE')
      h.token(h.pc).character.skillRanks = { perception: 'UNTRAINED' };
      const listedIneligible = await h.list(h.gm);
      assert.equal(listedIneligible.status, 'inactive');
      assert.equal(listedIneligible.activations[0].state, 'stale');
      assert.match(listedIneligible.activations[0].displayStatus, /^Inactive — requires Perception NOVICE/);

      const entryAfterLoss = await h.startCombat({ pc: 10, foe: 8 });
      assert.equal(entryAfterLoss.initiativeMod, 2);
      assert.equal(entryAfterLoss.initiative, 12);
      await h.endCombat();

      // Restoring skill rank while stale activation still exists requires revoking stale activation first
      h.token(h.pc).character.skillRanks = { perception: 'NOVICE' };
      h.token(h.pc).state.actorContract.revision += 1;
      await h.refused(h.gm, 'actor_passive_activate', h.activationPayload(h.pc), 'passive_activation_stale');

      const revoked = await h.revoke(act.activation.activationId);
      assert.equal(revoked.success, true);
      assert.equal(revoked.status, 'stored');
      assert.equal(revoked.displayStatus, 'Stored — not active');
    });

    it('preserves passiveLedger across roomCheckpoint build/decode and supports old checkpoints without passiveLedger', async() => {
      const act = await h.activate(h.pc);
      assert.equal(act.success, true);

      h.rebuild();
      const listed = await h.list(h.gm);
      assert.equal(listed.success, true);
      assert.equal(listed.activations.length, 1);
      assert.equal(listed.activations[0].activationId, act.activation.activationId);
      assert.equal(listed.activations[0].state, 'active');

      // Old checkpoint without passiveLedger decodes cleanly
      const stateWithoutPassive = h.actors.clone(h.live().gameState);
      delete stateWithoutPassive.passiveLedger;
      const builtOld = roomCheckpoint.buildCheckpointDocuments({
        roomId: h.room.id,
        gameState: stateWithoutPassive,
        revision: 2
      });
      const decodedOld = roomCheckpoint.decodeCanonicalCheckpoint({
        checkpoint: builtOld.manifest,
        globalDoc: builtOld.global.data,
        mapDocsById: Object.fromEntries(builtOld.maps.map(item => [item.mapId, item.data]))
      });
      assert.equal(decodedOld.ok, true);
      assert.equal(decodedOld.global.passiveLedger, undefined);
    });

    it('strips forged passiveLedger on untrusted client import, redacts outbound gameState, and enforces viewer privacy on actor_passive_list', async() => {
      const act = await h.activate(h.pc);
      assert.equal(act.success, true);

      // Outbound roomAccessService projection never leaks raw passiveLedger
      const projected = roomAccessService.projectGameStateForClient(h.live().gameState);
      assert.equal(projected.passiveLedger, undefined);

      // Untrusted client import moves forged passiveLedger to actorConsequenceRecovery.importedPassiveLedger
      const forgedImport = {
        passiveLedger: { version: 1, revision: 9, activations: [{ activationId: 'forged' }], requests: {} },
        maps: {}
      };
      assert.equal(h.actors.authorityMetadataPath(forgedImport), 'passiveLedger');
      h.actors.preserveImportedActorMetadata(forgedImport);
      assert.equal(forgedImport.passiveLedger, undefined);
      assert.deepEqual(forgedImport.actorConsequenceRecovery.importedPassiveLedger, {
        version: 1,
        revision: 9,
        activations: [{ activationId: 'forged' }],
        requests: {}
      });

      // Viewer-scoped actor_passive_list: GM and owner see pc's activation; unrelated observer sees none; non-GM owner does not receive gmUid
      const gmList = await h.list(h.gm);
      const ownerList = await h.list(h.owner);
      const observerList = await h.list(h.observer);
      assert.equal(gmList.activations.length, 1);
      assert.equal(gmList.activations[0].gmUid, h.gmUid);
      assert.equal(ownerList.activations.length, 1);
      assert.equal(ownerList.activations[0].gmUid, undefined);
      assert.equal(ownerList.activations[0].activatedAtCommit, undefined);
      assert.equal(ownerList.activations[0].targetRevision, undefined);
      assert.equal(ownerList.activations[0].sourceRecordSha256, undefined);
      assert.equal(observerList.activations.length, 0);
      assert.equal(observerList.status, 'stored');
    });

    it('supports clean rollback scrubbing of passiveLedger in gameState and checkpoint bundles', async() => {
      await h.activate(h.pc);
      const stateCopy = h.actors.clone(h.live().gameState);
      assert.ok(stateCopy.passiveLedger);

      const scrubbed = passives.scrubGameState(stateCopy);
      assert.equal(scrubbed.ok, true);
      assert.equal(scrubbed.changed, true);
      assert.equal(scrubbed.gameState.passiveLedger, undefined);
      assert.equal(scrubbed.summary.passiveLedger.removed, true);
      assert.equal(scrubbed.summary.passiveLedger.activations, 1);

      const built = roomCheckpoint.buildCheckpointDocuments({
        roomId: h.room.id,
        gameState: h.live().gameState,
        revision: 3
      });
      const bundle = {
        manifest: built.manifest,
        globalDoc: built.global.data,
        mapDocsById: Object.fromEntries(built.maps.map(item => [item.mapId, item.data]))
      };
      const bundleScrub = passives.scrubCheckpointBundle(bundle);
      assert.equal(bundleScrub.ok, true);
      assert.equal(bundleScrub.changed, true);
      const decodedAfterScrub = roomCheckpoint.decodeCanonicalCheckpoint({
        checkpoint: bundleScrub.bundle.manifest,
        globalDoc: bundleScrub.bundle.globalDoc,
        mapDocsById: bundleScrub.bundle.mapDocsById
      });
      assert.equal(decodedAfterScrub.ok, true);
      assert.equal(decodedAfterScrub.global.passiveLedger, undefined);
    });
  });
});
