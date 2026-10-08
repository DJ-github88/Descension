import {
  PRIVATE_STORAGE_REGISTRY,
  FROZEN_SLICE1_FAMILY_IDS,
  assertRegistryValid,
  getFamily,
  getFamilyForKey,
  findFamiliesForKey,
  listFamilyIds,
  registryTotals,
  DATA_CLASSES
} from '../privateStorageRegistry';
import {
  GLOBAL_ALLOWLIST,
  assertGlobalAllowlistValid,
  isGlobalAllowlistedKey,
  classifyKey
} from '../globalAllowlist';

describe('P5 Slice 1 — private storage registry', () => {
  it('S1-01 registry completeness: every frozen family has an explicit disposition', () => {
    expect(() => assertRegistryValid()).not.toThrow();

    const registered = new Set(listFamilyIds());
    for (const requiredId of FROZEN_SLICE1_FAMILY_IDS) {
      expect(registered.has(requiredId)).toBe(true);
    }

    const totals = registryTotals();
    expect(totals.familyCount).toBe(PRIVATE_STORAGE_REGISTRY.length);
    expect(totals.requiredCount).toBe(FROZEN_SLICE1_FAMILY_IDS.length);
    expect(totals.familyCount).toBeGreaterThanOrEqual(FROZEN_SLICE1_FAMILY_IDS.length);

    // No family id duplicates.
    expect(registered.size).toBe(PRIVATE_STORAGE_REGISTRY.length);

    // Exact coverage: every required family is registered and the registry
    // contains no unclassified extras.
    for (const familyId of listFamilyIds()) {
      expect(FROZEN_SLICE1_FAMILY_IDS).toContain(familyId);
    }

    // Spot checks on frozen dispositions.
    const campaign = getFamily('campaign.collection');
    expect(campaign.keys[0]).toMatchObject({ kind: 'exact', value: 'mythrill-campaigns' });
    expect(campaign.envelope).toBe('draft-envelope');
    expect(campaign.cleanupEligible).toBe(false);
    expect(campaign.cloudBinding).toBe('campaign-singleton');

    const dirty = getFamily('worldbuilding.dirty');
    expect(dirty.keys[0].prefix).toBe('mythrill_wb_dirty_');

    const subregionMaps = getFamily('map.subregionCache');
    expect(subregionMaps.storage).toBe('indexedDB+localStorage');
    expect(subregionMaps.keys.some((decl) => decl.kind === 'indexedDB')).toBe(true);
  });

  it('S1-02 global allowlist: public entries are explicit; nothing is silently global', () => {
    expect(() => assertGlobalAllowlistValid()).not.toThrow();
    expect(GLOBAL_ALLOWLIST.every((entry) => entry.privateContentPossible === false)).toBe(true);

    expect(isGlobalAllowlistedKey('creature-library-version')).toBe(true);
    expect(isGlobalAllowlistedKey('user-settings')).toBe(true);
    expect(isGlobalAllowlistedKey('page-has-been-force-refreshed')).toBe(true);

    // Mixed/private records are never allowlisted.
    expect(isGlobalAllowlistedKey('dice-store')).toBe(false);
    expect(isGlobalAllowlistedKey('mythrill-window-positions')).toBe(false);
    expect(isGlobalAllowlistedKey('mythrill-campaigns')).toBe(false);
    expect(isGlobalAllowlistedKey('mythrill_region_polygons')).toBe(false);

    expect(classifyKey('dice-store')).toMatchObject({
      classification: 'mixed',
      familyId: 'dice.history'
    });
    expect(classifyKey('mythrill-campaigns')).toMatchObject({
      classification: 'private',
      familyId: 'campaign.collection'
    });
    expect(classifyKey('creature-library-version')).toMatchObject({
      classification: 'global',
      allowlistId: 'version.creatureLibrary'
    });
    expect(classifyKey('totally-unregistered-key-123')).toMatchObject({
      classification: 'unregistered'
    });

    // Registered recovery data classes are never cleanup eligible.
    for (const family of PRIVATE_STORAGE_REGISTRY) {
      if (family.dataClass !== DATA_CLASSES.SESSION_ONLY && family.dataClass !== DATA_CLASSES.PUBLIC_CACHE) {
        expect(family.cleanupEligible).toBe(false);
      }
    }

    // Key lookup resolves families for builders and exact keys.
    expect(getFamilyForKey('mythrill_local_room_state_room_1')?.id).toBe('localRoom.statePrimary');
    expect(getFamilyForKey('offline_characters_char-1')?.id).toBe('offline.characters');
    expect(findFamiliesForKey('selectedRoomId').map((family) => family.id)).toContain(
      'multiplayer.selectedRoomId'
    );
  });
});
