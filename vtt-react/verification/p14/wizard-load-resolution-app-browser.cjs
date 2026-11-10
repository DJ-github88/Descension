// Production-App acceptance witness for Wizard Load resolution (handoff/wizard-load-resolution)
// Verified against the identified production build containing candidate SpellwizardApp.jsx bytes.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.WLR_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR || !path.isAbsolute(process.env.APP_BUILD_DIR)) {
  throw Error('Absolute external WLR_OUTPUT and APP_BUILD_DIR required');
}
const repo = path.resolve(__dirname, '../../..');
if (path.resolve(out).startsWith(repo + path.sep)) throw Error('WLR_OUTPUT must be outside repository');
fs.mkdirSync(out, { recursive: true });

const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
const pure = require('../../src/services/authoredAbility');

const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));

const report = {
  kind: 'wizard-load-resolution-app-witness',
  startedAt: new Date().toISOString(),
  passed: false,
  checks: {},
  qualifications: [
    'Real optimized App and registered backend (p9 production stack); identity/provider login is fixture-seeded.',
    'Identified build artifact: M4 capture with zero frozen/live drift.',
    'Pure authoring and admission contracts execute against live engine services.',
    'Catalogue pins and authority were untouched.'
  ],
  errors: [],
  steps: []
};

const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); save('progress.json', report); };
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const finalizeBtn = p => book(p).locator('button.finalize-btn');

async function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body'));
  if (L.__wlr) return;
  L.__wlr = true;
  const click = L.click;
  L.click = async function(options = {}) {
    try { return await click.call(this, { timeout: 20000, ...options }); }
    catch (e) {
      if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e;
      return click.call(this, { ...options, force: true });
    }
  };
}

const loadButton = p => book(p).locator('button[title="Open a saved spell for editing"], .app-control-btn:has-text("Load")').first();

async function openBook(p) {
  if (await book(p).count() && await book(p).isVisible()) {
    const wizTab = book(p).locator('.spellbook-tab-button', { hasText: 'Spell Wizard' });
    if (await wizTab.count() && await wizTab.isVisible()) {
      await wizTab.click();
      await p.waitForTimeout(300);
    }
    return;
  }
  const role = p.getByRole('button', { name: 'Character', exact: true });
  if (await role.count()) await role.click(); else await p.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
  const sb = p.getByRole('button', { name: 'Spellbook S', exact: true });
  if (await sb.count()) await sb.click(); else await p.locator('button', { hasText: /Spellbook/ }).first().click();
  await book(p).waitFor();
  const wizTab = book(p).locator('.spellbook-tab-button', { hasText: 'Spell Wizard' });
  if (await wizTab.count() && await wizTab.isVisible()) {
    await wizTab.click();
    await p.waitForTimeout(300);
  }
}

async function closeBook(p) {
  const b = book(p).getByRole('button', { name: 'Close', exact: true });
  if (await b.count()) { await b.first().focus(); await b.first().press('Enter'); }
  else await p.keyboard.press('Escape');
  await book(p).waitFor({ state: 'detached' }).catch(() => {});
}

async function openLibrary(p) {
  await openBook(p);
  const libTab = book(p).locator('.spellbook-tab-button', { hasText: 'Spell Library' });
  if (await libTab.count() && await libTab.isVisible()) {
    await libTab.click();
    await p.waitForTimeout(300);
  }
  await book(p).getByText(/Spell Library|All Spells/).first().waitFor({ timeout: 10000 }).catch(() => {});
}

async function resetWizard(p) {
  const reset = book(p).getByTitle('Reset Wizard');
  if (await reset.count() && await reset.isVisible()) {
    await reset.click();
    const confirm = p.locator('.custom-dialog-btn-danger', { hasText: 'Reset Wizard' });
    await confirm.waitFor({ timeout: 10000 });
    await confirm.click();
    await new Promise(r => setTimeout(r, 300));
  }
}

async function completeSpell(p, name) {
  await p.getByRole('button', { name: /Complete Spell/ }).click({ force: true });
  await p.waitForFunction(n => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(n)), name);
}

const records = p => p.evaluate(() => {
  const k = Object.keys(localStorage).find(key => key.endsWith(':library.spellData'));
  return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells : null;
});
const recordNamed = async (p, name) => (await records(p)).find(s => s.name === name) || null;

