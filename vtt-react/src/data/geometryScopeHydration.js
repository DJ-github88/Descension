/**
 * Project 5 Wave B (B7) â€” public geometry seeds vs private authored overrides.
 *
 * The bundled geometry modules are public, reconstructible seeds. Authored
 * edits (custom names/descriptions, drawn boundaries, moved coordinates) are
 * private to the verified owner and live in `map.geometryMixed` scoped
 * storage. This module is the single place that:
 *
 *   - snapshots the immutable public seeds at import;
 *   - resets the mutable shared geometry projections to those seeds;
 *   - hydrates the active verified owner's authored overrides;
 *   - persists the active verified owner's authored overrides.
 *
 * It never reads or writes the retired global keys (they remain untouched
 * recovery sources), and it never adopts unknown-owner content.
 */

import { REGION_POLYGONS } from './regionPolygons';
import { SUBREGIONS } from './subregions';
import { LOCATION_COORDINATES } from './locationCoordinates';
import { BUILTIN_SUBREGION_MAPS } from './subregionMaps';
import {
  loadGeometryOverrides,
  saveGeometryOverrides
} from '../persistence/mapGeometryScopedStorage';
import { resolveActiveScope, captureConsumerContext, isConsumerContextCurrent } from '../persistence/scopedConsumer';

const clone = (value) => {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_error) {
    return null;
  }
};

const PUBLIC_SEEDS = {
  regions: clone(REGION_POLYGONS) || {},
  subregions: clone(SUBREGIONS) || {},
  coordinates: clone(LOCATION_COORDINATES) || {},
  regional: {}
};
Object.keys(BUILTIN_SUBREGION_MAPS).forEach((mapId) => {
  const entry = BUILTIN_SUBREGION_MAPS[mapId];
  if (entry && Array.isArray(entry.subregions)) {
    PUBLIC_SEEDS.regional[mapId] = clone(entry.subregions) || [];
  }
});
const freezeSeed = (value) => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freezeSeed);
    Object.freeze(value);
  }
};
freezeSeed(PUBLIC_SEEDS);

function mergeAuthoredEntry(live, stored) {
  if (!live || typeof live !== 'object' || !stored || typeof stored !== 'object') return;
  Object.assign(live, clone(stored));
}

function restoreSeedEntry(live, seed) {
  // Preserve renderer references, but remove EVERY authored-only field, not
  // just points/name. A seed without a description must not retain A's text.
  Object.keys(live).forEach((field) => delete live[field]);
  Object.assign(live, clone(seed));
}

function mergeAuthoredMap(live, stored) {
  if (!stored || typeof stored !== 'object') return;
  Object.keys(stored).forEach((id) => {
    const storedEntry = stored[id];
    if (!storedEntry || typeof storedEntry !== 'object') return;
    if (!live[id]) {
      live[id] = clone(storedEntry);
      return;
    }
    mergeAuthoredEntry(live[id], storedEntry);
  });
}

function mergeRegionalList(liveList, storedList) {
  if (!Array.isArray(liveList) || !Array.isArray(storedList)) return;
  storedList.forEach((storedSub) => {
    if (!storedSub || typeof storedSub !== 'object') return;
    const liveSub = liveList.find((s) => s && s.id === storedSub.id);
    if (liveSub) mergeAuthoredEntry(liveSub, storedSub);
    else liveList.push(clone(storedSub));
  });
}

