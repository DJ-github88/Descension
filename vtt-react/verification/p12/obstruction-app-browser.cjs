// Actual optimized App/picker/controllers. Only principals, room transport and geometry inputs are fixtures.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.OBSTRUCTION_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR || out.startsWith(path.resolve(__dirname, '../..'))) throw Error('External OBSTRUCTION_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true });
process.env.APP_OUTPUT = path.join(out, 'fixture');
const { setup } = require('../p9/integration/app-browser.cjs');
const record = { checks: {}, errors: [], limits: ['Unmodified optimized production App and real picker/controllers; webpack access seeds fixture principals/stores.',
  'Registered Socket.IO backend fixture; provider/canonical owner/lease/cloud transport simulated.',
  'GM geometry edits and movement are local projection fixtures, not multiplayer geometry-writer parity acceptance.',
  'Player feedback deliberately remains unknown: there is no certified viewer-safe geometry projection. No trajectory, partial-cover or enforcement support.'] };
const save = (name, data) => fs.writeFileSync(path.join(out, name), typeof data === 'string' ? data : JSON.stringify(data, null, 2));
const panel = page => page.getByRole('region', { name: 'Target aiming advisory', exact: true });
const choose = (page, label) => panel(page).getByRole('combobox', { name: 'Preview target' }).selectOption({ label });
const status = (page, text) => panel(page).getByText(text, { exact: false }).first().waitFor();
async function snapshot(page, name) { save(name + '.aria.yml', await panel(page).ariaSnapshot()); }
async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, headless: true } : { channel: 'chrome', headless: true });
  let gm, owner;
  try {
    gm = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    owner = await browser.newPage({ viewport: { width: 820, height: 1000 }, hasTouch: true });
    for (const [page, uid] of [[gm, 'app-gm'], [owner, 'app-owner']]) {
      page.on('pageerror', error => record.errors.push({ uid, message: error.message }));
      await setup(page, host.url, uid);
      await page.evaluate(() => {
        // The editor store predates storeRegistry. Locate its actual compiled export, as the
        // existing production-App witnesses do for other unregistered stores.
        const pairs = Object.entries(__req.m).filter(([, fn]) => fn.toString().includes('addEnvironmentalObject:'));
        const editor = pairs.flatMap(([id]) => Object.values(__req(id))).find(value => typeof value?.getState === 'function' && 'wallData' in value.getState());
        if (!editor) throw Error('Missing compiled editor store export');
        const registered = window.S;
        window.S = name => name === 'levelEditorStore' ? editor : registered(name);
        S('gameStore').setState({ gridType: 'square', gridOffsetX: 0, gridOffsetY: 0, cameraX: 450, cameraY: 300 });
        S('levelEditorStore').setState({ wallData: {}, environmentalObjects: [], windowOverlays: {}, viewingFromToken: null });
        window.__previewStart = __outbound.length;
      });
    }
    const hall = host.room.gameState.maps['app-hall'];
    const resourcesBefore = JSON.stringify({ A: hall.tokens.A.state, B: hall.tokens.B.state, pc: hall.characterTokens.pc.character, receipts: host.room.gameState.actorConsequences });
    await gm.locator('.creature-token').first().hover();
    await gm.getByAltText('Feather Slash', { exact: true }).first().click();
    const feather = gm.getByRole('dialog', { name: 'Feather Slash adjudication' });
    await feather.getByRole('combobox', { name: 'Feather Slash target' }).selectOption('creature:B');
    await feather.getByLabel('Physical d8 face 1').fill('2'); await feather.getByLabel('Physical d8 face 2').fill('4');
    await feather.getByRole('button', { name: 'Record physical faces', exact: true }).click();
    await feather.getByRole('button', { name: 'Pick on map', exact: true }).click();
    await panel(gm).waitFor();
    assert.equal(await panel(gm).getByRole('combobox').evaluate(el => el === document.activeElement), true);
    await gm.keyboard.press('ArrowDown'); await gm.keyboard.press('Tab');
    await status(gm, 'Sight clear in modeled 2D geometry only');
    assert.match(await panel(gm).getByRole('combobox').inputValue(), /\|B\|/);
    record.checks.clear = true; record.checks.keyboardPreview = true; await snapshot(gm, 'clear');
    await gm.evaluate(() => S('levelEditorStore').setState({ wallData: { '9,5,9,7': { type: 'stone_wall' } } }));
    await status(gm, 'Sight blocked in modeled 2D geometry');
    assert.equal(await gm.locator('.tpo-aim-blocked').count(), 1); record.checks.wall = true; await snapshot(gm, 'wall');
    const rayBefore = await gm.locator('.tpo-aim').getAttribute('x1');
    await gm.evaluate(() => S('gameStore').setState({ cameraX: 500, zoomLevel: 1.25, playerZoom: 1.25 }));
    await status(gm, 'Sight blocked in modeled 2D geometry');
    assert.notEqual(await gm.locator('.tpo-aim').getAttribute('x1'), rayBefore); record.checks.panZoom = true;
    // Pinned selection stores only an exact ref key; current token positions are sampled each render.
    await gm.evaluate(() => S('creatureStore').setState(s => ({ creatureTokens: s.creatureTokens.map(t => t.id === 'B' ? { ...t, position: { x: 400, y: 450 } } : t) })));
    await status(gm, 'Sight clear in modeled 2D geometry only'); record.checks.movement = true;
    await gm.evaluate(() => S('creatureStore').setState(s => ({ creatureTokens: s.creatureTokens.map(t => t.id === 'B' ? { ...t, position: { x: 500, y: 300 } } : t) })));
    await status(gm, 'Sight blocked in modeled 2D geometry');
    await gm.evaluate(() => S('creatureStore').setState(s => ({ creatureTokens: s.creatureTokens.map(t => t.id === 'A' ? { ...t, position: { x: 500, y: 450 } } : t) })));
    await status(gm, 'Sight clear in modeled 2D geometry only');
    await gm.evaluate(() => S('creatureStore').setState(s => ({ creatureTokens: s.creatureTokens.map(t => t.id === 'A' ? { ...t, position: { x: 400, y: 300 } } : t) })));
    await status(gm, 'Sight blocked in modeled 2D geometry'); record.checks.sourceMovement = true;
    await gm.evaluate(() => S('levelEditorStore').setState({ wallData: {}, environmentalObjects: [{ id: 'configured', type: 'crate', worldX: 450, worldY: 300, width: 1, height: 1, rotation: 30, scale: 1, blocksLineOfSight: true }] }));
    await status(gm, 'Sight blocked in modeled 2D geometry'); record.checks.object = true;
    await gm.evaluate(() => S('levelEditorStore').setState(s => ({ environmentalObjects: s.environmentalObjects.map(o => ({ ...o, blocksLineOfSight: false })) })));
    await status(gm, 'Sight clear in modeled 2D geometry only'); record.checks.objectEdit = true;
    await gm.evaluate(() => S('levelEditorStore').setState(s => ({ environmentalObjects: s.environmentalObjects.map(o => ({ ...o, type: 'wooden_door', blocksLineOfSight: true })) })));
    await status(gm, 'Sight unknown — unresolved geometry'); record.checks.interactiveObjectUnknown = true;
    await gm.evaluate(() => S('levelEditorStore').setState({ environmentalObjects: [], wallData: { '9,5,9,7': { type: 'wooden_door', state: 'open' } } }));
    await status(gm, 'Sight clear in modeled 2D geometry only');
    await gm.evaluate(() => S('levelEditorStore').setState({ wallData: { '9,5,9,7': { type: 'wooden_door', state: 'closed' } } }));
    await status(gm, 'Sight blocked in modeled 2D geometry');
    await gm.evaluate(() => S('levelEditorStore').setState({ wallData: { '9,5,9,7': { type: 'wooden_door', isOpen: true } } }));
    await status(gm, 'Sight unknown — unresolved geometry'); record.checks.doorsAndUnknown = true; await snapshot(gm, 'unknown');
    await gm.evaluate(() => { S('levelEditorStore').setState({ wallData: { '9,5,9,7': { type: 'stone_wall' } } }); S('gameStore').setState({ isGMMode: false }); });
    await status(gm, 'viewer-safe geometry is unavailable');
    const downgraded = await panel(gm).getByRole('status').innerText();
    await gm.evaluate(() => S('levelEditorStore').setState({ wallData: {} }));
    assert.equal(await panel(gm).getByRole('status').innerText(), downgraded);
    await gm.evaluate(() => S('gameStore').setState({ isGMMode: true }));
    await status(gm, 'Sight clear in modeled 2D geometry only'); record.checks.GMViewDowngrade = true;
    // Cancel returns to the existing controller without changing its retained roll or target.
    await gm.keyboard.press('Escape'); await feather.getByText(/recorded faces \[2, 4\]/).waitFor();
    await feather.getByRole('button', { name: 'Pick on map', exact: true }).click();
    await choose(gm, 'Ilse'); await panel(gm).getByRole('button', { name: 'Use target', exact: true }).click();
    await feather.getByText(/recorded faces \[2, 4\]/).waitFor();
    assert.equal(await feather.getByRole('button', { name: 'Roll two d8 once', exact: true }).count(), 0);
    record.checks.cancelAndRetargetRetainRoll = [2, 4];
    await feather.getByRole('button', { name: 'Pick on map', exact: true }).click();
    await gm.locator('.tpo-catcher').click({ button: 'right', position: { x: 700, y: 300 } });
    await feather.getByText(/recorded faces \[2, 4\]/).waitFor(); record.checks.rightClick = true;
    // Owner's normal supported spell producer. Tablet/touch has the same explicit review/confirm path.
    await owner.locator('.action-bar-assembly .action-slot').first().evaluate(el => {
      const data = new DataTransfer(); data.setData('application/json', JSON.stringify({ id: 'arc_spark_bolt', name: 'Marrow-Piercing Slug', icon: 'Arcane/Ebon Blaze', spellType: 'ACTION' }));
      const event = new Event('drop', { bubbles: true, cancelable: true }); Object.defineProperty(event, 'dataTransfer', { value: data }); el.dispatchEvent(event);
    });
    await owner.locator('.action-bar-assembly .action-slot').first().click();
    const spell = owner.getByRole('dialog', { name: 'Supported spell cast' });
    await spell.getByRole('button', { name: 'Pick on map', exact: true }).click();
    const targetCircle = await owner.locator('.tpo-candidate').nth(1).evaluate(el => { const box = el.getBoundingClientRect(); return { x: box.x + box.width / 2, y: box.y + box.height / 2 }; });
    await owner.touchscreen.tap(targetCircle.x, targetCircle.y);
    await status(owner, 'viewer-safe geometry is unavailable');
    assert.match(await panel(owner).getByRole('combobox').inputValue(), /\|B\|/); record.checks.touchTokenPreview = true;
    const neutral = await panel(owner).innerText();
    const neutralRay = await owner.locator('.tpo-aim').evaluate(el => el.outerHTML);
    await owner.evaluate(() => {
      S('levelEditorStore').setState({ wallData: { '9,5,9,7': { type: 'stone_wall', secret: 'SECRET_WALL' } }, environmentalObjects: [{ id: 'SECRET_TREE', worldX: 550, worldY: 300, blocksLineOfSight: true }], windowOverlays: { secret: {} } });
    });
    assert.equal(await panel(owner).innerText(), neutral);
    assert.equal(await owner.locator('.tpo-aim').evaluate(el => el.outerHTML), neutralRay);
    assert.equal((await panel(owner).innerHTML()).includes('SECRET'), false);
    // Hidden token must disappear from the accessible selector, even with a stale rendered registry entry.
    await owner.evaluate(() => S('creatureStore').setState(s => ({ creatureTokens: s.creatureTokens.map(t => t.id === 'A' ? { ...t, state: { ...t.state, hiddenFromPlayers: true, customName: 'SECRET_ACTOR' } } : t) })));
    assert.equal((await panel(owner).innerHTML()).includes('SECRET_ACTOR'), false);
    await snapshot(owner, 'player-neutral'); await owner.screenshot({ path: path.join(out, 'tablet.png') });
    record.checks.playerNoninterference = true;
    await panel(owner).getByRole('button', { name: 'Use target', exact: true }).tap(); await spell.waitFor();
    assert.equal(await spell.getByRole('combobox', { name: 'Target', exact: true }).inputValue(), 'creature:app-hall:B');
    record.checks.touchConfirm = true;
    const resourcesAfter = JSON.stringify({ A: hall.tokens.A.state, B: hall.tokens.B.state, pc: hall.characterTokens.pc.character, receipts: host.room.gameState.actorConsequences });
    assert.equal(resourcesAfter, resourcesBefore, 'preview/selection/cancel never mutate canonical resources, HP or receipts');
    for (const [page, name] of [[gm, 'gm'], [owner, 'owner']]) {
      const events = await page.evaluate(() => __outbound.slice(__previewStart).map(e => e.event));
      const forbidden = events.filter(e => /actor_(consequence|adjudicate|propose|.*approve)|spell_cast|resource|cooldown/.test(e));
      assert.deepEqual(forbidden, []); record.checks[name + 'Outbound'] = events;
    }
    record.checks.noPaymentHpOrConsequence = true; record.status = 'PASS';
  } catch (error) { record.status = 'FAIL'; record.error = error.stack; if (gm) save('failure-gm.aria.yml', await gm.locator('body').ariaSnapshot()); throw error; }
  finally { save('result.json', record); await browser.close(); await host.stop(); }
}
main().then(() => process.exit(0), error => { console.error(error); process.exit(1); });