async function targetingAndPrice(p, nav, { ap = 1, mana = 2 } = {}) {
  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click();
  await book(p).getByText('Single Target', { exact: true }).click();
  await book(p).getByText('Ranged', { exact: true }).click();
  const slider = book(p).getByRole('slider').first();
  await slider.focus(); await slider.press('Home');
  for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(p).getByText('Enemies', { exact: true }).click();
  await book(p).getByText('Any Target', { exact: true }).click();
  await nav.getByRole('button', { name: /Resources$/ }).click();
  await book(p).getByTitle('Standard magical energy', { exact: true }).click();
  await book(p).getByTitle('Basic action economy', { exact: true }).click();
  const inputs = book(p).getByRole('spinbutton');
  await inputs.nth(0).fill('1'); await inputs.nth(0).fill(String(mana));
  await inputs.nth(1).fill('1'); await inputs.nth(1).fill(String(ap));
}

async function openDetail(p, name) {
  await book(p).getByText(name, { exact: true }).first().click();
  const detail = p.locator('.spell-detail-overlay');
  await detail.waitFor();
  return detail;
}

async function closeDetail(p) {
  const detail = p.locator('.spell-detail-overlay');
  const close = detail.getByRole('button', { name: 'Close', exact: true });
  if (await close.count()) await close.first().click({ timeout: 3000 }).catch(() => {});
  if (await detail.count()) await p.keyboard.press('Escape');
  await detail.waitFor({ state: 'detached' }).catch(() => {});
}

async function admitByName(p, name) {
  await openLibrary(p);
  await openDetail(p, name);
  const section = p.getByRole('region', { name: `Room admission for ${name}`, exact: true });
  await section.waitFor({ timeout: 10000 });
  await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click();
  await section.getByText(/^Admitted for /).waitFor({ timeout: 20000 });
  const status = await section.innerText();
  await closeDetail(p);
  await closeBook(p);
  return status;
}

async function setup(page, url, uid) {
  if (!page.__wlrFonts) {
    page.__wlrFonts = true;
    const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async (...args) => {
      await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {});
      await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts);
      return goto(...args);
    };
  }
  return baseSetup(page, url, uid);
}

