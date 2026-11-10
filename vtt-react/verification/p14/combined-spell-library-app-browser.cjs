// Combined integration witness: saved-card save disclosure + Spell Library copy identity.
// Ordinary optimized App and registered backend. One build, one room, ordinary controls.
// Source claims: handoff/spell-card-save-disclosure and handoff/spell-library-copy-identity.
/* global S, __socket, __actors, __outbound */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.CSL_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR || !path.isAbsolute(process.env.APP_BUILD_DIR)) {
  throw Error('Absolute external CSL_OUTPUT and APP_BUILD_DIR required');
}
const repo = path.resolve(__dirname, '../../..');
if (path.resolve(out).startsWith(repo + path.sep)) throw Error('CSL_OUTPUT must be outside the repository');
fs.mkdirSync(out, { recursive: true });
process.env.APP_OUTPUT = path.join(out, 'fixture');

const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const cooldown = require('../../src/services/authoredCooldown');
const fixtureCharacters = require('./m4b-fixture-characters.cjs');

const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = {
  kind: 'combined-save-disclosure-copy-identity-app-witness',
  startedAt: new Date().toISOString(),
  passed: false,
  checks: {},
  qualifications: [
    'Real optimized App and registered backend (p9 production stack); identity/provider login is fixture-seeded.',
    'Temporary in-memory room; no live Firebase, deployment, physical second device or human tabletop claim.',
    'Owner fixture is a complete deterministic Arcanoneer record loaded through production characterStore.loadCharacter after boot (setup instrumentation only).',
    'The save is rolled at the table; the GM records the outcome. VTT does not roll or validate the save.',
    'Faces are entered through the production owner dialog; no world state is hand-edited for the cast.',
    'Catalogue pins and authority were not touched; no catalogue record is exercised.'
  ],
  errors: [],
  steps: []
};
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('-', s); save('progress.json', report); };
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const ownerDialog = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
const clockUI = p => p.getByRole('region', { name: 'Authenticated turn expiry', exact: true });
const hall = host => host.room.gameState.maps['app-hall'];
const PC = host => hall(host).characterTokens.pc;
const receipts = host => actors.ledger(host.room).receipts;
const cds = host => actors.clone(PC(host).state.authoredCooldowns || {});
const pcPools = host => { const r = actors.resources(PC(host), 'character'); return { ap: r.ap.current + r.ap.temp, mana: r.mana.current + r.mana.temp }; };
const combat = host => host.room.gameState.combat;

function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body'));
  if (L.__csl) return;
  L.__csl = true;
  const click = L.click;
  L.click = async function(options = {}) {
    try { return await click.call(this, { timeout: 20000, ...options }); }
    catch (e) {
      if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e;
      return click.call(this, { ...options, force: true });
    }
  };
}

function ownerFixture() {
  const record = JSON.parse(JSON.stringify(fixtureCharacters.characters['app-owner']));
  const stats = { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 };
  return Object.assign(record, {
    class: 'Arcanoneer', level: 3, stats: { ...stats }, baseStats: { ...stats }, buffs: [], debuffs: [],
    classResource: { type: 'elementalSpheres', spheres: [], current: 0, max: 12 }, class_spells: { known_spells: [] },
    health: { current: 30, max: 40 }, mana: { current: 20, max: 30 }, actionPoints: { current: 5, max: 5 },
    tempHealth: 0, tempMana: 0, tempActionPoints: 0
  });
}

async function loadOwnerFixture(page) {
  return page.evaluate(async character => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const store = S('characterStore'), sleep = ms => new Promise(r => setTimeout(r, ms));
    for (let i = 0; i < 150 && !(store.getState().currentCharacterId && !store.getState().isLoading); i++) await sleep(100);
    for (let stable = 0, last = null; stable < 5;) {
      const st = store.getState(), key = `${st.currentCharacterId}|${st.characters.length}|${!!st.isLoading}`;
      stable = key === last ? stable + 1 : 0; last = key; await sleep(100);
    }
    store.setState({ characters: [character] });
    S('gameStore').setState({ isInMultiplayer: false });
    store.getState().loadCharacter(character.id);
    S('gameStore').setState({ isInMultiplayer: true });
    const selected = __actors.selectOwnerAttachment(fixture.refs.pc);
    if (!selected.success) throw Error(JSON.stringify(selected));
    const st = store.getState();
    return { characterId: st.currentCharacterId, name: st.name, class: st.class };
  }, ownerFixture());
}

