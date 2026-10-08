/**
 * Project 5 — explicit global data allowlist (Slice 1).
 *
 * Data may remain browser-global ONLY when it is pure public/immutable or pure
 * UI preference. A key name is never classification proof: keys that can mix
 * private history, authored references, actor identity or user-created content
 * are registered as private/mixed (see privateStorageRegistry) and must not
 * appear here.
 *
 * Unregistered keys are NOT silently global. classifyKey() reports
 * 'unregistered' and generic cleanup helpers fail closed on them.
 */

import { findFamiliesForKey, getFamilyForKey, PRIVATE_STORAGE_REGISTRY } from './privateStorageRegistry';

export const GLOBAL_ALLOWLIST = Object.freeze([
  { id: 'gameData.cache', kind: 'indexedDB', database: 'mythrill-data', store: 'gameData', whySafe: 'Public bundled game data cache; rebuilt from source data.', privateContentPossible: false, result: 'global' },
  { id: 'version.creatureLibrary', kind: 'exact', value: 'creature-library-version', whySafe: 'Public cache version marker.', privateContentPossible: false, result: 'global' },
  { id: 'version.creatureIconMigration', kind: 'exact', value: 'creature-icon-migration-version', whySafe: 'Public cache version marker.', privateContentPossible: false, result: 'global' },
  { id: 'version.spellCache', kind: 'exact', value: 'spell-cache-version', whySafe: 'Public cache version marker; cleanup must not delete authored spell drafts.', privateContentPossible: false, result: 'global' },
  { id: 'version.conditionMigration', kind: 'exact', value: 'condition-store-migrated-v1', whySafe: 'Schema migration flag.', privateContentPossible: false, result: 'global' },
  { id: 'version.locationCoordinates', kind: 'exact', value: 'mythrill_location_coordinates_version', whySafe: 'Public coordinate cache version marker.', privateContentPossible: false, result: 'global' },
  { id: 'version.drawnGeometry', kind: 'exact', value: 'mythrill_drawn_geometry_version', whySafe: 'Public geometry cache version marker.', privateContentPossible: false, result: 'global' },
  { id: 'pref.landingSection', kind: 'exact', value: 'landingActiveSection', whySafe: 'Pure UI preference.', privateContentPossible: false, result: 'global' },
  { id: 'pref.atlasViewMode', kind: 'exact', value: 'mythrill_atlas_view_mode', whySafe: 'Pure UI preference.', privateContentPossible: false, result: 'global' },
  { id: 'pref.navCollapsed', kind: 'exact', value: 'mythrill-nav-collapsed', whySafe: 'Pure UI preference.', privateContentPossible: false, result: 'global' },
  { id: 'pref.navOrb', kind: 'exact', value: 'mythrill-nav-orb', whySafe: 'Pure UI preference.', privateContentPossible: false, result: 'global' },
  { id: 'pref.mapBorder', kind: 'exact', value: 'mythrill_map_border_enabled', whySafe: 'Pure UI preference.', privateContentPossible: false, result: 'global' },
  { id: 'pref.talentHelpOpen', kind: 'exact', value: 'mythrill:talentHelpOpen', whySafe: 'Pure UI preference.', privateContentPossible: false, result: 'global' },
  { id: 'pref.userSettings', kind: 'exact', value: 'user-settings', whySafe: 'Settings store partialize persists pure preference fields only.', privateContentPossible: false, result: 'global' },
  { id: 'pref.targetingSettings', kind: 'exact', value: 'targeting-store', whySafe: 'Targeting partialize persists HUD position/settings only; current target is runtime-only.', privateContentPossible: false, result: 'global' },
  { id: 'ops.cookieConsent', kind: 'exact', value: 'mythrill_cookie_consent', whySafe: 'Operational consent flag.', privateContentPossible: false, result: 'global' },
  { id: 'ops.firestoreDebug', kind: 'exact', value: 'mythrill:firestore-debug', whySafe: 'Operational debug flag.', privateContentPossible: false, result: 'global' },
  { id: 'ops.lazyRefreshFlag', kind: 'exact', value: 'page-has-been-force-refreshed', whySafe: 'Tab-local operational retry flag.', privateContentPossible: false, result: 'global' },
  { id: 'resourceCaches', kind: 'conceptual', value: 'browser-resource-caches', whySafe: 'Public static resources only; existing service-worker unregister clears them.', privateContentPossible: false, result: 'global' },
  { id: 'bundledImmutableContent', kind: 'conceptual', value: 'bundled-public-content', whySafe: 'Bundled immutable rules/lore/class/race/asset defaults shipped with the app.', privateContentPossible: false, result: 'global' }
]);

