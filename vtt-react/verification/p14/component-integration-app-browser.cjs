// Bounded combined witness: reuse the released cooldown journey, replacing only its
// combat-start shortcut and adding route explanations + periodic legal reuse.
// The borrowed and executed sources are recorded separately; product modules stay untouched.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict'), Module = require('module');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const root = path.resolve(__dirname, '../../..'), out = process.env.EC_OUTPUT;
assert.ok(out && process.env.COMBINED_CAPTURE && process.env.COMBINED_INSTALL, 'Explicit output/capture/install identities required');
fs.mkdirSync(out, { recursive: true });
// COMBINED_CAPTURE is the POST-install m4-build capture.json, never the installer's
// pre-install handoff CAPTURE.json (which is retained exclusively for drift guards).
const captureBytes = fs.readFileSync(process.env.COMBINED_CAPTURE);
const capture = JSON.parse(captureBytes);
assert.match(capture.captureHash || '', /^[0-9a-f]{64}$/, 'Post-install identified BUILD capture required');
const installed = JSON.parse(fs.readFileSync(process.env.COMBINED_INSTALL));
const selected = [...new Set(installed.entries.map(e => e.path).concat([
  'vtt-react/src/store/combatStore.js', 'vtt-react/src/components/combat/CombatSelectionOverlay.jsx', 'vtt-react/src/components/grid/CharacterToken.jsx',
  'server/services/spellPayments.js', 'server/services/installedAuthoredAbilities.js', 'server/services/actorConsequences.js', 'server/services/authoredCooldowns.js', 'server/services/sharedEffectLifecycle.js'
]))];
const coverage = () => Object.fromEntries(selected.map(p => [p, sha(fs.readFileSync(path.join(root, p)))]));
const sourceCoverage = coverage();
function verifyCoverage() { const actual = coverage(); for (const p of selected) assert.equal(actual[p], capture.files[p], `Uncaptured source ${p}`); }
verifyCoverage();
for (const e of installed.entries) assert.equal(sourceCoverage[e.path], e.final, `Installed/source drift ${e.path}`);
const originalPath = path.join(__dirname, 'effect-cooldown-app-browser.cjs');
let source = fs.readFileSync(originalPath, 'utf8');
const borrowedSha256 = sha(source);
function replaceOnce(from, to) { assert.equal(source.split(from).length, 2, `Unique reviewed witness anchor required: ${from.slice(0, 90)}`); source = source.replace(from, to); }
replaceOnce("const host = await require('../p9/integration/app-server.cjs').start();", "const host = await require('../p9/integration/app-server.cjs').start();\n  PC(host).character.actionPoints.current = 4; // disclosed pre-App room fixture budget for four casts");
replaceOnce("const report = { startedAt:", "const report = { integration: global.__componentIntegration.metadata, startedAt:");
// The released author helper is extended only for the extra direct-only route control.
replaceOnce("  await book(p).getByRole('heading', { name: 'Control', exact: true }).click();", "  if (c.kind !== 'direct') {\n  await book(p).getByRole('heading', { name: 'Control', exact: true }).click();");
replaceOnce("  await fields.getByLabel(/^Required GM adjudication note/).fill('GM resolves eligibility and range at the table before confirming.');", "  await fields.getByLabel(/^Required GM adjudication note/).fill('GM resolves eligibility and range at the table before confirming.');\n  }");
replaceOnce("  await nav.getByRole('button', { name: /Cooldown$/ }).click();", "  if (c.cooldown) { await nav.getByRole('button', { name: /Cooldown$/ }).click();");
replaceOnce("  save(`wizard-cooldown-${c.kind}.aria.yml`, await book(p).ariaSnapshot());", "  save(`wizard-cooldown-${c.kind}.aria.yml`, await book(p).ariaSnapshot()); }");
replaceOnce("  assert.deepEqual(r.authoredDraft.cooldownConfig, { cooldownType: cooldown.TYPE, cooldownValue: c.cooldown });", "  if (c.cooldown) assert.deepEqual(r.authoredDraft.cooldownConfig, { cooldownType: cooldown.TYPE, cooldownValue: c.cooldown });");
replaceOnce("  assert.deepEqual(mapped.definition.cooldown, { cooldownType: cooldown.TYPE, cooldownValue: c.cooldown });", "  if (c.cooldown) assert.deepEqual(mapped.definition.cooldown, { cooldownType: cooldown.TYPE, cooldownValue: c.cooldown });");
replaceOnce("  if (c.kind === 'periodic') assert.equal(mapped.definition.effects.direct, null, 'a standalone periodic effect has no immediate part');\n  else assert.deepEqual(mapped.definition.effects.condition, { kind: 'movement', feet: c.feet, label: c.label });", "  if (c.kind === 'periodic' && !c.now) assert.equal(mapped.definition.effects.direct, null, 'a standalone periodic effect has no immediate part');\n  if (c.kind === 'movement') assert.deepEqual(mapped.definition.effects.condition, { kind: 'movement', feet: c.feet, label: c.label });");
replaceOnce("    stage('author/save/reopen/admit', 'App controls (Spell Wizard incl. Cooldown step, Spell Library, room admission) — both abilities');", "    stage('author/save/reopen/admit', 'App controls (Spell Wizard incl. Cooldown step, Spell Library, room admission) — both abilities');\n    await global.__componentIntegration.routes({ gm, host, author, openBook, book, setup, save, report, stage, P });");
// No socket/store combat-start alternative: normal discovery and manual initiative controls.
const oldStart = source.slice(source.indexOf("    report.qualifications.push('A caster-start cooldown"), source.indexOf('    await openClock(); await clockUI(gm).getByRole'));
assert.ok(oldStart.includes("__socket.emit('combat_started'"));
replaceOnce(oldStart, `    const nav = gm.locator('[title^="Combat Initiator"]').first();
    if (await nav.count() && await nav.isVisible()) await nav.click(); else { await gm.locator('body').click({ position: { x: 700, y: 500 } }); await gm.keyboard.press('x'); }
    const overlay = gm.locator('.combat-selection-window'); await overlay.waitFor({ timeout: 15000 });
    const discovery = overlay.locator('.combatants-discovery-section');
    for (const [id, initiative] of [['pc', 30], ['A', 20], ['B', 10]]) {
      await discovery.locator('.discovery-item').filter({ hasText: '#' + id }).first().click();
      await overlay.locator('#init-' + id).fill(String(initiative));
    }
    save('combat-initiator-ready.aria.yml', await overlay.ariaSnapshot());
    await overlay.getByRole('button', { name: /^Begin Combat \\(3\\)$/ }).click();
    assert.ok(await wait(() => combat()?.isActive === true));
    assert.deepEqual(combat().turnOrder.map(e => e.tokenId), ['pc', 'A', 'B']);
    stage('combat start', 'Normal Combat Initiator discovery + manual initiative + Begin Combat (3), PC included; no socket fallback');
`);
replaceOnce("    assert.equal(report.errors.length, 0, JSON.stringify(report.errors));", `    // Both cooldown journeys include legal reuse. D1 is now expired and its first cooldown released.
    od = await openCast(P.name); await od.getByText(/Cooldown ready\\./).waitFor();
    const beforeReuseP = { pools: pool(host), hp: hpOf(host), receipts: actors.ledger(host.room).receipts.length };
    await approveButton(od).click(); await od.getByText(/Awaiting GM adjudication/).waitFor();
    card = await fillCard(P.name); await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    assert.ok(await wait(() => actors.ledger(host.room).receipts.length === beforeReuseP.receipts + 1));
    assert.deepEqual(hpOf(host), beforeReuseP.hp); assert.equal(ticking(host).length, 1);
    const reuseP = cds(host)[cooldown.key(host.refs.pc, recP.authoredDefinitionId)];
    assert.deepEqual([reuseP.startSequence, reuseP.dueSequence], [9, 12]);
    const afterReuseP = pool(host);
    for (const k of ['ap', 'mana']) assert.equal(afterReuseP[k].current + afterReuseP[k].temp, beforeReuseP.pools[k].current + beforeReuseP.pools[k].temp - (k === 'ap' ? P.ap : P.mana));
    report.checks.d1LegalReuse = { commandId: reuseP.commandId, startSequence: 9, dueSequence: 12 };
    stage('D1 legal reuse', 'App controls after original periodic expiry and independent cooldown release');
    report.checks.ownerCasts = actors.ledger(host.room).receipts.filter(r => r.authorization?.kind === 'owner-approval-gm').length;
    assert.equal(report.checks.ownerCasts, 4);
    assert.equal(report.errors.length, 0, JSON.stringify(report.errors));`);
