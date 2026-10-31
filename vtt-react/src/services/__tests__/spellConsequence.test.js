import { CLASS_DATA_MAP } from '../../data/classSpellGenerator';
import { getManagedSpellResourcePlan, normalizeManagedClassResource } from '../../data/classResourceContracts';
import { getPyroSpellResourcePlan, normalizePyroResource } from '../../data/pyrofiendResourceContract';
import { supportSpell, supportShape, readFormula, resolveOriginalSpell, planClassPayment, recordRoll, digitalRoll, buildApproval, planSpellCommand,
  spellReceipt, sha256Hex, definitionHash, typedClassValue, ownerRefusal, gmRefusal } from '../spellConsequence';

const stats = { strength: 12, agility: 11, constitution: 13, intelligence: 16, spirit: 14, charisma: 9 };
const spheres = list => ({ type: 'elementalSpheres', spheres: list });
const room = 'room-p9', map = 'map-a';
const pcRef = { kind: 'character', roomId: room, mapId: map, tokenId: 'pc', instanceId: 'i-pc', ownerUid: 'owner', characterId: 'char' };
const foeRef = { kind: 'creature', roomId: room, mapId: map, tokenId: 'foe', instanceId: 'i-foe' };
const pcToken = (extra = {}) => ({ id: 'pc', mapId: map, ownerUserId: 'owner', character: { id: 'char', name: 'Ilse', health: { current: 20, max: 40 }, mana: { current: 10, max: 30 },
  actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 3, tempActionPoints: 1, ...extra }, state: { actorContract: { version: 1, ...pcRef, revision: 4, primary: true } } });
const foeToken = () => ({ id: 'foe', mapId: map, creatureId: 'grimmstalk', state: { currentHp: 30, tempHealth: 4, maxHp: 250, actorContract: { version: 1, ...foeRef, revision: 7 } } });

describe('P9 S1 support adapter over authored class spells', () => {
  test('exactly the five positively validated spells are supported; everything else has a diagnostic', () => {
    const supported = [];
    for (const [cls, data] of Object.entries(CLASS_DATA_MAP)) {
      for (const spell of data.spells || []) {
        const resource = cls === 'Arcanoneer' ? spheres(['arcane', 'arcane']) : cls === 'Minstrel' ? { type: 'musicalNotes', notes: [1, 1, 1, 1, 1, 1, 1] }
          : cls === 'Martyr' ? { type: 'devotionGauge', damage: 62, spentLevels: 2 } : undefined;
        const result = supportSpell(spell, { class: cls, classResource: resource, stats });
        if (result.supported) supported.push(spell.id);
        else expect(typeof result.reason).toBe('string');
      }
    }
    expect(supported.sort()).toEqual(['arc_spark_bolt', 'martyr_restorative_prayer', 'minstrel_harmonic_strike', 'minstrel_opening_chord', 'minstrel_resolving_strike']);
  });
  test('original definition only: slot copies resolve by ID; formulations, weapon and library actions stay manual', () => {
    expect(resolveOriginalSpell('Arcanoneer', 'arc_spark_bolt').name).toBe('Marrow-Piercing Slug');
    expect(resolveOriginalSpell('Arcanoneer (Prismatic)', 'arc_spark_bolt')).not.toBeNull();
    expect(supportSpell({ id: 'arcane_arcane' }, { class: 'Arcanoneer', stats }).supported).toBe(false);
    expect(supportSpell({ id: 'mh_standard_attack' }, { class: 'Martyr', stats }).reason).toMatch(/weapon actions stay manual/);
    expect(supportSpell({ id: 'arc_spark_bolt' }, { class: 'Martyr', stats }).supported).toBe(false);
    const original = resolveOriginalSpell('Arcanoneer', 'arc_spark_bolt');
    const resource = { type: 'elementalSpheres', spheres: ['arcane', 'arcane'] };
    expect(supportSpell({ ...original, manaCost: 4, damageFormula: '1d8 + intelligence/4' }, { class: 'Arcanoneer', classResource: resource, stats }).supported).toBe(true);
    expect(supportSpell({ ...original, damageConfig: { ...original.damageConfig, formula: '3d8' } }, { class: 'Arcanoneer', classResource: resource, stats }).reason).toMatch(/differ from the authored original/);
  });
  test('conflicting encodings, saves, crits, AoE and DOT are manual with precise reasons', () => {
    const arc = id => resolveOriginalSpell('Arcanoneer', id);
    expect(supportShape(arc('arc_arcane_missile')).reason).toMatch(/autoHit/);
    expect(planClassPayment({ ...arc('arc_arcane_missile'), damageConfig: { formula: '1d8', damageTypes: ['storm'], resolution: 'DICE' } }, spheres(['arcane', 'ember', 'sacred']), 'Arcanoneer').reason)
      .toMatch(/Sphere recipe encodings disagree/);
    expect(supportShape(arc('arc_fire_bolt')).reason).toMatch(/propagation/);
    expect(supportShape(resolveOriginalSpell('Martyr', 'martyr_penitent_rebuke')).reason).toMatch(/savingThrow/);
    expect(supportShape(resolveOriginalSpell('Minstrel', 'minstrel_resolving_strike')).supported).toBe(true);
    const resolving = resolveOriginalSpell('Minstrel', 'minstrel_resolving_strike');
    expect(planClassPayment(resolving, { type: 'musicalNotes', notes: [2, 0, 0, 0, 2, 0, 0] }, 'Minstrel').classPayment.price).toEqual({ costs: ['I', 'V'], gains: [] });
    // Only the approved resolver recipe executes; altered recipes and other cadences stay manual.
    expect(planClassPayment({ ...resolving, musicalCombo: { ...resolving.musicalCombo, requires: [{ note: 'I', count: 2 }] } }, { type: 'musicalNotes', notes: [2, 0, 0, 0, 2, 0, 0] }, 'Minstrel').reason).toMatch(/approved recipe/);
    expect(planClassPayment({ ...resolving, id: 'minstrel_other_resolver' }, { type: 'musicalNotes', notes: [2, 0, 0, 0, 2, 0, 0] }, 'Minstrel').reason).toMatch(/outside the approved P9 pair/);
  });
});