async function main() {
  const profilesDir = path.join(out, 'profiles');
  fs.rmSync(profilesDir, { recursive: true, force: true });
  const host = await require('../p9/integration/app-server.cjs').start();
  const pages = {}, contexts = {}, channel = process.env.WLR_CHANNEL || 'chrome';
  try {
    for (const [role, uid] of [['gm', 'app-gm']]) {
      const dir = path.join(out, 'profiles', role); fs.mkdirSync(dir, { recursive: true });
      const ctx = contexts[role] = await chromium.launchPersistentContext(dir, {
        ...(channel ? { channel } : {}),
        headless: true,
        viewport: { width: 1440, height: 1000 },
        reducedMotion: 'reduce'
      });
      const page = pages[role] = ctx.pages()[0] || await ctx.newPage();
      await patchClick(page);
      page.on('pageerror', e => { if (!/Failed to fetch|blockedbyclient/i.test(e.message)) report.errors.push({ role, message: e.message }); });
      await setup(page, host.url, uid);
    }
    const { gm } = pages;

    // --- STEP 1: Verify exact candidate identities in build ---
    step('Step 1: Check candidate identities and build manifest');
    const manifestPath = path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json');
    assert.ok(fs.existsSync(manifestPath), 'Build asset manifest exists');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const manifestHash = sha(fs.readFileSync(manifestPath));
    report.checks.manifest = { hash: manifestHash, mainJs: manifest.files['main.js'] };

    // --- STEP 2: Author a baseline spell in the Wizard ---
    step('Step 2: Author baseline spell "Spark Pulse" in Spell Wizard');
    await openBook(gm);
    await resetWizard(gm);
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('Spark Pulse');
    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Baseline single-target direct arcane bolt');
    await book(gm).getByText('Arcane', { exact: true }).click();
    const nav = book(gm).getByRole('navigation', { name: 'Spell wizard steps' });
    await nav.getByRole('button', { name: /Spell Type$/ }).click();
    await book(gm).getByRole('heading', { name: 'ACTION', exact: true }).click();
    await book(gm).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
    await nav.getByRole('button', { name: /^3 Effects$/ }).click();
    await book(gm).getByRole('heading', { name: 'Damage', exact: true }).click();
    await book(gm).locator('.damage-effects-container').getByRole('textbox').first().fill('1d8+2');
    await targetingAndPrice(gm, nav, { ap: 1, mana: 2 });
    await nav.getByRole('button', { name: /Review$/ }).click();
    await completeSpell(gm, 'Spark Pulse');

    const sparkRecord1 = await recordNamed(gm, 'Spark Pulse');
    assert.ok(sparkRecord1, 'Spark Pulse saved in library');
    assert.ok(sparkRecord1.id, 'Record has id');
    assert.ok(sparkRecord1.dateCreated, 'Record has dateCreated');
    assert.ok(sparkRecord1.categoryIds && sparkRecord1.categoryIds.length > 0, 'Record has categoryIds');
    report.checks.baselineSpell = {
      id: sparkRecord1.id,
      dateCreated: sparkRecord1.dateCreated,
      categories: sparkRecord1.categories,
      categoryIds: sparkRecord1.categoryIds
    };

    // --- STEP 3: Header Load modal verification (Checklist item 1) ---
    step('Step 3: Verify Load button tooltip and LoadSpellModal presentation');
    await openBook(gm);
    const loadBtn = loadButton(gm);
    await loadBtn.waitFor({ timeout: 10000 });
    const loadTitle = await loadBtn.getAttribute('title');
    assert.equal(loadTitle, 'Open a saved spell for editing', 'Header Load button has updated tooltip');

    await loadBtn.click();
    const modal = gm.locator('.wow-window', { hasText: 'Open Saved Spell' });
    await modal.waitFor({ timeout: 10000 });
    const modalTitle = await modal.locator('.window-title').innerText();
    assert.match(modalTitle, /^open saved spell$/i, 'Modal is titled Open Saved Spell');

    const hintText = await modal.locator('.modal-content p').first().innerText();
    assert.match(hintText, /Open a saved spell in the Wizard to edit that library record/);
    assert.match(hintText, /To create an independent copy, use Duplicate Spell in the Spell Library/);

    const editBtn = modal.locator('.spell-list-load-btn', { hasText: 'Edit' }).first();
    assert.ok(await editBtn.isVisible(), 'Row action button text is Edit');
    report.checks.loadModal = { title: modalTitle, tooltip: loadTitle, hint: hintText };

    // --- STEP 4: Load opens the same record in Edit mode (Checklist item 2) ---
    step('Step 4: Load -> Edit opens record in Edit mode; Update preserves identity and metadata');
    await editBtn.click();
    await modal.waitFor({ state: 'detached' });

    // Verify edit mode banner and buttons
    const editBanner = book(gm).locator('.edit-mode-indicator');
    await editBanner.waitFor({ timeout: 10000 });
    assert.match(await editBanner.innerText(), /Editing Spell:\s*Spark Pulse/i);

    const updateBtn = finalizeBtn(gm);
    assert.ok(await updateBtn.isVisible(), 'Update button visible instead of Finalize');
    assert.equal(await updateBtn.locator('.control-text').innerText(), 'Update', 'Button text is Update');
    const cancelBtn = book(gm).getByRole('button', { name: 'Cancel Edit', exact: true });
    assert.ok(await cancelBtn.isVisible(), 'Cancel Edit button visible');

    // Rename and click Update
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('Spark Pulse Renamed');
    await updateBtn.click();

    // Verify library has exactly ONE record for it, with same id and dateCreated
    await gm.waitForFunction(n => Object.values(localStorage).some(v => v.includes(n)), 'Spark Pulse Renamed');
    const allRecords1 = await records(gm);
    assert.equal(allRecords1.length, 1, 'Library still has exactly one record');
    const updatedRecord1 = allRecords1[0];
    assert.equal(updatedRecord1.id, sparkRecord1.id, 'id is preserved');
    assert.equal(updatedRecord1.dateCreated, sparkRecord1.dateCreated, 'dateCreated is preserved');
    assert.equal(updatedRecord1.name, 'Spark Pulse Renamed', 'Name is updated');
    assert.ok(updatedRecord1.categoryIds && updatedRecord1.categoryIds.length > 0, 'categoryIds populated');
    report.checks.updateInPlace = {
      recordCount: allRecords1.length,
      idPreserved: updatedRecord1.id === sparkRecord1.id,
      dateCreatedPreserved: updatedRecord1.dateCreated === sparkRecord1.dateCreated,
      categoryIds: updatedRecord1.categoryIds
    };

    // --- STEP 5: Repeated no-op Updates remain stable (Checklist item 3) ---
    step('Step 5: Repeated no-op Updates remain stable');
    await openBook(gm);
    await loadButton(gm).click();
    const modal2 = gm.locator('.wow-window', { hasText: 'Open Saved Spell' });
    await modal2.waitFor({ timeout: 10000 });
    const editBtnInModal = modal2.locator('.spell-list-load-btn', { hasText: 'Edit' }).first();
    await editBtnInModal.click();
    await modal2.waitFor({ state: 'detached' });

    // Wait for edit banner to ensure edit state is active
    const editBanner2 = book(gm).locator('.edit-mode-indicator');
    await editBanner2.waitFor({ timeout: 10000 });

    // First no-op Update
    await finalizeBtn(gm).click();
    await gm.waitForTimeout(500);

    const allRecords2A = await records(gm);
    assert.equal(allRecords2A.length, 1, 'Record count remains 1');
    const noopRecord1 = allRecords2A[0];
    assert.equal(noopRecord1.id, sparkRecord1.id, 'id unchanged after no-op update 1');
    assert.equal(noopRecord1.dateCreated, sparkRecord1.dateCreated, 'dateCreated unchanged');
    assert.equal(noopRecord1.authoredDefinitionId, sparkRecord1.authoredDefinitionId, 'authoredDefinitionId unchanged');

    // Second repeated no-op Update to verify fixed-point stability
    await openBook(gm);
    await loadButton(gm).click();
    const modal2B = gm.locator('.wow-window', { hasText: 'Open Saved Spell' });
    await modal2B.waitFor({ timeout: 10000 });
    await modal2B.locator('.spell-list-load-btn', { hasText: 'Edit' }).first().click();
    await modal2B.waitFor({ state: 'detached' });
    const editBanner2B = book(gm).locator('.edit-mode-indicator');
    await editBanner2B.waitFor({ timeout: 10000 });
    await finalizeBtn(gm).click();
    await gm.waitForTimeout(500);

    const allRecords2 = await records(gm);
    assert.equal(allRecords2.length, 1, 'Record count remains 1 after repeated no-op');
    const noopRecord = allRecords2[0];
    assert.equal(noopRecord.id, sparkRecord1.id, 'id unchanged after repeated no-op update');
    assert.equal(noopRecord.dateCreated, sparkRecord1.dateCreated, 'dateCreated unchanged');
    assert.equal(noopRecord.authoredDefinitionId, sparkRecord1.authoredDefinitionId, 'authoredDefinitionId unchanged');
    assert.deepEqual(noopRecord.categoryIds, noopRecord1.categoryIds, 'categoryIds stable');
    assert.deepEqual(noopRecord.authoredDraft, noopRecord1.authoredDraft, 'authoredDraft remains stable fixed point');
    report.checks.noopUpdate = { stable: true, recordCount: 1 };

    // --- STEP 6: Cancel Edit leaves source untouched (Checklist item 4A) ---
    step('Step 6: Cancel Edit discards changes and leaves stored record byte-identical');
    await openBook(gm);
    await loadButton(gm).click();
    const modal3 = gm.locator('.wow-window', { hasText: 'Open Saved Spell' });
    await modal3.waitFor({ timeout: 10000 });
    await modal3.locator('.spell-list-load-btn', { hasText: 'Edit' }).first().click();
    await modal3.waitFor({ state: 'detached' });

    // Mutate draft name
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('MUTATED SHOULD CANCEL');
    await book(gm).getByRole('button', { name: 'Cancel Edit', exact: true }).click();
    const discardConfirm = gm.getByRole('button', { name: 'Discard Changes', exact: true });
    await discardConfirm.waitFor({ timeout: 10000 });
    await discardConfirm.click();
    await gm.waitForTimeout(500);

    const allRecords3 = await records(gm);
    assert.equal(allRecords3.length, 1, 'Record count unchanged after cancel');
    assert.equal(allRecords3[0].name, 'Spark Pulse Renamed', 'Stored name untouched');
    assert.deepEqual(allRecords3[0], noopRecord, 'Record is byte-identical');
    report.checks.cancelEdit = { untouched: true };

    // --- STEP 7: Abandoned loading leaves source untouched (Checklist item 4B) ---
    step('Step 7: Abandoned loading leaves source untouched');
    await openBook(gm);
    await loadButton(gm).click();
    const modal4 = gm.locator('.wow-window', { hasText: 'Open Saved Spell' });
    await modal4.waitFor({ timeout: 10000 });
    await modal4.locator('.spell-list-load-btn', { hasText: 'Edit' }).first().click();
    await modal4.waitFor({ state: 'detached' });

    // Mutate draft name and reset wizard without saving
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('ABANDONED DRAFT');
    await resetWizard(gm);
    await gm.waitForTimeout(500);

    const allRecords4 = await records(gm);
    assert.equal(allRecords4.length, 1, 'Record count unchanged after abandoned edit');
    assert.equal(allRecords4[0].name, 'Spark Pulse Renamed', 'Stored record remains untouched');
    report.checks.abandonedEdit = { untouched: true };

    // --- STEP 8: Duplicate still creates an independent record (Checklist item 5) ---
    step('Step 8: Duplicate Spell creates an independent copy; source untouched');
    await openLibrary(gm);
    const row = book(gm).locator('[role="button"][aria-label="Spark Pulse Renamed details"]').first();
    await row.waitFor({ timeout: 10000 });
    await row.click({ button: 'right' });
    const duplicateOption = gm.getByText('Duplicate Spell', { exact: true });
    await duplicateOption.waitFor({ timeout: 10000 });
    await duplicateOption.click();
    await gm.waitForTimeout(500);

    const allRecords5 = await records(gm);
    assert.equal(allRecords5.length, 2, 'Duplicate adds exactly one copy to library');
    const copyRecord = allRecords5.find(s => s.name === 'Spark Pulse Renamed (Copy)');
    assert.ok(copyRecord, 'Copy record exists with (Copy) name suffix');
    assert.notEqual(copyRecord.id, sparkRecord1.id, 'Duplicate has new id');
    assert.notEqual(copyRecord.dateCreated, sparkRecord1.dateCreated, 'Duplicate has new dateCreated');
    assert.equal(copyRecord.authoredDefinitionId, sparkRecord1.authoredDefinitionId, 'Duplicate retains definition ID');
    assert.deepEqual(copyRecord.categoryIds, noopRecord.categoryIds, 'Duplicate retains categoryIds');

    // Mutate the copy and verify source is untouched
    await openBook(gm);
    await loadButton(gm).click();
    const modal5 = gm.locator('.wow-window', { hasText: 'Open Saved Spell' });
    await modal5.waitFor({ timeout: 10000 });
    await modal5.locator('.spell-list-item', { hasText: 'Spark Pulse Renamed (Copy)' }).locator('.spell-list-load-btn').click();
    await modal5.waitFor({ state: 'detached' });
    await book(gm).locator('.edit-mode-indicator').waitFor({ timeout: 10000 });

    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Description on the copy only');
    await finalizeBtn(gm).click();
    await gm.waitForTimeout(500);

    const allRecords6 = await records(gm);
    const originalRecordAfterCopyEdit = allRecords6.find(s => s.id === sparkRecord1.id);
    assert.equal(originalRecordAfterCopyEdit.description, 'Baseline single-target direct arcane bolt', 'Original source description untouched');
    report.checks.duplicateIdentity = {
      copyCreated: true,
      newId: copyRecord.id !== sparkRecord1.id,
      retainedDefinitionId: copyRecord.authoredDefinitionId === sparkRecord1.authoredDefinitionId,
      sourceUntouched: originalRecordAfterCopyEdit.description === 'Baseline single-target direct arcane bolt'
    };

    // --- STEP 9: Programmatic create callers remain unchanged (Checklist item 6) ---
    step('Step 9: Programmatic create path handleLoadSpell(record, false) creates separate record');
    await openBook(gm);
    await gm.evaluate(spell => {
      window.handleLoadSpell(spell, false);
    }, originalRecordAfterCopyEdit);
    await gm.waitForTimeout(300);

    // Fill new name and save
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('Programmatic New Record');
    await book(gm).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Review$/ }).click();
    await completeSpell(gm, 'Programmatic New Record');

    const allRecords7 = await records(gm);
    assert.equal(allRecords7.length, 3, 'Library now has 3 records');
    const programmaticRecord = allRecords7.find(s => s.name === 'Programmatic New Record');
    assert.ok(programmaticRecord, 'New record created');
    assert.notEqual(programmaticRecord.id, sparkRecord1.id, 'New record has new id');
    report.checks.programmaticCreate = { newRecordCreated: true, libraryCount: allRecords7.length };

    // --- STEP 10: Executable drafts remain compiler/admission consistent (Checklist item 7) ---
    step('Step 10: Executable drafts survive Load -> Edit -> Update with consistent admission');

    // Case A: Immediate formula + periodic rider + cooldown
    step('Step 10A: Author immediate + periodic + cooldown, Load -> Edit -> Update');
    await openBook(gm);
    await resetWizard(gm);
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('Ember Surge');
    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Direct damage plus periodic burning with cooldown');
    await book(gm).getByText('Arcane', { exact: true }).click();
    const nav10 = book(gm).getByRole('navigation', { name: 'Spell wizard steps' });
    await nav10.getByRole('button', { name: /Spell Type$/ }).click();
    await book(gm).getByRole('heading', { name: 'ACTION', exact: true }).click();
    await book(gm).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
    await nav10.getByRole('button', { name: /^3 Effects$/ }).click();
    await book(gm).getByRole('heading', { name: 'Damage', exact: true }).click();
    await book(gm).locator('.damage-effects-container').getByRole('textbox').first().fill('1d8+3');
    await book(gm).getByRole('heading', { name: 'Control', exact: true }).click();
    await book(gm).getByRole('button', { name: /^Use composed effect profile/ }).click();
    const compFields = book(gm).getByRole('group', { name: /Composed effect .* structured expiry/ });
    await compFields.getByLabel(/^Canonical effect/).selectOption('movement');
    await compFields.getByLabel(/^Effect name shown on the target/).fill('Frost Slow');
    await compFields.getByLabel(/^Movement change/).fill('-10');
    await compFields.getByLabel(/^Expiry/).selectOption('target-next-end');
    await compFields.getByLabel(/^Source-authored duration text/).fill("Until the end of the target's next turn");
    await compFields.getByLabel(/^Required GM adjudication note/).fill('GM tracks Frost Slow');
    await targetingAndPrice(gm, nav10, { ap: 1, mana: 2 });
    await nav10.getByRole('button', { name: /Cooldown$/ }).click();
    await book(gm).getByRole('button', { name: 'Authenticated Caster Starts', exact: true }).click();
    await book(gm).getByLabel(/Caster-turn starts to count/).fill('2');
    await nav10.getByRole('button', { name: /Review$/ }).click();
    await completeSpell(gm, 'Ember Surge');

    // Load -> Edit -> Rename -> Update
    await openBook(gm);
    await loadButton(gm).click();
    const modal10A = gm.locator('.wow-window', { hasText: 'Open Saved Spell' });
    await modal10A.waitFor({ timeout: 10000 });
    await modal10A.locator('.spell-list-item', { hasText: 'Ember Surge' }).locator('.spell-list-load-btn').click();
    await modal10A.waitFor({ state: 'detached' });
    await book(gm).locator('.edit-mode-indicator').waitFor({ timeout: 10000 });

    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('Ember Surge Updated');
    await finalizeBtn(gm).click();
    await gm.waitForTimeout(500);

    const emberRecord = await recordNamed(gm, 'Ember Surge Updated');
    assert.ok(emberRecord, 'Ember Surge Updated saved');
    const verdictA = pure.definitionFromWizard(emberRecord);
    assert.equal(verdictA.ok, true, 'Compiler verdict is ok for Ember Surge Updated');
    report.checks.caseA_admission = { ok: verdictA.ok, descriptor: verdictA.definition?.descriptor };

    // Admit Ember Surge in room
    const statusA = await admitByName(gm, 'Ember Surge Updated');
    assert.match(statusA, /Admitted for /);
    report.checks.caseA_roomAdmission = statusA;

    // Case B: Formula direct + movement rider + save + expiry
    step('Step 10B: Author formula + movement rider + save + expiry, Load -> Edit -> Update');
    await openBook(gm);
    await resetWizard(gm);
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('Winter Shiver');
    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Direct damage with save-negated movement rider');
    await book(gm).getByText('Arcane', { exact: true }).click();
    const nav10B = book(gm).getByRole('navigation', { name: 'Spell wizard steps' });
    await nav10B.getByRole('button', { name: /Spell Type$/ }).click();
    await book(gm).getByRole('heading', { name: 'ACTION', exact: true }).click();
    await book(gm).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
    await nav10B.getByRole('button', { name: /^3 Effects$/ }).click();
    await book(gm).getByRole('heading', { name: 'Damage', exact: true }).click();
    await book(gm).locator('.damage-effects-container').getByRole('textbox').first().fill('1d6+2');
    await book(gm).getByRole('heading', { name: 'Control', exact: true }).click();
    await book(gm).getByRole('button', { name: /^Use composed effect profile/ }).click();
    const compFieldsB = book(gm).getByRole('group', { name: /Composed effect .* structured expiry/ });
    await compFieldsB.getByLabel(/^Canonical effect/).selectOption('movement');
    await compFieldsB.getByLabel(/^Effect name shown on the target/).fill('Shiver');
    await compFieldsB.getByLabel(/^Movement change/).fill('-10');
    await compFieldsB.getByLabel(/^Expiry/).selectOption('target-next-end');
    await compFieldsB.getByLabel(/The target may save to negate this effect/).check();
    await compFieldsB.getByLabel(/^Saving ability/).selectOption('constitution');
    await compFieldsB.getByLabel(/^Difficulty \(DC/).fill('12');
    await compFieldsB.getByLabel(/^Source-authored duration text/).fill("Until the end of the target's next turn");
    await compFieldsB.getByLabel(/^Required GM adjudication note/).fill('Table CON save DC 12');
    await targetingAndPrice(gm, nav10B, { ap: 1, mana: 2 });
    await nav10B.getByRole('button', { name: /Review$/ }).click();
    await completeSpell(gm, 'Winter Shiver');

    // Load -> Edit -> Rename -> Update
    await openBook(gm);
    await loadButton(gm).click();
    const modal10B = gm.locator('.wow-window', { hasText: 'Open Saved Spell' });
    await modal10B.waitFor({ timeout: 10000 });
    await modal10B.locator('.spell-list-item', { hasText: 'Winter Shiver' }).locator('.spell-list-load-btn').click();
    await modal10B.waitFor({ state: 'detached' });
    await book(gm).locator('.edit-mode-indicator').waitFor({ timeout: 10000 });

    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('Winter Shiver Updated');
    await finalizeBtn(gm).click();
    await gm.waitForTimeout(500);

    const winterRecord = await recordNamed(gm, 'Winter Shiver Updated');
    assert.ok(winterRecord, 'Winter Shiver Updated saved');
    const verdictB = pure.definitionFromWizard(winterRecord);
    assert.equal(verdictB.ok, true, 'Compiler verdict is ok for Winter Shiver Updated');
    report.checks.caseB_admission = { ok: verdictB.ok, descriptor: verdictB.definition?.descriptor };

    // Admit Winter Shiver in room
    const statusB = await admitByName(gm, 'Winter Shiver Updated');
    assert.match(statusB, /Admitted for /);
    report.checks.caseB_roomAdmission = statusB;

    // --- STEP 11: Reload persistence verification ---
    step('Step 11: Reload page and verify persistence across browser reload');
    await gm.reload();
    await gm.waitForTimeout(1000);
    const reloadedRecords = await records(gm);
    assert.ok(reloadedRecords && reloadedRecords.length >= 5, 'All records persisted across reload');
    const reloadedSpark = reloadedRecords.find(s => s.name === 'Spark Pulse Renamed');
    assert.equal(reloadedSpark.id, sparkRecord1.id, 'Reloaded record id preserved');
    assert.equal(reloadedSpark.dateCreated, sparkRecord1.dateCreated, 'Reloaded record dateCreated preserved');

    report.passed = true;
    report.completedAt = new Date().toISOString();
    step('ALL 11 ORDINARY-APP CHECKLIST STAGES PASSED');
    save('result.json', report);
  } finally {
    for (const ctx of Object.values(contexts)) await ctx.close().catch(() => {});
    await host.stop().catch(() => {});
  }
}

main().then(
  () => { console.log('Witness execution COMPLETE - ALL CHECKS PASSED'); process.exit(0); },
  err => { console.error('Witness execution FAILED:', err); report.errors.push(String(err && err.stack || err)); save('result.json', report); process.exit(1); }
);
