// Normal controls author/reopen/admit/cast. Identity/ownership/lease/cloud are declared fixtures.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), cp = require('child_process');
const { chromium } = require('playwright');
const out = process.env.M4_APP_OUTPUT;
assert.ok(out && path.isAbsolute(out) && process.env.APP_BUILD_DIR);
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture');
const { setup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const pure = require('../../src/services/authoredAbility');
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const report = { checks: {}, errors: [], limits: ['Normal production App and registered handlers; auth/provider/ownership/lease/cloud are fixtures, not real Firebase.',
  'Catalogue formulas are tested with their full originals preserved/refused; these newly Wizard-authored direct abilities are independent gameplay examples, not rewrites/admissions of catalogue spells.'] };
const book = page => page.getByRole('dialog', { name: 'Spellbook', exact: true });
async function openBook(page) {
  // Nav groups tabs under a category flyout; open it through the normal controls.
  await page.getByRole('button', { name: /^Character(?: \(\d+\))?$/ }).click();
  await page.getByRole('button', { name: /^Spellbook(?: S)?$/ }).click();
  await book(page).waitFor();
}
async function closeBook(page) { const b = book(page).getByRole('button', { name: 'Close', exact: true }); await b.focus(); await b.press('Enter'); }
async function author(page, kind, name, formula) {
  await openBook(page);
  await book(page).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(name);
  await book(page).getByRole('textbox', { name: 'Description * *', exact: true }).fill('One direct effect authored for formula capability acceptance.');
  await book(page).getByText('Arcane', { exact: true }).click();
  await book(page).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Spell Type$/ }).click();
  await book(page).getByRole('heading', { name: 'ACTION', exact: true }).click(); await book(page).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await book(page).getByRole('button', { name: /^3 Effects$/ }).click();
  await book(page).getByRole('heading', { name: kind === 'damage' ? 'Damage' : 'Healing', exact: true }).click();
  if (kind === 'healing') { await book(page).getByText('Immediate Healing', { exact: true }).click(); await book(page).getByText('Dice', { exact: true }).first().click(); }
  const input = book(page).getByLabel(kind === 'damage' ? 'Damage formula' : 'Healing formula', { exact: true });
  await input.fill('1d8 + intelligence * 1.5');
  await book(page).getByText('Prism formula execution: manual for now', { exact: true }).waitFor();
  await input.fill(formula); await book(page).getByText('Prism formula execution: supported syntax', { exact: true }).click();
  save(`${kind}-formula.aria.yml`, await book(page).ariaSnapshot());
  await book(page).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Targeting & Propagation$/ }).click();
  await book(page).getByText('Single Target', { exact: true }).click(); await book(page).getByText('Ranged', { exact: true }).click();
  const slider = book(page).getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(page).getByText('Enemies', { exact: true }).click(); await book(page).getByText('Any Target', { exact: true }).click();
  await book(page).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Resources$/ }).click();
  await book(page).getByTitle('Standard magical energy', { exact: true }).click(); await book(page).getByTitle('Basic action economy', { exact: true }).click();
  const values = book(page).getByRole('spinbutton'); await values.nth(0).fill('2'); await values.nth(1).fill('1');
  await page.getByRole('button', { name: '✓ Complete Spell', exact: true }).click();
  await page.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), name);
  const saved = await page.evaluate(name => { const key = Object.keys(localStorage).find(k => k.endsWith(':library.spellData')); return JSON.parse(localStorage.getItem(key)).payload.data.spells.find(s => s.name === name); }, name);
  assert.equal(saved.authoredDraft[`${kind}Config`].formula, formula); assert.equal(pure.definitionFromWizard(saved, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }).definition.capability, pure.FORMULA_CAPABILITY);
  save(`${kind}-saved.json`, saved);
  await closeBook(page); await openBook(page); await book(page).getByRole('button', { name: 'Spell Library', exact: true }).click(); await book(page).getByText(name, { exact: true }).click();
  const section = page.getByRole('region', { name: `Room admission for ${name}`, exact: true }); await section.waitFor();
  await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await section.getByText(/Admitted for immediate damage\/healing/).waitFor();
  save(`${kind}-reopened-admitted.aria.yml`, await section.ariaSnapshot());
  await page.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click(); await closeBook(page);
  return saved;
}
async function actions(page) { const s = page.locator('summary').filter({ hasText: /^Admitted abilities$/ }); await s.click(); const r = page.getByRole('region', { name: 'Admitted abilities', exact: true }); await r.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click(); return r; }
async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const event of ['actor_snapshot', 'actor_consequence', 'actor_spell_approve', 'actor_spell_list', 'actor_authored_admit', 'actor_authored_list', 'join_room']) host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const privateDir = path.join(out, 'private'); fs.mkdirSync(privateDir, { recursive: true });
  if (process.platform === 'win32') cp.execFileSync('icacls.exe', [privateDir, '/inheritance:r', '/grant:r', `${process.env.USERDOMAIN}\\${process.env.USERNAME}:(OI)(CI)F`, 'SYSTEM:(OI)(CI)F']);
  const contexts = [], pages = [];
  try {
    async function page(role) { const c = await chromium.launchPersistentContext(path.join(privateDir, role), { channel: 'chrome', headless: true, viewport: { width: 1440, height: 1000 } }); contexts.push(c); const p = c.pages()[0]; pages.push(p); p.on('pageerror', e => report.errors.push({ role, message: e.message })); await setup(p, host.url, role); return p; }
    const gm = await page('app-gm');
    report.checks.damageWizard = await author(gm, 'damage', 'Prism Formula Lance', '1d8 + intelligence * 2');
    await setup(gm, host.url, 'app-gm'); // Same persistent profile, fresh Wizard context after the first saved/admitted record.
    report.checks.healingWizard = await author(gm, 'healing', 'Prism Formula Mending', '1d8 + intelligence/4');
    const owner = await page('app-owner'); const region = await actions(owner);
    for (const [name, kind] of [['Prism Formula Lance', 'damage'], ['Prism Formula Mending', 'healing']]) {
      await region.locator('.p9-admitted-row').filter({ hasText: name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
      const dialog = owner.getByRole('dialog', { name: 'Supported spell cast', exact: true }); await dialog.waitFor();
      await dialog.getByRole('combobox', { name: 'Target', exact: true }).selectOption('creature:app-hall:B');
      await dialog.getByLabel('d8 face 1', { exact: true }).fill('4'); await dialog.getByRole('button', { name: 'Record physical roll', exact: true }).click();
      await dialog.getByRole('button', { name: 'Close', exact: true }).click();
      await region.locator('.p9-admitted-row').filter({ hasText: name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
      await dialog.getByText(/Recorded physical roll: \[4\]/).waitFor();
      const before = actors.clone(host.room.gameState.maps); await dialog.getByRole('button', { name: 'Approve price and send to GM', exact: true }).click();
      const card = gm.locator('.p9-gm-card').filter({ hasText: name }); await card.waitFor(); assert.deepEqual(host.room.gameState.maps, before);
      const entry = require('../../../server/services/spellPayments').listAll(host.room).find(e => e.approval.spell.name === name);
      assert.equal(entry.approval.roll.total, kind === 'damage' ? 4 + 2 * entry.approval.rollAttributes.intelligence : 4 + Math.floor(entry.approval.rollAttributes.intelligence / 4));
      save(`${kind}-owner.aria.yml`, await dialog.ariaSnapshot()); save(`${kind}-gm.aria.yml`, await card.ariaSnapshot());
      await card.getByRole('checkbox').check(); await card.getByLabel(/^Final/).fill(String(entry.approval.roll.total));
      if (kind === 'damage') await gm.evaluate(() => {
        const listeners = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted');
        __socket.on('actor_consequence_accepted', r => { if (String(r.receipt?.adjudication?.definitionVersionOrHash).startsWith('authored-immediate:v2/')) return; listeners.forEach(fn => fn(r)); });
        const emit = __socket.emit.bind(__socket); let drop = true;
        __socket.emit = (event, ...args) => { if (drop && event === 'actor_consequence' && String(args[0]?.adjudication?.definitionVersionOrHash).startsWith('authored-immediate:v2/')) { drop = false; if (typeof args[1] === 'function') args[1] = () => {}; } return emit(event, ...args); };
      });
      await card.getByRole('button', { name: 'Accept one consequence', exact: true }).click();
      await dialog.getByText(/Accepted · /).first().waitFor({ timeout: 35000 });
      if (kind === 'damage') {
        await card.getByRole('button', { name: 'Check same command', exact: true }).waitFor({ timeout: 35000 });
        const original = await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload), count = actors.ledger(host.room).receipts.length;
        await setup(gm, host.url, 'app-gm');
        await gm.getByRole('button', { name: 'Check same command', exact: true }).first().click();
        await gm.getByText(/Accepted · /).first().waitFor({ timeout: 35000 });
        assert.deepEqual(await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload), original); assert.equal(actors.ledger(host.room).receipts.length, count);
        report.checks.originalCommandReloadRecovery = original;
      }
      const receipt = actors.clone(actors.ledger(host.room).receipts.at(-1)); assert.deepEqual(JSON.parse(receipt.adjudication.chosenResult).roll.dice[0].faces, [4]);
      report.checks[kind] = { receipt, source: actors.clone(actors.locate(host.room, host.refs.pc).token.character), target: actors.clone(actors.locate(host.room, host.refs.B).token.state) };
      await dialog.getByRole('button', { name: 'Close', exact: true }).click();
    }
    report.passed = true;
  } catch (e) { report.failure = e.stack; for (let i = 0; i < pages.length; i++) save(`failure-${i}.aria.yml`, await pages[i].locator('body').ariaSnapshot().catch(() => 'unavailable')); throw e; }
  finally { save('result.json', report); for (const c of contexts) await c.close(); await host.stop(); }
}
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
