'use strict';
/* global S, __socket, __actors, __outbound, __inbound, __req, __registerSpells */

const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { start: startRoomHost, STAGE_ROOT, BUILD_DIR, clone, resolveFirst } = require('./room-host.cjs');

const { chromium } = require(resolveFirst([
  path.join(STAGE_ROOT, 'vtt-react/node_modules/playwright'),
  'D:\\VTT\\vtt-react\\node_modules\\playwright'
]));

const DEFAULT_EVIDENCE_DIR = 'D:\\VTT\\handoff\\player-wizard-gm-review-acceptance-20261122\\evidence';
const EVIDENCE_DIR = path.resolve(process.env.EVIDENCE_DIR || DEFAULT_EVIDENCE_DIR);
const VERDICT_LABEL = process.env.VERDICT_LABEL || 'acceptance-run';
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const saveEvidence = (name, data) => {
  const full = path.join(EVIDENCE_DIR, name);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, typeof data === 'string' ? data : JSON.stringify(data, null, 2));
  return full;
};
const waitUntil = async (fn, attempts = 80, delayMs = 150) => {
  for (let i = 0; i < attempts; i += 1) {
    const val = await fn();
    if (val) return val;
    await sleep(delayMs);
  }
  return fn();
};

const book = (page) => page.getByRole('dialog', { name: 'Spellbook', exact: true });
const ownerDialog = (page) => page.getByRole('dialog', { name: 'Supported spell cast', exact: true });
const clockUI = (page) => page.getByRole('region', { name: 'Authenticated turn expiry', exact: true });
const reviewGroup = (page, spellName) => page.getByRole('group', { name: `GM review for ${spellName}`, exact: true });
const gmQueue = (page) => page.getByRole('region', { name: 'GM review requests', exact: true });

const RECIPES = {
  immediate: {
    name: 'Cinder Glass',
    description: 'Hurls a zero-mana splinter of molten glass at a single target.',
    school: 'Ember',
    damageType: 'ember',
    damageFormula: '2d6+1',
    ap: 1,
    mana: 0,
    editedFormula: '4d6+2',
    editedMana: 4
  },
  rider: {
    name: 'Glacier Snare',
    description: 'Lashes one target with bitter rime cords that slow its stride.',
    school: 'Rime',
    damageType: 'rime',
    damageFormula: '1d8+2',
    movementRider: {
      label: 'Permafrost Drag',
      feet: -15,
      expiry: 'target-next-end',
      duration: "Until the end of the target's next turn",
      gmNote: 'GM confirms range and movement penalty before applying.'
    },
    ap: 1,
    mana: 2,
    editedFormula: '3d8+2',
    editedFeet: -25,
    editedMana: 5
  }
};

async function setupRouteAndErrorHooks(page, uid, networkRefusals, pageErrors, consoleErrors) {
  if (page.__acceptanceHooksInstalled) return;
  page.__acceptanceHooksInstalled = true;

  page.on('console', (msg) => {
    if (msg.type() === 'error' && !/Failed to load resource|fonts\.|firebase|net::ERR/i.test(msg.text())) {
      consoleErrors.push({ uid, text: msg.text().slice(0, 1500) });
      if (consoleErrors.length <= 10) console.error('[console.error]', uid, msg.text().slice(0, 400));
    }
  });
  page.on('pageerror', (err) => {
    if (!/Failed to fetch|blockedbyclient|Loading chunk/i.test(String(err.message))) {
      pageErrors.push({ uid, message: err.message, stack: err.stack });
    }
  });

  const proto = Object.getPrototypeOf(page.locator('body'));
  if (!proto.__acceptancePatched) {
    proto.__acceptancePatched = true;
    const origClick = proto.click;
    proto.click = async function (options = {}) {
      try {
        return await origClick.call(this, { timeout: 20000, ...options });
      } catch (err) {
        if (options.force || !/not stable|intercepts pointer/.test(String(err.message))) throw err;
        return origClick.call(this, { ...options, force: true });
      }
    };
  }

  await page.route('**/*', (route) => {
    const u = new URL(route.request().url());
    if (u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com') {
      return route.fulfill({ status: 200, contentType: 'text/css', body: '' });
    }
    if (u.hostname === 'cdnjs.cloudflare.com') {
      return route.fulfill({ status: 200, contentType: 'application/octet-stream', body: '' });
    }
    if (u.hostname === 'firebaseinstallations.googleapis.com') {
      networkRefusals.push({ uid, origin: u.origin, fixture: 'firebase-installations' });
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: 'projects/mythrill-ff7c6/installations/fixture-fid',
          fid: 'fixture-fid',
          refreshToken: 'fixture-refresh-token',
          authToken: { token: 'fixture-token', expiresIn: '604800s' }
        })
      });
    }
    if (/(googleapis\.com|firebaseio\.com|firebaseapp\.com)$/.test(u.hostname)) {
      networkRefusals.push({ uid, origin: u.origin, fixture: 'mock-200' });
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
    if (/up\.railway\.app$/.test(u.hostname)) {
      return route.abort();
    }
    return route.continue();
  });
}

async function connectClient(page, host, uid, {
  isGM = false,
  pcId = null,
  character = null,
  mode = 'initial',
  outboundLog = [],
  inboundLog = []
}) {
  if (mode === 'initial') {
    await page.goto(`${host.url}/game`);
    await page.locator('.action-slot').first().waitFor({ timeout: 60000 });
    const consent = page.getByRole('dialog', { name: /Analytics.*Privacy Consent/ });
    if (await consent.count()) {
      await consent.getByRole('button', { name: /Decline/i }).click();
    }
    await page.addScriptTag({ url: `${host.url}/integration-io.js` });
  } else if (mode === 'reload') {
    outboundLog.push(...(await page.evaluate(() => window.__outbound || []).catch(() => [])));
    inboundLog.push(...(await page.evaluate(() => window.__inbound || []).catch(() => [])));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('.action-slot').first().waitFor({ timeout: 60000 });
    const consent = page.getByRole('dialog', { name: /Analytics.*Privacy Consent/ });
    if (await consent.count()) {
      await consent.getByRole('button', { name: /Decline/i }).click();
    }
    await page.addScriptTag({ url: `${host.url}/integration-io.js` });
  }

  return page.evaluate(async ({ uid, isGM, pcId, character, mode }) => {
    const fixture = await fetch('/integration-fixture.json').then((r) => r.json());
    const fnBy = (mod, name, snippet) => {
      if (mod && typeof mod[name] === 'function') return mod[name];
      return Object.values(mod || {}).find((f) => typeof f === 'function' && f.toString().includes(snippet));
    };

    if (mode === 'socket_reconnect') {
      const custodySnapshot = () => Object.fromEntries(
        Object.keys(localStorage)
          .filter((k) => k.includes('spell') || k.includes('p9') || k.includes('authoredReviewRequests'))
          .sort()
          .map((k) => [k, localStorage.getItem(k)])
      );
      const custodyBefore = custodySnapshot();
      window.__socket.disconnect();
      await new Promise((r) => setTimeout(r, 150));
      window.__socket.connect();
      await new Promise((resolve, reject) => {
        window.__socket.once('connect', resolve);
        window.__socket.once('connect_error', reject);
      });
      const rejoined = new Promise((resolve, reject) => {
        window.__socket.once('room_joined', resolve);
        window.__socket.once('room_error', (err) => reject(Error(JSON.stringify(err))));
      });
      window.__socket.emit('join_room', { roomId: fixture.roomId, playerName: uid, password: '' });
      await rejoined;
      await new Promise((r) => setTimeout(r, 500));
      const snapRes = await window.__actors.refreshActorSnapshot();
      if (!snapRes.success) throw Error('reconnect refreshActorSnapshot failed: ' + JSON.stringify(snapRes));
      const custodyAfter = custodySnapshot();
      return {
        custodyUnchanged: JSON.stringify(custodyBefore) === JSON.stringify(custodyAfter),
        listenersCount: window.__socket.listeners('room_joined').length
      };
    }

    const key = Object.keys(window).find((k) => k.startsWith('webpackChunk'));
    window[key].push([[99421 + Math.floor(Math.random() * 10000)], {}, (r) => { window.__req = r; }]);
    const moduleWith = (text) => {
      const pair = Object.entries(window.__req.m).find(([, f]) => f.toString().includes(text));
      if (!pair) throw Error('Missing compiled module: ' + text);
      return window.__req(pair[0]);
    };
    window.__registry = moduleWith('registerStore:');
    window.S = (name) => window.__registry.getStore(name);
    window.__actors = moduleWith('acceptRecoveredActorSnapshot:');
    window.__spell = moduleWith('An unresolved spell approval is retained; check or withdraw it first.');
    window.__registerSpells = fnBy(window.__spell, 'registerSpellConsequenceHandlers', 'actor_spell_pending');
    window.__refreshAuthored = fnBy(window.__spell, 'refreshAuthoredAbilities', 'actor_authored_list');
    window.__refreshApprovals = fnBy(window.__spell, 'refreshSpellApprovals', 'actor_spell_list');
    window.__restoreOwner = fnBy(window.__spell, 'restoreOwnerStatus', 'latest?.approval');
    window.__registerRoomJoined = Object.values(moduleWith('[roomRejoin] subscriber failed')).find(
      (fn) => typeof fn === 'function' && fn.toString().includes('room_joined')
    );
    if (!window.__registerSpells) throw Error('Missing compiled spell registration');
    if (!window.__registerRoomJoined) throw Error('Missing compiled registerRoomJoinedListener');

    window.S('authStore').getState().setUser({ uid, displayName: uid, getIdToken: async () => uid });
    await new Promise((r) => setTimeout(r, 800));

    window.__socket = window.io(fixture.backendUrl, { transports: ['websocket'], forceNew: true, auth: { token: uid } });
    await new Promise((resolve, reject) => {
      window.__socket.once('connect', resolve);
      window.__socket.once('connect_error', reject);
    });

    window.__outbound = [];
    window.__inbound = [];
    window.__socket.onAny((event, payload) => {
      if (/^authored_review_/.test(event)) {
        window.__inbound.push({
          event,
          status: payload?.request?.status || null,
          requestId: payload?.request?.requestId || null,
          ts: Date.now()
        });
      }
    });
    const origEmit = window.__socket.emit.bind(window.__socket);
    window.__socket.emit = (event, ...args) => {
      window.__outbound.push({ event, payload: args[0], ts: Date.now() });
      return origEmit(event, ...args);
    };

    window.__registerRoomJoined(window.__socket);
    const joined = new Promise((resolve, reject) => {
      window.__socket.once('room_joined', resolve);
      window.__socket.once('room_error', (err) => reject(Error(JSON.stringify(err))));
    });
    window.__socket.emit('join_room', { roomId: fixture.roomId, playerName: uid, password: '' });
    await joined;

    window.S('gameStore').setState({
      isInMultiplayer: true,
      isGMMode: isGM,
      currentPlayer: { id: uid, userId: uid },
      multiplayerRoom: { id: fixture.roomId },
      multiplayerSocket: window.__socket,
      cameraX: 0,
      cameraY: 0,
      zoomLevel: 1,
      playerZoom: 1,
      dynamicFogEnabled: false,
      gridType: 'square',
      gridSize: 50,
      feetPerTile: 5
    });
    window.S('mapStore').setState({ currentMapId: fixture.mapId });

    window.__actors.registerActorHandlers({ socket: window.__socket });
    window.__registerSpells({ socket: window.__socket });

    const snapRes = await window.__actors.refreshActorSnapshot();
    if (!snapRes.success) throw Error('refreshActorSnapshot failed: ' + JSON.stringify(snapRes));
    window.S('mapStore').setState({ currentMapId: fixture.mapId });

    if (character && pcId) {
      const store = window.S('characterStore');
      const slp = (ms) => new Promise((r) => setTimeout(r, ms));
      for (let i = 0; i < 150 && !(store.getState().currentCharacterId && !store.getState().isLoading); i += 1) {
        await slp(100);
      }
      for (let stable = 0, last = null; stable < 5;) {
        const st = store.getState();
        const k = `${st.currentCharacterId}|${st.characters.length}|${!!st.isLoading}`;
        stable = k === last ? stable + 1 : 0;
        last = k;
        await slp(100);
      }
      store.setState({ characters: [character] });
      window.S('gameStore').setState({ isInMultiplayer: false });
      store.getState().loadCharacter(character.id);
      window.S('gameStore').setState({ isInMultiplayer: true });
      const selected = window.__actors.selectOwnerAttachment(fixture.refs[pcId]);
      if (!selected.success) throw Error('selectOwnerAttachment failed: ' + JSON.stringify(selected));
      const snapRes2 = await window.__actors.refreshActorSnapshot();
      if (!snapRes2.success) throw Error('post-select refreshActorSnapshot failed: ' + JSON.stringify(snapRes2));
      window.S('mapStore').setState({ currentMapId: fixture.mapId });
    }

    if (window.__refreshAuthored) await window.__refreshAuthored();
    if (window.__refreshApprovals) await window.__refreshApprovals();
    if (pcId && window.__restoreOwner) window.__restoreOwner();
    return { listenersCount: window.__socket.listeners('room_joined').length };
  }, { uid, isGM, pcId, character, mode });
}

