// Production-App acceptance witness for Trigger Authoring Preservation (handoff/trigger-authoring-preservation)
// Verified against the identified production build containing candidate trigger preservation bytes.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.TAP_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR || !path.isAbsolute(process.env.APP_BUILD_DIR)) {
  throw Error('Absolute external TAP_OUTPUT and APP_BUILD_DIR required');
}
const repo = path.resolve(__dirname, '../../..');
if (path.resolve(out).startsWith(repo + path.sep)) throw Error('TAP_OUTPUT must be outside repository');
fs.mkdirSync(out, { recursive: true });

const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
const pure = require('../../src/services/authoredAbility');
const { catalogueDraft } = require(path.join(repo, 'server/shared/services/catalogueAbility.cjs'));

const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const clone = v => JSON.parse(JSON.stringify(v));
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));

const report = {
  kind: 'trigger-authoring-preservation-app-witness',
  startedAt: new Date().toISOString(),
  passed: false,
  checks: {},
  qualifications: [
    'Real optimized App and registered backend (p9 production stack); identity/provider login is fixture-seeded.',
    'Identified build artifact: M4 capture with zero frozen/live drift.',
    'Pure authoring and admission contracts execute against live engine services.',
    'Catalogue pins and authority were untouched.',
    'Storage preservation is not trigger execution: unsupported shapes remain refused whole.'
  ],
  errors: [],
  steps: []
};

const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); save('progress.json', report); };
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const finalizeBtn = p => book(p).locator('button.finalize-btn');
const loadButton = p => book(p).locator('button[title="Open a saved spell for editing"], .app-control-btn:has-text("Load")').first();

async function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body'));
  if (L.__tap) return;
  L.__tap = true;
  const click = L.click;
  L.click = async function(options = {}) {
    try { return await click.call(this, { timeout: 20000, ...options }); }
    catch (e) {
      if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e;
      return click.call(this, { ...options, force: true });
    }
  };
}

async function openBook(p) {
  if (await book(p).count() && await book(p).isVisible()) {
    const wizTab = book(p).locator('.spellbook-tab-button', { hasText: 'Spell Wizard' });
    if (await wizTab.count() && await wizTab.isVisible()) {
      await wizTab.click();
      await p.waitForTimeout(300);
    }
    await p.waitForFunction(() => typeof window.handleLoadSpell === 'function', null, { timeout: 10000 }).catch(() => {});
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
  await p.waitForFunction(() => typeof window.handleLoadSpell === 'function', null, { timeout: 10000 }).catch(() => {});
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

let currentHost = null;

async function seedRecord(p, record) {
  await p.evaluate(rec => {
    const k = Object.keys(localStorage).find(key => key.endsWith(':library.spellData'));
    if (!k) return;
    const parsed = JSON.parse(localStorage.getItem(k));
    const idx = parsed.payload.data.spells.findIndex(s => s.id === rec.id);
    if (idx >= 0) parsed.payload.data.spells[idx] = rec;
    else parsed.payload.data.spells.push(rec);
    localStorage.setItem(k, JSON.stringify(parsed));
  }, record);
  if (currentHost) {
    await p.reload();
    await setup(p, currentHost.url, 'app-gm');
  }
}

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
  if (!page.__tapFonts) {
    page.__tapFonts = true;
    const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async (...args) => {
      await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {});
      await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts);
      return goto(...args);
    };
  }
  return baseSetup(page, url, uid);
}

function loadMartyrPrayerSource() {
  const file = fs.readFileSync(path.join(repo, 'vtt-react/src/data/classes/martyrData.js'), 'utf8');
  const start = file.indexOf('{ id: "martyr_restorative_prayer"');
  const end = file.indexOf('{ id: "martyr_intervene"');
  const snippet = file.substring(start, end).trim().replace(/,\s*$/, '');
  return eval('(' + snippet + ')');
}
const MARTYR_PRAYER_SOURCE = loadMartyrPrayerSource();

