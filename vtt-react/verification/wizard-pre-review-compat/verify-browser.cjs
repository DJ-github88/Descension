'use strict';

const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const BUILD_DIR = path.resolve(process.env.APP_BUILD_DIR || path.join(__dirname, '..', '..', 'build'));
const APP_URL = process.env.APP_URL ? process.env.APP_URL.replace(/\/+$/, '') : null;
const EVIDENCE_DIR = path.resolve(__dirname, 'evidence');
const { CARD_UNSETTLED_REASON } = require('../../src/services/randomOutcome');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg'
};

function startStaticBuildServer(buildDir) {
  const indexPath = path.join(buildDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Missing production build at ${indexPath}`);
  }
  const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url || '/', 'http://127.0.0.1');
    let relPath = decodeURIComponent(reqUrl.pathname).replace(/^\/+/, '');
    let candidate = relPath ? path.join(buildDir, relPath) : indexPath;
    if (!candidate.startsWith(buildDir) || !fs.existsSync(candidate) || fs.statSync(candidate).isDirectory()) {
      candidate = indexPath;
    }
    const ext = path.extname(candidate).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(candidate).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve({
        server,
        url: `http://127.0.0.1:${server.address().port}`,
        stop: () => new Promise((done) => {
          if (server.closeAllConnections) server.closeAllConnections();
          server.close(done);
        })
      });
    });
  });
}

const book = (page) => page.getByRole('dialog', { name: 'Spellbook', exact: true });
const stepNav = (page) => book(page).getByRole('navigation', { name: 'Spell wizard steps' });

async function clickWizardStep(page, stepPattern) {
  const btn = stepNav(page).getByRole('button', { name: stepPattern }).first();
  await btn.waitFor({ state: 'visible', timeout: 10000 });
  await btn.click();
  await page.waitForFunction(
    (patternSrc) => {
      const rx = new RegExp(patternSrc, 'i');
      const active = document.querySelector('[aria-label="Spell wizard steps"] button[aria-current="step"]');
      return Boolean(active && rx.test(active.textContent || ''));
    },
    stepPattern.source,
    { timeout: 10000 }
  );
}

async function openBook(page, tabName = null) {
  if (!(await book(page).count()) || !(await book(page).isVisible())) {
    const charCat = page.locator('button.wow-nav-category-header[title^="Character"]').first();
    if (await charCat.count() && await charCat.isVisible()) {
      await charCat.click();
      const sbFlyout = page.locator('button.wow-nav-flyout-item[title^="Spellbook"]').first();
      await sbFlyout.waitFor({ state: 'visible', timeout: 10000 });
      await sbFlyout.click();
    } else {
      await page.locator('button', { hasText: /Character/ }).first().click();
      await page.locator('button', { hasText: /Spellbook/ }).first().click();
    }
    await book(page).waitFor({ state: 'visible', timeout: 15000 });
  }
  await book(page).locator('.loading-wrapper').waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
  if (tabName) {
    const tab = book(page).getByRole('button', { name: tabName, exact: true });
    await tab.waitFor({ state: 'visible', timeout: 10000 });
    await tab.click();
  }
}

async function resetWizard(page) {
  const cancelEdit = book(page).getByRole('button', { name: /Cancel Edit/i });
  if (await cancelEdit.count() && await cancelEdit.isVisible()) {
    await cancelEdit.click();
    const discard = page.getByRole('button', { name: /Discard Changes/i });
    await discard.waitFor({ timeout: 10000 });
    await discard.click();
    await page.waitForTimeout(250);
    return;
  }
  const reset = book(page).getByTitle('Reset Wizard');
  if (await reset.count() && await reset.isVisible()) {
    await reset.click();
    const confirm = page.getByRole('button', { name: 'Reset Wizard', exact: true });
    await confirm.waitFor({ timeout: 10000 });
    await confirm.click();
    await page.waitForTimeout(250);
  }
}