async function openBook(page, tabName = null) {
  if (!(await book(page).count()) || !(await book(page).isVisible())) {
    const charCat = page.locator('button.wow-nav-category-header[title^="Character"]').first();
    if (await charCat.count() && await charCat.isVisible()) {
      await charCat.click();
      const sbFlyout = page.locator('button.wow-nav-flyout-item[title^="Spellbook"]').first();
      await sbFlyout.waitFor({ state: 'visible', timeout: 10000 });
      await sbFlyout.click();
    } else {
      const charBtn = page.getByRole('button', { name: 'Character', exact: true });
      if (await charBtn.count()) await charBtn.click();
      else await page.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
      const sbBtn = page.getByRole('button', { name: 'Spellbook S', exact: true });
      if (await sbBtn.count()) await sbBtn.click();
      else await page.locator('button', { hasText: /Spellbook/ }).first().click();
    }
    await book(page).waitFor({ state: 'visible', timeout: 15000 });
  }
  await book(page).locator('.loading-wrapper').waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
  if (tabName) {
    const tab = book(page).getByRole('button', { name: tabName, exact: true });
    await tab.waitFor({ state: 'visible', timeout: 10000 });
    await tab.click();
  }
}

async function closeBook(page) {
  if (!(await book(page).count())) return;
  const closeBtn = book(page).getByRole('button', { name: 'Close', exact: true });
  if (await closeBtn.count()) {
    await closeBtn.first().focus();
    await closeBtn.first().press('Enter');
  } else {
    await page.keyboard.press('Escape');
  }
  await book(page).waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
}

async function resetWizard(page) {
  const cancelEdit = book(page).getByRole('button', { name: /Cancel Edit/i });
  if (await cancelEdit.count() && await cancelEdit.isVisible()) {
    await cancelEdit.click();
    const discard = page.getByRole('button', { name: /Discard Changes/i });
    await discard.waitFor({ timeout: 10000 });
    await discard.click();
    await sleep(300);
    return;
  }
  const reset = book(page).getByTitle('Reset Wizard');
  if (await reset.count() && await reset.isVisible()) {
    await reset.click();
    const confirm = page.getByRole('button', { name: 'Reset Wizard', exact: true });
    await confirm.waitFor({ timeout: 10000 });
    await confirm.click();
    await sleep(300);
  }
}

async function getScopedLibrarySpells(page, uid) {
  return page.evaluate((expectedUid) => {
    const exactKey = Object.keys(localStorage).find((k) => k.includes(`:${expectedUid}:`) && k.endsWith(':library.spellData'));
    const key = exactKey || Object.keys(localStorage).find((k) => k.endsWith(':library.spellData'));
    if (!key) return { key: null, spells: [] };
    const parsed = JSON.parse(localStorage.getItem(key));
    return { key, spells: parsed?.payload?.data?.spells || [] };
  }, uid);
}

async function savedRecord(page, uid, name) {
  const lib = await getScopedLibrarySpells(page, uid);
  return lib.spells.find((s) => s.name === name) || null;
}

async function waitSpellRecord(page, uid, predicateFn, arg) {
  for (let i = 0; i < 80; i += 1) {
    const lib = await getScopedLibrarySpells(page, uid);
    const match = lib.spells.find((s) => predicateFn(s, arg));
    if (match) return match;
    await sleep(150);
  }
  throw Error('Timed out waiting for saved spell record in scoped storage');
}

async function findSpellRowInLibrary(page, name) {
  const rowLocator = book(page).locator(`[role="button"][aria-label="${name} details"]`);
  if (await rowLocator.count() && await rowLocator.first().isVisible()) {
    return rowLocator.first();
  }
  const prevBtn = book(page).getByRole('button', { name: 'Previous Page', exact: true });
  while (await prevBtn.count() && await prevBtn.isEnabled()) {
    await prevBtn.click();
    await sleep(150);
    if (await rowLocator.count() && await rowLocator.first().isVisible()) {
      return rowLocator.first();
    }
  }
  const nextBtn = book(page).getByRole('button', { name: 'Next Page', exact: true });
  while (await nextBtn.count() && await nextBtn.isEnabled()) {
    await nextBtn.click();
    await sleep(150);
    if (await rowLocator.count() && await rowLocator.first().isVisible()) {
      return rowLocator.first();
    }
  }
  throw Error(`Spell row "${name}" not found in Spell Library`);
}

async function openLibraryCard(page, name) {
  await openBook(page, 'Spell Library');
  const row = await findSpellRowInLibrary(page, name);
  await row.click();
  const detail = page.locator('.spell-detail-overlay');
  await detail.waitFor({ state: 'visible', timeout: 10000 });
  return detail;
}

async function closeLibraryCard(page) {
  const detail = page.locator('.spell-detail-overlay');
  if (await detail.count() && await detail.isVisible()) {
    const closeBtn = detail.getByRole('button', { name: 'Close', exact: true });
    if (await closeBtn.count()) await closeBtn.first().click({ timeout: 5000 }).catch(() => {});
    if (await detail.count() && await detail.isVisible()) await page.keyboard.press('Escape');
    await detail.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }
  await closeBook(page);
}

async function editSpellFromLibrary(page, name) {
  await openBook(page, 'Spell Library');
  const row = await findSpellRowInLibrary(page, name);
  await row.click({ button: 'right' });
  await page.getByText('Edit in Spell Wizard', { exact: true }).click();
  await book(page).locator('.edit-mode-text').waitFor({ state: 'visible', timeout: 10000 });
}

async function configureResources(page, apVal, manaVal) {
  const manaConfig = book(page).locator('.resource-cost-config').filter({ hasText: /Mana/i });
  if (!(await manaConfig.count())) {
    await book(page).getByTitle('Standard magical energy', { exact: true }).click();
  }
  const apConfig = book(page).locator('.resource-cost-config').filter({ hasText: /Action Points/i });
  if (!(await apConfig.count())) {
    await book(page).getByTitle('Basic action economy', { exact: true }).click();
  }

  const manaInput = book(page).locator('.resource-cost-config').filter({ hasText: /Mana/i }).getByRole('spinbutton').first();
  const apInput = book(page).locator('.resource-cost-config').filter({ hasText: /Action Points/i }).getByRole('spinbutton').first();
  await manaInput.fill('1');
  await manaInput.fill(String(manaVal));
  await apInput.fill('2');
  await apInput.fill(String(apVal));

  assert.equal(await manaInput.inputValue(), String(manaVal), `Expected Mana input ${manaVal}`);
  assert.equal(await apInput.inputValue(), String(apVal), `Expected Action Points input ${apVal}`);

  const summaryText = await book(page).locator('.resource-summary').innerText();
  assert.match(summaryText, new RegExp(`Action Points[\\s\\S]*?${apVal}`, 'i'), `Expected Action Points ${apVal} in summary: ${summaryText}`);
  if (manaVal > 0) {
    assert.match(summaryText, new RegExp(`Mana[\\s\\S]*?${manaVal}`, 'i'), `Expected Mana ${manaVal} in summary: ${summaryText}`);
  }
  return {
    manaInputValue: await manaInput.inputValue(),
    apInputValue: await apInput.inputValue(),
    summaryText
  };
}

