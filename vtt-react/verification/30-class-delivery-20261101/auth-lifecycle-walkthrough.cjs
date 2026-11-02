const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const assert = require('assert/strict');

const rootDir = path.resolve(__dirname, '../../..');
const buildDir = path.resolve(rootDir, 'vtt-react/build');
const evidenceDir = path.resolve(rootDir, 'docs/plans/mythrill-class-reconstruction/implementation/evidence/30-CLASS-VERIFICATION-20261101/screenshots');
fs.mkdirSync(evidenceDir, { recursive: true });

const report = {
  startedAt: new Date().toISOString(),
  testSuite: 'Production Ordinary App Lifecycle (Create -> Save -> View -> Edit -> Save)',
  steps: [],
  checks: {},
  qualifications: [
    'Uses mockFirebase network-layer interception per auth handoff (RECONCILIATION_NOTE.md / auth-harness-lib.cjs) for anonymous guest authentication.',
    'Disposable browser context (clean profile, isolated localStorage/cookies).',
    'Real Firebase backend is unestablished/separate.'
  ],
  errors: [],
  passed: false
};

const step = (s) => {
  report.steps.push({ at: new Date().toISOString(), step: s });
  console.log('·', s);
};

const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

function serve(dir, port = 4199) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let f = path.join(dir, p);
    if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      f = path.join(dir, 'index.html');
    }
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', mime[path.extname(f)] || 'application/octet-stream');
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => server.listen(port, '127.0.0.1', () => r({ server, url: `http://127.0.0.1:${port}` })));
}

const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url');
const jwt = uid => `${b64({ alg: 'none', typ: 'JWT' })}.${b64({
  iss: 'https://securetoken.google.com/disposable-project',
  aud: 'disposable-project',
  sub: uid,
  user_id: uid,
  auth_time: Math.floor(Date.now() / 1000),
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
  firebase: { identities: {}, sign_in_provider: 'anonymous' }
})}.x`;

async function mockFirebase(context, log, { uids = ['mock-guest-uid-1', 'mock-guest-uid-2'] } = {}) {
  let signUps = 0, current = null;
  await context.route(/(googleapis\.com|firebaseio\.com|firebaseapp\.com|gstatic\.com|google-analytics\.com|googletagmanager\.com)/, route => {
    const u = new URL(route.request().url());
    const json = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body), headers: { 'access-control-allow-origin': '*' } });

    if (route.request().method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
    }

    if (u.hostname === 'identitytoolkit.googleapis.com' && u.pathname.endsWith('accounts:signUp')) {
      signUps += 1;
      log.push({ mock: 'signUp', n: signUps });
      current = uids[Math.min(signUps - 1, uids.length - 1)];
      return json(200, { kind: 'identitytoolkit#SignupNewUserResponse', idToken: jwt(current), refreshToken: 'mock-refresh', expiresIn: '3600', localId: current });
    }

    if (u.hostname === 'identitytoolkit.googleapis.com' && u.pathname.endsWith('accounts:lookup')) {
      log.push({ mock: 'lookup' });
      return json(200, { kind: 'identitytoolkit#GetAccountInfoResponse', users: [{ localId: current || uids[0], providerUserInfo: [], createdAt: String(Date.now()), lastLoginAt: String(Date.now()) }] });
    }

    if (u.hostname === 'firebaseinstallations.googleapis.com') {
      log.push({ mock: 'installations' });
      return json(200, { name: 'projects/disposable-project/installations/mockfid', fid: 'mockfid0000000000000a', refreshToken: 'mock', authToken: { token: jwt('mockfid'), expiresIn: '604800s' } });
    }

    if (u.hostname === 'securetoken.googleapis.com') {
      return json(200, { id_token: jwt(current || uids[0]), refresh_token: 'mock-refresh', expires_in: '3600', user_id: current || uids[0] });
    }

    log.push({ refused: u.origin });
    return route.fulfill({
      status: u.hostname.startsWith('fonts') ? 200 : 503,
      contentType: u.pathname.endsWith('.css') || u.hostname.startsWith('fonts') ? 'text/css' : 'application/json',
      body: u.hostname.startsWith('fonts') ? '' : '{"error":{"code":503,"message":"REFUSED_BY_WITNESS"}}',
      headers: { 'access-control-allow-origin': '*' }
    });
  });
}