describe('P9 S2 approved formula vocabulary', () => {
  test('resolver exception accepts only the executable recipe; unsupported metadata, secondary effects and non-recipe encodings refuse', () => {
    const resolving = resolveOriginalSpell('Minstrel', 'minstrel_resolving_strike');
    const bank = { type: 'musicalNotes', notes: [2, 0, 0, 0, 1, 0, 0] };
    expect(resolving.resourceCost.resourceValues.classResource.cost).toBe(3);
    expect(planClassPayment(resolving, bank, 'Minstrel').classPayment.price.costs).toEqual(['I', 'V']);
    for (const changed of [
      { ...resolving, unknownMetadata: true },
      { ...resolving, effectTypes: ['damage', 'debuff'] },
      { ...resolving, damageConfig: { ...resolving.damageConfig, secondaryEffect: 'stunned' } },
    ]) expect(supportShape(changed).supported).toBe(false);
    for (const changed of [
      { ...resolving, musicalCombo: { ...resolving.musicalCombo, generates: [{ note: 'I', count: 1 }] } },
      { ...resolving, resourceCost: { ...resolving.resourceCost, notes: [{ note: 'I', count: 1 }] } },
      { ...resolving, resourceCost: { ...resolving.resourceCost, classResource: { type: 'musical_notes', cost: 2, resolvesCadence: true } } },
      ...[{ note_I: -1 }, { devotion_cost: 1 }, { ember_sphere: 1 }].map(extra => ({ ...resolving, resourceCost: { ...resolving.resourceCost, resourceValues: { ...resolving.resourceCost.resourceValues, ...extra } } })),
      ...[{ resolvesCadence: false }, { bonus: true }, { gain: 1 }].map(extra => ({ ...resolving, resourceCost: { ...resolving.resourceCost, resourceValues: { ...resolving.resourceCost.resourceValues, classResource: { ...resolving.resourceCost.resourceValues.classResource, ...extra } } } })),
    ]) expect(planClassPayment(changed, bank, 'Minstrel').supported).toBe(false);
  });
  test('bare attribute is the score; division rounds down; never the dynamic evaluator reading', () => {
    expect(readFormula('1d8 + intelligence/4', { intelligence: 16 })).toMatchObject({ supported: true, dice: [{ count: 1, sides: 8 }], constant: 4 });
    expect(readFormula('1d8 + intelligence/4', { intelligence: 15 }).constant).toBe(3);
    expect(readFormula('1d4 + spirit', { spirit: 14 }).constant).toBe(14);
  });
  test('explicit modifier tokens read the modifier; abbreviations and other operators are refused', () => {
    expect(readFormula('2d6 + strength_modifier', { strength: 15 }).constant).toBe(2);
    expect(readFormula('2d6 + agilitymod - 1', { agility: 7 }).constant).toBe(-3);
    for (const formula of ['1d8 + int', '1d8 + str', '1d8 + agi', '1d8 + con', '1d8 + spi', '1d8 + cha', '1d8 + wis', '1d8 + dex', '1d8 + intellect', '1d8 + int/4', '1d8 + intmod']) {
      expect(readFormula(formula, stats)).toMatchObject({ supported: false });
    }
    expect(readFormula('12d8 + agility * 2', stats).supported).toBe(false);
    expect(readFormula('(maxHealth - currentHealth) / 4', stats).supported).toBe(false);
    expect(readFormula('50% max_hp', stats).supported).toBe(false);
    expect(readFormula('5', stats).reason).toMatch(/at least one die/);
    expect(readFormula('1d8 + spirit', { spirit: NaN }).supported).toBe(false);
  });
});

