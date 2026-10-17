// Bounded production-App refusal → reload → corrected-command witness.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.P12_OUTPUT;
if (!out || !process.env.APP_BUILD_DIR) throw Error('External P12_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true });
async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const event of ['actor_consequence', 'actor_snapshot', 'actor_strike_list', 'actor_strike_approve']) host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const gm = await browser.newPage(), owner = await browser.newPage(), result = { errors: [] };
  for (const page of [gm, owner]) page.on('pageerror', e => result.errors.push(e.message));
  try {
    const setup = require('./app-browser.cjs').setup;
    await setup(gm, host, 'app-gm'); await setup(owner, host, 'app-owner');
    await owner.locator('.action-bar-assembly .action-slot').first().evaluate(el => {
      const data = new DataTransfer(); data.setData('application/json', JSON.stringify({ id: 'universal_attack', name: 'Attack (Melee or Ranged)', icon: 'Slashing/Sword Strike', spellType: 'ACTION' }));
      const event = new Event('drop', { bubbles: true, cancelable: true }); Object.defineProperty(event, 'dataTransfer', { value: data }); el.dispatchEvent(event);
    });
    await owner.locator('.action-bar-assembly .action-slot').first().click();
    await owner.getByRole('combobox', { name: 'Strike target', exact: true }).selectOption('creature:app-hall:B');
    await owner.getByLabel('Physical weapon faces', { exact: true }).fill('6'); await owner.getByRole('button', { name: 'Record weapon faces' }).click();
    await owner.getByLabel('Physical proficiency faces', { exact: true }).fill('5'); await owner.getByRole('button', { name: 'Record proficiency faces' }).click();
    await owner.getByRole('button', { name: 'Approve 2 AP and send to GM' }).click();
    const card = () => gm.locator('.p12-gm-card').filter({ has: gm.getByRole('button', { name: 'Confirm and apply' }) }).first();
    await card().getByRole('combobox', { name: 'Proficiency outcome', exact: true }).selectOption('deferred');
    const verdict = card().getByRole('combobox', { name: 'Listed defense verdict', exact: true }); if (await verdict.count()) await verdict.selectOption('not-applicable');
    await card().getByLabel('Final HP damage').fill('9');
    const beforeEmits = await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').length);
    await card().getByRole('button', { name: 'Confirm and apply' }).click();
    await card().getByRole('alert').filter({ hasText: 'changed final amount requires a reason' }).waitFor();
    assert.equal(await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').length), beforeEmits);
    await card().getByLabel(/^Adjustment reason/).fill('Explicit GM table ruling');
    // Hold only the first authority confirmation. A real competing P7 command advances target CAS.
    const original = host.backend.authorityService.assertCurrent.bind(host.backend.authorityService);
    let held = false, release, entered; const waiting = new Promise(r => { entered = r; });
    host.backend.authorityService.assertCurrent = async(...args) => { if (!held && new Error().stack.includes('actorConsequenceHandlers.js')) { held = true; entered(); await new Promise(r => { release = r; }); } return original(...args); };
    await card().getByRole('button', { name: 'Confirm and apply' }).click(); await waiting;
    await gm.evaluate(async() => { const result = await __actors.adjustSharedResource('B', 'health', 1); if (!result.success) throw Error(JSON.stringify(result)); });
    release(); await card().getByText(/Command refused \(stale_actor_revision\)/).waitFor();
    const saved = await gm.evaluate(() => Object.values(__strikeCustody.loadStrikeCustody().gm)[0]);
    assert.equal(saved.phase, 'refused'); result.refusedCommand = saved.command;
    assert.equal(host.room.gameState.maps['app-hall'].characterTokens.pc.character.actionPoints.current, 2);
    host.backend.authorityService.assertCurrent = original;
    await setup(gm, host, 'app-gm');
    await card().getByRole('combobox', { name: 'Proficiency outcome', exact: true }).selectOption('deferred');
    const nextVerdict = card().getByRole('combobox', { name: 'Listed defense verdict', exact: true }); if (await nextVerdict.count()) await nextVerdict.selectOption('not-applicable');
    assert.equal(await card().getByRole('button', { name: 'Confirm and apply' }).isEnabled(), true);
    await card().getByRole('button', { name: 'Confirm and apply' }).click();
    await owner.getByText(/^Accepted: AP/).first().waitFor();
    result.receipt = host.room.gameState.actorConsequences.receipts.at(-1);
    assert.notEqual(result.receipt.commandId, saved.command.commandId);
    assert.equal(result.receipt.adjudication.finalAmount, 8);
    assert.deepEqual([host.room.gameState.maps['app-hall'].characterTokens.pc.character.actionPoints.current, host.room.gameState.maps['app-hall'].characterTokens.pc.character.tempActionPoints], [1, 0]);
    result.passed = true;
  } catch (error) {
    result.failure = error.stack;
    fs.writeFileSync(path.join(out, 'failure.aria.yml'), await gm.locator('body').ariaSnapshot()); throw error;
  } finally { fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(result, null, 2)); await browser.close(); await host.stop(); }
}
main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