async function setup(page, url, uid) {
  if (!page.__cslFonts) {
    page.__cslFonts = true;
    const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async (...args) => {
      await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {});
      await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts);
      return goto(...args);
    };
  }
  const result = await baseSetup(page, url, uid);
  if (uid === 'app-owner') { result.hydration = await loadOwnerFixture(page); page.__hydration = result.hydration; }
  return result;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const wait = async (fn, n = 100) => { for (let i = 0; i < n && !fn(); i++) await sleep(150); return fn(); };
const records = p => p.evaluate(() => {
  const k = Object.keys(localStorage).find(key => key.endsWith(':library.spellData'));
  return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells : null;
});
const recordNamed = async (p, name) => (await records(p)).find(s => s.name === name) || null;

async function openBook(p) {
  if (await book(p).count() && await book(p).isVisible()) {
    const wiz = book(p).getByRole('button', { name: 'Spell Wizard', exact: true });
    if (await wiz.count() && await wiz.isVisible()) await wiz.click();
    return;
  }
  const role = p.getByRole('button', { name: 'Character', exact: true });
  if (await role.count()) await role.click(); else await p.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
  const sb = p.getByRole('button', { name: 'Spellbook S', exact: true });
  if (await sb.count()) await sb.click(); else await p.locator('button', { hasText: /Spellbook/ }).first().click();
  await book(p).waitFor();
  const wiz = book(p).getByRole('button', { name: 'Spell Wizard', exact: true });
  if (await wiz.count() && await wiz.isVisible()) await wiz.click();
}
async function closeBook(p) {
  const b = book(p).getByRole('button', { name: 'Close', exact: true });
  if (await b.count()) { await b.first().focus(); await b.first().press('Enter'); }
  else await p.keyboard.press('Escape');
  await book(p).waitFor({ state: 'detached' }).catch(() => {});
}
async function openLibrary(p) {
  await openBook(p);
  const tab = book(p).getByRole('button', { name: 'Spell Library', exact: true });
  if (await tab.count()) await tab.click();
  await book(p).getByText(/Spell Library|All Spells/).first().waitFor({ timeout: 10000 }).catch(() => {});
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
async function resetWizard(p) {
  const reset = book(p).getByTitle('Reset Wizard');
  if (await reset.count() && await reset.isVisible()) {
    await reset.click();
    const confirm = p.getByRole('button', { name: 'Reset Wizard', exact: true });
    await confirm.waitFor({ timeout: 10000 });
    await confirm.click();
    await sleep(300);
  }
}
async function completeSpell(p, name) {
  await p.getByRole('button', { name: /Complete Spell/ }).click({ force: true });
  await p.waitForFunction(n => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(n)), name);
}
async function targetingAndPrice(p, nav) {
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
  await inputs.nth(0).fill('1'); await inputs.nth(0).fill('2');
  await inputs.nth(1).fill('1'); await inputs.nth(1).fill('1');
}
function composedFields(p) {
  return book(p).getByRole('group', { name: /Composed effect .* structured expiry/ });
}

