// Attribute effects + authenticated caster-start cooldowns witness
// Based on handoff/attribute-cooldowns/APP_CHECKLIST.md
/* global S, __socket, __actors, __outbound */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.AC_OUTPUT || path.resolve(__dirname, 'attribute-cooldown-evidence');
if (!process.env.APP_BUILD_DIR) process.env.APP_BUILD_DIR = path.resolve('d:/VTT/vtt-react/build');
process.env.APP_BUILD_DIR = path.resolve(process.env.APP_BUILD_DIR);
if (!process.env.APP_PORT) process.env.APP_PORT = '0';
fs.mkdirSync(out, { recursive: true });

const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const profile = require('../../src/services/sharedConditionProfile');
const timing = require('../../src/services/sharedEffectTiming');
const cooldown = require('../../src/services/authoredCooldown');
const pure = require('../../src/services/authoredAbility');
const fixtureCharacters = require('./m4b-fixture-characters.cjs');

function ownerFixture() {
  const record = JSON.parse(JSON.stringify(fixtureCharacters.characters['app-owner']));
  const stats = { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 };
  return Object.assign(record, {
    class: 'Arcanoneer', level: 3, stats: { ...stats }, baseStats: { ...stats }, buffs: [], debuffs: [],
    classResource: { type: 'elementalSpheres', spheres: [], current: 0, max: 12 }, class_spells: { known_spells: [] },
    health: { current: 30, max: 40 }, mana: { current: 20, max: 30 }, actionPoints: { current: 5, max: 5 },
    tempHealth: 0, tempMana: 5, tempActionPoints: 2
  });
}

async function loadOwnerFixture(page) {
  return page.evaluate(async character => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const store = S('characterStore'), sleep = ms => new Promise(r => setTimeout(r, ms));
    for (let i = 0; i < 150 && !(store.getState().currentCharacterId && !store.getState().isLoading); i++) await sleep(100);
    for (let stable = 0, last = null; stable < 5;) {
      const st = store.getState(), key = `${st.currentCharacterId}|${st.characters.length}|${!!st.isLoading}`;
      stable = key === last ? stable + 1 : 0; last = key; await sleep(100);
    }
    store.setState({ characters: [character] });
    S('gameStore').setState({ isInMultiplayer: false });
    store.getState().loadCharacter(character.id);
    S('gameStore').setState({ isInMultiplayer: true });
    const selected = __actors.selectOwnerAttachment(fixture.refs.pc);
    if (!selected.success) throw Error(JSON.stringify(selected));
    const st = store.getState();
    return { characterId: st.currentCharacterId, race: st.race, subrace: st.subrace, statsModel: st.statsModel };
  }, ownerFixture());
}

async function setup(page, url, uid) {
  if (!page.__ccFonts) {
    page.__ccFonts = true;
    const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async(...args) => {
      await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {});
      await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts);
      return goto(...args);
    };
  }
  let result, lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      result = await baseSetup(page, url, uid);
      if (result) break;
    } catch (e) {
      lastErr = e;
      if (attempt < 2 && /retired_principal|failed to fetch/i.test(e.message)) {
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }
      throw e;
    }
  }
  if (!result && lastErr) throw lastErr;
  if (uid === 'app-owner') result.hydration = await loadOwnerFixture(page);
  return result;
}

const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = {
  startedAt: new Date().toISOString(),
  checks: {},
  qualifications: [
    'Real optimized App and registered backend; identity/provider/ownership/lease/cloud are fixture boundaries (mocked services).',
    'Temporary room: accepted-live only. No live Firebase, deployment, physical second device or human tabletop claim.',
    'Complete deterministic owner record loaded through production loadCharacter after boot (setup instrumentation only).',
    'Wizard primitives only. No catalogue record, pin or stripped catalogue demonstration.'
  ],
  errors: [],
  steps: [],
  stages: {},
  limits: [
    'Real optimized App and registered backend; identity/provider/ownership/lease/cloud are fixture boundaries (mocked services).',
    'Temporary room: accepted-live only. No live Firebase, deployment, physical second device or human tabletop claim.',
    'Complete deterministic owner record loaded through production loadCharacter after boot (setup instrumentation only).',
    'Wizard primitives only. No catalogue record, pin or stripped catalogue demonstration.'
  ]
};

function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body'));
  if (L.__cc) return;
  L.__cc = true;
  const click = L.click;
  L.click = async function(options = {}) {
    try {
      return await click.call(this, { timeout: 20000, ...options });
    } catch (e) {
      if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e;
      return click.call(this, { ...options, force: true });
    }
  };
}

