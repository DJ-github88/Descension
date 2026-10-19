import { MARTYR_DATA } from '../../data/classes/martyrData';
import { radiantPreviewProfile, circleCellOverlap, occupiedPreviewCells, visibleAreaCandidates } from '../areaPreview';

const original = () => JSON.parse(JSON.stringify(MARTYR_DATA.spells.find(s => s.id === 'martyr_radiant_burst')));
test('only the exact original circle/channel is modeled; no defaults for missing, malformed or changed data', () => {
  const action = original(), before = JSON.stringify(action);
  for (const effect of ['damage', 'healing']) expect(radiantPreviewProfile(action, effect)).toMatchObject({ effect, radiusFeet: 10, rangeFeet: 20 });
  expect(JSON.stringify(action)).toBe(before);
  for (const value of [undefined, 0, -1, NaN, Infinity, '10']) {
    const altered = original(); altered.effectTargeting.damage.aoeParameters.radius = value;
    expect(radiantPreviewProfile(altered, 'damage').error).toMatch(/missing or malformed/);
  }
  const changed = original(); changed.targetingConfig.aoeParameters.radius = 11;
  expect(radiantPreviewProfile(changed, 'damage').error).toMatch(/conflicting/);
  const chain = original(); chain.propagation = { method: 'chain' };
  expect(radiantPreviewProfile(chain, 'damage').error).toMatch(/altered/);
  const nested = original(); nested.damageConfig.areaParameters = { radius: 30 }; nested.damageConfig.chainConfig = { targets: 3 };
  expect(radiantPreviewProfile(nested, 'damage').error).toMatch(/altered/);
  expect(radiantPreviewProfile({ ...action, id: 'another_spell' }, 'damage').error).toMatch(/only original/);
  expect(radiantPreviewProfile(action, 'both').error).toMatch(/one effect/);
});

test('G3/G3a analytic overlap: sliver included, edge/corner contact excluded, translation and scale invariant', () => {
  // Cell [0,10]×[0,10]; circle left of it.
  expect(circleCellOverlap({ x: -10, y: 5 }, 10, { x: 0, y: 0 }, 10)).toBe('edge');
  expect(circleCellOverlap({ x: -9.99, y: 5 }, 10, { x: 0, y: 0 }, 10)).toBe('candidate');
  expect(circleCellOverlap({ x: -10.01, y: 5 }, 10, { x: 0, y: 0 }, 10)).toBe('outside');
  expect(circleCellOverlap({ x: -3, y: -4 }, 5, { x: 0, y: 0 }, 10)).toBe('edge');
  for (const scale of [0.1, 1, 100]) expect(circleCellOverlap({ x: 20 - 9.99 * scale, y: -30 + 5 * scale },
    10 * scale, { x: 0, y: 0 }, 10 * scale, 20, -30)).toBe('candidate');
});

const ref = id => ({ version: 1, kind: 'creature', roomId: 'r', mapId: 'm', tokenId: id, instanceId: `${id}-1` });
const entry = (id, position, footprint = { width: 1, height: 1 }) => ({ token: { position, state: { actorContract: ref(id) } }, name: () => id, footprint: () => footprint });
test('known movement footprints require cell-centred placement, including offsets and even-sized anchors', () => {
  expect(occupiedPreviewCells({ x: 125, y: 225 }, { width: 2, height: 2 }, 50)).toEqual([
    { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 4 }, { x: 2, y: 4 }]);
  expect(occupiedPreviewCells({ x: 132, y: 216 }, { width: 1, height: 1 }, 50, 7, -9)).toEqual([{ x: 2, y: 4 }]);
  expect(occupiedPreviewCells({ x: 126, y: 225 }, { width: 1, height: 1 }, 50)).toBeNull();
  expect(occupiedPreviewCells({ x: 125, y: 225 }, null, 50)).toBeNull();
  expect(occupiedPreviewCells({ x: 125, y: 225 }, { width: 1.5, height: 1 }, 50)).toBeNull();
});
test('Large overlap counts once, not centre membership; visibility precedes names and geometry and hidden additions are invariant', () => {
  const large = entry('large', { x: 125, y: 125 }, { width: 2, height: 2 });
  const opts = { visible: r => r.tokenId !== 'hidden', origin: { x: 45, y: 75 }, radius: 10, gridSize: 50, mapId: 'm' };
  const hidden = entry('hidden', { x: 75, y: 75 });
  hidden.name = () => { throw Error('hidden name leak'); }; hidden.footprint = () => { throw Error('hidden geometry leak'); };
  const expected = visibleAreaCandidates([large], opts);
  expect(expected).toHaveLength(1); expect(expected[0].status).toBe('candidate');
  expect(visibleAreaCandidates([large, large, hidden], opts)).toEqual(expected);
  expect(visibleAreaCandidates([large], { ...opts, visible: () => false })).toEqual([]);
  expect(visibleAreaCandidates([large], { ...opts, mapId: 'other' })).toEqual([]);
});
