import {
  ALL_CLASSES_DATA,
  BASE_CLASSES_DATA
} from '../index';
import {
  CLASS_DISPLAY_DATA,
  CLASS_DISPLAY_ALIASES,
  CANONICAL_ROSTER_DATA,
  RETIRED_OR_SUPERSEDED_CLASS_NAMES,
  getClassRoleFilter,
  getSelectableClassNames
} from '../classDisplayData';
import {
  CLASS_FLAVOR_PROFILES,
  getClassFlavorProfile
} from '../classFlavorProfiles';
import {
  RECONSTRUCTION_COMPATIBILITY_ROWS,
  RECONSTRUCTION_RELATIONSHIPS,
  getReconstructionCompatibility,
  getReconstructionSuccessors,
  hasAutomaticConversion,
  LEGACY_RECONSTRUCTION_KEYS
} from '../classReconstructionCompatibility';
import {
  HERITAGE_TRADITIONS,
  CLASS_PROVENANCE,
  CLASS_COMPATIBILITY_ALIASES,
  resolveClassHeritageName,
  getClassNativeHeritageIds,
  getClassHeritageAccess
} from '../../classHeritageRegistry';
import { summarizeHeritageEdgesForClass } from '../../heritageEdgeAdapter';
import {
  getCharacterClassAccess,
  validateCharacterClassAccess
} from '../../../utils/characterClassAccess';
import { isClassCompatible } from '../../../utils/pointBuySystem';
import { getClassIconUrl, hasClassPixelArt } from '../../../utils/classIconUtils';
import {
  getResourceSystemGuide,
  hasResourceSystemGuide
} from '../../resourceSystems';
import {
  CLASS_DATA_MAP,
  ALL_CLASS_SPELLS
} from '../../classSpellGenerator';
import {
  CLASS_SPECIALIZATIONS,
  getClassSpecializations,
  createSpellLibraryCategoriesForClass,
  getAllClassNames as getSpellCategoryClasses
} from '../../classSpellCategories';
import { getTalentsForSpec, PLACEHOLDER_TREE } from '../../talentTreeData';
import { buildDemoClassResource } from '../../../components/rules/ClassDetailDisplay';
import {
  CLASS_DATA_LOADERS,
  CLASS_ICON_MAP
} from '../../../components/rules/RulesPage';

jest.mock('../../../store/customLineageStore', () => ({
  __esModule: true,
  default: { getState: () => ({ getLineage: () => null }) }
}));

const ESTABLISHED_BLUEPRINT_CLASSES = [
  'Animist',
  'Apex',
  'Arcanoneer',
  'Augur',
  'Berserker',
  'Chronarch',
  'Crusader',
  'False Prophet',
  'Gambit',
  'Harbinger',
  'Inquisitor',
  'Lunarch',
  'Martyr',
  'Minstrel',
  'Plaguebringer',
  'Pyrofiend',
  'Revenant',
  'Shaper',
  'Spellguard',
  'Toxicologist',
  'Warden'
];

const DEVELOPMENT_MANUAL_CLASSES = [
  'Chaos Weaver',
  'Gambler',
  'Fate Weaver',
  'Deathcaller',
  'Lichborne',
  'Doomsayer',
  'Oracle',
  'Druid',
  'Hunter',
  'Covenbane',
  'Exorcist',
  'Dreadnaught',
  'Bladedancer',
  'Inscriptor',
  'Totemist',
  'Witch Doctor'
];

const NON_NATIVE_REGISTERED_CLASSES = [
  'Fate Weaver',
  'Deathcaller',
  'Lichborne',
  'Doomsayer',
  'Oracle',
  'Druid',
  'Hunter',
  'Covenbane',
  'Exorcist',
  'Dreadnaught',
  'Bladedancer',
  'Inscriptor',
  'Totemist',
  'Witch Doctor'
];

const PROPOSED_UNAPPROVED_CLASSES = ['Earthwarden', 'Necromancer', 'Spellblade'];

const REGISTERED_BASE_CLASS_NAMES = Object.keys(BASE_CLASSES_DATA);
const COMPATIBILITY_ALIAS_ENTRIES = Object.entries(CLASS_COMPATIBILITY_ALIASES);

const getDisplayEntryByName = (name) =>
  CLASS_DISPLAY_DATA.find((entry) => entry.name === name) || null;

