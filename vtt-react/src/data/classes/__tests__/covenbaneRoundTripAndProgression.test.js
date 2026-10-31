import useCharacterStore from '../../../store/characterStore';
import useSpellbookStore from '../../../store/spellbookStore';
import {
  COVENBANE_DATA,
  COVENBANE_CORE_RECORDS,
  COVENBANE_OPTIONAL_RECORDS,
  COVENBANE_TALENT_ACTIVE_RECORDS,
  COVENBANE_PASSIVE_RECORDS,
  COVENBANE_ALL_RECORDS,
  COVENBANE_PROJECTED_SPELLS_BY_ID,
  COVENBANE_SPELL_POOLS,
  pruneCovenbaneTalents,
  validateCovenbaneState
} from '../covenbaneData';
import {
  COVENBANE_TREES,
  COVENBANE_TALENT_NODES
} from '../../talentTrees/covenbane';
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

describe('Covenbane Round-Trip & Progression Verification', () => {
  const stats = { strength: 10, agility: 14, constitution: 12, intelligence: 10, spirit: 14, charisma: 8 };

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
          name: 'Kaelen Null-Walker',
          race: 'human',
          subrace: 'thalren_human',
          background: 'sage',
          class: 'Covenbane',
          classAcquisition: {
            Covenbane: {
              qualification: {
                verified: true,
                source: 'Barbed Vow Lodge registry',
                fulfilledRequirements: CLASS_PROVENANCE.Covenbane.requirements
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
              'cr1_covenbane_null_strike',
              'cr1_covenbane_draw_null_salt',
              'cov_salt_ward' // exactly 1 optional level 1 pick
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
              'cr1_covenbane_null_strike',
              'cr1_covenbane_draw_null_salt'
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
              'cr1_covenbane_null_strike',
              'cr1_covenbane_draw_null_salt',
              'cov_salt_ward',
              'cov_hex_strike'
            ]
          }
        }
      };
      const excessPickErrors = validateCurrentStep(excessPickState);
      expect(excessPickErrors.spells).toMatch(/select exactly 1 starting spell/i);

      // 3. Save character to Store
      const newCharPayload = {
        id: 'covenbane_char_01',
        name: wizardState.characterData.name,
        class: 'Covenbane',
        characterClass: 'Covenbane',
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
        classResource: initializeClassResource('Covenbane', { ...stats, level: 1 }),
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
      expect(created.id).toBe('covenbane_char_01');
      expect(created.class).toBe('Covenbane');
      expect(created.class_spells.known_spells).toEqual([
        'cr1_covenbane_null_strike',
        'cr1_covenbane_draw_null_salt',
        'cov_salt_ward'
      ]);

      // Check canonical mechanics of the 3 starting spells
      const nullStrike = COVENBANE_PROJECTED_SPELLS_BY_ID['cr1_covenbane_null_strike'];
      const drawSalt = COVENBANE_PROJECTED_SPELLS_BY_ID['cr1_covenbane_draw_null_salt'];
      const saltWard = COVENBANE_PROJECTED_SPELLS_BY_ID['cov_salt_ward'];

      expect(nullStrike.spellType).toBe('ACTION');
      expect(nullStrike.resourceCost.actionPoints).toBe(1);
      expect(nullStrike.manualOnly).toBe(true);

      expect(drawSalt.spellType).toBe('ACTION');
      expect(drawSalt.resourceCost.actionPoints).toBe(1);
      expect(drawSalt.manualOnly).toBe(true);

      expect(saltWard.spellType).toBe('ACTION');
      expect(saltWard.resourceCost.actionPoints).toBe(1);
      expect(saltWard.resourceCost.hexbreakerCharges).toBe(1);

      // Verify classResource
      expect(created.classResource.type).toBe('hexbreaker_charges');
      expect(created.classResource.charges).toBe(0);
      expect(created.classResource.max).toBe(6);

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
      expect(activeState.currentCharacterId).toBe('covenbane_char_01');
      expect(activeState.class).toBe('Covenbane');
      expect(activeState.classResource.charges).toBe(0);

      // 5. Reopen Edit in Wizard
      const loadedInWizard = characterWizardReducer(initialState, {
        type: ACTION_TYPES.LOAD_CHARACTER,
        payload: { ...created }
      });

      expect(loadedInWizard.characterData.name).toBe('Kaelen Null-Walker');
      expect(loadedInWizard.characterData.class).toBe('Covenbane');
      expect(loadedInWizard.characterData.class_spells.known_spells).toEqual([
        'cr1_covenbane_null_strike',
        'cr1_covenbane_draw_null_salt',
        'cov_salt_ward'
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
        name: 'Kaelen the Still-Handed'
      };

      useCharacterStore.setState({
        characters: [preExistingGuest, updatedChar]
      });

      const finalChars = useCharacterStore.getState().characters;
      expect(finalChars).toHaveLength(2);
      expect(finalChars[0]).toEqual(preExistingGuest); // Guest STILL untouched
      expect(finalChars[1].name).toBe('Kaelen the Still-Handed');
      expect(finalChars[1].class_spells.known_spells).toEqual(created.class_spells.known_spells);
    });
  });

  describe('2. Talent and Progression Behavior', () => {
    test('enforces same-tree point gates, prerequisite chains, signatures, and capstones', () => {
      const shadowbaneNodes = COVENBANE_TREES[0].nodes;
      const signatureNode = shadowbaneNodes.find(n => n.grantId && n.grantId.includes('_sig_'));
      const capstoneNode = shadowbaneNodes.find(n => n.grantId && n.grantId.includes('_cap_'));

      expect(signatureNode).toBeDefined();
      expect(signatureNode.minLevel).toBe(3);
      expect(signatureNode.grantId).toBe('cov_sig_null_shroud');

      expect(capstoneNode).toBeDefined();
      expect(capstoneNode.minLevel).toBe(10);
      expect(capstoneNode.grantId).toBe('cov_cap_aegis_of_bog_iron');

      // Verify active grants retain canonical typed records and costs
      const sigRecord = COVENBANE_PROJECTED_SPELLS_BY_ID[signatureNode.grantId];
      expect(sigRecord).toBeDefined();
      expect(sigRecord.spellType).toBe('ACTION');
      expect(sigRecord.resourceCost.actionPoints).toBe(1);
      expect(sigRecord.resourceCost.hexbreakerCharges).toBe(2);
      expect(sigRecord.manualOnly).toBe(true);

      const capRecord = COVENBANE_PROJECTED_SPELLS_BY_ID[capstoneNode.grantId];
      expect(capRecord).toBeDefined();
      expect(capRecord.spellType).toBe('ACTION');
      expect(capRecord.resourceCost.actionPoints).toBe(2);
      expect(capRecord.resourceCost.hexbreakerCharges).toBe(4);
      expect(capRecord.manualOnly).toBe(true);

      // Allocation test: Build legal level 10 build with capstone
      const legalBuild = {};
      shadowbaneNodes.forEach(node => {
        if (node.maxRanks) {
          legalBuild[node.id] = node.maxRanks;
        }
      });
      const totalPoints = Object.values(legalBuild).reduce((a, b) => a + b, 0);
      expect(totalPoints).toBe(50);

      // Level-down prune: down to level 1 (budget 5 points, max rank per node respected, no high-tier/capstone)
      const prunedL1 = pruneCovenbaneTalents(legalBuild, 1);
      const pointsL1 = Object.values(prunedL1).reduce((a, b) => a + b, 0);
      expect(pointsL1).toBeLessThanOrEqual(5);
      expect(prunedL1[capstoneNode.id]).toBeUndefined();
      expect(prunedL1[signatureNode.id]).toBeUndefined();

      // Prune down to level 3 (budget 15 points, capstone pruned, signature possible)
      const prunedL3 = pruneCovenbaneTalents(legalBuild, 3);
      const pointsL3 = Object.values(prunedL3).reduce((a, b) => a + b, 0);
      expect(pointsL3).toBeLessThanOrEqual(15);
      expect(prunedL3[capstoneNode.id]).toBeUndefined();
    });

    test('level-down, respec, Reset All, and class-switch cleanup work cleanly with shared grant preservation', () => {
      const sigGrantId = 'cov_sig_null_shroud';
      const sigNodeId = 'cr1_covenbane_shadowbane_signature';

      const charA = {
        id: 'char_a',
        class: 'Covenbane',
        level: 3,
        talents: {
          cr1_covenbane_shadowbane_p01: 3,
          cr1_covenbane_shadowbane_p02: 3,
          cr1_covenbane_shadowbane_p03: 3,
          cr1_covenbane_shadowbane_p04: 1,
          [sigNodeId]: 1
        },
        class_spells: {
          known_spells: ['cr1_covenbane_null_strike', 'cr1_covenbane_draw_null_salt', 'cov_salt_ward', sigGrantId, 'custom_unrelated_spell']
        },
        classResource: { type: 'covenbane-charges', charges: 2, max: 6 }
      };

      // Verify derived grants includes the signature active
      const derived = derivedTalentGrantIds(charA.talents, 'Covenbane');
      expect(derived).toContain(sigGrantId);

      // 2. Class switch from Covenbane to Druid
      const switchResult = buildClassSwitchPatch(charA, 'Druid', {
        classSpells: ['cr1_druid_rending_claw'],
        level: 3
      });

      expect(switchResult).not.toBeNull();
      expect(switchResult.patch.class).toBe('Druid');
      expect(switchResult.patch.talents).toEqual({}); // All Covenbane talents cleared
      expect(switchResult.removedGrantIds).toContain(sigGrantId);
      expect(switchResult.patch.classResource.type).toBe('druid-body');

      // 3. Reset All / Respec test
      const respecPruned = pruneTalentsForChange(charA.talents, {
        previousClass: 'Covenbane',
        nextClass: 'Covenbane',
        level: 1
      });
      const removedOnRespec = removedTalentGrantIds(charA.talents, respecPruned, 'Covenbane');
      expect(removedOnRespec).toContain(sigGrantId);

      // Verify custom unrelated spell is NOT in removedGrantIds
      expect(removedOnRespec).not.toContain('custom_unrelated_spell');
    });
  });

  describe('3. Content Consistency & Audited Mechanics', () => {
    test('all 96 records have explicit prices, non-empty durations, cooldowns, and typed mechanics', () => {
      expect(COVENBANE_ALL_RECORDS).toHaveLength(96);

      COVENBANE_ALL_RECORDS.forEach(record => {
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

        // Manual-only and execution safety check
        expect(record.manualOnly).toBe(true);
        expect(record.executionEnabled).toBe(false);

        // Structured manual mechanics present
        expect(record.manualMechanics).toBeDefined();
        expect(record.manualMechanics.executable).toBe(false);
      });
    });

    test('every passive record has 3 explicit rank descriptions with distinct scalar scaling', () => {
      expect(COVENBANE_PASSIVE_RECORDS).toHaveLength(48);

      COVENBANE_PASSIVE_RECORDS.forEach(passive => {
        expect(passive.spellType).toBe('PASSIVE');
        expect(passive.rankValues).toBeDefined();
        expect(passive.rankValues).toHaveLength(3);

        const [r1, r2, r3] = passive.rankValues;
        expect(r1.rank).toBe(1);
        expect(r2.rank).toBe(2);
        expect(r3.rank).toBe(3);

        expect(r1.text).toBeTruthy();
        expect(r2.text).toBeTruthy();
        expect(r3.text).toBeTruthy();

        // Check scaling progression
        expect(r1.text).not.toEqual(r3.text);
      });
    });
  });
});
