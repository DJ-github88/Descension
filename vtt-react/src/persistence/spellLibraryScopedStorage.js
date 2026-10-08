/**
 * Project 5 Wave B (final sweep) — scoped spell-library authored families.
 *
 * Covers custom spells, deleted-spell tombstones and the spell library data
 * payload. All are verified-owner scoped; legacy global keys are quarantined
 * (verified copies) and never auto-adopted. Bundled/public spell definitions
 * remain public seed data and are not stored here.
 */

import { createScopedNativeFamily } from './scopedNativeFamily';

const customSpells = createScopedNativeFamily({
  familyId: 'library.customSpells',
  legacyKeys: ['mythrill-custom-spells'],
  fallback: []
});

const deletedSpells = createScopedNativeFamily({
  familyId: 'library.deletedSpells',
  legacyKeys: ['mythrill-deleted-spells'],
  fallback: []
});

const spellLibraryData = createScopedNativeFamily({
  familyId: 'library.spellData',
  legacyKeys: ['spell_library_data', 'spell-library-data'],
  fallback: null
});

export const loadCustomSpells = () => customSpells.load();
export const saveCustomSpells = (spells) => customSpells.save(spells);
export const loadDeletedSpellIds = () => deletedSpells.load();
export const saveDeletedSpellIds = (ids) => deletedSpells.save(ids);
export const loadSpellLibraryData = () => spellLibraryData.load();
export const saveSpellLibraryData = (data) => spellLibraryData.save(data);
export const clearSpellLibraryDataScoped = () => spellLibraryData.clear();

export function resetSpellLibraryScopedStorageForTests() {
  customSpells.resetForTests();
  deletedSpells.resetForTests();
  spellLibraryData.resetForTests();
}
