'use strict';
// Verification inputs only. No alternate payment planner or production implementation.
const pair = Object.freeze([
  { id: 'minstrel_opening_chord', name: 'Opening Chord', level: 1, ap: 1, mana: 4,
    formula: '1d6', rangeFeet: 60, cooldown: 0, face: 3,
    beforeNotes: [0, 0, 0, 0, 0, 0, 0], afterNotes: [2, 0, 0, 0, 1, 0, 0] },
  { id: 'minstrel_resolving_strike', name: 'Resolving Strike', level: 3, ap: 1, mana: 4,
    formula: '1d8 + spirit', rangeFeet: 40, cooldown: 0, face: 5,
    beforeNotes: [2, 0, 0, 0, 1, 0, 0], afterNotes: [1, 0, 0, 0, 0, 0, 0] }
]);
const cases = [
  { id: 'empty-builder-resolver', ap: 2, mana: 8, notes: [0,0,0,0,0,0,0], expected: 'two atomic accepts; AP0/mana0/I1; two receipts' },
  { id: 'wrong-pitch', spell: pair[1].id, ap: 2, mana: 8, notes: [2,1,0,0,0,0,0], expected: 'refuse; same total count is insufficient without V; no mutation' },
  { id: 'insufficient-ap', spell: pair[1].id, ap: 0, mana: 8, notes: [2,0,0,0,1,0,0], expected: 'refuse without any payment/outcome' },
  { id: 'insufficient-mana', spell: pair[1].id, ap: 2, mana: 3, notes: [2,0,0,0,1,0,0], expected: 'refuse without any payment/outcome' },
  { id: 'empty-resolver', spell: pair[1].id, ap: 2, mana: 8, notes: [0,0,0,0,0,0,0], expected: 'refuse without any payment/outcome' },
  { id: 'stale-bank', notes: [2,0,0,0,1,0,0], concurrentNotes: [1,0,0,0,1,0,0], expected: 'prepare/approve free; legitimate separate accepted bank change invalidates old approval; retain roll/custody; fresh explicit approval required' },
  { id: 'lost-ack-duplicate', expected: 'drop only acceptance ACK; Check same command twice; identical commandId, one receipt/payment/outcome/narration' },
  { id: 'effective-spirit-score', expected: 'production combatAttributes spirit differs from raw/base and modifier; d8 + effective score, never raw/base/modifier or twice-earned' },
  { id: 'failed-install', expected: 'force registered fixture installer refusal before commit; AP/mana/notes/HP/receipt remain unchanged; retain recovery evidence' }
];
function character({ ap = 2, mana = 8, notes = [0,0,0,0,0,0,0] } = {}) {
  // Same existing P9 fixture identity. Apply only during fixture construction BEFORE actor_bind.
  // Use production combatAttributes for the expected effective score; no guessed modifier arithmetic.
  const baseStats = { strength: 5, agility: 5, constitution: 5, intelligence: 5, spirit: 15, charisma: 5 };
  return { id: 'ilse', name: 'Ilse Minstrel witness', class: 'Minstrel', level: 3,
    race: 'vreken', subrace: 'clean_vreken', background: 'sanctuarySeneschal',
    statsModel: 'base+earned@1', baseStats, stats: { ...baseStats, spirit: 16 },
    levelUpHistory: { 2: { attributes: ['spirit'] } },
    class_spells: { known_spells: pair.map(p => p.id) },
    health: { current: 20, max: 40 }, mana: { current: mana, max: 30 },
    actionPoints: { current: ap, max: 5 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0,
    classResource: { type: 'musicalNotes', notes: [...notes], current: notes.reduce((a,b) => a+b,0), max: 35, maxPerNote: 5, totalNotes: 7 } };
}
module.exports = { pair, cases, character, excluded: ['Harmony Strike', 'Harmonic Strike', 'Arcane Missile'] };
