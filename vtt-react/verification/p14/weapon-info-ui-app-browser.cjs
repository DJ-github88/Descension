// Weapon-information UI witness on the same frozen production artifact as M4B.
// Covers the ActionBar fan companion, the explicit Table button, the sheet tooltip/table,
// keyboard entry, and a narrow emulated-touch layout. No physical-device claim.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.WEAPON_UI_OUTPUT;
assert.ok(out && path.isAbsolute(out) && process.env.APP_BUILD_DIR);
fs.mkdirSync(out, { recursive: true });
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const report = { checks: {}, errors: [], limits: [
  'Normal production App and registered handlers; auth/provider/ownership/lease/cloud are fixtures.',
  'Keyboard input is real Playwright keyboard input. Touch is browser touch emulation (hasTouch), not a physical device.',
  'The App gates /game to the phone landing page at widths <= 767px; narrow layout is witnessed at 768x900, the smallest width that still serves the tactical UI.',
  'UI/read-only witness only; M4B authority, payment, consent and combat acceptance are not repeated here.'
] };

const MACE = {
  id: 'ui-iron-mace', name: 'Iron Mace', type: 'weapon', subtype: 'MACE', slots: ['mainHand'],
  weaponStats: { baseDamage: { diceCount: 1, diceType: 8, damageType: 'Bludgeoning' } }
};

async function setup(page, url, uid) {
  page.on('pageerror', e => report.errors.push({ uid, message: e.message }));
  page.on('console', message => { if (message.type() === 'error') report.errors.push({ uid, console: message.text() }); });
  await page.goto(url + '/game');
  const consent = page.getByRole('dialog', { name: /Analytics.*Privacy Consent/ });
  if (await consent.count()) await consent.getByRole('button', { name: /Decline/i }).click();
  await page.locator('.action-slot').first().waitFor({ timeout: 60000 });
  await page.waitForFunction(() => Object.keys(window).some(k => k.startsWith('webpackChunk')), null, { timeout: 60000 });
  await page.addScriptTag({ url: url + '/integration-io.js' });
  return page.evaluate(async ({ uid }) => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const key = Object.keys(window).find(k => k.startsWith('webpackChunk')); window[key].push([[99119], {}, r => window.__req = r]);
    const moduleWith = text => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!pair) throw Error('Missing compiled module ' + text); return __req(pair[0]); };
    window.__registry = moduleWith('registerStore:'); window.S = name => __registry.getStore(name);
    window.__actors = moduleWith('acceptRecoveredActorSnapshot:');
    for (let i = 0; i < 100 && !S('authStore').getState().isAuthInitialized; i++) await new Promise(r => setTimeout(r, 100));
    S('authStore').getState().setUser({ uid, displayName: uid, getIdToken: async () => uid });
    await new Promise(r => setTimeout(r, 1000));
    window.__socket = io(fixture.backendUrl, { transports: ['websocket'], forceNew: true, auth: { token: uid } });
    await new Promise((resolve, reject) => { __socket.once('connect', resolve); __socket.once('connect_error', reject); });
    S('gameStore').setState({ isInMultiplayer: false, multiplayerRoom: null, multiplayerSocket: __socket });
    const joined = new Promise((resolve, reject) => { __socket.once('room_joined', resolve); __socket.once('room_error', e => reject(Error(JSON.stringify(e)))); });
    __socket.emit('join_room', { roomId: fixture.roomId, playerName: uid, password: '' }); await joined;
    S('gameStore').setState({ isInMultiplayer: true, isGMMode: uid === 'app-gm', multiplayerRoom: { id: fixture.roomId }, multiplayerSocket: __socket,
      cameraX: 0, cameraY: 0, zoomLevel: 1, playerZoom: 1, dynamicFogEnabled: false, gridSize: 50, feetPerTile: 5 });
    S('mapStore').setState({ currentMapId: fixture.mapId });
    __actors.registerActorHandlers({ socket: __socket });
    const result = await __actors.refreshActorSnapshot(); if (!result.success) throw Error(JSON.stringify(result));
    if (uid === 'app-gm') S('characterStore').setState({ characters: [{ id: 'gm', name: 'GM', class: 'Martyr', level: 1 }], currentCharacterId: 'gm', id: 'gm', name: 'GM', class: 'Martyr', level: 1, equipment: {}, skillRanks: {} });
    if (uid === 'app-owner') S('characterStore').setState({ characters: [{ id: 'ilse', name: 'Ilse', class: 'Martyr', level: 1 }], currentCharacterId: 'ilse', id: 'ilse', name: 'Ilse', class: 'Martyr', level: 1, equipment: {}, skillRanks: {} });
    return { fixture };
  }, { uid });
}