describe('Class HQ Catalogue Consistency & Batch Validation', () => {
  describe('Priority Spotlight: Doomsayer & Oracle Registration and Provenance', () => {
    test.each([
      {
        className: 'Doomsayer',
        id: 'doomsayer',
        expectedRequirements: [
          'witnessed_calamity',
          'doom_arithmetic',
          'disruption_method',
          'forewarning_accounting'
        ],
        expectedSpecs: ['requiem', 'endbringer', 'forewarner'],
        expectedCoreSpellIds: ['cr1_doomsayer_plant_calamity', 'cr1_doomsayer_dismantle_calamity'],
        expectedDemoType: 'doom-calamities'
      },
      {
        className: 'Oracle',
        id: 'oracle',
        expectedRequirements: [
          'observed_omen',
          'forecast_discipline',
          'expiry_accounting',
          'bounded_reading'
        ],
        expectedSpecs: ['seer', 'witness', 'pathfinder'],
        expectedCoreSpellIds: ['cr1_oracle_commit_forecast', 'cr1_oracle_release_forecast'],
        expectedDemoType: 'oracle-forecasts'
      }
    ])(
      '$className resolves across catalogue, loaders, provenance, acquisition, and tabs without native heritage edges',
      async ({
        className,
        id,
        expectedRequirements,
        expectedSpecs,
        expectedCoreSpellIds,
        expectedDemoType
      }) => {
        const classData = BASE_CLASSES_DATA[className];
        expect(classData).toBeDefined();
        expect(classData.id).toBe(id);
        expect(classData.name).toBe(className);
        expect(classData.developmentStatus).toBe('development');
        expect(classData.manualOnly).toBe(true);
        expect(classData.executionEnabled).toBe(false);

        // Provenance registration & separation from native heritage access
        const provenance = CLASS_PROVENANCE[className];
        expect(provenance).toBeDefined();
        expect(provenance.requirements).toEqual(expectedRequirements);
        expect(provenance.heritageEffectsImplemented).toBe(false);
        expect(getClassNativeHeritageIds(className)).toEqual([]);
        expect(summarizeHeritageEdgesForClass(className)).toEqual([]);
        expect(classData.restrictions?.allowedSubraces).toEqual([]);
        expect(classData.heritageProfile?.heritageEffectsImplemented).toBe(false);

        // Acquisition requirements preserved and enforced by existing consumers
        const recordIds = (classData.restrictions?.acquisition?.records || []).map((r) => r.id);
        expect(recordIds).toEqual(expectedRequirements);

        const unqualifiedDraft = {
          class: className,
          race: 'human',
          subrace: 'thalren_human',
          classAcquisition: {}
        };
        const unqualifiedAccess = getCharacterClassAccess(unqualifiedDraft);
        expect(unqualifiedAccess.status).toBe('requires-qualification');
        expect(unqualifiedAccess.selectable).toBe(false);
        expect(validateCharacterClassAccess(unqualifiedDraft).isValid).toBe(false);
        expect(isClassCompatible(className, 'human', 'thalren_human')).toBe(false);

        const qualifiedDraft = {
          class: className,
          race: 'human',
          subrace: 'thalren_human',
          classAcquisition: {
            [className]: {
              qualification: {
                verified: true,
                source: `Recorded ${className} apprenticeship`,
                fulfilledRequirements: expectedRequirements
              }
            }
          }
        };
        const qualifiedAccess = getCharacterClassAccess(qualifiedDraft);
        expect(qualifiedAccess.status).toBe('qualified-exception');
        expect(qualifiedAccess.selectable).toBe(true);
        expect(validateCharacterClassAccess(qualifiedDraft).isValid).toBe(true);

        // Lazy loader, display metadata, icon, flavor profile, and resource guide
        expect(typeof CLASS_DATA_LOADERS[className]).toBe('function');
        const loadedData = await CLASS_DATA_LOADERS[className]();
        expect(loadedData?.name).toBe(className);
        expect(CLASS_ICON_MAP[className]).toBeDefined();
        expect(getDisplayEntryByName(className)?.name).toBe(className);
        expect(getClassFlavorProfile(id)?.name).toBe(className);
        expect(hasResourceSystemGuide(id)).toBe(true);
        expect(getClassIconUrl(className)).toMatch(/^\/assets\/icons\//);

        // Demo resource preview stays uninitialized/manual
        const demoResource = buildDemoClassResource(className);
        expect(demoResource.type).toBe(expectedDemoType);
        expect(demoResource.initialized).toBe(false);

        // Specializations, talent trees, and core vs optional vs talent grant distinction
        const specIds = classData.specializations.specs.map((s) => s.id);
        expect(specIds).toEqual(expectedSpecs);
        expectedSpecs.forEach((specId) => {
          const nodes = getTalentsForSpec(className, specId);
          expect(nodes).not.toBe(PLACEHOLDER_TREE);
          expect(nodes.length).toBeGreaterThan(0);
        });
        expect(classData.progression.policy.grantedCoreSpellIds).toEqual(expectedCoreSpellIds);
      }
    );
  });

  describe('Roster Classification & Boundary Audit', () => {
    test('selectable class names expose the approved canonical roster (30 classes)', () => {
      expect(getSelectableClassNames()).toHaveLength(30);
      expect(getSelectableClassNames().slice().sort()).toEqual(
        CANONICAL_ROSTER_DATA.map(entry => entry.name).slice().sort()
      );
      expect(REGISTERED_BASE_CLASS_NAMES).toHaveLength(37);
      expect(REGISTERED_BASE_CLASS_NAMES).toEqual(
        expect.arrayContaining(getSelectableClassNames())
      );
      RETIRED_OR_SUPERSEDED_CLASS_NAMES.forEach((legacyName) => {
        expect(getSelectableClassNames()).not.toContain(legacyName);
      });
      expect(getSelectableClassNames()).not.toContain('Nereid Myrathil Apex');
    });

    test('distinguishes established classes, development/manual classes, compatibility aliases, and unapproved proposals', () => {
      expect(ESTABLISHED_BLUEPRINT_CLASSES).toHaveLength(21);
      expect(DEVELOPMENT_MANUAL_CLASSES).toHaveLength(16);
      expect(REGISTERED_BASE_CLASS_NAMES.slice().sort()).toEqual(
        [...ESTABLISHED_BLUEPRINT_CLASSES, ...DEVELOPMENT_MANUAL_CLASSES].sort()
      );
      expect(Object.keys(CLASS_PROVENANCE).slice().sort()).toEqual(
        REGISTERED_BASE_CLASS_NAMES.slice().sort()
      );
      expect(CLASS_DISPLAY_DATA).toHaveLength(37);
      expect(CLASS_DISPLAY_ALIASES).toHaveLength(3);
      expect(Object.keys(ALL_CLASSES_DATA)).toHaveLength(40);
      expect(Object.keys(CLASS_FLAVOR_PROFILES)).toHaveLength(38);

      // Missing registration check across all 30 base classes
      const missingFromProvenance = REGISTERED_BASE_CLASS_NAMES.filter(
        (name) => !CLASS_PROVENANCE[name]
      );
      const missingFromDisplay = REGISTERED_BASE_CLASS_NAMES.filter(
        (name) => !getDisplayEntryByName(name)
      );
      const missingFromLoaders = REGISTERED_BASE_CLASS_NAMES.filter(
        (name) => !CLASS_DATA_LOADERS[name]
      );
      const spellGenClasses = Object.keys(ALL_CLASS_SPELLS);
      const missingFromSpellGenerator = REGISTERED_BASE_CLASS_NAMES.filter(
        (name) => !spellGenClasses.includes(name) || !CLASS_DATA_MAP[name]
      );
      const missingFromSpellCategories = REGISTERED_BASE_CLASS_NAMES.filter(
        (name) => !getSpellCategoryClasses().includes(name)
      );
      expect(missingFromProvenance).toEqual([]);
      expect(missingFromDisplay).toEqual([]);
      expect(missingFromLoaders).toEqual([]);
      expect(missingFromSpellGenerator).toEqual([]);
      expect(missingFromSpellCategories).toEqual([]);

      // Unapproved proposals must never be registered in base class surfaces
      PROPOSED_UNAPPROVED_CLASSES.forEach((unapprovedName) => {
        expect(BASE_CLASSES_DATA[unapprovedName]).toBeUndefined();
        expect(ALL_CLASSES_DATA[unapprovedName]).toBeUndefined();
        expect(CLASS_PROVENANCE[unapprovedName]).toBeUndefined();
        expect(getDisplayEntryByName(unapprovedName)).toBeNull();
        expect(CLASS_DATA_LOADERS[unapprovedName]).toBeUndefined();
      });
    });
  });

  describe('Parameterized Registered Base Roster Checks (Checks 1–6)', () => {
    test.each(REGISTERED_BASE_CLASS_NAMES)(
      '%s resolves detail data, icons, loaders, flavor profile, resource guide, talent trees, spells, and provenance',
      async (className) => {
        const classData = BASE_CLASSES_DATA[className];
        const displayEntry = getDisplayEntryByName(className);
        const provenance = CLASS_PROVENANCE[className];
        const isDevManual = DEVELOPMENT_MANUAL_CLASSES.includes(className);

        // Check 1: Registered classes resolve actual detail data rather than "not available"
        expect(classData).toBeDefined();
        expect(ALL_CLASSES_DATA[className]?.name).toBe(className);
        expect(classData.name).toBe(className);
        expect(typeof classData.id).toBe('string');
        expect(classData.id.length).toBeGreaterThan(0);
        expect(
          classData.overview?.classIntroduction ||
            classData.overview?.description ||
            classData.description ||
            classData.overview?.role ||
            classData.overview?.title
        ).toBeTruthy();
        expect(
          classData.resourceSystem?.title ||
            classData.resourceSystem?.name ||
            classData.resourceSystem?.mechanic ||
            classData.resourceSystem?.id ||
            classData.resourceSystem?.resourceDefinition?.name
        ).toBeTruthy();
        expect(Array.isArray(classData.specializations?.specs)).toBe(true);
        expect(classData.specializations.specs.length).toBeGreaterThanOrEqual(3);

        // Lazy loader resolves the exact class data
        expect(typeof CLASS_DATA_LOADERS[className]).toBe('function');
        const loadedByName = await CLASS_DATA_LOADERS[className]();
        expect(loadedByName?.name).toBe(className);

        // Check 2: Icons, loaders, display names, flavor profiles, and resource guides match approved records
        expect(displayEntry).not.toBeNull();
        expect(displayEntry.name).toBe(className);
        expect(['tank', 'damage', 'support', 'control', 'hybrid']).toContain(
          getClassRoleFilter(displayEntry.role)
        );
        expect(CLASS_ICON_MAP[className]).toBeDefined();
        expect(getClassIconUrl(className)).toMatch(/^\/assets\/icons\//);
        expect(getClassIconUrl(classData.id)).toMatch(/^\/assets\/icons\//);
        expect(typeof hasClassPixelArt(className)).toBe('boolean');

        const flavor = getClassFlavorProfile(classData.id) || getClassFlavorProfile(className);
        expect(flavor).not.toBeNull();
        expect(flavor.name).toBe(className);
        expect(Array.isArray(flavor.keyFeatures)).toBe(true);
        expect(flavor.keyFeatures.length).toBeGreaterThan(0);

        expect(hasResourceSystemGuide(classData.id)).toBe(true);
        expect(getResourceSystemGuide(classData.id)).not.toBeNull();

        // Spell & talent tab resolution
        const spells = ALL_CLASS_SPELLS[className];
        expect(Array.isArray(spells)).toBe(true);
        expect(spells.length).toBeGreaterThan(0);
        expect(CLASS_SPECIALIZATIONS[className]).toBeDefined();
        expect(getClassSpecializations(className).length).toBeGreaterThanOrEqual(3);
        expect(createSpellLibraryCategoriesForClass(className).length).toBeGreaterThan(0);

        classData.specializations.specs.forEach((spec) => {
          const nodes = getTalentsForSpec(className, spec.id);
          expect(nodes).not.toBe(PLACEHOLDER_TREE);
          expect(nodes.length).toBeGreaterThan(0);
          nodes.forEach((node) => {
            expect(node.id).toBeTruthy();
            expect(node.name).toBeTruthy();
          });
        });

        // Check 3: Core grants, optional abilities, and talent grants remain distinguishable
        const coreIds =
          classData.progression?.policy?.grantedCoreSpellIds ||
          classData.progression?.grantedCoreSpellIds ||
          [];
        if (coreIds.length > 0) {
          const optionalPoolIds = Object.values(classData.spellPools || {}).flat();
          coreIds.forEach((coreId) => {
            expect(optionalPoolIds).not.toContain(coreId);
          });
        }

        // Check 4: Manual/development status is visible and never presented as automated execution
        expect(Boolean(displayEntry.developmentStatus === 'development')).toBe(isDevManual);
        if (isDevManual) {
          expect(classData.developmentStatus).toBe('development');
          const demo = buildDemoClassResource(className);
          expect(demo.initialized).toBe(false);
          if (className !== 'Chaos Weaver') {
            expect(
              Boolean(
                classData.manualOnly ||
                  classData.resourceSystem?.manualOnly ||
                  classData.resourceSystem?.resourceDefinition?.manualOnly ||
                  classData.progression?.policy?.manualOnly
              )
            ).toBe(true);
            const authoredSpells = classData.spells || [];
            expect(authoredSpells.length).toBeGreaterThan(0);
            authoredSpells.forEach((spell) => {
              expect(spell.manualOnly).toBe(true);
              expect(spell.executionEnabled).toBe(false);
            });
            expect(
              classData.executionEnabled === false ||
                classData.resourceSystem?.executionEnabled === false ||
                authoredSpells.every((spell) => spell.executionEnabled === false)
            ).toBe(true);
          }
        } else {
          expect(classData.developmentStatus).toBeUndefined();
          expect(classData.manualOnly).toBeUndefined();
        }

        // Check 5: Registered class status is separate from native heritage access
        expect(provenance).toBeDefined();
        expect(resolveClassHeritageName(className)).toBe(className);
        const nativeIds = getClassNativeHeritageIds(className);
        if (NON_NATIVE_REGISTERED_CLASSES.includes(className)) {
          expect(nativeIds).toEqual([]);
          expect(summarizeHeritageEdgesForClass(className)).toEqual([]);
          expect(provenance.heritageEffectsImplemented).toBe(false);
        } else {
          expect(nativeIds.length).toBeGreaterThan(0);
        }

        // Check 6: Acquisition requirements are preserved and enforced by existing consumers
        expect(Array.isArray(provenance.requirements)).toBe(true);
        expect(provenance.requirements.length).toBeGreaterThan(0);
        if (classData.restrictions?.acquisition?.records) {
          const recordIds = classData.restrictions.acquisition.records.map((r) => r.id);
          expect(recordIds).toEqual(provenance.requirements);
        }

        const nonNativeHeritageId = Object.keys(HERITAGE_TRADITIONS).find(
          (hId) => !nativeIds.includes(hId)
        );
        const nonNativeRaceId = HERITAGE_TRADITIONS[nonNativeHeritageId].raceId;

        const defaultOutsiderAccess = getClassHeritageAccess(
          className,
          nonNativeRaceId,
          nonNativeHeritageId
        );
        expect(defaultOutsiderAccess.status).toBe('requires-qualification');
        expect(defaultOutsiderAccess.selectable).toBe(false);

        const qualifiedOutsiderAccess = getClassHeritageAccess(
          className,
          nonNativeRaceId,
          nonNativeHeritageId,
          {
            qualification: {
              verified: true,
              source: `Verified ${className} training`,
              fulfilledRequirements: provenance.requirements
            }
          }
        );
        expect(qualifiedOutsiderAccess.status).toBe('qualified-exception');
        expect(qualifiedOutsiderAccess.selectable).toBe(true);
      }
    );
  });

  describe('Compatibility Aliases & Legacy Character Stability (Checks 7–9)', () => {
    test.each(COMPATIBILITY_ALIAS_ENTRIES)(
      'compatibility alias %s resolves to %p without duplicating base classes',
      async (aliasName, { className, heritageId }) => {
        expect(BASE_CLASSES_DATA[aliasName]).toBeUndefined();
        expect(CLASS_DISPLAY_DATA.some((c) => c.name === aliasName)).toBe(false);
        expect(CLASS_DISPLAY_ALIASES.some((c) => c.name === aliasName)).toBe(true);

        const aliasData = ALL_CLASSES_DATA[aliasName];
        expect(aliasData).toBeDefined();
        expect(aliasData.name).toBe(className);
        expect(aliasData.variantName).toBe(aliasName);
        expect(aliasData.isCompatibilityAlias).toBe(true);
        expect(resolveClassHeritageName(aliasName)).toBe(className);
        expect(getClassNativeHeritageIds(aliasName)).toEqual([heritageId]);

        expect(typeof CLASS_DATA_LOADERS[aliasName]).toBe('function');
        const loaded = await CLASS_DATA_LOADERS[aliasName]();
        expect(loaded?.name).toBe(className);
        expect(loaded?.variantName).toBe(aliasName);

        expect(isClassCompatible(aliasName, 'myrathil', heritageId)).toBe(true);
        expect(isClassCompatible(aliasName, 'myrathil', 'shoreling_myrathil')).toBe(false);
      }
    );

    test.each(RECONSTRUCTION_COMPATIBILITY_ROWS)(
      'reconstruction compatibility row $legacyKey retains legacy resolution and forbids automatic conversion',
      ({ legacyKey, legacyNames, row }) => {
        expect(LEGACY_RECONSTRUCTION_KEYS).toContain(legacyKey);
        expect(RECONSTRUCTION_RELATIONSHIPS).toContain(row.relationship);
        expect(row.legacyResolutionRetained).toBe(true);
        expect(row.automaticConversion).toBe(false);
        expect(hasAutomaticConversion(legacyKey)).toBe(false);
        expect(getReconstructionCompatibility(legacyKey)).toEqual(row);
        expect(getReconstructionSuccessors(legacyKey)).toEqual(row.successors);

        legacyNames.forEach((legacyName) => {
          if (ALL_CLASSES_DATA[legacyName]) {
            expect(ALL_CLASSES_DATA[legacyName].name).toBeTruthy();
          }
        });
      }
    );
  });
});
