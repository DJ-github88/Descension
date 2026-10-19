// Frozen P13B-W in the optimized production App. Exercises GM precommit, private owner
// declaration/correction/withdrawal, observer non-disclosure, rejoin recovery of the same
// deadline and current intent, server 8s cutoff + GM manual review handoff, linked follow-up
// window and serious interruption takeover, with zero resource/consequence/receipt mutation.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), crypto = require('crypto');
const { chromium } = require('playwright');
const out = process.env.P13B_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR || out.startsWith(path.resolve(__dirname, '../..')))
  throw Error('P13B_OUTPUT and APP_BUILD_DIR must identify external evidence/build directories.');
fs.mkdirSync(out, { recursive: true });
process.env.APP_OUTPUT = path.join(out, 'fixture');
const setup = require('../p9/integration/app-browser.cjs').setup;
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const result = {
  startedAt: new Date().toISOString(),
  checks: {},
  errors: [],
  limits: [
    'Actual optimized App, production stores/components/helpers, real registered Socket.IO stack.',
    'Provider login, canonical ownership, lease and cloud persistence simulated; no deployment/live Firebase/physical-device/human-table claim.',
    'P13B-W is declaration collection only: no automatic payment, reservation, roll, effect execution or accepted P7 consequence.'
  ]
};

const forbidden = events => events.filter(e =>
  /actor_(?:consequence|propose|adjudicate|.*approve)|spell_cast|resource|cooldown|chat/.test(e.event));

async function inspectPanelStyles(panel) {
  const styles = await panel.evaluate(el => {
    const bounds = el.getBoundingClientRect();
    return {
      headings: [...el.querySelectorAll('h3, h4')].map(h => ({ tag: h.tagName, color: getComputedStyle(h).color })),
      lists: [...el.querySelectorAll('ul')].filter(ul => ul.getBoundingClientRect().width > 0 && ul.getBoundingClientRect().height > 0).map(ul => {
        const style = getComputedStyle(ul);
        return { paddingLeft: style.paddingLeft, listStyleType: style.listStyleType, listStylePosition: style.listStylePosition,
          items: [...ul.children].map(li => {
            const rect = li.getBoundingClientRect(), fontSize = parseFloat(getComputedStyle(li).fontSize);
            return { left: rect.left, right: rect.right, conservativeMarkerLeft: rect.left - fontSize,
              insidePanel: rect.left - fontSize >= bounds.left && rect.right <= bounds.right };
          }) };
      })
    };
  });
  assert.ok(styles.headings.length > 0, 'panel has inspectable headings');
  for (const heading of styles.headings) assert.equal(heading.color, 'rgb(43, 33, 22)', `${heading.tag} computed color`);
  for (const list of styles.lists) {
    assert.equal(list.paddingLeft, '20px', 'list keeps the supplied inner padding');
    for (const item of list.items) assert.equal(item.insidePanel, true, 'list text and marker inset stay inside the panel');
  }
  return styles;
}

async function inspectAccessibleControls(panel) {
  const checks = [];
  const controls = await panel.locator('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), summary').all();
  for (const control of controls) {
    if (!await control.isVisible()) continue; // A closed native details element is intentionally collapsed.
    await control.scrollIntoViewIfNeeded();
    await control.focus();
    const check = await control.evaluate(el => {
      const r = el.getBoundingClientRect(), panel = el.closest('.rw-panel').getBoundingClientRect();
      const x = Math.max(r.left, panel.left) + (Math.min(r.right, panel.right) - Math.max(r.left, panel.left)) / 2;
      const y = Math.max(r.top, panel.top) + (Math.min(r.bottom, panel.bottom) - Math.max(r.top, panel.top)) / 2;
      const hit = document.elementFromPoint(x, y);
      return { tag: el.tagName, focused: document.activeElement === el, keyboardEligible: el.tabIndex >= 0,
        reachable: r.width > 0 && r.height > 0 && x >= 0 && x < innerWidth && y >= 0 && y < innerHeight &&
          y >= panel.top && y <= panel.bottom && (hit === el || el.contains(hit)) };
    });
    assert.equal(check.focused, true, 'enabled control accepts keyboard focus');
    assert.equal(check.keyboardEligible, true, 'enabled control participates in native keyboard navigation');
    assert.equal(check.reachable, true, 'enabled control is reachable within the scrolled panel and viewport');
    checks.push(check);
  }
  assert.ok(checks.length > 0, 'narrow panel exposes reachable controls');
  await panel.evaluate(el => { el.scrollTop = 0; });
  return checks;
}

