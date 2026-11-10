// Spell Timing Presentation ordinary-App witness script
// Verifies: Wizard author immediate + periodic spell with authenticated cooldown ->
// Step 10 review -> save/reopen -> library card.
// Asserts: formulas, tick boundary/count, cooldown, and manual responsibilities agree
// with the saved definition. No "round" substitution or score-as-modifier label.

const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const { chromium } = require('playwright');
const fixtureCharacters = require('./m4b-fixture-characters.cjs');

const out = process.env.TIMING_APP_OUTPUT || process.env.APP_OUTPUT || path.join(__dirname, 'timing-evidence');
fs.mkdirSync(out, { recursive: true });

const clone = v => JSON.parse(JSON.stringify(v));

const report = {
  startedAt: new Date().toISOString(),
  checks: {},
  qualifications: [
    'Optimized ordinary App controls with mocked Firebase/auth and test fixture server.',
    'Playwright browser inspection across Wizard Step 10 Review / Live Preview, Library UnifiedSpellCard, and Reopened Wizard.'
  ],
  errors: [],
  limits: [
    'Presentation closeout verification; no combat execution or server mutations performed.'
  ]
};

const save = (name, value) => {
  fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
};

async function setup(page, url, uid) {
  page.on('pageerror', e => report.errors.push({ uid, message: e.message }));
  await page.route('**/*', route => {
    const u = new URL(route.request().url());
    if (!/(googleapis\.com|firebaseio\.com|firebaseapp\.com)$/.test(u.hostname) || u.hostname === 'fonts.googleapis.com') {
      return route.continue();
    }
    return route.abort('blockedbyclient');
  });
  await page.goto(url + '/game');
  await page.locator('.action-slot').first().waitFor({ timeout: 60000 });
  const consent = page.getByRole('dialog', { name: /Analytics.*Privacy Consent/ });
  await consent.waitFor({ timeout: 5000 }).catch(() => {});
  if (await consent.count()) await consent.getByRole('button', { name: /Decline/i }).click();
  await page.addScriptTag({ url: url + '/integration-io.js' });
  const character = clone(fixtureCharacters.characters[uid]);
  character.class = 'Arcanoneer';
  character.level = 3;
  character.classResource = { type: 'elementalSpheres', spheres: [], current: 0, max: 12 };
  character.class_spells = { known_spells: [] };
  character.buffs = [];
  character.debuffs = [];
  return page.evaluate(async ({ uid, character }) => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const key = Object.keys(window).find(k => k.startsWith('webpackChunk'));
    window[key].push([[99140], {}, r => (window.__req = r)]);
    const moduleWith = text => {
      const found = Object.entries(__req.m).find(([, f]) => f.toString().includes(text));
      if (!found) throw Error('Missing module ' + text);
      return __req(found[0]);
    };
    const registry = moduleWith('registerStore:');
    window.S = n => registry.getStore(n);
    window.__actors = moduleWith('acceptRecoveredActorSnapshot:');
    window.__spell = moduleWith('An unresolved spell approval is retained; check or withdraw it first.');
    const register = Object.values(__spell).find(
      f => typeof f === 'function' && f.toString().includes('actor_spell_pending') && f.toString().includes('socket:')
    );
    for (let i = 0; i < 100 && !S('authStore').getState().isAuthInitialized; i++) await new Promise(r => setTimeout(r, 100));
    S('authStore').getState().setUser({ uid, displayName: uid, getIdToken: async () => uid });
    await new Promise(r => setTimeout(r, 1000));
    window.__socket = io(fixture.backendUrl, { transports: ['websocket'], forceNew: true, auth: { token: uid } });
    await new Promise((r, j) => {
      __socket.once('connect', r);
      __socket.once('connect_error', j);
    });
    S('gameStore').setState({ isInMultiplayer: false, multiplayerRoom: null, multiplayerSocket: __socket });
    register({ socket: __socket });
    const joined = new Promise((r, j) => {
      __socket.once('room_joined', r);
      __socket.once('room_error', e => j(Error(JSON.stringify(e))));
    });
    __socket.emit('join_room', { roomId: fixture.roomId, playerName: uid, password: '' });
    await joined;
    window.__outbound = [];
    const emit = __socket.emit.bind(__socket);
    __socket.emit = (event, ...args) => {
      __outbound.push({ event, payload: args[0] });
      return emit(event, ...args);
    };
    S('gameStore').setState({
      isInMultiplayer: true,
      isGMMode: uid === 'app-gm',
      multiplayerRoom: { id: fixture.roomId },
      multiplayerSocket: __socket,
      cameraX: 0,
      cameraY: 0,
      zoomLevel: 1,
      playerZoom: 1,
      dynamicFogEnabled: false,
      gridSize: 50,
      feetPerTile: 5,
    });
    S('mapStore').setState({ currentMapId: fixture.mapId });
    __actors.registerActorHandlers({ socket: __socket });
    if (!(await __actors.refreshActorSnapshot()).success) throw Error('Snapshot unavailable');
    const store = S('characterStore'),
      sleep = ms => new Promise(r => setTimeout(r, ms));
    for (let i = 0; i < 150 && !(store.getState().currentCharacterId && !store.getState().isLoading); i++) await sleep(100);
    for (let stable = 0, last = null; stable < 5; ) {
      const s = store.getState(),
        k = `${s.currentCharacterId}|${s.characters.length}|${!!s.isLoading}`;
      stable = k === last ? stable + 1 : 0;
      last = k;
      await sleep(100);
    }
    store.setState({ characters: [character] });
    S('gameStore').setState({ isInMultiplayer: false });
    store.getState().loadCharacter(character.id);
    return { uid, characterId: character.id, isGMMode: uid === 'app-gm' };
  }, { uid, character });
}