async function configureSingleRangedEnemies30(page) {
  await clickWizardStep(page, /Targeting/i);
  await book(page).getByText('Single Target', { exact: true }).click();
  await book(page).getByText('Ranged', { exact: true }).click();
  const slider = book(page).getByRole('slider').first();
  if (await slider.count()) {
    await slider.focus();
    await slider.press('Home');
    for (let i = 0; i < 6; i += 1) await slider.press('ArrowRight');
    await book(page).locator('.range-value').filter({ hasText: '30 ft' }).waitFor({ state: 'visible', timeout: 5000 });
  }
  const enemiesCard = book(page).locator('.targeting-option-card').filter({ hasText: 'Enemies' }).first();
  if (!/\bselected\b/.test((await enemiesCard.getAttribute('class')) || '')) {
    await enemiesCard.click();
  }
  for (const otherName of ['Any Target', 'Allies', 'Self']) {
    const card = book(page).locator('.targeting-option-card').filter({ hasText: otherName }).first();
    if (await card.count() && /\bselected\b/.test((await card.getAttribute('class')) || '')) {
      await card.click();
    }
  }
}

async function configureResources(page, apVal, manaVal) {
  await clickWizardStep(page, /Resources/i);
  const manaConfig = book(page).locator('.resource-cost-config').filter({ hasText: /Mana/i });
  if (!(await manaConfig.count())) {
    await book(page).getByTitle('Standard magical energy', { exact: true }).click();
  }
  const apConfig = book(page).locator('.resource-cost-config').filter({ hasText: /Action Points/i });
  if (!(await apConfig.count())) {
    await book(page).getByTitle('Basic action economy', { exact: true }).click();
  }
  const manaInput = book(page).locator('.resource-cost-config').filter({ hasText: /Mana/i }).getByRole('spinbutton').first();
  const apInput = book(page).locator('.resource-cost-config').filter({ hasText: /Action Points/i }).getByRole('spinbutton').first();
  await manaInput.fill(String(manaVal));
  await apInput.fill(String(apVal));
}

async function configureNoCooldown(page) {
  await clickWizardStep(page, /Cooldown/i);
  await book(page).getByRole('button', { name: /No Cooldown/i }).first().click();
}

async function findSpellRowInLibrary(page, name) {
  const rowLocator = book(page).locator(`[role="button"][aria-label="${name} details"]`);
  if (await rowLocator.count() && await rowLocator.first().isVisible()) {
    return rowLocator.first();
  }
  const prevBtn = book(page).getByRole('button', { name: 'Previous Page', exact: true });
  while (await prevBtn.count() && await prevBtn.isEnabled()) {
    await prevBtn.click();
    await page.waitForTimeout(150);
    if (await rowLocator.count() && await rowLocator.first().isVisible()) {
      return rowLocator.first();
    }
  }
  const nextBtn = book(page).getByRole('button', { name: 'Next Page', exact: true });
  while (await nextBtn.count() && await nextBtn.isEnabled()) {
    await nextBtn.click();
    await page.waitForTimeout(150);
    if (await rowLocator.count() && await rowLocator.first().isVisible()) {
      return rowLocator.first();
    }
  }
  throw new Error(`Spell row "${name}" not found in Spell Library`);
}

async function waitForSpellRowInLibrary(page, name) {
  await openBook(page, 'Spell Library');
  const deadline = Date.now() + 15000;
  let lastErr = null;
  while (Date.now() < deadline) {
    try {
      return await findSpellRowInLibrary(page, name);
    } catch (err) {
      lastErr = err;
      await page.waitForTimeout(250);
    }
  }
  throw lastErr || new Error(`Spell row "${name}" not found in Spell Library within 15s`);
}

async function openLibraryCard(page, name) {
  const row = await waitForSpellRowInLibrary(page, name);
  await row.click();
  const detail = page.locator('.spell-detail-overlay');
  await detail.waitFor({ state: 'visible', timeout: 10000 });
  return detail;
}

async function closeLibraryCard(page) {
  const detail = page.locator('.spell-detail-overlay');
  if (await detail.count() && await detail.isVisible()) {
    const closeBtn = detail.getByRole('button', { name: 'Close', exact: true });
    if (await closeBtn.count()) await closeBtn.first().click({ timeout: 5000 }).catch(() => {});
    if (await detail.count() && await detail.isVisible()) await page.keyboard.press('Escape');
    await detail.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }
}

async function editSpellFromLibrary(page, name) {
  await openBook(page, 'Spell Library');
  const row = await findSpellRowInLibrary(page, name);
  await row.click({ button: 'right' });
  await page.getByText('Edit in Spell Wizard', { exact: true }).click();
  await book(page).locator('.edit-mode-text').waitFor({ state: 'visible', timeout: 10000 });
}