const allowlistByValue = new Map(
  GLOBAL_ALLOWLIST
    .filter((entry) => entry.kind === 'exact')
    .map((entry) => [entry.value, entry])
);

export function isGlobalAllowlistedKey(key) {
  if (typeof key !== 'string' || key.length === 0) return false;
  return allowlistByValue.has(key);
}

export function getGlobalAllowlistEntry(key) {
  return allowlistByValue.get(key) || null;
}

/**
 * Classify a raw key without trusting its name.
 *
 * @returns {{
 *   classification: 'p5-scoped'|'global'|'private'|'mixed'|'unregistered',
 *   familyId: string|null,
 *   allowlistId: string|null
 * }}
 */
export function classifyKey(rawKey) {
  if (typeof rawKey !== 'string' || rawKey.length === 0) {
    return { classification: 'unregistered', familyId: null, allowlistId: null };
  }
  if (rawKey.startsWith('mythrill:p5:')) {
    const parsed = rawKey.slice('mythrill:p5:'.length).split(':');
    const isUserScoped = parsed[0] === 'user';
    const familyId = isUserScoped ? parsed[2] : parsed[1];
    return { classification: 'p5-scoped', familyId: familyId || null, allowlistId: null };
  }
  const allowlistEntry = allowlistByValue.get(rawKey);
  if (allowlistEntry) {
    return { classification: 'global', familyId: null, allowlistId: allowlistEntry.id };
  }
  const family = getFamilyForKey(rawKey);
  if (family) {
    return {
      classification: family.privacyClass === 'mixed' ? 'mixed' : 'private',
      familyId: family.id,
      allowlistId: null
    };
  }
  return { classification: 'unregistered', familyId: null, allowlistId: null };
}

/** Integrity checks used by tests. */
export function assertGlobalAllowlistValid() {
  const seen = new Set();
  for (const entry of GLOBAL_ALLOWLIST) {
    if (!entry.id || seen.has(entry.id)) {
      throw new Error(`P5 allowlist: duplicate or missing id "${entry.id}"`);
    }
    seen.add(entry.id);
    if (entry.privateContentPossible !== false) {
      throw new Error(`P5 allowlist: "${entry.id}" must declare privateContentPossible:false`);
    }
    if (entry.result !== 'global') {
      throw new Error(`P5 allowlist: "${entry.id}" must declare result:'global'`);
    }
    if (typeof entry.whySafe !== 'string' || entry.whySafe.length === 0) {
      throw new Error(`P5 allowlist: "${entry.id}" must document why the data is safe global`);
    }
  }
  // No private/mixed registry family may also be allowlisted.
  for (const entry of GLOBAL_ALLOWLIST) {
    if (entry.kind !== 'exact') continue;
    if (allowlistByValue.has(entry.value) && findFamiliesForKey(entry.value).length > 0) {
      throw new Error(`P5 allowlist: "${entry.value}" is both allowlisted and registered private`);
    }
  }
  // Sanity: registry and allowlist key sets stay disjoint for exact keys.
  for (const family of PRIVATE_STORAGE_REGISTRY) {
    for (const decl of family.keys) {
      if (decl.kind === 'exact' && allowlistByValue.has(decl.value)) {
        throw new Error(`P5 allowlist: registry family "${family.id}" key "${decl.value}" is allowlisted`);
      }
    }
  }
  return true;
}
