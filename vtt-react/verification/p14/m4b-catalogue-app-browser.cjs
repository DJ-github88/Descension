// M4B normal-App witness: class card prepare/save/admit, class-card cast, owner roll,
// target-owner healing acceptance, GM confirmation. Auth/provider/lease/cloud are fixtures.
// Also runs the affected weapon-info UI check on the same built artifact (no cast, no repeat acceptance).
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const actors = require('../../../server/services/actorConsequences');
const installed = require('../../../server/services/installedAuthoredAbilities');
const payments = require('../../../server/services/spellPayments');
const fixtureCharacters = require('./m4b-fixture-characters.cjs');
const out = process.env.M4B_APP_OUTPUT;
assert.ok(out && path.isAbsolute(out) && process.env.APP_BUILD_DIR);
fs.mkdirSync(out, { recursive: true });
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const report = { checks: {}, errors: [], limits: [
  'Normal production App and registered handlers; auth/provider/ownership/lease/cloud and player identity are fixtures.',
  'The source/target PCs and class resources are fixture state; no live Firebase or second physical device.'
] };

async function setup(page, url, uid) {
  page.on('pageerror', e => report.errors.push({ uid, message: e.message, stack: e.stack }));
  page.on('console', message => { if (message.type() === 'error') report.errors.push({ uid, console: message.text() }); });
  await page.goto(url + '/game');
  await page.locator('.action-slot').first().waitFor({ timeout: 60000 });
  // Dismiss the consent banner after the App renders (checking right after goto raced its mount).
  const consent = page.getByRole('dialog', { name: /Analytics.*Privacy Consent/ });
  await consent.waitFor({ timeout: 5000 }).catch(() => {});
  if (await consent.count()) await consent.getByRole('button', { name: /Decline/i }).click();
  await page.waitForFunction(() => Object.keys(window).some(k => k.startsWith('webpackChunk')), null, { timeout: 60000 });
  await page.addScriptTag({ url: url + '/integration-io.js' });
  return page.evaluate(async ({ uid, fixtureCharacter }) => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const key = Object.keys(window).find(k => k.startsWith('webpackChunk')); window[key].push([[99119], {}, r => window.__req = r]);
    const moduleWith = text => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!pair) throw Error('Missing compiled module ' + text); return __req(pair[0]); };
    window.__registry = moduleWith('registerStore:'); window.S = name => __registry.getStore(name);
    window.__actors = moduleWith('acceptRecoveredActorSnapshot:');
    window.__spell = moduleWith('An unresolved spell approval is retained; check or withdraw it first.');
    window.__registerSpells = Object.values(__spell).find(f => typeof f === 'function' && f.toString().includes('actor_spell_pending') && f.toString().includes('socket:'));
    if (!__registerSpells) throw Error('Missing compiled spell registration');
    for (let i = 0; i < 100 && !S('authStore').getState().isAuthInitialized; i++) await new Promise(r => setTimeout(r, 100));
    S('authStore').getState().setUser({ uid, displayName: uid, getIdToken: async() => uid });
    await new Promise(r => setTimeout(r, 1000));
    window.__socket = io(fixture.backendUrl, { transports: ['websocket'], forceNew: true, auth: { token: uid } });
    await new Promise((resolve, reject) => { __socket.once('connect', resolve); __socket.once('connect_error', reject); });
    S('gameStore').setState({ isInMultiplayer: false, multiplayerRoom: null, multiplayerSocket: __socket });
    __registerSpells({ socket: __socket });
    const joined = new Promise((resolve, reject) => { __socket.once('room_joined', resolve); __socket.once('room_error', e => reject(Error(JSON.stringify(e)))); });
    __socket.emit('join_room', { roomId: fixture.roomId, playerName: uid, password: '' }); await joined;
    window.__outbound = []; const emit = __socket.emit.bind(__socket); __socket.emit = (event, ...args) => { window.__outbound.push({ event, payload: args[0] }); return emit(event, ...args); };
    S('gameStore').setState({ isInMultiplayer: true, isGMMode: uid === 'app-gm', multiplayerRoom: { id: fixture.roomId }, multiplayerSocket: __socket,
      cameraX: 0, cameraY: 0, zoomLevel: 1, playerZoom: 1, dynamicFogEnabled: false, gridSize: 50, feetPerTile: 5 });
    S('mapStore').setState({ currentMapId: fixture.mapId });
    __actors.registerActorHandlers({ socket: __socket });
    const roomBefore = S('gameStore').getState().multiplayerRoom, uidBefore = S('authStore').getState().user?.uid;
    const result = await __actors.refreshActorSnapshot();
    if (!result.success) {
      const roomAfter = S('gameStore').getState().multiplayerRoom;
      throw Error(JSON.stringify({ result, roomSame: roomBefore === roomAfter, roomBefore: roomBefore?.id || null, roomAfter: roomAfter?.id || null,
        uidBefore, uidAfter: S('authStore').getState().user?.uid, socketSame: S('gameStore').getState().multiplayerSocket === __socket }));
    }
    // Hydrate one complete explicit fixture character through production loadCharacter, only
    // after boot initialization settles. GameProvider's initializeCharacterSystem authors a random
    // placeholder (random heritage/equipment) for an empty roster; a partial store write over it
    // left heritage/equipment behind and made effective Spirit vary (18/19/20) between runs.
    const store = S('characterStore');
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    let waited = 0;
    for (; waited < 15000 && !(store.getState().currentCharacterId && !store.getState().isLoading); waited += 100) await sleep(100);
    for (let stable = 0, last = null; stable < 5; ) { const s = store.getState(), key = `${s.currentCharacterId}|${s.characters.length}|${!!s.isLoading}`; stable = key === last ? stable + 1 : 0; last = key; await sleep(100); }
    const boot = { currentCharacterId: store.getState().currentCharacterId || null, rosterSize: store.getState().characters.length, waitedMs: waited };
    store.setState({ characters: [JSON.parse(JSON.stringify(fixtureCharacter))] });
    const game = S('gameStore');
    game.setState({ isInMultiplayer: false });
    store.getState().loadCharacter(fixtureCharacter.id);
    if (fixtureCharacter.health) store.setState({ health: { ...fixtureCharacter.health } });
    game.setState({ isInMultiplayer: true });
    store.getState().syncWithMultiplayer();
    const hydrated = store.getState();
    if (hydrated.currentCharacterId !== fixtureCharacter.id) throw Error('Fixture character did not load: ' + hydrated.currentCharacterId);
    const hydration = { boot, currentCharacterId: hydrated.currentCharacterId, race: hydrated.race, subrace: hydrated.subrace, background: hydrated.background,
      statsModel: hydrated.statsModel, stats: hydrated.stats, equipped: Object.entries(hydrated.equipment || {}).filter(([, item]) => item).map(([slot]) => slot),
      effective: hydrated.getTotalStatsWithEffects() };
    if (uid === 'app-owner') {
      const selected = __actors.selectOwnerAttachment(fixture.refs.pc); if (!selected.success) throw Error(JSON.stringify(selected));
    }
    if (uid === 'app-target') {
      const selected = __actors.selectOwnerAttachment(fixture.refs.ally); if (!selected.success) throw Error(JSON.stringify(selected));
    }
    return { fixture, hydration, classes: Object.keys(window.S('characterStore').getState()) };
  }, { uid, fixtureCharacter: fixtureCharacters.characters[uid] });
}

