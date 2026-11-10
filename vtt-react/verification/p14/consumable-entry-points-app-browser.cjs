// Ordinary-App check for the three consumable entry points: HUD action bar, character-sheet spell bar, Inventory Use.
// The optimized production build is served unchanged; the registered backend/room/socket are the existing p9 fixture.
// Seed actions (inventory contents, character roster, room health reset) are fixture setup, disclosed in result.json.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.CONSUMABLE_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('Absolute CONSUMABLE_OUTPUT and APP_BUILD_DIR are required');
process.env.APP_BUILD_DIR = path.resolve(process.env.APP_BUILD_DIR);
fs.mkdirSync(out, { recursive: true });
const { setup } = require('../p9/integration/app-browser.cjs');
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const report = { checks: {}, errors: [], limits: [
  'Optimized production App and registered backend run; identity/provider login, canonical ownership, lease and cloud persistence are fixture boundaries.',
  'Inventory contents, the local character roster and the room health pool are seeded/reset through the existing webpack store exports. Every use itself is an ordinary App control (slot click, Drink / Consume, Inventory Use).',
  'Same-device fixture room; no deployment, Firebase/production auth, physical second device or human-player claim.',
  'Storage-failure under-debit window: if local draft storage fails while room state is accepted, local item deduction does not complete.',
  'Cross-device exclusion: client inventory is device/character-scoped; server deduplication is command-identity only without a cross-device inventory ledger.',
  'Post-submit journal-failure limitation: if browser storage fails after command submission, recovery is limited to live session memory and does not survive reload.'
] };
const FAMILY = 'Potion of Insight', REGEN = 'Potion of Vigor';
const potion = (id, name, stats) => ({ id, originalItemId: id, name, type: 'consumable', quantity: 2, iconId: 'inv_potion_51',
  width: 1, height: 1, position: { row: 0, col: 0 }, description: 'Ordinary-App consumable witness', combatStats: stats });