async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  const browser = await chromium.launch(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH, headless: true }
    : { channel: 'chrome', headless: true });
  const pages = {};
  try {
    // Admit the reconnecting owner last: production disconnect removes/re-adds that assignment.
    // This preserves JSON insertion order without exempting any map-assignment field from comparison.
    for (const [role, uid] of [['gm', 'app-gm'], ['observer', 'app-observer'], ['owner', 'app-owner']]) {
      const page = pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
      page.on('pageerror', error => result.errors.push({ role, message: error.message }));
      await setup(page, host.url, uid);
      await page.evaluate(() => {
        const pair = Object.entries(__req.m).find(([, fn]) => fn.toString().includes('[roomRejoin] subscriber failed'));
        const registerRoomJoined = Object.values(__req(pair[0])).find(fn => typeof fn === 'function' && fn.toString().includes('room_joined'));
        if (!registerRoomJoined) throw Error('Missing compiled registerRoomJoinedListener');
        registerRoomJoined(__socket);
        const rwMod = Object.entries(__req.m).find(([, fn]) => fn.toString().includes('reaction_window_open') && fn.toString().includes('reaction_window_list'));
        if (!rwMod) throw Error('Missing compiled reactionWindowService');
        window.__rwStore = Object.values(__req(rwMod[0])).find(v => typeof v?.getState === 'function' && 'interrupted' in v.getState());
      });
    }
    const { gm, owner, observer } = pages;
    const receiptsBefore = host.room.gameState.actorConsequences.receipts.length;
    const stripJoinCut = raw => {
      const clone = JSON.parse(JSON.stringify(raw));
      if (clone.actorProjection) delete clone.actorProjection.cut;
      for (const m of Object.values(clone.maps || {})) if (m.actorProjection) delete m.actorProjection.cut;
      return JSON.stringify(clone);
    };
    const stateBefore = stripJoinCut(host.room.gameState);
    for (const page of [gm, owner, observer]) {
      await page.evaluate(() => { window.__p13bOutboundStart = __outbound.length; });
    }
    const ownerPoolsBefore = await owner.evaluate(() => JSON.stringify({
      health: S('characterStore').getState().health,
      mana: S('characterStore').getState().mana,
      ap: S('characterStore').getState().actionPoints,
      classResource: S('characterStore').getState().classResource
    }));

    // 1. GM prepares and seals GM choices + opens 8s window for owner's primary character only.
    const gmPrep = gm.getByRole('region', { name: 'GM declaration preparation' });
    await gmPrep.waitFor();
    await gmPrep.locator('summary', { hasText: 'Prepare private declaration window' }).click();
    await gmPrep.getByLabel('Causal action reference').fill('ogre-cleave-roll-1');
    await gmPrep.getByLabel('Occurrence').fill('1');
    await gmPrep.getByLabel('Moment').selectOption('after_roll');
    await gmPrep.getByLabel('Trigger source').selectOption({ index: 1 });
    await gmPrep.getByRole('checkbox', { name: 'Ilse' }).check();
    await gmPrep.getByRole('checkbox', { name: 'Seal no GM declarations' }).uncheck();
    await gmPrep.getByLabel('GM-controlled reactor').selectOption({ index: 1 });
    await gmPrep.getByLabel('Private GM choices').fill('GM_SEALED_SECRET: hold counter');
    await gmPrep.getByRole('button', { name: 'Seal GM choices and open 8 seconds' }).click();

    // 2. Owner receives private 8s window; observer receives nothing; GM sees no player choices.
    const ownerOverlay = owner.getByRole('region', { name: 'Private declaration collection' });
    await ownerOverlay.waitFor();
    await ownerOverlay.getByRole('timer').waitFor();
    assert.equal(await observer.getByRole('region', { name: 'Private declaration collection' }).count(), 0, 'observer sees no window');
    assert.equal(await ownerOverlay.evaluate(el => /GM_SEALED_SECRET|ogre-cleave-roll-1/.test(el.outerHTML)), false, 'owner sees no GM sealed secret or private causeId');

    // 3. Owner declares privately, corrects, withdraws, and re-declares before cutoff.
    await ownerOverlay.getByLabel('Card ID or GM-agreed reference').fill('universal:parry');
    await ownerOverlay.getByLabel('Private correction / notes').fill('OWNER_SECRET_V1');
    await ownerOverlay.getByRole('button', { name: 'Declare privately' }).click();
    await ownerOverlay.locator('summary', { hasText: /universal:parry: declared, not executed · revision 1/ }).waitFor();

    // Verify GM cannot see player's choice while window is open.
    const gmOverlay = gm.getByRole('region', { name: 'Private declaration collection' });
    await gmOverlay.waitFor();
    assert.equal(await gmOverlay.evaluate(el => el.outerHTML.includes('OWNER_SECRET_V1') || el.outerHTML.includes('universal:parry')), false, 'GM sees no player choice before close');
    assert.equal(await gmOverlay.getByRole('region', { name: 'GM private review' }).count(), 0, 'GM review hidden while open');

    // Owner corrects intent (revision 2), then withdraws (revision 3), then re-declares (revision 4).
    await ownerOverlay.getByLabel('Private correction / notes').fill('OWNER_SECRET_V2_CORRECTED');
    await ownerOverlay.getByRole('button', { name: 'Record private correction' }).click();
    await ownerOverlay.locator('summary', { hasText: /universal:parry: declared, not executed · revision 2/ }).waitFor();

    await ownerOverlay.getByRole('button', { name: 'Withdraw current intent' }).click();
    await ownerOverlay.locator('summary', { hasText: /universal:parry: withdrawn from collection · revision 3/ }).waitFor();

    await ownerOverlay.getByLabel('Private correction / notes').fill('OWNER_SECRET_V4_FINAL');
    await ownerOverlay.getByRole('button', { name: 'Record private correction' }).click();
    await ownerOverlay.locator('summary', { hasText: /universal:parry: declared, not executed · revision 4/ }).waitFor();

    // 4. Real transport reconnect reclaims the same member and recovers the exact deadline/intent.
    const beforeRejoin = await owner.evaluate(() => ({
      deadlineAt: __rwStore.getState().windows[0].deadlineAt,
      windowId: __rwStore.getState().windows[0].windowId,
      socketId: __socket.id,
      changesSent: __outbound.filter(e => e.event === 'reaction_window_change').length,
      roomJoinedListeners: __socket.listeners('room_joined').length
    }));
    assert.equal(beforeRejoin.roomJoinedListeners, 1, 'exactly one room_joined listener');
    const memberIdBefore = host.backend.players.get(beforeRejoin.socketId).id;
    await owner.evaluate(() => __socket.disconnect());
    const disconnectDeadline = Date.now() + 2000;
    while (!host.room.disconnectedPlayers?.['app-owner'] && Date.now() < disconnectDeadline) await new Promise(resolve => setTimeout(resolve, 10));
    assert.equal(host.room.disconnectedPlayers?.['app-owner']?.playerId, memberIdBefore, 'production disconnect retained original member identity');
    await owner.evaluate(async () => {
      const connected = new Promise((resolve, reject) => {
        __socket.once('connect', resolve); __socket.once('connect_error', reject);
      });
      __socket.connect(); await connected;
      const joined = new Promise((resolve, reject) => {
        __socket.once('room_joined', resolve);
        __socket.once('room_error', e => reject(Error(JSON.stringify(e))));
      });
      __socket.emit('join_room', { roomId: S('gameStore').getState().multiplayerRoom.id, playerName: 'app-owner', password: '', isReconnect: true });
      await joined;
    });
    await owner.waitForTimeout(250);
    const afterRejoin = await owner.evaluate(() => ({
      deadlineAt: __rwStore.getState().windows[0].deadlineAt,
      windowId: __rwStore.getState().windows[0].windowId,
      socketId: __socket.id,
      revision: __rwStore.getState().windows[0].intents[0].revision,
      changesSent: __outbound.filter(e => e.event === 'reaction_window_change').length,
      roomJoinedListeners: __socket.listeners('room_joined').length
    }));
    assert.equal(afterRejoin.windowId, beforeRejoin.windowId);
    assert.equal(afterRejoin.deadlineAt, beforeRejoin.deadlineAt, 'rejoin keeps original deadline');
    assert.equal(afterRejoin.revision, 4, 'rejoin recovers current intent revision');
    assert.equal(afterRejoin.changesSent, beforeRejoin.changesSent, 'rejoin does not resubmit intent');
    assert.equal(afterRejoin.roomJoinedListeners, 1, 'still one room_joined listener');
    assert.notEqual(afterRejoin.socketId, beforeRejoin.socketId, 'transport really reconnected');
    assert.equal(host.backend.players.get(afterRejoin.socketId).id, memberIdBefore, 'production rejoin reclaimed the original member ID');
    result.checks.rejoin = afterRejoin;

    result.checks.openOwnerStyles = await inspectPanelStyles(ownerOverlay);
    save('open-owner.aria.yml', await ownerOverlay.ariaSnapshot());
    await owner.screenshot({ path: path.join(out, 'open-owner.png') });

    // 5. Wait for the full 8-second window to close on the server; verify cutoff and GM manual review reveal.
    await ownerOverlay.getByText(/Collection closed — GM manual adjudication required/).waitFor({ timeout: 12000 });
    assert.equal(await ownerOverlay.getByRole('button', { name: 'Record private correction' }).isDisabled(), true, 'owner declaration disabled after cutoff');

    await gmOverlay.getByRole('button', { name: 'Check collection status' }).click();
    await gmOverlay.getByText(/Private review — adjudicate manually/).waitFor();
    await gmOverlay.locator('summary', { hasText: /universal:parry · declared only · pc/ }).click();
    await gmOverlay.getByText(/Revision 4: declared\/corrected — OWNER_SECRET_V4_FINAL/).waitFor();
    assert.equal(await observer.getByRole('region', { name: 'Private declaration collection' }).count(), 0, 'observer still sees nothing after close');
    result.checks.closedGMStyles = await inspectPanelStyles(gmOverlay);
    assert.ok(result.checks.closedGMStyles.headings.some(h => h.tag === 'H4'), 'GM review h4 was inspected');
    assert.ok(result.checks.closedGMStyles.lists.some(list => list.items.length === 4), 'all four private revisions have an inspected list');
    save('closed-gm.aria.yml', await gmOverlay.ariaSnapshot());
    await gm.screenshot({ path: path.join(out, 'closed-gm.png') });
    result.checks.closedReview = {
      windowId: beforeRejoin.windowId,
      gmSawFinalRevision: true,
      observerCount: 0
    };

    // 6. Follow-up opportunity: GM opens a distinct child window linked to the closed parent window,
    // and then exercises serious interruption — manual takeover (D13-10).
    await gmPrep.getByLabel('Causal action reference').fill('parry-success-riposte-opportunity');
    await gmPrep.getByLabel('Occurrence').fill('1');
    await gmPrep.getByLabel('Moment').selectOption('follow_up');
    await gmPrep.getByLabel('Parent closed window').selectOption(beforeRejoin.windowId);
    await gmPrep.getByRole('checkbox', { name: 'Seal no GM declarations' }).check();
    await gmPrep.getByRole('button', { name: 'Seal GM choices and open 8 seconds' }).click();

    await gmOverlay.getByRole('button', { name: 'Serious interruption — manual takeover' }).waitFor();
    const childMeta = await gm.evaluate(parentId => {
      const w = __rwStore.getState().windows.find(x => x.parentWindowId === parentId);
      return w ? { windowId: w.windowId, parentWindowId: w.parentWindowId, status: w.status, moment: w.moment } : null;
    }, beforeRejoin.windowId);
    assert.ok(childMeta && childMeta.windowId !== beforeRejoin.windowId && childMeta.parentWindowId === beforeRejoin.windowId, 'distinct linked follow-up window');

    // Verify the enabled declaration form too, before the approved interruption disables it.
    await owner.setViewportSize({ width: 820, height: 700 });
    assert.equal(await ownerOverlay.getByRole('button', { name: 'Declare privately' }).isEnabled(), true, 'narrow active declaration remains enabled');
    result.checks.narrowOpenControls = await inspectAccessibleControls(ownerOverlay);
    save('narrow-open-owner.aria.yml', await ownerOverlay.ariaSnapshot());
    await owner.screenshot({ path: path.join(out, 'narrow-open-owner.png') });
    await owner.setViewportSize({ width: 1440, height: 1000 });

    await gmOverlay.getByRole('button', { name: 'Serious interruption — manual takeover' }).click();
    await gmOverlay.getByText(/Collection interrupted — manual GM takeover/).waitFor();
    await ownerOverlay.getByText(/Collection interrupted — manual GM takeover/).waitFor();
    result.checks.followUpAndInterrupt = childMeta;

    // Narrow viewport check (820x700 supported tablet width) for collector overlay bounds and no horizontal overflow.
    await owner.setViewportSize({ width: 820, height: 700 });
    result.checks.narrow = await ownerOverlay.evaluate(el => ({
      rect: el.getBoundingClientRect().toJSON(),
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth
    }));
    assert.ok(result.checks.narrow.rect.x >= 0 && result.checks.narrow.rect.right <= 820, 'narrow overlay stays within viewport');
    assert.equal(result.checks.narrow.scrollWidth, result.checks.narrow.clientWidth, 'no horizontal overflow at narrow width');
    result.checks.narrow.styles = await inspectPanelStyles(ownerOverlay);
    result.checks.narrow.controls = await inspectAccessibleControls(ownerOverlay);
    save('narrow-owner.aria.yml', await ownerOverlay.ariaSnapshot());
    await owner.screenshot({ path: path.join(out, 'narrow-owner.png') });
    await owner.setViewportSize({ width: 1440, height: 1000 });

    // 7. Zero side effects: no P7 consequence/approval/spell/resource/chat emissions or mutations.
    for (const [role, page] of Object.entries(pages)) {
      const outbound = await page.evaluate(() => __outbound.slice(__p13bOutboundStart));
      assert.deepEqual(forbidden(outbound), [], `forbidden outbound events on ${role}`);
    }
    const ownerPoolsAfter = await owner.evaluate(() => JSON.stringify({
      health: S('characterStore').getState().health,
      mana: S('characterStore').getState().mana,
      ap: S('characterStore').getState().actionPoints,
      classResource: S('characterStore').getState().classResource
    }));
    assert.equal(ownerPoolsAfter, ownerPoolsBefore, 'owner pools and class resource unchanged');
    assert.equal(host.room.gameState.actorConsequences.receipts.length, receiptsBefore, 'no P7 receipt created');
    assert.equal(/GM_SEALED_SECRET|OWNER_SECRET|universal:parry|ogre-cleave-roll-1/.test(JSON.stringify(host.room.gameState)), false, 'no private window data in room gameState');
    result.checks.mutationEvidence = { ownerPoolsUnchanged: true, privateDataAbsent: true,
      receiptsBefore, receiptsAfter: host.room.gameState.actorConsequences.receipts.length };
    const stateAfter = stripJoinCut(host.room.gameState);
    if (stateAfter !== stateBefore) {
      const changes = [];
      const compare = (a, b, path = '') => {
        if (Object.is(a, b)) return;
        if (a && b && typeof a === 'object' && typeof b === 'object' && Array.isArray(a) === Array.isArray(b)) {
          for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) compare(a[key], b[key], `${path}/${key}`);
        } else changes.push({ path, before: a, after: b });
      };
      compare(JSON.parse(stateBefore), JSON.parse(stateAfter));
      save('unexpected-state-differences.json', { changes, objectValuesEqual: changes.length === 0,
        before: JSON.parse(stateBefore), after: JSON.parse(stateAfter) });
    }
    // Keep the supplied exact comparison: diagnostics above do not exempt or normalize any field.
    assert.equal(stripJoinCut(host.room.gameState), stateBefore, 'room gameState untouched by private collector');
    result.checks.stateComparison = { ignoredFields: ['actorProjection.cut', 'maps.*.actorProjection.cut'],
      allOtherGameStateEqual: true, privateDataAbsent: true, ownerPoolsUnchanged: true,
      receiptsBefore, receiptsAfter: host.room.gameState.actorConsequences.receipts.length };
    result.checks.zeroSideEffects = true;
    result.passed = true;
  } catch (error) {
    result.failure = error.stack;
    for (const [role, page] of Object.entries(pages)) {
      save(`${role}-failure.aria.yml`, await page.locator('body').ariaSnapshot().catch(() => 'unavailable'));
    }
    throw error;
  } finally {
    result.endedAt = new Date().toISOString();
    result.assetManifestSha256 = crypto.createHash('sha256')
      .update(fs.readFileSync(path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json')))
      .digest('hex');
    save('result.json', result);
    await browser.close();
    await host.stop();
  }
}

main().then(() => process.exit(0), error => { console.error(error); process.exit(1); });
