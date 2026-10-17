// Real optimized App Laws/cache/tracker checks. Only identity/actor setup uses existing fixture exports.
const fs = require('fs'), path = require('path'), cp = require('child_process'), assert = require('assert/strict'), crypto = require('crypto');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../../..');
const out = path.join(process.env.P10_OUTPUT || 'D:/AppData/Temp/opencode/p10-integration-20261016', process.env.P10_BROWSER_RUN || 'laws-browser');
fs.mkdirSync(out, { recursive: true });
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const result = { startedAt: new Date().toISOString(), pages: {}, errors: [], refusedCloud: [], limits: 'Real production App/Chrome/IndexedDB. Fixture principals and local tracker setup; no live Firebase, deployment, physical table or second-device claim.' };
async function main() {
  const ownedHost = process.env.P10_URL ? null : await require('../p9/integration/app-server.cjs').start();
  const url = process.env.P10_URL || ownedHost.url;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', e => result.errors.push(e.message));
  await page.route('**/*', route => {
    const u = new URL(route.request().url());
    if (/(googleapis\.com|firebaseio\.com|firebaseapp\.com)$/.test(u.hostname) && u.hostname !== 'fonts.googleapis.com') {
      result.refusedCloud.push(u.origin); return route.abort('blockedbyclient');
    }
    return route.continue();
  });
  async function open(route) {
    await page.goto(url + '/codex/' + route);
    await page.locator('main').getByRole('heading', { level: 2 }).first().waitFor({ timeout: 60000 });
    const consent = page.getByRole('button', { name: 'Decline analytics tracking' });
    if (await consent.count()) await consent.click();
  }
  async function collect(name) {
    const seen = [await page.locator('main').textContent()];
    const tabs = page.locator('button.rpg-custom-tab');
    for (let i = 0; i < await tabs.count(); i++) {
      await tabs.nth(i).click();
      seen.push(await page.locator('main').textContent());
    }
    save(name + '.aria.yml', await page.locator('main').ariaSnapshot());
    return seen.join('\n').replace(/\s+/g, ' ');
  }
  try {
    await open('getting-started/first-table', /First Table Reference/);
    const stale = ['rules', 'lore'].map(key => ({ dataKey: key, version: key === 'rules' ? '2.2.3' : '2.2.1', data: JSON.parse(cp.execFileSync('git', ['show', 'HEAD:vtt-react/public/data/' + key + '.json'], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })) }));
    await page.evaluate(records => new Promise((resolve, reject) => {
      const request = indexedDB.open('mythrill-data', 1);
      request.onsuccess = () => {
        const db = request.result, tx = db.transaction('gameData', 'readwrite');
        records.forEach(record => tx.objectStore('gameData').put(record));
        tx.oncomplete = () => { db.close(); resolve(); }; tx.onerror = () => reject(tx.error);
      };
      request.onerror = () => reject(request.error);
    }), stale);
    const fetched = [];
    page.on('response', response => { if (/\/data\/(rules|lore)\.json$/.test(response.url())) fetched.push({ url: response.url(), status: response.status() }); });
    await page.reload();
    await page.getByRole('heading', { name: /First Table Reference/ }).waitFor();
    let text = await collect('first-table');
    assert.match(text, /refill to 4 AP/); assert.match(text, /Feather Slash \(1 AP, melee 10 ft/);
    assert.match(text, /\[Open: criticals against shields/);
    result.pages.firstTable = true;
    const cache = await page.evaluate(() => new Promise((resolve, reject) => {
      const request = indexedDB.open('mythrill-data', 1);
      request.onsuccess = () => { const db = request.result, tx = db.transaction('gameData', 'readonly'), r = tx.objectStore('gameData').getAll();
        r.onsuccess = () => { resolve(r.result.map(v => ({ key: v.dataKey, version: v.version }))); db.close(); }; r.onerror = () => reject(r.error); };
    }));
    for (const key of ['rules', 'lore']) assert.equal(cache.find(v => v.key === key)?.version, '2.3.0', key + ' cache must refresh');
    assert.equal(fetched.filter(v => v.status === 200).length >= 2, true);
    result.cacheRefresh = { seeded: stale.map(({ dataKey, version }) => ({ dataKey, version })), cache, fetched };
    for (const [name, route, title, claims] of [
      ['combat', 'combat-system/combat-basics', /Combat Basics/, [/4 AP/, /basic weapon strike costs 2 AP/, /brace for what's coming/, /Elixirs.*0 AP/, /once per fight/]],
      ['defense', 'combat-system/attacks-damage', /Attacks.*Damage/, [/Creatures have no Armor score, no AC and no equipment DR dice/, /\[Open: the amount, cost and duration of creature Defend/, /Evasion: Does the Attack Land/, /Flat DR/, /resistances and vulnerabilities/]],
      ['trackerLaws', 'combat-system/combat-tracker', /Combat Tracker/, [/What the VTT Resolves Today/, /Marrow-Piercing Slug/, /Restorative Prayer/, /Opening Chord/, /Harmonic Strike/, /no reaction timer yet/i]],
      ['inventory', 'core-rules/inventory-encumbrance', /Inventory|Spatial/, [/15 columns wide and 5 rows tall/, /Strength and Constitution scores rise by 5%/]],
      ['talents', 'magic-system/talents', /Talent/, [/5 Talent Points/, /50 points/, /3 talent trees/]],
      ['resources', 'magic-system/magic-resources', /Resource/, [/Karmic Debt/, /Arcane Energy/, /Veil/]]
    ]) {
      await open(route, title); text = await collect(name); claims.forEach(claim => assert.match(text, claim, name));
      assert.doesNotMatch(text, /Armor Score - 10|Active Soak Die/); result.pages[name] = true;
    }
    await open('character-creation/skills', /^Skills/);
    text = await collect('skills-advanced');
    assert.match(text, /Advanced Skills are not part of the first-table rules/);
    assert.match(text, /\[Open:.*GM Difficulty Die/);
    await page.getByRole('button', { name: /Standard Rules/ }).click();
    text = await collect('skills-standard');
    assert.match(text, /Starting Skills \(Point-Buy\)/); assert.match(text, /you raise that skill yourself/);
    assert.match(text, /\[Open: the starting budget and any bonus points/);
    assert.doesNotMatch(text, /awarded by the GM|static d8/);
    await page.getByRole('button', { name: /Advanced Rules/ }).click();
    await page.getByRole('heading', { name: 'Combat Mastery', exact: true }).click();
    await page.getByRole('heading', { name: 'Weapon Mastery', exact: true }).click();
    text = await collect('skills-weapon-mastery');
    assert.match(text, /d4 Untrained, d6 Novice, d8 Trained, d10 Apprentice, d12 Adept, d20 Expert and Master/);
    assert.doesNotMatch(text, /Blade overextends; lose 1 AP and you cannot riposte this round/);
    result.pages.skills = true;
    await open('equipment-system/weapons', /^Weapons/);
    text = await collect('weapons');
    assert.match(text, /What Makes a Weapon/);
    assert.match(text, /d4 Untrained, d6 Novice, d8 Trained, d10 Apprentice, d12 Adept, d20 Expert and Master/);
    assert.match(text, /\[Open: whether a modifier is added to the proficiency roll/);
    assert.match(text, /\[Open: some authored weapon outcomes still mention Armor Class/);
    assert.doesNotMatch(text, /A static d8|step the mastery die down/);
    await page.getByRole('button', { name: /Advanced Rules/ }).click();
    text = await collect('weapons-advanced'); assert.match(text, /change only how your weapon proficiency advances/);
    result.pages.weapons = true;

    await require('../p9/integration/app-browser.cjs').setup(page, url, 'app-gm');
    await page.locator('.creature-token').first().hover();
    const tooltip = page.locator('.creature-tooltip').first();
    await tooltip.waitFor();
    {
      const summary = await tooltip.innerText();
      assert.doesNotMatch(summary, /Armor Class|Armor Rating|\bAC\s*\d/);
      save('creature-tooltip.aria.yml', await tooltip.ariaSnapshot());
      result.creatureTooltip = { checked: true, noNumericalArmorAC: true };
    }
    result.trackerOpening = await page.evaluate(() => {
      const combatModule = Object.entries(__req.m).find(([, f]) => f.toString().includes('spendActionPoints:') && f.toString().includes('updateCombatConfig:'));
      if (!combatModule) throw Error('Compiled combat store not found');
      window.C = Object.values(__req(combatModule[0])).find(value => typeof value?.getState === 'function');
      const game = S('gameStore'), chars = S('characterStore'), combat = C;
      game.setState({ isInMultiplayer: false, multiplayerRoom: null, multiplayerSocket: null });
      chars.setState({ name: 'P10 PC', actionPoints: { current: 1, max: 4 }, tempActionPoints: 2 });
      const mode = combat.getState().combatConfig.apRestorationMode;
      combat.getState().startCombat([{ id: 'p10-pc', isPlayerToken: true }], []);
      const first = combat.getState().turnOrder[0];
      return { mode, initiative: first.initiative, d20Roll: first.d20Roll, ap: first.currentActionPoints, max: first.maxActionPoints, temp: chars.getState().tempActionPoints };
    });
    assert.equal(result.trackerOpening.mode, 'max'); assert.equal(result.trackerOpening.ap, 4); assert.equal(result.trackerOpening.temp, 2);
    await page.getByTitle('Combat Configuration', { exact: true }).click();
    assert.equal(await page.getByRole('radio', { name: /Restore to Maximum/ }).isChecked(), true);
    save('tracker-config.aria.yml', await page.locator('.combat-config-modal').ariaSnapshot());
    await page.locator('.combat-config-modal').getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.evaluate(() => C.getState().spendActionPoints('p10-pc', 2));
    await page.getByTitle('Next Turn', { exact: true }).click();
    await page.waitForFunction(() => C.getState().round === 2);
    result.trackerNext = await page.evaluate(() => ({ ...C.getState().turnOrder[0], temp: S('characterStore').getState().tempActionPoints }));
    assert.equal(result.trackerNext.currentActionPoints, 4); assert.equal(result.trackerNext.initiative, result.trackerOpening.initiative);
    assert.equal(result.trackerNext.d20Roll, result.trackerOpening.d20Roll); assert.equal(result.trackerNext.temp, 2);
    assert.match(await page.locator('.combat-timeline-window-compact').innerText(), /AP: 4\/4/);
    save('tracker-next.aria.yml', await page.locator('.combat-timeline-window-compact').ariaSnapshot());
    result.passed = true;
  } catch (e) {
    result.failure = e.stack; save('failure.aria.yml', await page.locator('body').ariaSnapshot()); throw e;
  } finally {
    result.endedAt = new Date().toISOString();
    result.assetManifestSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json'))).digest('hex');
    save('result.json', result); await browser.close(); if (ownedHost) await ownedHost.stop();
  }
}
main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
