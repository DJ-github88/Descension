// Flat damage reduction + authenticated caster-start cooldowns witness
// Based on handoff/flat-dr-cooldowns/APP_CHECKLIST.md
/* global S, __socket, __actors, __outbound, __req */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.FDRC_OUTPUT || path.resolve(__dirname, 'flat-dr-cooldown-evidence');
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
  const stats = { strength: 14, agility: 16, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 };
  return Object.assign(record, {
    class: 'Arcanoneer', level: 3, stats: { ...stats }, baseStats: { ...stats }, buffs: [], debuffs: [],
    classResource: { type: 'elementalSpheres', spheres: [], current: 0, max: 12 }, class_spells: { known_spells: [] },
    health: { current: 30, max: 40 }, mana: { current: 20, max: 30 }, actionPoints: { current: 5, max: 5 },
    tempHealth: 0, tempMana: 5, tempActionPoints: 2,
    skillRanks: { weaponMastery: 'ADEPT', weaponMastery_sword: 'TRAINED', weaponMastery_bow: 'NOVICE' },
    equipment: {
      ...(record.equipment || {}),
      ranged: {
        id: 'dr-bow',
        name: 'Witness Bow',
        subtype: 'BOW',
        slots: ['ranged'],
        weaponStats: { baseDamage: { diceCount: 1, diceType: 'd6', damageType: 'stabbing' } }
      }
    }
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
  if (uid === 'app-owner') {
    result.hydration = await loadOwnerFixture(page);
  }
  await page.evaluate(async uid => {
    const moduleWith = text => {
      const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(text));
      if (!pair) throw Error('Missing compiled ' + text);
      return __req(pair[0]);
    };
    const strike = moduleWith('Submitting one AP/HP consequence');
    const fns = Object.values(strike).filter(f => typeof f === 'function');
    const register = fns.find(f => f.toString().includes('actor_strike_pending') && f.toString().includes('socket'));
    const refresh = fns.find(f => f.toString().includes('actor_strike_list') && !f.toString().includes('actor_strike_pending') && !f.toString().includes('actor_strike_approve'));
    const loadData = fns.find(f => f.toString().includes('creatures.json'));
    if (!register || !refresh || !loadData) throw Error('Strike handlers not resolved');
    register({ socket: __socket }); await refresh(); await loadData();
    const registerRoomJoined = Object.values(moduleWith('[roomRejoin] subscriber failed')).find(fn => typeof fn === 'function' && fn.toString().includes('room_joined'));
    if (registerRoomJoined) registerRoomJoined(__socket);

    if (uid === 'app-owner') {
      S('characterStore').setState({
        stats: { ...S('characterStore').getState().stats, strength: 14, agility: 16 },
        skillRanks: { weaponMastery: 'ADEPT', weaponMastery_sword: 'TRAINED', weaponMastery_bow: 'NOVICE' },
        equipment: {
          ...S('characterStore').getState().equipment,
          ranged: {
            id: 'dr-bow',
            name: 'Witness Bow',
            subtype: 'BOW',
            slots: ['ranged'],
            weaponStats: { baseDamage: { diceCount: 1, diceType: 'd6', damageType: 'stabbing' } }
          }
        }
      });
    }
  }, uid);
  return result;
}

