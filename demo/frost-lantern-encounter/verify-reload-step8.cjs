'use strict';
/**
 * Focused isolated reproduction of Step 7 -> Step 8 (owner reload -> Use this owner attachment ->
 * select target -> pending approval -> End Combat closure without spending -> restart combat).
 * Runs against an existing identified isolated build without modifying live source or shared build.
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const crypto = require('crypto');

const root = path.resolve(__dirname, '../..');
const { setup: baseSetup } = require(path.join(root, 'vtt-react/verification/p9/integration/app-browser.cjs'));
const demoServer = require('./demo-server.cjs');
const spellPayments = require(path.join(root, 'server/services/spellPayments'));
const { chromium } = require(path.join(root, 'vtt-react/node_modules/playwright'));

const scenario = JSON.parse(fs.readFileSync(path.join(__dirname, 'scenario-records.json'), 'utf8'));
const buildDir = process.env.APP_BUILD_DIR || 'D:\\AppData\\Temp\\opencode\\trigger-ui-release-build-20261116T1901Z\\build';
process.env.APP_BUILD_DIR = buildDir;
const outDir = process.env.DEMO_OUTPUT || path.join(__dirname, 'evidence', 'reload-step8');
fs.mkdirSync(outDir, { recursive: true });

const sha256 = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const report = {
  kind: 'frost-lantern-reload-step8-repro',
  buildDir,
  assetManifestSha256: sha256(path.join(buildDir, 'asset-manifest.json')),
  passed: false,
  diagnosis: null,
  steps: [],
  errors: []
};

async function until(check, label, tries = 120, interval = 200) {
  for (let i = 0; i < tries; i += 1) {
    const v = await check();
    if (v) return v;
    await new Promise(r => setTimeout(r, interval));
  }
  throw Error(`Timed out: ${label}`);
}

function resources(host, tokenId) {
  const token = host.room.gameState.maps[scenario.room.mapId].characterTokens[tokenId];
  return { hp: token.character.health.current, mana: token.character.mana.current, ap: token.character.actionPoints.current };
}

async function setupPage(page, host, uid, attachOwner = true) {
  page.on('pageerror', e => report.errors.push({ uid, message: e.message }));
  const goto = page.goto.bind(page);
  page.goto = async (...args) => {
    await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {});
    await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await page.unroute(/cdnjs\.cloudflare\.com/).catch(() => {});
    await page.route(/cdnjs\.cloudflare\.com/, r => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
    return goto(...args);
  };
  await baseSetup(page, host.url, uid);
  const pc = scenario.characters.find(c => c.ownerUid === uid);
  if (pc) {
    await page.evaluate(({ ref, pcData, attachOwner }) => {
      window.S('characterStore').setState({
        currentCharacterId: pcData.characterId, id: pcData.characterId, name: pcData.name,
        class: pcData.class, level: pcData.level, skillRanks: pcData.skillRanks || {}, stats: pcData.stats,
        classResource: { type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'], current: 3, max: 12 }
      });
      if (attachOwner) window.__actors.selectOwnerAttachment(ref);
    }, { ref: host.refs[pc.tokenId], pcData: pc, attachOwner });
    host.setPlayerCharacter(uid, { id: pc.characterId, name: pc.name, characterName: pc.name, class: pc.class });
  } else {
    await page.evaluate(() => {
      window.S('gameStore').setState({ isGMMode: true });
      window.S('characterStore').setState({ currentCharacterId: 'gm', id: 'gm', name: 'GM', class: 'Arcanoneer', level: 3 });
    });
  }
}

const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const castDialog = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
const tracker = p => p.getByRole('region', { name: 'Combat tracker', exact: true });

async function main() {
  const host = await demoServer.start({ seedCreatureRelationships: true });
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const gm = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
    const owner = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
    await setupPage(gm, host, 'demo-gm');
    await setupPage(owner, host, 'demo-owner', true);

    // Author & admit Demo Frost Grip
    await gm.keyboard.press('s');
    await book(gm).waitFor({ timeout: 20000 });
    const b = book(gm);
    const wizBtn = b.getByRole('button', { name: /Spell Wizard|Create New Spell/i }).first();
    if (await wizBtn.isVisible().catch(() => false)) await wizBtn.click();
    await b.getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(scenario.spells.componentWatchDamageParent.name);
    await b.getByRole('textbox', { name: 'Description * *', exact: true }).fill(scenario.spells.componentWatchDamageParent.description);
    await b.getByText('Arcane', { exact: true }).click();
    const nav = b.getByRole('navigation', { name: 'Spell wizard steps' });
    await nav.getByRole('button', { name: /Spell Type$/ }).click();
    await b.getByRole('heading', { name: 'ACTION', exact: true }).click();
    await b.getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
    await nav.getByRole('button', { name: /^3 Effects$/ }).click();
    await b.getByRole('heading', { name: 'Damage', exact: true }).click();
    await b.locator('.damage-effects-container').getByRole('textbox').first().fill('1d8+3');
    await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click();
    await b.getByText('Single Target', { exact: true }).first().click();
    await b.getByText('Ranged', { exact: true }).first().click();
    await b.getByText('Enemies', { exact: true }).click();
    await nav.getByRole('button', { name: /Resources$/ }).click();
    await b.getByTitle('Standard magical energy', { exact: true }).click();
    await b.getByTitle('Basic action economy', { exact: true }).click();
    await b.getByRole('spinbutton').nth(0).fill('2');
    await b.getByRole('spinbutton').nth(1).fill('1');
    await nav.getByRole('button', { name: /Review/i }).click();
    await b.locator('.finalize-btn').click({ force: true });
    await gm.waitForFunction(n => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(n)), scenario.spells.componentWatchDamageParent.name);
    await b.getByRole('button', { name: 'Spell Library', exact: true }).click();
    await b.getByText(scenario.spells.componentWatchDamageParent.name, { exact: true }).first().click();
    const adm = gm.getByRole('region', { name: `Room admission for ${scenario.spells.componentWatchDamageParent.name}`, exact: true });
    await adm.getByRole('button', { name: 'Admit this saved version', exact: true }).click();
    await adm.getByText(/Admitted/i).first().waitFor({ timeout: 15000 });
    await b.getByRole('button', { name: 'Close', exact: true }).first().press('Enter');
    await b.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
    report.steps.push('authored_and_admitted_spell');

    // Start combat
    await gm.locator('body').click({ position: { x: 700, y: 500 } });
    await gm.keyboard.press('x');
    const overlay = gm.locator('.combat-selection-window');
    await overlay.waitFor({ timeout: 20000 });
    for (const label of ['Ilse', 'Mira', 'Shade Stalker A', 'Shade Stalker B', 'Wounded Scout C']) {
      await overlay.locator('.discovery-item').filter({ hasText: label }).first().click();
    }
    await overlay.getByRole('button', { name: /^Begin Combat \(5\)$/i }).click();
    await until(() => host.room.gameState.combat?.isActive === true, 'combat started');
    report.steps.push('combat_started');

    // Reload owner WITHOUT selectOwnerAttachment (reproducing Step 7 -> Step 8)
    await setupPage(owner, host, 'demo-owner', false);
    const details = owner.locator('details.p9-admitted').first();
    await details.waitFor({ timeout: 20000 });
    if ((await details.getAttribute('open')) === null) await details.locator('summary').click();
    const region = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
    await region.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
    await region.locator('.p9-admitted-row').filter({ hasText: scenario.spells.componentWatchDamageParent.name }).first()
      .getByRole('button', { name: 'Use admitted ability', exact: true }).click();

    const dialog = castDialog(owner);
    await dialog.waitFor({ timeout: 20000 });
    const preAttachText = await dialog.innerText();
    const useAttachBtn = dialog.getByRole('button', { name: 'Use this owner attachment', exact: true });
    assert.equal(await useAttachBtn.isVisible(), true, 'Use this owner attachment button must be visible after reload without active attachment');
    assert.equal(await dialog.getByRole('combobox', { name: 'Target', exact: true }).count(), 0, 'Target combobox is intentionally hidden until owner attachment is selected');
    report.diagnosis = {
      cause: 'After browser reload with attachOwner=false, actorConsequenceService active attachment is null in the new tab; OwnerPanel shows source.error and the "Use this owner attachment" button instead of Target <select>.',
      preAttachPromptVisible: preAttachText.includes('Select your owner attachment')
    };
    report.steps.push('diagnosed_missing_target_after_reload');

    // Click Use this owner attachment -> select Target -> Approve -> leave pending -> End Combat -> Restart
    await useAttachBtn.click();
    const pTarget = dialog.getByRole('combobox', { name: 'Target', exact: true });
    await pTarget.waitFor({ timeout: 10000 });
    let aOpt = null;
    await until(async () => {
      const opts = await pTarget.locator('option').evaluateAll(n => n.map(o => ({ value: o.value, text: o.textContent })));
      aOpt = opts.find(o => o.text.includes('Shade Stalker A'));
      return !!aOpt;
    }, 'Shade Stalker A option present');
    await pTarget.selectOption(aOpt.value);
    await until(async () => {
      const retryBtn = dialog.getByRole('button', { name: 'Retry relationship check', exact: true });
      if (await retryBtn.isVisible().catch(() => false)) {
        await new Promise(r => setTimeout(r, 1100));
        await retryBtn.click().catch(() => {});
        return false;
      }
      const opts = await pTarget.locator('option').evaluateAll(n => n.map(o => ({ value: o.value, text: o.textContent })));
      const cur = opts.find(o => o.value === aOpt.value);
      return cur && !/checking|could not verify/i.test(cur.text);
    }, 'Target Shade Stalker A relationship verified', 30, 300);
    await dialog.locator('input[aria-label^="d"]').first().fill('3');
    await dialog.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    const approveBtn = dialog.getByRole('button', { name: /^Approve/ }).first();
    await until(() => approveBtn.isEnabled(), 'Approve button enabled', 30, 200).catch(async err => {
      console.log('DEBUG Step 8 dialog:', await dialog.innerText().catch(() => 'NONE'));
      throw err;
    });
    await approveBtn.click();
    await dialog.getByText(/Awaiting GM/).first().waitFor({ timeout: 20000 });

    const beforeEnd = resources(host, 'pc');
    assert.equal(spellPayments.listAll(host.room).length, 1, 'One approval pending before End Combat');
    await tracker(gm).getByRole('button', { name: 'End Combat', exact: true }).click();
    await until(() => !host.room.gameState.combat?.isActive, 'combat ended');
    await until(() => spellPayments.listAll(host.room).length === 0, 'pending approval closed on End Combat');
    assert.deepEqual(resources(host, 'pc'), beforeEnd, 'No resources spent when pending approval closed on End Combat');
    report.steps.push('pending_approval_closed_without_spending');

    await gm.locator('body').click({ position: { x: 700, y: 500 } });
    await gm.keyboard.press('x');
    await overlay.waitFor({ timeout: 20000 });
    for (const label of ['Ilse', 'Mira', 'Shade Stalker A', 'Shade Stalker B', 'Wounded Scout C']) {
      await overlay.locator('.discovery-item').filter({ hasText: label }).first().click();
    }
    await overlay.getByRole('button', { name: /^Begin Combat \(5\)$/i }).click();
    await until(() => host.room.gameState.combat?.isActive === true, 'combat restarted cleanly');
    assert.equal(spellPayments.listAll(host.room).length, 0, 'Zero leftover pending approvals after restart');
    report.steps.push('combat_restarted_cleanly');

    report.passed = report.errors.length === 0;
  } finally {
    if (browser) await browser.close().catch(() => {});
    await host.stop().catch(() => {});
    fs.writeFileSync(path.join(outDir, 'result.json'), JSON.stringify(report, null, 2));
    console.log(`Step 8 repro ${report.passed ? 'PASSED' : 'FAILED'} -> ${outDir}`);
    if (!report.passed) process.exitCode = 1;
  }
}

main().catch(err => {
  report.fatal = err.stack || err.message;
  fs.writeFileSync(path.join(outDir, 'result.json'), JSON.stringify(report, null, 2));
  console.error(err);
  process.exit(1);
});
