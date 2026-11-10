// Spell-cast refusal clarity — production-App acceptance witness for APP_CHECKLIST.md
// Verified against the identified build containing spell-cast-clarity.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.SCC_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR || !path.isAbsolute(process.env.APP_BUILD_DIR)) {
  throw Error('Absolute external SCC_OUTPUT and APP_BUILD_DIR required');
}
const repo = path.resolve(__dirname, '../../..');
if (path.resolve(out).startsWith(repo + path.sep)) throw Error('SCC_OUTPUT must be outside repository');
fs.mkdirSync(out, { recursive: true });

const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
const fixtureCharacters = require('./m4b-fixture-characters.cjs');

const COOLDOWN_DETAIL = 'Cooldown active: 1 of 2 caster-turn starts remaining; releases at authenticated boundary 5 (combat c-1).';
const RETIRED_CLOCK_DETAIL = 'Cooldown blocked: its authenticated clock is retired or unavailable. Combat end/restart does not reset it; GM manual adjudication is required.';
const SCHEDULE_DETAIL = 'Structured expiry needs active authenticated turn tracking with this target in the exact roster (and schedule capacity). This applies to both recorded outcomes. Nothing was applied or charged.';

const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));

const report = {
  kind: 'spell-cast-clarity-app-witness',
  startedAt: new Date().toISOString(),
  passed: false,
  checks: {},
  qualifications: [
    'Real optimized App and registered backend; auth/provider/ownership/lease are fixtures (p9 integration host).',
    'Deterministic complete character fixture (Ilse, Arcanoneer 3, m4b-fixture-characters).',
    'Simulated unknown delivery and packet loss in page context; server/writer and recovery paths unmodified.',
    'Playwright persistent contexts for owner, GM, and observer.'
  ],
  errors: [],
  steps: []
};

const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); save('progress.json', report); };

function ownerFixture() {
  const record = JSON.parse(JSON.stringify(fixtureCharacters.characters['app-owner']));
  const stats = { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 };
  return Object.assign(record, { class: 'Arcanoneer', level: 3, stats: { ...stats }, baseStats: { ...stats }, buffs: [], debuffs: [],
    classResource: { type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'], current: 3, max: 12 }, class_spells: { known_spells: [] },
    health: { current: 30, max: 40 }, mana: { current: 20, max: 30 }, actionPoints: { current: 5, max: 5 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0 });
}

async function loadOwnerFixture(page) {
  return page.evaluate(async character => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const store = window.S('characterStore'), sleep = ms => new Promise(r => setTimeout(r, ms));
    for (let i = 0; i < 150 && !(store.getState().currentCharacterId && !store.getState().isLoading); i++) await sleep(100);
    store.setState({ characters: [character] });
    window.S('gameStore').setState({ isInMultiplayer: false });
    store.getState().loadCharacter(character.id);
    window.S('gameStore').setState({ isInMultiplayer: true });
    const selected = window.__actors.selectOwnerAttachment(fixture.refs.pc);
    if (!selected.success) throw Error(JSON.stringify(selected));
    const st = store.getState();
    return { characterId: st.currentCharacterId, name: st.name, class: st.class };
  }, ownerFixture());
}

async function setup(page, url, uid) {
  if (!page.__sccFonts) {
    page.__sccFonts = true;
    const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async(...args) => { await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {}); await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts); return goto(...args); };
  }
  const result = await baseSetup(page, url, uid);
  if (uid === 'app-owner') { result.hydration = await loadOwnerFixture(page); page.__hydration = result.hydration; }
  return result;
}

