'use strict';
/**
 * Disposable Demo Encounter Verification ("The Sunken Shrine Skirmish", DEMO CONTENT).
 * Exercises all 8 integration scenario steps through actual rendered App controls only:
 *   1. Set explicit relationships for creatures <-> two PCs via RecruitCompanionDialog.
 *   2. Activate Heightened Senses, start combat (5 combatants), enable Authenticated turn expiry.
 *   3. Open component-watch setup from Spellbook and register it (+ Demo Healing Echo follow-up).
 *   4. Cast Demo Frost Grip at Shade Stalker A; accept Demo Echo Lance follow-up at Shade Stalker B (paid once, no chain).
 *   5. Cast Demo Healing Lantern at Wounded Scout C; accept Demo Healing Echo follow-up at Mira (Demo) (paid once, no chain).
 *   6. Cast Demo Searing Frost (periodic 2-tick ongoing effect) at Shade Stalker A; observe Tick 1 of 2 / 1 of 2 remaining.
 *   7. Reload/rejoin owner page during encounter; verify retained identity/state; advance to Tick 2 of 2 expiry.
 *   8. Leave a pending approval open and End Combat; verify closure; restart combat cleanly.
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const crypto = require('crypto');

const root = path.resolve(__dirname, '../..');
const { setup: baseSetup } = require(path.join(root, 'vtt-react/verification/p9/integration/app-browser.cjs'));
const demoServer = require('./demo-server.cjs');
const committedTriggers = require(path.join(root, 'server/services/committedTriggers'));
const spellPayments = require(path.join(root, 'server/services/spellPayments'));
const { chromium } = require(path.join(root, 'vtt-react/node_modules/playwright'));

const scenario = JSON.parse(fs.readFileSync(path.join(__dirname, 'scenario-records.json'), 'utf8'));
const TRIGGER_PANEL = 'section.first-playable-trigger[aria-label="Follow-up trigger offers"]';
const PASSIVE_PANEL = 'section.first-playable-trigger[aria-label="Passive ability activation"]';
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

const buildDir = process.env.APP_BUILD_DIR || path.join(root, 'vtt-react/build');
process.env.APP_BUILD_DIR = buildDir;
const outDir = process.env.DEMO_OUTPUT || path.join(__dirname, 'evidence', 'latest');
fs.mkdirSync(outDir, { recursive: true });

const report = {
  demoContent: true,
  label: scenario.label,
  buildDir,
  assetManifestSha256: sha256(path.join(buildDir, 'asset-manifest.json')),
  passed: false,
  steps: [],
  usabilityGaps: [],
  errors: [],
  networkFixtures: { fonts: [], assets: [] }
};

function step(name, detail = {}) {
  const entry = { index: report.steps.length + 1, name, at: new Date().toISOString(), ...detail };
  report.steps.push(entry);
  console.log(`[DEMO ${entry.index}] ${name}`);
  return entry;
}

async function until(check, label, tries = 150, interval = 200) {
  for (let i = 0; i < tries; i += 1) {
    const value = await check();
    if (value) return value;
    await new Promise(r => setTimeout(r, interval));
  }
  throw Error(`Timed out waiting for: ${label}`);
}

function resources(host, tokenId) {
  const map = host.room.gameState.maps[scenario.room.mapId];
  const token = map.characterTokens[tokenId] || map.tokens[tokenId];
  if (token.character) {
    return {
      hp: token.character.health.current,
      maxHp: token.character.health.max,
      mana: token.character.mana.current,
      ap: token.character.actionPoints.current
    };
  }
  return { hp: token.state.currentHp, maxHp: token.state.maxHp };
}

function ledgerState(host) {
  const ledger = committedTriggers.ledger(host.room.gameState) || {};
  const obligations = Object.values(ledger.obligations || {});
  return {
    listeners: Array.isArray(ledger.listeners) ? ledger.listeners : [],
    offers: obligations.filter(o => o.state === 'pending-offer'),
    closed: Array.isArray(ledger.closed) ? ledger.closed : []
  };
}

async function setupPage(page, host, uid, attachOwner = true) {
  page.on('pageerror', error => report.errors.push({ uid, message: error.message, stack: error.stack }));
  const goto = page.goto.bind(page);
  page.goto = async (...args) => {
    await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {});
    await page.route(/fonts\.(googleapis|gstatic)\.com/, async route => {
      report.networkFixtures.fonts.push({ uid, url: route.request().url() });
      await route.fulfill({ status: 200, contentType: 'text/css', body: '' });
    });
    await page.unroute(/cdnjs\.cloudflare\.com/).catch(() => {});
    await page.route(/cdnjs\.cloudflare\.com/, async route => {
      report.networkFixtures.assets.push({ uid, url: route.request().url() });
      await route.fulfill({ status: 200, contentType: 'text/javascript', body: '' });
    });
    return goto(...args);
  };
  await baseSetup(page, host.url, uid);
  const pc = scenario.characters.find(c => c.ownerUid === uid);
  if (pc) {
    await page.evaluate(({ ref, pcData, attachOwner }) => {
      window.S('characterStore').setState({
        currentCharacterId: pcData.characterId,
        id: pcData.characterId,
        name: pcData.name,
        class: pcData.class,
        level: pcData.level,
        skillRanks: pcData.skillRanks || {},
        stats: pcData.stats,
        classResource: { type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'], current: 3, max: 12 }
      });
      if (attachOwner) {
        const selected = window.__actors.selectOwnerAttachment(ref);
        if (!selected.success) throw Error(JSON.stringify(selected));
      }
    }, { ref: host.refs[pc.tokenId], pcData: pc, attachOwner });
    host.setPlayerCharacter(uid, { id: pc.characterId, name: pc.name, characterName: pc.name, class: pc.class });
  } else if (uid === 'demo-gm') {
    await page.evaluate(() => {
      window.S('gameStore').setState({ isGMMode: true });
      window.S('characterStore').setState({
        currentCharacterId: 'gm', id: 'gm', name: 'GM', class: 'Arcanoneer', level: 3,
        stats: { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 },
        classResource: { type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'], current: 3, max: 12 }
      });
    });
    host.setPlayerCharacter(uid, { id: 'gm', class: 'Arcanoneer' });
  }
}

const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const castDialog = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
const tracker = p => p.getByRole('region', { name: 'Combat tracker', exact: true });
const ongoing = p => tracker(p).getByRole('region', { name: 'Ongoing effects and cooldowns', exact: true });
const clockRegion = p => p.getByRole('region', { name: 'Authenticated turn expiry', exact: true });

async function ensureTrackerExpanded(page) {
  await tracker(page).waitFor({ timeout: 20000 });
  const expand = tracker(page).getByRole('button', { name: 'Expand combat tracker', exact: true });
  if (await expand.count()) await expand.click();
}

async function openBook(p) {
  if (!(await book(p).count() && await book(p).isVisible())) {
    const charBtn = p.getByRole('button', { name: 'Character', exact: true });
    if (await charBtn.count() && await charBtn.first().isVisible().catch(() => false)) {
      await charBtn.first().click({ timeout: 3000 }).catch(() => {});
    }
    const sb = p.getByRole('button', { name: 'Spellbook S', exact: true });
    if (await sb.count() && await sb.first().isVisible().catch(() => false)) {
      await sb.first().click({ timeout: 3000 }).catch(async () => {
        await p.keyboard.press('s');
      });
    } else {
      await p.keyboard.press('s');
    }
    await book(p).waitFor({ timeout: 20000 });
  }
}

async function closeBook(p) {
  if (await book(p).count() && await book(p).isVisible().catch(() => false)) {
    const closeBtn = book(p).getByRole('button', { name: 'Close', exact: true }).first();
    await closeBtn.focus();
    await closeBtn.press('Enter');
    await book(p).waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
  }
}

async function openWizard(p) {
  await openBook(p);
  const wizTab = book(p).getByRole('button', { name: /Spell Wizard|Create New Spell|New Spell|Create Spell/i }).first();
  if (await wizTab.count() && await wizTab.isVisible().catch(() => false)) {
    await wizTab.click();
  }
  const nameInput = book(p).getByRole('textbox', { name: /Spell Name/i }).first();
  if (!(await nameInput.isVisible().catch(() => false))) {
    const btns = await book(p).locator('button').allInnerTexts().catch(() => []);
    console.log('DEBUG Spellbook buttons:', JSON.stringify(btns.slice(0, 20)));
  }
}

async function openLibrarySpell(p, spellName) {
  await openBook(p);
  const libTab = book(p).getByRole('button', { name: 'Spell Library', exact: true });
  if (await libTab.count()) await libTab.first().click();
  await book(p).getByText(spellName, { exact: true }).first().click();
  await p.getByRole('region', { name: `Room admission for ${spellName}`, exact: true }).waitFor({ timeout: 15000 });
}

async function authorSpell(p, spec) {
  await openWizard(p);
  const b = book(p);
  await b.getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(spec.name);
  await b.getByRole('textbox', { name: 'Description * *', exact: true }).fill(spec.description);
  await b.getByText('Arcane', { exact: true }).click();

  const nav = b.getByRole('navigation', { name: 'Spell wizard steps' });
  await nav.getByRole('button', { name: /Spell Type$/ }).click();
  await b.getByRole('heading', { name: 'ACTION', exact: true }).click();
  await b.getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');

  await nav.getByRole('button', { name: /^3 Effects$/ }).click();
  if (spec.effect === 'healing') {
    await b.getByRole('heading', { name: 'Healing', exact: true }).click();
    await b.getByText(spec.healingType || 'Immediate Healing', { exact: true }).click();
    await b.getByText(spec.resolution || 'Dice', { exact: true }).first().click();
    await b.getByLabel('Healing formula', { exact: true }).fill(spec.formula);
  } else if (spec.effect === 'periodic') {
    await b.getByRole('heading', { name: 'Control', exact: true }).click();
    await b.getByRole('button', { name: /Use composed effect profile/i }).click();
    await b.getByLabel(/^Canonical effect/).selectOption('periodic');
    await b.getByLabel(/^Effect name shown on the target/).fill(spec.label);
    await b.getByLabel(/^Each tick/).selectOption(spec.periodicKind);
    await b.getByLabel(/Tick amount/i).fill(spec.periodicFormula);
    await b.getByLabel(/^Damage type/).selectOption(spec.periodicDamageType || 'arcane');
    await b.getByLabel(/^Ticks/).selectOption(spec.expiryPolicy);
    await b.getByLabel(/Number of ticks/i).fill(String(spec.occurrences));
    await b.getByLabel(/^Source-authored duration text/).fill('2 target turn starts');
    await b.getByLabel(/^Required GM adjudication note/).fill('GM resolves each periodic tick with its own roll.');
  } else {
    await b.getByRole('heading', { name: 'Damage', exact: true }).click();
    await b.locator('.damage-effects-container').getByRole('textbox').first().fill(spec.effects.damage.formula);
  }

  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click();
  await b.getByText('Single Target', { exact: true }).first().click();
  await b.getByText('Ranged', { exact: true }).first().click();
  const slider = b.getByRole('slider').first();
  await slider.focus();
  await slider.press('Home');
  for (let i = 0; i < 6; i += 1) await slider.press('ArrowRight');
  await b.getByText(spec.targeting.restriction, { exact: true }).click();

  await nav.getByRole('button', { name: /Resources$/ }).click();
  await b.getByTitle('Standard magical energy', { exact: true }).click();
  await b.getByTitle('Basic action economy', { exact: true }).click();
  const inputs = b.getByRole('spinbutton');
  await inputs.nth(0).fill(String(spec.price.mana));
  await inputs.nth(1).fill(String(spec.price.ap));

  if (spec.trigger) {
    await nav.getByRole('button', { name: /Triggers/i }).click();
    await b.getByText(/Trigger Mode|Triggers/i).first().waitFor({ timeout: 15000 });
    if (spec.trigger.mode === 'effect-specific') {
      await b.getByRole('button', { name: /Effect-Specific Triggers/ }).first().click();
      const effectCard = b.getByTitle(spec.trigger.effectOption, { exact: true }).first();
      await effectCard.waitFor({ timeout: 15000 });
      await effectCard.click();
    } else {
      await b.getByRole('button', { name: /Whole Spell|Global/i }).first().click();
    }
    const trigEl = b.locator('.wow-trigger-option').filter({ hasText: spec.trigger.name }).first();
    if (!(await trigEl.isVisible().catch(() => false))) {
      const cat = b.locator('.wow-trigger-category').filter({ hasText: spec.trigger.categoryLabel || spec.trigger.category }).first();
      await cat.waitFor({ timeout: 10000 });
      await cat.click();
    }
    await trigEl.waitFor({ timeout: 10000 });
    await trigEl.click();
  }

  await nav.getByRole('button', { name: /Review/i }).click();
  // Verify Spell Behavior Flow card renders in Review
  if (spec.trigger) {
    const scope = spec.trigger.mode === 'effect-specific' ? 'component-watch' : 'whole-spell';
    try {
      await b.locator(`[data-behavior-scope="${scope}"]`).first().waitFor({ timeout: 5000 });
    } catch (err) {
      const compat = await b.getByRole('region', { name: 'Execution compatibility' }).innerText().catch(() => '');
      console.log(`DEBUG Review compat for ${spec.name}:`, compat);
      throw err;
    }
  }
  const complete = p.getByRole('button', { name: '✓ Complete Spell', exact: true });
  if (await complete.count()) await complete.click({ force: true });
  else await p.locator('.finalize-btn').click({ force: true });
  await p.waitForFunction(n => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(n)), spec.name);
  await closeBook(p);
}

async function admitSpell(p, name) {
  await openLibrarySpell(p, name);
  const adm = p.getByRole('region', { name: `Room admission for ${name}`, exact: true });
  const btn = adm.getByRole('button', { name: 'Admit this saved version', exact: true });
  if (await btn.isDisabled()) {
    console.log(`DEBUG Admission disabled for ${name}:`, await adm.innerText());
  }
  await btn.click();
  await adm.getByText(/Admitted/i).first().waitFor({ timeout: 15000 });
  await closeBook(p);
}

async function setCreatureRelationshipsViaUI(gm, creatureName, pairs) {
  const token = gm.locator('.creature-token').filter({ hasText: creatureName }).first();
  await token.waitFor({ timeout: 15000 });
  await token.click({ button: 'right', force: true });
  const menu = gm.locator('.context-menu-container').first();
  try {
    await menu.waitFor({ timeout: 4000 });
  } catch (_) {
    await token.evaluate(el => {
      const r = el.getBoundingClientRect();
      el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, button: 2 }));
    });
    await menu.waitFor({ timeout: 10000 });
  }
  const actions = menu.locator('button.context-menu-button').filter({ hasText: /Token Actions/ }).first();
  await actions.waitFor({ timeout: 10000 });
  await actions.hover();
  const submenu = menu.locator(':scope > div').nth(1);
  await submenu.waitFor({ timeout: 10000 });
  const recruitBtn = submenu.locator('button.context-menu-button').filter({ hasText: /Recruit Companion/ }).first();
  await recruitBtn.waitFor({ timeout: 10000 });
  await recruitBtn.evaluate(el => el.click());
  const dialog = gm.getByRole('dialog', { name: 'Recruit companion', exact: true });
  await dialog.waitFor({ timeout: 10000 });
  for (const { pcName, uid, value } of pairs) {
    const recBtn = dialog.getByRole('button', { name: new RegExp(`${pcName}|${uid}`) }).first();
    if (!(await recBtn.isVisible().catch(() => false))) {
      await recBtn.waitFor({ timeout: 5000 }).catch(async err => {
        console.log('DEBUG Recruit dialog:', await dialog.innerText().catch(() => ''));
        throw err;
      });
    }
    await recBtn.click();
    const label = `Mark ${value[0].toUpperCase()}${value.slice(1)}`;
    await dialog.getByRole('button', { name: label, exact: true }).click();
    await dialog.getByText(new RegExp(`Exact relationship set to ${value}`, 'i')).waitFor({ timeout: 10000 });
  }
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await dialog.waitFor({ state: 'detached', timeout: 10000 });
}

async function openAdmittedAbilities(page) {
  const details = page.locator('details.p9-admitted').first();
  await details.waitFor({ timeout: 20000 });
  if ((await details.getAttribute('open')) === null) {
    await details.locator('summary').click();
  }
  const region = page.getByRole('region', { name: 'Admitted abilities', exact: true });
  await region.waitFor({ timeout: 10000 });
  await region.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click().catch(() => {});
  return region;
}

async function castAndConfirm(host, owner, gm, { name, targetTokenId, blockedTokenIds = [], faces = [4], allyPage = null }) {
  const region = await openAdmittedAbilities(owner);
  const row = region.locator('.p9-admitted-row').filter({ hasText: name }).first();
  await row.waitFor({ timeout: 20000 });
  await row.getByRole('button', { name: 'Use admitted ability', exact: true }).click();
  const dialog = castDialog(owner);
  await dialog.waitFor({ timeout: 20000 });

  const target = dialog.getByRole('combobox', { name: 'Target', exact: true });
  await target.waitFor();
  let options = [];
  await until(async () => {
    options = await target.locator('option').evaluateAll(nodes => nodes.map(n => ({ value: n.value, text: n.textContent, disabled: n.disabled })));
    return blockedTokenIds.every(id => {
      const opt = options.find(o => o.text.includes(id));
      return !opt || !opt.text.includes('checking');
    }) && options.some(o => o.text.includes(targetTokenId) && !o.text.includes('checking'));
  }, `Target picker options ready for ${name}`, 40, 150).catch(() => {});
  for (const blockedId of blockedTokenIds) {
    const blocked = options.find(o => o.text.includes(blockedId));
    if (blocked && !blocked.text.includes('character')) {
      assert.ok(/requires (enemy|ally)|blocked|ineligible/i.test(blocked.text), `Blocked creature ${blockedId} must show restriction mismatch for ${name}; option=${JSON.stringify(blocked)}`);
    }
  }
  const match = options.find(o => !/requires (enemy|ally)|blocked/i.test(o.text) && o.text.includes(targetTokenId));
  assert.ok(match, `Target ${targetTokenId} must be eligible for ${name}; options=${JSON.stringify(options)}`);
  await target.selectOption(match.value);

  if (faces.length > 0) {
    const inputs = dialog.locator('input[aria-label^="d"]');
    for (let i = 0; i < faces.length; i += 1) await inputs.nth(i).fill(String(faces[i]));
    await dialog.getByRole('button', { name: 'Record physical roll', exact: true }).click();
  }
  await dialog.getByText(/Proposed cost/i).first().waitFor({ timeout: 10000 }).catch(() => {});

  await dialog.getByRole('button', { name: /^Approve/ }).first().click();
  await dialog.getByText(/Awaiting/i).first().waitFor({ timeout: 20000 });

  if (allyPage) {
    const allyCard = allyPage.locator('.p9-target-card, .p9-consent-card, .p9-gm-card').filter({ hasText: name }).last();
    if (await allyCard.count() && await allyCard.isVisible().catch(() => false)) {
      await allyCard.getByRole('button', { name: /Accept|Consent|Approve/i }).first().click();
    }
  }

  const pending = spellPayments.listAll(host.room).filter(e => e.approval.spell.name === name).at(-1);
  assert.ok(pending, `Pending approval recorded for ${name}`);

  const card = gm.locator('.p9-gm-card').filter({ hasText: name }).last();
  await card.waitFor({ timeout: 20000 });
  const timingClarify = card.getByLabel(/GM timing clarification/i).first();
  if (await timingClarify.count()) await timingClarify.fill('2 target turn starts');
  const checkbox = card.getByRole('checkbox').first();
  if (await checkbox.count() && !(await checkbox.isChecked())) await checkbox.check();
  const finalInput = card.getByLabel(/^Final/).first();
  if (await finalInput.count() && pending.approval.roll?.total !== undefined) await finalInput.fill(String(pending.approval.roll.total));
  await card.getByRole('button', { name: /^(Confirm|Accept)/ }).first().click();

  await dialog.getByText(/Accepted/).first().waitFor({ timeout: 25000 });
  const close = dialog.getByRole('button', { name: 'Close', exact: true }).first();
  if (await close.count()) await close.click().catch(() => {});
  return pending.approval;
}

async function advanceClock(gm, host) {
  const before = host.room.gameState.combat.effectLifecycle.sequence;
  if (!await clockRegion(gm).count()) await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click();
  await clockRegion(gm).waitFor({ timeout: 15000 });
  await clockRegion(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click();
  await until(() => host.room.gameState.combat.effectLifecycle.sequence === before + 1, 'turn advance', 150);
  await gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click();
}

async function main() {
  const host = await demoServer.start();
  report.url = host.url;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const gm = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
    const owner = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
    const ally = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();

    await setupPage(gm, host, 'demo-gm');
    await setupPage(owner, host, 'demo-owner');
    await setupPage(ally, host, 'demo-ally');

    // Form the server-held party so RecruitCompanionDialog lists both PCs as eligible recipients
    await owner.evaluate(() => new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(Error('owner presence timeout')), 10000);
      window.__socket.once('presence_registered', () => { clearTimeout(t); resolve(); });
      window.__socket.emit('register_presence', { userId: 'demo-owner', userName: 'Ilse (Demo)' });
    }));
    await ally.evaluate(() => new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(Error('ally presence timeout')), 10000);
      window.__socket.once('presence_registered', () => { clearTimeout(t); resolve(); });
      window.__socket.emit('register_presence', { userId: 'demo-ally', userName: 'Mira (Demo)' });
    }));
    const partyId = await owner.evaluate(() => new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(Error('party_created timeout')), 10000);
      window.__socket.once('party_created', ({ party }) => { clearTimeout(t); resolve(party.id); });
      window.__socket.emit('create_party', { partyName: 'Demo Party', leaderData: { characterName: 'Ilse (Demo)' } });
    }));
    await ally.evaluate(() => {
      window.__allyJoined = new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(Error('accept_party_invite timeout')), 10000);
        window.__socket.once('party_error', e => { clearTimeout(t); reject(Error('party_error: ' + JSON.stringify(e))); });
        window.__socket.once('party_invitation_received', inv => {
          const done = () => { clearTimeout(t); resolve(); };
          window.__socket.once('party_joined', done);
          window.__socket.once('party_join_confirmed', done);
          window.__socket.emit('accept_party_invite', { invitationId: inv.id || inv.invitationId });
        });
      });
    });
    await owner.evaluate(pid => new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(Error('invite_to_party timeout')), 10000);
      window.__socket.once('party_invite_failed', e => { clearTimeout(t); reject(Error('party_invite_failed: ' + JSON.stringify(e))); });
      window.__socket.once('invitation_sent', () => { clearTimeout(t); resolve(); });
      window.__socket.emit('invite_to_party', { partyId: pid, toUserId: 'demo-ally' });
    }), partyId);
    await ally.evaluate(() => window.__allyJoined);

    // Step 0: Author & admit the 5 demo spells via Spell Wizard & Spell Library
    step('0. Author and admit the 5 demo spells via Spell Wizard & Spell Library');
    await authorSpell(gm, scenario.spells.componentWatchDamageParent);
    await authorSpell(gm, scenario.spells.damageFollowUp);
    await authorSpell(gm, scenario.spells.healingParent);
    await authorSpell(gm, scenario.spells.healingFollowUp);
    await authorSpell(gm, scenario.spells.ongoingPeriodic);
    for (const s of Object.values(scenario.spells)) {
      await admitSpell(gm, s.name);
    }

    // Step 1: Set explicit relationships for creatures <-> PCs via rendered RecruitCompanionDialog
    step('1. Set explicit relationships for creatures <-> two PCs via RecruitCompanionDialog');
    await setCreatureRelationshipsViaUI(gm, 'Shade Stalker A', [
      { pcName: 'Ilse', uid: 'demo-owner', value: 'enemy' },
      { pcName: 'Mira', uid: 'demo-ally', value: 'enemy' }
    ]);
    await setCreatureRelationshipsViaUI(gm, 'Shade Stalker B', [
      { pcName: 'Ilse', uid: 'demo-owner', value: 'enemy' },
      { pcName: 'Mira', uid: 'demo-ally', value: 'enemy' }
    ]);
    await setCreatureRelationshipsViaUI(gm, 'Wounded Scout C', [
      { pcName: 'Ilse', uid: 'demo-owner', value: 'ally' },
      { pcName: 'Mira', uid: 'demo-ally', value: 'ally' }
    ]);
    report.usabilityGaps.push({
      step: 1,
      gap: 'No rendered PC-to-PC relationship UI exists in CharacterToken or PartyHUD; Ilse <-> Mira (ally) was seeded by demo-server.cjs.'
    });

    // Step 2: Activate Heightened Senses, start combat, and enable Authenticated turn expiry
    step('2. Activate Heightened Senses, start combat, and enable Authenticated turn expiry');
    const passiveGm = gm.locator(PASSIVE_PANEL);
    await passiveGm.waitFor({ timeout: 20000 });
    const passiveTargetSelect = passiveGm.getByLabel('Target primary PC', { exact: true });
    if (!(await passiveTargetSelect.isVisible().catch(() => false))) {
      await passiveGm.locator('summary').first().click();
    }
    const ilsePassiveOpt = await passiveTargetSelect.locator('option').evaluateAll(opts => opts.find(o => o.textContent.includes('Ilse'))?.value);
    assert.ok(ilsePassiveOpt, 'Ilse available in Target primary PC');
    await passiveTargetSelect.selectOption(ilsePassiveOpt);
    await passiveGm.getByRole('button', { name: /Activate Heightened Senses/i }).click();
    await until(async () => /Active/i.test(await owner.locator(PASSIVE_PANEL).innerText()), 'owner sees Heightened Senses active');

    const initBtn = gm.locator('button[title*="Combat Initiator"]').first();
    if (await initBtn.isVisible().catch(() => false)) await initBtn.click();
    else {
      await gm.locator('body').click({ position: { x: 700, y: 500 } });
      await gm.keyboard.press('x');
    }
    const overlay = gm.locator('.combat-selection-window');
    await overlay.waitFor({ timeout: 20000 });
    for (const label of ['Ilse', 'Mira', 'Shade Stalker A', 'Shade Stalker B', 'Wounded Scout C']) {
      await overlay.locator('.discovery-item').filter({ hasText: label }).first().click();
    }
    await overlay.getByRole('button', { name: /^Begin Combat \(5\)$/i }).click();
    await until(() => host.room.gameState.combat?.isActive === true, 'combat started');
    const ilseCombatant = host.room.gameState.combat.turnOrder.find(t => t.name.includes('Ilse'));
    assert.equal(ilseCombatant.passiveApplied, true, 'Heightened Senses applied to Ilse initiative');
    assert.equal(ilseCombatant.initiativeMod, 4, 'Ilse initiativeMod = +2 agility +2 Heightened Senses');

    await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click();
    await clockRegion(gm).waitFor({ timeout: 20000 });
    await clockRegion(gm).getByRole('button', { name: 'Enable authenticated turn expiry', exact: true }).click();
    await until(() => !!host.room.gameState.combat?.effectLifecycle, 'authenticated turn expiry enabled');
    await gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click();

    // Step 3: Open component-watch setup from Spellbook and register it (+ Demo Healing Echo follow-up)
    step('3. Open component-watch setup from Spellbook and register it');
    await openLibrarySpell(gm, scenario.spells.componentWatchDamageParent.name);
    await gm.getByRole('region', { name: `Room admission for ${scenario.spells.componentWatchDamageParent.name}`, exact: true })
      .locator('[data-trigger-setup-action="component-watch"]').click();
    await closeBook(gm);

    const gmTriggerPanel = gm.locator(TRIGGER_PANEL);
    await gmTriggerPanel.locator('[data-guided-trigger-setup="component-watch"]').waitFor({ timeout: 10000 });
    const watchPcSelect = gmTriggerPanel.getByLabel(/Watching primary PC/i);
    const ilseWatchOpt = await watchPcSelect.locator('option').evaluateAll(opts => opts.find(o => o.textContent.includes('Ilse'))?.value);
    assert.ok(ilseWatchOpt, 'Ilse available as Watching primary PC');
    await watchPcSelect.selectOption(ilseWatchOpt);
    const watchFollowSelect = gmTriggerPanel.getByLabel(/Follow-up spell B/i);
    const echoOpt = await watchFollowSelect.locator('option').evaluateAll(opts => opts.find(o => o.textContent.includes('Demo Echo Lance'))?.value);
    assert.ok(echoOpt, 'Demo Echo Lance available as watch follow-up');
    await watchFollowSelect.selectOption(echoOpt);
    await gmTriggerPanel.getByRole('button', { name: 'Register component watch', exact: true }).click();
    await gmTriggerPanel.locator('.first-playable-trigger-row')
      .filter({ hasText: /Demo Echo Lance/ })
      .filter({ has: gm.getByRole('button', { name: 'Revoke pairing', exact: true }) })
      .first().waitFor({ timeout: 15000 });

    // Step 4: Cast Demo Frost Grip and accept Demo Echo Lance follow-up
    step('4. Cast Demo Frost Grip at Shade Stalker A and accept Demo Echo Lance at Shade Stalker B');
    const aBefore = resources(host, 'A');
    const ilseBeforeGrip = resources(host, 'pc');
    await castAndConfirm(host, owner, gm, {
      name: scenario.spells.componentWatchDamageParent.name,
      targetTokenId: 'A',
      blockedTokenIds: ['Mira', 'Wounded Scout C'],
      faces: [4]
    });
    assert.ok(resources(host, 'A').hp < aBefore.hp, 'Shade Stalker A took base HP damage');
    const ilseAfterGrip = resources(host, 'pc');
    assert.equal(ilseBeforeGrip.ap - ilseAfterGrip.ap, 1, 'Demo Frost Grip paid 1 AP once');
    assert.equal(ilseBeforeGrip.mana - ilseAfterGrip.mana, 2, 'Demo Frost Grip paid 2 Mana once');

    const offerPanel = owner.locator(TRIGGER_PANEL);
    await until(async () => (await offerPanel.count()) > 0 && (await offerPanel.innerText()).includes(scenario.spells.damageFollowUp.name), 'Demo Echo Lance offer visible', 40, 200).catch(async err => {
      console.log('DEBUG owner offerPanel count:', await offerPanel.count());
      console.log('DEBUG owner trigger outbound:', JSON.stringify(await owner.evaluate(() => window.__outbound.filter(e => e.event.includes('trigger')))));
      console.log('DEBUG owner trigger store:', JSON.stringify(await owner.evaluate(() => {
        const mod = Object.entries(window.__req.m).find(([, f]) => f.toString().includes('useTriggerOfferStore'));
        return mod ? window.__req(mod[0]).useTriggerOfferStore.getState() : 'NO_MOD';
      })));
      throw err;
    });
    const bBefore = resources(host, 'B');
    const ilseBeforeFollow = resources(host, 'pc');
    await offerPanel.locator('.first-playable-trigger-row').filter({ hasText: scenario.spells.damageFollowUp.name }).first()
      .getByRole('button', { name: 'Use this offer', exact: true }).click();
    const followDialog = castDialog(owner);
    await followDialog.waitFor({ timeout: 20000 });
    const fTarget = followDialog.getByRole('combobox', { name: 'Target', exact: true });
    const fMatch = (await fTarget.locator('option').evaluateAll(n => n.map(o => ({ value: o.value, text: o.textContent, disabled: o.disabled }))))
      .find(o => !o.disabled && o.text.includes('B'));
    await fTarget.selectOption(fMatch.value);
    await followDialog.locator('input[aria-label^="d"]').first().fill('4');
    await followDialog.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    await followDialog.getByRole('button', { name: /^Approve/ }).first().click();
    const gmCard = gm.locator('.p9-gm-card').filter({ hasText: scenario.spells.damageFollowUp.name }).last();
    await gmCard.waitFor({ timeout: 20000 });
    await gmCard.getByRole('checkbox').first().check();
    const followPending = spellPayments.listAll(host.room).filter(e => e.approval.spell.name === scenario.spells.damageFollowUp.name).at(-1);
    const fFinal = gmCard.getByLabel(/^Final/).first();
    if (await fFinal.count() && followPending) await fFinal.fill(String(followPending.approval.roll.total));
    await gmCard.getByRole('button', { name: /^(Confirm|Accept)/ }).first().click();
    await followDialog.getByText(/Accepted/).first().waitFor({ timeout: 20000 });
    await followDialog.getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {});
    const ilseAfterFollow = resources(host, 'pc');
    assert.equal(ilseBeforeFollow.ap - ilseAfterFollow.ap, 1, 'Demo Echo Lance paid 1 AP once');
    assert.equal(ilseBeforeFollow.mana - ilseAfterFollow.mana, 2, 'Demo Echo Lance paid 2 Mana once');
    assert.ok(resources(host, 'B').hp < bBefore.hp, 'Shade Stalker B took follow-up damage');
    assert.equal(ledgerState(host).offers.length, 0, 'Follow-up offer consumed; no executable chain');

    // Step 5: Revoke component watch, register Demo Healing Echo, cast Demo Healing Lantern, and accept Demo Healing Echo
    step('5. Revoke component watch, register Demo Healing Echo, cast Demo Healing Lantern at Wounded Scout C, and accept Demo Healing Echo at Mira (Demo)');
    await gmTriggerPanel.getByRole('button', { name: 'Revoke pairing', exact: true }).first().click();
    await gmTriggerPanel.getByRole('button', { name: 'Revoke pairing', exact: true }).waitFor({ state: 'detached', timeout: 15000 });
    await openLibrarySpell(gm, scenario.spells.healingFollowUp.name);
    await gm.getByRole('region', { name: `Room admission for ${scenario.spells.healingFollowUp.name}`, exact: true })
      .locator('[data-trigger-setup-action="follow-up"]').click();
    await closeBook(gm);
    await gmTriggerPanel.locator('[data-guided-trigger-setup="follow-up"]').waitFor({ timeout: 10000 });
    const sourcePcSelect = gmTriggerPanel.getByLabel(/Source primary PC/i);
    const ilseSourceOpt = await sourcePcSelect.locator('option').evaluateAll(opts => opts.find(o => o.textContent.includes('Ilse'))?.value);
    assert.ok(ilseSourceOpt, 'Ilse available as Source primary PC');
    await sourcePcSelect.selectOption(ilseSourceOpt);
    await gmTriggerPanel.getByRole('button', { name: 'Register follow-up pairing', exact: true }).click();
    await gmTriggerPanel.locator('.first-playable-trigger-row')
      .filter({ hasText: /Demo Healing Echo/ })
      .filter({ has: gm.getByRole('button', { name: 'Revoke pairing', exact: true }) })
      .first().waitFor({ timeout: 15000 });
    const cBefore = resources(host, 'C');
    await castAndConfirm(host, owner, gm, {
      name: scenario.spells.healingParent.name,
      targetTokenId: 'C',
      blockedTokenIds: ['Shade Stalker A', 'Shade Stalker B'],
      faces: [4]
    });
    assert.ok(resources(host, 'C').hp > cBefore.hp, 'Wounded Scout C healed');

    await until(async () => (await offerPanel.count()) > 0 && (await offerPanel.innerText()).includes(scenario.spells.healingFollowUp.name), 'Demo Healing Echo offer visible');
    const miraBefore = resources(host, 'pc2');
    const ilseBeforeHealFollow = resources(host, 'pc');
    await offerPanel.locator('.first-playable-trigger-row').filter({ hasText: scenario.spells.healingFollowUp.name }).first()
      .getByRole('button', { name: 'Use this offer', exact: true }).click();
    const healFollowDialog = castDialog(owner);
    await healFollowDialog.waitFor({ timeout: 20000 });
    const hTarget = healFollowDialog.getByRole('combobox', { name: 'Target', exact: true });
    const hMatch = (await hTarget.locator('option').evaluateAll(n => n.map(o => ({ value: o.value, text: o.textContent, disabled: o.disabled }))))
      .find(o => !o.disabled && o.text.includes('Mira'));
    assert.ok(hMatch, 'Mira (Demo) enabled for Demo Healing Echo');
    await hTarget.selectOption(hMatch.value);
    await healFollowDialog.locator('input[aria-label^="d"]').first().fill('5');
    await healFollowDialog.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    await healFollowDialog.getByRole('button', { name: /^Approve/ }).first().click();

    // Mira's owner (ally) consents if Direct healing proposal is prompted; otherwise GM confirms directly
    const allyNotices = ally.locator('details.p9-admitted').filter({ hasText: /Stunned notices and voluntary proposals/i }).first();
    const gmHealCard = gm.locator('.p9-gm-card').filter({ hasText: scenario.spells.healingFollowUp.name }).last();
    await until(async () => (await allyNotices.count()) > 0 || (await gmHealCard.count()) > 0, 'healing follow-up awaiting target consent or GM');
    if ((await allyNotices.count()) > 0 && await allyNotices.isVisible().catch(() => false)) {
      if ((await allyNotices.getAttribute('open')) === null) await allyNotices.locator('summary').click();
      const acceptHealBtn = ally.getByRole('button', { name: 'Accept this exact healing proposal', exact: true });
      if (await acceptHealBtn.count()) await acceptHealBtn.click();
    }
    await gmHealCard.waitFor({ timeout: 20000 });
    await gmHealCard.getByRole('checkbox').first().check();
    const healPending = spellPayments.listAll(host.room).filter(e => e.approval.spell.name === scenario.spells.healingFollowUp.name).at(-1);
    const hFinal = gmHealCard.getByLabel(/^Final/).first();
    if (await hFinal.count() && healPending) await hFinal.fill(String(healPending.approval.roll.total));
    await gmHealCard.getByRole('button', { name: /^(Confirm|Accept)/ }).first().click();
    await healFollowDialog.getByText(/Accepted/).first().waitFor({ timeout: 20000 });
    await healFollowDialog.getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {});
    assert.ok(resources(host, 'pc2').hp > miraBefore.hp, 'Mira (Demo) healed by Demo Healing Echo');
    const ilseAfterHealFollow = resources(host, 'pc');
    assert.equal(ilseBeforeHealFollow.ap - ilseAfterHealFollow.ap, 1, 'Demo Healing Echo paid 1 AP once');
    assert.equal(ilseBeforeHealFollow.mana - ilseAfterHealFollow.mana, 3, 'Demo Healing Echo paid 3 Mana once');
    assert.equal(ledgerState(host).offers.length, 0, 'Healing follow-up offer consumed; no chain');

    // Step 6: Apply a supported ongoing effect; observe its tick/expiry display
    step('6. Cast Demo Searing Frost (ongoing periodic effect) and observe Tick 1 of 2 display');
    await ensureTrackerExpanded(gm);
    await ensureTrackerExpanded(owner);
    await castAndConfirm(host, owner, gm, {
      name: scenario.spells.ongoingPeriodic.name,
      targetTokenId: 'A',
      blockedTokenIds: ['Mira', 'Wounded Scout C'],
      faces: []
    });
    // Advance authenticated turn until Tick 1 of 2 is recorded
    for (let i = 0; i < 6; i += 1) {
      await gm.waitForTimeout(300);
      const text = await ongoing(gm).innerText().catch(() => '');
      if (text.includes('1 of 2 target-turn tick remaining') || text.includes('Tick 1 of 2')) break;
      await advanceClock(gm, host);
    }
    await until(async () => (await ongoing(gm).innerText().catch(() => '')).includes('1 of 2 target-turn tick remaining'), 'GM sees 1 of 2 remaining', 30, 200).catch(async err => {
      console.log('DEBUG GM ongoing text:', await ongoing(gm).innerText().catch(() => 'NONE'));
      throw err;
    });
    await until(async () => (await ongoing(owner).innerText().catch(() => '')).includes('1 of 2 target-turn tick remaining'), 'Owner sees 1 of 2 remaining');

    // Step 7: Reload/rejoin during the encounter and continue
    step('7. Reload/rejoin owner during encounter; verify retained identity/state and advance to expiry');
    await setupPage(owner, host, 'demo-owner', false);
    await until(async () => /Active/i.test(await owner.locator(PASSIVE_PANEL).innerText()), 'owner retains Heightened Senses active after reload');
    await ensureTrackerExpanded(owner);
    await until(async () => (await ongoing(owner).innerText()).includes('1 of 2 target-turn tick remaining'), 'owner retains ongoing effect display after reload');

    for (let i = 0; i < 6; i += 1) {
      const text = await ongoing(gm).innerText().catch(() => '');
      if (text.includes('Tick 2 of 2 (last tick; effect ended)')) break;
      await advanceClock(gm, host);
    }
    await until(async () => (await ongoing(gm).innerText()).includes('Tick 2 of 2 (last tick; effect ended)'), 'GM sees Tick 2 of 2 expiry');
    await until(async () => (await ongoing(owner).innerText()).includes('Tick 2 of 2 (last tick; effect ended)'), 'Owner sees Tick 2 of 2 expiry');

    // Step 8: End/restart combat with an approval pending; verify correct closure
    step('8. Leave pending approval open, End Combat, verify closure, and restart combat cleanly');
    const region = await openAdmittedAbilities(owner);
    await region.locator('.p9-admitted-row').filter({ hasText: scenario.spells.componentWatchDamageParent.name }).first()
      .getByRole('button', { name: 'Use admitted ability', exact: true }).click();
    const pendingDialog = castDialog(owner);
    await pendingDialog.waitFor({ timeout: 20000 });
    const useAttachBtn = pendingDialog.getByRole('button', { name: 'Use this owner attachment', exact: true });
    await useAttachBtn.waitFor({ timeout: 10000 });
    await useAttachBtn.click();
    const pTarget = pendingDialog.getByRole('combobox', { name: 'Target', exact: true });
    await pTarget.waitFor({ timeout: 10000 });
    let pMatch = null;
    await until(async () => {
      const retryBtn = pendingDialog.getByRole('button', { name: 'Retry relationship check', exact: true });
      if (await retryBtn.isVisible().catch(() => false)) {
        await new Promise(r => setTimeout(r, 1100));
        await retryBtn.click().catch(() => {});
      }
      const opts = await pTarget.locator('option').evaluateAll(n => n.map(o => ({ value: o.value, text: o.textContent, disabled: o.disabled })));
      pMatch = opts.find(o => !o.disabled && !/checking|requires|could not verify/i.test(o.text) && o.text.includes('Shade Stalker A'));
      return !!pMatch;
    }, 'Target Shade Stalker A ready in Step 8');
    await pTarget.selectOption(pMatch.value);
    await pendingDialog.locator('input[aria-label^="d"]').first().fill('3');
    await pendingDialog.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    await pendingDialog.getByRole('button', { name: /^Approve/ }).first().click();
    await pendingDialog.getByText(/Awaiting GM/).first().waitFor({ timeout: 20000 });

    const ilseBeforePendingEnd = resources(host, 'pc');
    assert.equal(spellPayments.listAll(host.room).length, 1, 'One approval pending before End Combat');
    await tracker(gm).getByRole('button', { name: 'End Combat', exact: true }).click();
    await until(() => !host.room.gameState.combat?.isActive, 'combat ended');
    await until(() => spellPayments.listAll(host.room).length === 0, 'pending approval cleaned up on End Combat');
    const ilseAfterPendingEnd = resources(host, 'pc');
    assert.deepEqual(ilseAfterPendingEnd, ilseBeforePendingEnd, 'Closing pending approval on End Combat spends no resources');
    await pendingDialog.getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {});

    // Restart combat cleanly with no leftover approvals
    const restartBtn = gm.locator('button[title*="Combat Initiator"]').first();
    if (await restartBtn.isVisible().catch(() => false)) await restartBtn.click();
    else {
      await gm.locator('body').click({ position: { x: 700, y: 500 } });
      await gm.keyboard.press('x');
    }
    const restartOverlay = gm.locator('.combat-selection-window');
    await restartOverlay.waitFor({ timeout: 20000 });
    for (const label of ['Ilse', 'Mira', 'Shade Stalker A', 'Shade Stalker B', 'Wounded Scout C']) {
      await restartOverlay.locator('.discovery-item').filter({ hasText: label }).first().click();
    }
    await restartOverlay.getByRole('button', { name: /^Begin Combat \(5\)$/i }).click();
    await until(() => host.room.gameState.combat?.isActive === true, 'combat restarted cleanly');
    assert.equal(spellPayments.listAll(host.room).length, 0, 'no leftover pending approvals after restart');

    report.passed = report.errors.length === 0;
  } finally {
    if (browser) await browser.close().catch(() => {});
    await host.stop().catch(() => {});
    fs.writeFileSync(path.join(outDir, 'result.json'), JSON.stringify(report, null, 2));
    console.log(`Demo verification ${report.passed ? 'PASSED' : 'FAILED'} (${report.errors.length} page errors) -> ${outDir}`);
    if (!report.passed) process.exitCode = 1;
  }
}

main().catch(err => {
  report.fatal = err.stack || err.message;
  fs.writeFileSync(path.join(outDir, 'result.json'), JSON.stringify(report, null, 2));
  console.error(err);
  process.exit(1);
});