async function authorSupported(gm, name, riderLabel) {
  await openBook(gm);
  await resetWizard(gm);
  await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(name);
  await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Combined witness: arcane direct damage plus one rider-local save, structured expiry and an authenticated cooldown.');
  await book(gm).getByText('Arcane', { exact: true }).click();
  const nav = book(gm).getByRole('navigation', { name: 'Spell wizard steps' });
  await nav.getByRole('button', { name: /Spell Type$/ }).click();
  await book(gm).getByRole('heading', { name: 'ACTION', exact: true }).click();
  await book(gm).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await nav.getByRole('button', { name: /^3 Effects$/ }).click();
  await book(gm).getByRole('heading', { name: 'Damage', exact: true }).click();
  await book(gm).locator('.damage-effects-container').getByRole('textbox').first().fill('1d8+3');
  await book(gm).getByRole('heading', { name: 'Control', exact: true }).click();
  await book(gm).getByRole('button', { name: /^Use composed effect profile/ }).click();
  const fields = composedFields(gm);
  await fields.getByLabel(/^Canonical effect/).selectOption('movement');
  await fields.getByLabel(/^Effect name shown on the target/).fill(riderLabel);
  await fields.getByLabel(/^Movement change/).fill('-10');
  await fields.getByLabel(/^Expiry/).selectOption('target-next-end');
  await fields.getByLabel(/The target may save to negate this effect/).check();
  await fields.getByLabel(/^Saving ability/).selectOption('constitution');
  await fields.getByLabel(/^Difficulty \(DC/).fill('12');
  await fields.getByLabel(/^Source-authored duration text/).fill("Until the end of the target's next turn");
  await fields.getByLabel(/^Required GM adjudication note/).fill('Table rolls CON DC 12; GM records saved or failed.');
  await targetingAndPrice(gm, nav);
  await nav.getByRole('button', { name: /Cooldown$/ }).click();
  await book(gm).getByRole('button', { name: 'Authenticated Caster Starts', exact: true }).click();
  await book(gm).getByLabel(/Caster-turn starts to count/).fill('2');
  await nav.getByRole('button', { name: /Review$/ }).click();
  const review = book(gm);
  const saveLine = review.locator('.review-spell-preview .healing-effect-save .healing-effect-mechanics');
  await saveLine.waitFor({ timeout: 10000 });
  const text = await saveLine.innerText();
  report.checks.reviewSupportedSaveLine = text;
  assert.match(text, /Save: The table rolls the Constitution DC 12 save/);
  assert.match(text, /only the rider "Shiver" is negated/);
  assert.match(text, /the direct damage part still applies on both outcomes/);
  const reviewText = await review.innerText();
  assert.match(reviewText, /expires at the end of the target's next turn/);
  assert.match(reviewText, /Cooldown: 2 strictly upcoming caster-turn starts/);
  await completeSpell(gm, name);
  const record = await recordNamed(gm, name);
  assert.ok(record, 'supported spell saved');
  return record;
}

async function authorRefused(gm, name) {
  await openBook(gm);
  await resetWizard(gm);
  await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(name);
  await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Combined witness: attribute rider plus save and scaled direct, refused by the compiler and labelled manual on the card.');
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
  const fields = composedFields(gm);
  await fields.getByLabel(/^Canonical effect/).selectOption('attribute');
  await fields.getByLabel(/^Effect name shown on the target/).fill('Frailty');
  await fields.getByLabel(/^Change to the score/).fill('-2');
  await fields.getByLabel(/^Expiry/).selectOption('target-next-end');
  await fields.getByLabel(/The target may save to negate this effect/).check();
  await fields.getByLabel(/^Saving ability/).selectOption('constitution');
  await fields.getByLabel(/^Difficulty \(DC/).fill('12');
  await fields.getByLabel(/^Source-authored duration text/).fill("Until the end of the target's next turn");
  await fields.getByLabel(/^Required GM adjudication note/).fill('Table rolls the Constitution save.');
  await targetingAndPrice(gm, nav);
  await nav.getByRole('button', { name: /Review$/ }).click();
  const saveLine = book(gm).locator('.review-spell-preview .healing-effect-save .healing-effect-mechanics');
  await saveLine.waitFor({ timeout: 10000 });
  const text = await saveLine.innerText();
  report.checks.reviewRefusedSaveLine = text;
  assert.match(text, /Saving throw \(Constitution DC 12\): manual only/);
  assert.doesNotMatch(text, /Save: The table rolls/);
  await completeSpell(gm, name);
  return recordNamed(gm, name);
}

async function duplicateViaMenu(p, name) {
  const row = book(p).locator(`[role="button"][aria-label="${name} details"]`).first();
  await row.waitFor({ timeout: 10000 });
  await row.click({ button: 'right' });
  await p.getByText('Duplicate Spell', { exact: true }).click();
  await sleep(400);
}
async function editViaMenu(p, name) {
  const row = book(p).locator(`[role="button"][aria-label="${name} details"]`).first();
  await row.click({ button: 'right' });
  await p.getByText('Edit in Spell Wizard', { exact: true }).click();
  await book(p).getByRole('textbox', { name: /Description/i }).waitFor({ timeout: 10000 });
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

async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  const contexts = {}, pages = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner']]) {
      const dir = path.join(out, 'profiles', role); fs.mkdirSync(dir, { recursive: true });
      const ctx = contexts[role] = await chromium.launchPersistentContext(dir, {
        channel: process.env.CSL_CHANNEL || 'chrome', headless: true,
        viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce'
      });
      const page = pages[role] = ctx.pages()[0] || await ctx.newPage();
      patchClick(page);
      page.on('pageerror', e => { if (!/Failed to fetch|blockedbyclient|Loading chunk/i.test(e.message)) report.errors.push({ role, message: e.message }); });
      await setup(page, host.url, uid);
    }
    const { gm, owner } = pages;
    report.checks.build = { dir: process.env.APP_BUILD_DIR };
    for (const [k, rel] of [['assetManifest', 'asset-manifest.json'], ['indexHtml', 'index.html']]) {
      const file = path.join(process.env.APP_BUILD_DIR, rel);
      if (fs.existsSync(file)) report.checks.build[k + 'Sha256'] = sha(fs.readFileSync(file));
    }
    const manifest = JSON.parse(fs.readFileSync(path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json')));
    const mainFile = path.join(process.env.APP_BUILD_DIR, String(manifest.files['main.js']).replace(/^\//, ''));
    report.checks.build.mainSha256 = sha(fs.readFileSync(mainFile));
    report.checks.build.mainFile = path.basename(mainFile);

    // 1. Supported saved card + Review preview disclosure.
    step('Author supported spell: direct 1d8+3 + Shiver rider + CON DC 12 save + target-next-end expiry + cooldown 2');
    const supportedName = 'CSL Shiver Hex';
    const supported = await authorSupported(gm, supportedName, 'Shiver');
    assert.ok(supported.authoredDraft.controlConfig.authoredCondition.save, 'stored record carries the authored save');
    await openLibrary(gm);
    let detail = await openDetail(gm, supportedName);
    const cardText = await detail.innerText();
    report.checks.savedCardSupported = cardText;
    assert.match(cardText, /Save: The table rolls the Constitution DC 12 save/);
    assert.match(cardText, /only the rider "Shiver" is negated/);
    assert.match(cardText, /the direct damage part still applies on both outcomes/);
    assert.match(cardText, /expires at the end of the target's next turn/);
    assert.match(cardText, /Cooldown: 2 strictly upcoming caster-turn starts/);
    await closeDetail(gm);
    await closeBook(gm);

    // 2. Unsupported shape stays manual on Review and saved card.
    step('Author refused shape: attribute rider + save + scaled direct (compiler refuses)');
    const refusedName = 'CSL Frailty Brand';
    const refused = await authorRefused(gm, refusedName);
    assert.ok(refused, 'refused-shape spell saved');
    await openLibrary(gm);
    detail = await openDetail(gm, refusedName);
    const refusedCard = await detail.innerText();
    report.checks.savedCardRefused = refusedCard;
    assert.match(refusedCard, /Saving throw \(Constitution DC 12\): manual only/);
    assert.doesNotMatch(refusedCard, /Save: The table rolls/);
    await closeDetail(gm);
    await closeBook(gm);

    // Admit the supported source before the cast.
    step('Admit the supported source for the shared room');
    const sourceAdmission = await admitByName(gm, supportedName);
    report.checks.sourceAdmission = sourceAdmission;

    // 3/4. Ordinary Duplicate + copy identity, then edit/cancel leaves the source untouched.
    step('Duplicate supported spell through the library context menu');
    await openLibrary(gm);
    const beforeDuplicate = await records(gm);
    await duplicateViaMenu(gm, supportedName);
    const copyName = `${supportedName} (Copy)`;
    await book(gm).getByText(copyName, { exact: true }).first().waitFor({ timeout: 10000 });
    const afterDuplicate = await records(gm);
    const sourceAfter = afterDuplicate.find(s => s.id === supported.id);
    const copy = afterDuplicate.find(s => s.name === copyName);
    assert.ok(copy, 'copy exists in library storage');
    assert.notEqual(copy.id, supported.id, 'copy has a new library id');
    assert.notEqual(copy.dateCreated, supported.dateCreated, 'copy has a new dateCreated');
    assert.equal(copy.authoredDefinitionId, supported.authoredDefinitionId, 'definition/cooldown identity retained');
    assert.equal(copy.authoredDraft.name, copyName, 'copy draft name follows the record name');
    assert.equal(JSON.parse(copy.serializedData).name, copyName, 'serializedData follows the record name');
    assert.deepEqual(sourceAfter, supported, 'source record is byte-identical after duplicate');
    const rowCount = await book(gm).locator(`[aria-label="${copyName} details"]`).count();
    assert.equal(rowCount, 1, 'copy is reachable as its own library row');
    report.checks.copyIdentity = {
      sourceId: supported.id, copyId: copy.id, sourceDateCreated: supported.dateCreated, copyDateCreated: copy.dateCreated,
      sharedDefinitionId: copy.authoredDefinitionId, sourceUnchanged: true
    };

    step('Edit the copy, mutate a field, then Cancel Edit -> Discard Changes');
    const beforeEdit = await records(gm);
    await editViaMenu(gm, copyName);
    const description = book(gm).getByRole('textbox', { name: /Description/i });
    await description.fill('MUTATED COPY TEXT THAT MUST BE DISCARDED');
    const cancel = book(gm).getByRole('button', { name: /Cancel Edit/i });
    await cancel.click();
    const discard = gm.getByRole('button', { name: /Discard Changes/i });
    await discard.waitFor({ timeout: 10000 });
    await discard.click();
    await sleep(700);
    const afterCancel = await records(gm);
    const srcPersisted = afterCancel.find(s => s.id === supported.id);
    const copyPersisted = afterCancel.find(s => s.id === copy.id);
    assert.deepEqual(srcPersisted, supported, 'source untouched by copy edit/cancel');
    assert.deepEqual(copyPersisted, copy, 'copy untouched by cancelled edit');
    report.checks.cancel = { sourceUnchanged: true, copyUnchanged: true };
    if (await book(gm).count()) await closeBook(gm).catch(() => {});

    // 5. Copy remains compiler/admission-consistent.
    step('Admit the renamed copy: same definition identity, explicit version admission');
    const copyAdmission = await admitByName(gm, copyName);
    report.checks.copyAdmission = copyAdmission;
    assert.match(copyAdmission, /Admitted for /);

    // 6. Active source cooldown blocks the duplicate on the ordinary cast route.
    step('Combat Initiator: PC, A, B; enable authenticated turn expiry');
    const nav = gm.locator('[title^="Combat Initiator"]').first();
    if (await nav.count() && await nav.isVisible()) await nav.click();
    else { await gm.locator('body').click({ position: { x: 700, y: 500 } }).catch(() => {}); await gm.keyboard.press('x'); }
    const overlay = gm.locator('.combat-selection-window'); await overlay.waitFor({ timeout: 15000 });
    const discovery = overlay.locator('.combatants-discovery-section'); await discovery.waitFor({ timeout: 10000 });
    for (const id of ['#pc', '#A', '#B']) { await discovery.locator('.discovery-item').filter({ hasText: id }).first().click(); await gm.waitForTimeout(200); }
    await overlay.getByRole('button', { name: /^Begin Combat \(3\)$/ }).click();
    assert.ok(await wait(() => combat(host)?.isActive === true, 60), 'combat active');
    const closeEditor = () => gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click().catch(() => {});
    await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click();
    await clockUI(gm).getByRole('button', { name: 'Enable authenticated turn expiry', exact: true }).click();
    assert.ok(await wait(() => !!combat(host)?.effectLifecycle, 40), 'authenticated clock enabled');
    await closeEditor();

    step('Owner casts the source once; GM records the failed save; one receipt starts the cooldown');
    const openCast = async name => {
      if (await ownerDialog(owner).count()) {
        await ownerDialog(owner).getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {});
        await ownerDialog(owner).waitFor({ state: 'detached' }).catch(() => {});
      }
      const lib = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
      if (!await lib.count()) await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click();
      await lib.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
      const rows = lib.locator('.p9-admitted-row').filter({ hasText: name });
      const row = /\(Copy\)$/.test(name) ? rows : rows.filter({ hasNotText: /\(Copy\)/ });
      await row.first().getByRole('button', { name: 'Use admitted ability', exact: true }).click();
      const od = ownerDialog(owner); await od.waitFor();
      await od.getByText(/Supported room ability: nothing is spent until the GM accepts/).waitFor();
      return od;
    };
    const recordFace = async (od, face) => {
      await od.getByLabel('d8 face 1', { exact: true }).fill(String(face));
      await od.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    };
    const selectCreatureB = async od => {
      const select = od.getByRole('combobox', { name: 'Target', exact: true });
      const options = await select.locator('option').allInnerTexts();
      const label = options.find(t => /B .* creature .* B/.test(t));
      if (label) await select.selectOption({ label });
    };
    const approve = od => od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true });
    let od = await openCast(supportedName);
    await od.getByText(/Cooldown ready\./).waitFor({ timeout: 20000 });
    await selectCreatureB(od);
    await recordFace(od, 5);
    await approve(od).click();
    await od.getByText(/Awaiting GM adjudication/).waitFor({ timeout: 20000 });
    const card = gm.locator('.p9-gm-card').filter({ hasText: supportedName }).last();
    await card.waitFor({ timeout: 20000 });
    const timingNote = card.getByLabel('GM timing clarification (required)', { exact: true });
    if (await timingNote.count() && !(await timingNote.inputValue())) await timingNote.fill('Range confirmed; CON save failed at the table.');
    await card.getByRole('radio', { name: /^Target fails/ }).check();
    const consent = card.getByRole('checkbox', { name: /I resolved eligibility, range and immunity/ });
    if (!await consent.isChecked()) await consent.check();
    await card.getByLabel(/^Final damage/).fill('8');
    const receiptCount = receipts(host).length;
    await card.getByRole('button', { name: 'Confirm recorded outcome', exact: true }).click();
    assert.ok(await wait(() => receipts(host).length === receiptCount + 1, 60), 'accepted receipt recorded');
    const key = cooldown.key(host.refs.pc, supported.authoredDefinitionId);
    const active = cds(host);
    assert.deepEqual(Object.keys(active), [key], 'exactly the source definition cooldown is active');
    const item = active[key];
    report.checks.activeCooldown = { key, boundary: item.dueSequence, occurrences: item.occurrences, commandId: item.commandId };
    assert.equal(key, cooldown.key(host.refs.pc, copy.authoredDefinitionId), 'copy shares the exact cooldown key');

    step('Owner opens the duplicate: the source definition cooldown is active; approval is refused with no payment');
    od = await openCast(copyName);
    const cooldownLine = od.getByText(/Cooldown active: \d+ of 2 caster-turn starts remaining; releases at authenticated boundary/);
    await cooldownLine.waitFor({ timeout: 20000 });
    const dupText = await cooldownLine.innerText();
    report.checks.copyCooldownLine = dupText;
    assert.match(dupText, new RegExp(`releases at authenticated boundary ${item.dueSequence}`));
    await selectCreatureB(od);
    await recordFace(od, 6);
    const roomBefore = actors.clone(host.room.gameState);
    const poolsBefore = pcPools(host);
    await approve(od).click();
    await od.getByText(/Not registered: Cooldown active/).waitFor({ timeout: 20000 });
    const refusal = await od.innerText();
    report.checks.copyRefusal = refusal;
    assert.match(refusal, /No payment was recorded/i);
    assert.deepEqual(host.room.gameState, roomBefore, 'refused duplicate changed no room state');
    assert.deepEqual(pcPools(host), poolsBefore, 'refused duplicate spent nothing');
    assert.equal(receipts(host).length, receiptCount + 1, 'no receipt from the blocked duplicate');

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
    save('result.json', report);
    for (const c of Object.values(contexts)) await c.close().catch(() => {});
    await host.stop();
  }
}

if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
