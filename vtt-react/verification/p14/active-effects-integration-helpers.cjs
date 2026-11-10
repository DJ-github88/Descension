// Shared fixture and ordinary-control helpers for the HEADQ active-effects integration witnesses.
// These helpers add no product behavior: they boot the released App/backend fixture, drive the real
// Spell Wizard / Spell Library / shared-condition editor controls, and install the two authored
// attribute/movement display records that the released attribute/movement App witnesses already cover
// on their application routes.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../..');
const fixtureCharacters = require('./m4b-fixture-characters.cjs');
const profile = require('../../src/services/sharedConditionProfile');
const projection = require(path.join(root, 'server/services/actorProjection'));

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function wait(fn, label, tries = 90) {
  for (let i = 0; i < tries; i++) { if (await fn()) return true; await sleep(200); }
  throw Error(`Timed out: ${label}`);
}

function ownerFixture() {
  const record = JSON.parse(JSON.stringify(fixtureCharacters.characters['app-owner']));
  const stats = { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 };
  return Object.assign(record, { class: 'Arcanoneer', level: 3, stats: { ...stats }, baseStats: { ...stats }, buffs: [], debuffs: [],
    classResource: { type: 'elementalSpheres', spheres: [], current: 0, max: 12 }, class_spells: { known_spells: [] },
    health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 3, tempActionPoints: 1 });
}
async function loadOwnerFixture(page) {
  return page.evaluate(async character => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const store = S('characterStore'), sleepMs = ms => new Promise(r => setTimeout(r, ms));
    for (let i = 0; i < 150 && !(store.getState().currentCharacterId && !store.getState().isLoading); i++) await sleepMs(100);
    for (let stable = 0, last = null; stable < 5;) { const st = store.getState(), key = `${st.currentCharacterId}|${st.characters.length}|${!!st.isLoading}`; stable = key === last ? stable + 1 : 0; last = key; await sleepMs(100); }
    store.setState({ characters: [character] }); S('gameStore').setState({ isInMultiplayer: false }); store.getState().loadCharacter(character.id); S('gameStore').setState({ isInMultiplayer: true });
    const selected = __actors.selectOwnerAttachment(fixture.refs.pc); if (!selected.success) throw Error(JSON.stringify(selected));
    const st = store.getState(); return { characterId: st.currentCharacterId, race: st.race, subrace: st.subrace, statsModel: st.statsModel };
  }, ownerFixture());
}
async function setup(page, url, uid, { owner = false } = {}) {
  if (!page.__aeFonts) {
    page.__aeFonts = true; const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async(...args) => { await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {}); await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts); return goto(...args); };
  }
  const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
  let result;
  for (let attempt = 0; attempt < 2; attempt++) {
    try { result = await baseSetup(page, url, uid); break; } catch (error) {
      // The App's own auth bootstrap can retire a fixture socket installed before it settles; a fresh boot is the same ordinary setup.
      if (attempt === 0 && /retired_principal/.test(String(error.message))) { await page.waitForTimeout(750); continue; }
      throw error;
    }
  }
  if (owner) {
    result.hydration = await loadOwnerFixture(page);
    const refreshed = await page.evaluate(() => window.__actors.refreshActorSnapshot());
    if (!refreshed.success) throw Error(JSON.stringify(refreshed));
  }
  return result;
}

function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body')); if (L.__ae) return; L.__ae = true; const click = L.click;
  L.click = async function(options = {}) { try { return await click.call(this, { timeout: 20000, ...options }); } catch (e) { if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e; return click.call(this, { ...options, force: true }); } };
}