const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = {
  startedAt: new Date().toISOString(),
  checks: {},
  qualifications: [
    'Real optimized App and registered backend; identity/provider/ownership/lease/cloud are fixture boundaries (mocked services).',
    'Temporary room: accepted-live only. No live Firebase, deployment, physical second device or human tabletop claim.',
    'Complete deterministic owner record loaded through production loadCharacter after boot.',
    'Wizard primitives only. No catalogue record, pin or stripped catalogue demonstration.'
  ],
  errors: [],
  steps: [],
  stages: {},
  limits: [
    'Real optimized App and registered backend; identity/provider/ownership/lease/cloud are fixture boundaries.',
    'Temporary room: accepted-live only. No live Firebase, deployment, physical second device or human tabletop claim.'
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
const hpTotal = token => token.state.currentHp + (token.state.tempHealth || 0);
const hpOf = token => ({ current: token.state.currentHp, temp: token.state.tempHealth });
const drsOf = token => (token.state.conditions || []).filter(profile.isDamageReductionModifier);
const cds = host => actors.clone(PC(host).state.authoredCooldowns || {});
const pool = host => actors.clone(actors.resources(PC(host), 'character'));
const wait = async(fn, n = 80) => { for (let i = 0; i < n && !fn(); i++) await new Promise(r => setTimeout(r, 150)); return fn(); };

async function openBook(p) {
  if (!await book(p).isVisible().catch(() => false)) {
    const role = p.getByRole('button', { name: 'Character', exact: true });
    if (await role.count()) await role.click();
    else await p.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
    const sb = p.getByRole('button', { name: 'Spellbook S', exact: true });
    if (await sb.count()) await sb.click();
    else await p.locator('button', { hasText: /Spellbook/ }).first().click();
    await book(p).waitFor({ timeout: 15000 });
  }
  const wizTab = book(p).getByRole('button', { name: 'Spell Wizard', exact: true });
  if (await wizTab.count() && await wizTab.isVisible()) await wizTab.click();
}

async function closeBook(p) {
  const b = book(p).getByRole('button', { name: 'Close', exact: true });
  if (await b.count()) {
    await b.focus();
    await b.press('Enter');
    await book(p).waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  }
}

const savedRecord = (p, name) => p.evaluate(name => {
  const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData'));
  return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === name) : null;
}, name);

/** Author a flat DR ability with cooldown through ordinary Spell Wizard controls. */
async function author(p, c) {
  await openBook(p);
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(c.name);
  await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill(`Disposable flat DR witness (${c.name}).`);
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
  const fields = book(p).getByRole('group', { name: /^Composed effect/ });
  await fields.getByLabel(/^Canonical effect/).selectOption('damageReduction');
  await fields.getByLabel(/^Effect name shown on the target/).fill(c.label);
  await fields.getByLabel(/^Flat damage reduction \(whole number/).fill(String(c.amount));
  await fields.getByLabel(/^Expiry/).selectOption(c.policy);
  if (c.policy.includes('-count')) {
    const count = fields.locator('input[type="number"][min="2"]');
    await count.waitFor();
    await count.fill(String(c.occurrences));
  }
  await fields.getByLabel(/^Source-authored duration text/).fill(c.duration || 'While the ward holds');
  await fields.getByLabel(/^Required GM adjudication note/).fill('GM resolves eligibility and range.');

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
  const manaBtn = book(p).getByTitle('Standard magical energy', { exact: true });
  await manaBtn.waitFor({ timeout: 15000 });
  await manaBtn.click();
  const apBtn = book(p).getByTitle('Basic action economy', { exact: true });
  await apBtn.waitFor({ timeout: 15000 });
  await apBtn.click();
  const inputs = book(p).getByRole('spinbutton');
  await inputs.nth(0).fill('1'); await inputs.nth(0).fill(String(c.mana));
  await inputs.nth(1).fill('1'); await inputs.nth(1).fill(String(c.ap));

  await nav.getByRole('button', { name: /Cooldown$/ }).click();
  await book(p).getByRole('button', { name: 'Authenticated Caster Starts', exact: true }).click();
  await book(p).getByLabel('Caster-turn starts to count (1–10)', { exact: true }).fill(String(c.cooldown));
  await book(p).getByText(new RegExp(`${c.cooldown} strictly upcoming caster-turn start`)).first().waitFor();
  (report.checks.wizardCooldownText ||= {})[c.name] = await book(p).getByText(/Positive flat DR \(\+1 to \+20, whole number\)/).innerText();
  save(`wizard-cooldown-${c.name.replace(/\W+/g, '-')}.aria.yml`, await book(p).ariaSnapshot());

  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click({ force: true });
  await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), c.name);
  const r = await savedRecord(p, c.name);
  save(`wizard-saved-${c.name.replace(/\W+/g, '-')}.json`, r);
  assert.deepEqual(r.authoredDraft.cooldownConfig, { cooldownType: cooldown.TYPE, cooldownValue: c.cooldown });

  const mapped = pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' });
  assert.equal(mapped.ok, true, JSON.stringify(mapped));
  assert.deepEqual(mapped.definition.cooldown, { cooldownType: cooldown.TYPE, cooldownValue: c.cooldown });
  assert.equal(mapped.definition.effects.condition.kind, 'damageReduction');
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

async function ownerStrike(owner, gm, host, targetId, faces) {
  if (await ownerDialog(owner).count()) await ownerDialog(owner).getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {});
  await gm.evaluate(async() => { await __actors.refreshActorSnapshot(); const r = await __actors.adjustSharedResource('pc', 'actionPoints', 4); if (!r.success) throw Error(JSON.stringify(r)); });
  await owner.evaluate(() => __actors.refreshActorSnapshot());
  const wing = owner.locator('.action-bar-assembly:not(.spell-action-bar-assembly) .equipment-action-slot-wrapper.slot-ranged');
  const actionBubble = wing.getByAltText('Ranged Attack (Witness Bow)', { exact: true });
  if (!await actionBubble.isVisible().catch(() => false)) {
    await wing.locator('.equipment-action-slot').click();
  }
  await actionBubble.click();
  const d = owner.getByRole('dialog', { name: 'Basic weapon strike', exact: true }); await d.waitFor();
  await d.getByRole('combobox', { name: 'Strike target', exact: true }).selectOption(`creature:app-hall:${targetId}`);
  await d.getByLabel('Physical weapon faces', { exact: true }).fill(String(faces)); await d.getByRole('button', { name: 'Record weapon faces', exact: true }).click();
  await d.getByLabel('Physical proficiency faces', { exact: true }).fill('5'); await d.getByRole('button', { name: 'Record proficiency faces', exact: true }).click();
  await d.getByRole('button', { name: 'Approve 2 AP and send to GM', exact: true }).click(); await d.getByText('Awaiting GM adjudication. Approval spends nothing.', { exact: true }).waitFor();
  const card = gm.locator('.p12-gm-card').filter({ has: gm.getByRole('button', { name: 'Confirm and apply', exact: true }) }).last(); await card.waitFor();
  return { d, card };
}

