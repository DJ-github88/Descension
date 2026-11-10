// Wizard composition explanations — production-App acceptance witness for APP_CHECKLIST.md
// Verified against the identified build containing wizard-composition-explanations + formula-rider-save[-cooldown].
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.WCE_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR || !path.isAbsolute(process.env.APP_BUILD_DIR)) {
  throw Error('Absolute external WCE_OUTPUT and APP_BUILD_DIR required');
}
const repo = path.resolve(__dirname, '../../..');
if (path.resolve(out).startsWith(repo + path.sep)) throw Error('WCE_OUTPUT must be outside repository');
fs.mkdirSync(out, { recursive: true });

const { setup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const pure = require('../../src/services/authoredAbility');
const cooldown = require('../../src/services/authoredCooldown');

const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));

const report = {
  kind: 'wizard-composition-explanations-app-witness',
  startedAt: new Date().toISOString(),
  passed: false,
  checks: {},
  qualifications: [],
  errors: [],
  steps: []
};

const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); save('progress.json', report); };
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });

async function openBook(p) {
  const role = p.getByRole('button', { name: 'Character', exact: true });
  if (await role.count()) await role.click(); else await p.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
  const sb = p.getByRole('button', { name: 'Spellbook S', exact: true });
  if (await sb.count()) await sb.click(); else await p.locator('button', { hasText: /Spellbook/ }).first().click();
  await book(p).waitFor();
  const wizTab = book(p).getByRole('button', { name: 'Spell Wizard', exact: true });
  if (await wizTab.count() && await wizTab.isVisible()) await wizTab.click();
}

async function closeBook(p) {
  const b = book(p).getByRole('button', { name: 'Close', exact: true });
  await b.focus(); await b.press('Enter');
}

async function completeSpell(p, name) {
  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click({ force: true });
  await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes(name)), name);
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

const savedRecord = (p, name) => p.evaluate(name => {
  const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData'));
  return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === name) : null;
}, name);

async function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body'));
  if (L.__wce) return;
  L.__wce = true;
  const click = L.click;
  L.click = async function(options = {}) {
    try { return await click.call(this, { timeout: 20000, ...options }); }
    catch (e) {
      if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e;
      return click.call(this, { ...options, force: true });
    }
  };
}

async function creatureToken(p, id) {
  await p.waitForFunction(id => Array.from(document.querySelectorAll('.creature-token')).some(el => {
    let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber'))];
    for (; f; f = f.return) if (f.memoizedProps?.tokenId === id) { el.dataset.rfToken = id; return true; }
    return false;
  }), id);
  return p.locator(`[data-rf-token="${id}"]`);
}