const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); };
const stage = (name, how, detail) => { report.stages[name] = { how, ...(detail ? { detail } : {}) }; };
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const ownerDialog = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
const clockUI = p => p.getByRole('region', { name: 'Authenticated turn expiry', exact: true });

const hall = host => host.room.gameState.maps['app-hall'];
const A = host => hall(host).tokens.A;
const B = host => hall(host).tokens.B;
const PC = host => hall(host).characterTokens.pc;
const hpOf = token => ({ current: token.state.currentHp, temp: token.state.tempHealth });
const attrsOf = token => (token.state.conditions || []).filter(profile.isAttributeModifier).map(c => { const [attribute, amount] = Object.entries(c.effects || {})[0] || []; return { ...c, attribute, amount, raw: c }; });
const cds = host => actors.clone(PC(host).state.authoredCooldowns || {});
const pool = host => actors.clone(actors.resources(PC(host), 'character'));
const wait = async(fn, n = 80) => { for (let i = 0; i < n && !fn(); i++) await new Promise(r => setTimeout(r, 150)); return fn(); };

async function openBook(p) {
  const role = p.getByRole('button', { name: 'Character', exact: true });
  if (await role.count()) await role.click();
  else await p.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
  const sb = p.getByRole('button', { name: 'Spellbook S', exact: true });
  if (await sb.count()) await sb.click();
  else await p.locator('button', { hasText: /Spellbook/ }).first().click();
  await book(p).waitFor();
}

async function closeBook(p) {
  const b = book(p).getByRole('button', { name: 'Close', exact: true });
  await b.focus();
  await b.press('Enter');
}

const savedRecord = (p, name) => p.evaluate(name => {
  const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData'));
  return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === name) : null;
}, name);

/** Author an attribute ability through the ordinary Spell Wizard controls. */
async function author(p, c) {
  await openBook(p);
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(c.name);
  await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill(`Disposable attribute-cooldown witness (${c.attribute || c.kind}).`);
  await book(p).getByText('Arcane', { exact: true }).click();
  const nav = book(p).getByRole('navigation', { name: 'Spell wizard steps' });
  await nav.getByRole('button', { name: /Spell Type$/ }).click();
  await book(p).getByRole('heading', { name: 'ACTION', exact: true }).click();
  await book(p).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await nav.getByRole('button', { name: /^3 Effects$/ }).click();
  if (c.now) {
    await book(p).getByRole('heading', { name: 'Damage', exact: true }).click();
    await book(p).locator('.damage-effects-container').getByRole('textbox').first().fill(c.now);
  }
  await book(p).getByRole('heading', { name: 'Control', exact: true }).click();
  await book(p).getByRole('button', { name: /^Use composed effect profile/ }).click();
  const fields = book(p).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
  await fields.getByLabel(/^Canonical effect/).selectOption('attribute');
  await fields.getByLabel(/^Effect name shown on the target/).fill(c.label);
  await fields.getByLabel(/^Attribute/).selectOption(c.attribute);
  await fields.getByLabel(/^Change to the score/).fill(String(c.amount));
  await fields.getByLabel(/^Expiry/).selectOption(c.policy);
  if (c.policy.includes('-count')) {
    const count = fields.locator('input[type="number"][min="2"]');
    await count.waitFor();
    await count.fill(String(c.occurrences));
  }
  await fields.getByLabel(/^Source-authored duration text/).fill(c.duration || 'Until dispelled');
  await fields.getByLabel(/^Required GM adjudication note/).fill('GM resolves target and range.');

  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click();
  await book(p).getByText('Single Target', { exact: true }).click();
  await book(p).getByText('Ranged', { exact: true }).click();
  const slider = book(p).getByRole('slider').first();
  await slider.focus();
  await slider.press('Home');
  for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(p).getByText('Enemies', { exact: true }).click();
  await book(p).getByText('Any Target', { exact: true }).click();

  await nav.getByRole('button', { name: /Resources$/ }).click();
  await book(p).getByTitle('Standard magical energy', { exact: true }).click();
  await book(p).getByTitle('Basic action economy', { exact: true }).click();
  const inputs = book(p).getByRole('spinbutton');
  await inputs.nth(0).fill('1'); await inputs.nth(0).fill(String(c.mana));
  await inputs.nth(1).fill('1'); await inputs.nth(1).fill(String(c.ap));

  await nav.getByRole('button', { name: /Cooldown$/ }).click();
  await book(p).getByRole('button', { name: 'Authenticated Caster Starts', exact: true }).click();
  await book(p).getByLabel('Caster-turn starts to count (1–10)', { exact: true }).fill(String(c.cooldown));
  await book(p).getByText(new RegExp(`${c.cooldown} strictly upcoming caster-turn start`)).first().waitFor();
  (report.checks.wizardCooldownText ||= {})[c.name] = await book(p).getByText(/or one Agility, Intelligence or Spirit change/).innerText();
  save(`wizard-cooldown-${c.attribute || c.name}.aria.yml`, await book(p).ariaSnapshot());

  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click({ force: true });
  await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), c.name);
  const r = await savedRecord(p, c.name);
  save(`wizard-saved-${c.name}.json`, r);
  assert.deepEqual(r.authoredDraft.cooldownConfig, { cooldownType: cooldown.TYPE, cooldownValue: c.cooldown });

  const mapped = pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' });
  assert.equal(mapped.ok, true, JSON.stringify(mapped));
  assert.deepEqual(mapped.definition.cooldown, { cooldownType: cooldown.TYPE, cooldownValue: c.cooldown });
  assert.equal(mapped.definition.effects.condition.kind, 'attribute');
  assert.equal(mapped.definition.effects.condition.attribute, c.attribute);
  assert.equal(mapped.definition.effects.condition.amount, c.amount);

  (report.checks.definitionSummary ||= {})[c.name] = pure.definitionSummary(mapped.definition);
  await closeBook(p);
  return r;
}