async function gmAcceptStrike(owner, gm, host, targetId, { d, card }, label) {
  const text = await card.innerText(); save(`gm-strike-${label}.txt`, text); save(`gm-strike-${label}.aria.yml`, await card.ariaSnapshot());
  await card.getByRole('combobox', { name: 'Proficiency outcome', exact: true }).selectOption('deferred');
  const verdict = card.getByRole('combobox', { name: 'Listed defense verdict', exact: true });
  const manualListed = await verdict.count(); if (manualListed) await verdict.selectOption('not-applicable');
  const before = hpTotal(hall(host).tokens[targetId]);
  await card.getByRole('button', { name: 'Confirm and apply', exact: true }).click();
  await owner.getByText(/^Accepted: AP/).first().waitFor({ timeout: 20000 });
  await d.getByRole('button', { name: 'Close strike', exact: true }).click().catch(() => {});
  return { text, manualListed, damage: before - hpTotal(hall(host).tokens[targetId]) };
}

async function gmRemoveDr(gm, host, tokenId) {
  const currentDrs = drsOf(hall(host).tokens[tokenId]);
  if (currentDrs.length) {
    const cId = currentDrs[0].recordId || currentDrs[0].id;
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
    await wait(() => drsOf(hall(host).tokens[tokenId]).length === 0);
  }
}