async function equipMace(page) {
  await page.evaluate((mace) => {
    const store = window.S('characterStore');
    const state = store.getState();
    store.setState({ equipment: { ...(state.equipment || {}), mainHand: mace, offHand: null, ranged: null },
      skillRanks: { ...(state.skillRanks || {}), weaponMastery_mace: 'NOVICE' } });
  }, MACE);
  await page.waitForTimeout(250);
}

async function openCharacterSheet(page) {
  const menu = page.getByRole('button', { name: /^Character(?: \(\d+\))?$/ }).first();
  if (await menu.count()) await menu.click();
  else await page.locator('.wow-nav-category-header').filter({ hasText: /^Character/ }).first().click();
  const sheet = page.getByRole('button', { name: /^Character Sheet/ }).first();
  await sheet.waitFor({ timeout: 15000 });
  await sheet.click();
  await page.locator('.character-sheet-window').waitFor({ timeout: 30000 });
  const infoTab = page.locator('.character-sheet-window').getByRole('button', { name: 'Info', exact: true }).first();
  if (await infoTab.count()) await infoTab.click();
  const equipmentItem = page.getByText('Equipment & Vitals', { exact: true }).first();
  if (await equipmentItem.count()) await equipmentItem.click();
  await page.locator('.character-container .weapon-slots-bottom .weapon-slot').first().waitFor({ timeout: 30000 });
}

