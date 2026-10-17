// Additional P11 full-App device-save closure through saveCurrentCharacter → scoped roster → real reload.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.P12_OUTPUT;
if (!out || !process.env.APP_BUILD_DIR) throw Error('External P12_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true });
async function main() {
  const host = await require('../p9/integration/app-server.cjs').start(), browser = await chromium.launch({ channel: 'chrome', headless: true }), page = await browser.newPage();
  const result = { errors: [] }; page.on('pageerror', e => result.errors.push(e.message));
  try {
    const setup = require('./app-browser.cjs').setup; await setup(page, host, 'app-owner');
    await page.evaluate(() => {
      const store = S('characterStore'), state = store.getState();
      store.setState({ characters: [{ id: 'ilse', name: 'Ilse', class: 'Arcanoneer', stats: state.stats }], skillRanks: { weaponMastery: 'ADEPT', weaponMastery_sword: 'EXPERT', weaponMastery_axe: 'NOVICE', weaponMastery_dagger: 'ADEPT' } });
      window.__saved = false; window.__save = store.getState().saveCurrentCharacter().then(() => { __saved = true; });
    });
    await page.waitForFunction(() => Object.entries(localStorage).some(([key, value]) => key.includes('character.roster') && value.includes('weaponMastery_sword') && value.includes('EXPERT')));
    result.deviceRecord = await page.evaluate(() => Object.entries(localStorage).filter(([key, value]) => key.includes('character.roster') && value.includes('weaponMastery_sword')).map(([key, value]) => ({ key, bytes: value.length })));
    assert.ok(result.deviceRecord.length > 0);
    await setup(page, host, 'app-owner');
    result.loaded = await page.evaluate(async() => {
      const store = S('characterStore'); await store.getState().loadCharacters();
      const character = store.getState().characters.find(c => c.id === 'ilse');
      if (!character) throw Error('Device-retained Ilse missing after reload');
      store.getState().loadCharacter('ilse'); return store.getState().skillRanks;
    });
    assert.equal(result.loaded.weaponMastery_sword, 'EXPERT'); assert.equal(result.loaded.weaponMastery_axe, 'NOVICE'); assert.equal(result.loaded.weaponMastery_dagger, 'ADEPT'); assert.equal(result.loaded.weaponMastery, 'ADEPT');
    result.passed = true;
  } catch (error) { result.failure = error.stack; throw error; }
  finally { fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(result, null, 2)); await browser.close(); await host.stop(); }
}
main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