async function main() {
  // Pre-flight assertion: Excluded combinations check per APP_CHECKLIST.md
  step('Check excluded combinations in definitionFromWizard');
  const baseDraft = {
    name: 'Probe',
    description: 'Test',
    school: 'arcane',
    spellType: 'ACTION',
    typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: ['control'],
    targetingConfig: { targetingType: 'single', targetRestriction: 'creature', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] },
    resourceCost: { standardEnergy: 'mana', actionEconomy: 'actionPoints', actionPoints: 1, manaCost: 2 },
    cooldownConfig: { cooldownType: cooldown.TYPE, cooldownValue: 2 }
  };
  // Excluded: negative DR or zero DR
  for (const invalidDr of [0, -3, 21]) {
    const d = { ...baseDraft, controlConfig: { authoredCondition: { profile: 'authored-effect:v1', effect: 'damageReduction', drAmount: invalidDr, expiryPolicy: 'gm-manual', label: 'Probe' } } };
    const res = pure.definitionFromWizard({ name: d.name, description: d.description, authoredDraft: d }, { roomId: 'diag', definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(res.ok, false, `DR amount ${invalidDr} must be refused`);
  }
  // Excluded: DR + save combination must be refused
  {
    const d = { ...baseDraft, controlConfig: { authoredCondition: { profile: 'authored-effect:v1', effect: 'damageReduction', drAmount: 3, expiryPolicy: 'gm-manual', label: 'Probe', save: { ability: 'constitution', dc: 12, outcome: 'negates' } } } };
    const res = pure.definitionFromWizard({ name: d.name, description: d.description, authoredDraft: d }, { roomId: 'diag', definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(res.ok, false, 'DR + save with cooldown must be refused');
  }
  report.checks.excludedCombinationsRefused = true;
  stage('excluded combinations verification', 'pure definitionFromWizard rejects negative DR and DR+save');

  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_spell_prepare_creature', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw',
    'actor_turn_boundary', 'actor_periodic_resolve', 'combat_started', 'combat_ended', 'token_created', 'join_room', 'token_moved', 'actor_strike_approve', 'actor_strike_list', 'actor_strike_withdraw', 'actor_strike_decline']) {
    host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  }

  const pages = {}, contexts = {};
  try {
    const runId = String(Date.now());
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner']]) {
      const dir = path.join(require('os').tmpdir(), 'fdrc-profiles-' + runId, role);
      fs.mkdirSync(dir, { recursive: true });
      const ctx = contexts[role] = await chromium.launchPersistentContext(dir, {
        channel: 'chrome',
        headless: true,
        viewport: { width: 1440, height: 1000 },
        reducedMotion: 'reduce'
      });
      const page = pages[role] = ctx.pages()[0] || await ctx.newPage();
      page.on('pageerror', e => {
        if (!/failed to fetch/i.test(e.message)) report.errors.push({ role, message: e.message });
      });
      patchClick(page);
      const res = await setup(page, host.url, uid);
      if (uid === 'app-owner') report.checks.ownerHydration = res.hydration;
    }
    const { gm, owner } = pages;

    // Define spell configurations per APP_CHECKLIST.md
    const D1 = { kind: 'damageReduction', name: 'DR Ward Manual', label: 'Ward Manual', amount: 3, policy: 'gm-manual', cooldown: 2, ap: 1, mana: 2, duration: 'While the ward holds' };
    const D2 = { kind: 'damageReduction', name: 'DR Ward Timed', label: 'Ward Timed', amount: 3, policy: 'target-next-start', cooldown: 2, ap: 1, mana: 2, duration: "Until the target's next turn" };
    const D3 = { kind: 'damageReduction', name: 'DR Ward Counted', label: 'Ward Counted', amount: 3, policy: 'target-end-count', occurrences: 3, cooldown: 1, ap: 1, mana: 2, duration: 'For 3 turn ends' };
    const D4 = { kind: 'damageReduction', name: 'DR Ward Strike', label: 'Ward Strike', now: '1d6+2', amount: 3, policy: 'target-next-end', cooldown: 1, ap: 1, mana: 2, duration: 'Until turn end' };

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

    step('2. Combat initiation [PC, B, A] + authenticated turn tracking + baseline strike on A');
    const combat = () => host.room.gameState.combat, seqNow = () => combat().effectLifecycle.sequence;
    const closeEditor = () => gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click().catch(() => {});
    const openClock = async() => {
      if (!await clockUI(gm).count()) await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click();
      await clockUI(gm).waitFor();
    };

    // Roster [PC, B, A] per APP_CHECKLIST.md §9
    const started = await gm.evaluate(p => new Promise(res => __socket.emit('combat_started', p, res)), {
      roomId: host.room.id,
      turnOrder: [
        { tokenId: 'pc', name: 'Ilse', actorRef: host.refs.pc },
        { tokenId: 'B', name: 'B', actorRef: host.refs.B },
        { tokenId: 'A', name: 'A', actorRef: host.refs.A }
      ],
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

    // Baseline weapon strike on creature A (no DR active)
    let s = await ownerStrike(owner, gm, host, 'A', 5);
    const baseline = await gmAcceptStrike(owner, gm, host, 'A', s, 'baseline');
    report.checks.baseline = baseline;
    assert.match(baseline.text, /No automated defense step: (\d+) .+ \1/);
    const fullDamage = baseline.damage;
    assert.ok(fullDamage >= 5, 'baseline damage reaches A without reduction');
    report.checks.fullDamage = fullDamage;

    const ensureOwnerAttachment = async () => {
      const select = owner.getByRole('combobox', { name: 'Exact room attachment', exact: true });
      if (await select.count()) {
        const val = await select.locator('option').filter({ hasText: /Ilse/ }).first().getAttribute('value');
        if (val && await select.inputValue() !== val) {
          await select.selectOption(val);
        }
      }
    };
    const openCast = async (name, targetLabel = 'A · creature · A') => {
      const showAcl = owner.getByRole('button', { name: 'Show combat adjudication', exact: true });
      if (await showAcl.count()) await showAcl.click().catch(() => {});
      await ensureOwnerAttachment();
      if (await ownerDialog(owner).count()) await ownerDialog(owner).getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {});
      const details = owner.locator('details.p9-admitted').filter({ hasText: 'Admitted abilities' });
      const isOpen = await details.evaluate(el => el.open).catch(() => false);
      if (!isOpen) {
        await details.locator('summary').click();
      }
      const section = details.locator('section[aria-label="Admitted abilities"]');
      await section.waitFor({ timeout: 15000 });
      await section.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
      const row = section.locator('.p9-admitted-row').filter({ hasText: name });
      await row.first().waitFor({ timeout: 20000 });
      await row.first().getByRole('button', { name: 'Use admitted ability', exact: true }).click();
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
    const closeCast = async od => {
      const b = od.getByRole('button', { name: 'Close', exact: true });
      if (await b.count()) await b.first().click().catch(() => {});
      await od.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
    };
    const gmCard = name => gm.locator('.p9-gm-card').filter({ hasText: name }).first();

    async function fillCard(name, finalDamage) {
      const card = gmCard(name);
      await card.waitFor();
      await card.getByLabel('GM timing clarification (required)', { exact: true }).fill('Table ruling: in range, no save.');
      const evidence = card.getByLabel('Private manual resolution evidence', { exact: true });
      if (await evidence.count()) await evidence.fill('SECRET-FDRC GM evidence: range 20 ft');
      await card.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
      if (finalDamage !== undefined) await card.getByLabel(/^Final damage/).fill(String(finalDamage));
      return card;
    }

    const dropOnce = () => gm.evaluate(() => {
      const emit = __socket.emit.bind(__socket);
      let drop = true;
      window.__fdrcDrop = true;
      __socket.emit = (e, ...args) => {
        if (drop && e === 'actor_consequence' && String(args[0]?.adjudication?.definitionVersionOrHash).startsWith('authored-effect:v1/') && typeof args[args.length - 1] === 'function') {
          drop = false;
          args[args.length - 1] = () => {};
        }
        return emit(e, ...args);
      };
      const onevent = __socket.onevent.bind(__socket);
      __socket.onevent = packet => {
        if (window.__fdrcDrop && packet?.data?.[0] === 'actor_consequence_accepted' && String(packet?.data?.[1]?.receipt?.adjudication?.definitionVersionOrHash).startsWith('authored-effect:v1/')) {
          window.__fdrcDrop = false;
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
      await owner.getByText(/Accepted/).first().waitFor({ timeout: 20000 }).catch(() => {});
      if (await ownerDialog(owner).count()) await ownerDialog(owner).getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {});
      return receipt;
    }

    async function confirmCard(name, card) {
      const n = actors.ledger(host.room).receipts.length;
      await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
      assert.ok(await wait(() => actors.ledger(host.room).receipts.length === n + 1), 'cast accepted once by the server');
      await owner.getByText(/Accepted/).first().waitFor({ timeout: 20000 }).catch(() => {});
      if (await ownerDialog(owner).count()) await ownerDialog(owner).getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {});
      return actors.ledger(host.room).receipts.at(-1);
    }

    async function blockedReuse(name, label, target = 'A · creature · A') {
      const od = await openCast(name, target);
      const before = actors.clone(host.room.gameState);
      await approveButton(od).click();
      await od.getByText(/Not registered.*(?:ability on cooldown|Cooldown active)/i).waitFor({ timeout: 20000 });
      assert.deepEqual(host.room.gameState, before, 'blocked reuse changed nothing');
      stage(`${label} blocked reuse`, 'App control (owner approve → server refusal, no spend)');
      await closeCast(od);
    }

    // ── STAGE 1: D1 Standalone DR Ward Manual +3 (manual expiry, cooldown 2) ──
    step('3. Stage 1: D1 owner cast on A: cooldown ready, independent lifetime, no roll, GM confirm with lost-ACK recovery');
    let od = await openCast(D1.name, 'A · creature · A');
    await od.getByText(/Cooldown ready\./).waitFor();
    report.checks.d1OwnerText = await od.innerText();
    assert.match(report.checks.d1OwnerText, /2 strictly upcoming caster-turn starts\./);
    assert.match(report.checks.d1OwnerText, /Separate from the Ward Manual effect/);
    assert.equal(await od.getByLabel('d6 face 1', { exact: true }).count(), 0, 'no roll for standalone DR');
    save('d1-owner-ready.aria.yml', await od.ariaSnapshot());

    let beforeApprove = actors.clone(host.room.gameState.maps);
    await approveButton(od).click();
    await od.getByText(/Awaiting GM adjudication/).waitFor();
    assert.deepEqual(host.room.gameState.maps, beforeApprove, 'approval spends nothing');

    let poolBefore = pool(host);
    const statsABefore = actors.clone(A(host).stats);
    let card = await fillCard(D1.name);
    report.checks.d1GmCard = await card.innerText();
    save('d1-gm-card.aria.yml', await card.ariaSnapshot());

    const r1 = await confirmWithRecovery(D1.name, card, 'D1');
    let paid = pool(host);
    const kD1 = cooldown.key(host.refs.pc, recD1.authoredDefinitionId);
    let item = cds(host)[kD1];
    assert.ok(item, 'cooldown recorded in room state');
    assert.equal(item.commandId, r1.commandId, 'cooldown starts in the cast receipt');
    assert.deepEqual([item.startSequence, item.dueSequence, item.occurrences, item.period], [0, 6, 2, 3], 'N=2 from start 0: due 6');
    assert.equal(paid.mana.current + paid.mana.temp, poolBefore.mana.current + poolBefore.mana.temp - D1.mana, 'temporary-first mana paid');
    assert.equal(paid.ap.current + paid.ap.temp, poolBefore.ap.current + poolBefore.ap.temp - D1.ap, 'temporary-first AP paid');
    assert.deepEqual(A(host).stats, statsABefore, 'creature base stats unchanged');

    const drsA = drsOf(A(host));
    assert.equal(drsA.length, 1, 'A has one DR condition');
    assert.deepEqual(drsA[0].effects, { damageReduction: 3 });
    assert.equal(drsOf(B(host)).length, 0, 'B has no DR conditions');
    report.checks.d1Cast = { commandId: r1.commandId, cooldown: item, poolBefore, poolAfter: paid, drsA };
    stage('D1 cast', 'App controls (owner panel + GM card); payment, DR effect and cooldown start in one receipt');
    await closeCast(od);

    // ── STAGE 2: Reduced weapon strike on A ──
    step('4. Reduced strike on A: Flat DR 3 reduces proposed damage by 3');
    s = await ownerStrike(owner, gm, host, 'A', 5);
    const withDr = await gmAcceptStrike(owner, gm, host, 'A', s, 'with-dr');
    report.checks.withDr = withDr;
    assert.match(withDr.text, /Flat DR 3: (\d+) .+ (\d+) \(Laws rounding\)/);
    assert.equal(withDr.damage, fullDamage - 3, 'flat DR subtracted exactly 3 once');
    assert.equal(drsOf(A(host)).length, 1, 'strike never consumes or edits the DR effect');
    stage('reduced strike', 'Existing basic noncritical strike on A demonstrates DR reduction');

    // ── STAGE 3: Blocked reuse ──
    step('5. D1 blocked reuse: notice and entire room state unchanged');
    await blockedReuse(D1.name, 'D1');

    // ── STAGE 4: Removal before release ──
    step('6. Exact GM removal of A\'s DR record leaves cooldown blocked until sequence 6');
    await gmRemoveDr(gm, host, 'A');
    assert.equal(drsOf(A(host)).length, 0, 'DR removed by GM');
    assert.ok(cds(host)[kD1], 'cooldown remains active after manual DR removal');

    // Advance to sequence 3 (PC start 1, cooldown remains 1 of 2 starts remaining, due 6)
    step('6b. Advance to 3 (PC start 1): cooldown active 1 start remaining, due 6');
    await advanceTo(3);
    assert.equal(seqNow(), 3);
    assert.ok(cds(host)[kD1], 'cooldown active at sequence 3');
    await blockedReuse(D1.name, 'D1 at seq 3');

    // Advance to sequence 6 (PC start 2): cooldown releases at 6!
    step('6c. Advance to 6 (PC start 2): cooldown released by authenticated boundary');
    await advanceTo(6);
    assert.equal(seqNow(), 6);
    assert.equal(cds(host)[kD1], undefined, 'D1 cooldown released at boundary 6');
    stage('D1 boundary release', 'Advance authenticated turn to boundary 6 releases cooldown; DR already removed');

    // ── STAGE 5: Expiry before release (D2 Timed DR, target-next-start, cooldown 2) ──
    step('7. Stage 5: Cast D2 (Ward Timed, target-next-start, cooldown 2) on A at seq 6');
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

    let drsA2 = drsOf(A(host));
    assert.equal(drsA2.length, 1);
    assert.deepEqual(drsA2[0].effects, { damageReduction: 3 });
    // Timing schedule for DR: A's next start. Turn order is [pc, B, A]. Next A start is seq 8!
    const rawCond = A(host).state.conditions[0];
    const schedD2 = timing.scheduleFor(rawCond, combat()) ||
      Object.values(combat().effectLifecycle?.schedules || {}).find(s => s.recordId === rawCond?.recordId);
    assert.equal(schedD2.dueSequence, 8, 'DR expires at A\'s next start (sequence 8)');
    report.checks.d2Cast = { commandId: r2.commandId, cooldown: item, drsA: drsA2, expirySeq: schedD2.dueSequence };
    stage('D2 cast', 'App controls; payment, timed DR +3 and cooldown in one receipt');
    await closeCast(od);

    // Advance to 8: A's start. Effect expires at 8!
    step('7b. Advance to 8 (A\'s start): DR expires at 8, cooldown stays active');
    await advanceTo(8);
    assert.equal(seqNow(), 8);
    assert.equal(drsOf(A(host)).length, 0, 'DR expired at sequence 8');
    assert.ok(cds(host)[kD2], 'D2 cooldown remains active at sequence 8');
    await blockedReuse(D2.name, 'D2 after effect expiry at seq 8');
    stage('D2 effect expiry before cooldown release', 'DR expires at target start 8; cooldown stays blocked');

    // Advance to 12 (PC start 2): D2 cooldown released!
    step('7c. Advance to 12 (PC start 2): D2 cooldown released at 12');
    await advanceTo(12);
    assert.equal(seqNow(), 12);
    assert.equal(cds(host)[kD2], undefined, 'D2 cooldown released at boundary 12');
    stage('D2 cooldown release', 'Cooldown releases at boundary 12');

    // ── STAGE 6: Release before expiry (D3 Ward Counted 3, cooldown 1) & Stacking Refusal ──
    step('8. Stage 6: Cast D3 (Ward Counted 3, cooldown 1) on A at seq 12');
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

    // Advance to 15 (PC next start): cooldown releases at 15 while DR effect stays active!
    step('8b. Advance to 15 (PC start): D3 cooldown releases at 15 while DR effect stays active');
    await advanceTo(15);
    assert.equal(seqNow(), 15);
    assert.equal(cds(host)[kD3], undefined, 'D3 cooldown released at 15');
    const drsA3 = drsOf(A(host));
    assert.equal(drsA3.length, 1, 'DR +3 effect remains active on A');
    stage('D3 release before counted expiry', 'Cooldown releases at 15 while counted DR effect remains active');
    await closeCast(od);

    // Refusal of second DR recast on A while active
    step('8c. Combination refusal: attempt recast on A is refused without spend or cooldown');
    od = await openCast(D3.name, 'A · creature · A');
    await od.getByText(/Cooldown ready\./).waitFor();
    const mapsBeforeConflict = actors.clone(host.room.gameState.maps);
    await approveButton(od).click();
    card = await fillCard(D3.name);

    // GM card shows diagnostic refusal for multiple DR
    await card.getByText(/already changes flat Damage Reduction on this target/i).first().waitFor();
    await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    assert.deepEqual(host.room.gameState.maps, mapsBeforeConflict, 'refusal spent nothing and started no new cooldown');
    assert.equal(drsOf(A(host)).length, 1, 'Only one DR effect on A; stacking refused');
    stage('D3 combination refusal', 'Second DR recast refused while previous instance remains active');
    await closeCast(od);

    // GM declines refused proposal
    await card.getByRole('button', { name: 'Decline', exact: true }).click();
    await card.waitFor({ state: 'detached' });

    // Clean up A's DR condition
    await gmRemoveDr(gm, host, 'A');

    // ── STAGE 7: Coincident Boundary (D4 plain damage 1d6+2 + DR +3, target-next-end, cooldown 1) ──
    step('9. Stage 7: Coincident boundary with roster [PC, B, A]');
    // Turn index at seq 15 is 0 (PC). In roster [PC, B, A]:
    // PC is active at 15 (PC start). Cast D4 on A.
    // D4 cooldown = 1: due at next PC start = sequence 18!
    // D4 expiry = target-next-end: A's next turn end.
    // Order from seq 15:
    // seq 15: PC start -> seq 16: B start -> seq 17: A start -> seq 18: PC start!
    // Note that at sequence 18, A's turn ends AND PC's turn starts!
    od = await openCast(D4.name, 'A · creature · A');
    await od.getByText(/Cooldown ready\./).waitFor();
    await recordRoll(od, 4); // 4 + 2 = 6 damage
    await approveButton(od).click();
    await od.getByText(/Awaiting GM adjudication/).waitFor();

    const hpABefore = hpOf(A(host));
    card = await fillCard(D4.name, 6);
    const r4 = await confirmCard(D4.name, card);
    const kD4 = cooldown.key(host.refs.pc, recD4.authoredDefinitionId);
    assert.ok(cds(host)[kD4], 'D4 cooldown recorded');
    assert.equal(drsOf(A(host)).length, 1, 'A received DR +3');
    const hpAAfter = hpOf(A(host));
    assert.equal(hpAAfter.current + hpAAfter.temp, hpABefore.current + hpABefore.temp - 6, 'A took 6 damage');
    stage('D4 cast', 'One receipt applies direct damage, DR condition and cooldown');
    await closeCast(od);

    // Advance to 18: Boundary where A's turn ends and PC's turn starts!
    step('9b. Advance to 18: Coincident boundary releases cooldown and expires DR in one boundary transition');
    await advanceTo(18);
    assert.equal(seqNow(), 18);
    assert.equal(cds(host)[kD4], undefined, 'D4 cooldown released at coincident boundary 18');
    assert.equal(drsOf(A(host)).length, 0, 'D4 DR expired at coincident boundary 18');
    stage('coincident boundary', 'Both DR expiry and cooldown release resolve cleanly in one boundary');

    // Legal reuse now succeeds because both conditions permit it
    step('9c. Legal reuse after coincident boundary succeeds once');
    await gm.evaluate(async() => {
      await __actors.refreshActorSnapshot();
      await __actors.adjustSharedResource('pc', 'actionPoints', 5);
      await __actors.adjustSharedResource('pc', 'mana', 10);
    });
    await owner.evaluate(() => __actors.refreshActorSnapshot());
    od = await openCast(D1.name, 'A · creature · A');
    await od.getByText(/Cooldown ready\./).waitFor();
    await approveButton(od).click();
    card = await fillCard(D1.name);
    await confirmCard(D1.name, card);
    assert.ok(cds(host)[kD1], 'D1 cooldown started anew');
    assert.equal(drsOf(A(host)).length, 1, 'D1 DR installed anew');
    stage('legal reuse after coincident release', 'Cast succeeds once both eligibility conditions permit');
    await closeCast(od);

    report.passed = true;
    report.checks.stagesCompleted = Object.keys(report.stages).length;
    console.log('=== FLAT DR + COOLDOWN APP WITNESS: ALL STAGES PASSED ===');
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
