/**
 * Project 5 Wave B (B7) — verified-owner scoped authored map geometry.
 *
 * Region/subregion polygons, location coordinates and regional subregion
 * boundaries are MIXED: bundled module data is a public seed, while the
 * DevEditor authoring path mutates those objects and must persist private
 * authored overrides. Authored overrides live in the existing
 * `map.geometryMixed` registry family for the verified owner scope.
 *
 * The retired global keys are preserved (quarantined once per owner) and are
 * never read automatically and never written.
 */

import { createScopedNativeFamily } from './scopedNativeFamily';
import { captureConsumerContext, isConsumerContextCurrent, resolveActiveScope } from './scopedConsumer';
import { readScopedRecord } from './safeRead';
import { withPrivateStorageLock, forkScopedRecord } from './localCoordination';

export const MAP_GEOMETRY_FAMILY = 'map.geometryMixed';

const geometryFamily = createScopedNativeFamily({
  familyId: MAP_GEOMETRY_FAMILY,
  legacyKeys: [
    'mythrill_region_polygons',
    'mythrill_subregion_polygons',
    'mythrill_location_coordinates'
  ]
});
const baselines = new Map();
const pending = new Map();
const ownerKey = scope => `${scope.scopeKind}:${scope.scopeId}`;
const isGeometryPayload = value => value && typeof value === 'object' && !Array.isArray(value)
  && Object.keys(value).every(key => ['regions', 'subregions', 'coordinates', 'regional'].includes(key)
    && value[key] && typeof value[key] === 'object' && !Array.isArray(value[key]));

/** Load the active verified owner's authored geometry overrides (or null). */
export function loadGeometryOverrides() {
  const scope = resolveActiveScope();
  if (!scope) return null;
  const value = geometryFamily.load();
  const source = readScopedRecord({ familyId: MAP_GEOMETRY_FAMILY, scope });
  if (source.status === 'PRESENT_VALID' || source.status === 'MISSING') baselines.set(ownerKey(scope), source.raw);
  return isGeometryPayload(value) ? value : null;
}

/** Persist the active verified owner's authored geometry overrides. */
export function saveGeometryOverrides(overrides, context = null) {
  if (!overrides || typeof overrides !== 'object') {
    return { status: 'INVALID_PAYLOAD' };
  }
  const captured = context || captureConsumerContext().context;
  if (!captured || !isConsumerContextCurrent(captured)) return Promise.resolve({ status: 'CONTEXT_REFUSED' });
  const scope = captured.scope;
  const key = ownerKey(scope);
  const payload = JSON.parse(JSON.stringify(overrides));
  if (!baselines.has(key)) {
    const source = readScopedRecord({ familyId: MAP_GEOMETRY_FAMILY, scope });
    if (!['MISSING', 'PRESENT_VALID'].includes(source.status)) return Promise.resolve({ status: source.status });
    baselines.set(key, source.raw);
  }
  const run = (pending.get(key) || Promise.resolve()).then(async () => {
    const result = await withPrivateStorageLock({ scope, familyId: MAP_GEOMETRY_FAMILY, context: captured }, () => {
      const source = readScopedRecord({ familyId: MAP_GEOMETRY_FAMILY, scope });
      if (!['MISSING', 'PRESENT_VALID'].includes(source.status)) return { status: source.status };
      if (source.status === 'PRESENT_VALID' && !isGeometryPayload(source.value)) return { status: 'MALFORMED' };
      if (source.raw !== baselines.get(key)) {
        // Preserve this candidate without rebasing its whole snapshot over a winner.
        return forkScopedRecord({ familyId: MAP_GEOMETRY_FAMILY, scope, context: captured, payload });
      }
      if (!isConsumerContextCurrent(captured)) return { status: 'CONTEXT_REFUSED' };
      const written = geometryFamily.save(payload);
      if (written.status === 'OK') baselines.set(key, readScopedRecord({ familyId: MAP_GEOMETRY_FAMILY, scope }).raw);
      return written;
    });
    if (result.status === 'COORDINATION_UNAVAILABLE') return forkScopedRecord({ familyId: MAP_GEOMETRY_FAMILY, scope, context: captured, payload });
    return result;
  }).catch(error => ({ status: 'STORAGE_ERROR', reason: error.message }));
  pending.set(key, run);
  return run;
}

export function flushGeometryWrites() { return Promise.all([...pending.values()]); }

export function clearGeometryOverrides() {
  return geometryFamily.clear();
}

export function resetGeometryScopedStateForTests() {
  geometryFamily.resetForTests();
  baselines.clear();
  pending.clear();
}
