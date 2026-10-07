// Seed defaults are refreshed during local and cloud hydration. Store edit actions
// mark records isCustom/updatedAt; those records and other worlds must survive.
export function mergeSeededRecords(records, seeds, removedSeedIds = [], worldId = 'mythrill') {
  const removed = new Set(removedSeedIds || []);
  const byId = new Map(seeds.map((seed) => [seed.id, seed]));
  const merged = (Array.isArray(records) ? records : [])
    .filter((record) => !byId.has(record.id) || !removed.has(record.id))
    .map((record) => {
      const seed = byId.get(record.id);
      const edited = record.isCustom || record.createdAt || record.updatedAt;
      const otherWorld = record.worldId && record.worldId !== worldId;
      return seed && !edited && !otherWorld ? { ...record, ...seed } : record;
    });
  const present = new Set(merged.map((record) => record.id));
  seeds.forEach((seed) => {
    if (!removed.has(seed.id) && !present.has(seed.id)) merged.push({ ...seed });
  });
  return merged;
}
