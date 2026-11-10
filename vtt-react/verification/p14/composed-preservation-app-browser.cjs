// HEADQ composed-spell preservation acceptance: the released composedSpellPreservation suite
// (ad25f5c6...) is exercised in the optimized App through the ordinary Spell Wizard / Spell Library:
// author (immediate + periodic + authenticated cooldown + component texts) -> Finalize -> reopen ->
// rename only -> Finalize -> reopen -> Cancel Edit must leave the persisted library record untouched.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');
const preflight = require('../witness-preflight.cjs');
const PREFLIGHT = require('./composed-preservation-preflight.cjs');
let out = process.env.CP_OUTPUT;
const helpers = require('./active-effects-integration-helpers.cjs');
const pure = require('../../src/services/authoredAbility');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { startedAt: new Date().toISOString(), checks: {}, qualifications: [], errors: [], steps: [], stages: {},
  limits: ['Real optimized App and registered backend fixture; identity/cloud/persistence provider are fixture boundaries.',
    'Temporary room: accepted-live only. No live Firebase, deployment or human tabletop claim.',
    'public image assets were not part of this build input: icons may 404.'] };
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); };
const stage = (name, how, detail) => { report.stages[name] = { how, ...(detail ? { detail } : {}) }; };
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const navOf = p => book(p).getByRole('navigation', { name: 'Spell wizard steps' });

/** Executable/composed authored fields as the App persists them; compared before and after the rename. */
function semantics(spell) {
  const d = spell.authoredDraft || {}, c = d.controlConfig?.authoredCondition || {};
  return {
    school: d.typeConfig?.school || null, spellType: d.spellType || null, timing: d.typeConfig?.castTimeType || null,
    damageFormula: d.damageConfig?.formula || null, damageElement: d.damageConfig?.elementType || null,
    effect: c.effect || null, label: c.label || null,
    periodicKind: c.periodicKind || null, periodicFormula: c.periodicFormula || null, periodicDamageType: c.periodicDamageType || null,
    tickRoll: c.tickRoll || null, expiryPolicy: c.expiryPolicy || null, occurrences: c.occurrences ?? null,
    durationText: c.durationText || null, gmNote: c.gmNote || null,
    cooldownType: d.cooldownConfig?.cooldownType || null, cooldownValue: d.cooldownConfig?.cooldownValue ?? null,
    targetingType: d.targetingConfig?.targetingType || null, rangeType: d.targetingConfig?.rangeType || null,
    rangeDistance: d.targetingConfig?.rangeDistance ?? null, targetRestrictions: d.targetingConfig?.targetRestrictions || null,
    maxTargets: d.targetingConfig?.maxTargets ?? null,
    actionPoints: d.resourceCost?.actionPoints ?? null, mana: d.resourceCost?.resourceValues?.mana ?? d.resourceCost?.mana ?? null,
    components: d.resourceCost?.components || null, verbalText: d.resourceCost?.verbalText || null,
    somaticText: d.resourceCost?.somaticText || null, materialText: d.resourceCost?.materialText || null
  };
}
async function openLibrary(p) { await helpers.openBook(p); await book(p).getByRole('button', { name: 'Spell Library', exact: true }).click(); await p.waitForTimeout(800); }
async function editFromLibrary(p, name) {
  await openLibrary(p);
  await book(p).getByText(name, { exact: true }).click({ button: 'right' });
  await p.getByText('Edit in Spell Wizard', { exact: true }).click();
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).waitFor({ timeout: 20000 });
}
async function wizardFields(p) {
  const nav = navOf(p), fields = {};
  fields.name = await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).inputValue();
  fields.description = await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).inputValue();
  await nav.getByRole('button', { name: /^3 Effects$/ }).click(); await p.waitForTimeout(700);
  const tab = name => book(p).locator('.effect-type-tab').filter({ hasText: new RegExp(`^${name}$`) });
  await tab('Damage').click();
  const damageBox = book(p).locator('.damage-effects-container'); await damageBox.waitFor({ timeout: 10000 });
  fields.damage = await damageBox.getByRole('textbox').first().inputValue();
  await tab('Control').click();
  const composed = book(p).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
  await composed.waitFor({ timeout: 10000 });
  fields.canonical = await composed.getByLabel(/^Canonical effect/).inputValue();
  fields.tickAmount = await composed.getByLabel(/^Tick amount/).inputValue();
  fields.ticks = await composed.getByLabel(/^Ticks/).inputValue();
  fields.tickCount = await composed.getByLabel(/^Number of ticks/).inputValue();
  await nav.getByRole('button', { name: /Cooldown$/ }).click();
  fields.cooldown = await book(p).getByLabel('Caster-turn starts to count (1–10)', { exact: true }).inputValue();
  await nav.getByRole('button', { name: /Resources$/ }).click();
  const costInput = async label => {
    const block = book(p).locator('.resource-cost-config').filter({ hasText: label });
    const spin = block.getByRole('spinbutton').first(); await spin.waitFor({ timeout: 10000 }); return spin.inputValue();
  };
  fields.mana = await costInput('Mana Cost'); fields.ap = await costInput('Action Points Cost');
  const section = book(p).locator('.spell-components-selector, .components-selector-container');
  const text = async kind => { const option = section.locator('.component-option').filter({ hasText: new RegExp(kind[0].toUpperCase() + kind.slice(1), 'i') });
    await option.locator('.edit-component-btn').click(); const area = section.locator(`textarea[placeholder*="${kind}"]`).first(); await area.waitFor(); const value = await area.inputValue(); return value; };
  fields.verbal = await text('verbal'); fields.somatic = await text('somatic');
  return fields;
}