async function main() {
  const host = await require('./m4b-catalogue-app-server.cjs').start();
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  let activePage = null;
  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    activePage = desktop;
    await setup(desktop, host.url, 'app-gm');
    await equipMace(desktop);

    // ActionBar MH fan: hover/focus shows spellcard + live weapon table.
    const hud = desktop.locator('.action-bar-assembly:not(.spell-action-bar-assembly)');
    await hud.locator('.slot-mainHand .equipment-action-slot').click();
    const fan = hud.locator('.slot-mainHand .action-fanout-overlay');
    const bubble = fan.locator('.action-fan-bubble').first();
    await bubble.waitFor();
    await bubble.hover();
    const companion = desktop.locator('[data-testid="fan-action-companion"]');
    await companion.waitFor();
    const spellcard = companion.locator('.fan-companion-spellcard');
    const weaponTable = companion.locator('.fan-companion-weapontable');
    await spellcard.waitFor();
    await weaponTable.waitFor();
    assert.match(await companion.getByTestId('weapon-skill-pill').innerText(), /Mace/);
    assert.equal(await companion.locator('.wst-row').count(), 20);
    assert.equal(await companion.locator('[data-current-rank="true"]').count(), 2);
    const rankRowText = await companion.getByTestId('wst-row-rank-5').innerText();
    const rankNote = await companion.getByTestId('wst-rank-note').innerText();
    report.checks.desktopHover = { spellcard: true, table: true, rows: 20, currentRankRows: 2, rankRowText, rankNote };

    // Keyboard route: ArrowRight from the focused bubble enters the table.
    await bubble.focus();
    await desktop.keyboard.press('ArrowRight');
    assert.equal(await companion.locator('.wst-body').evaluate(el => el === document.activeElement), true);
    report.checks.keyboardArrowRight = true;

    // Explicit Table button opens the pinned table only; the fan stays open and no cast starts.
    await desktop.keyboard.press('Escape');
    await companion.waitFor({ state: 'detached' });
    const apBefore = await desktop.evaluate(() => window.S('characterStore').getState().actionPoints);
    await fan.getByTestId('fan-weapon-table-btn').click();
    await companion.locator('.fan-companion-weapontable').waitFor();
    assert.equal(await companion.locator('.fan-companion-spellcard').count(), 0);
    assert.equal(await companion.getByTestId('weapon-pin-btn').evaluate(el => el.classList.contains('pinned')), true);
    assert.ok(await fan.locator('.action-fan-bubble').count());
    assert.equal(await desktop.getByRole('dialog', { name: 'Supported spell cast' }).count(), 0);
    const apAfter = await desktop.evaluate(() => window.S('characterStore').getState().actionPoints);
    assert.deepEqual(apAfter, apBefore);
    report.checks.desktopTableButton = { pinnedTable: true, spellcardAbsent: true, fanStillOpen: true, castDialog: false, actionPointsUnchanged: true };
    await desktop.keyboard.press('Escape');

    // Sheet tooltip/table: focus shows the extension, Enter opens the 1-20 table, Escape closes.
    await openCharacterSheet(desktop);
    const weaponSlot = desktop.locator('.character-container .weapon-slots-bottom .weapon-slot').first();
    await weaponSlot.focus();
    const extension = desktop.locator('[data-testid="sheet-weapon-tooltip-extension"]');
    await extension.waitFor();
    assert.match(await extension.innerText(), /Weapon Mastery: Mace/);
    assert.match(await extension.innerText(), /Novice \(d6\)/);
    await extension.getByTestId('toggle-weapon-table-btn').click();
    const sheetTable = desktop.locator('[data-testid="sheet-expanded-weapon-table"]');
    await sheetTable.waitFor();
    assert.equal(await sheetTable.locator('.wst-row').count(), 20);
    report.checks.sheetFocusTable = { tooltip: true, rank: true, table: true, rows: 20 };
    await desktop.keyboard.press('Escape');
    await desktop.waitForTimeout(250);
    assert.equal(await desktop.locator('[data-testid="sheet-weapon-tooltip-extension"]').count(), 0);
    save('desktop.aria.yml', await desktop.locator('body').ariaSnapshot());

    // Narrow + emulated touch: the Table button must be reachable and must not cast.
    const touch = await browser.newPage({ viewport: { width: 768, height: 900 }, hasTouch: true });
    activePage = touch;
    await setup(touch, host.url, 'app-owner');
    await equipMace(touch);
    const touchHud = touch.locator('.action-bar-assembly:not(.spell-action-bar-assembly)');
    await touchHud.locator('.slot-mainHand .equipment-action-slot').click();
    const touchFan = touchHud.locator('.slot-mainHand .action-fanout-overlay');
    await touchFan.locator('.action-fan-bubble').first().waitFor();
    const tableBtn = touchFan.getByTestId('fan-weapon-table-btn');
    const btnBoxBefore = await tableBtn.boundingBox();
    const hitTarget = await touch.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      return el ? { tag: el.tagName, cls: el.className, testid: el.getAttribute('data-testid') } : null;
    }, { x: btnBoxBefore.x + btnBoxBefore.width / 2, y: btnBoxBefore.y + btnBoxBefore.height / 2 });
    report.checks.narrowTouchHitTest = { buttonBox: btnBoxBefore, hitTarget };
    await touch.evaluate(() => {
      window.__weaponUiEvents = [];
      ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'mousedown', 'mouseup', 'click'].forEach(type =>
        window.addEventListener(type, e => window.__weaponUiEvents.push({
          type,
          target: e.target?.tagName + (e.target?.id ? '#' + e.target.id : '') + (e.target?.className ? '.' + String(e.target.className).split(' ')[0] : ''),
          fan: !!document.querySelector('.action-fanout-overlay'),
          companion: !!document.querySelector('[data-testid="fan-action-companion"]')
        }), true));
    });
    // Pressed-state geometry: the button must not move while a finger is down (index.css has a
    // touch-only button:active transform that once displaced it; see ActionFanOutMenuTouchSequence.test).
    const pressCdp = await touch.context().newCDPSession(touch);
    const pressPoint = { x: btnBoxBefore.x + btnBoxBefore.width / 2, y: btnBoxBefore.y + btnBoxBefore.height / 2 };
    await pressCdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [pressPoint] });
    await touch.waitForTimeout(250);
    const btnBoxPressed = await tableBtn.boundingBox();
    await pressCdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await touch.waitForTimeout(600);
    const heldOpened = await touch.evaluate(() => !!document.querySelector('[data-testid="fan-action-companion"]'));
    assert.deepEqual(btnBoxPressed, btnBoxBefore, 'Table button moved while pressed');
    assert.equal(heldOpened, true, 'held touch press on the Table button did not open the pinned table');
    // Reset to the closed-table state, then run the plain emulated tap that the trace below records.
    await touch.keyboard.press('Escape');
    await touch.locator('[data-testid="fan-action-companion"]').waitFor({ state: 'detached' });
    await touch.evaluate(() => { window.__weaponUiEvents.length = 0; });
    if (!(await touchFan.locator('.action-fan-bubble').count())) {
      await touchHud.locator('.slot-mainHand .equipment-action-slot').click();
      await touchFan.locator('.action-fan-bubble').first().waitFor();
    }
    await tableBtn.tap();
    await touch.waitForTimeout(600);
    const tapDebug = await touch.evaluate(() => ({
      events: window.__weaponUiEvents.slice(-12),
      fanOpen: !!document.querySelector('.action-fanout-overlay .action-fan-bubble'),
      companion: !!document.querySelector('[data-testid="fan-action-companion"]')
    }));
    report.checks.narrowTouchTapTrace = tapDebug;
    // No fallback click: the emulated tap itself must open the pinned table with the fan still open.
    assert.equal(tapDebug.companion, true, 'emulated tap did not open the pinned table: ' + JSON.stringify(tapDebug.events));
    assert.equal(tapDebug.fanOpen, true, 'emulated tap closed the fan');
    assert.equal(tapDebug.events.find(e => e.type === 'click')?.target.startsWith('DIV#root'), false, 'click retargeted to #root');
    const touchCompanion = touch.locator('[data-testid="fan-action-companion"]');
    await touchCompanion.waitFor();
    await touchCompanion.locator('.fan-companion-weapontable').waitFor();
    assert.equal(await touchCompanion.locator('.fan-companion-spellcard').count(), 0);
    assert.ok(await touchFan.locator('.action-fan-bubble').count());
    assert.equal(await touch.getByRole('dialog', { name: 'Supported spell cast' }).count(), 0);
    const btnBox = await tableBtn.boundingBox();
    assert.ok(btnBox && btnBox.x >= 0 && btnBox.x + btnBox.width <= 768, JSON.stringify(btnBox));
    const companionBox = await touchCompanion.boundingBox();
    assert.ok(companionBox && companionBox.x >= 0 && companionBox.x + companionBox.width <= 768, JSON.stringify(companionBox));
    report.checks.narrowTouch = {
      viewport: '768x900', emulatedTouch: true, openedByEmulatedTouch: tapDebug.companion,
      openedByHeldEmulatedPress: heldOpened, buttonBoxPressedEqualsRest: true, tableButtonReachable: true, pinnedTable: true,
      castDialog: false, buttonBox: btnBox, companionBox
    };
    save('narrow-touch.aria.yml', await touch.locator('body').ariaSnapshot());

    report.passed = Boolean(tapDebug.companion);
    save('result.json', report);
  } catch (error) {
    report.failure = error.stack;
    if (activePage) {
      await save('failure.aria.yml', await activePage.locator('body').ariaSnapshot().catch(() => 'unavailable'));
      await activePage.screenshot({ path: path.join(out, 'failure.png') }).catch(() => {});
    }
    save('result.json', report);
    throw error;
  } finally { await browser.close(); await host.stop(); }
}
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
