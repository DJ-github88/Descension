import fs from 'fs';
import path from 'path';
import { supportStrike, strictWeaponType, buildApproval, recordFaces, digitalRoll, derive, classifyDefenses, proficiencyChoice, planStrikeCommand, acceptedText, RANK_DIE, DAMAGE_TYPES, FIXED_TEXT, STRIKE_AP } from '../weaponStrike';
const ref = (kind, tokenId) => ({ kind, roomId: 'room', mapId: 'map', tokenId, instanceId: `${tokenId}-incarnation`, ...(kind === 'character' ? { ownerUid: 'owner', characterId: 'ilse' } : {}) });
const source = ref('character', 'pc'), target = ref('creature', 'foe');
const sword = { id: 'sword', name: 'Iron sword', subtype: 'SWORD', weaponStats: { baseDamage: { diceCount: 1, diceType: 'd8', damageType: 'slicing' } } };
const character = { equipment: { mainHand: sword }, stats: { strength: 14, agility: 16 }, skillRanks: { weaponMastery: 'MASTER', weaponMastery_sword: 'TRAINED', weaponMastery_bow: 'NOVICE' } };
const approve = (faces = [6]) => buildApproval({ support: supportStrike({ id: 'mh_standard_attack' }, character), source, target, actionEpoch: 'epoch', baseCommitSequence: 0,
  approvalId: '00000000-0000-4000-8000-000000000001', roll: recordFaces('physical', 8, faces), proficiencyRoll: recordFaces('physical', 8, [5], true) });
