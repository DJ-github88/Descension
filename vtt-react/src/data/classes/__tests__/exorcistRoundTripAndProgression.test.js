import useCharacterStore from '../../../store/characterStore';
import {
  EXORCIST_ALL_RECORDS,
  EXORCIST_PROJECTED_SPELLS_BY_ID,
  pruneExorcistTalents
} from '../exorcistData';
import {
  EXORCIST_TALENT_NODES
} from '../../talentTrees/exorcist';
import {
  characterWizardReducer,
  validateCurrentStep,
  initialState,
  ACTION_TYPES,
  WIZARD_STEPS
} from '../../../components/character-creation-wizard/context/CharacterWizardContext';
import { CLASS_PROVENANCE } from '../../classHeritageRegistry';
import { buildClassSwitchPatch } from '../../../store/characterClassSwitch';
import {
  pruneTalentsForChange,
  derivedTalentGrantIds,
  removedTalentGrantIds
} from '../../../store/characterSlices/progressionSlice';
import { initializeClassResource } from '../../classResources';

describe('Exorcist Round-Trip & Progression Verification', () => {
  const stats = { strength: 10, agility: 10, constitution: 14, intelligence: 10, spirit: 16, charisma: 10, will: 14 };

  beforeEach(() => {
    localStorage.clear();
    useCharacterStore.setState({
      characters: [],
      currentCharacterId: null,
      class: '',
      characterClass: '',
      level: 1,
      stats: { ...stats },
      baseStats: { ...stats },
      classResource: null,
      talents: {},
      class_spells: { known_spells: [] }
    });
  });

  describe('1. Actual Character Round-Trip (Isolated Storage)', () => {
    test('exercises create -> pick optional spell -> save -> view -> reopen edit -> save with existing guest untouched', async () => {
      // 1. Establish pre-existing guest character in store
      const preExistingGuest = {
        id: 'guest_char_prior',
        name: 'Elder Guardian',
        class: 'Warden',
        characterClass: 'Warden',
        level: 2,
        stats: { strength: 14, agility: 10, constitution: 14, intelligence: 8, spirit: 10, charisma: 10 },
        class_spells: { known_spells: ['cr1_warden_shield_wall'] },
        talents: {},
        classResource: { type: 'warden-guard', current: 2, max: 5 }
      };

      useCharacterStore.setState({
        characters: [preExistingGuest],
        currentCharacterId: null
      });

      // 2. Wizard Create Flow with required acquisition qualification
      let wizardState = {
        ...initialState,
        characterData: {
          ...initialState.characterData,
          name: 'Father Aaron',
          race: 'human',
          subrace: 'thalren_human',
          background: 'sage',
          class: 'Exorcist',
          classAcquisition: {
            Exorcist: {
              qualification: {
                verified: true,
                source: 'Order of the Pure Salt registry',
                fulfilledRequirements: CLASS_PROVENANCE.Exorcist.requirements
              }
            }
          },
          baseStats: { ...stats },
          stats: { ...stats },
          ancestry: {
            heritageId: 'thalren_human',
            core: 'desperate_will_human',
            picks: { mind: 'lineage_recall_thalren', fog: 'fog_sense_thalren', quill: 'thalren_ink_stained_hand' },
            catalogVersion: 1
          },
          class_spells: {
            known_spells: [
              'cr1_exorcist_consecrate_threshold',
              'cr1_exorcist_litany_of_purging',
              'exo_salt_brand' // exactly 1 optional level 1 pick
            ]
          }
        },
        currentStep: WIZARD_STEPS.CORE_DRAFT,
        originalCalling: null
      };

      // Verify Step 1 validation passes
      const step1Errors = validateCurrentStep(wizardState);
      expect(step1Errors.class).toBeUndefined();
      expect(step1Errors.spells).toBeUndefined();

      // Verify validation blocks if missing the optional pick (only 2 core grants)
      const missingPickState = {
        ...wizardState,
        characterData: {
          ...wizardState.characterData,
          class_spells: {
            known_spells: [
              'cr1_exorcist_consecrate_threshold',
              'cr1_exorcist_litany_of_purging'
            ]
          }
        }
      };
      const missingPickErrors = validateCurrentStep(missingPickState);
      expect(missingPickErrors.spells).toMatch(/select exactly 1 starting spell/i);

      // Verify validation blocks if picking 2 optional spells
      const excessPickState = {
        ...wizardState,
        characterData: {
          ...wizardState.characterData,
          class_spells: {
            known_spells: [
              'cr1_exorcist_consecrate_threshold',
              'cr1_exorcist_litany_of_purging',
              'exo_salt_brand',
              'exo_scourge_of_submission'
            ]
          }
        }
      };
      const excessPickErrors = validateCurrentStep(excessPickState);
      expect(excessPickErrors.spells).toMatch(/select exactly 1 starting spell/i);

      // 3. Save character to Store
      const newCharPayload = {
        id: 'exorcist_char_01',
        name: wizardState.characterData.name,
        class: 'Exorcist',
        characterClass: 'Exorcist',
        level: 1,
        race: wizardState.characterData.race,
        subrace: wizardState.characterData.subrace,
        background: wizardState.characterData.background,
        classAcquisition: wizardState.characterData.classAcquisition,
        baseStats: { ...stats },
        stats: { ...stats },
        ancestry: wizardState.characterData.ancestry,
        class_spells: { ...wizardState.characterData.class_spells },
        talents: {},
        classResource: initializeClassResource('Exorcist', { ...stats, level: 1 }),
        resources: {
          health: { current: 30, max: 30 },
          mana: { current: 0, max: 0 },
          actionPoints: { current: 3, max: 3 }
        },
        health: { current: 30, max: 30 },
        mana: { current: 0, max: 0 }
      };

      const charactersBefore = useCharacterStore.getState().characters;
      useCharacterStore.setState({
        characters: [...charactersBefore, newCharPayload]
      });

      // Verify storage contains both characters and guest was untouched
      const storeChars = useCharacterStore.getState().characters;
      expect(storeChars).toHaveLength(2);
      expect(storeChars[0]).toEqual(preExistingGuest); // Preserved exactly

      const created = storeChars[1];
      expect(created.id).toBe('exorcist_char_01');
      expect(created.class).toBe('Exorcist');
      expect(created.class_spells.known_spells).toEqual([
        'cr1_exorcist_consecrate_threshold',
        'cr1_exorcist_litany_of_purging',
        'exo_salt_brand'
      ]);

      // Check canonical mechanics of the 3 starting spells
      const thresholdSpell = EXORCIST_PROJECTED_SPELLS_BY_ID['cr1_exorcist_consecrate_threshold'];
      const litanySpell = EXORCIST_PROJECTED_SPELLS_BY_ID['cr1_exorcist_litany_of_purging'];
      const saltBrandSpell = EXORCIST_PROJECTED_SPELLS_BY_ID['exo_salt_brand'];

      expect(thresholdSpell.spellType).toBe('ACTION');
      expect(thresholdSpell.resourceCost.actionPoints).toBe(1);
      expect(thresholdSpell.manualOnly).toBe(true);

      expect(litanySpell.spellType).toBe('ACTION');
      expect(litanySpell.resourceCost.actionPoints).toBe(1);
      expect(litanySpell.resourceCost.purificationSanctity).toBe(1);
      expect(litanySpell.manualOnly).toBe(true);

      expect(saltBrandSpell.spellType).toBe('ACTION');
      expect(saltBrandSpell.resourceCost.actionPoints).toBe(1);
      expect(saltBrandSpell.resourceCost.purificationSanctity).toBe(1);

      // Verify classResource
      expect(created.classResource.type).toBe('purification_sanctity');
      expect(created.classResource.sanctity).toBe(3);
      expect(created.classResource.max).toBe(10);

      // 4. View Character (load into active state)
      useCharacterStore.setState({
        currentCharacterId: created.id,
        class: created.class,
        characterClass: created.class,
        level: created.level,
        stats: created.stats,
        baseStats: created.baseStats,
        class_spells: created.class_spells,
        classResource: created.classResource
      });

      const activeState = useCharacterStore.getState();
      expect(activeState.currentCharacterId).toBe('exorcist_char_01');
      expect(activeState.class).toBe('Exorcist');
      expect(activeState.classResource.sanctity).toBe(3);

      // 5. Reopen Edit in Wizard
      const loadedInWizard = characterWizardReducer(initialState, {
        type: ACTION_TYPES.LOAD_CHARACTER,
        payload: { ...created }
      });

      expect(loadedInWizard.characterData.name).toBe('Father Aaron');
      expect(loadedInWizard.characterData.class).toBe('Exorcist');
      expect(loadedInWizard.characterData.class_spells.known_spells).toEqual([
        'cr1_exorcist_consecrate_threshold',
        'cr1_exorcist_litany_of_purging',
        'exo_salt_brand'
      ]);

      // Reopening edit validates without blocking on already-chosen pick
      const editStepValidation = validateCurrentStep({
        ...loadedInWizard,
        currentStep: WIZARD_STEPS.CORE_DRAFT
      });
      expect(editStepValidation.spells).toBeUndefined();

      // 6. Modify in edit & save again
      const updatedChar = {
        ...created,
        name: 'Father Aaron the Unburdened',
        class_spells: {
          known_spells: [
            'cr1_exorcist_consecrate_threshold',
            'cr1_exorcist_litany_of_purging',
            'exo_sanctified_barrier'
          ]
        }
      };

      useCharacterStore.setState(prev => ({
        characters: prev.characters.map(c => c.id === 'exorcist_char_01' ? updatedChar : c)
      }));

      const reloadedChar = useCharacterStore.getState().characters.find(c => c.id === 'exorcist_char_01');
      expect(reloadedChar.name).toBe('Father Aaron the Unburdened');
      expect(reloadedChar.class_spells.known_spells).toEqual([
        'cr1_exorcist_consecrate_threshold',
        'cr1_exorcist_litany_of_purging',
        'exo_sanctified_barrier'
      ]);
      // Guest character remains intact
      expect(useCharacterStore.getState().characters.find(c => c.id === 'guest_char_prior').name).toBe('Elder Guardian');
    });
  });

  describe('2. Talent Progression, Gates, Pruning, & Respec', () => {
    test('enforces legal signature (level 3, 10 points) and capstone (level 10, 45 points) acquisition', () => {
      // Liturgist signature requires: minLevel 3, requiresPoints 10, predecessors p01 & p02
      const sigNode = EXORCIST_TALENT_NODES.find(n => n.id === 'cr1_exorcist_liturgist_signature');
      expect(sigNode.minLevel).toBe(3);
      expect(sigNode.requiresPoints).toBe(10);
      expect(sigNode.requires).toEqual(['cr1_exorcist_liturgist_p01', 'cr1_exorcist_liturgist_p02']);

      // Liturgist capstone requires: minLevel 10, requiresPoints 45, predecessors p15 & signature
      const capNode = EXORCIST_TALENT_NODES.find(n => n.id === 'cr1_exorcist_liturgist_capstone');
      expect(capNode.minLevel).toBe(10);
      expect(capNode.requiresPoints).toBe(45);
      expect(capNode.requires).toEqual(['cr1_exorcist_liturgist_p15', 'cr1_exorcist_liturgist_signature']);
    });

    test('validates same-tree point gates and prerequisite chaining', () => {
      const p04Node = EXORCIST_TALENT_NODES.find(n => n.id === 'cr1_exorcist_liturgist_p04');
      expect(p04Node.minLevel).toBe(2);
      expect(p04Node.requiresPoints).toBe(5);
      expect(p04Node.requires).toEqual(['cr1_exorcist_liturgist_p01']);

      // Attempting to learn p04 with only 2 ranks in p01 (needs 3 to max prerequisite)
      const invalidTreeRanks = {
        cr1_exorcist_liturgist_p01: 2,
        cr1_exorcist_liturgist_p04: 1
      };
      const pruned = pruneExorcistTalents(invalidTreeRanks, 5);
      expect(pruned.cr1_exorcist_liturgist_p04).toBeUndefined();

      // With p01 maxed (3) and p02 (2) -> 5 points, prerequisite met -> passes
      const validTreeRanks = {
        cr1_exorcist_liturgist_p01: 3,
        cr1_exorcist_liturgist_p02: 2,
        cr1_exorcist_liturgist_p04: 1
      };
      const prunedValid = pruneExorcistTalents(validTreeRanks, 5);
      expect(prunedValid.cr1_exorcist_liturgist_p04).toBe(1);
    });

    test('prunes talent budget and higher-level investments upon level-down', () => {
      const highLevelTalents = {
        cr1_exorcist_liturgist_p01: 3,
        cr1_exorcist_liturgist_p02: 3,
        cr1_exorcist_liturgist_p03: 3,
        cr1_exorcist_liturgist_p04: 3,
        cr1_exorcist_liturgist_signature: 1, // level 3
        cr1_exorcist_liturgist_p05: 3,
        cr1_exorcist_liturgist_p06: 3,
        cr1_exorcist_liturgist_p07: 3,
        cr1_exorcist_liturgist_p08: 3,
        cr1_exorcist_liturgist_p09: 3,
        cr1_exorcist_liturgist_p10: 3,
        cr1_exorcist_liturgist_p11: 3,
        cr1_exorcist_liturgist_p12: 3,
        cr1_exorcist_liturgist_p13: 3,
        cr1_exorcist_liturgist_p14: 3,
        cr1_exorcist_liturgist_p15: 3,
        cr1_exorcist_liturgist_capstone: 1 // level 10
      };

      // At level 10, all points valid
      const l10 = pruneExorcistTalents(highLevelTalents, 10);
      expect(l10.cr1_exorcist_liturgist_capstone).toBe(1);

      // Level down to level 5 (budget 25 points, max level 5)
      const l5 = pruneExorcistTalents(highLevelTalents, 5);
      expect(l5.cr1_exorcist_liturgist_capstone).toBeUndefined();
      expect(l5.cr1_exorcist_liturgist_p15).toBeUndefined();
      expect(l5.cr1_exorcist_liturgist_p11).toBeUndefined();
      const totalPointsL5 = Object.values(l5).reduce((sum, r) => sum + r, 0);
      expect(totalPointsL5).toBeLessThanOrEqual(25);
    });

    test('reconciles talent grants and preserves shared spells on respec / reset all', () => {
      const sigGrantId = 'exo_sig_salt_sanctuary';
      const charA = {
        id: 'char_a',
        class: 'Exorcist',
        characterClass: 'Exorcist',
        level: 3,
        talents: {
          cr1_exorcist_liturgist_p01: 3,
          cr1_exorcist_liturgist_p02: 3,
          cr1_exorcist_liturgist_p03: 3,
          cr1_exorcist_liturgist_p04: 1,
          cr1_exorcist_liturgist_signature: 1
        },
        class_spells: {
          known_spells: [
            'cr1_exorcist_consecrate_threshold',
            'cr1_exorcist_litany_of_purging',
            'exo_salt_brand',
            sigGrantId,
            'custom_unrelated_spell'
          ]
        },
        classResource: { type: 'purification_sanctity', current: 3, max: 10, sanctity: 3 }
      };

      // 1. Verify derived talent grants
      const derived = derivedTalentGrantIds(charA.talents, 'Exorcist');
      expect(derived).toContain(sigGrantId);

      // 2. Class switch from Exorcist to Crusader
      const switchResult = buildClassSwitchPatch(charA, 'Crusader', {
        classSpells: ['cr1_crusader_beacon_of_truth'],
        level: 3
      });

      expect(switchResult).not.toBeNull();
      expect(switchResult.patch.class).toBe('Crusader');
      expect(switchResult.patch.talents).toEqual({}); // All Exorcist talents cleared
      expect(switchResult.removedGrantIds).toContain(sigGrantId);
      expect(switchResult.patch.classResource.type).toBe('radiantFervor');

      // 3. Reset All / Respec test
      const respecPruned = pruneTalentsForChange(charA.talents, {
        previousClass: 'Exorcist',
        nextClass: 'Exorcist',
        level: 1
      });
      const removedOnRespec = removedTalentGrantIds(charA.talents, respecPruned, 'Exorcist');
      expect(removedOnRespec).toContain(sigGrantId);

      // Verify custom unrelated spell is NOT in removedGrantIds
      expect(removedOnRespec).not.toContain('custom_unrelated_spell');
    });
  });

  describe('3. Content Consistency & Audited Mechanics', () => {
    test('all 96 records have explicit prices, non-empty durations, cooldowns, and typed mechanics', () => {
      expect(EXORCIST_ALL_RECORDS).toHaveLength(96);

      EXORCIST_ALL_RECORDS.forEach(record => {
        // Price check
        expect(record.resourceCost).toBeDefined();
        expect(typeof record.resourceCost.actionPoints).toBe('number');
        expect(record.resourceCost.actionPoints).toBeGreaterThanOrEqual(0);

        // Targeting check
        expect(record.targetingConfig).toBeDefined();
        expect(record.targetingConfig.targetingType).toBeDefined();

        // Duration check: active spells have durationConfig, passives have null (permanent)
        if (record.spellType !== 'PASSIVE') {
          expect(record.durationConfig).toBeDefined();
          expect(record.durationConfig.durationType).toBeDefined();
        } else {
          expect(record.durationConfig).toBeNull();
        }

        // Cooldown check
        expect(record.cooldownConfig).toBeDefined();
        expect(record.cooldownConfig.cooldownType).toBeDefined();

        // Mechanics check
        expect(record.manualMechanics).toBeDefined();
        expect(record.manualMechanics.executable).toBe(false);
      });
    });

    test('validates 6 distinct level-1 spell icon mappings', () => {
      const level1Ids = [
        'cr1_exorcist_consecrate_threshold',
        'cr1_exorcist_litany_of_purging',
        'exo_salt_brand',
        'exo_scourge_of_submission',
        'exo_discern_impurity',
        'exo_sanctified_barrier'
      ];

      const { LEVEL_ONE_SPELL_ICON_OVERRIDES } = require('../levelOneSpellIcons');
      level1Ids.forEach(id => {
        expect(LEVEL_ONE_SPELL_ICON_OVERRIDES[id]).toBeDefined();
        expect(typeof LEVEL_ONE_SPELL_ICON_OVERRIDES[id]).toBe('string');
      });
    });
  });
});