(async () => {
  const PORT = 4199;
  const { server, url } = await serve(buildDir, PORT);
  const log = [];
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await mockFirebase(context, log);
  const page = await context.newPage();

  page.on('pageerror', e => report.errors.push(e.message));

  try {
    step('1. Navigate to landing page');
    await page.goto(url + '/');
    await page.waitForTimeout(2000);
    const decline = page.getByRole('button', { name: 'DECLINE' });
    if (await decline.count()) await decline.click().catch(() => {});
    await page.waitForTimeout(500);

    step('2. Login -> Continue as Guest');
    const loginBtn = page.locator('button', { hasText: /^\s*Login\s*$/ }).first();
    await loginBtn.click();
    await page.waitForTimeout(600);
    const guestBtn = page.getByRole('button', { name: /Continue as Guest/ });
    await guestBtn.click({ timeout: 15000 });
    await page.waitForFunction(() => /\/account/.test(location.pathname), null, { timeout: 20000 });
    await page.screenshot({ path: path.join(evidenceDir, 'ordinary-lifecycle-account-home.png') });

    step('3. Open Character Roster and remove sample character if present (guest 1-char limit)');
    await page.goto(url + '/account/characters');
    await page.waitForTimeout(3000);
    const deleteBtn = page.locator('button[title="Delete character"]').first();
    if (await deleteBtn.count()) {
      await deleteBtn.click();
      await page.getByRole('button', { name: /Yes, Delete Character/ }).click();
      await page.waitForTimeout(2000);
    }
    await page.screenshot({ path: path.join(evidenceDir, 'ordinary-lifecycle-roster-clean.png') });

    step('4. Open Character Creation Wizard');
    await page.locator('button', { hasText: /CREATE CHARACTER/i }).first().click();
    await page.waitForURL(/characters\/create/, { timeout: 10000 });
    await page.waitForTimeout(2000);

    const CHAR_NAME = 'Covenbane Champion';
    await page.getByPlaceholder('Name your hero').fill(CHAR_NAME);
    const maleBtn = page.locator('button', { hasText: /^\s*Male\s*$/ }).first();
    if (await maleBtn.count()) await maleBtn.click();

    // Select Race
    await page.locator('.race-button-token').first().click();
    await page.waitForTimeout(400);
    await page.locator('.subrace-button-token:not(.narrative-unlock)').first().click();
    await page.waitForTimeout(400);

    // Select Class: Find Covenbane icon token if available, or first available
    const covenbaneIcon = page.locator('.class-icon-token[data-class="Covenbane"], .class-icon-token:has-text("Covenbane")');
    if (await covenbaneIcon.count()) {
      await covenbaneIcon.first().click();
    } else {
      await page.locator('.class-icon-token:not(.narrative-unlock)').first().click();
    }
    await page.waitForTimeout(400);

    // Select Background
    await page.locator('.background-button-token:not(.narrative-unlock)').first().click();
    await page.waitForTimeout(400);

    // Configure Ability Scores
    const L = text => page.locator('button.launcher-trigger-btn', { hasText: text });
    const ov = page.locator('.grimoire-drawer-overlay');
    await L('Ability Scores').click();
    await page.waitForTimeout(1000);
    for (let i = 0; i < 60; i++) {
      const text = await ov.innerText();
      const rem = parseInt(text.match(/(\d+)\s*\n?\s*POINTS REMAINING/i)?.[1] ?? '0', 10);
      if (rem === 0) break;
      const plus = ov.getByRole('button', { name: /^(\+|Increase)/ });
      let done = false;
      for (let k = 0; k < await plus.count(); k++) {
        const b = plus.nth(k);
        if (await b.isEnabled()) {
          await b.click();
          done = true;
          break;
        }
      }
      if (!done) break;
    }
    await ov.getByRole('button', { name: /Save Scores/ }).click();
    await ov.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(500);

    // Ancestral Gifts
    await L('Ancestral Gifts').click();
    await page.waitForTimeout(1200);
    for (const n of ['Storm-Blooded', 'Tide-Tongue', 'Coral-Hide']) {
      await page.getByText(n, { exact: true }).click().catch(() => {});
    }
    const confirmGifts = page.getByRole('button', { name: /Confirm Gifts/ });
    if (await confirmGifts.count()) await confirmGifts.click({ force: true });
    await page.locator('.ancestral-modal-overlay, .grimoire-drawer-overlay').waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(800);

    // Starting Spells
    const spellsLauncher = L('Starting Spells');
    if (await spellsLauncher.count()) {
      await spellsLauncher.click();
      await page.waitForTimeout(1500);
      const spellCards = ov.locator('.spellbook-icon-card');
      const cardCount = await spellCards.count();
      for (let i = 0; i < Math.min(3, cardCount); i++) {
        await spellCards.nth(i).click();
        await page.waitForTimeout(300);
        const addBtn = ov.locator('.spellbook-selection-toggle-btn, button:has-text("Add to Spells")').first();
        if (await addBtn.count()) {
          const btnText = await addBtn.innerText();
          if (btnText.includes('Add to Spells')) {
            await addBtn.click();
            await page.waitForTimeout(300);
          }
        }
      }
      const confirmSpells = ov.locator('button.grimoire-action-confirm-btn, button:has-text("Confirm Spells")').first();
      if (await confirmSpells.count() && await confirmSpells.isEnabled()) {
        await confirmSpells.click({ force: true });
      } else {
        const closeBtn = ov.locator('.drawer-close-btn').first();
        if (await closeBtn.count()) await closeBtn.click();
      }
      await page.locator('.grimoire-drawer-overlay').waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(600);
    }

    // Advance wizard steps to final review
    for (let i = 0; i < 4; i++) {
      const nextBtn = page.getByRole('button', { name: /Next step/i });
      if (await nextBtn.count()) {
        await nextBtn.click({ force: true });
        await page.waitForTimeout(1200);
      }
    }

    step('5. Save Character');
    report.checks.urlBeforeCreate = page.url();
    const createBtn = page.getByRole('button', { name: /Create Character/i });
    console.log('Create button count:', await createBtn.count());
    if (await createBtn.count()) {
      await createBtn.click({ force: true });
    }
    await page.waitForTimeout(4000);
    report.checks.urlAfterCreate = page.url();
    console.log('URL after create:', report.checks.urlAfterCreate);
    await page.screenshot({ path: path.join(evidenceDir, 'ordinary-lifecycle-after-create.png') });

    step('6. View in Roster and verify saved character');
    if (!page.url().includes('/account/characters')) {
      await page.goto(url + '/account/characters');
      await page.waitForTimeout(3000);
    }
    const rosterText = await page.evaluate(() => document.body.innerText);
    console.log('Roster text summary:', rosterText.replace(/\s+/g, ' ').slice(0, 400));
    assert.ok(rosterText.includes(CHAR_NAME), `Saved character ${CHAR_NAME} must appear in roster. Found: ${rosterText.slice(0, 200)}`);
    report.checks.savedInRoster = true;
    await page.screenshot({ path: path.join(evidenceDir, 'ordinary-lifecycle-roster-with-character.png') });

    step('7. Reload Page and verify character preservation');
    await page.reload();
    await page.waitForTimeout(3000);
    const reloadText = await page.evaluate(() => document.body.innerText);
    assert.ok(reloadText.includes(CHAR_NAME), `Saved character ${CHAR_NAME} must survive page reload`);
    report.checks.survivesReload = true;
    await page.screenshot({ path: path.join(evidenceDir, 'ordinary-lifecycle-after-reload.png') });

    step('8. Edit Character (open editor, update name)');
    const editBtn = page.locator('button[title="Edit character"]').first();
    await editBtn.click();
    await page.waitForTimeout(3000);
    const nameInput = page.getByPlaceholder('Name your hero');
    await nameInput.waitFor({ timeout: 15000 });
    const currentNameVal = await nameInput.inputValue();
    assert.equal(currentNameVal, CHAR_NAME, 'Editor must load saved name');

    const UPDATED_NAME = 'Covenbane Champion II';
    await nameInput.fill(UPDATED_NAME);

    // Advance to update button
    for (let i = 0; i < 6; i++) {
      const updateBtn = page.getByRole('button', { name: /Update Character/i });
      if (await updateBtn.count()) {
        await updateBtn.click({ force: true });
        break;
      }
      const nextBtn = page.getByRole('button', { name: /Next step/i });
      if (await nextBtn.count()) {
        await nextBtn.click();
        await page.waitForTimeout(1000);
      }
    }
    await page.waitForTimeout(3500);

    step('9. Verify updated character survives second reload');
    await page.goto(url + '/account/characters');
    await page.waitForTimeout(3000);
    await page.reload();
    await page.waitForTimeout(3000);
    const updatedRosterText = await page.evaluate(() => document.body.innerText);
    assert.ok(updatedRosterText.includes(UPDATED_NAME), `Updated character ${UPDATED_NAME} must appear after reload`);
    report.checks.editSurvivesReload = true;
    await page.screenshot({ path: path.join(evidenceDir, 'ordinary-lifecycle-after-edit-reload.png') });

    report.passed = true;
    console.log('✓ Full ordinary app lifecycle (create -> save -> view -> edit -> save) verified successfully!');
  } catch (err) {
    console.error('Lifecycle Error:', err);
    report.error = err.message;
    await page.screenshot({ path: path.join(evidenceDir, 'ordinary-lifecycle-fail.png') }).catch(() => {});
  } finally {
    await browser.close();
    server.close();
  }

  const outReportPath = path.join(path.dirname(evidenceDir), 'ordinary-lifecycle-report.json');
  fs.writeFileSync(outReportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`Lifecycle report saved to: ${outReportPath}`);
  if (!report.passed) process.exit(1);
})();
