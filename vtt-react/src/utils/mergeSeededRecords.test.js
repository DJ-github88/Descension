import { mergeSeededRecords } from './mergeSeededRecords';

const seeds = [{ id: 'deity-sol', description: 'Conscious child', worldId: 'mythrill' }];

test('refreshes persisted defaults without mutating the saved record or losing extra metadata', () => {
  const saved = { id: 'deity-sol', description: 'Sleeping child', campaignNote: 'Keep this' };
  const result = mergeSeededRecords([saved], seeds);
  expect(result[0]).toEqual({ ...saved, ...seeds[0] });
  expect(saved.description).toBe('Sleeping child');
});

test.each([
  { isCustom: true },
  { updatedAt: '2026-09-01' },
  { createdAt: '2026-09-01' },
  { worldId: 'another-world' }
])('preserves an edited or other-world record: %j', (markers) => {
  const saved = { ...seeds[0], ...markers, description: 'My campaign version' };
  expect(mergeSeededRecords([saved], seeds)[0]).toBe(saved);
});

test('honors explicit seed removals even when a stale saved or cloud record is present', () => {
  expect(mergeSeededRecords([], seeds, ['deity-sol'])).toEqual([]);
  expect(mergeSeededRecords([seeds[0]], seeds, ['deity-sol'])).toEqual([]);
});

test('adds missing defaults once and preserves unrelated custom records', () => {
  const custom = { id: 'my-patron', isCustom: true, worldId: 'another-world' };
  const result = mergeSeededRecords([custom], seeds);
  expect(result).toEqual([custom, seeds[0]]);
  expect(mergeSeededRecords(result, seeds)).toEqual(result);
});

test('starts with current defaults when no persisted collection exists', () => {
  expect(mergeSeededRecords(undefined, seeds)).toEqual(seeds);
});