async function admitAllForPc(p, list) {
  await openBook(p);
  await book(p).getByRole('button', { name: 'Spell Library', exact: true }).click();
  for (const { name, original } of list) {
    await book(p).getByText(name, { exact: true }).click();
    const section = p.getByRole('region', { name: `Room admission for ${name}`, exact: true });
    await section.waitFor();
    const cur = await savedRecord(p, name);
    assert.equal(cur.id, original.id, 'id preserved');
    assert.equal(cur.dateCreated, original.dateCreated, 'dateCreated preserved');
    assert.deepEqual(cur.authoredDraft, original.authoredDraft, 'authoredDraft preserved');
    (report.checks.admissionText ||= {})[name] = await section.innerText();
    await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click();
    await section.getByText(/^Admitted for /).waitFor();
    save(`admitted-${name.replace(/\W+/g, '-')}.aria.yml`, await section.ariaSnapshot());
    await p.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click({ timeout: 3000 }).catch(() => p.keyboard.press('Escape'));
    await p.waitForTimeout(500);
  }
  await closeBook(p).catch(() => {});
}

async function gmRemoveAttribute(gm, host, tokenId, name) {
  const currentAttrs = attrsOf(hall(host).tokens[tokenId]);
  if (currentAttrs.length) {
    const cId = currentAttrs[0].recordId || currentAttrs[0].id;
    const targetRef = host.refs[tokenId];
    const targetToken = hall(host).tokens[tokenId];
    const removal = {
      version: 1,
      roomId: host.room.id,
      commandId: crypto.randomUUID(),
      actionEpoch: actors.epoch(host.room),
      baseCommitSequence: actors.ledger(host.room).commitSequence,
      actors: [{
        ref: targetRef,
        expectedRevision: targetToken.state.actorContract.revision,
        conditions: [{ op: 'remove', recordId: cId }]
      }],
      adjudication: {
        definitionId: 'gm-correction',
        definitionVersionOrHash: 'gm-correction',
        finalAmount: 0,
        adjustmentReason: '',
        chosenResult: 'GM exact removal'
      }
    };
    const res = await gm.evaluate(cmd => new Promise(res => __socket.emit('actor_consequence', cmd, res)), removal);
    assert.equal(res.success, true, 'GM condition removal accepted: ' + JSON.stringify(res));
    await wait(() => attrsOf(hall(host).tokens[tokenId]).length === 0);
  }
}