function assertCleanCanonicalSeparation(rec) {
  assert.ok(rec.authoredDraft && typeof rec.authoredDraft === 'object', 'authoredDraft present');
  assert.equal(typeof rec.serializedData, 'string', 'serializedData is JSON string');
  assert.deepEqual(JSON.parse(rec.serializedData), rec.authoredDraft, 'serializedData matches authoredDraft');
  for (const k of ['id', 'authoredDefinitionId', 'categoryIds', 'categories', 'source', 'isCustom', 'dateCreated', 'lastModified', 'lastSaved', 'editMode', 'editingSpellId']) {
    assert.equal(Object.prototype.hasOwnProperty.call(rec.authoredDraft, k), false, `authoredDraft must exclude ${k}`);
  }
}

async function authorRecipeInWizard(page, uid, spec) {
  await openBook(page, 'Spell Wizard');
  await resetWizard(page);

  await book(page).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(spec.name);
  await book(page).getByRole('textbox', { name: 'Description * *', exact: true }).fill(spec.description);
  await book(page).getByText(spec.school, { exact: true }).click();

  const nav = book(page).getByRole('navigation', { name: 'Spell wizard steps' });
  await nav.getByRole('button', { name: /Spell Type$/ }).click();
  await book(page).getByRole('heading', { name: 'ACTION', exact: true }).click();
  await book(page).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');

  await nav.getByRole('button', { name: /^3 Effects$/ }).click();
  await book(page).getByRole('heading', { name: 'Damage', exact: true }).click();
  await book(page).locator('.damage-effects-container').getByRole('textbox').first().fill(spec.damageFormula);

  if (spec.movementRider) {
    await book(page).getByRole('heading', { name: 'Control', exact: true }).click();
    await book(page).getByRole('button', { name: /^Use composed effect profile/ }).click();
    const fields = book(page).getByRole('group', { name: /Composed effect .* structured expiry/ });
    await fields.getByLabel(/^Canonical effect/).selectOption('movement');
    await fields.getByLabel(/^Effect name shown on the target/).fill(spec.movementRider.label);
    await fields.getByLabel(/^Movement change/).fill(String(spec.movementRider.feet));
    await fields.getByLabel(/^Expiry/).selectOption(spec.movementRider.expiry);
    await fields.getByLabel(/^Source-authored duration text/).fill(spec.movementRider.duration);
    await fields.getByLabel(/^Required GM adjudication note/).fill(spec.movementRider.gmNote);
  }

  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click();
  await book(page).getByText('Single Target', { exact: true }).click();
  await book(page).getByText('Ranged', { exact: true }).click();
  const slider = book(page).getByRole('slider').first();
  await slider.focus();
  await slider.press('Home');
  for (let i = 0; i < 6; i += 1) await slider.press('ArrowRight');
  await book(page).locator('.range-value').filter({ hasText: '30 ft' }).waitFor({ state: 'visible', timeout: 5000 });
  const anyCard = book(page).locator('.targeting-option-card').filter({ hasText: 'Any Target' }).first();
  if (!/\bselected\b/.test((await anyCard.getAttribute('class')) || '')) await anyCard.click();
  for (const otherName of ['Enemies', 'Allies', 'Self']) {
    const card = book(page).locator('.targeting-option-card').filter({ hasText: otherName }).first();
    if (await card.count() && /\bselected\b/.test((await card.getAttribute('class')) || '')) await card.click();
  }

  await nav.getByRole('button', { name: /Resources$/ }).click();
  const resourceUi = await configureResources(page, spec.ap, spec.mana);

  await nav.getByRole('button', { name: /Review$/ }).click();
  await book(page).locator('.review-spell-preview').waitFor({ state: 'visible', timeout: 10000 });
  const reviewText = await book(page).locator('.step10-review-container').innerText();
  assert.doesNotMatch(reviewText, /1d10\+2/, 'Review must not fall back to placeholder 1d10+2');

  const saveBtn = book(page).locator('.review-actions .save-button').first();
  if (await saveBtn.count()) await saveBtn.click();
  else await book(page).getByRole('button', { name: /Save to Library/i }).first().click();

  const saved = await waitSpellRecord(
    page,
    uid,
    (s, targetName) => s.name === targetName && Boolean(s.authoredDefinitionId),
    spec.name
  );
  return { saved, reviewText, resourceUi };
}

async function openGmQueue(gm) {
  const details = gm.locator('details.p9-review-requests');
  await details.waitFor({ state: 'attached', timeout: 15000 });
  if (!(await details.evaluate((el) => el.open))) await details.locator('summary').click();
  return gmQueue(gm);
}

async function openAdmittedAbility(page, spellName) {
  if (await ownerDialog(page).count()) {
    await ownerDialog(page).getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {});
    await ownerDialog(page).waitFor({ state: 'detached' }).catch(() => {});
  }
  const details = page.locator('details.p9-admitted').filter({ hasText: 'Admitted abilities' }).first();
  const isOpen = await details.evaluate((el) => el.open).catch(() => false);
  if (!isOpen) await details.locator('summary').click();
  const admittedRegion = page.getByRole('region', { name: 'Admitted abilities', exact: true });
  await admittedRegion.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
  const row = admittedRegion.locator('.p9-admitted-row').filter({ hasText: spellName }).first();
  await row.waitFor({ state: 'visible', timeout: 15000 });
  const rowText = await row.innerText();
  await row.getByRole('button', { name: 'Use admitted ability', exact: true }).click();
  const od = ownerDialog(page);
  await od.waitFor({ state: 'visible', timeout: 15000 });
  return { dialog: od, rowText };
}

async function selectTargetByName(page, targetDisplayName) {
  const sel = ownerDialog(page).locator('select').first();
  await sel.waitFor({ state: 'visible', timeout: 10000 });
  const optVal = await sel.evaluate((el, name) => {
    const opt = Array.from(el.options).find((o) => (o.textContent || '').includes(name));
    return opt ? opt.value : '';
  }, targetDisplayName);
  assert.ok(optVal, `Expected target option containing "${targetDisplayName}"`);
  await sel.selectOption(optVal);
}

async function tokenLocator(page, id) {
  await page.waitForFunction((tokenId) => Array.from(document.querySelectorAll('.creature-token')).some((el) => {
    let f = el[Object.keys(el).find((k) => k.startsWith('__reactFiber'))];
    for (; f; f = f.return) {
      if (f.memoizedProps?.tokenId === tokenId) {
        el.dataset.acceptToken = tokenId;
        return true;
      }
    }
    return false;
  }), id);
  return page.locator(`[data-accept-token="${id}"]`);
}

async function readSharedConditionSpeed(gmPage, host, targetId) {
  await gmPage.waitForFunction(({ id, expectedIds }) => {
    const t = S('creatureStore').getState().creatureTokens.find((tok) => tok.id === id);
    return !!t && JSON.stringify((t.state?.conditions || []).map((r) => r.recordId).sort()) === JSON.stringify(expectedIds);
  }, {
    id: targetId,
    expectedIds: (host.room.gameState.maps[host.mapId].tokens[targetId].state.conditions || []).map((r) => r.recordId).sort()
  }, { timeout: 15000 });

  const controls = gmPage.getByRole('region', { name: 'Actor attachment and consequences', exact: true });
  await controls.getByRole('combobox', { name: 'Exact room attachment', exact: true }).selectOption(`creature:${targetId}`);
  await controls.getByRole('button', { name: 'Edit selected shared conditions', exact: true }).click();
  const dialog = gmPage.getByRole('dialog', { name: 'Edit selected shared conditions editor', exact: true });
  await dialog.waitFor({ state: 'visible', timeout: 15000 });
  await dialog.getByText(/^Stunned (inactive\.|active:)/).first().waitFor({ timeout: 15000 });
  const section = dialog.getByRole('region', { name: 'Active movement effects', exact: true });
  const speed = (await section.count())
    ? {
        text: (await section.getByRole('status').first().innerText()).trim(),
        effects: await section.locator('p').allInnerTexts()
      }
    : { text: 'no active movement effects', effects: [] };
  await dialog.getByRole('button', { name: 'Close shared condition editor', exact: true }).click();
  await dialog.waitFor({ state: 'detached', timeout: 10000 });
  return speed;
}

const emitAck = (page, event, payload) => page.evaluate(
  ({ event: ev, payload: p }) => new Promise((resolve) => window.__socket.emit(ev, p, resolve)),
  { event, payload }
);

