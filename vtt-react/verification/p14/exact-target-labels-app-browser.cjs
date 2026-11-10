// HEADQ exact target labels acceptance witness:
// Verifies same-name visible target disambiguation in ordinary App controls:
// 1. Two visible placed creatures with the exact same display name at different positions.
// 2. Open an admitted single-target Wizard-authored cast and click "Pick on map".
// 3. Confirm Preview target options distinguish both creatures by short token id and position.
// 4. Select the second same-named option and click "Use target"; confirm exact creature chosen.
// 5. Refusal check: remove selected creature; confirm selection clears without silent retargeting.

const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');
const preflight = require('../witness-preflight.cjs');
const PREFLIGHT = require('./exact-target-labels-preflight.cjs');

const out = process.env.TL_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR || !path.isAbsolute(process.env.APP_BUILD_DIR)) {
  throw Error('Absolute external TL_OUTPUT and APP_BUILD_DIR required');
}
const repo = path.resolve(__dirname, '../../..');
if (path.resolve(out).startsWith(repo + path.sep)) throw Error('TL_OUTPUT must be outside the repository');
fs.mkdirSync(out, { recursive: true });
process.env.APP_OUTPUT = path.join(out, 'fixture');

const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
const fixtureCharacters = require('./m4b-fixture-characters.cjs');
const pure = require('../../src/services/authoredAbility');

function ownerFixture() {
  const record = JSON.parse(JSON.stringify(fixtureCharacters.characters['app-owner']));
  const stats = { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 };
  return Object.assign(record, { class: 'Arcanoneer', level: 3, stats: { ...stats }, baseStats: { ...stats }, buffs: [], debuffs: [],
    classResource: { type: 'elementalSpheres', spheres: [], current: 0, max: 12 }, class_spells: { known_spells: [] },
    health: { current: 30, max: 40 }, mana: { current: 20, max: 30 }, actionPoints: { current: 5, max: 5 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0 });
}
async function loadOwnerFixture(page) {
  return page.evaluate(async character => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const store = window.S('characterStore'), sleep = ms => new Promise(r => setTimeout(r, ms));
    for (let i = 0; i < 150 && !(store.getState().currentCharacterId && !store.getState().isLoading); i++) await sleep(100);
    for (let stable = 0, last = null; stable < 5;) { const st = store.getState(), key = `${st.currentCharacterId}|${st.characters.length}|${!!st.isLoading}`; stable = key === last ? stable + 1 : 0; last = key; await sleep(100); }
    store.setState({ characters: [character] }); window.S('gameStore').setState({ isInMultiplayer: false }); store.getState().loadCharacter(character.id); window.S('gameStore').setState({ isInMultiplayer: true });
    const selected = window.__actors.selectOwnerAttachment(fixture.refs.pc); if (!selected.success) throw Error(JSON.stringify(selected));
    const st = store.getState(); return { characterId: st.currentCharacterId, storedINT: st.stats?.intelligence };
  }, ownerFixture());
}
async function setup(page, url, uid) {
  if (!page.__tlFonts) {
    page.__tlFonts = true; const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async(...args) => { await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {}); await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts); return goto(...args); };
  }
  const result = await baseSetup(page, url, uid);
  if (uid === 'app-owner') { result.hydration = await loadOwnerFixture(page); page.__hydration = result.hydration; }
  return result;
}

const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { kind: 'exact-target-labels-app-witness', startedAt: new Date().toISOString(), passed: false, checks: {}, qualifications: [], errors: [], steps: [], stages: {},
  limits: ['Real optimized App and registered backend; identity/provider/ownership/lease/cloud are fixture boundaries (p9 integration host).',
    'Two visible same-named creatures placed on app-hall map; disambiguated via public targetOptionLabel.'] };

function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body')); if (L.__tl) return; L.__tl = true; const click = L.click;
  L.click = async function(options = {}) { try { return await click.call(this, { timeout: 20000, ...options }); } catch (e) { if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e; return click.call(this, { ...options, force: true }); } };
}
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); };
const stage = (name, how, detail) => { report.stages[name] = { how, ...(detail ? { detail } : {}) }; };