// SpellActionBar reads plain numeric combatStats while the HUD/Inventory record builders read { value } shapes.
const items = (numericStats = false, overheal = false) => [
  { ...potion('witness-family', FAMILY, { intelligence: numericStats ? 2 : { value: 2 }, healthRestore: { value: 5 } }), position: { row: 0, col: 0 } },
  { ...potion('witness-regen', REGEN, numericStats ? { armor: 2, healthRestore: { value: 5 } } : { healthRegen: { value: 2 }, healthRestore: { value: overheal ? 25 : 5 } }), position: { row: 0, col: 1 } }
];
const pc = host => host.room.gameState.maps['app-hall'].characterTokens.pc;
const conditions = host => pc(host).state.conditions || [];
const serverHealth = host => pc(host).character.health.current;
function resetRoomHealth(host) { pc(host).character.health.current = 20; pc(host).state.conditions = []; }
async function seedInventory(page, list) {
  await page.evaluate(list => {
    // Fixture: keep the App's later scoped rehydration from replacing the seeded pack under the check.
    const inventory = S('inventoryStore');
    if (inventory.persist?.rehydrate) inventory.persist.rehydrate = async () => ({ status: 'skipped-for-witness' });
    inventory.setState({ items: list });
    S('gameStore').setState({ currentPlayer: { id: 'pc', name: 'Ilse' } });
    S('partyStore').setState({ partyMembers: [{ id: 'pc', userId: 'app-owner', character: { id: 'ilse' } }] });
    try { const chat = S('chatStore'); S('chatStore').setState({ notifications: { ...(chat.getState().notifications || {}), combat: [] } }); } catch (_) {}
  }, list);
}
async function seedOwner(page, host, list = items()) {
  resetRoomHealth(host);  // fixture: the page's snapshot refresh below adopts this exact server pool
  await seedInventory(page, list);
  await page.evaluate(list => {
    const inventory = { items: list, currency: { platinum: 0, gold: 0, silver: 0, copper: 0 }, encumbranceState: 'normal' };
    S('characterStore').setState({
      characters: [{ id: 'ilse', name: 'Ilse', class: 'Arcanoneer', level: 3, inventory,
        health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 },
        stats: { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 } }],
      currentCharacterId: 'ilse', id: 'ilse', name: 'Ilse', class: 'Arcanoneer', level: 3, inventory,
      health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 },
      stats: { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 }
    });
  }, list);
  await page.evaluate(async ref => {
    const result = await __actors.refreshActorSnapshot(); if (!result.success) throw Error(JSON.stringify(result));
    const selected = __actors.selectOwnerAttachment(ref); if (!selected.success) throw Error(JSON.stringify(selected));
  }, host.refs.pc);
}
async function inventoryQty(page, id) { return page.evaluate(id => (S('inventoryStore').getState().items.find(i => i.id === id)?.quantity ?? 0), id); }
async function debugState(page, name) {
  try {
    const state = await page.evaluate(() => ({
      status: S('gameStore').getState().actorConsequenceStatus || null,
      items: S('inventoryStore').getState().items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, combatStats: i.combatStats })),
      combat: (S('chatStore').getState().notifications?.combat || []).slice(-6).map(n => n.content),
      health: S('characterStore').getState().health,
      currentCharacterId: S('characterStore').getState().currentCharacterId,
      isInMultiplayer: S('gameStore').getState().isInMultiplayer,
      uid: S('authStore').getState().user?.uid,
      roomId: S('gameStore').getState().multiplayerRoom?.id,
      projection: __actors.roomResourceProjection ? __actors.roomResourceProjection() : 'unavailable'
    }));
    save(`${name}-debug.json`, state);
    save(`${name}-failure.aria.yml`, await page.locator('body').ariaSnapshot());
    await page.screenshot({ path: path.join(out, `${name}-failure.png`), fullPage: true });
  } catch (error) { report.errors.push({ role: name, error: 'debug capture: ' + error.message }); }
}
async function waitFor(predicate, label, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) { if (await predicate()) return; await new Promise(r => setTimeout(r, 100)); }
  throw Error('Timed out waiting for ' + label);
}
async function notices(page) { return page.evaluate(() => (S('chatStore').getState().notifications?.combat || []).map(n => n.content)); }
async function waitForNotice(page, pattern, label) {
  await waitFor(async () => (await notices(page)).some(content => pattern.test(content)), label);
  return (await notices(page)).filter(content => pattern.test(content));
}
async function dropOnActionBar(page, item) {
  const slot = page.locator('.action-bar-assembly .action-slot').first();
  await slot.waitFor();
  await slot.evaluate((el, payload) => {
    const data = new DataTransfer(); data.setData('text/plain', JSON.stringify({ type: 'inventory-item', item: payload }));
    const event = new Event('drop', { bubbles: true, cancelable: true }); Object.defineProperty(event, 'dataTransfer', { value: data });
    el.dispatchEvent(event);
  }, item);
  await slot.getByAltText(item.name, { exact: true }).waitFor();
}
async function actionBarEntry(browser, host) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', e => report.errors.push({ role: 'action-bar', error: e.message }));
  await setup(page, host.url, 'app-owner');
  await seedOwner(page, host);
  const [family, regen] = items();
  await dropOnActionBar(page, family);
  await page.locator('.action-bar-assembly .action-slot').first().click();
  await page.waitForTimeout(2000);
  await debugState(page, 'action-bar-after-click');
  await waitForNotice(page, /was not used and is still in your pack/, 'refusal notice');
  assert.equal(await inventoryQty(page, family.id), 2, 'family potion kept by action bar');
  assert.equal(serverHealth(host), 20, 'family potion did not heal through action bar');
  assert.equal(conditions(host).length, 0, 'family potion did not enter the room through action bar');
  report.checks.actionBar = { familyRefused: true, itemKept: true, health: serverHealth(host), conditions: conditions(host).length };
  await dropOnActionBar(page, regen);
  await page.locator('.action-bar-assembly .action-slot').first().click();
  await waitFor(async () => (await inventoryQty(page, regen.id)) === 1, 'action-bar regen consumption');
  await waitFor(async () => conditions(host).length === 1, 'action-bar regen condition');
  report.checks.actionBar.regenUsed = { quantity: await inventoryQty(page, regen.id), conditions: conditions(host).length,
    localHealth: await page.evaluate(() => S('characterStore').getState().health.current), serverHealth: serverHealth(host),
    note: 'instant local healing is not part of the room condition command; HP is not claimed as reconciled' };
  save('action-bar.aria.yml', await page.locator('body').ariaSnapshot());
  await page.close();
}
async function openCharacterView(page) {
  await page.evaluate(() => {
    window.history.pushState({}, '', '/account/characters/view/ilse');
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
  });
  await page.waitForTimeout(2000);
  save('spell-route.aria.yml', await page.locator('body').ariaSnapshot());
  save('spell-route-slots.json', await page.evaluate(() => {
    const els = [...document.querySelectorAll('.spell-action-slot')];
    const el = els[0]; const r = el?.getBoundingClientRect();
    return { count: els.length, rect: r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null,
      display: el ? getComputedStyle(el).display : null, visibility: el ? getComputedStyle(el).visibility : null,
      wrapper: el?.parentElement ? getComputedStyle(el.parentElement).cssText : null };
  }));
  await page.screenshot({ path: path.join(out, 'spell-route.png'), fullPage: true });
  await page.locator('.spell-action-slot').first().waitFor({ timeout: 30000 });
}
async function spellBarEntry(browser, host) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', e => report.errors.push({ role: 'spell-bar', error: e.message }));
  await setup(page, host.url, 'app-owner');
  const [family, regen] = items(true);
  await seedOwner(page, host, items(true));   // roster must exist before the character view resolves its route
  await openCharacterView(page);
  await page.waitForTimeout(5000);            // let the App's own scoped inventory hydration finish
  await seedInventory(page, items(true));     // re-seed only inventory: no character-store change can retrigger hydration
  await page.waitForTimeout(300);
  await seedInventory(page, items(true));
  await page.evaluate(() => {
    window.__removals = [];
    const store = S('inventoryStore'), original = store.getState().removeItem;
    store.setState({ removeItem: (id, quantity) => { window.__removals.push([id, quantity]); return original(id, quantity); } });
  });
  const removals = () => page.evaluate(() => window.__removals || []);
  const assign = async (item, index = 0) => {
    await page.locator('.spell-action-slot').nth(index).click();
    const modal = page.locator('.spell-quick-assign-modal'); await modal.waitFor();
    save('spell-assign.aria.yml', await modal.ariaSnapshot());
    save('spell-assign-items.json', await modal.locator('.spell-quick-assign-name').allTextContents());
    const tab = modal.locator('.spell-quick-assign-tab').filter({ hasText: /Consumables/ });
    if (await tab.count()) await tab.click();
    await modal.locator('.spell-quick-assign-item').filter({ hasText: item.name }).first().click();
    await modal.waitFor({ state: 'detached' });
  };
  await assign(family);
  await page.locator('.spell-action-slot').first().click();
  await page.getByRole('button', { name: /Drink \/ Consume/ }).click();
  await page.waitForTimeout(2000);
  await debugState(page, 'spell-bar-after-drink');
  await waitForNotice(page, /was not used and is still in your pack/, 'refusal notice');
  assert.equal((await removals()).some(([id]) => id === family.id), false, 'family potion was not removed by spell bar');
  assert.equal(serverHealth(host), 20, 'family potion did not heal through spell bar');
  assert.equal(conditions(host).length, 0, 'family potion did not enter the room through spell bar');
  report.checks.spellBar = { familyRefused: true, itemNotRemoved: true, health: serverHealth(host), conditions: conditions(host).length,
    note: 'the character view rehydrates its scoped inventory during this check; removal calls are recorded directly' };
  await seedInventory(page, items(true));
  await assign(regen, 1);
  await page.locator('.spell-action-slot').nth(1).click();
  await page.getByRole('button', { name: /Drink \/ Consume/ }).click();
  await page.waitForTimeout(2000);
  await debugState(page, 'spell-bar-regen');
  await waitFor(async () => conditions(host).length === 1, 'spell-bar regen condition');
  await waitFor(async () => (await notices(page)).some(content => /used Potion of Vigor/.test(content)), 'spell-bar regen use notice');
  report.checks.spellBar.regenUsed = { removals: await removals(), conditions: conditions(host).length,
    localHealth: await page.evaluate(() => S('characterStore').getState().health.current), serverHealth: serverHealth(host),
    note: 'instant local healing is not part of the room condition command; HP is not claimed as reconciled' };
  save('spell-bar.aria.yml', await page.locator('body').ariaSnapshot());
  await page.close();
}
async function openInventory(page) {
  await page.getByRole('button', { name: 'Character', exact: true }).click();
  await page.getByRole('button', { name: 'Inventory B', exact: true }).click();
  await page.getByRole('region', { name: 'Inventory item abilities', exact: true }).waitFor({ timeout: 30000 }).catch(() => {});
  await page.locator('.inventory-window-content').waitFor();
}
async function inventoryEntry(browser, host) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', e => report.errors.push({ role: 'inventory', error: e.message }));
  await setup(page, host.url, 'app-owner');
  await seedOwner(page, host);
  const [family, regen] = items();
  await openInventory(page);
  await page.waitForTimeout(1000);
  await seedInventory(page, items());
  await page.waitForTimeout(200);
  await seedInventory(page, items());
  const use = async (item, index) => {
    const window = page.locator('.inventory-window-content');
    await window.getByAltText(item.name, { exact: true }).first().waitFor();
    await window.locator('.item-interaction-overlay').nth(index).click({ button: 'right' });
    await page.getByText('Use', { exact: true }).first().click();
  };
  await use(family, 0);
  await waitForNotice(page, /was not used and is still in your pack/, 'refusal notice');
  assert.equal(await inventoryQty(page, family.id), 2, 'family potion kept by Inventory');
  assert.equal(serverHealth(host), 20, 'family potion did not heal through Inventory');
  assert.equal(conditions(host).length, 0, 'family potion did not enter the room through Inventory');
  report.checks.inventory = { familyRefused: true, itemKept: true, health: serverHealth(host), conditions: conditions(host).length };
  await seedInventory(page, items());
  await page.waitForTimeout(200);
  await seedInventory(page, items());
  await use(regen, 1);
  await waitFor(async () => (await inventoryQty(page, regen.id)) === 1, 'Inventory regen consumption');
  await waitFor(async () => conditions(host).length === 1, 'Inventory regen condition');
  report.checks.inventory.regenUsed = { quantity: await inventoryQty(page, regen.id), conditions: conditions(host).length,
    localHealth: await page.evaluate(() => S('characterStore').getState().health.current), serverHealth: serverHealth(host),
    note: 'instant local healing is not part of the room condition command; HP is not claimed as reconciled' };
  save('inventory.aria.yml', await page.locator('body').ariaSnapshot());
  await page.close();
}