replaceOnce("    report.endedAt = new Date().toISOString(); report.build = process.env.APP_BUILD_DIR;", "    try { const sourceAfter = global.__componentIntegration.coverage(); report.integration.sourceDrift = Object.keys(sourceAfter).filter(p => report.integration.sourceCoverage[p] !== sourceAfter[p]); if (report.integration.sourceDrift.length) { report.passed = false; report.errors.push({ message: 'Captured source drift', paths: report.integration.sourceDrift }); } } catch (e) { report.passed = false; report.integration.sourceDrift = ['identity-read-failed']; report.errors.push({ message: e.message }); }\n    report.endedAt = new Date().toISOString(); report.build = process.env.APP_BUILD_DIR;");
replaceOnce("    report.checks.d2Cast = { commandId: r2.commandId, cooldown: item, hpBefore, hpAfter: hpOf(host), poolBefore, poolAfter: paid };", "    assert.equal(paid.ap.current + paid.ap.temp, poolBefore.ap.current + poolBefore.ap.temp - M.ap);\n    report.checks.d2Cast = { commandId: r2.commandId, cooldown: item, hpBefore, hpAfter: hpOf(host), poolBefore, poolAfter: paid };");

async function routes({ gm, host, author, openBook, book, setup, save, report, stage, P }) {
  const actors = require('../../../server/services/actorConsequences');
  const pure = require('../../src/services/authoredAbility');
  const producer = require('./creature-execution-app-browser.cjs');
  const C = { ...P, name: 'HQ Cinder Brand', now: '1d6+2', cooldown: null, label: 'HQ Cinder ticks' };
  const D = { kind: 'direct', name: 'HQ Cinder Lash', now: '1d6+2', ap: 1, mana: 2 };
  const composition = await author(gm, C), direct = await author(gm, D);
  await openBook(gm); await book(gm).getByRole('button', { name: 'Spell Library', exact: true }).click(); await book(gm).getByText(C.name, { exact: true }).click();
  const pc = gm.getByRole('region', { name: `Room admission for ${C.name}`, exact: true });
  await pc.waitFor(); assert.equal(await pc.locator('.exec-compat').getAttribute('data-state'), 'partial');
  assert.match(await pc.innerText(), /The owner approves the exact price, target and roll/);
  save('flash-pc-context.aria.yml', await pc.ariaSnapshot()); stage('Flash PC context', 'Ordinary saved Spell Library detail');
  // Detached whole-record source association is fixture setup, not a claimed Bestiary assignment journey.
  const hall = host.room.gameState.maps['app-hall'];
  for (const [id, record] of [['A', composition], ['B', direct]]) hall.tokens[id].authoredAbility = { schemaVersion: 1, record: actors.clone(record), librarySpellId: record.id || null };
  report.qualifications.push('Flash source-route setup associates whole Wizard-saved records with existing bound fixture tokens A/B; Bestiary picker/placement is not rerun or claimed. Inspect, explanations and eligible admission use ordinary controls. Room PC AP is seeded to 4 before App boot for four cooldown casts.');
  await setup(gm, host.url, 'app-gm');
  let region = await producer.inspectPlaced(gm, 'A'); await region.waitFor();
  const explanation = region.getByRole('region', { name: 'Execution compatibility', exact: true }); await explanation.waitFor();
  const mapped = pure.definitionFromWizard(composition, { roomId: host.room.id, classId: 'arcanoneer', definitionVersion: 1 }); assert.equal(mapped.ok, true);
  assert.equal(await explanation.getAttribute('data-state'), 'unsupported');
  assert.ok((await explanation.innerText()).includes(pure.creatureSourceRefusal(mapped.definition).reason));
  // Preserve existing parent gating: refused Inspect cards omit admission/use entirely.
  assert.equal(await region.getByRole('button', { name: /Admit for this creature|Admit and replace|Use for this creature/ }).count(), 0);
  save('flash-refused-creature.aria.yml', await region.ariaSnapshot());
  assert.deepEqual(hall.tokens.A.authoredAbility.record, composition);
  stage('Flash refused creature composition', 'Ordinary placed Inspect; shared helper reason, manual state, no admission/use controls');
  await producer.closeInspect(gm);
  region = await producer.inspectPlaced(gm, 'B'); await region.waitFor();
  const admission = region.getByRole('region', { name: `Room admission for ${D.name}`, exact: true }); await admission.waitFor();
  assert.equal(await admission.locator('.exec-compat').getAttribute('data-state'), 'executable');
  const text = await admission.innerText(); assert.match(text, /The GM confirms success and any final amount/); assert.doesNotMatch(text, /The owner approves the exact price, target and roll/);
  const admit = admission.getByRole('button', { name: 'Admit for this creature', exact: true }); assert.equal(await admit.isEnabled(), true);
  await admit.click(); await admission.getByText(/^Admitted for /).waitFor();
  save('flash-eligible-creature.aria.yml', await region.ariaSnapshot());
  stage('Flash eligible creature', 'Ordinary placed Inspect + enabled/functioning exact creature admission');
  report.checks.flash = { refusedComposition: true, eligibleCreatureAdmission: true, pcContext: true, sourceHelperReason: pure.creatureSourceRefusal(mapped.definition).reason, wholeRecordPreserved: true };
  await producer.closeInspect(gm); await setup(gm, host.url, 'app-gm');
}
global.__componentIntegration = { routes, coverage, metadata: { captureHash: capture.captureHash, captureFileSha256: sha(captureBytes), sourceCoverage, borrowedSha256, executedSha256: sha(source), wrapperSha256: sha(fs.readFileSync(__filename)), sonnet: 'excluded: no explicit release', stunned: 'production-handler/client-planner evidence only' } };
fs.writeFileSync(path.join(out, 'executed-effect-witness.cjs'), source);
const helper = new Module(originalPath, module); helper.filename = originalPath; helper.paths = Module._nodeModulePaths(__dirname); helper._compile(source, originalPath);
helper.exports.main().then(() => { verifyCoverage(); assert.deepEqual(global.__componentIntegration.metadata.sourceDrift, []); delete global.__componentIntegration; process.exit(0); }).catch(e => { console.error(e); delete global.__componentIntegration; process.exit(1); });