const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const ownerDialog = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
const pickOverlay = p => p.locator('.tpo-bar');

async function openBook(p) {
  const role = p.getByRole('button', { name: 'Character', exact: true });
  if (await role.count()) await role.click(); else await p.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
  const sb = p.getByRole('button', { name: 'Spellbook S', exact: true });
  if (await sb.count()) await sb.click(); else await p.locator('button', { hasText: /Spellbook/ }).first().click();
  await book(p).waitFor();
}
async function closeBook(p) { const b = book(p).getByRole('button', { name: 'Close', exact: true }); await b.focus(); await b.press('Enter'); }
const savedRecord = (p, name) => p.evaluate(name => { const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData')); return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === name) : null; }, name);

async function authorSingleTarget(p, spec) {
  await openBook(p);
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(spec.name);
  await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill(spec.description);
  await book(p).getByText('Arcane', { exact: true }).click();
  const nav = book(p).getByRole('navigation', { name: 'Spell wizard steps' });
  await nav.getByRole('button', { name: /Spell Type$/ }).click(); await book(p).getByRole('heading', { name: 'ACTION', exact: true }).click(); await book(p).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await nav.getByRole('button', { name: /^3 Effects$/ }).click();
  await book(p).getByRole('heading', { name: 'Damage', exact: true }).click();
  await book(p).locator('.damage-effects-container').getByRole('textbox').first().fill(spec.damage);
  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click();
  await book(p).getByText('Single Target', { exact: true }).click();
  await book(p).getByText('Ranged', { exact: true }).click();
  const slider = book(p).getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(p).getByText('Enemies', { exact: true }).click(); await book(p).getByText('Any Target', { exact: true }).click();
  await nav.getByRole('button', { name: /Resources$/ }).click();
  await book(p).getByTitle('Standard magical energy', { exact: true }).click(); await book(p).getByTitle('Basic action economy', { exact: true }).click();
  const inputs = book(p).getByRole('spinbutton'); await inputs.nth(0).fill('1'); await inputs.nth(0).fill(String(spec.mana)); await inputs.nth(1).fill('1'); await inputs.nth(1).fill(String(spec.ap));
  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click({ force: true });
  await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), spec.name);
  const r = await savedRecord(p, spec.name);
  await closeBook(p);
  return r;
}

async function admitSpell(p, name) {
  await openBook(p);
  await book(p).getByRole('button', { name: 'Spell Library', exact: true }).click();
  await book(p).getByText(name, { exact: true }).first().click();
  const section = p.getByRole('region', { name: `Room admission for ${name}`, exact: true });
  await section.waitFor();
  await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click();
  await section.getByText(/^Admitted for /).waitFor();
  await p.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click({ timeout: 3000 }).catch(() => p.keyboard.press('Escape'));
}