async function main() {
  const preflightResult = await preflight.run(PREFLIGHT);
  report.preflight = { checks: preflightResult.checks, build: preflightResult.build, server: preflightResult.server };
  out = process.env.CP_OUTPUT;
  if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External CP_OUTPUT and APP_BUILD_DIR required');
  fs.mkdirSync(out, { recursive: true });
  process.env.APP_OUTPUT = path.join(out, 'fixture');
  const host = await require('../p9/integration/app-server.cjs').start();
  const pages = {};
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const gm = pages.gm = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: 'reduce',
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)'
    });
    gm.on('pageerror', e => { if (!/Failed to fetch|blockedbyclient|Loading chunk/i.test(e.message)) report.errors.push({ role: 'gm', message: e.message }); }); helpers.patchClick(gm);
    await helpers.setup(gm, host.url, 'app-gm');
    const name1 = 'CP Astral Conflagration', name2 = 'CP Astral Conflagration (Renamed)';
    const spec = { name: name1, description: 'Immediate blast followed by burning embers and a caster-start cooldown.', now: '2d8', kind: 'periodic',
      label: 'Smouldering Embers', formula: '1d6', damageType: 'arcane', policy: 'target-start-count', ticks: 3, cooldown: 3,
      duration: 'While the embers smoulder', ap: 1, mana: 2, components: { verbal: 'Ignis Astralis', somatic: 'Thrust palms forward' } };
    step('author the composed spell through the ordinary Wizard (immediate + periodic + authenticated cooldown + V/S texts) and Finalize');
    const first = await helpers.author(gm, spec); save('first-saved.json', first);
    const initial = semantics(first); report.checks.initial = initial;
    assert.equal(initial.damageFormula, '2d8'); assert.equal(initial.periodicFormula, '1d6'); assert.equal(initial.expiryPolicy, 'target-start-count');
    assert.equal(initial.occurrences, 3); assert.equal(initial.cooldownType, 'authenticated_caster_start'); assert.equal(initial.cooldownValue, 3);
    assert.deepEqual(initial.components, ['verbal', 'somatic']); assert.equal(initial.verbalText, 'Ignis Astralis'); assert.equal(initial.somaticText, 'Thrust palms forward');
    assert.equal(initial.actionPoints, 1); assert.equal(initial.mana, 2);
    const mapped = pure.definitionFromWizard(first, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' });
    report.checks.definition = { ok: mapped.ok, code: mapped.code || null, reason: mapped.reason || null };
    report.qualifications.push('Definition conservation only: the component-bearing saved record is preserved across edit cycles, while definitionFromWizard keeps it manual/unsupported for execution (released executability qualification).');
    assert.equal(mapped.ok, false); assert.equal(mapped.code, 'unsupported_wizard_record');
    stage('author/save', 'App controls (Spell Wizard all steps + Finalize)');

    step('reopen the saved card in the Wizard and verify the executable fields are populated');
    await editFromLibrary(gm, name1);
    const reopened = await wizardFields(gm); report.checks.reopened = reopened;
    assert.equal(reopened.name, name1); assert.equal(reopened.damage, '2d8'); assert.equal(reopened.tickAmount, '1d6');
    assert.equal(reopened.ticks, 'target-start-count'); assert.equal(reopened.tickCount, '3'); assert.equal(reopened.cooldown, '3');
    assert.equal(reopened.mana, '2'); assert.equal(reopened.ap, '1'); assert.equal(reopened.verbal, 'Ignis Astralis'); assert.equal(reopened.somatic, 'Thrust palms forward');
    save('reopened-fields.json', reopened);
    stage('reopen', 'App control (Spell Library right-click -> Edit in Spell Wizard)');

    step('change ONLY the name and save with the repaired embedded App control (Update); identity is preserved and no duplicate record is created');
    await navOf(gm).getByRole('button', { name: /Basic Info$/ }).click();
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(name2);
    // Embedded controls are mounted in the embedded App header
    const updateBtn = book(gm).locator('.finalize-btn');
    const cancelEditBtn = book(gm).getByTitle('Cancel Edit');
    const previewUpdateBtn = gm.getByRole('button', { name: '✓ Update Spell', exact: true });
    report.checks.embeddedControls = {
      finalizeHeader: await updateBtn.count(),
      cancelEdit: await cancelEditBtn.count(),
      previewUpdate: await previewUpdateBtn.count()
    };
    assert.equal(report.checks.embeddedControls.finalizeHeader, 1, 'Update button (.finalize-btn) mounted in embedded window');
    assert.equal(report.checks.embeddedControls.cancelEdit, 1, 'Cancel Edit button mounted in embedded window');
    if (await gm.locator('.external-live-preview-container').count() > 0) {
      assert.equal(report.checks.embeddedControls.previewUpdate, 1, 'External Live Preview displays Update Spell during edit');
    }

    // Click Update
    await updateBtn.click();
    await gm.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), name2);
    const second = await helpers.savedRecord(gm, name2); save('second-saved.json', second); assert.ok(second, 'renamed record saved');
    assert.equal(second.name, name2); assert.equal(second.description, spec.description);
    // Identity is preserved; no duplicate record minted
    assert.equal(second.id, first.id, 'App-embedded save preserves original spell identity (no accidental duplicate)');
    report.checks.appIdentity = { first: first.id, second: second.id, identical: true };
    const allSpells = await gm.evaluate(() => {
      const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData'));
      return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells : [];
    });
    report.checks.librarySpellCount = allSpells.length;
    assert.equal(allSpells.length, 1, 'Library contains exactly one spell; no unexpected second spell created');
    const after = semantics(second); report.checks.afterRename = after; assert.deepEqual(after, initial, 'every composed field survived the App update cycle');
    stage('rename + update', 'App embedded control (.finalize-btn Update); identity preserved, count 1');
    await helpers.closeBook(gm);

    step('reopen the renamed record again and verify the same fields');
    await editFromLibrary(gm, name2);
    const again = await wizardFields(gm); report.checks.reopenedAgain = again;
    assert.equal(again.name, name2); assert.equal(again.damage, '2d8'); assert.equal(again.tickAmount, '1d6'); assert.equal(again.tickCount, '3'); assert.equal(again.cooldown, '3');
    save('reopened-again-fields.json', again);
    stage('reopen again', 'App control (Spell Library -> Edit in Spell Wizard)');

    step('mutate a field and click Cancel Edit; discard confirmation leaves stored record unchanged');
    const beforeDiscard = JSON.stringify(await helpers.savedRecord(gm, name2));
    await navOf(gm).getByRole('button', { name: /Basic Info$/ }).click();
    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('MUTATED DESCRIPTION THAT MUST BE DISCARDED');
    assert.equal(await book(gm).getByTitle('Cancel Edit').count(), 1, 'Cancel Edit is mounted in the embedded App');
    await book(gm).getByTitle('Cancel Edit').click();
    // Wait for discard confirmation dialog
    const discardBtn = gm.getByRole('button', { name: 'Discard Changes', exact: true });
    await discardBtn.waitFor({ timeout: 10000 });
    await discardBtn.click();
    await gm.waitForTimeout(500);
    await helpers.closeBook(gm);
    const third = await helpers.savedRecord(gm, name2); report.checks.afterDiscard = third; assert.equal(JSON.stringify(third), beforeDiscard, 'cancelled edit discarded mutations and modified nothing');
    stage('cancel edit + discard', 'App control (Cancel Edit -> Discard Changes confirmation); stored record untouched');

    step('reopen after the abandoned edit: name and original description remain, no mutation');
    await editFromLibrary(gm, name2);
    assert.equal(await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).inputValue(), name2);
    assert.equal(await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).inputValue(), spec.description);
    save('final-reopened.aria.yml', await book(gm).ariaSnapshot());
    stage('post-discard reopen', 'App control (Spell Library -> Edit in Spell Wizard)');

    step('update via Step 10 Review: preserves ID, count = 1, executable components survive');
    const name3 = 'CP Astral Conflagration (Review Updated)';
    await navOf(gm).getByRole('button', { name: /Basic Info$/ }).click();
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(name3);
    await navOf(gm).getByRole('button', { name: /(10 Review$|^10$)/ }).click();
    await gm.waitForTimeout(500);
    const reviewSaveBtn = book(gm).locator('.step10-review-container .save-button');
    await reviewSaveBtn.waitFor({ state: 'visible', timeout: 10000 });
    assert.equal(await reviewSaveBtn.textContent(), 'Update Spell');
    await reviewSaveBtn.click();
    await gm.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), name3);
    const reviewSaved = await helpers.savedRecord(gm, name3); save('review-updated-saved.json', reviewSaved);
    assert.equal(reviewSaved.id, first.id, 'Step 10 Review update preserves original ID');
    assert.equal(reviewSaved.dateCreated, first.dateCreated, 'Step 10 Review update preserves original dateCreated');
    assert.equal(reviewSaved.name, name3);
    const spellsAfterReview = await gm.evaluate(() => {
      const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData'));
      return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells : [];
    });
    assert.equal(spellsAfterReview.length, 1, 'Library contains exactly one spell after Review update');
    const afterReviewSemantics = semantics(reviewSaved);
    report.checks.afterReviewUpdate = afterReviewSemantics;
    assert.deepEqual(afterReviewSemantics, initial, 'every composed field survived the Review update cycle');
    stage('review-step update', 'App control (Step 10 Review Update Spell); identity preserved, count 1, components intact');
    await helpers.closeBook(gm);

    step('reopen and update via External Live Preview: preserves ID, count = 1, executable components survive');
    const name4 = 'CP Astral Conflagration (Preview Updated)';
    await editFromLibrary(gm, name3);
    await navOf(gm).getByRole('button', { name: /Basic Info$/ }).click();
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(name4);
    const livePreviewUpdateBtn = gm.getByRole('button', { name: '✓ Update Spell', exact: true });
    await livePreviewUpdateBtn.waitFor({ state: 'visible', timeout: 10000 });
    await livePreviewUpdateBtn.click();
    await gm.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), name4);
    const fourthSaved = await helpers.savedRecord(gm, name4); save('preview-updated-saved.json', fourthSaved);
    assert.equal(fourthSaved.id, first.id, 'External Live Preview update preserves original ID');
    assert.equal(fourthSaved.dateCreated, first.dateCreated, 'External Live Preview update preserves original dateCreated');
    assert.equal(fourthSaved.name, name4);
    const spellsAfterPreview = await gm.evaluate(() => {
      const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData'));
      return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells : [];
    });
    assert.equal(spellsAfterPreview.length, 1, 'Library contains exactly one spell after Preview update');
    const afterPreviewSemantics = semantics(fourthSaved);
    report.checks.afterPreviewUpdate = afterPreviewSemantics;
    assert.deepEqual(afterPreviewSemantics, initial, 'every composed field survived the Live Preview update cycle');
    stage('preview update', 'App control (External Live Preview Update Spell); identity preserved, count 1, components intact');
    await helpers.closeBook(gm);

    step('author and update a supported spell: passes definitionFromWizard without edit-mode contamination');
    const supportedName1 = 'CP Supported Arcane Dart';
    const supportedName2 = 'CP Supported Arcane Dart (Updated)';
    // Author a supported spell with direct damage only (no periodic/cooldown)
    await helpers.openBook(gm);
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(supportedName1);
    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Single-target direct arcane damage.');
    await book(gm).getByText('Arcane', { exact: true }).click();
    const nav = navOf(gm);
    await nav.getByRole('button', { name: /Spell Type$/ }).click();
    await book(gm).getByRole('heading', { name: 'ACTION', exact: true }).click();
    await book(gm).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
    await nav.getByRole('button', { name: /^3 Effects$/ }).click();
    await book(gm).getByRole('heading', { name: 'Damage', exact: true }).click();
    await book(gm).locator('.damage-effects-container').getByRole('textbox').first().fill('2d8');
    await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click();
    await book(gm).getByText('Single Target', { exact: true }).click();
    await book(gm).getByText('Ranged', { exact: true }).click();
    const slider = book(gm).getByRole('slider').first();
    await slider.focus();
    await slider.press('Home');
    for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
    await book(gm).getByText('Enemies', { exact: true }).click();
    await book(gm).getByText('Any Target', { exact: true }).click();
    await nav.getByRole('button', { name: /Resources$/ }).click();
    await book(gm).getByTitle('Standard magical energy', { exact: true }).click();
    await book(gm).getByTitle('Basic action economy', { exact: true }).click();
    const inputs = book(gm).getByRole('spinbutton');
    await inputs.nth(0).fill('1'); await inputs.nth(0).fill('2');
    await inputs.nth(1).fill('1'); await inputs.nth(1).fill('1');
    const complete = gm.getByRole('button', { name: '✓ Complete Spell', exact: true });
    if (await complete.count()) await complete.click({ force: true }); else await gm.locator('.finalize-btn').click({ force: true });
    await gm.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), supportedName1);
    const supportedFirst = await helpers.savedRecord(gm, supportedName1);
    await helpers.closeBook(gm);

    const admittedInitial = pure.definitionFromWizard(supportedFirst, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(admittedInitial.ok, true, 'Supported spell passes initial definitionFromWizard');

    // Reopen supported spell and update via header
    await editFromLibrary(gm, supportedName1);
    await navOf(gm).getByRole('button', { name: /Basic Info$/ }).click();
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(supportedName2);
    await book(gm).locator('.finalize-btn').click();
    await gm.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), supportedName2);
    const supportedUpdated = await helpers.savedRecord(gm, supportedName2); save('supported-updated-saved.json', supportedUpdated);
    assert.equal(supportedUpdated.id, supportedFirst.id, 'Supported spell preserves ID');
    assert.equal(supportedUpdated.name, supportedName2);
    assert.equal(supportedUpdated.editMode, undefined, 'No editMode on record');
    assert.equal(supportedUpdated.editingSpellId, undefined, 'No editingSpellId on record');
    assert.equal(supportedUpdated.authoredDraft?.editMode, undefined, 'No editMode in authoredDraft');
    assert.equal(supportedUpdated.authoredDraft?.editingSpellId, undefined, 'No editingSpellId in authoredDraft');

    const admittedUpdated = pure.definitionFromWizard(supportedUpdated, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' });
    report.checks.supportedAdmission = {
      ok: admittedUpdated.ok,
      definitionName: admittedUpdated.definition?.name
    };
    assert.equal(admittedUpdated.ok, true, 'Supported updated spell passes definitionFromWizard');
    assert.equal(admittedUpdated.definition?.name, supportedName2);
    stage('supported admission', 'definitionFromWizard admits updated supported spell without metadata contamination');
    await helpers.closeBook(gm);

    // Open supported spell in edit mode before testing viewports
    await editFromLibrary(gm, supportedName2);

    step('verify smaller viewport reachability: 375px (mobile) and 768px (tablet)');
    // Test 375px phone-width while embedded Spellbook is open in edit mode
    await gm.setViewportSize({ width: 375, height: 667 });
    await gm.waitForTimeout(500);

    // Verify header controls reachable
    const mobileUpdateBtn = book(gm).locator('.finalize-btn');
    await mobileUpdateBtn.waitFor({ state: 'visible', timeout: 5000 });
    const mobileCancelBtn = book(gm).getByTitle('Cancel Edit');
    await mobileCancelBtn.waitFor({ state: 'visible', timeout: 5000 });
    const updateBox = await mobileUpdateBtn.boundingBox();
    const cancelBox = await mobileCancelBtn.boundingBox();
    assert.ok(updateBox && updateBox.x >= 0 && updateBox.x + updateBox.width <= 375, 'Header Update button fits within 375px viewport');
    assert.ok(cancelBox && cancelBox.x >= 0 && cancelBox.x + cancelBox.width <= 375, 'Header Cancel Edit button fits within 375px viewport');

    // Verify Step 10 Review reachability at 375px
    await navOf(gm).getByRole('button', { name: /(10 Review$|^10$)/ }).click();
    await gm.waitForTimeout(500);
    const mobileReviewBtn = book(gm).locator('.step10-review-container .save-button');
    await mobileReviewBtn.scrollIntoViewIfNeeded();
    await mobileReviewBtn.waitFor({ state: 'visible', timeout: 5000 });
    const reviewBox = await mobileReviewBtn.boundingBox();
    assert.ok(reviewBox && reviewBox.x >= 0 && reviewBox.x + reviewBox.width <= 375, 'Review Update button fits within 375px viewport');

    // Verify confirmation dialog reachability at 375px
    await mobileCancelBtn.click();
    const cancelDialog = gm.getByRole('dialog', { name: 'Cancel Editing' });
    await cancelDialog.waitFor({ state: 'visible', timeout: 5000 });
    const mobileDiscardBtn = cancelDialog.getByRole('button', { name: 'Discard Changes', exact: true });
    await mobileDiscardBtn.waitFor({ state: 'visible', timeout: 5000 });
    const mobileKeepBtn = cancelDialog.getByRole('button', { name: 'Cancel', exact: true });
    await mobileKeepBtn.waitFor({ state: 'visible', timeout: 5000 });
    const discardBox = await mobileDiscardBtn.boundingBox();
    const keepBox = await mobileKeepBtn.boundingBox();
    assert.ok(discardBox && discardBox.x >= 0 && discardBox.x + discardBox.width <= 375, 'Discard button fits within 375px');
    assert.ok(keepBox && keepBox.x >= 0 && keepBox.x + keepBox.width <= 375, 'Cancel button fits within 375px');
    await mobileKeepBtn.click();
    await cancelDialog.waitFor({ state: 'hidden', timeout: 5000 });

    // Test 768px tablet-width
    await gm.setViewportSize({ width: 768, height: 1024 });
    await gm.waitForTimeout(500);
    const tabletUpdateBtn = book(gm).locator('.finalize-btn');
    await tabletUpdateBtn.waitFor({ state: 'visible', timeout: 5000 });
    const tabletCancelBtn = book(gm).getByTitle('Cancel Edit');
    await tabletCancelBtn.waitFor({ state: 'visible', timeout: 5000 });
    const tabletUpdateBox = await tabletUpdateBtn.boundingBox();
    const tabletCancelBox = await tabletCancelBtn.boundingBox();
    assert.ok(tabletUpdateBox && tabletUpdateBox.x >= 0 && tabletUpdateBox.x + tabletUpdateBox.width <= 768, 'Tablet Update button fits within 768px viewport');
    assert.ok(tabletCancelBox && tabletCancelBox.x >= 0 && tabletCancelBox.x + tabletCancelBox.width <= 768, 'Tablet Cancel button fits within 768px viewport');

    // Verify confirmation dialog reachability at 768px
    await tabletCancelBtn.click();
    const tabletDialog = gm.getByRole('dialog', { name: 'Cancel Editing' });
    await tabletDialog.waitFor({ state: 'visible', timeout: 5000 });
    const tabletDiscardBtn = tabletDialog.getByRole('button', { name: 'Discard Changes', exact: true });
    await tabletDiscardBtn.waitFor({ state: 'visible', timeout: 5000 });
    const tabletKeepBtn = tabletDialog.getByRole('button', { name: 'Cancel', exact: true });
    await tabletKeepBtn.waitFor({ state: 'visible', timeout: 5000 });
    const tabletDiscardBox = await tabletDiscardBtn.boundingBox();
    const tabletKeepBox = await tabletKeepBtn.boundingBox();
    assert.ok(tabletDiscardBox && tabletDiscardBox.x >= 0 && tabletDiscardBox.x + tabletDiscardBox.width <= 768, 'Tablet Discard button fits within 768px');
    assert.ok(tabletKeepBox && tabletKeepBox.x >= 0 && tabletKeepBox.x + tabletKeepBox.width <= 768, 'Tablet Cancel button fits within 768px');
    await tabletDiscardBtn.click();
    await tabletDialog.waitFor({ state: 'hidden', timeout: 5000 });
    await helpers.closeBook(gm);

    // Restore desktop viewport
    await gm.setViewportSize({ width: 1440, height: 1000 });
    stage('viewport reachability', '375px and 768px viewport checks confirm reachable controls and dialogs');
    assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
    report.passed = true;
  } catch (e) {
    report.failure = e.stack;
    for (const [role, p] of Object.entries(pages)) { save(`failure-${role}.aria.yml`, await p.locator('body').ariaSnapshot().catch(() => 'unavailable')); await p.screenshot({ path: path.join(out, `failure-${role}.png`) }).catch(() => {}); }
    throw e;
  } finally {
    report.endedAt = new Date().toISOString(); report.build = process.env.APP_BUILD_DIR;
    report.buildAssetManifestSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json'))).digest('hex');
    save('result.json', report); await browser.close().catch(() => {});
    await Promise.race([host.stop().catch(() => {}), new Promise(resolve => setTimeout(resolve, 10000))]);
  }
}
main().then(() => process.exit(0), e => {
  if (e && e.name === 'PreflightError') preflight.printFailure(e); else console.error(e);
  process.exit(e && Number.isInteger(e.exitCode) ? e.exitCode : 1);
});
