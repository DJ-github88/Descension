import { HERITAGE_TRADITIONS } from '../classHeritageRegistry';
import { getHeritageEdge } from '../heritageEdgeContract';

// The native roster is owned by classHeritageRegistry (widened to 81 native
// pairs per the 2026-10-03 creator decision). Every native pair must have an
// authored edge so no native path lacks a typed benefit/cost contract.
test('every native class-heritage pair has an authored edge', () => {
  const missing = [];
  Object.entries(HERITAGE_TRADITIONS).forEach(([heritageId, row]) => {
    row.classes.forEach(className => {
      if (!getHeritageEdge(className, heritageId)) missing.push(`${className}|${heritageId}`);
    });
  });
  expect(missing).toEqual([]);
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