const foe = { id: 'foe', mapId: 'map', creatureId: 'known', state: { actorContract: { version: 1, ...target, revision: 0 }, currentHp: 30, tempHealth: 4, conditions: [] } };
const pc = { id: 'pc', mapId: 'map', ownerUserId: 'owner', character: { id: 'ilse', name: 'Ilse', actionPoints: { current: 2 }, tempActionPoints: 1 }, state: { actorContract: { version: 1, ...source, revision: 0, primary: true } } };
const defenses = (options = {}) => classifyDefenses({ approval: approve(), target: foe, loaded: { resistances: {} }, bundled: { resistances: {} }, ...options });
test('only exact basic producers route; single die/unarmed, strict type and separate ranks', () => {
  for (const id of ['mh_standard_attack', 'universal_attack']) expect(supportStrike({ id }, character).proficiency).toMatchObject({ rank: 'TRAINED', die: 8, table: 'sword' });
  const ranged = supportStrike({ id: 'ranged_standard_attack' }, { ...character, equipment: { ranged: { ...sword, subtype: 'BOW' } } });
  expect(ranged.weapon).toMatchObject({ attribute: 'agility', modifier: 3 }); expect(ranged.proficiency).toMatchObject({ rank: 'NOVICE', die: 6 });
  expect(supportStrike({ id: 'mh_standard_attack' }, { ...character, equipment: {} }).weapon).toMatchObject({ itemId: null, die: 4, weaponType: 'unarmed', damageType: 'smashing' });
  for (const id of ['mh_special', 'oh_standard_attack', 'arc_spark_bolt', 'riposte']) expect(supportStrike({ id }, character).supported).toBe(false);
  expect(strictWeaponType({ subtype: 'mystery' })).toBeNull();
  const unmapped = { ...character, equipment: { mainHand: { ...sword, subtype: 'unknown' } } };
  expect(supportStrike({ id: 'mh_standard_attack' }, unmapped).needsType).toBe(true);
  expect(supportStrike({ id: 'mh_standard_attack' }, unmapped, 'axe').weapon.typeSource).toBe('owner');
  expect(supportStrike({ id: 'mh_standard_attack' }, { ...character, equipment: { mainHand: { ...sword, weaponStats: { baseDamage: { diceCount: 2, diceType: 'd8' } } } } }).supported).toBe(false);
});
test('physical/digital parity: miss, hit, critical chains and bounded continuations', () => {
  const values = [.99, .99, .26]; const roll = digitalRoll(8, false, () => values.shift());
  expect(roll.faces).toEqual([8, 8, 3]); expect(recordFaces('physical', 8, roll.faces).faces).toEqual(roll.faces);
  expect(derive(approve().weapon, roll)).toEqual({ rollOutcome: 'critical', proposed: 19 });
  expect(derive(approve().weapon, { faces: [1] })).toEqual({ rollOutcome: 'miss', proposed: 0 });
  expect(derive(approve().weapon, { faces: [6] })).toEqual({ rollOutcome: 'hit', proposed: 8 });
  for (const faces of [[8], [8, 8], [3, 8], [1, 2]]) expect(() => recordFaces('physical', 8, faces)).toThrow();
  expect(recordFaces('physical', 8, Array(20).fill(8)).faces).toHaveLength(20);
  expect(digitalRoll(6, true, () => .99).faces).toEqual([6]);
});
test('published defense tiers and rounding; off-tier/all/material/edit/custom/prose remain explicit', () => {
  const bundled = { resistances: { slicing: 25 } }, loaded = bundled;
  expect(defenses({ bundled, loaded })).toMatchObject({ automated: { kind: 'resistance', percent: 25 }, afterDefense: 6 });
  expect(defenses({ bundled: { vulnerabilities: { slicing: 50 } }, loaded: { vulnerabilities: { slicing: 50 } } }).afterDefense).toBe(12);
  for (const resistances of [{ slicing: 75 }, { slicing: 25, all: 25 }, { iron: 50 }]) {
    const result = defenses({ bundled: { resistances }, loaded: { resistances } }); expect(result.manual.length).toBeGreaterThan(0);
  }
  expect(defenses({ bundled, loaded: { resistances: { slicing: 50 } } }).automated).toBeNull();
  expect(defenses({ bundled: null, loaded: { resistances: { slicing: 25 } } }).manual[0].source).toBe('custom');
  expect(defenses({ abilities: [{ name: 'Secret ward', description: 'Immune to slicing' }] }).manual[0]).toMatchObject({ source: 'ability', name: 'Secret ward' });
});
test('flat DR is separate from armor; critical and combined DR stay GM-adjudicated', () => {
  const targetWithDR = { ...foe, state: { ...foe.state, conditions: [{ id: 'dr', name: 'Ward', effects: { damageReduction: 3, armor: 99 } }] } };
  expect(defenses({ target: targetWithDR })).toMatchObject({ automated: { kind: 'flatDr', amount: 3 }, afterDefense: 5 });
  const critical = defenses({ approval: approve([8, 3]), target: targetWithDR });
  expect(critical.automated).toBeNull(); expect(critical.manual[0].text).toContain('armor bypass is not a flat-DR rule');
  expect(critical.obsolete[0]).toContain('obsolete');
  const tier = { resistances: { slicing: 25 } };
  expect(defenses({ target: targetWithDR, loaded: tier, bundled: tier }).manual[0].source).toBe('condition');
  for (const damageReduction of [-1, 1.5, 1001, '3']) expect(defenses({ target: { ...foe, state: { ...foe.state, conditions: [{ id: 'dr', effects: { damageReduction } }] } } }).manual).toHaveLength(1);
});
test('manual proficiency never inferred or added; complete outcome and public category-only defense record', () => {
  expect(() => proficiencyChoice('sword', '')).toThrow();
  const choice = proficiencyChoice('sword', '18'), approval = approve();
  const defense = defenses({ abilities: [{ name: 'Secret ward', description: 'Immune to slicing' }] });
  const plan = planStrikeCommand({ approval, contentHash: 'hash', tokens: [pc, foe], defense, choice, verdict: 'not-applicable', finalAmount: 8 });
  expect(plan.entries[0].finalResources.ap).toEqual({ current: 1, temp: 0 });
  expect(plan.entries[1].finalResources.hp).toEqual({ current: 26, temp: 0 });
  const recorded = JSON.parse(plan.extra.adjudication.chosenResult);
  expect(recorded.proficiency.text).toBe(getText('sword', 18)); expect(recorded.defense.manual).toEqual(['ability']);
  expect(plan.extra.adjudication.chosenResult).not.toMatch(/Secret ward|Immune to slicing|skillRanks/);
  const result = { receipt: { authorization: { kind: 'owner-approval-gm' }, ...plan.extra } };
  expect(acceptedText(result)).toContain('Not applied by the VTT: Face 18'); expect(acceptedText(result)).toContain(choice.text);
  expect(() => planStrikeCommand({ approval, contentHash: 'hash', tokens: [pc, foe], defense, choice, finalAmount: 9 })).toThrow();
});
function getText(type, face) { return proficiencyChoice(type, String(face)).text; }
test('server and client frozen constants are byte-equal', () => {
  const server = fs.readFileSync(path.resolve(process.cwd(), '../server/services/strikeApprovals.js'), 'utf8');
  for (const [name, value] of Object.entries({ RANK_DIE, DAMAGE_TYPES, FIXED_TEXT })) {
    const expression = server.match(new RegExp(`const ${name} = Object.freeze\\(([\\s\\S]*?)\\);`))[1];
    // These are fixed checked-in literals; no production server imports into the client bundle.
    expect(Function(`return (${expression})`)()).toEqual(value); // eslint-disable-line no-new-func
  }
  expect(Number(server.match(/const STRIKE_AP = (\d+)/)[1])).toBe(STRIKE_AP);
});