/** Reset every mutable shared geometry projection back to the public seeds. */
export function resetGeometryToPublicSeeds() {
  // Regions/subregions: drop any authored-only entries and restore seed fields.
  Object.keys(REGION_POLYGONS).forEach((id) => {
    if (!PUBLIC_SEEDS.regions[id]) {
      delete REGION_POLYGONS[id];
    } else {
      restoreSeedEntry(REGION_POLYGONS[id], PUBLIC_SEEDS.regions[id]);
    }
  });
  Object.keys(PUBLIC_SEEDS.regions).forEach((id) => {
    if (!REGION_POLYGONS[id]) REGION_POLYGONS[id] = clone(PUBLIC_SEEDS.regions[id]);
  });

  Object.keys(SUBREGIONS).forEach((id) => {
    if (!PUBLIC_SEEDS.subregions[id]) {
      delete SUBREGIONS[id];
    } else {
      restoreSeedEntry(SUBREGIONS[id], PUBLIC_SEEDS.subregions[id]);
    }
  });
  Object.keys(PUBLIC_SEEDS.subregions).forEach((id) => {
    if (!SUBREGIONS[id]) SUBREGIONS[id] = clone(PUBLIC_SEEDS.subregions[id]);
  });

  Object.keys(LOCATION_COORDINATES).forEach((key) => delete LOCATION_COORDINATES[key]);
  Object.assign(LOCATION_COORDINATES, clone(PUBLIC_SEEDS.coordinates) || {});

  Object.keys(BUILTIN_SUBREGION_MAPS).forEach((mapId) => {
    const entry = BUILTIN_SUBREGION_MAPS[mapId];
    if (!entry || !Array.isArray(entry.subregions)) return;
    const seed = PUBLIC_SEEDS.regional[mapId];
    if (!Array.isArray(seed)) return;
    entry.subregions = clone(seed) || [];
  });
}

/** Apply an authored override payload onto the (already reset) projections. */
export function applyGeometryOverrides(overrides) {
  if (!overrides || typeof overrides !== 'object') return;
  if (overrides.regions) mergeAuthoredMap(REGION_POLYGONS, overrides.regions);
  if (overrides.subregions) mergeAuthoredMap(SUBREGIONS, overrides.subregions);
  if (overrides.coordinates && typeof overrides.coordinates === 'object') {
    Object.keys(LOCATION_COORDINATES).forEach((key) => delete LOCATION_COORDINATES[key]);
    Object.assign(LOCATION_COORDINATES, clone(overrides.coordinates) || {});
  }
  if (overrides.regional && typeof overrides.regional === 'object') {
    Object.keys(overrides.regional).forEach((mapId) => {
      const entry = BUILTIN_SUBREGION_MAPS[mapId];
      if (!entry || !Array.isArray(entry.subregions)) return;
      mergeRegionalList(entry.subregions, overrides.regional[mapId]);
    });
  }
}

/** Capture the current authored geometry snapshot for persistence. */
export function snapshotAuthoredGeometry() {
  const regional = {};
  Object.keys(BUILTIN_SUBREGION_MAPS).forEach((mapId) => {
    const entry = BUILTIN_SUBREGION_MAPS[mapId];
    if (entry && Array.isArray(entry.subregions)) {
      regional[mapId] = clone(entry.subregions) || [];
    }
  });
  return {
    regions: clone(REGION_POLYGONS) || {},
    subregions: clone(SUBREGIONS) || {},
    coordinates: clone(LOCATION_COORDINATES) || {},
    regional
  };
}

/**
 * Persist the current authored geometry under the active verified owner.
 * No active owner scope â†’ nothing is written (public seed stays in memory).
 */
export function persistAuthoredGeometry(context = null) {
  const captured = context || captureConsumerContext().context;
  if (!captured || !isConsumerContextCurrent(captured)) return { status: 'CONTEXT_REFUSED' };
  return saveGeometryOverrides(snapshotAuthoredGeometry(), captured);
}

/**
 * Rebuild the shared projections for the active verified owner: reset to the
 * public seeds, then apply that owner's authored overrides. Unknown-owner
 * legacy raw content is never consulted.
 */
export function hydrateGeometryForActiveOwner() {
  resetGeometryToPublicSeeds();
  if (!resolveActiveScope()) return null;
  const overrides = loadGeometryOverrides();
  if (overrides) applyGeometryOverrides(overrides);
  return overrides;
}

export { PUBLIC_SEEDS };
