import { HERITAGE_TRADITIONS, CLASS_PROVENANCE, getClassNativeHeritageIds } from '../classHeritageRegistry';
import { getHeritageEdge } from '../heritageEdgeContract';

// The native roster is owned by classHeritageRegistry (widened to 81 native
// pairs per the 2026-10-03 creator decision). Every native pair must have an
// authored edge so no native path lacks a typed benefit/cost contract.
// Chaos Weaver native access is approved, but its mechanical edge remains
// explicitly pending under the RI-1 scope amendment.
const PENDING_NATIVE_EDGE_PAIRS = ['Chaos Weaver|drall_fexric', 'Gambler|merryn_human', 'Gambler|drall_fexric'];

test('every native class-heritage pair has an authored edge except the explicitly pending Chaos Weaver edge', () => {
  const missing = [];
  Object.entries(HERITAGE_TRADITIONS).forEach(([heritageId, row]) => {
    row.classes.forEach(className => {
      if (!getHeritageEdge(className, heritageId)) missing.push(`${className}|${heritageId}`);
    });
  });
  expect(missing.sort()).toEqual([...PENDING_NATIVE_EDGE_PAIRS].sort());
});

test('Chaos Weaver native access is registered while its mechanical edge and effects remain pending', () => {
  expect(getClassNativeHeritageIds('Chaos Weaver')).toEqual(['drall_fexric']);
  expect(getHeritageEdge('Chaos Weaver', 'drall_fexric')).toBeNull();
  expect(CLASS_PROVENANCE['Chaos Weaver'].heritageEffectsImplemented).toBe(false);
});

test('the roster has no duplicate native pair', () => {
  const seen = new Set();
  const dupes = [];
  Object.entries(HERITAGE_TRADITIONS).forEach(([heritageId, row]) => {
    row.classes.forEach(className => {
      const key = `${className}|${heritageId}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    });
  });
  expect(dupes).toEqual([]);
});

test('Gambler native trained access is separate from unimplemented mechanical heritage edges', () => {
  expect(getClassNativeHeritageIds('Gambler')).toEqual(['merryn_human', 'drall_fexric']);
  expect(CLASS_PROVENANCE.Gambler.heritageEffectsImplemented).toBe(false);
  expect(CLASS_PROVENANCE.Gambler.requirements).toEqual(['house_wager', 'initiation_survival', 'wager_discipline', 'finite_deck_training']);
  ['merryn_human', 'drall_fexric'].forEach(id => expect(getHeritageEdge('Gambler', id)).toBeNull());
  // 102 blueprint pairs + accepted RI-1 Chaos Weaver + two RI-2 Gambler pairs.
  expect(Object.values(HERITAGE_TRADITIONS).reduce((n, row) => n + row.classes.length, 0)).toBe(105);
});