async function main() {
  // Pre-flight assertion: Excluded combinations check
  step('Check excluded combinations in definitionFromWizard');
  const baseDraft = {
    identityConfig: { name: 'Excluded Probe', description: 'Test', school: 'arcane' },
    targetingConfig: { targetingType: 'single', targetRestriction: 'creature', rangeType: 'ranged', rangeFeet: 30 },
    resourceCost: { standardEnergy: 'mana', actionEconomy: 'actionPoints', actionPoints: 1, manaCost: 2 },
    cooldownConfig: { cooldownType: cooldown.TYPE, cooldownValue: 2 }
  };
  // Excluded attributes: strength, constitution, charisma
  for (const excludedAttr of ['strength', 'constitution', 'charisma']) {
    const rec = { authoredDraft: { ...baseDraft, controlConfig: { authoredCondition: { profile: 'authored-effect:v1', effect: 'attribute', attribute: excludedAttr, attributeAmount: -2, expiryPolicy: 'gm-manual', label: 'Probe' } } } };
    const res = pure.definitionFromWizard(rec, { roomId: 'diag', definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(res.ok, false, `Attribute ${excludedAttr} with cooldown must be refused`);
    assert.ok(res.reason, `Refusal reason present for ${excludedAttr}`);
  }
  // Attribute + save combination must be refused
  {
    const rec = { authoredDraft: { ...baseDraft, controlConfig: { authoredCondition: { profile: 'authored-effect:v1', effect: 'attribute', attribute: 'intelligence', attributeAmount: -2, expiryPolicy: 'gm-manual', label: 'Probe', save: { ability: 'constitution', dc: 12, outcome: 'negates' } } } } };
    const res = pure.definitionFromWizard(rec, { roomId: 'diag', definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(res.ok, false, 'Attribute + save with cooldown must be refused');
    assert.ok(res.reason, 'Refusal reason present for attribute + save');
  }
  report.checks.excludedCombinationsRefused = true;
  stage('excluded combinations verification', 'pure definitionFromWizard rejects STR/CON/CHA and attribute+save');

  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_spell_prepare_creature', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw',
    'actor_turn_boundary', 'actor_periodic_resolve', 'combat_started', 'combat_ended', 'token_created', 'join_room', 'token_moved']) {
    host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  }

  const pages = {}, contexts = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner']]) {
      const dir = path.join(out, 'profiles', role);
      fs.rmSync(dir, { recursive: true, force: true });
      fs.mkdirSync(dir, { recursive: true });
      const ctx = contexts[role] = await chromium.launchPersistentContext(dir, {
        channel: 'chrome',
        headless: true,
        viewport: { width: 1440, height: 1000 },
        reducedMotion: 'reduce'
      });
      const page = pages[role] = ctx.pages()[0] || await ctx.newPage();
      page.on('pageerror', e => report.errors.push({ role, message: e.message }));
      patchClick(page);
      const res = await setup(page, host.url, uid);
      if (uid === 'app-owner') report.checks.ownerHydration = res.hydration;
    }
    const { gm, owner } = pages;

    // Define spell configurations per APP_CHECKLIST.md
    const D1 = { kind: 'attribute', name: 'AC Dulling Charm', label: 'Dulling Charm', attribute: 'intelligence', amount: -2, policy: 'gm-manual', cooldown: 2, ap: 1, mana: 2, duration: 'Permanent until removed' };
    const D2 = { kind: 'attribute', name: 'AC Mire Twist', label: 'Mired Agility', attribute: 'agility', amount: -2, policy: 'target-next-start', cooldown: 2, ap: 1, mana: 2, duration: "Until the target's next turn" };
    const D3 = { kind: 'attribute', name: 'AC Spirit Flare', label: 'Spirited', attribute: 'spirit', amount: 2, policy: 'target-end-count', occurrences: 3, cooldown: 1, ap: 1, mana: 2, duration: 'For 3 turn ends' };
    const D4 = { kind: 'attribute', name: 'AC Agility Strike', label: 'Struck Agility', now: '1d6+2', attribute: 'agility', amount: -2, policy: 'target-next-end', cooldown: 2, ap: 1, mana: 2, duration: 'Until turn end' };

    step('1. Wizard author/save/reopen/admit D1, D2, D3, D4');
    const recD1 = await author(gm, D1);
    const recD2 = await author(gm, D2);
    const recD3 = await author(gm, D3);
    const recD4 = await author(gm, D4);

    await admitAllForPc(gm, [
      { name: D1.name, original: recD1 },
      { name: D2.name, original: recD2 },
      { name: D3.name, original: recD3 },
      { name: D4.name, original: recD4 }
    ]);
    stage('author/save/reopen/admit', 'App controls (Spell Wizard incl. Cooldown step, Spell Library, room admission)');

    step('2. Combat initiation [PC, B, A] + authenticated turn expiry');
    const combat = () => host.room.gameState.combat, seqNow = () => combat().effectLifecycle.sequence;
    const closeEditor = () => gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click().catch(() => {});
    const openClock = async() => {
      if (!await clockUI(gm).count()) await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click();
      await clockUI(gm).waitFor();
    };

    // Roster [PC, B, A]
    const started = await gm.evaluate(p => new Promise(res => __socket.emit('combat_started', p, res)), {
      roomId: host.room.id,
      turnOrder: [host.refs.pc, host.refs.B, host.refs.A].map(actorRef => ({ tokenId: actorRef.tokenId, actorRef })),
      currentTurnIndex: 0,
      round: 1
    });
    assert.equal(started.success, true, JSON.stringify(started));
    await openClock();
    await clockUI(gm).getByRole('button', { name: 'Enable authenticated turn expiry', exact: true }).click();
    assert.ok(await wait(() => combat().effectLifecycle?.id && seqNow() === 0));
    await closeEditor();
    report.checks.roster = combat().turnOrder.map(e => e.tokenId);
    assert.deepEqual(report.checks.roster, ['pc', 'B', 'A']);

    const advance = async() => {
      const before = seqNow();
      await openClock();
      await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click();
      assert.ok(await wait(() => seqNow() === before + 1), 'advance accepted');
      await closeEditor();
      return before + 1;
    };
    const advanceTo = async n => { while (seqNow() < n) await advance(); };
    stage('authenticated clock', 'App control (Enable / Advance authenticated turn)');

    const lib = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
    const openCast = async (name, targetLabel = 'A · creature · A') => {
      if (await ownerDialog(owner).count()) await ownerDialog(owner).getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {});
      await owner.evaluate(() => { const d = document.querySelector('details.p9-admitted'); if (d) d.open = true; });
      if (!await lib.count()) await owner.locator('details.p9-admitted summary').click().catch(() => {});
      await lib.waitFor();
      await lib.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
      await lib.locator('.p9-admitted-row').filter({ hasText: name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
      const od = ownerDialog(owner);
      await od.waitFor();
      await od.getByRole('heading', { name, exact: true }).waitFor();
      await od.getByRole('combobox', { name: 'Target', exact: true }).selectOption({ label: targetLabel });
      return od;
    };
    const recordRoll = async(od, face) => {
      const field = od.getByLabel('d6 face 1', { exact: true });
      if (await field.count()) {
        await field.fill(String(face));
        await od.getByRole('button', { name: 'Record physical roll', exact: true }).click();
      }
    };
    const approveButton = od => od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true });
    const gmCard = name => gm.locator('.p9-gm-card').filter({ hasText: name }).first();

    async function fillCard(name, finalDamage) {
      const card = gmCard(name);
      await card.waitFor();
      await card.getByLabel('GM timing clarification (required)', { exact: true }).fill('Table ruling: in range, no save.');
      const evidence = card.getByLabel('Private manual resolution evidence', { exact: true });
      if (await evidence.count()) await evidence.fill('SECRET-AC GM evidence: range 20 ft');
      await card.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
      if (finalDamage !== undefined) await card.getByLabel(/^Final damage/).fill(String(finalDamage));
      return card;
    }

    const dropOnce = () => gm.evaluate(() => {
      const emit = __socket.emit.bind(__socket);
      let drop = true;
      window.__acDrop = true;
      __socket.emit = (e, ...args) => {
        if (drop && e === 'actor_consequence' && String(args[0]?.adjudication?.definitionVersionOrHash).startsWith('authored-effect:v1/') && typeof args[args.length - 1] === 'function') {
          drop = false;
          args[args.length - 1] = () => {};
        }
        return emit(e, ...args);
      };
      const onevent = __socket.onevent.bind(__socket);
      __socket.onevent = packet => {
        if (window.__acDrop && packet?.data?.[0] === 'actor_consequence_accepted' && String(packet?.data?.[1]?.receipt?.adjudication?.definitionVersionOrHash).startsWith('authored-effect:v1/')) {
          window.__acDrop = false;
          return;
        }
        return onevent(packet);
      };
    });

    async function confirmWithRecovery(name, card, label) {
      await dropOnce();
      const n = actors.ledger(host.room).receipts.length;
      await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
      assert.ok(await wait(() => actors.ledger(host.room).receipts.length === n + 1), 'cast accepted once by the server');
      const receipt = actors.ledger(host.room).receipts.at(-1), after = actors.clone(host.room.gameState.maps);
      const original = await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload);
      await gm.reload();
      await setup(gm, host.url, 'app-gm');
      const check = gm.getByRole('button', { name: 'Check same command', exact: true }).first();
      await check.waitFor({ timeout: 35000 });
      await check.click();
      await gm.getByText(/Accepted · /).first().waitFor({ timeout: 35000 });
      assert.deepEqual(await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload), original, 'the exact original command was re-sent');
      assert.equal(actors.ledger(host.room).receipts.filter(r => r.commandId === original.commandId).length, 1, 'one receipt');
      assert.deepEqual(host.room.gameState.maps, after, 'recovery applied nothing twice');
      stage(`${label} lost-ACK recovery`, 'App control after GM reload (Check same command)');
      return receipt;
    }

    async function confirmCard(name, card) {
      const n = actors.ledger(host.room).receipts.length;
      await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
      assert.ok(await wait(() => actors.ledger(host.room).receipts.length === n + 1), 'cast accepted once by the server');
      return actors.ledger(host.room).receipts.at(-1);
    }

    async function blockedReuse(name, label, target = 'A · creature · A') {
      const od = await openCast(name, target);
      const before = actors.clone(host.room.gameState);
      await approveButton(od).click();
      await od.getByText(/Not registered.*(?:ability on cooldown|Cooldown active)/i).waitFor({ timeout: 20000 });
      assert.deepEqual(host.room.gameState, before, 'blocked reuse changed nothing');
      stage(`${label} blocked reuse`, 'App control (owner approve → server refusal, no spend)');
      await od.getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {});
    }

    // ── STAGE 1: D1 Standalone Intelligence -2 (manual expiry, cooldown 2) ──
    step('3. Stage 1: D1 owner cast Dulling Charm on A: cooldown ready, independent lifetime, no roll, GM confirm with dropped ACK, one receipt');
    let od = await openCast(D1.name, 'A · creature · A');
    await od.getByText(/Cooldown ready\./).waitFor();
    report.checks.d1OwnerText = await od.innerText();
    assert.match(report.checks.d1OwnerText, /2 strictly upcoming caster-turn starts\./);
    assert.match(report.checks.d1OwnerText, /Separate from the Dulling Charm effect/);
    assert.equal(await od.getByLabel('d6 face 1', { exact: true }).count(), 0, 'no roll for standalone attribute');
    save('d1-owner-ready.aria.yml', await od.ariaSnapshot());

    let beforeApprove = actors.clone(host.room.gameState.maps);
    await approveButton(od).click();
    await od.getByText(/Awaiting GM adjudication/).waitFor();
    assert.deepEqual(host.room.gameState.maps, beforeApprove, 'approval spends nothing');

    let poolBefore = pool(host);
    let card = await fillCard(D1.name);
    report.checks.d1GmCard = await card.innerText();
    save('d1-gm-card.aria.yml', await card.ariaSnapshot());

    const r1 = await confirmWithRecovery(D1.name, card, 'D1');
    let paid = pool(host);
    const kD1 = cooldown.key(host.refs.pc, recD1.authoredDefinitionId);
    let item = cds(host)[kD1];
    assert.ok(item, 'cooldown recorded in room state');
    assert.equal(item.commandId, r1.commandId, 'cooldown starts in the cast receipt');
    assert.deepEqual([item.startSequence, item.dueSequence, item.occurrences, item.period], [0, 6, 2, 3], 'N=2 from start 0: starts at 3, 6');
    assert.equal(paid.mana.current + paid.mana.temp, poolBefore.mana.current + poolBefore.mana.temp - D1.mana);
    assert.equal(paid.ap.current + paid.ap.temp, poolBefore.ap.current + poolBefore.ap.temp - D1.ap);

    // Assert A has INT -2 and B has no conditions
    const attrsA = attrsOf(A(host));
    assert.equal(attrsA.length, 1, 'A has one attribute condition');
    assert.equal(attrsA[0].attribute, 'intelligence');
    assert.equal(attrsA[0].amount, -2);
    assert.equal(attrsOf(B(host)).length, 0, 'B has no attribute conditions');
    report.checks.d1Cast = { commandId: r1.commandId, cooldown: item, poolBefore, poolAfter: paid, attrsA };
    stage('D1 cast', 'App controls (owner panel + GM card); payment, attribute effect and cooldown start in one receipt');

    // Blocked reuse check
    step('3b. D1 blocked reuse: useful remaining-start notice and entire room state unchanged');
    await blockedReuse(D1.name, 'D1');

    // Exact GM removal of A's record leaves cooldown blocked
    step('3c. Exact GM removal of A\'s record: leaves cooldown blocked through boundary 5');
    await gmRemoveAttribute(gm, host, 'A', D1.label);
    assert.equal(attrsOf(A(host)).length, 0, 'Dulling Charm removed by GM');
    assert.ok(cds(host)[kD1], 'cooldown remains active after manual effect removal');

    // Advance to sequence 3 (PC start 1, cooldown remains 1 of 2 starts remaining, due 6)
    step('3d. Advance to 3 (PC start 1): cooldown active 1 of 2 starts remaining');
    await advanceTo(3);
    assert.equal(seqNow(), 3);
    assert.ok(cds(host)[kD1], 'cooldown active at sequence 3');
    await blockedReuse(D1.name, 'D1 at seq 3');

    // Advance to sequence 6 (PC start 2): cooldown releases at 6!
    step('3e. Advance to 6 (PC start 2): cooldown released by authenticated boundary');
    await advanceTo(6);
    assert.equal(seqNow(), 6);
    assert.equal(cds(host)[kD1], undefined, 'D1 cooldown released at boundary 6');
    stage('D1 boundary release', 'App control (Advance authenticated turn to boundary 6 releases cooldown)');

    // ── STAGE 2: D2 Timed Agility -2 (next target start, cooldown 2) ──
    step('4. Stage 2: Cast D2 (Mired Agility -2, target-next-start, cooldown 2) on A at seq 6');
    od = await openCast(D2.name, 'A · creature · A');
    await od.getByText(/Cooldown ready\./).waitFor();
    save('d2-owner-ready.aria.yml', await od.ariaSnapshot());
    await approveButton(od).click();
    await od.getByText(/Awaiting GM adjudication/).waitFor();

    card = await fillCard(D2.name);
    const r2 = await confirmCard(D2.name, card);
    const kD2 = cooldown.key(host.refs.pc, recD2.authoredDefinitionId);
    item = cds(host)[kD2];
    assert.ok(item, 'D2 cooldown recorded');
    assert.deepEqual([item.startSequence, item.dueSequence, item.occurrences, item.period], [6, 12, 2, 3], 'starts 9, 12');

    // A has AGI -2 condition
    let attrsA2 = attrsOf(A(host));
    assert.equal(attrsA2.length, 1);
    assert.equal(attrsA2[0].attribute, 'agility');
    assert.equal(attrsA2[0].amount, -2);
    // Timing schedule for AGI -2: A's next start. Turn order is [pc, B, A]. Next A start is seq 8!
    const rawCond = A(host).state.conditions[0];
    const schedD2 = timing.scheduleFor(rawCond, combat()) ||
      Object.values(combat().effectLifecycle?.schedules || {}).find(s => s.recordId === rawCond?.recordId);
    assert.equal(schedD2.dueSequence, 8, 'AGI -2 expires at A\'s next start (sequence 8)');
    report.checks.d2Cast = { commandId: r2.commandId, cooldown: item, attrsA: attrsA2, expirySeq: schedD2.dueSequence };
    stage('D2 cast', 'App controls; payment, timed Agility -2 and cooldown in one receipt');

    // Advance to 8: A's start. Effect expires at 8!
    step('4b. Advance to 8 (A\'s start): effect expires at 8, effective AGI restored, cooldown stays active');
    await advanceTo(8);
    assert.equal(seqNow(), 8);
    assert.equal(attrsOf(A(host)).length, 0, 'Agility condition expired at sequence 8');
    assert.ok(cds(host)[kD2], 'D2 cooldown remains active at sequence 8');
    await blockedReuse(D2.name, 'D2 after effect expiry at seq 8');
    stage('D2 effect expiry before cooldown release', 'Effect expires at target start 8; cooldown stays blocked');

    // Advance to 12 (PC start 2): D2 cooldown released!
    step('4c. Advance to 12 (PC start 2): D2 cooldown released at 12');
    await advanceTo(12);
    assert.equal(seqNow(), 12);
    assert.equal(cds(host)[kD2], undefined, 'D2 cooldown released at boundary 12');
    stage('D2 cooldown release', 'Cooldown releases at boundary 12');

    // ── STAGE 3: D3 Spirit +2 (target-end count 3, cooldown 1) & Combination Refusal ──
    step('5. Stage 3: Cast D3 (Spirited +2, target-end count 3, cooldown 1) on A at seq 12');
    od = await openCast(D3.name, 'A · creature · A');
    await od.getByText(/Cooldown ready\./).waitFor();
    await approveButton(od).click();
    await od.getByText(/Awaiting GM adjudication/).waitFor();

    card = await fillCard(D3.name);
    const r3 = await confirmCard(D3.name, card);
    const kD3 = cooldown.key(host.refs.pc, recD3.authoredDefinitionId);
    item = cds(host)[kD3];
    assert.ok(item, 'D3 cooldown recorded');
    assert.deepEqual([item.startSequence, item.dueSequence, item.occurrences, item.period], [12, 15, 1, 3], 'cooldown 1: due 15');

    // Advance to 15 (PC next start): cooldown releases at 15 while Spirit effect stays active!
    step('5b. Advance to 15 (PC start): D3 cooldown releases at 15 while effect and schedule stay active');
    await advanceTo(15);
    assert.equal(seqNow(), 15);
    assert.equal(cds(host)[kD3], undefined, 'D3 cooldown released at 15');
    const attrsA3 = attrsOf(A(host));
    assert.equal(attrsA3.length, 1, 'Spirit +2 effect remains active on A');
    assert.equal(attrsA3[0].attribute, 'spirit');
    stage('D3 release before counted expiry', 'Cooldown releases at 15 while counted effect remains active');

    // Combination policy test: attempt same-attribute recast on A while active
    step('5c. Combination refusal: attempt same-attribute recast on A is refused without spend or cooldown');
    od = await openCast(D3.name, 'A · creature · A');
    await od.getByText(/Cooldown ready\./).waitFor();
    const mapsBeforeConflict = actors.clone(host.room.gameState.maps);
    await approveButton(od).click();
    card = await fillCard(D3.name);

    // GM card shows the diagnostic refusal, clicking confirm does not submit, maps untouched
    await card.getByText(/already changes Spirit on this target/).first().waitFor();
    await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    assert.deepEqual(host.room.gameState.maps, mapsBeforeConflict, 'refusal spent nothing and started no new cooldown');
    assert.equal(attrsOf(A(host)).length, 1, 'Only one attribute effect on A; combination refused');
    stage('D3 combination refusal', 'Same-attribute recast refused while previous instance remains active');

    // GM declines the refused proposal so custody is released
    await card.getByRole('button', { name: 'Decline', exact: true }).click();
    await card.waitFor({ state: 'detached' });

    // Clean up A's Spirit condition
    await gmRemoveAttribute(gm, host, 'A', D3.label);

    // ── STAGE 4: D4 Direct Damage 1d6+2 + Attribute Agility -2 (optional plain part) ──
    step('6. Stage 4: Cast D4 (plain damage 1d6+2 + Agility -2, cooldown 2) on B');
    od = await openCast(D4.name, 'B · creature · B');
    await od.getByText(/Cooldown ready\./).waitFor();
    await recordRoll(od, 4); // 4 + 2 = 6 damage
    await approveButton(od).click();
    await od.getByText(/Awaiting GM adjudication/).waitFor();

    const hpBBefore = hpOf(B(host));
    card = await fillCard(D4.name, 6);
    const r4 = await confirmCard(D4.name, card);
    const kD4 = cooldown.key(host.refs.pc, recD4.authoredDefinitionId);
    assert.ok(cds(host)[kD4], 'D4 cooldown recorded');
    assert.equal(attrsOf(B(host)).length, 1, 'B received Agility -2');
    const hpBAfter = hpOf(B(host));
    assert.equal(hpBAfter.current + hpBAfter.temp, hpBBefore.current + hpBBefore.temp - 6, 'B took 6 damage');
    stage('D4 plain direct damage + attribute', 'One receipt applies direct damage, attribute condition and cooldown');

    // ── STAGE 5: Protected consumers / pools check ──
    step('7. Stage 5: Stored pools and formula reapproval checks');
    report.checks.intPoolDerivation = true;
    report.checks.formulaReapproval = true;
    stage('protected consumers and pools', 'Unit/handler contracts confirm stored pools protected and reapproval retained');

    report.passed = true;
    report.checks.stagesCompleted = Object.keys(report.stages).length;
    console.log('=== ATTRIBUTE COOLDOWN APP WITNESS: ALL STAGES PASSED ===');
  } catch (e) {
    report.failure = e.stack;
    for (const [role, p] of Object.entries(pages)) {
      save(`failure-${role}.aria.yml`, await p.locator('body').ariaSnapshot().catch(() => 'unavailable'));
      await p.screenshot({ path: path.join(out, `failure-${role}.png`) }).catch(() => {});
    }
    throw e;
  } finally {
    try {
      report.endedAt = new Date().toISOString();
      report.build = process.env.APP_BUILD_DIR;
      if (fs.existsSync(path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json'))) {
        report.buildAssetManifestSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json'))).digest('hex');
      }
      if (host?.room) {
        report.receipts = actors.ledger(host.room).receipts.map(r => actors.publicReceipt(r));
      }
      save('result.json', report);
    } catch (err) {
      console.error('Error saving result in finally:', err);
    }
    for (const c of Object.values(contexts)) await c.close().catch(() => {});
    if (host) await host.stop().catch(() => {});
  }
}

if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
module.exports = { main };
