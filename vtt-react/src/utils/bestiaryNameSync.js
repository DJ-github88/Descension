// Bestiary name sync: migrates saved copies of bestiary creatures (user libraries,
// Firebase merges, cached store seeds) from legacy display names to current ones.
import legacyMap from '../data/bestiaryLegacyNames.json';

const currentNameFor = (creature) => {
  if (!creature) return null;
  const byId = creature.id && legacyMap.byId[creature.id];
  if (byId) return byId;
  const byName = creature.name && legacyMap.byLegacyName[creature.name];
  if (byName) return byName;
  return null;
};

/** Returns a new array where stale bestiary display names are updated. No-op when clean. */
export const syncBestiaryCreatureNames = (creatures) => {
  if (!Array.isArray(creatures) || creatures.length === 0) return creatures;
  let changed = false;
  const next = creatures.map((c) => {
    const name = currentNameFor(c);
    if (name && name !== c.name) {
      changed = true;
      return { ...c, name };
    }
    return c;
  });
  return changed ? next : creatures;
};

export default syncBestiaryCreatureNames;