async function overhealCancelEntry(browser, host) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', e => report.errors.push({ role: 'overheal-cancel', error: e.message }));
  await setup(page, host.url, 'app-owner');
  const [, regenOverheal] = items(false, true);
  await seedOwner(page, host, [regenOverheal]);
  await dropOnActionBar(page, regenOverheal);
  await page.locator('.action-bar-assembly .action-slot').first().click();

  const modal = page.getByRole('dialog', { name: 'Overheal Detected' });
  await modal.waitFor({ timeout: 5000 });
  save('overheal-modal.aria.yml', await modal.ariaSnapshot());

  await modal.getByRole('button', { name: 'Cancel' }).click();
  await modal.waitFor({ state: 'detached', timeout: 5000 });
  await page.waitForTimeout(1000);

  assert.equal(conditions(host).length, 0, 'No condition sent on overheal cancel');
  assert.equal(serverHealth(host), 20, 'Server health unchanged on overheal cancel');
  const localHp = await page.evaluate(() => S('characterStore').getState().health.current);
  assert.equal(localHp, 20, 'Local health unchanged on overheal cancel');
  assert.equal(await inventoryQty(page, regenOverheal.id), 2, 'Inventory quantity untouched on overheal cancel');

  report.checks.overhealCancel = {
    modalOpened: true,
    cancelled: true,
    conditions: 0,
    serverHealth: 20,
    localHealth: 20,
    itemQuantity: 2
  };
  await page.close();
}

