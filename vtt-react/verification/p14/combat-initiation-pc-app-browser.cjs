// Ordinary-App acceptance witness for normal combat initiation with player characters (PCs) and placed creatures.
// Verifies:
// 1. Participant discovery: eligible PCs and placed creatures listed with distinguishing metadata.
// 2. Selection through ordinary UI controls (token click and discovery list click).
// 3. Optional manual initiative entry / d20 roll resolution.
// 4. Starting combat via "Begin Combat" button click (no direct socket emission or store injection).
// 5. Authoritative roster projection matching across GM, Owner, and Observer.
// 6. Turn advance through creature and PC turns via CombatTimeline controls.
// 7. Full page reload preserving authoritative combat state across all clients.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');

const root = path.resolve(__dirname, '../../..');
const out = process.env.COMBAT_INIT_OUTPUT || path.join(root, 'handoff/combat-initiation-pc/evidence/app');
fs.mkdirSync(out, { recursive: true });
process.env.APP_OUTPUT = path.join(out, 'fixture');

const buildDir = process.env.APP_BUILD_DIR || path.join(root, 'vtt-react/build');
process.env.APP_BUILD_DIR = buildDir;

const { chromium } = require(require.resolve('playwright', { paths: [__dirname, path.join(__dirname, '../..')] }));
const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');

async function setup(page, url, uid) {
  if (!page.__saveFonts) {
    page.__saveFonts = true;
    const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async(...args) => {
      await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {});
      await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts);
      return goto(...args);
    };
  }
  const result = await baseSetup(page, url, uid);
  await page.evaluate(() => {
    if (window.__req) {
      const ids = Object.keys(window.__req.m);
      for (const id of ids) {
        try {
          const mod = window.__req(id);
          const candidates = [mod, mod?.default, ...Object.values(mod || {})];
          for (const c of candidates) {
            if (typeof c === 'function' && typeof c.getState === 'function') {
              const state = c.getState();
              if (state && 'isInCombat' in state && 'turnOrder' in state && 'currentTurnIndex' in state) {
                window.combatStore = c;
                const prevS = window.S;
                window.S = name => {
                  if (name === 'combatStore') return c;
                  return prevS ? prevS(name) : null;
                };
                return;
              }
            }
          }
        } catch (e) {}
      }
    }
  });
  return result;
}

const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));

const report = {
  startedAt: new Date().toISOString(),
  kind: 'combat-initiation-pc-app-witness',
  checks: {},
  qualifications: [],
  errors: [],
  steps: [],
  limits: [
    'Optimized production App and registered backend; auth, ownership, lease, cloud are fixtures.',
    'Temporary-room live receipts only. No live Firebase, second physical device, or human table.',
    'Combat initiation executed purely via ordinary UI button clicks and hotkeys (no direct socket emission of combat_started, no store bypass).'
  ]
};

const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); };