async function main() {
  const launchCommand = `$env:STAGE_ROOT='${STAGE_ROOT}'; $env:APP_BUILD_DIR='${BUILD_DIR}'; $env:EVIDENCE_DIR='${EVIDENCE_DIR}'; $env:VERDICT_LABEL='${VERDICT_LABEL}'; node D:\\VTT\\vtt-react\\verification\\player-wizard-gm-review\\accept-journey.cjs`;
  const host = await startRoomHost();
  const buildId = host.buildIdentity();

  const report = {
    verdict: 'FAIL',
    verdictLabel: VERDICT_LABEL,
    startedAt: new Date().toISOString(),
    endedAt: null,
    passed: false,
    launchCommand,
    buildIdentity: buildId,
    recipes: RECIPES,
    firstBrokenStep: null,
    steps: [],
    networkRefusals: [],
    consoleErrors: [],
    pageErrors: []
  };

  const launchOpts = { headless: true };
  if (process.env.CHROME_PATH) launchOpts.executablePath = process.env.CHROME_PATH;
  else if (process.env.PW_CHANNEL) launchOpts.channel = process.env.PW_CHANNEL;
  const browser = await chromium.launch(launchOpts);

  const contexts = {};
  const pages = {};
  const out = { gm: [], playerA: [], playerB: [] };
  const inb = { gm: [], playerA: [], playerB: [] };

  const allInbound = async (role) => [
    ...inb[role],
    ...(await pages[role].evaluate(() => window.__inbound || []).catch(() => []))
  ];
  const allOutbound = async (role) => [
    ...out[role],
    ...(await pages[role].evaluate(() => window.__outbound || []).catch(() => []))
  ];
  const reloadRole = async (role, uid, opts = {}) => {
    await connectClient(pages[role], host, uid, {
      ...opts,
      mode: 'reload',
      outboundLog: out[role],
      inboundLog: inb[role]
    });
  };
  const runStep = async (id, index, actor, description, fn) => {
    const entry = { id, index, actor, description, passed: false, before: host.snapshot(), after: null };
    report.steps.push(entry);
    console.log(`[step ${index}] ${id} (${actor}): ${description}`);
    try {
      const outcome = await fn(entry);
      if (outcome && typeof outcome === 'object') {
        if ('before' in outcome) entry.before = outcome.before;
        if ('after' in outcome) entry.after = outcome.after;
        if ('details' in outcome) entry.details = outcome.details;
      }
      entry.passed = true;
      saveEvidence('progress.json', report);
      return outcome;
    } catch (err) {
      entry.passed = false;
      entry.error = err.message;
      entry.after = entry.after || host.snapshot();
      report.firstBrokenStep = {
        id,
        index,
        actor,
        description,
        error: err.message,
        before: entry.before,
        after: entry.after
      };
      report.failure = err.stack || String(err);
      saveEvidence('progress.json', report);
      throw err;
    }
  };

  try {
    for (const role of ['gm', 'playerA', 'playerB']) {
      const ctx = contexts[role] = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
        reducedMotion: 'reduce',
        acceptDownloads: true
      });
      const page = pages[role] = await ctx.newPage();
      const uid = role === 'gm' ? 'acct-gm' : role === 'playerA' ? 'acct-player-a' : 'acct-player-b';
      await setupRouteAndErrorHooks(page, uid, report.networkRefusals, report.pageErrors, report.consoleErrors);
    }

    await connectClient(pages.gm, host, 'acct-gm', {
      isGM: true,
      outboundLog: out.gm,
      inboundLog: inb.gm
    });
    await connectClient(pages.playerA, host, 'acct-player-a', {
      isGM: false,
      pcId: 'pcA',
      character: host.makePcCharacter('vael', 'Vael'),
      outboundLog: out.playerA,
      inboundLog: inb.playerA
    });
    await connectClient(pages.playerB, host, 'acct-player-b', {
      isGM: false,
      pcId: 'pcB',
      character: host.makePcCharacter('ilse', 'Ilse'),
      outboundLog: out.playerB,
      inboundLog: inb.playerB
    });

    // Sanity check role separation before Step 1.
    for (const [role, expectedUid, expectedGm] of [
      ['gm', 'acct-gm', true],
      ['playerA', 'acct-player-a', false],
      ['playerB', 'acct-player-b', false]
    ]) {
      const state = await pages[role].evaluate(() => ({
        uid: S('authStore').getState().user?.uid || null,
        isAuthenticated: S('authStore').getState().isAuthenticated,
        isGuest: Boolean(S('authStore').getState().user?.isGuest),
        isGMMode: S('gameStore').getState().isGMMode
      }));
      assert.equal(state.uid, expectedUid);
      assert.equal(state.isAuthenticated, true);
      assert.equal(state.isGuest, false);
      assert.equal(state.isGMMode, expectedGm);
      const lib = await getScopedLibrarySpells(pages[role], expectedUid);
      assert.equal(lib.spells.length, 0, `${role} must start with an empty separate Spell Library`);
    }

    // ── Step 1: Player A opens Spell Wizard ────────────────────────────────────
    await runStep(
      'step_01_player_a_open_wizard',
      1,
      'Player A',
      'Signed-in ordinary player A opens Spellbook and accesses the Spell Wizard tab',
      async (entry) => {
        await openBook(pages.playerA);
        const wizTab = book(pages.playerA).getByRole('button', { name: 'Spell Wizard', exact: true });
        const wizardTabCount = await wizTab.count();
        const wizardTabVisible = wizardTabCount > 0 && await wizTab.isVisible();
        const before = {
          uid: 'acct-player-a',
          isGMMode: false,
          wizardTabCount,
          wizardTabVisible,
          room: entry.before
        };
        entry.before = before;
        assert.ok(
          wizardTabVisible,
          'Ordinary signed-in player A cannot open Spell Wizard: Spell Wizard tab is hidden on this build (GM-only gating).'
        );
        await wizTab.click();
        await sleep(300);
        const nameInputVisible = await book(pages.playerA).getByRole('textbox', { name: 'Spell Name * *', exact: true }).isVisible();
        assert.ok(nameInputVisible, 'Spell Wizard editor did not stay open for signed-in ordinary player A');
        return { before, after: { wizardTabVisible: true, nameInputVisible } };
      }
    );

    // ── Step 2: Player A authors immediate 0-mana spell Cinder Glass ───────────
    let authoredImmediate;
    await runStep(
      'step_02_player_a_author_cinder_glass',
      2,
      'Player A',
      'Player A creates immediate spell Cinder Glass (Ember, 2d6+1, 1 AP, explicit 0 mana)',
      async () => {
        const before = { libraryCount: (await getScopedLibrarySpells(pages.playerA, 'acct-player-a')).spells.length };
        const res = await authorRecipeInWizard(pages.playerA, 'acct-player-a', RECIPES.immediate);
        authoredImmediate = res.saved;
        assertCleanCanonicalSeparation(authoredImmediate);
        assert.equal(authoredImmediate.damageConfig?.formula, '2d6+1');
        assert.equal(authoredImmediate.resourceCost?.actionPoints, 1);
        assert.equal(authoredImmediate.resourceCost?.resourceValues?.mana, 0);
        const compiled = host.compile(authoredImmediate, 1);
        assert.deepEqual(compiled.canonicalDefinition.resourceCost, { actionPoints: 1, mana: 0 });
        assert.deepEqual(compiled.canonicalDefinition.effect, { kind: 'damage', formula: '2d6+1', damageTypes: ['ember'] });
        return {
          before,
          after: {
            id: authoredImmediate.id,
            authoredDefinitionId: authoredImmediate.authoredDefinitionId,
            formula: authoredImmediate.damageConfig.formula,
            ap: authoredImmediate.resourceCost.actionPoints,
            mana: authoredImmediate.resourceCost.resourceValues.mana,
            definitionHash: compiled.definitionHash
          },
          details: {
            step5ResourceSummaryNote: res.resourceUi.summaryText
          }
        };
      }
    );

    // ── Step 3: Player A authors timed-rider spell Glacier Snare ───────────────
    let authoredRider;
    await runStep(
      'step_03_player_a_author_glacier_snare',
      3,
      'Player A',
      'Player A creates timed rider spell Glacier Snare (Rime, 1d8+2, Permafrost Drag -15 ft, target-next-end, 1 AP, 2 mana)',
      async () => {
        const before = { libraryCount: (await getScopedLibrarySpells(pages.playerA, 'acct-player-a')).spells.length };
        const res = await authorRecipeInWizard(pages.playerA, 'acct-player-a', RECIPES.rider);
        authoredRider = res.saved;
        assertCleanCanonicalSeparation(authoredRider);
        assert.equal(authoredRider.damageConfig?.formula, '1d8+2');
        assert.equal(authoredRider.controlConfig?.authoredCondition?.movementFeet, -15);
        assert.equal(authoredRider.controlConfig?.authoredCondition?.expiryPolicy, 'target-next-end');
        assert.equal(authoredRider.resourceCost?.actionPoints, 1);
        assert.equal(authoredRider.resourceCost?.resourceValues?.mana, 2);
        const compiled = host.compile(authoredRider, 1);
        assert.equal(compiled.canonicalDefinition.capability, host.pure.EFFECT_CAPABILITY);
        assert.deepEqual(compiled.canonicalDefinition.effects.condition, { kind: 'movement', feet: -15, label: 'Permafrost Drag' });
        assert.equal(compiled.canonicalDefinition.timing.expiryPolicy, 'target-next-end');
        assert.deepEqual(compiled.canonicalDefinition.resourceCost, { actionPoints: 1, mana: 2 });
        return {
          before,
          after: {
            id: authoredRider.id,
            authoredDefinitionId: authoredRider.authoredDefinitionId,
            formula: authoredRider.damageConfig.formula,
            movementFeet: authoredRider.controlConfig.authoredCondition.movementFeet,
            expiryPolicy: authoredRider.controlConfig.authoredCondition.expiryPolicy,
            ap: authoredRider.resourceCost.actionPoints,
            mana: authoredRider.resourceCost.resourceValues.mana,
            definitionHash: compiled.definitionHash
          }
        };
      }
    );

    // ── Step 4: Player A exports library via normal Library Export UI ──────────
    const exportedPath = path.join(EVIDENCE_DIR, 'player-a-exported-library.json');
    await runStep(
      'step_04_player_a_export_library',
      4,
      'Player A',
      'Player A exports both unseen spells through Spell Library Export button',
      async () => {
        const before = { exportedExists: fs.existsSync(exportedPath) };
        await openBook(pages.playerA, 'Spell Library');
        const exportBtn = book(pages.playerA).getByRole('button', { name: /\bExport$/i });
        assert.ok((await exportBtn.count()) > 0 && await exportBtn.first().isVisible(), 'Export button must be visible to ordinary signed-in Player A');
        const [download] = await Promise.all([
          pages.playerA.waitForEvent('download', { timeout: 15000 }),
          exportBtn.first().click()
        ]);
        await download.saveAs(exportedPath);
        const exportedJson = JSON.parse(fs.readFileSync(exportedPath, 'utf8'));
        const names = (exportedJson?.data?.spells || []).map((s) => s.name);
        assert.ok(names.includes(RECIPES.immediate.name), 'Exported JSON missing Cinder Glass');
        assert.ok(names.includes(RECIPES.rider.name), 'Exported JSON missing Glacier Snare');
        for (const s of exportedJson.data.spells) assertCleanCanonicalSeparation(s);
        await closeBook(pages.playerA);
        return {
          before,
          after: {
            exportedPath,
            suggestedFilename: download.suggestedFilename(),
            spellNames: names
          }
        };
      }
    );

    // ── Step 5: Player B imports exported library via normal Import UI ─────────
    let importedImmediate;
    let importedRider;
    await runStep(
      'step_05_player_b_import_library',
      5,
      'Player B',
      'Player B imports Player A exported JSON into empty personal Spell Library',
      async () => {
        const before = { libraryCount: (await getScopedLibrarySpells(pages.playerB, 'acct-player-b')).spells.length };
        assert.equal(before.libraryCount, 0);
        await openBook(pages.playerB, 'Spell Library');
        const importBtn = book(pages.playerB).getByRole('button', { name: /\bImport$/i });
        assert.ok((await importBtn.count()) > 0 && await importBtn.first().isVisible(), 'Import button must be visible to ordinary signed-in Player B');
        const [chooser] = await Promise.all([
          pages.playerB.waitForEvent('filechooser', { timeout: 15000 }),
          importBtn.first().click()
        ]);
        await chooser.setFiles(exportedPath);
        importedImmediate = await waitSpellRecord(pages.playerB, 'acct-player-b', (s) => s.name === RECIPES.immediate.name);
        importedRider = await waitSpellRecord(pages.playerB, 'acct-player-b', (s) => s.name === RECIPES.rider.name);
        assert.equal(importedImmediate.authoredDefinitionId, authoredImmediate.authoredDefinitionId);
        assert.deepEqual(importedImmediate.authoredDraft, authoredImmediate.authoredDraft);
        assert.equal(importedImmediate.resourceCost.resourceValues.mana, 0);
        assert.equal(importedRider.authoredDefinitionId, authoredRider.authoredDefinitionId);
        assert.deepEqual(importedRider.authoredDraft, authoredRider.authoredDraft);
        assert.equal(importedRider.controlConfig.authoredCondition.movementFeet, -15);
        await closeBook(pages.playerB);
        return {
          before,
          after: {
            libraryCount: (await getScopedLibrarySpells(pages.playerB, 'acct-player-b')).spells.length,
            immediateId: importedImmediate.id,
            riderId: importedRider.id
          }
        };
      }
    );

    // ── Step 6: Pre-review unapproved spells change nothing ────────────────────
    await runStep(
      'step_06_unapproved_pre_review_noop',
      6,
      'Player B',
      'Unapproved spells cannot be admitted by Player B, cannot cast from HUD/bar, and forged approvals change nothing',
      async () => {
        const before = host.snapshot();
        // Verify Admitted abilities is empty.
        const details = pages.playerB.locator('details.p9-admitted').filter({ hasText: 'Admitted abilities' }).first();
        if (!(await details.evaluate((el) => el.open).catch(() => false))) await details.locator('summary').click();
        const admittedRegion = pages.playerB.getByRole('region', { name: 'Admitted abilities', exact: true });
        await admittedRegion.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
        await admittedRegion.getByText('No admitted ability has been loaded for this room.').waitFor({ timeout: 10000 });

        // Drag Cinder Glass onto an action bar slot -> clicking gives manual-only dialog with no Cast button.
        await openBook(pages.playerB, 'Spell Library');
        const row = await findSpellRowInLibrary(pages.playerB, RECIPES.immediate.name);
        const emptySlot = pages.playerB.locator('.action-bar-assembly .action-slot.empty').first();
        await emptySlot.waitFor({ timeout: 10000 });
        await row.dragTo(emptySlot);
        const filledSlot = pages.playerB.locator(`.action-bar-assembly .action-slot.filled[aria-label="${RECIPES.immediate.name}"]`).first();
        await filledSlot.waitFor({ timeout: 10000 });
        await closeBook(pages.playerB);

        const outIdxBefore = (await allOutbound('playerB')).length;
        await filledSlot.click();
        const confirmDlg = pages.playerB.locator('.spell-cast-confirmation-dialog');
        await confirmDlg.waitFor({ state: 'visible', timeout: 10000 });
        const diagText = await confirmDlg.locator('.p9-manual-diagnostic').innerText();
        assert.match(diagText, /Manual/i);
        assert.equal(await confirmDlg.getByRole('button', { name: 'Cast', exact: true }).count(), 0);
        await confirmDlg.getByRole('button', { name: 'Post manual notice', exact: true }).click();
        await confirmDlg.waitFor({ state: 'detached', timeout: 10000 });
        const uiEmits = (await allOutbound('playerB')).slice(outIdxBefore);
        assert.equal(uiEmits.filter((e) => e.event === 'actor_spell_approve' || e.event === 'actor_consequence').length, 0);

        // Forged non-GM admit + forged approvals for both unapproved recipes must fail cleanly.
        const nonGmAdmit = await emitAck(pages.playerB, 'actor_authored_admit', {
          roomId: host.room.id,
          requestId: require('node:crypto').randomUUID(),
          expectedRegistryRevision: 0,
          record: importedImmediate,
          classId: 'arcanoneer',
          definitionVersion: 1
        });
        assert.equal(nonGmAdmit.success, false);
        assert.equal(nonGmAdmit.code, 'forbidden');

        const forgedImmediate = await emitAck(pages.playerB, 'actor_spell_approve', host.forgedApproval(importedImmediate, 'A1', 1));
        assert.equal(forgedImmediate.success, false);
        assert.equal(forgedImmediate.code, 'definition_not_admitted');

        const forgedRider = await emitAck(pages.playerB, 'actor_spell_approve', host.forgedApproval(importedRider, 'B1', 1));
        assert.equal(forgedRider.success, false);
        assert.equal(forgedRider.code, 'definition_not_admitted');

        await details.locator('summary').click();
        const after = host.snapshot();
        assert.equal(after.admittedCount, 0);
        assert.equal(after.totalReceipts, before.totalReceipts);
        assert.deepEqual(after.pcB, before.pcB);
        assert.deepEqual(after.targets, before.targets);
        return {
          before,
          after,
          details: { nonGmAdmitCode: nonGmAdmit.code, forgedImmediateCode: forgedImmediate.code, forgedRiderCode: forgedRider.code }
        };
      }
    );

    // ── Step 7: Player B requests GM approval privately; Player A sees nothing ─
    let submittedImmediateReq;
    let submittedRiderReq;
    let gmImmediateCardTextBeforeEdit;
    let gmRiderCardTextBeforeEdit;
    await runStep(
      'step_07_player_b_request_gm_review_private',
      7,
      'Player B -> GM (Player A privacy)',
      'Player B requests GM review for both recipes; GM receives both; Player A cannot see private review',
      async () => {
        const before = host.snapshot();
        for (const recipeName of [RECIPES.immediate.name, RECIPES.rider.name]) {
          await openLibraryCard(pages.playerB, recipeName);
          await reviewGroup(pages.playerB, recipeName).waitFor({ state: 'visible', timeout: 10000 });
          await reviewGroup(pages.playerB, recipeName).getByRole('button', { name: 'Request GM review', exact: true }).click();
          await reviewGroup(pages.playerB, recipeName).getByText(/Awaiting GM review/).first().waitFor({ timeout: 10000 });
          await closeLibraryCard(pages.playerB);
        }

        const queue = await openGmQueue(pages.gm);
        const gmCardImm = queue.locator(`article[aria-label="Review request for ${RECIPES.immediate.name}"][data-review-status="pending"]`).first();
        const gmCardRid = queue.locator(`article[aria-label="Review request for ${RECIPES.rider.name}"][data-review-status="pending"]`).first();
        await gmCardImm.waitFor({ state: 'visible', timeout: 10000 });
        await gmCardRid.waitFor({ state: 'visible', timeout: 10000 });
        gmImmediateCardTextBeforeEdit = await gmCardImm.innerText();
        gmRiderCardTextBeforeEdit = await gmCardRid.innerText();

        const after = host.snapshot();
        assert.equal(after.reviewRequests.length, 2);
        submittedImmediateReq = after.reviewRequests.find((r) => r.spellName === RECIPES.immediate.name);
        submittedRiderReq = after.reviewRequests.find((r) => r.spellName === RECIPES.rider.name);
        assert.ok(submittedImmediateReq && submittedRiderReq);
        assert.equal(submittedImmediateReq.status, 'pending');
        assert.equal(submittedImmediateReq.requesterUid, 'acct-player-b');
        assert.equal(submittedImmediateReq.formula, '2d6+1');
        assert.equal(submittedImmediateReq.mana, 0);
        assert.equal(submittedRiderReq.status, 'pending');
        assert.equal(submittedRiderReq.requesterUid, 'acct-player-b');
        assert.equal(submittedRiderReq.formula, '1d8+2');
        assert.equal(submittedRiderReq.movementFeet, -15);
        assert.equal(submittedRiderReq.mana, 2);

        assert.match(gmImmediateCardTextBeforeEdit, /from acct-player-b/);
        assert.match(gmImmediateCardTextBeforeEdit, /2d6\+1/);
        assert.match(gmImmediateCardTextBeforeEdit, /1 AP \/ 0 mana/);
        assert.ok(gmImmediateCardTextBeforeEdit.includes(submittedImmediateReq.recordHash.slice(0, 12)));

        assert.match(gmRiderCardTextBeforeEdit, /from acct-player-b/);
        assert.match(gmRiderCardTextBeforeEdit, /1d8\+2/);
        assert.match(gmRiderCardTextBeforeEdit, /Permafrost Drag/);
        assert.match(gmRiderCardTextBeforeEdit, /1 AP \/ 2 mana/);
        assert.ok(gmRiderCardTextBeforeEdit.includes(submittedRiderReq.recordHash.slice(0, 12)));

        // Privacy assertions for Player A:
        const playerAInb = await allInbound('playerA');
        assert.equal(playerAInb.length, 0, `Player A received private review socket events: ${JSON.stringify(playerAInb)}`);
        assert.equal(await pages.playerA.locator('details.p9-review-requests').count(), 0, 'Player A must not see review HUD panel');
        const playerAList = await emitAck(pages.playerA, 'authored_review_list', { roomId: host.room.id });
        assert.deepEqual(playerAList.requests, [], 'Player A authored_review_list must be empty');
        const gameStateJson = JSON.stringify(host.room.gameState);
        assert.equal(gameStateJson.includes(submittedImmediateReq.requestId), false);
        assert.equal(gameStateJson.includes(submittedRiderReq.requestId), false);

        assert.equal(after.admittedCount, 0);
        assert.deepEqual(after.pcB, before.pcB);
        assert.deepEqual(after.targets, before.targets);
        await pages.gm.screenshot({ path: path.join(EVIDENCE_DIR, 'step07-gm-review-queue.png') });
        return {
          before,
          after,
          details: {
            playerAInboundCount: playerAInb.length,
            playerAListCount: playerAList.requests.length
          }
        };
      }
    );

    // ── Step 8: Player B edits local copies in Spell Wizard ────────────────────
    let editedImmediate;
    let editedRider;
    await runStep(
      'step_08_player_b_edit_local_copies_via_wizard',
      8,
      'Player B',
      'Player B edits both local library spells via Spell Wizard while GM queue keeps original revisions',
      async () => {
        const before = host.snapshot();

        // Edit Cinder Glass: 2d6+1 -> 4d6+2, mana 0 -> 4
        await editSpellFromLibrary(pages.playerB, RECIPES.immediate.name);
        const navImm = book(pages.playerB).getByRole('navigation', { name: 'Spell wizard steps' });
        await navImm.getByRole('button', { name: /^3 Effects$/ }).click();
        await book(pages.playerB).locator('.damage-effects-container').getByRole('textbox').first().fill(RECIPES.immediate.editedFormula);
        await navImm.getByRole('button', { name: /Resources$/ }).click();
        await configureResources(pages.playerB, 1, RECIPES.immediate.editedMana);
        const modImmBefore = importedImmediate.lastModified;
        await sleep(20);
        await book(pages.playerB).getByRole('button', { name: /^Update$/i }).click();
        editedImmediate = await waitSpellRecord(
          pages.playerB,
          'acct-player-b',
          (s, prev) => s.id === importedImmediate.id && s.lastModified !== prev && s.damageConfig?.formula === RECIPES.immediate.editedFormula,
          modImmBefore
        );
        assertCleanCanonicalSeparation(editedImmediate);
        assert.equal(editedImmediate.resourceCost.resourceValues.mana, RECIPES.immediate.editedMana);
        await closeBook(pages.playerB);

        // Edit Glacier Snare: 1d8+2 -> 3d8+2, Permafrost Drag -15 -> -25 ft, mana 2 -> 5
        await editSpellFromLibrary(pages.playerB, RECIPES.rider.name);
        const navRid = book(pages.playerB).getByRole('navigation', { name: 'Spell wizard steps' });
        await navRid.getByRole('button', { name: /^3 Effects$/ }).click();
        const dmgTab = book(pages.playerB).locator('.effect-type-tabs').getByRole('button', { name: /Damage/i });
        if (await dmgTab.count()) await dmgTab.click();
        await book(pages.playerB).locator('.damage-effects-container').getByRole('textbox').first().fill(RECIPES.rider.editedFormula);
        await book(pages.playerB).locator('.effect-type-tabs').getByRole('button', { name: /Control/i }).click();
        await book(pages.playerB).getByRole('group', { name: /Composed effect .* structured expiry/ }).getByLabel(/^Movement change/).fill(String(RECIPES.rider.editedFeet));
        await navRid.getByRole('button', { name: /Resources$/ }).click();
        await configureResources(pages.playerB, 1, RECIPES.rider.editedMana);
        const modRidBefore = importedRider.lastModified;
        await sleep(20);
        await book(pages.playerB).getByRole('button', { name: /^Update$/i }).click();
        editedRider = await waitSpellRecord(
          pages.playerB,
          'acct-player-b',
          (s, prev) => s.id === importedRider.id && s.lastModified !== prev && s.controlConfig?.authoredCondition?.movementFeet === RECIPES.rider.editedFeet,
          modRidBefore
        );
        assertCleanCanonicalSeparation(editedRider);
        assert.equal(editedRider.damageConfig.formula, RECIPES.rider.editedFormula);
        assert.equal(editedRider.resourceCost.resourceValues.mana, RECIPES.rider.editedMana);
        await closeBook(pages.playerB);

        // Confirm Player B detail cards show local-changed notice while GM cards remain untouched.
        for (const recipeName of [RECIPES.immediate.name, RECIPES.rider.name]) {
          await openLibraryCard(pages.playerB, recipeName);
          await reviewGroup(pages.playerB, recipeName).locator('[data-review-local-changed="true"]').waitFor({ timeout: 10000 });
          await closeLibraryCard(pages.playerB);
        }

        const queue = await openGmQueue(pages.gm);
        const gmImmText2 = await queue.locator(`article[data-review-request-id="${submittedImmediateReq.requestId}"]`).innerText();
        const gmRidText2 = await queue.locator(`article[data-review-request-id="${submittedRiderReq.requestId}"]`).innerText();
        assert.equal(gmImmText2, gmImmediateCardTextBeforeEdit);
        assert.equal(gmRidText2, gmRiderCardTextBeforeEdit);
        assert.doesNotMatch(gmImmText2, /4d6|4 mana/);
        assert.doesNotMatch(gmRidText2, /3d8|25 ft|5 mana/);

        const after = host.snapshot();
        assert.equal(after.reviewRequests.find((r) => r.requestId === submittedImmediateReq.requestId).recordHash, submittedImmediateReq.recordHash);
        assert.equal(after.reviewRequests.find((r) => r.requestId === submittedRiderReq.requestId).recordHash, submittedRiderReq.recordHash);
        return {
          before,
          after,
          details: {
            editedImmediate: { formula: editedImmediate.damageConfig.formula, mana: editedImmediate.resourceCost.resourceValues.mana },
            editedRider: { formula: editedRider.damageConfig.formula, movementFeet: editedRider.controlConfig.authoredCondition.movementFeet, mana: editedRider.resourceCost.resourceValues.mana }
          }
        };
      }
    );

    // ── Step 9: GM approves originally submitted revisions ─────────────────────
    let admittedImmediateHash;
    let admittedRiderHash;
    await runStep(
      'step_09_gm_approve_original_revisions',
      9,
      'GM',
      'GM approves both original submitted revisions; edited local copies stay marked un-admitted',
      async () => {
        const before = host.snapshot();
        const queue = await openGmQueue(pages.gm);
        for (const reqId of [submittedImmediateReq.requestId, submittedRiderReq.requestId]) {
          const card = queue.locator(`article[data-review-request-id="${reqId}"]`);
          await card.getByRole('button', { name: 'Approve and admit this exact revision', exact: true }).click();
          await card.getByText(/Approved — admitted as version 1/).first().waitFor({ timeout: 15000 });
        }

        const after = host.snapshot();
        assert.equal(after.admittedCount, 2);
        const admImm = after.admittedVersions.find((e) => e.name === RECIPES.immediate.name);
        const admRid = after.admittedVersions.find((e) => e.name === RECIPES.rider.name);
        assert.ok(admImm && admRid);
        admittedImmediateHash = admImm.hash;
        admittedRiderHash = admRid.hash;
        assert.equal(admImm.version, 1);
        assert.deepEqual(admImm.effect, { kind: 'damage', formula: '2d6+1', damageTypes: ['ember'] });
        assert.deepEqual(admImm.resourceCost, { actionPoints: 1, mana: 0 });
        assert.equal(admImm.hash, host.compile(importedImmediate, 1).definitionHash);
        assert.notEqual(admImm.hash, host.compile(editedImmediate, 1).definitionHash);

        assert.equal(admRid.version, 1);
        assert.deepEqual(admRid.effects.direct, { kind: 'damage', formula: '1d8+2', damageTypes: ['rime'] });
        assert.deepEqual(admRid.effects.condition, { kind: 'movement', feet: -15, label: 'Permafrost Drag' });
        assert.equal(admRid.timing.expiryPolicy, 'target-next-end');
        assert.deepEqual(admRid.resourceCost, { actionPoints: 1, mana: 2 });
        assert.equal(admRid.hash, host.compile(importedRider, 1).definitionHash);
        assert.notEqual(admRid.hash, host.compile(editedRider, 1).definitionHash);

        for (const recipeName of [RECIPES.immediate.name, RECIPES.rider.name]) {
          await openLibraryCard(pages.playerB, recipeName);
          await reviewGroup(pages.playerB, recipeName).getByText(/Approved — admitted as version 1/).first().waitFor({ timeout: 10000 });
          const admRegion = pages.playerB.getByRole('region', { name: `Room admission for ${recipeName}`, exact: true });
          const refreshAdmBtn = admRegion.getByRole('button', { name: 'Refresh room admission', exact: true });
          if (await refreshAdmBtn.count() && await refreshAdmBtn.isEnabled()) {
            await refreshAdmBtn.click();
          }
          await admRegion.getByText(/Changed since admitted version 1/).first().waitFor({ timeout: 10000 });
          await closeLibraryCard(pages.playerB);
        }

        assert.equal((await allInbound('playerA')).length, 0);
        assert.deepEqual((await emitAck(pages.playerA, 'authored_review_list', { roomId: host.room.id })).requests, []);
        assert.deepEqual(after.pcB, before.pcB);
        return { before, after };
      }
    );

    // ── Step 10: Unapproved edited revisions change nothing & GM declines one ──
    await runStep(
      'step_10_unapproved_edited_copies_noop_and_decline',
      10,
      'Player B / GM',
      'Unapproved edited versions are refused; GM declines submitted edited copy with no side effects',
      async () => {
        const before = host.snapshot();
        const forgedEditedImm = await emitAck(pages.playerB, 'actor_spell_approve', host.forgedApproval(editedImmediate, 'A1', 1));
        assert.equal(forgedEditedImm.success, false);
        assert.equal(forgedEditedImm.code, 'definition_not_admitted');

        const forgedEditedRid = await emitAck(pages.playerB, 'actor_spell_approve', host.forgedApproval(editedRider, 'B1', 1));
        assert.equal(forgedEditedRid.success, false);
        assert.equal(forgedEditedRid.code, 'definition_not_admitted');

        await openLibraryCard(pages.playerB, RECIPES.immediate.name);
        await reviewGroup(pages.playerB, RECIPES.immediate.name).getByRole('button', { name: 'Request GM review of this edited revision', exact: true }).click();
        await reviewGroup(pages.playerB, RECIPES.immediate.name).getByText(/Awaiting GM review/).first().waitFor({ timeout: 10000 });
        await closeLibraryCard(pages.playerB);

        const queue = await openGmQueue(pages.gm);
        const pendingEditedCard = queue.locator(`article[aria-label="Review request for ${RECIPES.immediate.name}"][data-review-status="pending"]`).first();
        await pendingEditedCard.waitFor({ state: 'visible', timeout: 10000 });
        const pendingEditedText = await pendingEditedCard.innerText();
        assert.match(pendingEditedText, /4d6\+2/);
        assert.match(pendingEditedText, /4 mana/);
        await pendingEditedCard.getByLabel('Decline reason (optional)').fill('Edited 4d6+2 copy is unapproved.');
        await pendingEditedCard.getByRole('button', { name: 'Decline', exact: true }).click();
        await queue.locator(`article[aria-label="Review request for ${RECIPES.immediate.name}"][data-review-status="declined"]`).first().waitFor({ timeout: 10000 });

        await openLibraryCard(pages.playerB, RECIPES.immediate.name);
        await reviewGroup(pages.playerB, RECIPES.immediate.name).getByText(/Declined by the GM: Edited 4d6\+2 copy is unapproved\./).first().waitFor({ timeout: 10000 });
        await closeLibraryCard(pages.playerB);

        const after = host.snapshot();
        assert.equal(after.reviewRequests.length, 3);
        assert.equal(after.admittedCount, 2);
        assert.equal(after.registryRevision, before.registryRevision);
        assert.equal(after.totalReceipts, before.totalReceipts);
        assert.deepEqual(after.pcB, before.pcB);
        assert.deepEqual(after.targets, before.targets);
        assert.equal((await allInbound('playerA')).length, 0);
        assert.deepEqual((await emitAck(pages.playerA, 'authored_review_list', { roomId: host.room.id })).requests, []);
        return {
          before,
          after,
          details: { forgedEditedImmCode: forgedEditedImm.code, forgedEditedRidCode: forgedEditedRid.code }
        };
      }
    );

    // ── Step 11: Start short combat & cast approved timed rider Glacier Snare ─
    const combat2 = () => host.room.gameState.combat;
    const currentTurnId = () => combat2().turnOrder[combat2().currentTurnIndex].tokenId;
    const advanceTurn = async () => {
      const seqBefore = combat2().effectLifecycle.sequence;
      await pages.gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click();
      await clockUI(pages.gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click();
      assert.ok(await waitUntil(() => combat2().effectLifecycle.sequence === seqBefore + 1), 'Turn sequence advanced');
      await pages.gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click().catch(() => {});
      return combat2().effectLifecycle.sequence;
    };

    let riderDueSequence;
    let riderConditionRecordId;
    await runStep(
      'step_11_combat_start_and_cast_timed_rider',
      11,
      'GM / Player B',
      'Start combat, enable authenticated turn expiry, Player B casts approved v1 Glacier Snare (1 AP, 2 mana)',
      async () => {
        const before = host.snapshot();
        const navCombat = pages.gm.locator('[title^="Combat Initiator"]').first();
        if (await navCombat.count() && await navCombat.isVisible()) await navCombat.click();
        else {
          await pages.gm.locator('body').click({ position: { x: 700, y: 500 } }).catch(() => {});
          await pages.gm.keyboard.press('x');
        }
        await pages.gm.getByRole('button', { name: /^Begin Combat \(0\)$/ }).waitFor({ timeout: 15000 });
        for (const id of ['A1', 'B1']) {
          const tok = await tokenLocator(pages.gm, id);
          const box = await tok.boundingBox();
          assert.ok(box, `Token bounding box missing for ${id}`);
          await pages.gm.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        }
        await pages.gm.getByRole('button', { name: /^Begin Combat \(2\)$/ }).click();
        assert.ok(await waitUntil(() => host.room.gameState.combat?.isActive === true), 'Combat active');

        await pages.gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click();
        await clockUI(pages.gm).getByRole('button', { name: 'Enable authenticated turn expiry', exact: true }).click();
        assert.ok(await waitUntil(() => Boolean(host.room.gameState.combat?.effectLifecycle)), 'Authenticated turn expiry enabled');
        await pages.gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click().catch(() => {});

        while (currentTurnId() === 'B1') {
          await advanceTurn();
        }

        const { dialog: od, rowText } = await openAdmittedAbility(pages.playerB, RECIPES.rider.name);
        assert.match(rowText, /1 AP \/ 2 mana/);
        assert.doesNotMatch(rowText, /5 mana/);
        const dialogText = await od.innerText();
        assert.match(dialogText, /1d8\+2/);
        assert.match(dialogText, /Permafrost Drag/);
        assert.match(dialogText, /15 ft/);
        assert.doesNotMatch(dialogText, /3d8\+2|25 ft|5 mana/);

        await selectTargetByName(pages.playerB, 'Target Beta');
        await od.getByLabel('d8 face 1', { exact: true }).fill('5');
        await od.getByRole('button', { name: 'Record physical roll', exact: true }).click();
        await od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click();
        await od.getByText(/Awaiting GM/).first().waitFor({ timeout: 15000 });

        const whilePending = host.snapshot();
        assert.deepEqual(whilePending.pcB, before.pcB, 'No spend before GM confirms');
        assert.equal(whilePending.receipts, before.receipts);

        const gmCard = pages.gm.locator('.p9-gm-card').filter({ hasText: RECIPES.rider.name }).filter({ hasText: 'Target Beta' }).first();
        await gmCard.waitFor({ state: 'visible', timeout: 15000 });
        await gmCard.getByLabel('GM timing clarification (required)', { exact: true }).fill("Range confirmed; expires at end of Target Beta's next turn.");
        await gmCard.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
        const combo = gmCard.locator('.p9-combination').first();
        await combo.waitFor({ state: 'visible', timeout: 15000 });
        const comboText = await combo.innerText();
        assert.match(comboText, /Permafrost Drag/);
        assert.match(comboText, /Base 35 ft · Permafrost Drag −15 ft = 20 ft/);
        await gmCard.getByLabel(/^Final damage/).fill('7');
        await gmCard.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();

        assert.ok(await waitUntil(() => host.snapshot().receipts === 1), 'Glacier Snare receipt recorded');
        await od.getByText(/Accepted · /).first().waitFor({ timeout: 15000 });

        const after = host.snapshot();
        assert.equal(after.pcB.apTotal, before.pcB.apTotal - 1);
        assert.equal(after.pcB.apTemp, 0);
        assert.equal(after.pcB.manaTotal, before.pcB.manaTotal - 2);
        assert.equal(after.pcB.manaTemp, 1);
        assert.equal(after.targets.B1.tempHealth, 0);
        assert.equal(after.targets.B1.currentHp, 27);

        const activeMoves = after.targets.B1.conditions.filter(host.profile.isMovementModifier);
        assert.equal(activeMoves.length, 1);
        assert.equal(activeMoves[0].name, 'Permafrost Drag');
        assert.equal(activeMoves[0].effects.movementSpeed, -15);
        riderConditionRecordId = activeMoves[0].recordId;
        riderDueSequence = host.timing.scheduleFor(activeMoves[0], combat2()).dueSequence;
        assert.equal(typeof riderDueSequence, 'number');

        const activeSpeed = await readSharedConditionSpeed(pages.gm, host, 'B1');
        assert.equal(activeSpeed.text, 'Resulting speed: Base 35 ft · Permafrost Drag −15 ft = 20 ft');
        assert.equal(after.lastSpellReceipt.definitionVersionOrHash.endsWith(admittedRiderHash), true);
        await pages.gm.screenshot({ path: path.join(EVIDENCE_DIR, 'step11-rider-cast-accepted.png') });
        return { before, after, details: { comboText, activeSpeedText: activeSpeed.text, dueSequence: riderDueSequence } };
      }
    );

    // ── Step 12: Player B reconnects without replaying charge or rider effect ──
    await runStep(
      'step_12_player_b_reconnect_after_rider_no_replay',
      12,
      'Player B',
      'Player B reconnects (socket rejoin + full page reload) after timed rider without replaying charge or effect',
      async () => {
        const before = host.snapshot();
        const rejoin = await connectClient(pages.playerB, host, 'acct-player-b', { mode: 'socket_reconnect' });
        assert.equal(rejoin.custodyUnchanged, true);
        assert.equal(rejoin.listenersCount, 1);
        await reloadRole('playerB', 'acct-player-b', {
          isGM: false,
          pcId: 'pcB',
          character: host.makePcCharacter('ilse', 'Ilse', {
            manaCurrent: before.pcB.manaCurrent,
            tempMana: before.pcB.manaTemp,
            apCurrent: before.pcB.apCurrent,
            tempAp: before.pcB.apTemp
          })
        });
        await pages.playerB.waitForTimeout(800);
        const after = host.snapshot();
        assert.equal(after.receipts, before.receipts);
        assert.equal(after.totalReceipts, before.totalReceipts);
        assert.deepEqual(after.pcB, before.pcB);
        assert.deepEqual(after.targets, before.targets);
        const moves = after.targets.B1.conditions.filter(host.profile.isMovementModifier);
        assert.equal(moves.length, 1);
        assert.equal(moves[0].recordId, riderConditionRecordId);
        return { before, after };
      }
    );

    // ── Step 13: Timed rider expires at exact Target Beta turn-end boundary ───
    await runStep(
      'step_13_timed_rider_exact_expiry',
      13,
      'GM',
      'Timed rider Permafrost Drag stays active through Target Beta turn start and expires at Target Beta turn end',
      async () => {
        const before = host.snapshot();
        while (currentTurnId() !== 'B1') {
          await advanceTurn();
        }
        assert.ok(combat2().effectLifecycle.sequence < riderDueSequence);
        const midTurnSpeed = await readSharedConditionSpeed(pages.gm, host, 'B1');
        assert.equal(midTurnSpeed.text, 'Resulting speed: Base 35 ft · Permafrost Drag −15 ft = 20 ft');

        const seqAtExpiry = await advanceTurn();
        assert.equal(seqAtExpiry, riderDueSequence);
        const after = host.snapshot();
        assert.equal(after.targets.B1.conditions.filter(host.profile.isMovementModifier).length, 0);
        assert.equal(after.combat.activeScheduleCount, 0);
        const expiredSpeed = await readSharedConditionSpeed(pages.gm, host, 'B1');
        assert.equal(expiredSpeed.text, 'no active movement effects');
        return {
          before,
          after,
          details: { midTurnSpeedText: midTurnSpeed.text, expiredSpeedText: expiredSpeed.text, seqAtExpiry }
        };
      }
    );

    // ── Step 14: Player B casts approved 0-mana immediate spell Cinder Glass ──
    await runStep(
      'step_14_cast_zero_mana_immediate_spell',
      14,
      'Player B / GM',
      'Player B casts approved v1 Cinder Glass (2d6+1, 1 AP, explicit 0 mana) and spends 1 AP / 0 mana once',
      async () => {
        const before = host.snapshot();
        const { dialog: od, rowText } = await openAdmittedAbility(pages.playerB, RECIPES.immediate.name);
        assert.match(rowText, /1 AP \/ 0 mana/);
        assert.doesNotMatch(rowText, /4 mana/);
        const dialogText = await od.innerText();
        assert.match(dialogText, /2d6\+1/);
        assert.match(dialogText, /0 mana/);
        assert.doesNotMatch(dialogText, /4d6\+2|4 mana/);

        await selectTargetByName(pages.playerB, 'Target Alpha');
        await od.getByLabel('d6 face 1', { exact: true }).fill('4');
        await od.getByLabel('d6 face 2', { exact: true }).fill('3');
        await od.getByRole('button', { name: 'Record physical roll', exact: true }).click();
        const rollText = await od.locator('.p9-roll-result').innerText();
        assert.match(rollText, /\[4, 3\] \+ 1 = 8/);
        await od.getByRole('button', { name: 'Approve price and send to GM', exact: true }).click();
        await od.getByText(/Awaiting GM/).first().waitFor({ timeout: 15000 });

        const whilePending = host.snapshot();
        assert.deepEqual(whilePending.pcB, before.pcB, 'No spend before GM accepts');
        assert.equal(whilePending.receipts, before.receipts);

        const gmCard = pages.gm.locator('.p9-gm-card').filter({ hasText: RECIPES.immediate.name }).filter({ hasText: 'Target Alpha' }).first();
        await gmCard.waitFor({ state: 'visible', timeout: 15000 });
        assert.match(await gmCard.innerText(), /1 AP · 0 mana/);
        await gmCard.getByRole('checkbox').check();
        await gmCard.getByLabel(/^Final damage/).fill('8');
        await gmCard.getByRole('button', { name: 'Accept one consequence', exact: true }).click();

        assert.ok(await waitUntil(() => host.snapshot().receipts === 2), 'Cinder Glass receipt recorded');
        await od.getByText(/Accepted · /).first().waitFor({ timeout: 15000 });

        const after = host.snapshot();
        assert.equal(after.pcB.apTotal, before.pcB.apTotal - 1);
        assert.equal(after.pcB.manaTotal, before.pcB.manaTotal, 'Explicit 0 mana spent: total mana unchanged');
        assert.equal(after.pcB.manaCurrent, before.pcB.manaCurrent);
        assert.equal(after.pcB.manaTemp, before.pcB.manaTemp);
        assert.equal(after.targets.A1.tempHealth, 0);
        assert.equal(after.targets.A1.currentHp, 26);
        assert.equal(after.lastSpellReceipt.finalAmount, 8);
        assert.equal(after.lastSpellReceipt.definitionVersionOrHash.endsWith(admittedImmediateHash), true);
        await pages.playerB.screenshot({ path: path.join(EVIDENCE_DIR, 'step14-cinder-glass-accepted.png') });
        return { before, after, details: { rollText, commandId: after.lastSpellReceipt.commandId } };
      }
    );

    // ── Step 15: Player B reconnects after immediate cast without replay ───────
    await runStep(
      'step_15_player_b_reconnect_after_immediate_no_replay',
      15,
      'Player B',
      'Player B reconnects (socket rejoin + full page reload) after 0-mana immediate cast without replaying charge or effect',
      async () => {
        const before = host.snapshot();
        const rejoin = await connectClient(pages.playerB, host, 'acct-player-b', { mode: 'socket_reconnect' });
        assert.equal(rejoin.custodyUnchanged, true);
        assert.equal(rejoin.listenersCount, 1);
        await reloadRole('playerB', 'acct-player-b', {
          isGM: false,
          pcId: 'pcB',
          character: host.makePcCharacter('ilse', 'Ilse', {
            manaCurrent: before.pcB.manaCurrent,
            tempMana: before.pcB.manaTemp,
            apCurrent: before.pcB.apCurrent,
            tempAp: before.pcB.apTemp
          })
        });
        await pages.playerB.waitForTimeout(800);
        const after = host.snapshot();
        assert.equal(after.receipts, 2);
        assert.equal(after.totalReceipts, before.totalReceipts);
        assert.deepEqual(after.pcB, before.pcB);
        assert.deepEqual(after.targets, before.targets);
        assert.equal(after.reviewRequests.length, before.reviewRequests.length);
        assert.equal(after.admittedCount, before.admittedCount);
        return { before, after };
      }
    );

    // ── Step 16: Complete the short combat via GM End Combat UI ───────────────
    await runStep(
      'step_16_complete_short_combat',
      16,
      'GM',
      'GM completes the short combat via End Combat UI with final resources and targets preserved',
      async () => {
        const before = host.snapshot();
        await pages.gm.getByRole('button', { name: /^End Combat$|^End encounter$/i }).click();
        const endDialog = pages.gm.getByRole('dialog', { name: /End Combat|End encounter/i });
        if (await endDialog.count()) {
          const confirm = endDialog.getByRole('button', { name: /End Combat|End encounter|Confirm/i });
          if (await confirm.count()) await confirm.first().click();
        }
        assert.ok(await waitUntil(() => host.room.gameState.combat?.isActive === false), 'Combat ended cleanly');
        const after = host.snapshot();
        assert.equal(after.combat.isActive, false);
        assert.deepEqual(after.pcB, before.pcB);
        assert.deepEqual(after.targets, before.targets);
        assert.equal(after.receipts, 2);
        return { before, after };
      }
    );

    // ── Step 17: Final page error & Player A privacy audit ───────────────────
    await runStep(
      'step_17_zero_page_errors_and_privacy_final',
      17,
      'All',
      'Zero unexpected page errors and Player A saw zero private review events across the entire journey',
      async () => {
        const before = host.snapshot();
        assert.equal(report.pageErrors.length, 0, `Unexpected page errors: ${JSON.stringify(report.pageErrors)}`);
        const playerAInb = await allInbound('playerA');
        assert.equal(playerAInb.length, 0, `Player A received review events: ${JSON.stringify(playerAInb)}`);
        const playerAList = await emitAck(pages.playerA, 'authored_review_list', { roomId: host.room.id });
        assert.deepEqual(playerAList.requests, []);
        return { before, after: host.snapshot(), details: { pageErrors: 0, playerAInboundCount: 0 } };
      }
    );

    report.passed = true;
    report.verdict = 'PASS';
    console.log('OPUS1_ACCEPTANCE_PASSED', JSON.stringify({
      verdictLabel: VERDICT_LABEL,
      steps: report.steps.length,
      mainJsFile: buildId.mainJsFile,
      mainJsSha256: buildId.mainJsSha256,
      receipts: host.snapshot().receipts,
      pageErrors: report.pageErrors.length
    }));
  } catch (err) {
    report.verdict = 'FAIL';
    report.passed = false;
    if (!report.failure) report.failure = err.stack || String(err);
    for (const [role, page] of Object.entries(pages)) {
      await page.screenshot({ path: path.join(EVIDENCE_DIR, `failure-${role}.png`) }).catch(() => {});
      saveEvidence(`failure-${role}.aria.yml`, await page.locator('body').ariaSnapshot().catch(() => 'unavailable'));
    }
    console.error('OPUS1_ACCEPTANCE_FAILED', JSON.stringify({
      verdictLabel: VERDICT_LABEL,
      firstBrokenStep: report.firstBrokenStep ? report.firstBrokenStep.id : null,
      error: err.message
    }));
    throw err;
  } finally {
    report.endedAt = new Date().toISOString();
    saveEvidence('result.json', report);
    for (const ctx of Object.values(contexts)) {
      await ctx.close().catch(() => {});
    }
    await browser.close().catch(() => {});
    await host.stop().catch(() => {});
  }
}

if (require.main === module) {
  main().then(
    () => process.exit(0),
    () => process.exit(1)
  );
}