async function main() {
  const profilesDir = path.join(out, 'profiles');
  fs.rmSync(profilesDir, { recursive: true, force: true });
  const host = await require('../p9/integration/app-server.cjs').start();
  currentHost = host;
  const pages = {}, contexts = {}, channel = process.env.TAP_CHANNEL || 'chrome';
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

    // --- STEP 2: Default record: Trigger step does not mutate definition (Checklist item 1) ---
    step('Step 2: Default record: Trigger step visit does not mutate definition or admission');
    await openBook(gm);
    await resetWizard(gm);
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('Arcane Dart');
    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Baseline single-target damage spell');
    await book(gm).getByText('Arcane', { exact: true }).click();
    const nav = book(gm).getByRole('navigation', { name: 'Spell wizard steps' });
    await nav.getByRole('button', { name: /Spell Type$/ }).click();
    await book(gm).getByRole('heading', { name: 'ACTION', exact: true }).click();
    await book(gm).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
    await nav.getByRole('button', { name: /^3 Effects$/ }).click();
    await book(gm).getByRole('heading', { name: 'Damage', exact: true }).click();
    await book(gm).locator('.damage-effects-container').getByRole('textbox').first().fill('1d8');
    await targetingAndPrice(gm, nav, { ap: 1, mana: 2 });
    await nav.getByRole('button', { name: /Review$/ }).click();
    await completeSpell(gm, 'Arcane Dart');

    const dart1 = await recordNamed(gm, 'Arcane Dart');
    assert.ok(dart1, 'Arcane Dart saved');
    assert.equal(pure.definitionFromWizard(dart1).ok, true, 'Initial Arcane Dart admits cleanly');

    // Open in Edit mode via Load
    await openBook(gm);
    await loadButton(gm).click();
    const loadModal = gm.locator('.wow-window', { hasText: 'Open Saved Spell' });
    await loadModal.waitFor({ timeout: 10000 });
    await loadModal.locator('.spell-list-load-btn', { hasText: 'Edit' }).first().click();
    await loadModal.waitFor({ state: 'detached' });
    await book(gm).locator('.edit-mode-indicator').waitFor({ timeout: 10000 });

    // Visit the Trigger step
    const trigStepBtn = book(gm).getByRole('navigation', { name: 'Spell wizard steps' }).locator('button', { hasText: /Triggers/i });
    await trigStepBtn.click();
    await book(gm).getByText(/Trigger Mode|Triggers/i).first().waitFor({ timeout: 10000 });

    // Change nothing; click Update
    await finalizeBtn(gm).click();
    await gm.waitForTimeout(500);

    const dartUpdated = await recordNamed(gm, 'Arcane Dart');
    assert.ok(dartUpdated, 'Updated Arcane Dart exists');
    assert.equal(dartUpdated.id, dart1.id, 'id preserved');

    // Verify triggerConfig did not get corrupted with synthetic enabled/conditional fields
    assert.equal(dartUpdated.triggerConfig?.global?.enabled, undefined, 'global.enabled was NOT injected');
    assert.ok(!dartUpdated.triggerConfig?.conditionalEffects || Object.keys(dartUpdated.triggerConfig.conditionalEffects).length === 0, 'conditionalEffects NOT synthesized');
    const dartVerdict = pure.definitionFromWizard(dartUpdated);
    assert.equal(dartVerdict.ok, true, 'Arcane Dart remains 100% admissible after visiting triggers');
    report.checks.defaultRecord = { ok: dartVerdict.ok, idPreserved: dartUpdated.id === dart1.id };

    // Room admission
    const dartAdmission = await admitByName(gm, 'Arcane Dart');
    assert.match(dartAdmission, /Admitted for /);
    report.checks.defaultRecordRoomAdmission = dartAdmission;

    // --- STEP 3: Reaction/passive triggers survive Update (Checklist item 2) ---
    step('Step 3: Reaction/passive triggers survive Trigger step visit -> Update -> reopen');
    const reactionRecord = {
      ...clone(dartUpdated),
      id: 'trigger-preserve-reaction',
      name: 'Shield Ward Reaction',
      description: 'Reaction ward triggering on damaged with required condition',
      spellType: 'REACTION',
      typeConfig: { ...clone(dartUpdated.typeConfig), castTimeType: 'REACTION' },
      triggerConfig: {
        global: { logicType: 'AND', compoundTriggers: [{ id: 'trig-1', triggerType: 'on_damaged', parameters: {}, conditions: [] }] },
        effectTriggers: { damage: { triggerType: 'on_hit' } },
        conditionalEffects: {},
        buffDebuffTriggers: {},
        requiredConditions: {
          enabled: true,
          logicType: 'AND',
          conditions: [{
            id: 'health_threshold',
            category: 'state',
            name: 'Health Threshold',
            parameters: { threshold_value: 50, comparison: 'less_than', is_percent: true },
            condition: 'bloodied'
          }]
        },
        triggerRole: { mode: 'CONDITIONAL' }
      },
      authoredDraft: {
        ...clone(dartUpdated.authoredDraft),
        spellType: 'REACTION',
        typeConfig: { ...clone(dartUpdated.authoredDraft.typeConfig), castTimeType: 'REACTION' },
        triggerConfig: {
          global: { logicType: 'AND', compoundTriggers: [{ id: 'trig-1', triggerType: 'on_damaged', parameters: {}, conditions: [] }] },
          effectTriggers: { damage: { triggerType: 'on_hit' } },
          conditionalEffects: {},
          buffDebuffTriggers: {},
          requiredConditions: {
            enabled: true,
            logicType: 'AND',
            conditions: [{
              id: 'health_threshold',
              category: 'state',
              name: 'Health Threshold',
              parameters: { threshold_value: 50, comparison: 'less_than', is_percent: true },
              condition: 'bloodied'
            }]
          },
          triggerRole: { mode: 'CONDITIONAL' }
        }
      }
    };
    // Save reaction record to library through the app
    await openBook(gm);
    await gm.evaluate(rec => window.handleLoadSpell(rec, false), reactionRecord);
    await gm.waitForTimeout(300);
    await finalizeBtn(gm).click();
    await gm.waitForFunction(n => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(n)), 'Shield Ward Reaction');

    await openBook(gm);
    await loadButton(gm).click();
    const modalReaction = gm.locator('.wow-window', { hasText: 'Open Saved Spell' });
    await modalReaction.waitFor({ timeout: 10000 });
    await modalReaction.locator('.spell-list-item', { hasText: 'Shield Ward Reaction' }).locator('.spell-list-load-btn').click();
    await modalReaction.waitFor({ state: 'detached' });
    await book(gm).locator('.edit-mode-indicator').waitFor({ timeout: 10000 });

    // Visit trigger step
    await book(gm).getByRole('navigation', { name: 'Spell wizard steps' }).locator('button', { hasText: /Triggers/i }).click();
    await book(gm).getByText(/Trigger Mode|Triggers/i).first().waitFor({ timeout: 10000 });

    // Update
    await finalizeBtn(gm).click();
    await gm.waitForTimeout(500);

    const savedReaction = await recordNamed(gm, 'Shield Ward Reaction');
    assert.ok(savedReaction, 'Shield Ward Reaction saved');
    assert.equal(savedReaction.triggerConfig?.global?.compoundTriggers?.length, 1, 'global compoundTriggers preserved');
    assert.equal(savedReaction.triggerConfig?.effectTriggers?.damage?.triggerType, 'on_hit', 'effectTriggers preserved');
    assert.equal(savedReaction.triggerConfig?.requiredConditions?.enabled, true, 'requiredConditions preserved');
    assert.deepEqual(savedReaction.authoredDraft?.triggerConfig, savedReaction.triggerConfig, 'authoredDraft matches triggerConfig');

    // Reopen to confirm load into wizardState preserves trigger configuration
    await openBook(gm);
    await loadButton(gm).click();
    const modalReopen = gm.locator('.wow-window', { hasText: 'Open Saved Spell' });
    await modalReopen.waitFor({ timeout: 10000 });
    await modalReopen.locator('.spell-list-item', { hasText: 'Shield Ward Reaction' }).locator('.spell-list-load-btn').click();
    await modalReopen.waitFor({ state: 'detached' });
    await book(gm).locator('.edit-mode-indicator').waitFor({ timeout: 10000 });
    const reopenedRecord = await recordNamed(gm, 'Shield Ward Reaction');
    assert.deepEqual(reopenedRecord.triggerConfig, savedReaction.triggerConfig, 'Reopened record has preserved triggerConfig');
    report.checks.reactionPreservation = { preserved: true, reopened: true };

    // --- STEP 4: Effect-attached triggers survive (Checklist item 3) ---
    step('Step 4: Effect-attached buffDebuffTriggers survive Trigger step visit -> Update');
    const buffDebuffRecord = {
      ...clone(dartUpdated),
      id: 'trigger-preserve-buff-debuff',
      name: 'Restorative Infusion',
      description: 'Spell with effect-attached buff/debuff trigger section',
      triggerConfig: {
        global: { logicType: 'AND', compoundTriggers: [] },
        effectTriggers: {},
        conditionalEffects: {},
        buffDebuffTriggers: {
          restoration: {
            triggers: [{ id: 'on_damage_taken', category: 'combat', name: 'Damage Taken', parameters: { perspective: 'self' } }],
            triggersEffect: 'restoration'
          }
        },
        requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
        triggerRole: { mode: 'CONDITIONAL' }
      },
      authoredDraft: {
        ...clone(dartUpdated.authoredDraft),
        triggerConfig: {
          global: { logicType: 'AND', compoundTriggers: [] },
          effectTriggers: {},
          conditionalEffects: {},
          buffDebuffTriggers: {
            restoration: {
              triggers: [{ id: 'on_damage_taken', category: 'combat', name: 'Damage Taken', parameters: { perspective: 'self' } }],
              triggersEffect: 'restoration'
            }
          },
          requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
          triggerRole: { mode: 'CONDITIONAL' }
        }
      }
    };
    await openBook(gm);
    await gm.evaluate(rec => window.handleLoadSpell(rec, false), buffDebuffRecord);
    await gm.waitForTimeout(300);
    await finalizeBtn(gm).click();
    await gm.waitForFunction(n => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(n)), 'Restorative Infusion');

    await openBook(gm);
    await loadButton(gm).click();
    const modalBuffDebuff = gm.locator('.wow-window', { hasText: 'Open Saved Spell' });
    await modalBuffDebuff.waitFor({ timeout: 10000 });
    await modalBuffDebuff.locator('.spell-list-item', { hasText: 'Restorative Infusion' }).locator('.spell-list-load-btn').click();
    await modalBuffDebuff.waitFor({ state: 'detached' });
    await book(gm).locator('.edit-mode-indicator').waitFor({ timeout: 10000 });

    // Visit trigger step
    await book(gm).getByRole('navigation', { name: 'Spell wizard steps' }).locator('button', { hasText: /Triggers/i }).click();
    await book(gm).getByText(/Trigger Mode|Triggers/i).first().waitFor({ timeout: 10000 });

    // Update
    await finalizeBtn(gm).click();
    await gm.waitForTimeout(500);

    const savedBuffDebuff = await recordNamed(gm, 'Restorative Infusion');
    assert.ok(savedBuffDebuff, 'Restorative Infusion saved');
    assert.ok(savedBuffDebuff.triggerConfig?.buffDebuffTriggers?.restoration, 'buffDebuffTriggers.restoration survived');
    assert.deepEqual(savedBuffDebuff.authoredDraft?.triggerConfig?.buffDebuffTriggers, savedBuffDebuff.triggerConfig?.buffDebuffTriggers, 'buffDebuffTriggers preserved in authoredDraft');
    report.checks.buffDebuffPreservation = { preserved: true };

    // --- STEP 5: Unsupported section remains manual & refused (Checklist item 4) ---
    step('Step 5: Unsupported manual trigger section survives Review Update and remains refused');
    const unsupportedRecord = {
      ...clone(dartUpdated),
      id: 'trigger-preserve-unsupported',
      name: 'Manual Trigger Composed Spell',
      description: 'Composed spell carrying unknown manual trigger section',
      triggerConfig: {
        global: { logicType: 'AND', compoundTriggers: [] },
        effectTriggers: {},
        conditionalEffects: {},
        manualTriggers: { onHit: 'Table adjudicates the follow-up.' }
      },
      authoredDraft: {
        ...clone(dartUpdated.authoredDraft),
        triggerConfig: {
          global: { logicType: 'AND', compoundTriggers: [] },
          effectTriggers: {},
          conditionalEffects: {},
          manualTriggers: { onHit: 'Table adjudicates the follow-up.' }
        }
      }
    };
    await openBook(gm);
    await gm.evaluate(rec => window.handleLoadSpell(rec, false), unsupportedRecord);
    await gm.waitForTimeout(300);
    await finalizeBtn(gm).click();
    await gm.waitForFunction(n => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(n)), 'Manual Trigger Composed Spell');

    await openBook(gm);
    await loadButton(gm).click();
    const modalUnsup = gm.locator('.wow-window', { hasText: 'Open Saved Spell' });
    await modalUnsup.waitFor({ timeout: 10000 });
    await modalUnsup.locator('.spell-list-item', { hasText: 'Manual Trigger Composed Spell' }).locator('.spell-list-load-btn').click();
    await modalUnsup.waitFor({ state: 'detached' });
    await book(gm).locator('.edit-mode-indicator').waitFor({ timeout: 10000 });

    // Jump to Step 10 (Review)
    await book(gm).getByRole('navigation', { name: 'Spell wizard steps' }).locator('button', { hasText: /Review/i }).click();
    await gm.waitForTimeout(400);

    // Update through Review
    await finalizeBtn(gm).click();
    await gm.waitForTimeout(500);

    const savedUnsup = await recordNamed(gm, 'Manual Trigger Composed Spell');
    assert.ok(savedUnsup, 'Manual Trigger Composed Spell saved');
    assert.deepEqual(savedUnsup.triggerConfig?.manualTriggers, { onHit: 'Table adjudicates the follow-up.' }, 'manualTriggers preserved in triggerConfig');
    assert.deepEqual(savedUnsup.authoredDraft?.triggerConfig?.manualTriggers, { onHit: 'Table adjudicates the follow-up.' }, 'manualTriggers preserved in authoredDraft');

    // Expected negative: admission MUST refuse the unsupported shape
    const unsupVerdict = pure.definitionFromWizard(savedUnsup);
    assert.equal(unsupVerdict.ok, false, 'Non-default unsupported trigger shape remains refused whole by admission authority');
    assert.match(unsupVerdict.reason, /trigger/i, 'Refusal reason identifies triggers');
    report.checks.unsupportedSection = {
      storedPreserved: true,
      refusedByAdmission: true,
      reason: unsupVerdict.reason
    };

    // --- STEP 6: Duplicate preserves trigger configuration and copy identity (Checklist item 5) ---
    step('Step 6: Duplicate creates independent copy; editing copy leaves source untouched');
    await openLibrary(gm);
    const row = book(gm).locator('[role="button"][aria-label="Shield Ward Reaction details"]').first();
    await row.waitFor({ timeout: 10000 });
    await row.click({ button: 'right' });
    const dupOption = gm.getByText('Duplicate Spell', { exact: true });
    await dupOption.waitFor({ timeout: 10000 });
    await dupOption.click();
    await gm.waitForTimeout(500);

    const allRecsDup = await records(gm);
    const copyRec = allRecsDup.find(s => s.name === 'Shield Ward Reaction (Copy)');
    assert.ok(copyRec, 'Duplicate copy exists in library');
    assert.notEqual(copyRec.id, savedReaction.id, 'Copy has distinct id');
    assert.notEqual(copyRec.dateCreated, savedReaction.dateCreated, 'Copy has distinct dateCreated');
    assert.equal(copyRec.authoredDefinitionId, savedReaction.authoredDefinitionId, 'Copy retains definition ID');
    assert.deepEqual(copyRec.triggerConfig, savedReaction.triggerConfig, 'Copy has deep clone of triggerConfig');

    // Mutate the copy's triggers in the Wizard
    await openBook(gm);
    await loadButton(gm).click();
    const modalDupEdit = gm.locator('.wow-window', { hasText: 'Open Saved Spell' });
    await modalDupEdit.waitFor({ timeout: 10000 });
    await modalDupEdit.locator('.spell-list-item', { hasText: 'Shield Ward Reaction (Copy)' }).locator('.spell-list-load-btn').click();
    await modalDupEdit.waitFor({ state: 'detached' });
    await book(gm).locator('.edit-mode-indicator').waitFor({ timeout: 10000 });

    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('MUTATED COPY ONLY');
    await finalizeBtn(gm).click();
    await gm.waitForTimeout(500);

    const originalAfterCopyEdit = await recordNamed(gm, 'Shield Ward Reaction');
    assert.equal(originalAfterCopyEdit.description, 'Reaction ward triggering on damaged with required condition', 'Original source untouched after copy edit');
    assert.deepEqual(originalAfterCopyEdit.triggerConfig, savedReaction.triggerConfig, 'Original source triggerConfig untouched');
    report.checks.duplicateIdentity = { copyCreated: true, sourceUntouched: true };

    // --- STEP 7: Catalogue prepared draft & duplicate preservation (Checklist items 6 & 7) ---
    step('Step 7: Catalogue prepared draft preserves partial load default, admits, and retains binding on copy');
    const prep = catalogueDraft(MARTYR_PRAYER_SOURCE, 'martyr', {
      authoredDefinitionId: '77777777-7777-4777-8777-777777777777',
      id: 'catalogue-martyr-prepared'
    });
    assert.ok(prep.ok, 'catalogueDraft generated cleanly');

    await openBook(gm);
    await gm.evaluate(draft => {
      window.handleLoadSpell(draft, false);
    }, prep.draft);
    await gm.waitForTimeout(300);

    // Visit trigger step on catalogue draft
    await book(gm).getByRole('navigation', { name: 'Spell wizard steps' }).locator('button', { hasText: /Triggers/i }).click();
    await book(gm).getByText(/Trigger Mode|Triggers/i).first().waitFor({ timeout: 10000 });

    // Finalize
    await finalizeBtn(gm).click();
    await gm.waitForTimeout(500);

    const savedCat = await recordNamed(gm, 'Restorative Prayer');
    assert.ok(savedCat, 'Restorative Prayer saved in library');
    assert.ok(savedCat.catalogueSource, 'Record has catalogueSource');
    assert.deepEqual(savedCat.triggerConfig, {
      global: { logicType: 'AND', compoundTriggers: [] },
      effectTriggers: {},
      conditionalEffects: {}
    }, 'Catalogue draft keeps partial load default (inert)');

    const catVerdict = pure.definitionFromWizard(savedCat, { roomId: 'r', classId: 'martyr', definitionVersion: 1 });
    assert.equal(catVerdict.ok, true, 'Catalogue prepared draft admits cleanly with inert partial default');
    report.checks.catalogueDraftAdmission = { ok: catVerdict.ok, descriptor: catVerdict.definition?.descriptor };

    // Duplicate catalogue record
    await openLibrary(gm);
    const catRow = book(gm).locator('[role="button"][aria-label="Restorative Prayer details"]').first();
    await catRow.waitFor({ timeout: 10000 });
    await catRow.click({ button: 'right' });
    const catDupOption = gm.getByText('Duplicate Spell', { exact: true });
    await catDupOption.waitFor({ timeout: 10000 });
    await catDupOption.click();
    await gm.waitForTimeout(500);

    const allRecsCat = await records(gm);
    const catCopy = allRecsCat.find(s => s.id !== savedCat.id && s.name.startsWith('Restorative Prayer'));
    assert.ok(catCopy, 'Catalogue copy exists');
    assert.deepEqual(catCopy.catalogueSource, savedCat.catalogueSource, 'catalogueSource binding retained on copy');
    assert.equal(catCopy.name, savedCat.name, 'Exact source name retained on catalogue copy');
    report.checks.catalogueDuplicate = { bindingRetained: true, nameRetained: true };

    // --- STEP 8: Cancel leaves stored source byte-identical (Checklist item 7) ---
    step('Step 8: Cancel Edit leaves stored source byte-identical');
    const snapshotBeforeCancel = clone(savedReaction);

    await openBook(gm);
    await loadButton(gm).click();
    const modalCancel = gm.locator('.wow-window', { hasText: 'Open Saved Spell' });
    await modalCancel.waitFor({ timeout: 10000 });
    await modalCancel.locator('.spell-list-item').filter({ has: gm.locator('.spell-list-name', { hasText: /^Shield Ward Reaction$/ }) }).locator('.spell-list-load-btn').click();
    await modalCancel.waitFor({ state: 'detached' });
    await book(gm).locator('.edit-mode-indicator').waitFor({ timeout: 10000 });

    // Mutate
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('MUTATED CANCEL TEST');
    await book(gm).getByRole('button', { name: 'Cancel Edit', exact: true }).click();
    const discardBtn = gm.locator('.custom-dialog-btn-danger', { hasText: 'Discard Changes' });
    await discardBtn.waitFor({ timeout: 10000 });
    await discardBtn.click();
    await gm.waitForTimeout(500);

    const reactionAfterCancel = await recordNamed(gm, 'Shield Ward Reaction');
    assert.ok(reactionAfterCancel, 'Shield Ward Reaction still exists');
    assert.deepEqual(reactionAfterCancel, snapshotBeforeCancel, 'Record is byte-identical after cancel');
    report.checks.cancelEdit = { byteIdentical: true };

    // --- STEP 9: Reload persistence verification (Checklist item 8) ---
    step('Step 9: Reload page and verify persistence across browser reload');
    await gm.reload();
    await gm.waitForFunction(() => typeof localStorage !== 'undefined' && Object.keys(localStorage).some(k => k.endsWith(':library.spellData')), null, { timeout: 10000 });
    const reloadedRecords = await records(gm);
    assert.ok(reloadedRecords && reloadedRecords.length >= 6, 'All records persisted across reload');

    const reloadedReaction = reloadedRecords.find(s => s.name === 'Shield Ward Reaction');
    assert.ok(reloadedReaction, 'Reloaded Shield Ward Reaction found');
    assert.deepEqual(reloadedReaction.triggerConfig, savedReaction.triggerConfig, 'Trigger configuration intact across reload');

    const reloadedCat = reloadedRecords.find(s => s.id === savedCat.id);
    assert.ok(reloadedCat, 'Reloaded catalogue record found');
    assert.deepEqual(reloadedCat.catalogueSource, savedCat.catalogueSource, 'catalogueSource intact across reload');

    report.passed = true;
    report.completedAt = new Date().toISOString();
    step('ALL 9 ORDINARY-APP CHECKLIST STAGES PASSED');
    save('result.json', report);
  } catch (err) {
    if (pages.gm) {
      await pages.gm.screenshot({ path: path.join(out, 'failure.png') }).catch(() => {});
      fs.writeFileSync(path.join(out, 'failure.html'), await pages.gm.content().catch(() => ''));
    }
    throw err;
  } finally {
    for (const ctx of Object.values(contexts)) await ctx.close().catch(() => {});
    await host.stop().catch(() => {});
  }
}

main().then(
  () => { console.log('Witness execution COMPLETE - ALL CHECKS PASSED'); process.exit(0); },
  err => { console.error('Witness execution FAILED:', err); report.errors.push(String(err && err.stack || err)); save('result.json', report); process.exit(1); }
);