async function capture(page, fileName, locator = null) {
  if (locator) {
    await locator.scrollIntoViewIfNeeded().catch(() => {});
  }
  const dest = path.join(EVIDENCE_DIR, fileName);
  await page.screenshot({ path: dest, fullPage: false });
  return dest;
}

(async () => {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  const serverHandle = APP_URL
    ? { url: APP_URL, stop: async () => {} }
    : await startStaticBuildServer(BUILD_DIR);
  const browser = await chromium.launch({ headless: true });
  const pageErrors = [];
  const consoleErrors = [];
  const dialogs = [];
  const summary = {
    startedAt: new Date().toISOString(),
    buildDir: BUILD_DIR,
    url: `${serverHandle.url}/game`,
    screenshots: {},
    journey1: {},
    journey2: {}
  };

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      acceptDownloads: true
    });
    const page = await context.newPage();

    page.on('dialog', async (dialog) => {
      dialogs.push(dialog.message());
      await dialog.dismiss().catch(() => {});
    });
    page.on('pageerror', (err) => {
      if (!/Failed to fetch|blockedbyclient|Loading chunk/i.test(String(err.message))) {
        pageErrors.push({ message: err.message, stack: err.stack });
      }
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !/Failed to load resource|fonts\.|firebase|net::ERR/i.test(msg.text())) {
        consoleErrors.push(msg.text());
      }
    });

    await page.route(/^https?:\/\/(?!(?:127\.0\.0\.1|localhost)(?::|\/|$))/, (route) => {
      const u = new URL(route.request().url());
      if (u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com') {
        return route.fulfill({ status: 200, contentType: 'text/css', body: '' });
      }
      if (u.hostname === 'cdnjs.cloudflare.com') {
        return route.fulfill({ status: 200, contentType: 'application/octet-stream', body: '' });
      }
      if (u.hostname === 'firebaseinstallations.googleapis.com') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            name: 'projects/mythrill-ff7c6/installations/fixture-fid',
            fid: 'fixture-fid',
            refreshToken: 'fixture-refresh-token',
            authToken: { token: 'fixture-token', expiresIn: '604800s' }
          })
        });
      }
      if (/(googleapis\.com|firebaseio\.com|firebaseapp\.com)$/.test(u.hostname)) {
        return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      }
      if (/up\.railway\.app$/.test(u.hostname)) {
        return route.abort();
      }
      return route.continue();
    });

    await page.goto(`${serverHandle.url}/game`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.locator('.action-slot').first().waitFor({ timeout: 90000 });
    const consent = page.getByRole('dialog', { name: /Analytics.*Privacy Consent/i });
    if (await consent.count() && await consent.isVisible()) {
      await consent.getByRole('button', { name: /Decline/i }).click();
    }

    const signedIn = await page.evaluate(() => {
      const chunkKey = Object.keys(window).find((k) => k.startsWith('webpackChunk'));
      if (!chunkKey) throw new Error('Missing webpackChunk global');
      let req;
      window[chunkKey].push([[99421 + Math.floor(Math.random() * 10000)], {}, (r) => { req = r; }]);
      let authStore = null;
      for (const [id, f] of Object.entries(req.m)) {
        const src = f.toString();
        if (/storeRegistry/i.test(id) || src.includes('registerStore')) {
          try {
            const mod = req(id);
            if (mod && typeof mod.getStore === 'function') {
              const candidate = mod.getStore('authStore');
              if (candidate && typeof candidate.getState === 'function') {
                authStore = candidate;
                break;
              }
            }
          } catch (_) {}
        }
      }
      if (!authStore) {
        for (const [id] of Object.entries(req.m)) {
          if (/authStore\.(js|ts|jsx|tsx)$/i.test(id)) {
            const mod = req(id);
            if (mod?.default && typeof mod.default.getState === 'function') {
              authStore = mod.default;
              break;
            }
          }
        }
      }
      if (!authStore) throw new Error('Unable to resolve authStore');
      authStore.getState().setUser({
        uid: 'wizard-proof-user',
        displayName: 'Wizard Proof',
        getIdToken: async () => 'wizard-proof-user'
      });
      return authStore.getState().user?.uid || null;
    });
    assert.equal(signedIn, 'wizard-proof-user', 'Expected demo user signed into authStore');
    await page.waitForTimeout(500);

    // ── Journey 1: Trigger conflict in Step 4 -> fix before Review -> ready for GM review ──
    await openBook(page, 'Spell Wizard');
    await resetWizard(page);

    await book(page).getByPlaceholder('Enter a name for your spell').fill('Searing Follow-Up');
    await book(page).getByPlaceholder('Describe what your spell does and how it appears').fill('An immediate ember strike offered after my damage.');
    await book(page).getByText('Ember', { exact: true }).first().click();

    await clickWizardStep(page, /Spell Type/i);
    await book(page).getByRole('heading', { name: 'ACTION', exact: true }).click();
    await book(page).locator('#authoredActionTiming').selectOption('IMMEDIATE');

    await clickWizardStep(page, /Effects/i);
    await book(page).getByRole('heading', { name: 'Damage', exact: true }).click();
    await book(page).locator('.damage-effects-container').getByRole('textbox').first().fill('1d8');

    await clickWizardStep(page, /Triggers/i);
    await book(page).locator('.wow-trigger-option').filter({ hasText: 'Follow-up After My Damage' }).first().click();
    await book(page).getByRole('button', { name: /Effect-Specific Triggers/i }).click();
    await book(page).getByRole('button', { name: /Direct/i }).first().click();
    await book(page).locator('.wow-trigger-option').filter({ hasText: 'Follow-up After My Damage' }).first().click();

    const triggerConflictNotice = book(page).locator('.exec-compat-inline[data-state="unsupported"]');
    await triggerConflictNotice.waitFor({ state: 'visible', timeout: 10000 });
    assert.equal(await triggerConflictNotice.getAttribute('data-compat-control'), 'triggers');
    const triggerConflictText = await triggerConflictNotice.innerText();
    assert.match(triggerConflictText, /Mixed triggers stay GM-manual/i);
    assert.match(triggerConflictText, /Supported alternative:/i);
    assert.match(triggerConflictText, /What the GM will handle:/i);
    summary.screenshots.step4Conflict = await capture(page, '01-step4-trigger-conflict.png', triggerConflictNotice);
    summary.journey1.step4ConflictText = triggerConflictText;

    // Remove the Direct Damage effect-specific trigger and confirm conflict clears immediately
    await book(page).locator('.pf-selected-triggers .pf-remove-trigger').first().click();
    await triggerConflictNotice.waitFor({ state: 'detached', timeout: 10000 });
    summary.journey1.conflictClearedImmediately = true;

    // Complete Targeting, Resources, Cooldown -> revisit Step 4 to confirm [role="status"][data-state="executable"]
    await configureSingleRangedEnemies30(page);
    await configureResources(page, 1, 2);
    await configureNoCooldown(page);

    await clickWizardStep(page, /Triggers/i);
    const step4ReadyNotice = book(page).locator('[role="status"][data-state="executable"]');
    await step4ReadyNotice.waitFor({ state: 'visible', timeout: 10000 });
    const step4ReadyText = await step4ReadyNotice.innerText();
    assert.match(step4ReadyText, /Structurally compatible with a Prism route/i);
    summary.screenshots.step4Fixed = await capture(page, '02-step4-trigger-fixed.png', step4ReadyNotice);
    summary.journey1.step4ReadyText = step4ReadyText;

    // Review -> executable
    await clickWizardStep(page, /Review/i);
    const j1ReviewCompat = book(page).locator('.exec-compat[data-state="executable"]');
    await j1ReviewCompat.waitFor({ state: 'visible', timeout: 10000 });
    const j1ReviewText = await j1ReviewCompat.innerText();
    assert.match(j1ReviewText, /Structurally compatible with a Prism route/i);
    summary.screenshots.j1Review = await capture(page, '03-journey1-review-ready.png', j1ReviewCompat);
    summary.journey1.reviewCompatText = j1ReviewText;

    // Save to Library -> verify Saved Card agrees
    const j1SaveBtn = book(page).locator('.review-actions .save-button').first();
    await j1SaveBtn.scrollIntoViewIfNeeded();
    await j1SaveBtn.click();
    await book(page).locator('.review-actions .save-button.success').first().waitFor({ state: 'visible', timeout: 10000 });
    await waitForSpellRowInLibrary(page, 'Searing Follow-Up');

    const j1CardDetail = await openLibraryCard(page, 'Searing Follow-Up');
    const j1CardFlow = j1CardDetail.locator('.spell-behavior-flow[data-behavior-status="supported"]').first();
    await j1CardFlow.waitFor({ state: 'visible', timeout: 10000 });
    const j1CardCompat = j1CardDetail.locator('.exec-compat[data-state="executable"]').first();
    await j1CardCompat.waitFor({ state: 'visible', timeout: 10000 });
    summary.screenshots.j1SavedCard = await capture(page, '04-journey1-saved-card-ready.png', j1CardCompat);
    summary.journey1.savedCardFlowStatus = await j1CardFlow.getAttribute('data-behavior-status');
    summary.journey1.savedCardCompatState = await j1CardCompat.getAttribute('data-state');
    await closeLibraryCard(page);

    // ── Journey 2: Unsupported outcome method (Cards / Tarot) -> save, reopen, export, import unchanged ──
    await openBook(page, 'Spell Wizard');
    await resetWizard(page);

    await book(page).getByPlaceholder('Enter a name for your spell').fill('Tarot of Cinders');
    await book(page).getByPlaceholder('Describe what your spell does and how it appears').fill('Draws a Tarot card to scorch or mend.');
    await book(page).getByText('Ember', { exact: true }).first().click();

    await clickWizardStep(page, /Spell Type/i);
    await book(page).getByRole('heading', { name: 'ACTION', exact: true }).click();
    await book(page).locator('#authoredActionTiming').selectOption('IMMEDIATE');

    await clickWizardStep(page, /Effects/i);
    await book(page).getByText(/Outcome Table \(Dice \/ Coin \/ Card\)/i).first().click();

    await configureSingleRangedEnemies30(page);
    await configureResources(page, 1, 2);
    await configureNoCooldown(page);

    await clickWizardStep(page, /Rollable Table/i);
    await book(page).locator('#table-name').fill('Cinder Tarot');
    await book(page).locator('#table-description').fill('Tarot draw outcomes.');
    await book(page).getByRole('button', { name: /^Cards$/i }).click();
    await book(page).locator('#deck-type').selectOption('tarot');
    await book(page).locator('#card-count').fill('2');

    const step8CardsNotice = book(page).locator('[role="status"][data-state="unsupported"][data-compat-control="resolution-method"]');
    await step8CardsNotice.waitFor({ state: 'visible', timeout: 10000 });
    const step8CardsText = await step8CardsNotice.innerText();
    assert.ok(step8CardsText.includes(CARD_UNSETTLED_REASON), `Expected exact card reason in Step 8 notice:\n${step8CardsText}`);
    assert.match(step8CardsText, /Supported alternative:[\s\S]*Dice[\s\S]*Coins[\s\S]*Standard/i);
    assert.match(step8CardsText, /What the GM will handle:/i);
    const step8NextBtn = book(page).locator('.spell-wizard-nav-btn.primary').first();
    assert.equal(await step8NextBtn.isDisabled(), false, 'Step 8 Next button must remain enabled for manual draft');
    summary.screenshots.step8CardsUnsupported = await capture(page, '05-step8-cards-unsupported.png', step8CardsNotice);
    summary.journey2.step8CardsText = step8CardsText;

    // Advance via Next / Review and verify identical compiler output in Review
    await step8NextBtn.click();
    await clickWizardStep(page, /Review/i);
    const j2ReviewCompat = book(page).locator('.exec-compat[data-state="unsupported"]');
    await j2ReviewCompat.waitFor({ state: 'visible', timeout: 10000 });
    const j2ReviewText = await j2ReviewCompat.innerText();
    assert.ok(j2ReviewText.includes(CARD_UNSETTLED_REASON), `Expected exact card reason in Review:\n${j2ReviewText}`);
    summary.screenshots.j2ReviewManual = await capture(page, '06-journey2-review-manual.png', j2ReviewCompat);
    summary.journey2.reviewCompatText = j2ReviewText;

    // Save draft intact
    const j2SaveBtn = book(page).locator('.review-actions .save-button').first();
    await j2SaveBtn.scrollIntoViewIfNeeded();
    await j2SaveBtn.click();
    await book(page).locator('.review-actions .save-button.success').first().waitFor({ state: 'visible', timeout: 10000 });
    await waitForSpellRowInLibrary(page, 'Tarot of Cinders');

    // Saved Card check
    const j2CardDetail = await openLibraryCard(page, 'Tarot of Cinders');
    const j2CardFlow = j2CardDetail.locator('.spell-behavior-flow[data-behavior-status="manual"]').first();
    await j2CardFlow.waitFor({ state: 'visible', timeout: 10000 });
    const j2CardFlowText = await j2CardFlow.innerText();
    assert.ok(j2CardFlowText.includes(CARD_UNSETTLED_REASON), 'Saved card behavior flow must show exact card refusal reason');
    const j2CardCompat = j2CardDetail.locator('.exec-compat[data-state="unsupported"]').first();
    await j2CardCompat.waitFor({ state: 'visible', timeout: 10000 });
    const j2CardCompatText = await j2CardCompat.innerText();
    assert.ok(j2CardCompatText.includes(CARD_UNSETTLED_REASON), 'Saved card ExecutionCompatibility must show exact card refusal reason');
    summary.screenshots.j2SavedCardManual = await capture(page, '07-journey2-saved-card-manual.png', j2CardCompat);
    await closeLibraryCard(page);

    // Reopen saved spell in Wizard -> verify choices and Step 8 notice unchanged
    await editSpellFromLibrary(page, 'Tarot of Cinders');
    await clickWizardStep(page, /Rollable Table/i);
    assert.equal(await book(page).locator('#table-name').inputValue(), 'Cinder Tarot');
    assert.equal(await book(page).locator('#deck-type').inputValue(), 'tarot');
    assert.equal(await book(page).locator('#card-count').inputValue(), '2');
    const cardsActiveClass = await book(page).getByRole('button', { name: /^Cards$/i }).getAttribute('class');
    assert.match(cardsActiveClass || '', /\bactive\b/);
    const entriesHeading = await book(page).locator('.config-section-header').filter({ hasText: 'Table Entries' }).innerText();
    assert.match(entriesHeading, /Table Entries \(2\)/);
    const reopenedNotice = book(page).locator('[role="status"][data-state="unsupported"][data-compat-control="resolution-method"]');
    await reopenedNotice.waitFor({ state: 'visible', timeout: 10000 });
    const reopenedNoticeText = await reopenedNotice.innerText();
    assert.ok(reopenedNoticeText.includes(CARD_UNSETTLED_REASON));
    summary.screenshots.j2ReopenedStep8 = await capture(page, '08-journey2-reopened-step8.png', reopenedNotice);

    // Cancel Edit -> switch to Spell Library -> Export -> verify JSON -> Import -> verify Saved Card, Reopened Wizard & re-export JSON
    await resetWizard(page);
    await book(page).locator('.edit-mode-text').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    await openBook(page, 'Spell Library');

    const exportedPath = path.join(EVIDENCE_DIR, 'exported-library.json');
    const exportBtn = book(page).getByRole('button', { name: /\bExport$/i }).first();
    await exportBtn.waitFor({ state: 'visible', timeout: 10000 });
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      exportBtn.click()
    ]);
    await download.saveAs(exportedPath);
    const exportedJson = JSON.parse(fs.readFileSync(exportedPath, 'utf8'));

    const exportedJ1 = (exportedJson?.data?.spells || []).find((s) => s.name === 'Searing Follow-Up');
    assert.ok(exportedJ1 && exportedJ1.authoredDefinitionId, 'Exported JSON must include Searing Follow-Up with authoredDefinitionId');
    assert.equal((exportedJ1.triggerConfig?.global?.compoundTriggers || []).length, 1);
    assert.deepEqual(exportedJ1.triggerConfig?.effectTriggers || {}, {});

    const exportedTarot = (exportedJson?.data?.spells || []).find((s) => s.name === 'Tarot of Cinders');
    assert.ok(exportedTarot, 'Exported JSON must include Tarot of Cinders');
    assert.equal(exportedTarot.rollableTable?.enabled, true);
    assert.equal(exportedTarot.rollableTable?.name, 'Cinder Tarot');
    assert.equal(exportedTarot.rollableTable?.resolutionType, 'CARDS');
    assert.equal(exportedTarot.rollableTable?.resolutionConfig?.deckType, 'tarot');
    assert.equal(Number(exportedTarot.rollableTable?.resolutionConfig?.cardCount), 2);
    assert.equal((exportedTarot.rollableTable?.entries || []).length, 2);
    assert.deepEqual(exportedTarot.authoredDraft?.rollableTable, exportedTarot.rollableTable);
    summary.journey2.exportedSpellCount = exportedJson.data.spells.length;

    const importBtn = book(page).getByRole('button', { name: /\bImport$/i }).first();
    await importBtn.waitFor({ state: 'visible', timeout: 10000 });
    const [chooser] = await Promise.all([
      page.waitForEvent('filechooser', { timeout: 15000 }),
      importBtn.click()
    ]);
    await chooser.setFiles(exportedPath);

    await waitForSpellRowInLibrary(page, 'Tarot of Cinders (Imported)');

    const importedCardDetail = await openLibraryCard(page, 'Tarot of Cinders (Imported)');
    const importedFlow = importedCardDetail.locator('.spell-behavior-flow[data-behavior-status="manual"]').first();
    await importedFlow.waitFor({ state: 'visible', timeout: 10000 });
    assert.ok((await importedFlow.innerText()).includes(CARD_UNSETTLED_REASON));
    const importedCompat = importedCardDetail.locator('.exec-compat[data-state="unsupported"]').first();
    await importedCompat.waitFor({ state: 'visible', timeout: 10000 });
    assert.ok((await importedCompat.innerText()).includes(CARD_UNSETTLED_REASON));
    await closeLibraryCard(page);

    await editSpellFromLibrary(page, 'Tarot of Cinders (Imported)');
    await clickWizardStep(page, /Rollable Table/i);
    assert.equal(await book(page).locator('#table-name').inputValue(), 'Cinder Tarot');
    assert.equal(await book(page).locator('#deck-type').inputValue(), 'tarot');
    assert.equal(await book(page).locator('#card-count').inputValue(), '2');
    assert.match((await book(page).getByRole('button', { name: /^Cards$/i }).getAttribute('class')) || '', /\bactive\b/);
    const importedEntriesHeading = await book(page).locator('.config-section-header').filter({ hasText: 'Table Entries' }).innerText();
    assert.match(importedEntriesHeading, /Table Entries \(2\)/);
    const importedReopenedNotice = book(page).locator('[role="status"][data-state="unsupported"][data-compat-control="resolution-method"]');
    await importedReopenedNotice.waitFor({ state: 'visible', timeout: 10000 });
    assert.ok((await importedReopenedNotice.innerText()).includes(CARD_UNSETTLED_REASON));
    summary.screenshots.j2ImportedReopened = await capture(page, '09-journey2-imported-reopened.png', importedReopenedNotice);

    await resetWizard(page);
    await book(page).locator('.edit-mode-text').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    await openBook(page, 'Spell Library');

    const reExportPath = path.join(EVIDENCE_DIR, 'exported-after-import.json');
    const [reDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      book(page).getByRole('button', { name: /\bExport$/i }).first().click()
    ]);
    await reDownload.saveAs(reExportPath);
    const reExportJson = JSON.parse(fs.readFileSync(reExportPath, 'utf8'));
    const importedRecord = (reExportJson?.data?.spells || []).find((s) => s.name === 'Tarot of Cinders (Imported)');
    assert.ok(importedRecord, 'Re-exported JSON must include Tarot of Cinders (Imported)');
    assert.deepEqual(importedRecord.rollableTable, exportedTarot.rollableTable);
    assert.deepEqual(importedRecord.authoredDraft?.rollableTable, exportedTarot.authoredDraft?.rollableTable);
    summary.journey2.importedId = importedRecord.id;

    summary.pageErrors = pageErrors;
    summary.consoleErrors = consoleErrors;
    summary.dialogs = dialogs;
    summary.ok = pageErrors.length === 0 && dialogs.length === 0;
    assert.equal(pageErrors.length, 0, `Unexpected page errors: ${JSON.stringify(pageErrors)}`);
    assert.equal(dialogs.length, 0, `Unexpected browser dialogs: ${JSON.stringify(dialogs)}`);

    fs.writeFileSync(path.join(EVIDENCE_DIR, 'result.json'), JSON.stringify(summary, null, 2));
    console.log(JSON.stringify({ ok: summary.ok, pageErrors: pageErrors.length, dialogs: dialogs.length, consoleErrors: consoleErrors.length, screenshots: Object.keys(summary.screenshots) }, null, 2));
  } finally {
    await browser.close();
    await serverHandle.stop();
  }
})();
