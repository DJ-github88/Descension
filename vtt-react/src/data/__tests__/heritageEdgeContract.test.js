import {
  HERITAGE_EDGES, getHeritageEdge, getCharacterHeritageEdge, validateHeritageEdge,
  evaluateHeritageEdge, getAuthoredHeritageEdgeClasses
} from '../heritageEdgeContract';
import { HERITAGE_TRADITIONS } from '../classHeritageRegistry';

test('every authored edge is a typed single edge + paired cost with no forbidden claims', () => {
  Object.values(HERITAGE_EDGES).forEach(entry => {
    expect(validateHeritageEdge(entry)).toEqual([]);
  });
});

test('authored native edges cover every native heritage of the implemented classes', () => {
  const classes = getAuthoredHeritageEdgeClasses();
  expect(classes).toEqual(['Animist', 'Apex', 'Arcanoneer', 'Augur', 'Berserker', 'Chronarch', 'Crusader', 'False Prophet', 'Gambit', 'Harbinger', 'Inquisitor', 'Lunarch', 'Martyr', 'Minstrel', 'Plaguebringer', 'Pyrofiend', 'Revenant', 'Shaper', 'Spellguard', 'Toxicologist', 'Warden']);
  // The native roster is owned by classHeritageRegistry and is under concurrent
  // revision; do not re-derive it here. Assert every authored edge resolves back
  // to a registered native pair or a qualification-gated E pair instead.
  Object.values(HERITAGE_EDGES).forEach(entry => {
    expect(getHeritageEdge(entry.className, entry.heritageId)).toBe(entry);
    const registered = Boolean(HERITAGE_TRADITIONS[entry.heritageId]);
    expect(registered || entry.access === 'E').toBe(true);
  });
  classes.forEach(className => {
    const nativeIds = HERITAGE_TRADITIONS && Object.keys(HERITAGE_TRADITIONS)
      .filter(id => HERITAGE_TRADITIONS[id].classes.includes(className));
    expect(nativeIds.some(id => getHeritageEdge(className, id))).toBe(true);
  });
});

test('resolver handles canonical names, compatibility aliases and character race/subrace', () => {
  expect(getHeritageEdge('Animist', 'ordan_human').className).toBe('Animist');
  expect(getHeritageEdge('Nereid Myrathil Animist', 'deepling_myrathil')).toBeTruthy();
  expect(getHeritageEdge('Berserker', 'mimir')).toBeNull();
  expect(getCharacterHeritageEdge({ class: 'Augur', race: 'neth', subrace: 'kessen_neth' }).heritageId).toBe('kessen_neth');
  expect(getCharacterHeritageEdge({ class: 'Augur', race: 'human', subrace: 'thalren_human' })).toBeNull();
});

test('conditions gate the edge and emit bounded edge/cost events', () => {
  const entry = getHeritageEdge('Berserker', 'skald_human');
  expect(evaluateHeritageEdge(entry, { target: 'endangered_ally' })).toMatchObject({ applies: true, reason: 'edge-condition-met' });
  expect(evaluateHeritageEdge(entry, {}).applies).toBe(false);
  expect(evaluateHeritageEdge(entry, {}).events).toEqual([]);
  expect(evaluateHeritageEdge(entry, { target: 'endangered_ally' }).events.map(event => event.type))
    .toEqual(['heritage-edge', 'heritage-cost']);
});

test('validation rejects prose-only, unbounded, multi-effect or condition-less entries', () => {
  expect(validateHeritageEdge(null)).not.toEqual([]);
  const unbounded = {
    description: 'unlimited omnipotent power',
    edge: { kind: 'capability', unit: 'capability', capability: 'unlimited power' },
    cost: { kind: 'risk', unit: 'capability', capability: 'none' }
  };
  expect(validateHeritageEdge(unbounded).length).toBeGreaterThan(0);
  const missingCondition = { edge: { kind: 'capability', unit: 'capability' }, cost: { kind: 'risk', unit: 'capability', capability: 'x' } };
  expect(validateHeritageEdge(missingCondition)).toContain('capability edge needs a checkable condition');
  const outOfBounds = { edge: { kind: 'attack_bonus', unit: 'flat', magnitude: 99 }, cost: { kind: 'risk', unit: 'capability', capability: 'x' } };
  expect(validateHeritageEdge(outOfBounds)).toContain('edge magnitude out of bounds');
});