const book = page => page.getByRole('dialog', { name: 'Spellbook', exact: true });
async function openCharacter(page) {
  await page.getByRole('button', { name: /^Character(?: \(\d+\))?$/ }).first().click();
  const tab = page.getByRole('button', { name: 'Character', exact: true });
  if (await tab.count()) await tab.last().click();
  await page.locator('.spell-action-bar-assembly').waitFor({ timeout: 30000 });
}
async function openBook(page) {
  await page.locator('.wow-nav-category-header').filter({ hasText: /^Character/ }).first().click();
  await page.locator('.wow-nav-flyout').getByRole('button', { name: /^Spellbook/ }).click();
  await book(page).waitFor();
  await book(page).getByRole('button', { name: 'Spell Library', exact: true }).click();
  await page.waitForTimeout(1500);
}
async function closeBook(page) {
  const overlay = page.locator('.spell-detail-overlay');
  if (await overlay.count()) {
    const overlayClose = overlay.getByRole('button', { name: 'Close', exact: true });
    if (await overlayClose.count()) await overlayClose.last().click();
    await page.waitForTimeout(200);
  }
  const close = book(page).getByRole('button', { name: 'Close', exact: true });
  if (await close.count()) await close.first().click();
  else await page.keyboard.press('Escape');
}
async function clickClassSpell(page, name) {
  for (let i = 0; i < 4; i++) {
    const card = book(page).getByRole('button', { name: `${name} details`, exact: true });
    if (await card.count()) { const first = card.first(); await first.focus(); await first.press('Enter'); return; }
    const text = book(page).getByText(name, { exact: true });
    if (await text.count()) return text.first().click();
    const next = book(page).getByRole('button', { name: 'Next Page', exact: true });
    if (!(await next.count()) || await next.isDisabled()) break;
    await next.click();
  }
  throw Error(`Catalogue class card not found: ${name}`);
}
async function clickSavedSpell(page, name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  for (let i = 0; i < 4; i++) {
    const admission = book(page).getByRole('region', { name: `Room admission for ${name}`, exact: true });
    if (await admission.count()) {
      const wrapper = book(page).locator('[data-spell-id]').filter({ has: admission });
      if (await wrapper.count()) return wrapper.last().click();
    }
    const saved = book(page).locator(`[data-spell-id^="${slug}-"]`).filter({ hasText: name });
    if (await saved.count()) return saved.last().click();
    const card = book(page).getByRole('button', { name: `${name} details`, exact: true });
    if (await card.count()) return card.first().click();
    const text = book(page).getByText(name, { exact: true });
    if (await text.count()) return text.first().click();
    const next = book(page).getByRole('button', { name: 'Next Page', exact: true });
    if (!(await next.count()) || await next.isDisabled()) break;
    await next.click();
  }
  throw Error(`Saved catalogue spell not found: ${name}`);
}