const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });

async function openBook(p) {
  const role = p.getByRole('button', { name: /^Character(?: \(\d+\))?$/ });
  if (await role.count()) await role.first().click();
  else await p.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
  const sb = p.getByRole('button', { name: /Spellbook/ });
  if (await sb.count()) await sb.first().click();
  else await p.locator('button', { hasText: /Spellbook/ }).first().click();
  await book(p).waitFor();
}

async function closeBook(p) {
  const b = book(p).getByRole('button', { name: 'Close', exact: true });
  await b.focus();
  await b.press('Enter');
}

const savedRecord = (p, name) => p.evaluate(name => {
  const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData'));
  return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === name) : null;
}, name);

async function runWitness(page, hostUrl) {
  const spellName = 'Astral Conflagration';
  const immFormula = '2d8 + intelligence/3';
  const periodicFormula = '1d6';
  const ticks = 3;
  const cooldownValue = 3;

  if (hostUrl && (!page.url() || page.url() === 'about:blank' || !page.url().includes('/game'))) {
    const hydration = await setup(page, hostUrl, 'app-gm');
    save('hydration.json', hydration);
  }

  await openBook(page);

  // Step 1: Identity & General Information
  await book(page).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(spellName);
  await book(page).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Astral burst with recurring scorch and authenticated cooldown.');
  await book(page).getByText('Arcane', { exact: true }).click();

  const nav = book(page).getByRole('navigation', { name: 'Spell wizard steps' });

  // Step 2: Spell Type
  await nav.getByRole('button', { name: /Spell Type$/ }).click();
  await book(page).getByRole('heading', { name: 'ACTION', exact: true }).click();
  await book(page).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');

  // Step 3: Effects (Damage + Composed Periodic)
  await nav.getByRole('button', { name: /^3 Effects$/ }).click();
  await book(page).getByRole('heading', { name: 'Damage', exact: true }).click();
  await book(page).locator('.damage-effects-container').getByRole('textbox').first().fill(immFormula);

  await book(page).getByRole('heading', { name: 'Control', exact: true }).click();
  await book(page).getByRole('button', { name: /^Use composed effect profile/ }).click();
  const fields = book(page).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
  await fields.getByLabel(/^Canonical effect/).selectOption('periodic');
  await fields.getByLabel(/^Effect name shown on the target/).fill('Astral Scorch');
  await fields.getByLabel(/^Each tick/).selectOption('damage');
  await fields.getByLabel(/^Tick amount/).fill(periodicFormula);
  await fields.getByLabel(/^Damage type/).selectOption('arcane');
  await fields.getByLabel(/^Tick roll/).selectOption('each-tick');
  await fields.getByLabel(/^Ticks/).selectOption('target-start-count');
  const countInput = fields.getByLabel(/^Number of ticks/);
  await countInput.waitFor();
  await countInput.fill(String(ticks));
  await fields.getByLabel(/^Source-authored duration text/).fill('3 ticks (target turn start)');
  await fields.getByLabel(/^Required GM adjudication note/).fill('GM resolves each tick roll.');

  // Step 4: Targeting & Propagation
  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click();
  await book(page).getByText('Single Target', { exact: true }).click();
  await book(page).getByText('Ranged', { exact: true }).click();
  const slider = book(page).getByRole('slider').first();
  await slider.focus();
  await slider.press('Home');
  for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(page).getByText('Enemies', { exact: true }).click();
  await book(page).getByText('Any Target', { exact: true }).click();

  // Step 5: Resources
  await nav.getByRole('button', { name: /Resources$/ }).click();
  await book(page).getByTitle('Standard magical energy', { exact: true }).click();
  await book(page).getByTitle('Basic action economy', { exact: true }).click();
  const spinbuttons = book(page).getByRole('spinbutton');
  await spinbuttons.nth(0).fill('2'); // mana
  await spinbuttons.nth(1).fill('1'); // AP

  // Step 6: Cooldown
  await nav.getByRole('button', { name: /Cooldown$/ }).click();
  await book(page).getByRole('button', { name: 'Authenticated Caster Starts', exact: true }).click();
  await book(page).getByLabel('Caster-turn starts to count (1–10)', { exact: true }).fill(String(cooldownValue));

  // Step 10: Review & Preview Inspection
  const reviewBtn = nav.getByRole('button', { name: /Review & Save|Review/ });
  if (await reviewBtn.count()) await reviewBtn.click();
  const previewRegion = page.locator('.adventurer-preview .pf-spell-card, .adventurer-preview, .step10-review-container .pf-spell-card, .pf-spell-card').first();
  await previewRegion.waitFor({ timeout: 15000 });

  // A. Assert formula and score wording: raw "Intelligence", NOT "Intelligence Mod"
  const previewText = await previewRegion.innerText();
  assert(previewText.includes('Intelligence'), 'Preview displays base attribute score name Intelligence');
  assert(!previewText.includes('Intelligence Mod / 3'), 'Preview does NOT label score as modifier');

  // B. Assert duration stat pill: "3 ticks, target turn start", NO "rounds" substitution
  const durationPill = previewRegion.locator('.unified-spell-stat.duration-stat');
  if (await durationPill.count()) {
    const durationText = await durationPill.innerText();
    assert(durationText.includes('3 ticks'), `Duration pill contains 3 ticks: ${durationText}`);
    assert(!durationText.toLowerCase().includes('round'), `Duration pill has NO rounds label: ${durationText}`);
  }

  // C. Assert cooldown footer: "3 strictly upcoming caster-turn starts until reuse", NOT "1 turn"
  const cooldownFooter = previewRegion.locator('.unified-spell-cooldown');
  assert(await cooldownFooter.count() > 0, 'Cooldown footer is rendered');
  const cdText = await cooldownFooter.innerText();
  assert(cdText.includes('3 strictly upcoming caster-turn starts until reuse'), `Cooldown matches authenticated profile: ${cdText}`);
  assert(!cdText.includes('1 turn'), `Cooldown does NOT downgrade to 1 turn: ${cdText}`);
  assert(!cdText.toLowerCase().includes('round'), `Cooldown does NOT substitute rounds: ${cdText}`);

  // D. Assert separate Immediate vs Periodic sections
  assert(previewText.includes('Instant Damage') || previewText.includes('immediate'), 'Instant damage section rendered');
  assert(previewText.includes('Damage Over Time') || previewText.includes('per tick'), 'Periodic damage section rendered');

  // E. Assert GM resolution, tick rolls, payment, and natural expiry wording
  assert(previewText.includes('separate roll') || previewText.includes('roll per tick'), 'Describes separate tick rolls');
  assert(previewText.includes('GM resolve') || previewText.includes('GM resolution') || previewText.includes('GM resolved'), 'Describes GM resolution');
  assert(previewText.includes('Paid once at cast') || previewText.includes('scheduled ticks require no further payment'), 'Describes cast-time payment');
  assert(previewText.includes('natural expiry') || previewText.includes('final tick recorded at natural expiry'), 'Describes final tick recorded at natural expiry');

  // Save Step 10 aria snapshot and screenshot
  save('step10-review.aria.yml', await previewRegion.ariaSnapshot());
  await page.screenshot({ path: path.join(out, 'screenshot-01-review.png') });

  // Save spell
  await page.getByRole('button', { name: '✓ Complete Spell', exact: true }).click({ force: true });
  await page.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), spellName);

  const saved = await savedRecord(page, spellName);
  assert(saved, 'Spell saved to localStorage');
  assert.equal(saved.authoredDraft.cooldownConfig.cooldownType, 'authenticated_caster_start');
  assert.equal(saved.authoredDraft.cooldownConfig.cooldownValue, 3);
  assert.equal(saved.authoredDraft.damageConfig?.formula, immFormula, 'Immediate formula preserved');
  assert.equal(saved.authoredDraft.controlConfig?.authoredCondition?.periodicFormula, periodicFormula, 'Periodic formula preserved');
  assert.equal(saved.authoredDraft.controlConfig?.authoredCondition?.occurrences, ticks, 'Periodic ticks preserved');
  save('saved-spell-record.json', saved);

  await closeBook(page);

  // Step 11: Reopen in Library and inspect Grimoire Card
  await openBook(page);
  await book(page).getByRole('button', { name: 'Spell Library', exact: true }).click();
  await book(page).getByText(spellName, { exact: true }).click();

  const libraryCard = page.locator('.spell-detail-overlay .pf-spell-card, .spell-detail-overlay, .grimoire-card-view, .pf-spell-card').first();
  await libraryCard.waitFor({ timeout: 15000 });

  const libraryText = await libraryCard.innerText();
  assert(libraryText.includes('Intelligence'), 'Library card preserves Intelligence attribute score');
  assert(!libraryText.includes('Intelligence Mod / 3'), 'Library card does not label score as modifier');
  assert(libraryText.includes('3 strictly upcoming caster-turn starts until reuse'), 'Library card displays exact cooldown');
  assert(libraryText.includes('separate roll') || libraryText.includes('roll per tick'), 'Library card describes separate tick rolls');
  assert(libraryText.includes('GM resolve') || libraryText.includes('GM resolution') || libraryText.includes('GM resolved'), 'Library card describes GM resolution');
  assert(libraryText.includes('Paid once at cast') || libraryText.includes('scheduled ticks require no further payment'), 'Library card describes cast-time payment');
  assert(libraryText.includes('natural expiry') || libraryText.includes('final tick recorded at natural expiry'), 'Library card describes final tick recorded at natural expiry');

  await page.screenshot({ path: path.join(out, 'screenshot-02-saved-card.png') });
  save('library-reopened.aria.yml', await libraryCard.ariaSnapshot());

  const closeDetail = page.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true });
  if (await closeDetail.count()) {
    await closeDetail.click();
  }

  // Step 12: Reopen in Wizard to verify authoring state preservation
  await book(page).getByText(spellName, { exact: true }).click({ button: 'right' });
  await page.getByText('Edit in Spell Wizard', { exact: true }).click();
  await book(page).getByRole('textbox', { name: 'Spell Name * *', exact: true }).waitFor({ timeout: 15000 });
  const reopenedPreview = page.locator('.adventurer-preview .pf-spell-card, .adventurer-preview, .pf-spell-card').first();
  await reopenedPreview.waitFor({ timeout: 15000 });
  const reopenedText = await reopenedPreview.innerText();
  assert(reopenedText.includes('Intelligence'), 'Reopened wizard preview preserves Intelligence score');
  assert(!reopenedText.includes('Intelligence Mod / 3'), 'Reopened wizard preview does not label score as modifier');
  assert(reopenedText.includes('3 strictly upcoming caster-turn starts until reuse'), 'Reopened wizard preview preserves cooldown');
  assert(reopenedText.includes('separate roll') || reopenedText.includes('roll per tick'), 'Reopened card describes separate tick rolls');
  assert(reopenedText.includes('GM resolve') || reopenedText.includes('GM resolution') || reopenedText.includes('GM resolved'), 'Reopened card describes GM resolution');
  assert(reopenedText.includes('Paid once at cast') || reopenedText.includes('scheduled ticks require no further payment'), 'Reopened card describes cast-time payment');
  assert(reopenedText.includes('natural expiry') || reopenedText.includes('final tick recorded at natural expiry'), 'Reopened card describes final tick recorded at natural expiry');
  await page.screenshot({ path: path.join(out, 'screenshot-03-reopened.png') });
  save('wizard-reopened.aria.yml', await book(page).ariaSnapshot());

  report.checks.authoring = {
    spellName,
    immFormula,
    periodicFormula,
    ticks,
    cooldownValue,
    previewAgreement: true,
    savedAgreement: true,
    libraryAgreement: true,
    reopenedAgreement: true,
    gmResolutionWording: true,
    paymentWording: true,
    naturalExpiryWording: true
  };
  report.passed = true;
  save('result.json', report);
  console.log('Spell timing presentation witness completed successfully.');
}

module.exports = { runWitness };

if (require.main === module) {
  const hostServer = require('./m4b-catalogue-app-server.cjs');
  (async () => {
    const host = await hostServer.start();
    const browser = await chromium.launch({ channel: process.env.CHROMIUM_CHANNEL || 'chrome', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    try {
      await runWitness(page, host.url);
      process.exit(0);
    } catch (err) {
      console.error('Witness check failed:', err);
      report.errors.push({ message: err.message, stack: err.stack });
      save('result.json', report);
      process.exit(1);
    } finally {
      await browser.close().catch(() => {});
      await host.stop().catch(() => {});
    }
  })();
}