async function duplicateClickEntry(browser, host) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', e => report.errors.push({ role: 'duplicate-click', error: e.message }));
  await setup(page, host.url, 'app-owner');
  const [, regen] = items();
  await seedOwner(page, host, [regen]);
  await dropOnActionBar(page, regen);

  const slot = page.locator('.action-bar-assembly .action-slot').first();
  await Promise.all([
    slot.click(),
    slot.click()
  ]);

  await waitFor(async () => (await inventoryQty(page, regen.id)) === 1, 'consumption qty === 1');
  await waitFor(async () => conditions(host).length === 1, 'conditions === 1');
  await page.waitForTimeout(2000);

  assert.equal(await inventoryQty(page, regen.id), 1, 'Inventory decremented exactly once');
  assert.equal(serverHealth(host), 25, 'Server health healed exactly once (+5)');
  assert.equal(conditions(host).length, 1, 'Conditions applied exactly once');

  report.checks.duplicateClick = {
    clicksSent: 2,
    commandsAccepted: 1,
    conditions: conditions(host).length,
    serverHealth: serverHealth(host),
    itemQuantity: await inventoryQty(page, regen.id)
  };
  await page.close();
}

async function characterSwitchEntry(browser, host) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', e => report.errors.push({ role: 'character-switch', error: e.message }));
  await setup(page, host.url, 'app-owner');
  const [, regen] = items();
  await seedOwner(page, host, [regen]);
  await dropOnActionBar(page, regen);

  await page.evaluate(() => {
    window.__heldConsequence = null;
    const origEmit = window.__socket.emit.bind(window.__socket);
    window.__socket.emit = (event, payload, ack) => {
      if (event === 'actor_consequence' && typeof ack === 'function') {
        window.__heldConsequence = { payload, ack };
        return;
      }
      return origEmit(event, payload, ack);
    };
  });

  await page.locator('.action-bar-assembly .action-slot').first().click();
  await page.waitForTimeout(500);

  const isHeld = await page.evaluate(() => !!window.__heldConsequence);
  assert.equal(isHeld, true, 'Consequence command was captured');

  await page.evaluate(() => {
    S('characterStore').setState({
      currentCharacterId: 'other', id: 'other', name: 'Other Char',
      health: { current: 15, max: 50 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 },
      characters: [
        { id: 'ilse', name: 'Ilse', health: { current: 20, max: 40 } },
        { id: 'other', name: 'Other Char', health: { current: 15, max: 50 } }
      ]
    });
  });

  await page.evaluate(async () => {
    const { payload, ack } = window.__heldConsequence;
    const serverResult = await new Promise(resolve => {
      const origEmit = Object.getPrototypeOf(window.__socket).emit.bind(window.__socket);
      origEmit('actor_consequence', payload, resolve);
    });
    ack(serverResult);
  });

  await page.waitForTimeout(1000);

  const charBState = await page.evaluate(() => S('characterStore').getState());
  assert.equal(charBState.health.current, 15, 'Character B health untouched (still 15)');
  assert.equal(charBState.health.max, 50, 'Character B max health untouched');

  const rawJournal = await page.evaluate(() => window.localStorage.getItem('mythrill-vtt:unresolved-consumable-commands:v1'));
  assert.ok(rawJournal, 'Command preserved for Character A in journal');
  const parsedJournal = JSON.parse(rawJournal);
  const hasIlseEntry = Object.values(parsedJournal).some(list => Array.isArray(list) && list.some(e => e.characterId === 'ilse'));
  assert.equal(hasIlseEntry, true, 'Journal entry is scoped to character ilse');

  await page.evaluate(({ list }) => {
    const inventory = { items: list, currency: { platinum: 0, gold: 0, silver: 0, copper: 0 }, encumbranceState: 'normal' };
    S('characterStore').setState({
      characters: [{ id: 'ilse', name: 'Ilse', class: 'Arcanoneer', level: 3, inventory,
        health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 },
        stats: { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 } }],
      currentCharacterId: 'ilse', id: 'ilse', name: 'Ilse', class: 'Arcanoneer', level: 3, inventory,
      health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 },
      stats: { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 }
    });
  }, { list: [regen] });

  await dropOnActionBar(page, regen);
  await page.locator('.action-bar-assembly .action-slot').first().click();
  await page.waitForTimeout(2000);

  const charAState = await page.evaluate(() => S('characterStore').getState());
  assert.equal(charAState.health.current, 25, 'Character A reconciled health (+5 = 25)');
  assert.equal(await inventoryQty(page, regen.id), 1, 'Inventory decremented once on reconciliation');

  report.checks.characterSwitchAndReturn = {
    charBHealthUntouched: charBState.health.current,
    journalScopedToIlse: true,
    reconciledOnReturn: true,
    serverHealth: serverHealth(host),
    localHealth: charAState.health.current,
    itemQuantity: await inventoryQty(page, regen.id)
  };
  await page.close();
}