describe('P9 S4 class-owned payment (unchanged planners, typed results)', () => {
  test('Marrow-Piercing Slug spends exactly two Arcane spheres through the bank contract', () => {
    const payment = planClassPayment(resolveOriginalSpell('Arcanoneer', 'arc_spark_bolt'), spheres(['ember', 'arcane', 'storm', 'arcane']), 'Arcanoneer');
    expect(payment.classPayment).toEqual({ domain: 'elementalSpheres', before: spheres(['ember', 'arcane', 'storm', 'arcane']), after: spheres(['ember', 'storm']), price: { costs: ['arcane', 'arcane'], gains: [] } });
    expect(planClassPayment(resolveOriginalSpell('Arcanoneer', 'arc_spark_bolt'), spheres(['arcane', 'ember']), 'Arcanoneer').affordable).toBe(false);
  });
  test('Minstrel Opening Chord gains exactly I, I and V (no generic three notes)', () => {
    const payment = planClassPayment(resolveOriginalSpell('Minstrel', 'minstrel_opening_chord'), { type: 'musicalNotes', notes: [0, 0, 0, 0, 5, 0, 0] }, 'Minstrel');
    expect(payment.classPayment.price).toEqual({ costs: [], gains: ['I', 'I', 'V'] });
    expect(payment.classPayment.after.notes).toEqual([2, 0, 0, 0, 5, 0, 0]);
  });
  test('Minstrel pair: empty → Opening Chord I2/V1 → Resolving Strike I1; wrong pitches refuse; effective Spirit score', () => {
    const minstrel = notes => ({ class: 'Minstrel', classResource: { type: 'musicalNotes', notes }, stats, baseStats: { ...stats, spirit: 11 } });
    const opening = supportSpell({ id: 'minstrel_opening_chord' }, minstrel([0, 0, 0, 0, 0, 0, 0]));
    expect(opening).toMatchObject({ supported: true, price: { ap: 1, mana: 4 }, payment: { affordable: true, classPayment: { after: { notes: [2, 0, 0, 0, 1, 0, 0] }, price: { costs: [], gains: ['I', 'I', 'V'] } } } });
    const resolving = supportSpell({ id: 'minstrel_resolving_strike' }, minstrel(opening.payment.classPayment.after.notes));
    expect(resolving).toMatchObject({ supported: true, price: { ap: 1, mana: 4 }, payment: { affordable: true, classPayment: { after: { notes: [1, 0, 0, 0, 0, 0, 0] }, price: { costs: ['I', 'V'], gains: [] } } } });
    expect(resolving.reading.dice).toEqual([{ count: 1, sides: 8 }]);
    for (const notes of [[2, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]) expect(supportSpell({ id: 'minstrel_resolving_strike' }, minstrel(notes)).payment.affordable).toBe(false);
  });
  test('Martyr spent ledger: spending records spent levels; Restorative Prayer gain restores spent first, once', () => {
    const ledger = normalizeManagedClassResource({ type: 'devotionGauge', damage: 62, spentLevels: 2 }, 'Martyr');
    expect(ledger).toMatchObject({ current: 2, spentLevels: 2, damage: 62 });
    const payment = planClassPayment(resolveOriginalSpell('Martyr', 'martyr_restorative_prayer'), ledger, 'Martyr');
    expect(payment.classPayment.price).toEqual({ cost: 0, gain: 1, required: 0 });
    expect(payment.classPayment.after).toMatchObject({ current: 3, spentLevels: 1, bonusLevels: 0, damage: 62, earnedLevels: 4 });
    expect(typedClassValue(ledger, 'Martyr', 'devotionGauge')).toEqual(payment.classPayment.before);
  });
  test('Pyrofiend payments stay manual and the peak/latch planner is not invoked or altered by P9', () => {
    for (const spell of CLASS_DATA_MAP.Pyrofiend.spells) {
      const result = supportSpell(spell, { class: 'Pyrofiend', classResource: { type: 'infernoVeil', current: 8 }, stats });
      expect(result.supported).toBe(false);
    }
    // The owning planner still computes the peak before the vent: 8 → 9 → lower latches.
    const veil = normalizePyroResource({ type: 'infernoVeil', current: 8 });
    const spell = { infernoAscend: 1, infernoDescend: 3, resourceCost: { resourceValues: {} } };
    const plan = getManagedSpellResourcePlan(spell, veil, 'Pyrofiend');
    expect(plan).toMatchObject({ handled: true, transition: 'infernoVeil' });
    expect(plan.nextResource.debtCall.latched).toBe(true);
    expect(getPyroSpellResourcePlan(spell, veil, 'infernoVeil').nextResource.debtCall.latched).toBe(true);
  });
});

describe('P9 S3/S5 approval and GM command preparation', () => {
  const ilse = { class: 'Arcanoneer', classResource: spheres(['arcane', 'arcane', 'ember']), stats };
  const support = supportSpell({ id: 'arc_spark_bolt' }, ilse);
  const roll = recordRoll('physical', support.reading, [[6]]);
  const approval = buildApproval({ support, tokens: [pcToken(), foeToken()], sourceRef: pcRef, targetRef: foeRef, roomId: room, mapId: map, actionEpoch: 'epoch', baseCommitSequence: 3, roll, approvalId: '00000000-0000-4000-8000-000000000001' });
  test('approval pins definition hash, roll, temp-inclusive price and typed class result', () => {
    expect(roll).toEqual({ mode: 'physical', dice: [{ sides: 8, faces: [6] }], constant: 4, total: 10, reading: support.reading.reading });
    expect(approval.spell.definitionHash).toBe(definitionHash(resolveOriginalSpell('Arcanoneer', 'arc_spark_bolt')));
    expect(approval.price).toEqual({ ap: 1, mana: 4 });
    expect(approval.classPayment.after).toEqual(spheres(['ember']));
    expect(() => buildApproval({ support, tokens: [pcToken({ mana: { current: 0, max: 30 }, tempMana: 3 }), foeToken()], sourceRef: pcRef, targetRef: foeRef, roomId: room, mapId: map, actionEpoch: 'e', baseCommitSequence: 3, roll, approvalId: 'x' })).toThrow(/Insufficient/);
    expect(() => buildApproval({ support, tokens: [pcToken()], sourceRef: pcRef, targetRef: foeRef, roomId: room, mapId: map, actionEpoch: 'e', baseCommitSequence: 3, roll, approvalId: 'x' })).toThrow(/missing or retired/);
  });
  test('GM command spends temporary pools first and applies the GM final amount to the exact target once', () => {
    const plan = planSpellCommand({ approval, contentHash: 'a'.repeat(64), tokens: [pcToken(), foeToken()], roomId: room, mapId: map, finalAmount: 7, reason: 'Durability bypass ruled 3 lower', adjudicated: true });
    expect(plan.entries).toEqual([
      { ref: pcRef, expectedRevision: 4, finalResources: { ap: { current: 2, temp: 0 }, mana: { current: 9, temp: 0 } }, classPayment: { mode: 'spell', domain: 'elementalSpheres', approvalHash: 'a'.repeat(64) } },
      { ref: foeRef, expectedRevision: 7, finalResources: { hp: { current: 27, temp: 0 } } }]);
    expect(JSON.parse(plan.extra.adjudication.chosenResult)).toMatchObject({ capability: 'p9-spell:v1', approvalId: approval.approvalId, roll, gmConfirmed: true });
    expect(() => planSpellCommand({ approval, contentHash: 'a'.repeat(64), tokens: [pcToken(), foeToken()], roomId: room, mapId: map, finalAmount: 7, reason: '', adjudicated: true })).toThrow(/Explain/);
    expect(() => planSpellCommand({ approval, contentHash: 'a'.repeat(64), tokens: [pcToken(), foeToken()], roomId: room, mapId: map, finalAmount: NaN, adjudicated: true })).toThrow(/whole/);
    expect(() => planSpellCommand({ approval, contentHash: 'a'.repeat(64), tokens: [pcToken(), foeToken()], roomId: room, mapId: map, finalAmount: 10, adjudicated: false })).toThrow(/adjudicate/);
  });
  test('self-targeted healing is one actor entry; healing caps at maximum and keeps temporary HP', () => {
    const martyr = { class: 'Martyr', classResource: { type: 'devotionGauge', damage: 62, spentLevels: 2 }, stats };
    const healing = supportSpell({ id: 'martyr_restorative_prayer' }, martyr);
    const healRoll = recordRoll('digital', healing.reading, [[3]]);
    const heal = buildApproval({ support: healing, tokens: [pcToken({ tempHealth: 2 })], sourceRef: pcRef, targetRef: pcRef, roomId: room, mapId: map, actionEpoch: 'e', baseCommitSequence: 3, roll: healRoll, approvalId: '00000000-0000-4000-8000-000000000002' });
    const plan = planSpellCommand({ approval: heal, contentHash: 'b'.repeat(64), tokens: [pcToken({ tempHealth: 2 })], roomId: room, mapId: map, finalAmount: 30, reason: 'Ruled overheal capped', adjudicated: true });
    expect(plan.entries).toHaveLength(1);
    expect(plan.entries[0].finalResources).toEqual({ ap: { current: 2, temp: 0 }, mana: { current: 8, temp: 0 }, hp: { current: 40, temp: 2 } });
  });
  test('digital roll uses one random draw per die; physical faces are bounded', () => {
    const calls = [];
    const value = digitalRoll(support.reading, () => { calls.push(1); return 0.99; });
    expect(calls).toHaveLength(1); expect(value.total).toBe(12);
    expect(() => recordRoll('physical', support.reading, [[9]])).toThrow(/1 to 8/);
  });
  test('receipt parsing requires the owner-approval authorization bound to the same approval', () => {
    const plan = planSpellCommand({ approval, contentHash: 'a'.repeat(64), tokens: [pcToken(), foeToken()], roomId: room, mapId: map, finalAmount: 10, adjudicated: true });
    const receipt = { version: 1, roomId: room, commandId: 'c', acceptedAt: 1, checkpointRevision: null, source: pcRef, target: foeRef, adjudication: plan.extra.adjudication,
      authorization: { kind: 'owner-approval-gm', proposalId: approval.approvalId }, actors: [{ ref: pcRef }, { ref: foeRef }] };
    expect(spellReceipt({ success: true, receipt })).toMatchObject({ approvalId: approval.approvalId, status: 'live-only' });
    expect(spellReceipt({ success: true, receipt: { ...receipt, authorization: { kind: 'gm' } } })).toBeNull();
  });
  test('repair B2: only a first-submission refusal may say no payment was recorded', () => {
    expect(ownerRefusal(true, 'class_home_required')).toMatchObject({ phase: 'refused', message: expect.stringMatching(/no payment was recorded/) });
    for (const [first, code] of [[false, 'class_home_required'], [false, 'retry_window_expired'], [true, 'retry_window_expired'], [true, 'approval_consumed'], [false, 'approval_consumed']]) {
      const outcome = ownerRefusal(first, code);
      expect(outcome.phase).toBe('unresolved'); expect(outcome.message).not.toMatch(/no payment was recorded/);
    }
    expect(gmRefusal(false, 'stale_actor_revision').phase).toBe('retry');
    for (const [retry, code] of [[true, 'stale_actor_revision'], [true, 'invalid_consequence'], [false, 'retry_window_expired']]) {
      const outcome = gmRefusal(retry, code);
      expect(outcome.phase).toBe('unresolved'); expect(outcome.message).not.toMatch(/nothing was applied/);
    }
    expect(() => buildApproval({ support, tokens: [pcToken(), foeToken()], sourceRef: pcRef, targetRef: foeRef, roomId: room, mapId: map, actionEpoch: 'e', roll, approvalId: 'x' })).toThrow(/commit sequence/);
  });
  test('repair N3: a missing class resource is a manual diagnostic, never an exception', () => {
    expect(supportSpell({ id: 'martyr_restorative_prayer' }, { class: 'Martyr', classResource: undefined, stats }).supported).toBe(false);
  });
  test('synchronous SHA-256 matches the standard digest', () => {
    expect(sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(sha256Hex('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });
});