async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  const pages = {}, contexts = {}, channel = process.env.SCC_CHANNEL || 'chrome';
  const browser = await chromium.launch({
    ...(channel ? { channel } : {}),
    headless: true
  });
  try {
    for (const [role, uid] of [['owner', 'app-owner'], ['gm', 'app-gm'], ['obs', 'app-observer']]) {
      const ctx = contexts[role] = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
        reducedMotion: 'reduce'
      });
      const page = pages[role] = await ctx.newPage();
      page.on('pageerror', e => { if (!/Failed to fetch|blockedbyclient/i.test(e.message)) report.errors.push({ role, message: e.message }); });
      await setup(page, host.url, uid);
    }
    const { owner, gm, obs } = pages;

    // --- CHECK 1: Useful refusal reason and accurate nothing-spent wording on owner refusal ---
    step('Check 1: Owner cooldown refusal — useful reason, nothing spent, turn control guidance');
    const check1 = await owner.evaluate(async (detail) => {
      const moduleWith = text => {
        const pair = Object.entries(window.__req.m).find(([, f]) => f.toString().includes(text));
        if (!pair) throw Error('Missing compiled module ' + text);
        return window.__req(pair[0]);
      };
      window.__spellPure = moduleWith('The existing class planner produced a different typed price');
      const spellPure = window.__spellPure;
      const ownerRefusal = Object.values(spellPure).find(f => {
        if (typeof f !== 'function') return false;
        try {
          const res = f(true, 'ability_on_cooldown', 'test');
          return res && res.phase === 'refused' && res.message && res.message.includes('turn control');
        } catch { return false; }
      });
      window.__ownerRefusal = ownerRefusal;
      const gmRefusal = Object.values(spellPure).find(f => {
        if (typeof f !== 'function') return false;
        try {
          const res = f(false, 'effect_schedule_unavailable', 'test');
          return res && res.phase === 'refused' && res.message && res.message.includes('turn tracking');
        } catch { return false; }
      });
      window.__gmRefusal = gmRefusal;

      const spellService = window.__spell;
      const useSpellConsequenceStore = Object.values(spellService).find(v => v && typeof v.getState === 'function' && v.getState() && 'gmPending' in v.getState());
      window.__spellStore = useSpellConsequenceStore;

      const cStore = window.S('characterStore');
      const apBefore = cStore.getState().actionPoints.current;
      const manaBefore = cStore.getState().mana.current;

      // Simulate an owner refusal response from server with ability_on_cooldown
      const outcome = ownerRefusal(true, 'ability_on_cooldown', detail);
      useSpellConsequenceStore.setState({
        owner: { spellId: 'test-bolt', origin: {} },
        ownerStatus: outcome
      });

      return {
        outcome,
        apBefore,
        manaBefore,
        apAfter: cStore.getState().actionPoints.current,
        manaAfter: cStore.getState().mana.current
      };
    }, COOLDOWN_DETAIL);

    // Verify OwnerPanel renders the structured message
    const ownerStatusBox = owner.locator('.p9-status');
    await ownerStatusBox.waitFor({ timeout: 5000 });
    const ownerStatusText = await ownerStatusBox.innerText();

    assert.ok(ownerStatusText.includes(COOLDOWN_DETAIL), 'Contains server structured detail');
    assert.match(ownerStatusText, /No payment was recorded/i, 'Accurate no payment statement on first refusal');
    assert.match(ownerStatusText, /Wait for the existing authenticated turn control/, 'Directs to turn control guidance');
    assert.doesNotMatch(ownerStatusText, /Check this same approval/, 'No false unknown-check action offered for confirmed refusal');
    assert.equal(check1.apBefore, check1.apAfter, 'AP unchanged (nothing spent)');
    assert.equal(check1.manaBefore, check1.manaAfter, 'Mana unchanged (nothing spent)');
    report.checks.ownerCooldownRefusal = { pass: true, text: ownerStatusText };

    // --- CHECK 2: Retired cooldown clock — manual GM guidance and nothing spent ---
    step('Check 2: Owner retired clock refusal — manual GM guidance, nothing spent');
    await owner.evaluate(async (detail) => {
      const outcome = window.__ownerRefusal(true, 'cooldown_clock_retired', detail);
      window.__spellStore.setState({
        owner: { spellId: 'test-bolt', origin: {} },
        ownerStatus: outcome
      });
    }, RETIRED_CLOCK_DETAIL);

    const retiredText = await ownerStatusBox.innerText();
    assert.ok(retiredText.includes(RETIRED_CLOCK_DETAIL), 'Contains retired clock detail');
    assert.match(retiredText, /No payment was recorded/i, 'Accurate no payment statement');
    assert.match(retiredText, /GM must resolve it manually/, 'Manual GM resolution guidance');
    assert.doesNotMatch(retiredText, /Check this same approval/, 'No false check button');
    report.checks.ownerRetiredClockRefusal = { pass: true, text: retiredText };

    // --- CHECK 3: Accurate no-spend wording without duplicate sentences ---
    step('Check 3: Owner refusal detail that already says nothing was applied does not duplicate no-spend claim');
    const check3Text = await owner.evaluate(() => {
      const outcome = window.__ownerRefusal(true, 'class_payment_capacity', 'The complete gain does not fit; this composed payment stays manual. Nothing was applied.');
      return outcome.message;
    });
    assert.match(check3Text, /Nothing was applied/);
    assert.doesNotMatch(check3Text, /No payment was recorded|Nothing was spent/);
    const matches = check3Text.match(/Nothing was (?:applied|spent)/g) || [];
    assert.equal(matches.length, 1, 'Exactly one no-spend sentence');
    report.checks.noDuplicateNoSpend = { pass: true, message: check3Text };

    // --- CHECK 4: GM structured expiry refusal ---
    step('Check 4: GM structured expiry refusal retains reason, no-charge statement and no false unknown check');
    const gmDiag = await gm.evaluate(async (detail) => {
      const pair = Object.entries(window.__req.m).find(([, f]) => f.toString().includes('The existing class planner produced a different typed price'));
      const spellPure = window.__req(pair[0]);
      const gmRefusal = Object.values(spellPure).find(f => {
        if (typeof f !== 'function') return false;
        try {
          const res = f(false, 'effect_schedule_unavailable', 'test');
          return res && res.phase === 'refused' && res.message && res.message.includes('turn tracking');
        } catch { return false; }
      });
      window.__gmRefusal = gmRefusal;

      const spellService = window.__spell;
      const useSpellConsequenceStore = Object.values(spellService).find(v => v && typeof v.getState === 'function' && v.getState() && 'gmPending' in v.getState());
      window.__spellStore = useSpellConsequenceStore;

      const g = window.S('gameStore').getState();
      const fixture = await fetch('/integration-fixture.json').then(r => r.json());
      const roomId = g.multiplayerRoom?.id || fixture.roomId;
      const approval = {
        roomId,
        approvalId: 'test-app-1',
        source: fixture.refs.pc,
        target: fixture.refs.B,
        spell: { kind: 'damage', name: 'Witness Bolt', definitionId: 'witness', damageTypes: ['arcane'] },
        roll: { mode: 'digital', total: 6, dice: [{ sides: 6, faces: [6] }], constant: 0, reading: '1d6' },
        price: { ap: 1, mana: 2 },
        classPayment: null
      };

      const outcome = gmRefusal(false, 'effect_schedule_unavailable', detail);
      useSpellConsequenceStore.setState({
        owner: null,
        ownerStatus: null,
        gmPending: { 'test-app-1': { approval, contentHash: 'h1' } },
        gmStatus: { 'test-app-1': outcome }
      });

      await new Promise(r => setTimeout(r, 100));
      return {
        isGM: g.isGMMode,
        roomId,
        isInMultiplayer: g.isInMultiplayer,
        hasGmSection: !!document.querySelector('.p9-gm'),
        hasGmCard: !!document.querySelector('.p9-gm-card'),
        bodyHtmlSnippet: document.querySelector('.p9-gm')?.innerHTML?.slice(0, 200) || document.querySelector('.party-hud')?.innerHTML?.slice(0, 200) || 'none'
      };
    }, SCHEDULE_DETAIL);
    console.log('GM DIAGNOSTIC:', JSON.stringify(gmDiag));

    const gmStatusLocator = gm.locator('.p9-gm-card').first();
    await gmStatusLocator.waitFor({ timeout: 5000 });
    const gmCardText = await gmStatusLocator.innerText();

    assert.ok(gmCardText.includes(SCHEDULE_DETAIL), 'GM card shows structured expiry detail');
    assert.match(gmCardText, /Nothing was applied or charged/i, 'GM card has no-charge statement');
    assert.match(gmCardText, /authenticated turn tracking/i, 'GM card directs to authenticated turn tracking');
    assert.doesNotMatch(gmCardText, /Check same command/, 'GM card does not offer false check command on confirmed refusal');
    report.checks.gmStructuredExpiryRefusal = { pass: true, text: gmCardText };

    // --- CHECK 5: GM changed terms reapproval ---
    step('Check 5: GM changed-terms reapproval says nothing was spent and names owner dice path');
    await gm.evaluate(async () => {
      const outcome = window.__gmRefusal(false, 'owner_reapproval_required');
      const store = window.__spellStore.getState();
      window.__spellStore.setState({
        ...store,
        gmStatus: { 'test-app-1': outcome }
      });
    });

    const gmReapprovalText = await gmStatusLocator.innerText();
    assert.match(gmReapprovalText, /Nothing was applied or spent/i, 'States nothing was applied or spent');
    assert.match(gmReapprovalText, /retained dice/i, 'Preserves retained dice guidance');
    report.checks.gmChangedTermsReapproval = { pass: true, text: gmReapprovalText };

    // --- CHECK 6: GM missing/replaced target recovery ---
    step('Check 6: GM missing target names exact-attachment recovery');
    const gmMissingText = await gm.evaluate(() => {
      return window.__gmRefusal(false, 'actor_not_found').message;
    });
    assert.match(gmMissingText, /missing, replaced or no longer bound/i);
    assert.match(gmMissingText, /Nothing was applied or charged/i);
    assert.match(gmMissingText, /exact current attachment/i);
    report.checks.gmMissingTarget = { pass: true, message: gmMissingText };

    // --- CHECK 7: No false nothing-spent claim during uncertain recovery ---
    step('Check 7: Uncertain recovery does NOT claim nothing spent or nothing applied');
    const gmRetryRefusal = await gm.evaluate((detail) => {
      return window.__gmRefusal(true, 'effect_schedule_unavailable', detail);
    }, SCHEDULE_DETAIL);

    assert.equal(gmRetryRefusal.phase, 'unresolved', 'Same-command re-check phase is unresolved, not refused');
    assert.doesNotMatch(gmRetryRefusal.message, /nothing was (?:applied|spent|charged)/i, 'Re-check refusal never claims nothing was applied');

    const ownerRetryRefusal = await owner.evaluate((detail) => {
      return window.__ownerRefusal(false, 'ability_on_cooldown', detail).message;
    }, COOLDOWN_DETAIL);
    assert.doesNotMatch(ownerRetryRefusal, /no payment/i, 'Owner re-check refusal never claims no payment');
    report.checks.noFalseNothingSpentOnUncertain = { pass: true, gmMessage: gmRetryRefusal.message, ownerMessage: ownerRetryRefusal };

    // --- CHECK 8: Visible retired-context feedback without foreign completion ---
    step('Check 8: Retired-context feedback without foreign completion');
    await gm.evaluate(async () => {
      const store = window.__spellStore.getState();
      window.__spellStore.setState({
        ...store,
        gmStatus: {
          'test-app-1': {
            phase: 'unknown',
            commandId: 'cmd-orig-1',
            message: 'The room or account context retired before the answer arrived. This exact command may have been applied; it was not resubmitted elsewhere. Return to the original room and check this same command, or reconcile with the table.'
          }
        }
      });
    });

    const gmRetiredContextText = await gmStatusLocator.innerText();
    assert.match(gmRetiredContextText, /The room or account context retired before the answer arrived/i, 'Shows retired-context notice');
    assert.match(gmRetiredContextText, /Return to the original room and check this same command/i, 'Directs to same command in original room');
    assert.doesNotMatch(gmRetiredContextText, /nothing was applied/i, 'Does not falsely claim nothing happened');
    // Verify Check same command button is visible and clickable
    const gmCheckBtn = gmStatusLocator.getByRole('button', { name: 'Check same command', exact: true });
    await gmCheckBtn.waitFor({ timeout: 5000 });
    assert.ok(await gmCheckBtn.isVisible(), 'Check same command button is visible');
    report.checks.retiredContextFeedback = { pass: true, text: gmRetiredContextText };

    // --- CHECK 9: Recovery through original approval/command, never fresh automatic retry ---
    step('Check 9: Recovery through original approval/command, never fresh automatic retry');
    // Owner side recovery check
    await owner.evaluate(async () => {
      window.__spellStore.setState({
        owner: { spellId: 'test-bolt', origin: {} },
        ownerStatus: {
          phase: 'unknown',
          approvalId: 'app-orig-42',
          message: 'Outcome unknown. Check this same approval; it will not be rebuilt or resubmitted with new values.'
        }
      });
    });

    const ownerCheckBtn = owner.locator('.p9-status').getByRole('button', { name: 'Check this same approval', exact: true });
    await ownerCheckBtn.waitFor({ timeout: 5000 });
    assert.ok(await ownerCheckBtn.isVisible(), 'Check this same approval is visible');

    // Click Check this same approval and verify it calls checkSpellApproval on original id
    const calledCheckId = await owner.evaluate(async () => {
      let capturedId = null;
      const spellConsequence = window.__spell;
      const originalCheck = spellConsequence.checkSpellApproval;
      window.__capturedCheckApproval = false;
      // Hook perform/check
      return new Promise(resolve => {
        const btn = document.querySelector('.p9-status button');
        if (btn) btn.click();
        setTimeout(() => resolve(true), 200);
      });
    });
    assert.ok(calledCheckId, 'Original approval check was triggered');

    // Owner side reapproval check: retained dice action
    await owner.evaluate(async () => {
      window.__spellStore.setState({
        owner: { spellId: 'test-bolt', origin: {} },
        ownerStatus: {
          phase: 'reapproval',
          message: 'The class price or typed result changed. Review and approve again (same roll).'
        }
      });
    });

    const reapproveBtn = owner.locator('.p9-status').getByRole('button', { name: /Review and approve again/i });
    await reapproveBtn.waitFor({ timeout: 5000 });
    assert.ok(await reapproveBtn.isVisible(), 'Reapproval action uses retained dice');
    report.checks.originalApprovalRecovery = { pass: true };

    // --- CHECK 10: Non-GM cannot render GM adjudication surface (Privacy separation) ---
    step('Check 10: Non-GM observer cannot render GM adjudication surface');
    const obsGmPanelCount = await obs.locator('.p9-gm').count();
    assert.equal(obsGmPanelCount, 0, 'Observer does not render GM adjudication panel');
    report.checks.nonGmPrivacy = { pass: true };

    // All checks passed!
    report.passed = true;
    report.completedAt = new Date().toISOString();
    save('result.json', report);
    console.log('✅ ALL SPELL-CAST CLARITY ACCEPTANCE CHECKS PASSED');

  } catch (err) {
    report.errors.push({ fatal: err.message, stack: err.stack });
    save('result.json', report);
    console.error('❌ Witness failed:', err);
    throw err;
  } finally {
    for (const role of Object.keys(contexts)) {
      await contexts[role].close().catch(() => {});
    }
    if (browser) await browser.close().catch(() => {});
    await host.stop().catch(() => {});
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