async function sameDeviceReloadEntry(browser, host) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', e => report.errors.push({ role: 'same-device-reload', error: e.message }));
  await setup(page, host.url, 'app-owner');
  const [, regenReload] = items();
  await seedOwner(page, host, [regenReload]);
  await dropOnActionBar(page, regenReload);

  await page.evaluate(() => {
    const origEmit = window.__socket.emit.bind(window.__socket);
    window.__socket.emit = (event, payload, ack) => {
      if (event === 'actor_consequence' && typeof ack === 'function') {
        const rawEmit = Object.getPrototypeOf(window.__socket).emit.bind(window.__socket);
        rawEmit(event, payload, result => {
          const entry = {
            commandId: payload.commandId,
            command: payload,
            name: 'Potion of Vigor',
            characterId: 'ilse',
            actorInstanceId: payload.actors[0].ref.instanceId,
            roomId: payload.roomId,
            ownerUid: 'app-owner',
            itemId: 'witness-regen',
            outcome: result,
            acceptedReceipt: result.receipt,
            completed: false
          };
          window.localStorage.setItem('mythrill-vtt:unresolved-consumable-commands:v1', JSON.stringify({
            'witness-regen': [entry]
          }));
        });
        return;
      }
      return origEmit(event, payload, ack);
    };
  });

  await page.locator('.action-bar-assembly .action-slot').first().click();
  await page.waitForTimeout(1000);

  const journalRaw = await page.evaluate(() => window.localStorage.getItem('mythrill-vtt:unresolved-consumable-commands:v1'));
  assert.ok(journalRaw, 'Journal exists in localStorage before reload');
  assert.equal(conditions(host).length, 1, 'Server accepted consequence');
  assert.equal(serverHealth(host), 25, 'Server health is 25');

  await page.reload();
  await page.locator('.action-slot').first().waitFor({ timeout: 60000 });
  await page.addScriptTag({ url: host.url + '/integration-io.js' });

  await page.evaluate(async () => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const key = Object.keys(window).find(k => k.startsWith('webpackChunk')); window[key].push([[99119], {}, r => window.__req = r]);
    const moduleWith = text => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); return __req(pair[0]); };
    window.__registry = moduleWith('registerStore:');
    window.S = name => __registry.getStore(name);
    window.__actors = moduleWith('acceptRecoveredActorSnapshot:');
    window.__socket = io(fixture.backendUrl, { transports: ['websocket'], forceNew: true, auth: { token: 'app-owner' } });
    await new Promise(r => __socket.once('connect', r));
    await new Promise(r => { __socket.emit('join_room', { roomId: fixture.roomId, playerName: 'app-owner', password: '' }); __socket.once('room_joined', r); });
    S('gameStore').setState({ isInMultiplayer: true, multiplayerRoom: { id: fixture.roomId }, multiplayerSocket: __socket });
    S('authStore').getState().setUser({ uid: 'app-owner', displayName: 'app-owner', getIdToken: async() => 'app-owner' });
    __actors.registerActorHandlers({ socket: __socket });
    await __actors.refreshActorSnapshot();
    __actors.selectOwnerAttachment(fixture.refs.pc);
  });

  const journalAfterReload = await page.evaluate(() => window.localStorage.getItem('mythrill-vtt:unresolved-consumable-commands:v1'));
  assert.ok(journalAfterReload, 'Journal survived reload');

  await seedInventory(page, [regenReload]);
  await page.evaluate(({ list, hp }) => {
    const inventory = { items: list, currency: { platinum: 0, gold: 0, silver: 0, copper: 0 }, encumbranceState: 'normal' };
    S('characterStore').setState({
      characters: [{ id: 'ilse', name: 'Ilse', class: 'Arcanoneer', level: 3, inventory,
        health: { current: hp, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 },
        stats: { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 } }],
      currentCharacterId: 'ilse', id: 'ilse', name: 'Ilse', class: 'Arcanoneer', level: 3, inventory,
      health: { current: hp, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 },
      stats: { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 }
    });
  }, { list: [regenReload], hp: 20 });

  await dropOnActionBar(page, regenReload);
  await page.locator('.action-bar-assembly .action-slot').first().click();
  await page.waitForTimeout(2000);

  const qty = await inventoryQty(page, regenReload.id);
  assert.equal(qty, 1, 'Inventory decremented to 1 on recovery');
  assert.equal(conditions(host).length, 1, 'No second condition applied in room (exact deduplication)');
  assert.equal(serverHealth(host), 25, 'Server health remains 25 (not double-healed)');

  report.checks.sameDeviceReload = {
    journalSurvivedReload: true,
    recoveredReceipt: true,
    conditions: conditions(host).length,
    serverHealth: serverHealth(host),
    itemQuantity: qty
  };
  await page.close();
}