async function openCastDialog(owner, name) {
  if (await ownerDialog(owner).count()) {
    await ownerDialog(owner).getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {});
    await ownerDialog(owner).waitFor({ state: 'detached' }).catch(() => {});
  }
  const lib = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
  if (!await lib.count()) await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click();
  await lib.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
  await lib.locator('.p9-admitted-row').filter({ hasText: name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
  const od = ownerDialog(owner); await od.waitFor(); await od.getByRole('heading', { name, exact: true }).waitFor();
  return od;
}

async function main() {
  const preflightResult = await preflight.run(PREFLIGHT);
  report.preflight = { checks: preflightResult.checks, build: preflightResult.build, server: preflightResult.server };
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_spell_prepare_creature', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw',
    'actor_recovery', 'actor_turn_boundary', 'combat_started', 'combat_turn_changed', 'combat_ended', 'join_room', 'token_moved']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const pages = {}, contexts = {}, channel = process.env.TL_CHANNEL || process.env.RF_CHANNEL || 'chrome';

  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner']]) {
      const dir = path.join(out, 'profiles', role); fs.mkdirSync(dir, { recursive: true });
      const ctx = contexts[role] = await chromium.launchPersistentContext(dir, { ...(channel ? { channel } : {}), headless: true, viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = pages[role] = ctx.pages()[0] || await ctx.newPage(); patchClick(page);
      page.on('pageerror', e => { if (!/Failed to fetch|blockedbyclient|Loading chunk/i.test(e.message)) report.errors.push({ role, message: e.message }); });
      await setup(page, host.url, uid);
    }
    const { gm, owner } = pages;

    step('configure map with two same-named visible creatures at distinct positions');
    const hall = host.room.gameState.maps['app-hall'];
    // Creature A and Creature B both named "Cave Stalker"
    hall.tokens['A'].name = 'Cave Stalker';
    hall.tokens['A'].position = { x: 120, y: 150 };
    hall.tokens['A'].state.customName = 'Cave Stalker';

    hall.tokens['B'].name = 'Cave Stalker';
    hall.tokens['B'].position = { x: 380, y: 240 };
    hall.tokens['B'].state.customName = 'Cave Stalker';

    // Also include one hidden token to verify privacy filtering
    hall.tokens['HIDDEN'] = {
      id: 'HIDDEN',
      creatureId: 'grimmstalk',
      name: 'Cave Stalker',
      mapId: 'app-hall',
      position: { x: 500, y: 500 },
      hiddenFromPlayers: true,
      state: {
        customName: 'Cave Stalker',
        hiddenFromPlayers: true,
        currentHp: 20, maxHp: 20, tempHealth: 0, conditions: [],
        actorContract: { version: 1, kind: 'creature', roomId: host.room.id, mapId: 'app-hall', tokenId: 'HIDDEN', instanceId: 'stalker-hidden' }
      }
    };

    const updateStores = hiddenToken => {
      const store = window.S('creatureStore');
      const tokens = store.getState().creatureTokens.map(t => {
        if (t.id === 'A') return { ...t, name: 'Cave Stalker', position: { x: 120, y: 150 }, state: { ...t.state, customName: 'Cave Stalker' } };
        if (t.id === 'B') return { ...t, name: 'Cave Stalker', position: { x: 380, y: 240 }, state: { ...t.state, customName: 'Cave Stalker' } };
        return t;
      });
      tokens.push(hiddenToken);
      store.setState({ creatureTokens: tokens, tokens });
    };

    await gm.evaluate(updateStores, hall.tokens['HIDDEN']);
    await owner.evaluate(updateStores, hall.tokens['HIDDEN']);

    // Author and admit a single-target arcane spell
    step('author and admit single-target spell "Dart of Precision"');
    const spec = { name: 'Dart of Precision', description: 'Single-target test for exact map target labels.', damage: '2d6', ap: 1, mana: 2 };
    await authorSingleTarget(gm, spec);
    await admitSpell(gm, spec.name);

    // Settle to ensure admission is broadcast to room
    await owner.waitForTimeout(500);

    step('as owner, open admitted cast dialog and click "Pick on map"');
    const od = await openCastDialog(owner, spec.name);
    const pickBtn = od.locator('.p12c-pick button', { hasText: 'Pick on map' });
    await pickBtn.waitFor({ state: 'visible', timeout: 10000 });
    await pickBtn.click();

    step('verify TargetPickOverlay mounts and displays distinct labels with short token id and rounded position');
    const overlay = pickOverlay(owner);
    await overlay.waitFor({ state: 'visible', timeout: 10000 });

    const select = overlay.locator('select');
    await select.waitFor({ state: 'visible', timeout: 5000 });
    const optionTexts = await select.locator('option').allInnerTexts();
    const optionValues = await select.locator('option').evaluateAll(opts => opts.map(o => o.value));

    report.checks.overlayOptions = { texts: optionTexts, values: optionValues };
    console.log('TargetPickOverlay option texts:', optionTexts);

    // Filter out any default placeholder option
    const creatureOptions = optionTexts.filter(t => t.includes('Cave Stalker'));
    assert.equal(creatureOptions.length, 2, 'Exactly two visible same-named creature options displayed (hidden token excluded)');
    assert.notEqual(creatureOptions[0], creatureOptions[1], 'The two same-named options have distinct labels');

    // Confirm labels match targetOptionLabel format: name · kind · shortId · (x, y)
    assert.match(creatureOptions[0], /Cave Stalker · creature · (?:token-stalker-alpha|token-…-alpha|token-…|alpha|A) · \(120, 150\)/);
    assert.match(creatureOptions[1], /Cave Stalker · creature · (?:token-stalker-beta|token-…-beta|token-…|beta|B) · \(380, 240\)/);

    // Verify hidden actor is NOT in the options for non-GM owner
    assert.ok(!optionTexts.some(t => t.includes('hidden') || t.includes('500, 500')), 'Hidden token is excluded from target options');
    stage('distinct target labels', 'TargetPickOverlay Preview target options distinguish same-named creatures by short token id and rounded position');

    step('select the second creature (token-stalker-beta) and click "Use target"');
    const betaValue = optionValues.find(v => v.includes('token-stalker-beta') || v.includes('B'));
    assert.ok(betaValue, `Found option value for second creature: ${betaValue}`);
    await select.selectOption(betaValue);

    const useTargetBtn = overlay.locator('button', { hasText: 'Use target' });
    assert.ok(await useTargetBtn.isEnabled(), 'Use target button enabled for valid candidate');
    await useTargetBtn.click();
    await overlay.waitFor({ state: 'hidden', timeout: 5000 });

    step('confirm SpellConsequencePanel selects the intended exact creature (token-stalker-beta)');
    const panelSelect = od.locator('select').first();
    const selectedPanelVal = await panelSelect.inputValue();
    report.checks.selectedTargetValue = selectedPanelVal;
    assert.ok(selectedPanelVal.includes('token-stalker-beta') || selectedPanelVal.includes('B'), `Panel selected exact creature: ${selectedPanelVal}`);
    stage('target selection', 'Selected second same-named target returns exact creature token id to cast panel');

    step('refusal check: remove selected creature; confirm selection clears without silent retargeting');
    // Remove creature B from the room map
    delete hall.tokens['B'];
    // Trigger store/room update via event or evaluate
    await owner.evaluate(() => {
      const tokens = window.S('creatureStore').getState().creatureTokens.filter(t => t.id !== 'token-stalker-beta' && t.id !== 'B');
      window.S('creatureStore').setState({ creatureTokens: tokens });
    });
    await owner.waitForTimeout(500);

    // Verify the panel now shows diagnostic warning that target is missing/replaced
    const diagnostic = od.locator('.p9-diagnostic[role="alert"]');
    await diagnostic.waitFor({ state: 'visible', timeout: 5000 });
    const diagText = await diagnostic.innerText();
    assert.match(diagText, /The selected target is missing, replaced or no longer eligible/);

    // Confirm that the panel did NOT silently retarget creature A
    const currentVal = await panelSelect.inputValue();
    assert.notEqual(currentVal, optionValues.find(v => v.includes('token-stalker-alpha') || v.includes('A')), 'Did not silently retarget the remaining same-named creature');
    stage('removal clear without retarget', 'Removed selected creature clears selection with diagnostic, never silently retargeting same-named actor');

    report.passed = true;
  } catch (e) {
    report.failure = e.stack;
    for (const [role, p] of Object.entries(pages)) {
      save(`failure-${role}.aria.yml`, await p.locator('body').ariaSnapshot().catch(() => 'unavailable'));
      await p.screenshot({ path: path.join(out, `failure-${role}.png`) }).catch(() => {});
    }
    throw e;
  } finally {
    report.endedAt = new Date().toISOString();
    report.build = process.env.APP_BUILD_DIR;
    report.buildAssetManifestSha256 = sha(fs.readFileSync(path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json')));
    save('result.json', report);
    for (const c of Object.values(contexts)) await c.close().catch(() => {});
    await host.stop();
  }
}

if (require.main === module) main().then(() => process.exit(0), e => {
  if (e && e.name === 'PreflightError') preflight.printFailure(e); else console.error(e);
  process.exit(e && Number.isInteger(e.exitCode) ? e.exitCode : 1);
});
module.exports = { main };