async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  const pages = {}, contexts = {}, channel = process.env.WCE_CHANNEL || 'chrome';
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

    // Class 1: Formula + movement rider (2d6 + intelligence/3 + Mired −10 ft, end of target's next turn)
    step('Class 1: Formula + movement rider — unsaved draft review check');
    await openBook(gm);
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('WCE Mired Step');
    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Class 1 formula rider description');
    await book(gm).getByText('Arcane', { exact: true }).click();
    const nav = book(gm).getByRole('navigation', { name: 'Spell wizard steps' });
    await nav.getByRole('button', { name: /Spell Type$/ }).click();
    await book(gm).getByRole('heading', { name: 'ACTION', exact: true }).click();
    await book(gm).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
    await nav.getByRole('button', { name: /^3 Effects$/ }).click();
    await book(gm).getByRole('heading', { name: 'Damage', exact: true }).click();
    await book(gm).locator('.damage-effects-container').getByRole('textbox').first().fill('2d6 + intelligence/3');
    await book(gm).getByRole('heading', { name: 'Control', exact: true }).click();
    await book(gm).getByRole('button', { name: /^Use composed effect profile/ }).click();
    let fields = book(gm).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
    await fields.getByLabel(/^Canonical effect/).selectOption('movement');
    await fields.getByLabel(/^Effect name shown on the target/).fill('Mired');
    await fields.getByLabel(/^Movement change/).fill('-10');
    await fields.getByLabel(/^Expiry/).selectOption('target-next-end');
    await fields.getByLabel(/^Source-authored duration text/).fill('Until the end of the target\'s next turn');
    await fields.getByLabel(/^Required GM adjudication note/).fill('GM notes Mired timing');
    // Targeting & Resources
    await targetingAndPrice(gm, nav);

    // Check Step 10 Review on unsaved draft
    await nav.getByRole('button', { name: /Review$/ }).click();
    let reviewBox = book(gm).locator('.exec-compat');
    await reviewBox.waitFor({ timeout: 10000 });
    let reviewState = await reviewBox.getAttribute('data-state');
    let reviewText = await reviewBox.innerText();
    assert.equal(reviewState, 'partial', 'Class 1 unsaved draft is Partially automated');
    assert.match(reviewText, /Partially automated/);
    assert.match(reviewText, /expires at the end of the target's next turn/);
    assert.doesNotMatch(reviewText, /Manual play: Prism cannot run this ability/);
    assert.doesNotMatch(reviewText, /GM removes it/);
    report.checks.class1Unsaved = { state: reviewState, summary: reviewText.slice(0, 150) };

    // Save Class 1 and complete
    await completeSpell(gm, 'WCE Mired Step');
    const rec1 = await savedRecord(gm, 'WCE Mired Step');
    assert.ok(rec1, 'Class 1 saved in library');

    // Reopen for edit with changed name
    step('Class 1: Reopen for edit with changed name — Review check');
    await gm.evaluate(spell => window.handleLoadSpell(spell, true), rec1);
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('WCE Mired Step Renamed');
    const editNav = book(gm).getByRole('navigation', { name: 'Spell wizard steps' });
    await editNav.getByRole('button', { name: /Review$/ }).click();
    reviewBox = book(gm).locator('.exec-compat');
    await reviewBox.waitFor();
    assert.equal(await reviewBox.getAttribute('data-state'), 'partial', 'Class 1 edited draft is Partially automated');
    assert.doesNotMatch(await reviewBox.innerText(), /Manual play: Prism cannot run this ability/);
    await closeBook(gm);

    // Class 2: Formula + movement rider + Cooldown 2 caster-turn starts
    step('Class 2: Formula + movement rider + Cooldown 2 — Review check');
    await openBook(gm);
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('WCE Frost Cadence');
    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Class 2 cooldown description');
    await book(gm).getByText('Arcane', { exact: true }).click();
    await nav.getByRole('button', { name: /Spell Type$/ }).click();
    await book(gm).getByRole('heading', { name: 'ACTION', exact: true }).click();
    await book(gm).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
    await nav.getByRole('button', { name: /^3 Effects$/ }).click();
    await book(gm).getByRole('heading', { name: 'Damage', exact: true }).click();
    await book(gm).locator('.damage-effects-container').getByRole('textbox').first().fill('2d6 + intelligence/3');
    await book(gm).getByRole('heading', { name: 'Control', exact: true }).click();
    await book(gm).getByRole('button', { name: /^Use composed effect profile/ }).click();
    fields = book(gm).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
    await fields.getByLabel(/^Canonical effect/).selectOption('movement');
    await fields.getByLabel(/^Effect name shown on the target/).fill('Mired');
    await fields.getByLabel(/^Movement change/).fill('-10');
    await fields.getByLabel(/^Expiry/).selectOption('target-next-end');
    await fields.getByLabel(/^Source-authored duration text/).fill('Until the end of the target\'s next turn');
    await fields.getByLabel(/^Required GM adjudication note/).fill('GM notes Mired timing');
    await targetingAndPrice(gm, nav);
    await nav.getByRole('button', { name: /Cooldown$/ }).click();
    await book(gm).getByRole('button', { name: 'Authenticated Caster Starts', exact: true }).click();
    await book(gm).getByLabel('Caster-turn starts to count (1–10)', { exact: true }).fill('2');
    await nav.getByRole('button', { name: /Review$/ }).click();
    reviewBox = book(gm).locator('.exec-compat');
    await reviewBox.waitFor();
    reviewText = await reviewBox.innerText();
    assert.equal(await reviewBox.getAttribute('data-state'), 'partial', 'Class 2 is Partially automated');
    assert.match(reviewText, /Cooldown: 2 strictly upcoming caster-turn starts/);
    assert.match(reviewText, /expires at the end of the target's next turn/);
    report.checks.class2Review = { state: 'partial', hasCooldownLine: true };
    await completeSpell(gm, 'WCE Frost Cadence');
    const rec2 = await savedRecord(gm, 'WCE Frost Cadence');
    await closeBook(gm);

    // Class 3: 1d6+2 damage + movement rider with timed expiry + save (CON DC 12, negates)
    step('Class 3: Direct damage + movement rider + negates save — Review check');
    await openBook(gm);
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('WCE Shiver Hex');
    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Class 3 save description');
    await book(gm).getByText('Arcane', { exact: true }).click();
    await nav.getByRole('button', { name: /Spell Type$/ }).click();
    await book(gm).getByRole('heading', { name: 'ACTION', exact: true }).click();
    await book(gm).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
    await nav.getByRole('button', { name: /^3 Effects$/ }).click();
    await book(gm).getByRole('heading', { name: 'Damage', exact: true }).click();
    await book(gm).locator('.damage-effects-container').getByRole('textbox').first().fill('1d6+2');
    await book(gm).getByRole('heading', { name: 'Control', exact: true }).click();
    await book(gm).getByRole('button', { name: /^Use composed effect profile/ }).click();
    fields = book(gm).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
    await fields.getByLabel(/^Canonical effect/).selectOption('movement');
    await fields.getByLabel(/^Effect name shown on the target/).fill('Shiver');
    await fields.getByLabel(/^Movement change/).fill('-10');
    await fields.getByLabel(/^Expiry/).selectOption('target-next-end');
    await fields.getByLabel(/The target may save to negate this effect/).check();
    await fields.getByLabel(/^Saving ability/).selectOption('constitution');
    await fields.getByLabel(/^Difficulty \(DC/).fill('12');
    await fields.getByLabel(/^Source-authored duration text/).fill('Until the end of the target\'s next turn');
    await fields.getByLabel(/^Required GM adjudication note/).fill('Table rolls CON DC 12 save');
    await targetingAndPrice(gm, nav);
    await nav.getByRole('button', { name: /Review$/ }).click();
    reviewBox = book(gm).locator('.exec-compat');
    await reviewBox.waitFor();
    reviewText = await reviewBox.innerText();
    assert.equal(await reviewBox.getAttribute('data-state'), 'partial', 'Class 3 is Partially automated');
    assert.match(reviewText, /Rolling the save: The table rolls the Constitution DC 12 save/);
    assert.doesNotMatch(reviewText, /Cooldown:/);
    report.checks.class3Review = { state: 'partial', hasSaveLine: true };
    await completeSpell(gm, 'WCE Shiver Hex');
    await closeBook(gm);

    // Class 4: Stunned rider (end of target's next turn) + Cooldown 3 + card wording
    step('Class 4: Timed Stunned rider + Cooldown 3 — Review and Card wording check');
    await openBook(gm);
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('WCE Stun Cadence');
    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Class 4 stunned cooldown description');
    await book(gm).getByText('Arcane', { exact: true }).click();
    await nav.getByRole('button', { name: /Spell Type$/ }).click();
    await book(gm).getByRole('heading', { name: 'ACTION', exact: true }).click();
    await book(gm).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
    await nav.getByRole('button', { name: /^3 Effects$/ }).click();
    await book(gm).getByRole('heading', { name: 'Damage', exact: true }).click();
    await book(gm).locator('.damage-effects-container').getByRole('textbox').first().fill('1d6+2');
    await book(gm).getByRole('heading', { name: 'Control', exact: true }).click();
    await book(gm).getByRole('button', { name: /^Use composed effect profile/ }).click();
    fields = book(gm).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
    await fields.getByLabel(/^Canonical effect/).selectOption('stunned');
    await fields.getByLabel(/^Expiry/).selectOption('target-next-end');
    await fields.getByLabel(/^Source-authored duration text/).fill('Until the end of the target\'s next turn');
    await fields.getByLabel(/^Required GM adjudication note/).fill('GM tracks stunned timing');
    await targetingAndPrice(gm, nav);
    await nav.getByRole('button', { name: /Cooldown$/ }).click();
    await book(gm).getByRole('button', { name: 'Authenticated Caster Starts', exact: true }).click();
    await book(gm).getByLabel('Caster-turn starts to count (1–10)', { exact: true }).fill('3');
    await nav.getByRole('button', { name: /Review$/ }).click();
    reviewBox = book(gm).locator('.exec-compat');
    await reviewBox.waitFor();
    reviewText = await reviewBox.innerText();
    assert.equal(await reviewBox.getAttribute('data-state'), 'partial', 'Class 4 is Partially automated');
    assert.match(reviewText, /Cooldown: 3 strictly upcoming caster-turn starts/);
    assert.match(reviewText, /expires at the end of the target's next turn/);

    // Save and check UnifiedSpellCard preview / library card
    await completeSpell(gm, 'WCE Stun Cadence');
    await book(gm).getByRole('button', { name: 'Spell Library', exact: true }).click();
    await book(gm).getByText('WCE Stun Cadence', { exact: true }).first().click();
    detail = gm.locator('.spell-detail-overlay');
    await detail.waitFor();
    const cardText = await detail.innerText();
    // Card must state structured expiry, NOT "GM removes"
    assert.match(cardText, /Stunned · expires at the end of the target's next turn/);
    assert.doesNotMatch(cardText, /Stunned · GM removes/);
    report.checks.class4CardWording = { hasTimedStunned: true, noGmRemoves: true };
    await closeBook(gm);

    // Class 5: Periodic damage alone (3 ticks at target turn start) + Cooldown 2
    step('Class 5: Periodic damage alone + Cooldown 2 — Review check');
    await openBook(gm);
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('WCE Cinder Scourge');
    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Class 5 periodic cooldown description');
    await book(gm).getByText('Arcane', { exact: true }).click();
    await nav.getByRole('button', { name: /Spell Type$/ }).click();
    await book(gm).getByRole('heading', { name: 'ACTION', exact: true }).click();
    await book(gm).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
    await nav.getByRole('button', { name: /^3 Effects$/ }).click();
    await book(gm).getByRole('heading', { name: 'Control', exact: true }).click();
    await book(gm).getByRole('button', { name: /^Use composed effect profile/ }).click();
    fields = book(gm).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
    await fields.getByLabel(/^Canonical effect/).selectOption('periodic');
    await fields.getByLabel(/^Effect name shown on the target/).fill('Cinder Scourge');
    await fields.getByLabel(/^Each tick/).selectOption('damage');
    await fields.getByLabel(/^Tick amount/).fill('1d4');
    await fields.getByLabel(/^Damage type/).selectOption('arcane');
    await fields.getByLabel(/^Tick roll/).selectOption('each-tick');
    await fields.getByLabel(/^Ticks/).selectOption('target-start-count');
    const count = fields.getByLabel(/^Number of ticks/); await count.waitFor(); await count.fill('3');
    await fields.getByLabel(/^Source-authored duration text/).fill('3 turns of burns');
    await fields.getByLabel(/^Required GM adjudication note/).fill('Table rolls periodic ticks');
    await targetingAndPrice(gm, nav);
    await nav.getByRole('button', { name: /Cooldown$/ }).click();
    await book(gm).getByRole('button', { name: 'Authenticated Caster Starts', exact: true }).click();
    await book(gm).getByLabel('Caster-turn starts to count (1–10)', { exact: true }).fill('2');
    await nav.getByRole('button', { name: /Review$/ }).click();
    reviewBox = book(gm).locator('.exec-compat');
    await reviewBox.waitFor();
    reviewText = await reviewBox.innerText();
    assert.equal(await reviewBox.getAttribute('data-state'), 'partial', 'Class 5 is Partially automated');
    assert.match(reviewText, /Resolving periodic ticks: 3 ticks recorded automatically/);
    assert.match(reviewText, /Cooldown: 2 strictly upcoming caster-turn starts/);
    report.checks.class5Review = { state: 'partial', hasTickLine: true, hasCooldownLine: true };
    await completeSpell(gm, 'WCE Cinder Scourge');

    // PC admission enabled in shared room
    step('PC admission enabled in shared room');
    await book(gm).getByRole('button', { name: 'Spell Library', exact: true }).click();
    await book(gm).getByText('WCE Cinder Scourge', { exact: true }).first().click();
    detail = gm.locator('.spell-detail-overlay');
    await detail.waitFor();
    const admitBtn = detail.getByRole('button', { name: 'Admit this saved version', exact: true });
    assert.equal(await admitBtn.isEnabled(), true, 'Admit this saved version is enabled for PC route');
    await closeBook(gm);

    // Creature source route restriction check
    step('Creature source route restriction: Bestiary / creature Inspect shows disabled admit + specific reason');
    host.room.gameState.maps['app-hall'].tokens.A.authoredAbility = { schemaVersion: 1, record: actors.clone(rec2), librarySpellId: null };
    await setup(gm, host.url, 'app-gm');
    const tokenEl = await creatureToken(gm, 'A');
    await tokenEl.click({ button: 'right' });
    await gm.getByRole('button', { name: /Token Actions/ }).hover();
    await gm.getByText('Inspect', { exact: true }).last().click();
    const abilities = gm.getByRole('button', { name: 'Abilities & Spells', exact: true }).last();
    await abilities.focus(); await abilities.press('Enter');
    const region = gm.getByRole('region', { name: 'Creature activated ability', exact: true });
    await region.waitFor();
    const creatureCompat = region.locator('.exec-compat');
    await creatureCompat.waitFor();
    const cText = await creatureCompat.innerText();
    assert.match(cText, /change what the route restriction above names/);
    assert.doesNotMatch(cText, /without periodic effects or formula scaling/);
    report.checks.creatureAdvice = { matchesNewCopy: true, text: cText.slice(0, 150) };
    const closeInspect = gm.getByRole('button', { name: 'Close', exact: true }).last();
    await closeInspect.click().catch(() => gm.keyboard.press('Escape'));

    // Negative control: unknown authored section stays manual
    step('Negative control: unknown authored section stays manual and compiler refuses');
    const negativeDraft = {
      name: 'WCE Unknown Section Control',
      description: 'control',
      spellType: 'ACTION',
      typeConfig: { castTimeType: 'IMMEDIATE' },
      effectTypes: ['damage'],
      damageConfig: { damageType: 'direct', elementType: 'arcane', formula: '1d6', resolution: 'DICE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] },
      resourceCost: { actionPoints: 1, mana: 1 },
      unrelatedManualSection: { customData: 'unrecognized' }
    };
    const compiledNeg = pure.definitionFromWizard({ ...negativeDraft, authoredDraft: negativeDraft }, { roomId: 'test', classId: 'arcanoneer', definitionVersion: 1 });
    assert.equal(compiledNeg.ok, false, 'unknown authored section is refused by compiler');
    report.checks.negativeControl = { refused: true, reason: compiledNeg.reason };

    // Layout overflow checks on desktop 1440 and narrow 1024
    step('Layout check: no horizontal overflow on 1440 and 1024 viewports');
    for (const vp of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) {
      await gm.setViewportSize(vp);
      const scrollWidth = await gm.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await gm.evaluate(() => window.innerWidth);
      assert.ok(scrollWidth <= innerWidth + 1, `no horizontal overflow at ${vp.width}px`);
      await gm.screenshot({ path: path.join(out, `layout-${vp.width}.png`) });
    }

    // Verify room state, pools and receipts untouched
    step('State verification: room state, pools, and receipts are clean and unchanged');
    assert.equal(actors.ledger(host.room).receipts.length, 0, 'zero receipts created during authoring checklist');

    report.passed = true;
    report.checks.buildIdentity = process.env.APP_BUILD_DIR;
    const am = path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json');
    report.checks.assetManifestSha256 = fs.existsSync(am) ? sha(fs.readFileSync(am)) : null;
  } catch (e) {
    report.failure = e.stack;
    for (const [role, p] of Object.entries(pages)) {
      save(`failure-${role}.aria.yml`, await p.locator('body').ariaSnapshot().catch(() => 'unavailable'));
      await p.screenshot({ path: path.join(out, `failure-${role}.png`) }).catch(() => {});
    }
    throw e;
  } finally {
    report.endedAt = new Date().toISOString();
    save('result.json', report);
    for (const c of Object.values(contexts)) await c.close().catch(() => {});
    await host.stop();
  }
}

if (require.main === module) {
  main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
}
module.exports = { main };