async function main() {
  const suite = process.env.CONSUMABLE_SUITE || (process.argv.includes('--missing') ? 'missing' : (process.argv.includes('--all') ? 'all' : (out.includes('closeout') ? 'missing' : 'baseline')));
  report.suite = suite;
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const event of ['actor_snapshot', 'actor_consequence', 'join_room']) host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    if (suite === 'baseline' || suite === 'all') {
      try { await actionBarEntry(browser, host); } catch (error) { report.failure = error.stack; await debugState((await browser.pages()).at(-1), 'action-bar'); throw error; }
      resetRoomHealth(host);
      try { await spellBarEntry(browser, host); } catch (error) { report.failure = error.stack; await debugState((await browser.pages()).at(-1), 'spell-bar'); throw error; }
      resetRoomHealth(host);
      try { await inventoryEntry(browser, host); } catch (error) { report.failure = error.stack; await debugState((await browser.pages()).at(-1), 'inventory'); throw error; }
      resetRoomHealth(host);
    }
    if (suite === 'missing' || suite === 'all') {
      resetRoomHealth(host);
      try { await overhealCancelEntry(browser, host); } catch (error) { report.failure = error.stack; await debugState((await browser.pages()).at(-1), 'overheal-cancel'); throw error; }
      resetRoomHealth(host);
      try { await duplicateClickEntry(browser, host); } catch (error) { report.failure = error.stack; await debugState((await browser.pages()).at(-1), 'duplicate-click'); throw error; }
      resetRoomHealth(host);
      try { await characterSwitchEntry(browser, host); } catch (error) { report.failure = error.stack; await debugState((await browser.pages()).at(-1), 'character-switch'); throw error; }
      resetRoomHealth(host);
      try { await sameDeviceReloadEntry(browser, host); } catch (error) { report.failure = error.stack; await debugState((await browser.pages()).at(-1), 'same-device-reload'); throw error; }
    }
    // The fixture blocks Firebase/provider hosts; the App's background fetch then reports a bare "Failed to fetch".
    report.environmentErrors = report.errors.filter(entry => entry.error === 'Failed to fetch');
    report.errors = report.errors.filter(entry => entry.error !== 'Failed to fetch');
    if (suite === 'missing') {
      report.passed = !!report.checks.overhealCancel && !!report.checks.duplicateClick && !!report.checks.characterSwitchAndReturn && !!report.checks.sameDeviceReload && report.errors.length === 0;
    } else if (suite === 'all') {
      report.passed = !!report.checks.actionBar && !!report.checks.spellBar && !!report.checks.inventory && !!report.checks.overhealCancel && !!report.checks.duplicateClick && !!report.checks.characterSwitchAndReturn && !!report.checks.sameDeviceReload && report.errors.length === 0;
    } else {
      report.passed = !!report.checks.actionBar && !!report.checks.spellBar && !!report.checks.inventory && report.errors.length === 0;
    }
  } catch (error) {
    if (!report.failure) report.failure = error.stack;
  } finally {
    save('result.json', report);
    await browser.close();
    await host.stop();
  }
  if (!report.passed) process.exitCode = 1;
}
main().then(() => process.exit(process.exitCode || 0), error => { console.error(error); process.exit(1); });