async function main() {
  const host = await require('./m4b-catalogue-app-server.cjs').start();
  for (const event of ['actor_snapshot', 'actor_consequence', 'actor_spell_approve', 'actor_spell_list', 'actor_authored_admit', 'actor_authored_list', 'actor_spell_target_respond', 'join_room']) host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const pages = [];
  try {
    const gm = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(gm);
    report.setup = await setup(gm, host.url, 'app-gm'); host.setPlayerCharacter('app-gm', { id: 'gm', class: 'Martyr' });
    await openBook(gm);
    await clickClassSpell(gm, 'Restorative Prayer');
    await gm.getByRole('button', { name: 'Prepare this catalogue ability in the Wizard', exact: true }).click();
    const complete = gm.getByRole('button', { name: /Complete Spell/ });
    if (await complete.count()) await complete.first().click();
    else await gm.getByRole('button', { name: 'Finalize', exact: true }).click();
    await gm.waitForFunction(() => Object.values(localStorage).some(value => value.includes('"catalogueSource"') && value.includes('martyr_restorative_prayer')), null, { timeout: 15000 });
    const savedCatalogue = await gm.evaluate(() => {
      const key = Object.keys(localStorage).find(name => name.endsWith(':library.spellData'));
      const data = JSON.parse(localStorage.getItem(key));
      return data.payload.data.spells.find(spell => spell.catalogueSource?.spellId === 'martyr_restorative_prayer');
    });
    assert.ok(savedCatalogue?.authoredDraft);
    assert.equal(savedCatalogue.catalogueSource.record.id, 'martyr_restorative_prayer');
    assert.equal(savedCatalogue.catalogueSource.record.healingConfig.formula, '1d4 + spirit');
    assert.equal(savedCatalogue.catalogueSource.record.resourceCost.resourceValues.mana, 5);
    assert.equal(savedCatalogue.catalogueSource.record.devotionGain, 1);
    assert.equal(savedCatalogue.catalogueSource.record.targetingConfig.rangeDistance, 30);
    report.checks.savedCatalogue = { recordHash: savedCatalogue.catalogueSource.recordHash, authoredDefinitionId: savedCatalogue.authoredDefinitionId };
    await closeBook(gm);
    await openBook(gm);
    await book(gm).getByRole('button', { name: 'Spell Library', exact: true }).click();
    report.checks.admissionRegions = await gm.locator('[aria-label="Room admission for Restorative Prayer"]').count();
    report.checks.cardIds = await gm.locator('[data-spell-id]').evaluateAll(els => els.map(e => e.getAttribute('data-spell-id')));
    await clickSavedSpell(gm, 'Restorative Prayer');
    const admission = gm.getByRole('region', { name: 'Room admission for Restorative Prayer', exact: true });
    await admission.waitFor();
    await admission.getByRole('button', { name: 'Admit this saved version', exact: true }).click();
    await admission.getByText(/Admitted for immediate damage\/healing/).waitFor({ timeout: 10000 });
    report.checks.catalogueAdmitted = true;
    const entry = installed.list(host.room).entries.find(candidate => candidate.canonicalDefinition.catalogueSource?.spellId === 'martyr_restorative_prayer');
    assert.ok(entry);
    assert.equal(entry.descriptor.compilerVersion, 'p14-m4b-class-payment-1');
    assert.deepEqual(entry.descriptor.classPayment, { domain: 'devotionGauge', price: { cost: 0, gain: 1, required: 0 } });
    assert.deepEqual(entry.descriptor.price, { ap: 1, mana: 5 });
    assert.equal(entry.canonicalDefinition.effect.formula, '1d4 + spirit');
    assert.equal(entry.canonicalDefinition.catalogueSource.recordHash, savedCatalogue.catalogueSource.recordHash);
    report.checks.catalogueEntry = { definitionRef: entry.definitionRef, descriptor: entry.descriptor, effect: entry.canonicalDefinition.effect };
    save('catalogue-admission.aria.yml', await admission.ariaSnapshot());
    await closeBook(gm);

    const owner = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(owner);
    report.checks.ownerHydration = (await setup(owner, host.url, 'app-owner')).hydration;
    // Expected effective Spirit from the explicit fixture record (see m4b-fixture-characters.cjs), asserted before any roll.
    assert.equal(report.checks.ownerHydration.effective.spirit, fixtureCharacters.EXPECTED_OWNER_EFFECTIVE_SPIRIT, JSON.stringify(report.checks.ownerHydration));
    assert.deepEqual(report.checks.ownerHydration.equipped, []);
    host.setPlayerCharacter('app-owner', { id: 'ilse', class: 'Martyr' });
    await owner.getByText('Admitted abilities', { exact: true }).click();
    await owner.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
    await owner.getByText(/Room admission refreshed/).waitFor({ timeout: 10000 });
    await openBook(owner);
    const classCard = book(owner).getByRole('button', { name: 'Restorative Prayer details', exact: true }).first();
    await classCard.waitFor({ timeout: 10000 });
    await classCard.dragTo(owner.locator('.action-bar-assembly .action-slot').first());
    await closeBook(owner);
    const slot = owner.locator('.action-bar-assembly .action-slot.filled').first();
    await slot.click();
    const dialog = owner.getByRole('dialog', { name: 'Supported spell cast', exact: true }); await dialog.waitFor();
    await dialog.getByRole('combobox').selectOption('character:app-hall:ally');
    report.checks.ownerAttestedScores = await dialog.getByText(/Caster effective scores are owner-attested/).textContent();
    assert.match(report.checks.ownerAttestedScores, new RegExp(`spirit ${fixtureCharacters.EXPECTED_OWNER_EFFECTIVE_SPIRIT}\\b`));
    await dialog.getByLabel('d4 face 1', { exact: true }).fill('4');
    await dialog.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    report.checks.ownerReading = await dialog.getByText(/Recorded physical roll/).textContent();
    const tgt = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(tgt);
    await setup(tgt, host.url, 'app-target'); host.setPlayerCharacter('app-target', { id: 'ally', class: 'Arcanoneer' });
    await dialog.getByRole('button', { name: 'Approve price and send to GM', exact: true }).click();
    await dialog.getByText(/Awaiting GM adjudication/).waitFor();
    await tgt.waitForTimeout(1500);
    const serverProposal = payments.listAll(host.room).find(entry => entry.approval.spell.name === 'Restorative Prayer');
    report.checks.serverProposal = serverProposal ? { target: serverProposal.approval.target, policy: serverProposal.targetPolicy || null } : null;
    report.checks.serverTargetPlayers = [...host.backend.players.values()].filter(player => player.userId === 'app-target')
      .map(player => ({ userId: player.userId, characterId: player.character?.id, roomId: player.roomId }));
    report.checks.targetList = await tgt.evaluate(async() => new Promise(resolve => {
      window.__socket.emit('actor_spell_list', { roomId: window.S('gameStore').getState().multiplayerRoom.id }, result => {
        resolve({ success: result?.success, code: result?.code, proposals: (result?.targetProposals || []).length, pending: (result?.pending || []).length });
      });
    }));
    const targetSummary = tgt.getByText(/Stunned notices and voluntary proposals/);
    await targetSummary.waitFor({ timeout: 15000 });
    await targetSummary.click();
    const acceptHealing = tgt.getByRole('button', { name: 'Accept this exact healing proposal', exact: true });
    await acceptHealing.waitFor({ timeout: 10000 });
    const beforeAcceptance = actors.clone(host.room.gameState.maps);
    await acceptHealing.click();
    report.checks.targetAccepted = true; save('target-acceptance.aria.yml', await tgt.locator('body').ariaSnapshot());
    assert.deepEqual(host.room.gameState.maps, beforeAcceptance);
    const approvalEntry = payments.listAll(host.room).find(candidate => candidate.approval.spell.name === 'Restorative Prayer');
    assert.ok(approvalEntry);
    assert.deepEqual(approvalEntry.approval.price, { ap: 1, mana: 5 });
    assert.deepEqual(approvalEntry.approval.classPayment.price, { cost: 0, gain: 1, required: 0 });
    const amount = approvalEntry.approval.roll.total;
    assert.equal(approvalEntry.approval.rollAttributes?.spirit, fixtureCharacters.EXPECTED_OWNER_EFFECTIVE_SPIRIT);
    assert.equal(approvalEntry.approval.roll.constant, fixtureCharacters.EXPECTED_OWNER_EFFECTIVE_SPIRIT);
    report.checks.approval = { price: approvalEntry.approval.price, classPayment: approvalEntry.approval.classPayment, roll: approvalEntry.approval.roll };

    const sourceBefore = actors.clone(host.room.gameState.maps['app-hall'].characterTokens.pc.character);
    const card = gm.locator('.p9-gm-card').filter({ hasText: 'Restorative Prayer' }); await card.waitFor({ timeout: 10000 });
    await card.getByRole('checkbox').check();
    await card.getByLabel('Final healing', { exact: true }).fill(String(amount));
    save('gm-catalogue.aria.yml', await card.ariaSnapshot());
    const receiptCount = host.room.gameState.actorConsequences.receipts.length;
    await card.getByRole('button', { name: 'Accept one consequence', exact: true }).click();
    await gm.getByText(/Ilse casts Restorative Prayer/).first().waitFor({ timeout: 10000 });
    const receipt = JSON.parse(JSON.stringify(host.room.gameState.actorConsequences.receipts.at(-1)));
    const chosen = JSON.parse(receipt.adjudication.chosenResult);
    const source = host.room.gameState.maps['app-hall'].characterTokens.pc, target = host.room.gameState.maps['app-hall'].characterTokens.ally;
    assert.equal(host.room.gameState.actorConsequences.receipts.length, receiptCount + 1);
    assert.equal(receipt.adjudication.finalAmount, amount);
    assert.equal(chosen.roll.total, amount); assert.equal(chosen.roll.constant, approvalEntry.approval.roll.constant); assert.deepEqual(chosen.roll.dice[0].faces, [4]);
    assert.equal(chosen.actualHealing, 10);
    assert.equal(source.character.actionPoints.current, 2); assert.equal(source.character.tempActionPoints, 0);
    assert.equal(source.character.mana.current, 8); assert.equal(source.character.tempMana, 0);
    const poolBefore = { ap: sourceBefore.actionPoints.current + sourceBefore.tempActionPoints, mana: sourceBefore.mana.current + sourceBefore.tempMana };
    const poolAfter = { ap: source.character.actionPoints.current + source.character.tempActionPoints, mana: source.character.mana.current + source.character.tempMana };
    const paid = { ap: poolBefore.ap - poolAfter.ap, mana: poolBefore.mana - poolAfter.mana };
    assert.equal(paid.ap, approvalEntry.approval.price.ap);
    assert.equal(paid.mana, approvalEntry.approval.price.mana);
    assert.equal(sourceBefore.mana.current - source.character.mana.current, 2);
    assert.equal(sourceBefore.tempMana - source.character.tempMana, 3);
    report.checks.paymentReconciliation = {
      price: approvalEntry.approval.price,
      before: { baseMana: sourceBefore.mana.current, tempMana: sourceBefore.tempMana, totalMana: poolBefore.mana, baseAp: sourceBefore.actionPoints.current, tempAp: sourceBefore.tempActionPoints, totalAp: poolBefore.ap },
      after: { baseMana: source.character.mana.current, tempMana: source.character.tempMana, totalMana: poolAfter.mana, baseAp: source.character.actionPoints.current, tempAp: source.character.tempActionPoints, totalAp: poolAfter.ap },
      paid: { baseMana: sourceBefore.mana.current - source.character.mana.current, tempMana: sourceBefore.tempMana - source.character.tempMana, totalMana: paid.mana, baseAp: sourceBefore.actionPoints.current - source.character.actionPoints.current, tempAp: sourceBefore.tempActionPoints - source.character.tempActionPoints, totalAp: paid.ap },
      conserved: { mana: paid.mana === approvalEntry.approval.price.mana, ap: paid.ap === approvalEntry.approval.price.ap }
    };
    assert.equal(source.state.classPayment.value.current, 1); assert.equal(source.state.classPayment.value.bonusLevels, 1);
    assert.equal(target.character.health.current, 30); assert.equal(target.character.tempHealth, 3);
    report.checks.receipt = receipt;

    // Affected weapon-info UI check on the same artifact. It never casts and does not repeat the
    // M4B acceptance; a UI finding is recorded without discarding the completed M4B evidence.
    for (const page of pages) await page.close().catch(() => {});
    const uiOut = path.join(out, 'weapon-info-ui');
    try {
      const { execFileSync } = require('child_process');
      execFileSync(process.execPath, [path.join(__dirname, 'weapon-info-ui-app-browser.cjs')], {
        env: { ...process.env, WEAPON_UI_OUTPUT: uiOut, M4B_APP_PORT: process.env.WEAPON_UI_PORT || '4182' },
        stdio: 'inherit', timeout: 180000
      });
      report.checks.weaponInfoUi = JSON.parse(fs.readFileSync(path.join(uiOut, 'result.json'), 'utf8'));
    } catch (error) {
      let partial = null;
      try { partial = JSON.parse(fs.readFileSync(path.join(uiOut, 'result.json'), 'utf8')); } catch (_) {}
      report.checks.weaponInfoUi = { ...(partial || {}), error: error.message };
      report.limits.push('Weapon-info UI sub-run did not complete; see ' + uiOut + '.');
    }
    report.passed = true;
    save('result.json', report);
  } catch (error) {
    report.failure = error.stack;
    for (let i = 0; i < pages.length; i++) save(`failure-${i}.aria.yml`, await pages[i].locator('body').ariaSnapshot().catch(() => 'unavailable'));
    save('result.json', report); throw error;
  } finally { await browser.close(); await host.stop(); }
}
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });











