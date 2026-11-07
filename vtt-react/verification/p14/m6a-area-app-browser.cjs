// Normal controls author/reopen/admit/place-area/select-targets/approve/adjudicate/recover.
// Identity/ownership/lease/cloud are declared fixtures.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), cp = require('child_process');
const { chromium } = require('playwright');
const out = process.env.M6A_APP_OUTPUT;
assert.ok(out && path.isAbsolute(out) && process.env.APP_BUILD_DIR);
fs.mkdirSync(out, { recursive: true });
process.env.APP_OUTPUT = path.join(out, 'fixture');
const { setup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const pure = require('../../../server/shared/services/authoredAbility');
const setProposalForTest = enabled => {
  pure.setAreaRollProposalForTest(enabled);
  globalThis.__MYTHRILL_ENABLE_PROPOSED_AREA_ROLL__ = enabled === true;
};
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const ack = (s, e, p) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error('ACK timeout ' + e)), 10000);
  s.emit(e, p, r => { clearTimeout(t); resolve(r); });
});

const report = {
  checks: {},
  disclosedTestConfig: {
    shippedDefaultAreaRollApproved: pure.isAreaRollProcedureApproved(),
    shippedDefaultCreatorApproval: pure.AREA_ROLL_POLICY.creatorApproval,
    testOnlyFlagUsedAfterOrdinaryRefusalVerified: 'setAreaRollProposalForTest(true) + window.__MYTHRILL_ENABLE_PROPOSED_AREA_ROLL__ = true'
  },
  errors: [],
  limits: [
    'Normal production App and registered handlers; auth/provider/ownership/lease/cloud are fixtures, not real Firebase.',
    'Inspected real catalogue AoE spells retain whole-record blockers (saves, multi-turn zones, forced movement, custom gauges); this M6A primitive is proven through real Spell Wizard authoring with that limitation explicit.',
    'Area roll procedure (shared-area-roll-proposed: one owner roll proposes roll.total per target; GM adjudicates per-target finalAmount and adjustmentReason) is an explicit proposed first-profile rule requiring creator confirmation, not a universal Prism rule. Shipped default refuses ordinary admission/execution; test-only flag is enabled only after ordinary-use refusal is verified.',
    '8 creature targets / 9 actors are technical engine/receipt limits, not game rules.',
    'Transformation preservation checklist is authoring/preservation/display evidence only, not transformation combat execution.'
  ]
};

const book = page => page.getByRole('dialog', { name: 'Spellbook', exact: true });
async function openBook(page) {
  await page.getByRole('button', { name: /^Character(?: \(\d+\))?$/ }).click();
  await page.getByRole('button', { name: /^Spellbook(?: S)?$/ }).click();
  await book(page).waitFor();
}
async function closeBook(page) {
  const b = book(page).getByRole('button', { name: 'Close', exact: true });
  await b.focus();
  await b.press('Enter');
}

async function authorAreaSpellAndVerifyDefaultGate(page, host, name, formula) {
  // Ensure shipped default gate is active (unapproved)
  setProposalForTest(false);
  assert.equal(pure.AREA_ROLL_POLICY.creatorApproval, null);
  assert.equal(pure.isAreaRollProcedureApproved(), false);

  await openBook(page);
  await book(page).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(name);
  await book(page).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Bounded M6A area circle immediate damage ability.');
  await book(page).getByText('Arcane', { exact: true }).click();
  await book(page).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Spell Type$/ }).click();
  await book(page).getByRole('heading', { name: 'ACTION', exact: true }).click();
  await book(page).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await book(page).getByRole('button', { name: /^(3 )?Effects$/ }).click();
  await book(page).getByRole('heading', { name: 'Damage', exact: true }).click();
  const input = book(page).getByLabel('Damage formula', { exact: true });
  await input.fill(formula);
  await book(page).getByText('Prism formula execution: supported syntax', { exact: true }).click();
  save('area-formula.aria.yml', await book(page).ariaSnapshot());
  await book(page).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Targeting & Propagation$/ }).click();
  await book(page).getByText('Area of Effect', { exact: true }).click();
  await book(page).getByText('Circle', { exact: true }).click();
  await book(page).getByText('Ranged', { exact: true }).click();
  const rangeSlider = book(page).getByRole('slider').first();
  await rangeSlider.focus();
  await rangeSlider.press('Home');
  for (let i = 0; i < 6; i++) await rangeSlider.press('ArrowRight');
  await book(page).getByText('Enemies', { exact: true }).click();
  await book(page).getByText('Any Target', { exact: true }).click();
  save('area-targeting.aria.yml', await book(page).ariaSnapshot());
  await book(page).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Resources$/ }).click();
  await book(page).getByTitle('Standard magical energy', { exact: true }).click();
  await book(page).getByTitle('Basic action economy', { exact: true }).click();
  const values = book(page).getByRole('spinbutton');
  await values.nth(0).fill('2');
  await values.nth(1).fill('1');
  await page.getByRole('button', { name: '✓ Complete Spell', exact: true }).click();
  await page.waitForFunction(n => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(n)), name);
  const saved = await page.evaluate(n => {
    const key = Object.keys(localStorage).find(k => k.endsWith(':library.spellData'));
    return JSON.parse(localStorage.getItem(key)).payload.data.spells.find(s => s.name === n);
  }, name);
  assert.equal(saved.authoredDraft.damageConfig.formula, formula);

  // 1) Verify default proposed-roll gate refuses in pure adapter, UI admission panel, and server handler
  const defaultCompiled = pure.definitionFromWizard(saved, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' });
  assert.equal(defaultCompiled.ok, false);
  assert.match(defaultCompiled.reason, /awaits creator confirmation/);

  await closeBook(page);
  await openBook(page);
  await book(page).getByRole('button', { name: 'Spell Library', exact: true }).click();
  await book(page).getByText(name, { exact: true }).click();
  const section = page.getByRole('region', { name: `Room admission for ${name}`, exact: true });
  await section.waitFor();
  await section.getByText(/Unsupported\/manual — Area roll procedure \(shared-area-roll-proposed vs independent per-target rolls\) awaits creator confirmation/).waitFor();
  const admitBtnDefault = section.getByRole('button', { name: 'Admit this saved version', exact: true });
  assert.equal(await admitBtnDefault.isDisabled(), true, 'Admit button must be disabled in shipped default state while area roll procedure awaits creator confirmation');
  save('area-default-gate-refused.aria.yml', await section.ariaSnapshot());

  const serverDefaultAdmit = await page.evaluate(record => new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(Error('ACK timeout actor_authored_admit')), 10000);
    window.__socket.emit('actor_authored_admit', {
      roomId: S('gameStore').getState().multiplayerRoom.id,
      requestId: '00000000-0000-4000-8000-000000000601',
      expectedRegistryRevision: 0,
      record,
      definitionVersion: 1,
      classId: 'arcanoneer'
    }, r => { clearTimeout(t); resolve(r); });
  }), saved);
  assert.equal(serverDefaultAdmit.success, false);
  assert.equal(serverDefaultAdmit.code, 'unsupported_wizard_record');
  assert.match(serverDefaultAdmit.error || '', /awaits creator confirmation/);

  // 2) Explicitly enable disclosed test-only proposal flag on server + GM page and admit
  setProposalForTest(true);
  await page.evaluate(() => { window.__MYTHRILL_ENABLE_PROPOSED_AREA_ROLL__ = true; });
  const compiled = pure.definitionFromWizard(saved, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' });
  assert.equal(compiled.ok, true);
  assert.equal(compiled.definition.capability, pure.AREA_CAPABILITY);
  assert.equal(compiled.definition.targeting.aoeShape, 'circle');
  assert.equal(compiled.definition.targeting.radiusFeet, 20);
  assert.equal(compiled.definition.targeting.rangeFeet, 30);
  save('area-saved.json', saved);

  // Reopen the detail overlay so AuthoredAdmission re-evaluates under the disclosed test-only flag
  await page.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click();
  await book(page).getByText(name, { exact: true }).click();
  await section.waitFor();
  await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click();
  await section.getByText(/Admitted for immediate damage\/healing/).waitFor();
  save('area-reopened-admitted.aria.yml', await section.ariaSnapshot());
  await page.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click();
  await closeBook(page);
  return {
    saved,
    defaultGateRefusal: {
      pureReason: defaultCompiled.reason,
      uiAdmitDisabled: true,
      serverCode: serverDefaultAdmit.code,
      serverError: serverDefaultAdmit.error
    }
  };
}

async function runTransformationPreservationChecklist(page) {
  // Verify the 5-step Transformation Preservation checklist (handoff/transformation-preservation/HANDOFF.md)
  // on the integrated production bundle. Authoring/preservation/display only — not combat execution.
  const legacySpellId = 'fx-legacy-transform-browser';
  const legacySpellName = 'Ancient Lupine Shift';
  await openBook(page);
  await book(page).getByRole('button', { name: 'Spell Wizard', exact: true }).click();
  await page.waitForFunction(() => typeof window.handleLoadSpell === 'function');

  await page.evaluate(({ id, name }) => {
    const direWolf = {
      id: 'dire-wolf',
      name: 'Dire Wolf',
      size: 'large',
      type: 'beast',
      description: 'A massive silver-furred pack alpha.',
      tags: ['beast'],
      stats: { maxHp: 45, maxMana: 10, maxAp: 4, damageReduction: 2 }
    };
    const moonWolf = {
      id: 'moon-wolf',
      name: 'Moon Wolf',
      size: 'Medium',
      type: 'Beast',
      description: 'Silver-furred hunter.',
      stats: { maxHp: 31, maxMana: 7, maxAp: 5 }
    };
    S('creatureStore').setState(s => ({
      creatures: [
        ...s.creatures.filter(c => c.id !== 'dire-wolf' && c.id !== 'moon-wolf'),
        moonWolf,
        direWolf
      ]
    }));
    // 1. Open Wizard with a legacy transformation record (transformConfig-only, no transformType key)
    const legacyRecord = {
      id,
      name,
      description: 'Legacy transformation preservation witness record.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['transformation'],
      effectsMap: { transformation: true },
      typeConfig: { school: 'primal', icon: 'Nature/Transform Bear', tags: ['transformation'] },
      targetingConfig: { targetingType: 'self', rangeType: 'self', rangeDistance: 0 },
      resourceCost: { actionPoints: 1, mana: 5, resourceTypes: ['mana', 'actionPoints'], resourceValues: { mana: 5, actionPoints: 1 } },
      transformConfig: {
        isCustom: false,
        formId: 'moon-wolf',
        selectedCreature: moonWolf,
        targetType: 'self',
        duration: 2,
        durationUnit: 'hours',
        concentration: true,
        maintainEquipment: true,
        retainsAbilities: false,
        difficultyClass: 15,
        difficultyCr: 'moderate',
        saveType: 'spirit',
        grantedAbilities: [{ id: 'natural_weapons', name: 'Natural Weapons', description: 'Claws, teeth, horns, etc.', icon: 'Nature/Transform Bear' }],
        formula: '1d6',
        manualNote: { keep: 'me' }
      },
      unrelatedSentinel: { keep: 'me' },
      isCustom: true,
      source: 'wizard',
      dateCreated: '2026-01-01T00:00:00.000Z',
      lastModified: '2026-01-01T00:00:00.000Z',
      categoryIds: ['uncategorized']
    };
    window.handleLoadSpell(legacyRecord, false);
  }, { id: legacySpellId, name: legacySpellName });

  // 2. Navigate to Effects -> Transformation: verify authored form (Moon Wolf) and granted abilities (Natural Weapons) are intact on mount
  await book(page).getByRole('button', { name: /^(3 )?Effects$/ }).click();
  await book(page).getByRole('heading', { name: 'Moon Wolf', exact: true }).waitFor();
  await book(page).getByText('Selected Abilities:', { exact: true }).waitFor();
  await book(page).getByText('1.', { exact: true }).waitFor();
  const mountSnap = await book(page).ariaSnapshot();
  assert.ok(mountSnap.includes('Moon Wolf'), 'Legacy form Moon Wolf must remain intact on TransformationEffects mount');
  assert.ok(mountSnap.includes('Natural Weapons'), 'Legacy grantedAbilities must not be wiped on mount when transformType is absent');
  save('transformation-1-legacy-mount.aria.yml', mountSnap);

  // 3. Select a creature from the Creature Library (Dire Wolf): verify both creature identity and form are selected, and granted abilities section renders
  await book(page).getByRole('button', { name: /Select from Creature Library/i }).click();
  // MythrillWindow renders the picker as an untitled dialog ("Window"); scope it by its toolbar title.
  const picker = page.getByRole('dialog').filter({ hasText: 'Select Transformation Target' });
  await picker.waitFor();
  await picker.getByRole('heading', { name: 'Dire Wolf', exact: true }).click();
  await book(page).getByRole('heading', { name: 'Dire Wolf', exact: true }).waitFor();
  await book(page).getByRole('heading', { name: 'Granted Abilities', exact: true }).waitFor();
  const afterCreatureSelectSnap = await book(page).ariaSnapshot();
  assert.ok(afterCreatureSelectSnap.includes('Dire Wolf'), 'Selected creature Dire Wolf renders in TransformationEffects');
  assert.ok(afterCreatureSelectSnap.includes('Special Abilities (Choose up to 3)'), 'Granted Abilities section renders after creature selection (formId not overwritten with null)');
  save('transformation-2-creature-selected.aria.yml', afterCreatureSelectSnap);

  // 4. Save spell (Complete Spell) -> Reopen spell in Wizard: verify transformation data, formId, and granted abilities persist
  await page.getByRole('button', { name: '✓ Complete Spell', exact: true }).click();
  await page.waitForFunction(n => {
    const key = Object.keys(localStorage).find(k => k.endsWith(':library.spellData'));
    const spells = JSON.parse(localStorage.getItem(key)).payload.data.spells;
    return spells.some(s => s.name === n && s.transformationConfig?.formId === 'dire-wolf');
  }, legacySpellName);

  const savedTransformSpell = await page.evaluate(n => {
    const key = Object.keys(localStorage).find(k => k.endsWith(':library.spellData'));
    const spells = JSON.parse(localStorage.getItem(key)).payload.data.spells;
    const updated = spells.filter(s => s.name === n && s.transformationConfig?.formId === 'dire-wolf').at(-1);
    window.handleLoadSpell(updated, true);
    return updated;
  }, legacySpellName);
  assert.equal(savedTransformSpell.transformationConfig.formId, 'dire-wolf');
  assert.equal(savedTransformSpell.transformationConfig.selectedCreature.id, 'dire-wolf');
  assert.equal(savedTransformSpell.transformationConfig.grantedAbilities.length, 1);
  assert.equal(savedTransformSpell.transformationConfig.grantedAbilities[0].id, 'natural_weapons');
  assert.deepEqual(savedTransformSpell.transformationConfig.manualNote, { keep: 'me' });

  await book(page).getByRole('button', { name: /^(3 )?Effects$/ }).click();
  await book(page).getByRole('heading', { name: 'Dire Wolf', exact: true }).waitFor();
  await book(page).getByRole('heading', { name: 'Granted Abilities', exact: true }).waitFor();
  const reopenedSnap = await book(page).ariaSnapshot();
  assert.ok(reopenedSnap.includes('Dire Wolf'), 'Reopened spell preserves Dire Wolf creature form');
  assert.ok(reopenedSnap.includes('Natural Weapons'), 'Reopened spell preserves granted abilities');

  // 5. Inspect Spell Library card: verify transformation section displays the chosen creature form and ability details
  await book(page).getByRole('button', { name: 'Spell Library', exact: true }).click();
  await book(page).getByText(legacySpellName, { exact: true }).first().click();
  const detailOverlay = page.locator('.spell-detail-overlay');
  await detailOverlay.waitFor();
  await detailOverlay.getByText(/Transform into Dire Wolf/i).waitFor();
  const cardSnap = await detailOverlay.ariaSnapshot();
  assert.ok(cardSnap.includes('Transform into Dire Wolf'), 'Spell Library card displays Transform into Dire Wolf');
  assert.ok(cardSnap.includes('Natural Weapons'), 'Spell Library card displays granted ability Natural Weapons');
  save('transformation-3-library-card.aria.yml', cardSnap);

  await detailOverlay.getByRole('button', { name: 'Close', exact: true }).click();
  await closeBook(page);

  return {
    scope: 'authoring/preservation/display only (not transformation combat execution)',
    legacyMountPreserved: { formId: 'moon-wolf', grantedAbility: 'Natural Weapons' },
    creatureSelected: { formId: savedTransformSpell.transformationConfig.formId, selectedCreatureId: savedTransformSpell.transformationConfig.selectedCreature.id },
    reopenedPreserved: true,
    libraryCardDisplaysCreatureAndAbilities: true
  };
}

async function actions(page) {
  const s = page.locator('summary').filter({ hasText: /^Admitted abilities$/ });
  if (await page.getByRole('region', { name: 'Admitted abilities', exact: true }).count() === 0) {
    await s.click();
  }
  const r = page.getByRole('region', { name: 'Admitted abilities', exact: true });
  await r.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
  return r;
}

async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const event of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_spell_approve', 'actor_spell_list', 'actor_authored_admit', 'actor_authored_list', 'join_room']) {
    host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  }
  // Align A, B, pc to verified 50px square-grid cell centres ((x + 0.5) * 50) so B2 occupiedPreviewCells
  // evaluates exact cell footprints, and seed C (outside circle at 775, 325) + H (hidden inside circle at 475, 325).
  const mapId = 'app-hall';
  host.room.gameState.maps[mapId].tokens.A.position = { x: 425, y: 325 };
  delete host.room.gameState.maps[mapId].tokens.A.state.actorContract;
  const rebindA = await ack(host.seed, 'actor_bind', {
    roomId: host.room.id,
    ref: { kind: 'creature', roomId: host.room.id, mapId, tokenId: 'A' },
    snapshotHash: actors.hash(host.room.gameState.maps[mapId].tokens.A)
  });
  assert.equal(rebindA.success, true);
  host.refs.A = rebindA.ref;

  host.room.gameState.maps[mapId].tokens.B.position = { x: 525, y: 325 };
  delete host.room.gameState.maps[mapId].tokens.B.state.actorContract;
  const rebindB = await ack(host.seed, 'actor_bind', {
    roomId: host.room.id,
    ref: { kind: 'creature', roomId: host.room.id, mapId, tokenId: 'B' },
    snapshotHash: actors.hash(host.room.gameState.maps[mapId].tokens.B)
  });
  assert.equal(rebindB.success, true);
  host.refs.B = rebindB.ref;

  host.room.gameState.maps[mapId].characterTokens.pc.position = { x: 625, y: 325 };
  delete host.room.gameState.maps[mapId].characterTokens.pc.state.actorContract;
  const rebindPc = await ack(host.seed, 'actor_bind', {
    roomId: host.room.id,
    ref: { kind: 'character', roomId: host.room.id, mapId, tokenId: 'pc', ownerUid: 'app-owner', characterId: 'ilse' },
    snapshotHash: actors.hash(host.room.gameState.maps[mapId].characterTokens.pc)
  });
  assert.equal(rebindPc.success, true);
  host.refs.pc = rebindPc.ref;

  const baseCreature = actors.clone(host.room.gameState.maps[mapId].tokens.A);
  delete baseCreature.state.actorContract;
  host.room.gameState.maps[mapId].tokens.C = {
    ...actors.clone(baseCreature),
    id: 'C',
    name: 'C',
    position: { x: 775, y: 325 },
    state: { ...actors.clone(baseCreature.state), customName: 'C', currentHp: 30, tempHealth: 4 }
  };
  const bindC = await ack(host.seed, 'actor_bind', {
    roomId: host.room.id,
    ref: { kind: 'creature', roomId: host.room.id, mapId, tokenId: 'C' },
    snapshotHash: actors.hash(host.room.gameState.maps[mapId].tokens.C)
  });
  assert.equal(bindC.success, true, JSON.stringify(bindC));
  host.refs.C = bindC.ref;

  host.room.gameState.maps[mapId].tokens.H = {
    ...actors.clone(baseCreature),
    id: 'H',
    name: 'HiddenStalker',
    position: { x: 475, y: 325 },
    state: { ...actors.clone(baseCreature.state), customName: 'HiddenStalker', currentHp: 30, tempHealth: 4, hiddenFromPlayers: true }
  };
  const bindH = await ack(host.seed, 'actor_bind', {
    roomId: host.room.id,
    ref: { kind: 'creature', roomId: host.room.id, mapId, tokenId: 'H' },
    snapshotHash: actors.hash(host.room.gameState.maps[mapId].tokens.H)
  });
  assert.equal(bindH.success, true, JSON.stringify(bindH));
  host.refs.H = bindH.ref;

  const privateDir = path.join(out, 'private');
  fs.mkdirSync(privateDir, { recursive: true });
  if (process.platform === 'win32') {
    cp.execFileSync('icacls.exe', [privateDir, '/inheritance:r', '/grant:r', `${process.env.USERDOMAIN}\\${process.env.USERNAME}:(OI)(CI)F`, 'SYSTEM:(OI)(CI)F']);
  }
  const contexts = [], pages = [];
  try {
    async function page(role) {
      const c = await chromium.launchPersistentContext(path.join(privateDir, role), {
        channel: 'chrome',
        headless: true,
        viewport: { width: 1440, height: 1000 }
      });
      contexts.push(c);
      const p = c.pages()[0];
      pages.push(p);
      p.on('pageerror', e => report.errors.push({ role, message: e.message }));
      await setup(p, host.url, role);
      return p;
    }

    const gm = await page('app-gm');
    const spellName = 'Prism Arcane Pulse';
    const authored = await authorAreaSpellAndVerifyDefaultGate(gm, host, spellName, '2d6 + intelligence/2');
    report.checks.areaWizard = authored.saved;
    report.checks.ordinaryUseRollGateRefusal = authored.defaultGateRefusal;

    // Run Flash's Transformation Preservation 5-step browser checklist on the integrated build
    report.checks.transformationPreservationAuthoringOnly = await runTransformationPreservationChecklist(gm);

    const observer = await page('app-observer');
    await observer.evaluate(() => {
      S('creatureStore').setState(s => ({
        creatureTokens: s.creatureTokens.map(t => t.id === 'H' ? { ...t, state: { ...t.state, hiddenFromPlayers: true } } : t)
      }));
    });
    const owner = await page('app-owner');
    await owner.waitForTimeout(1500);
    await owner.evaluate(ref => {
      const ilse = {
        id: 'ilse',
        currentCharacterId: 'ilse',
        name: 'Ilse',
        class: 'Arcanoneer',
        level: 3,
        stats: { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 },
        classResource: { type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'], current: 3, max: 12 }
      };
      S('characterStore').setState({ ...ilse, characters: [ilse] });
      S('creatureStore').setState(s => ({
        creatures: s.creatures.some(c => c.id === 'grimmstalk') ? s.creatures : [...s.creatures, { id: 'grimmstalk', name: 'Branvig', size: 'medium', stats: { maxHp: 250 } }],
        creatureTokens: s.creatureTokens.map(t => t.id === 'H' ? { ...t, state: { ...t.state, hiddenFromPlayers: true } } : t)
      }));
      const selected = __actors.selectOwnerAttachment(ref);
      if (!selected.success) throw Error(JSON.stringify(selected));
    }, host.refs.pc);

    // Verify that when the server & owner page have the proposed-roll gate OFF (shipped default),
    // the already-admitted area entry is marked ineligible and Use admitted ability is disabled in ordinary use:
    setProposalForTest(false);
    const region = await actions(owner);
    const admittedRow = region.locator('.p9-admitted-row').filter({ hasText: spellName });
    await region.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
    await admittedRow.waitFor();
    // The shipped admitted list keeps the row visible; the gate is enforced when the owner tries to use it:
    // routeSpellCast refuses (authoredSupport -> unsupported), no cast panel opens, nothing is emitted or paid.
    // Observed limitation: the owner-row message is the generic "unavailable" text, not the roll-gate reason.
    await admittedRow.getByRole('button', { name: 'Use admitted ability', exact: true }).click();
    await region.getByText('This installed binding is unavailable to your current character.', { exact: true }).waitFor();
    const refusedDialog = owner.getByRole('dialog', { name: 'Supported spell cast', exact: true });
    assert.equal(await refusedDialog.count(), 0, 'No cast panel opens while the roll proposal is unapproved');
    const ownerGateReason = await owner.evaluate(() => {
      return S('spellConsequenceStore')?.getState?.().owner || null;
    }).catch(() => 'not-inspectable');
    save('area-owner-default-gate-refused.aria.yml', await region.ariaSnapshot());
    report.checks.ordinaryUseRollGateRefusal.ownerUseRefusedWhenUnapproved = { castPanelOpened: false, ownerState: ownerGateReason, ownerMessage: 'This installed binding is unavailable to your current character.', limitation: 'generic owner message; roll-gate reason shown in Wizard admission and server refusal' };

    // Now enable disclosed test-only proposal flag on server + owner + gm contexts for the supported-path witness
    setProposalForTest(true);
    await owner.evaluate(() => { window.__MYTHRILL_ENABLE_PROPOSED_AREA_ROLL__ = true; });
    await gm.context().addInitScript(() => { window.__MYTHRILL_ENABLE_PROPOSED_AREA_ROLL__ = true; });
    await gm.evaluate(() => { window.__MYTHRILL_ENABLE_PROPOSED_AREA_ROLL__ = true; });
    await region.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();

    await admittedRow.getByRole('button', { name: 'Use admitted ability', exact: true }).click();
    const dialog = owner.getByRole('dialog', { name: 'Supported spell cast', exact: true });
    await dialog.waitFor();

    // Place area on map via ActionAreaPreview controls
    await dialog.getByRole('button', { name: 'Place area on map', exact: true }).click();
    const previewPanel = owner.getByRole('region', { name: `${spellName} area placement`, exact: true });
    await previewPanel.waitFor();
    const catcher = owner.getByRole('application', { name: /Place Radiant Burst origin/ });
    await catcher.focus();
    // Move origin 150px left from caster (625, 325) -> (475, 325), centered between A (425, 325) and B (525, 325)
    for (let i = 0; i < 30; i++) await catcher.press('ArrowLeft');
    await previewPanel.getByText(/15 ft to origin — within 30-ft placement range/).waitFor();
    save('area-preview.aria.yml', await previewPanel.ariaSnapshot());
    await previewPanel.getByRole('button', { name: 'Use placed area in cast panel', exact: true }).click();

    await dialog.waitFor();
    await dialog.getByText(/Placed circle origin \(475, 325\)/).waitFor();
    await dialog.getByText(/2 \/ 8 creature targets selected/).waitFor();
    const ownerSnapBeforeRoll = await dialog.ariaSnapshot();
    assert.ok(!ownerSnapBeforeRoll.includes('HiddenStalker'), 'Hidden creature H inside circle must never leak to owner');
    assert.ok(ownerSnapBeforeRoll.includes('Geometric overlap (candidate)'), 'Visible creatures A and B inside circle are classified as geometric overlap candidates');
    assert.ok(ownerSnapBeforeRoll.includes('Outside placed circle'), 'Visible creature C outside circle is distinguished from geometrically overlapping candidates');
    assert.ok(!ownerSnapBeforeRoll.includes('Ilse · character'), 'Caster PC is excluded from selectable area targets');

    // Record physical 2d6 roll [4, 5] -> 4 + 5 + floor(16 / 2) = 17
    await dialog.getByLabel('d6 face 1', { exact: true }).fill('4');
    await dialog.getByLabel('d6 face 2', { exact: true }).fill('5');
    await dialog.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    await dialog.getByText(/Recorded physical roll: \[4, 5\] \+ 8 =/).waitFor();

    // Close and reopen to verify draft persistence of areaOrigin, targetKeys and roll
    await dialog.getByRole('button', { name: 'Close', exact: true }).click();
    await admittedRow.getByRole('button', { name: 'Use admitted ability', exact: true }).click();
    await dialog.getByText(/Recorded physical roll: \[4, 5\] \+ 8 =/).waitFor();
    await dialog.getByText(/2 \/ 8 creature targets selected/).waitFor();

    const beforeMaps = actors.clone(host.room.gameState.maps);
    await dialog.getByRole('button', { name: 'Approve one source payment and 2 creature targets', exact: true }).click();

    const card = gm.getByRole('article', { name: `Area adjudication for ${spellName}`, exact: true });
    await card.waitFor();
    assert.deepEqual(host.room.gameState.maps, beforeMaps, 'Approval alone never mutates source resources or target HP');

    // Verify observer never receives pending area proposal
    const observerBodyDuringPending = await observer.locator('body').ariaSnapshot();
    assert.ok(!observerBodyDuringPending.includes(spellName), 'Observer must not see pending area approval');

    const entry = require('../../../server/services/spellPayments').listAll(host.room).find(e => e.approval.spell.name === spellName);
    assert.ok(entry);
    assert.equal(entry.approval.roll.total, 17);
    assert.equal(entry.approval.targets.length, 2);
    save('area-owner.aria.yml', await dialog.ariaSnapshot());

    // GM inspects per-target outcomes: full 17 for A, adjusted 8 for B with reason
    await card.getByRole('button', { name: 'Use proposed roll (17) for all targets', exact: true }).click();
    await card.getByLabel('Final damage for B', { exact: true }).fill('8');
    await card.getByLabel('Adjustment reason for B', { exact: true }).fill('half damage agility save');
    await card.getByRole('checkbox', { name: /I adjudicated area placement/ }).check();
    save('area-gm.aria.yml', await card.ariaSnapshot());

    // Drop the first actor_consequence ACK + broadcast to GM to verify lost-ACK & reload recovery
    await gm.evaluate(() => {
      const listeners = __socket.listeners('actor_consequence_accepted');
      __socket.removeAllListeners('actor_consequence_accepted');
      __socket.on('actor_consequence_accepted', r => {
        if (String(r.receipt?.adjudication?.definitionVersionOrHash).startsWith('authored-area:v1/')) return;
        listeners.forEach(fn => fn(r));
      });
      const emit = __socket.emit.bind(__socket);
      let drop = true;
      __socket.emit = (event, ...args) => {
        if (drop && event === 'actor_consequence' && String(args[0]?.adjudication?.definitionVersionOrHash).startsWith('authored-area:v1/')) {
          drop = false;
          if (typeof args[1] === 'function') args[1] = () => {};
        }
        return emit(event, ...args);
      };
    });

    await card.getByRole('button', { name: 'Accept one area consequence', exact: true }).click();
    await dialog.getByText(/Accepted · /).first().waitFor({ timeout: 35000 });
    await card.getByRole('button', { name: 'Check same command', exact: true }).waitFor({ timeout: 35000 });

    const originalCommand = await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload);
    const receiptCountAfterCommit = actors.ledger(host.room).receipts.length;

    // Reload GM and recover via Check same command without duplicating payment or damage
    await setup(gm, host.url, 'app-gm');
    await gm.getByRole('button', { name: 'Check same command', exact: true }).first().click();
    await gm.getByText(/Accepted · /).first().waitFor({ timeout: 35000 });
    const recheckedCommand = await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload);
    assert.deepEqual(recheckedCommand, originalCommand);
    assert.equal(actors.ledger(host.room).receipts.length, receiptCountAfterCommit);

    const receipt = actors.clone(actors.ledger(host.room).receipts.at(-1));
    const chosen = JSON.parse(receipt.adjudication.chosenResult);
    assert.equal(chosen.capability, pure.AREA_CAPABILITY);
    assert.equal(chosen.areaRollProcedure, pure.AREA_ROLL_PROCEDURE);
    assert.deepEqual(chosen.roll.dice[0].faces, [4, 5]);
    assert.equal(receipt.targets.length, 2);
    assert.equal(receipt.actors.length, 3);

    // Verify single source payment on pc and exact per-target HP changes on A and B (C and H untouched)
    const pcAfter = actors.clone(actors.locate(host.room, host.refs.pc).token.character);
    const aAfter = actors.clone(actors.locate(host.room, host.refs.A).token.state);
    const bAfter = actors.clone(actors.locate(host.room, host.refs.B).token.state);
    const cAfter = actors.clone(actors.locate(host.room, host.refs.C).token.state);
    const hAfter = actors.clone(actors.locate(host.room, host.refs.H).token.state);

    assert.equal(pcAfter.actionPoints.current, 2);
    assert.equal(pcAfter.tempActionPoints, 0); // 1 AP spent from tempActionPoints once
    assert.equal(pcAfter.mana.current, 10);
    assert.equal(pcAfter.tempMana, 1); // 2 Mana spent from tempMana (3 -> 1) once
    assert.equal(aAfter.currentHp, 17); // 30 + 4 temp - 17 = 17 HP, 0 temp
    assert.equal(aAfter.tempHealth, 0);
    assert.equal(bAfter.currentHp, 26); // 30 + 4 temp - 8 = 26 HP, 0 temp
    assert.equal(bAfter.tempHealth, 0);
    assert.equal(cAfter.currentHp, 30);
    assert.equal(hAfter.currentHp, 30);

    report.checks.areaExecution = {
      receipt,
      originalCommandReloadRecovery: originalCommand,
      sourceAfter: pcAfter,
      targetsAfter: { A: aAfter, B: bAfter, C: cAfter, H: hAfter }
    };
    save('area-owner-accepted.aria.yml', await dialog.ariaSnapshot());
    save('area-gm-accepted.aria.yml', await gm.locator('.actor-consequence-layer').ariaSnapshot());
    report.passed = true;
  } catch (e) {
    report.failure = e.stack;
    for (let i = 0; i < pages.length; i++) {
      save(`failure-${i}.aria.yml`, await pages[i].locator('body').ariaSnapshot().catch(() => 'unavailable'));
    }
    throw e;
  } finally {
    setProposalForTest(false);
    save('result.json', report);
    for (const c of contexts) await c.close();
    await host.stop();
  }
}

if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