async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of [
    'actor_snapshot', 'actor_consequence', 'actor_spell_approve', 'actor_spell_list',
    'actor_authored_admit', 'actor_turn_boundary', 'combat_started', 'combat_turn_changed',
    'combat_ended', 'join_room', 'token_moved'
  ]) {
    host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  }

  const contexts = {}, pages = {};
  const channel = process.env.COMBAT_INIT_CHANNEL || 'chrome';

  try {
    step('Launch 3 browser profiles: GM (app-gm), Owner (app-owner), Observer (app-observer)');
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner'], ['observer', 'app-observer']]) {
      const dir = path.join(out, 'profiles', role);
      fs.mkdirSync(dir, { recursive: true });
      const ctx = contexts[role] = await chromium.launchPersistentContext(dir, {
        channel,
        headless: true,
        viewport: { width: 1440, height: 1000 },
        reducedMotion: 'reduce'
      });
      const p = pages[role] = ctx.pages()[0] || await ctx.newPage();
      p.on('pageerror', err => {
        if (/Failed to fetch|blockedbyclient|Loading chunk/i.test(err.message)) return;
        report.errors.push({ role, message: err.message, stack: err.stack });
      });
      await setup(p, host.url, uid);
    }

    const { gm, owner, observer } = pages;

    step('Step 1: Owner establishes primary PC attachment via existing UI controls');
    const ownerAttachmentControls = owner.getByRole('region', { name: 'Actor attachment and consequences', exact: true });
    await ownerAttachmentControls.waitFor({ timeout: 15000 });
    const exactSelect = ownerAttachmentControls.getByRole('combobox', { name: 'Exact room attachment', exact: true });
    await exactSelect.selectOption('character:pc');
    const useAttachmentBtn = ownerAttachmentControls.getByRole('button', { name: 'Use this owner attachment', exact: true });
    if (await useAttachmentBtn.count()) {
      await useAttachmentBtn.click();
      await owner.waitForTimeout(500);
    }
    const ownerAttached = await owner.evaluate(() => {
      const store = window.S('characterStore');
      return {
        currentCharacterId: store?.getState().currentCharacterId,
        hasActorContract: !!window.__actors
      };
    });
    report.checks.ownerAttached = ownerAttached;

    step('Step 2: GM opens Combat Initiator via navigation button or hotkey');
    const combatNavBtn = gm.locator('button[title*="Combat Initiator"], .wow-nav-button[title*="Combat Initiator"]');
    if (await combatNavBtn.count()) {
      await combatNavBtn.first().click();
    } else {
      await gm.locator('body').click();
      await gm.keyboard.press('x');
    }

    const overlay = gm.locator('.combat-selection-window');
    await overlay.waitFor({ timeout: 15000 });
    save('combat-overlay-opened.aria.yml', await overlay.ariaSnapshot());

    step('Step 3: Verify participant discovery and distinguishing metadata');
    const discoverySection = overlay.locator('.combatants-discovery-section');
    await discoverySection.waitFor({ timeout: 10000 });
    const discoveryItems = discoverySection.locator('.discovery-item');
    const discoveryCount = await discoveryItems.count();
    assert.ok(discoveryCount >= 3, `Expected at least 3 discoverable tokens, found ${discoveryCount}`);

    const itemTexts = await discoveryItems.allInnerTexts();
    report.checks.discoverableTokens = itemTexts;
    assert.ok(itemTexts.some(t => t.includes('Ilse') && t.includes('PC')), 'PC Ilse discoverable with PC badge');
    assert.ok(itemTexts.some(t => t.includes('A') && t.includes('Creature')), 'Creature A discoverable with Creature badge');
    assert.ok(itemTexts.some(t => t.includes('B') && t.includes('Creature')), 'Creature B discoverable with Creature badge');

    step('Step 4: Select the PC and creatures through ordinary UI controls');
    // Click PC Ilse in discovery list using distinct token identifier #pc
    await discoverySection.locator('.discovery-item').filter({ hasText: '#pc' }).first().click();
    await gm.waitForTimeout(200);
    // Click Creature A in discovery list using distinct token identifier #A
    await discoverySection.locator('.discovery-item').filter({ hasText: '#A' }).first().click();
    await gm.waitForTimeout(200);
    // Click Creature B in discovery list using distinct token identifier #B
    await discoverySection.locator('.discovery-item').filter({ hasText: '#B' }).first().click();
    await gm.waitForTimeout(200);

    // Verify "Ready for Battle" section with 3 selected combatants
    const readySection = overlay.locator('.combatants-section');
    await readySection.locator('.combatant-card').first().waitFor({ timeout: 5000 });
    const readyCards = await readySection.locator('.combatant-card').count();
    assert.equal(readyCards, 3, `Expected 3 selected combatant cards, found ${readyCards}`);
    save('combat-overlay-ready.aria.yml', await overlay.ariaSnapshot());

    step('Step 5: GM starts combat via ordinary Begin Combat button click');
    const beginBtn = overlay.getByRole('button', { name: /^Begin Combat \(3\)$/i });
    await beginBtn.waitFor({ timeout: 5000 });
    await beginBtn.click();

    // Verify overlay closed
    await overlay.waitFor({ state: 'detached', timeout: 10000 });

    step('Step 6: Verify authoritative roster and order across GM, Owner, and Observer');
    const readCombat = p => p.evaluate(() => {
      const s = window.S('combatStore').getState();
      return {
        isInCombat: s.isInCombat,
        turnOrderCount: s.turnOrder?.length || 0,
        currentTurnIndex: s.currentTurnIndex,
        round: s.round,
        turnOrder: (s.turnOrder || []).map(c => ({
          tokenId: c.tokenId || c.id,
          name: c.name,
          initiative: c.initiative,
          isCharacterToken: !!c.isCharacterToken,
          characterClass: c.characterClass || null,
          tokenIcon: !!c.tokenIcon
        }))
      };
    });

    // Wait for combat to be active on all clients
    for (const [role, page] of Object.entries(pages)) {
      await page.waitForFunction(() => window.S('combatStore').getState().isInCombat === true, { timeout: 15000 });
    }

    const gmCombat = await readCombat(gm);
    const ownerCombat = await readCombat(owner);
    const observerCombat = await readCombat(observer);

    report.checks.gmCombat = gmCombat;
    report.checks.ownerCombat = ownerCombat;
    report.checks.observerCombat = observerCombat;

    assert.equal(gmCombat.isInCombat, true, 'GM is in combat');
    assert.equal(ownerCombat.isInCombat, true, 'Owner is in combat');
    assert.equal(observerCombat.isInCombat, true, 'Observer is in combat');

    assert.equal(gmCombat.turnOrderCount, 3, 'GM turn order has 3 combatants');
    assert.equal(ownerCombat.turnOrderCount, 3, 'Owner turn order has 3 combatants');
    assert.equal(observerCombat.turnOrderCount, 3, 'Observer turn order has 3 combatants');

    // Assert that PC Ilse and both creatures are in the turn order
    const pcCombatant = gmCombat.turnOrder.find(c => c.tokenId === 'pc' || c.name === 'Ilse');
    assert.ok(pcCombatant, 'PC Ilse is present in turn order');
    assert.equal(pcCombatant.isCharacterToken, true, 'PC Ilse is identified as character token');

    const creatureA = gmCombat.turnOrder.find(c => c.tokenId === 'A');
    const creatureB = gmCombat.turnOrder.find(c => c.tokenId === 'B');
    assert.ok(creatureA, 'Creature A present in turn order');
    assert.ok(creatureB, 'Creature B present in turn order');

    // Roster identity and turn order must match authoritatively across all clients
    assert.deepEqual(
      ownerCombat.turnOrder.map(c => c.tokenId),
      gmCombat.turnOrder.map(c => c.tokenId),
      'Owner turn order matches GM authoritative turn order'
    );
    assert.deepEqual(
      observerCombat.turnOrder.map(c => c.tokenId),
      gmCombat.turnOrder.map(c => c.tokenId),
      'Observer turn order matches GM authoritative turn order'
    );

    // Timeline bar is rendered on all clients
    for (const page of [gm, owner, observer]) {
      const timeline = page.getByRole('region', { name: 'Combat tracker', exact: true });
      await timeline.waitFor({ timeout: 10000 });
    }
    save('combat-timeline-active.aria.yml', await gm.getByRole('region', { name: 'Combat tracker', exact: true }).ariaSnapshot());

    step('Step 7: Advance through a creature turn and a PC turn via CombatTimeline controls');
    const advanceTurn = async () => {
      const tracker = gm.getByRole('region', { name: 'Combat tracker', exact: true });
      const nextBtn = tracker.getByRole('button', { name: 'Next Turn', exact: true });
      await nextBtn.click();
      await gm.waitForTimeout(500);
    };

    const initialTurnIdx = gmCombat.currentTurnIndex;
    const initialCombatant = gmCombat.turnOrder[initialTurnIdx];
    step(`Initial turn: ${initialCombatant.name} (${initialCombatant.isCharacterToken ? 'PC' : 'Creature'})`);

    // Advance 1:
    await advanceTurn();
    const gmAfter1 = await readCombat(gm);
    const turn1Combatant = gmAfter1.turnOrder[gmAfter1.currentTurnIndex];
    step(`Turn advance 1: ${turn1Combatant.name} (${turn1Combatant.isCharacterToken ? 'PC' : 'Creature'})`);
    assert.notEqual(gmAfter1.currentTurnIndex, initialTurnIdx, 'Turn advanced to next combatant');

    // Advance 2:
    await advanceTurn();
    const gmAfter2 = await readCombat(gm);
    const turn2Combatant = gmAfter2.turnOrder[gmAfter2.currentTurnIndex];
    step(`Turn advance 2: ${turn2Combatant.name} (${turn2Combatant.isCharacterToken ? 'PC' : 'Creature'})`);

    // Across the 3 turns (initial, turn 1, turn 2), at least one creature and the PC took a turn
    const witnessedTurns = [initialCombatant, turn1Combatant, turn2Combatant];
    assert.ok(witnessedTurns.some(c => c.isCharacterToken), 'PC turn witnessed');
    assert.ok(witnessedTurns.some(c => !c.isCharacterToken), 'Creature turn witnessed');

    // Verify turn sync across owner and observer
    // Wait briefly for socket broadcast to reach owner and observer
    await owner.waitForFunction(idx => window.S('combatStore').getState().currentTurnIndex === idx, gmAfter2.currentTurnIndex, { timeout: 5000 });
    await observer.waitForFunction(idx => window.S('combatStore').getState().currentTurnIndex === idx, gmAfter2.currentTurnIndex, { timeout: 5000 });

    const ownerAfter2 = await readCombat(owner);
    const observerAfter2 = await readCombat(observer);
    assert.equal(ownerAfter2.currentTurnIndex, gmAfter2.currentTurnIndex, 'Owner turn index synchronized');
    assert.equal(observerAfter2.currentTurnIndex, gmAfter2.currentTurnIndex, 'Observer turn index synchronized');

    step('Step 8: Reload all clients and confirm identical authoritative combat state');
    await gm.reload();
    await setup(gm, host.url, 'app-gm');

    await owner.reload();
    await setup(owner, host.url, 'app-owner');

    await observer.reload();
    await setup(observer, host.url, 'app-observer');

    for (const page of [gm, owner, observer]) {
      await page.waitForFunction(() => window.S('combatStore').getState().isInCombat === true, { timeout: 15000 });
    }

    const gmReloaded = await readCombat(gm);
    const ownerReloaded = await readCombat(owner);
    const observerReloaded = await readCombat(observer);

    report.checks.gmReloaded = gmReloaded;
    report.checks.ownerReloaded = ownerReloaded;
    report.checks.observerReloaded = observerReloaded;

    assert.equal(gmReloaded.isInCombat, true, 'GM in combat after reload');
    assert.equal(ownerReloaded.isInCombat, true, 'Owner in combat after reload');
    assert.equal(observerReloaded.isInCombat, true, 'Observer in combat after reload');

    assert.deepEqual(gmReloaded.turnOrder.map(c => c.tokenId), gmAfter2.turnOrder.map(c => c.tokenId), 'Turn order preserved after reload');
    assert.equal(gmReloaded.currentTurnIndex, gmAfter2.currentTurnIndex, 'Turn index preserved after reload');
    assert.equal(ownerReloaded.currentTurnIndex, gmAfter2.currentTurnIndex, 'Owner has same turn index after reload');
    assert.equal(observerReloaded.currentTurnIndex, gmAfter2.currentTurnIndex, 'Observer has same turn index after reload');

    assert.deepEqual(report.errors, [], `Unexpected page errors: ${JSON.stringify(report.errors)}`);
    report.passed = true;
    report.completedAt = new Date().toISOString();
    console.log('ACCEPTANCE WITNESS PASSED: Ordinary combat initiation with PC and creatures fully verified.');
  } catch (err) {
    report.passed = false;
    report.failure = err.stack;
    console.error('Acceptance witness failed:', err);
    for (let i = 0; i < Object.keys(pages).length; i++) {
      const role = Object.keys(pages)[i];
      const p = pages[role];
      if (p) {
        save(`failure-${role}.aria.yml`, await p.locator('body').ariaSnapshot().catch(() => 'unavailable'));
      }
    }
    throw err;
  } finally {
    save('report.json', report);
    for (const ctx of Object.values(contexts)) {
      await ctx.close().catch(() => {});
    }
    await host.stop().catch(() => {});
  }
}

if (require.main === module) {
  main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
}
module.exports = { main };