const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
async function openBook(p) {
  const role = p.getByRole('button', { name: 'Character', exact: true });
  if (await role.count()) await role.first().click(); else await p.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
  const sb = p.getByRole('button', { name: 'Spellbook S', exact: true });
  if (await sb.count()) await sb.click(); else await p.locator('button', { hasText: /Spellbook/ }).first().click();
  await book(p).waitFor();
}
async function closeBook(p) { const b = book(p).getByRole('button', { name: 'Close', exact: true }); await b.focus(); await b.press('Enter'); }
const savedRecord = (p, name) => p.evaluate(name => { const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData')); return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === name) : null; }, name);

/** Actual Spell Wizard: damage (optional) + one composed profile (periodic/movement) + optional cooldown and component texts. */
async function author(p, c) {
  await openBook(p);
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(c.name);
  await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill(c.description || 'Disposable active-effects integration witness.');
  await book(p).getByText('Arcane', { exact: true }).click();
  const nav = book(p).getByRole('navigation', { name: 'Spell wizard steps' });
  await nav.getByRole('button', { name: /Spell Type$/ }).click(); await book(p).getByRole('heading', { name: 'ACTION', exact: true }).click(); await book(p).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await nav.getByRole('button', { name: /^3 Effects$/ }).click();
  if (c.now) { await book(p).getByRole('heading', { name: 'Damage', exact: true }).click(); await book(p).locator('.damage-effects-container').getByRole('textbox').first().fill(c.now); }
  await book(p).getByRole('heading', { name: 'Control', exact: true }).click();
  await book(p).getByRole('button', { name: /^Use composed effect profile/ }).click();
  const fields = book(p).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
  await fields.getByLabel(/^Canonical effect/).selectOption(c.kind);
  await fields.getByLabel(/^Effect name shown on the target/).fill(c.label);
  if (c.kind === 'periodic') {
    await fields.getByLabel(/^Each tick/).selectOption('damage'); await fields.getByLabel(/^Tick amount/).fill(c.formula);
    await fields.getByLabel(/^Damage type/).selectOption(c.damageType); await fields.getByLabel(/^Tick roll/).selectOption('each-tick');
    await fields.getByLabel(/^Ticks/).selectOption(c.policy); const count = fields.getByLabel(/^Number of ticks/); await count.waitFor(); await count.fill(String(c.ticks));
  } else {
    await fields.getByLabel(/^Movement change/).fill(String(c.feet)); await fields.getByLabel(/^Expiry/).selectOption(c.policy);
  }
  await fields.getByLabel(/^Source-authored duration text/).fill(c.duration);
  await fields.getByLabel(/^Required GM adjudication note/).fill('GM resolves eligibility and range at the table before confirming.');
  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click(); await book(p).getByText('Single Target', { exact: true }).click(); await book(p).getByText('Ranged', { exact: true }).click();
  const slider = book(p).getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(p).getByText('Enemies', { exact: true }).click(); await book(p).getByText('Any Target', { exact: true }).click();
  await nav.getByRole('button', { name: /Resources$/ }).click(); await book(p).getByTitle('Standard magical energy', { exact: true }).click(); await book(p).getByTitle('Basic action economy', { exact: true }).click();
  const inputs = book(p).getByRole('spinbutton'); await inputs.nth(0).fill('1'); await inputs.nth(0).fill(String(c.mana)); await inputs.nth(1).fill('1'); await inputs.nth(1).fill(String(c.ap));
  if (c.components) {
    const section = book(p).locator('.spell-components-selector, .components-selector-container'); await section.waitFor({ timeout: 10000 });
    for (const kind of ['verbal', 'somatic', 'material']) {
      const text = c.components[kind]; if (!text) continue;
      const option = section.locator('.component-option').filter({ hasText: new RegExp(kind[0].toUpperCase() + kind.slice(1), 'i') });
      await option.click(); await option.locator('.edit-component-btn').click();
      const area = section.locator(`textarea[placeholder*="${kind}"]`).first(); await area.waitFor(); await area.fill(text);
    }
  }
  if (c.cooldown) {
    await nav.getByRole('button', { name: /Cooldown$/ }).click(); await book(p).getByRole('button', { name: 'Authenticated Caster Starts', exact: true }).click();
    await book(p).getByLabel('Caster-turn starts to count (1–10)', { exact: true }).fill(String(c.cooldown));
    await book(p).getByText(new RegExp(`${c.cooldown} strictly upcoming caster-turn start`)).first().waitFor();
  }
  const complete = p.getByRole('button', { name: '✓ Complete Spell', exact: true });
  if (await complete.count()) await complete.click({ force: true }); else await p.locator('.finalize-btn').click({ force: true });
  await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), c.name);
  const record = await savedRecord(p, c.name);
  await closeBook(p);
  return record;
}
async function admitForPc(p, name, original) {
  await openBook(p); await book(p).getByRole('button', { name: 'Spell Library', exact: true }).click(); await book(p).getByText(name, { exact: true }).click();
  const section = p.getByRole('region', { name: `Room admission for ${name}`, exact: true }); await section.waitFor();
  const saved = await savedRecord(p, name); if (JSON.stringify(saved) !== JSON.stringify(original)) throw Error('Save/reopen changed the whole record');
  await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await section.getByText(/^Admitted for /).waitFor();
  await p.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click({ timeout: 3000 }).catch(() => p.keyboard.press('Escape'));
}

async function editorFor(p, attachment) {
  const controls = p.getByRole('region', { name: 'Actor attachment and consequences', exact: true });
  await controls.getByRole('combobox', { name: 'Exact room attachment', exact: true }).selectOption(attachment);
  await controls.getByRole('button', { name: 'Edit selected shared conditions', exact: true }).click();
  const dialog = p.getByRole('dialog', { name: 'Edit selected shared conditions editor', exact: true });
  await dialog.waitFor();
  await dialog.getByText(/^Stunned (inactive\.|active:)/).first().waitFor({ timeout: 20000 });
  return dialog;
}
async function closeEditor(p) {
  const dialog = p.getByRole('dialog', { name: 'Edit selected shared conditions editor', exact: true });
  if (await dialog.count()) { await dialog.getByRole('button', { name: 'Close shared condition editor', exact: true }).click(); await dialog.waitFor({ state: 'detached' }); }
}

/**
 * Display fixture only: two authoritative records exactly as the released authored reverter builds them
 * (`makeAttributeRecord` / `makeMovementRecord`, source and definition identity included) are placed on the
 * room PC, then the actor projection advances so every client receives them through the ordinary snapshot.
 * Their application routes are witnessed separately by the released attribute-modifier and movement witnesses.
 */
function seedReadableConditions(host) {
  const hall = host.room.gameState.maps['app-hall'];
  const target = host.refs.pc, source = host.refs.A;
  const definition = id => `authored:${id}:1:${'a'.repeat(64)}`;
  const attrId = crypto.randomUUID(), moveId = crypto.randomUUID();
  const attribute = profile.makeAttributeRecord(target, attrId, {
    sourceOccurrence: `authored-effect:${attrId}`, timing: 'manual', authoredDuration: 'Until morning',
    attribute: 'spirit', amount: 2, label: 'Iron Will', sourceActor: source, effectDefinition: definition(attrId)
  });
  const movement = profile.makeMovementRecord(target, moveId, {
    sourceOccurrence: `authored-effect:${moveId}`, timing: 'manual', authoredDuration: 'Until dusk',
    feet: -10, label: 'Hobbled', sourceActor: source, effectDefinition: definition(moveId)
  });
  hall.characterTokens.pc.state.conditions = [attribute, movement];
  projection.advance(host.room, host.room.gameState);
  return { attribute, movement };
}

module.exports = {
  book, openBook, closeBook, savedRecord, author, admitForPc, editorFor, closeEditor,
  setup, loadOwnerFixture, ownerFixture, patchClick, wait, sleep, seedReadableConditions
};
