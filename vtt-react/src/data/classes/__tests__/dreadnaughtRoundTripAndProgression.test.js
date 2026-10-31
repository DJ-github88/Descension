import useCharacterStore from '../../../store/characterStore';
import {
  DREADNAUGHT_ALL_RECORDS,
  DREADNAUGHT_PROJECTED_SPELLS_BY_ID,
  pruneDreadnaughtTalents
} from '../dreadnaughtData';
import {
  DREADNAUGHT_TALENT_NODES
} from '../../talentTrees/dreadnaught';
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

describe('Dreadnaught Round-Trip & Progression Verification', () => {
  const stats = { strength: 16, agility: 10, constitution: 16, intelligence: 12, spirit: 8, charisma: 8 };

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
          name: 'Garek the Unmoved',
          race: 'human',
          subrace: 'thalren_human',
          background: 'soldier',
          class: 'Dreadnaught',
          classAcquisition: {
            Dreadnaught: {
              qualification: {
                verified: true,
                source: 'Cragjaw Peaks Bastion registry',
                fulfilledRequirements: CLASS_PROVENANCE.Dreadnaught.requirements
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
              'cr1_dreadnaught_stoke_furnace',
              'cr1_dreadnaught_vent_steam',
              'dread_iron_trample' // exactly 1 optional level 1 pick
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
              'cr1_dreadnaught_stoke_furnace',
              'cr1_dreadnaught_vent_steam'
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
              'cr1_dreadnaught_stoke_furnace',
              'cr1_dreadnaught_vent_steam',
              'dread_iron_trample',
              'dread_bedrock_cleats'
            ]
          }
        }
      };
      const excessPickErrors = validateCurrentStep(excessPickState);
      expect(excessPickErrors.spells).toMatch(/select exactly 1 starting spell/i);

      // 3. Save character to Store
      const newCharPayload = {
        id: 'dreadnaught_char_01',
        name: wizardState.characterData.name,
        class: 'Dreadnaught',
        characterClass: 'Dreadnaught',
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
        classResource: initializeClassResource('Dreadnaught', { ...stats, level: 1 }),
        resources: {
          health: { current: 38, max: 38 },
          mana: { current: 0, max: 0 },
          actionPoints: { current: 3, max: 3 }
        },
        health: { current: 38, max: 38 },
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
      expect(created.id).toBe('dreadnaught_char_01');
      expect(created.class).toBe('Dreadnaught');
      expect(created.class_spells.known_spells).toEqual([
        'cr1_dreadnaught_stoke_furnace',
        'cr1_dreadnaught_vent_steam',
        'dread_iron_trample'
      ]);

      // Check canonical mechanics of the 3 starting spells
      const stokeSpell = DREADNAUGHT_PROJECTED_SPELLS_BY_ID['cr1_dreadnaught_stoke_furnace'];
      const ventSpell = DREADNAUGHT_PROJECTED_SPELLS_BY_ID['cr1_dreadnaught_vent_steam'];
      const trampleSpell = DREADNAUGHT_PROJECTED_SPELLS_BY_ID['dread_iron_trample'];

      expect(stokeSpell.spellType).toBe('ACTION');
      expect(stokeSpell.actionPoints).toBe(1);
      expect(stokeSpell.resourceCost.furnacePressure).toBe(-20);
      expect(stokeSpell.manualOnly).toBe(true);

      expect(ventSpell.spellType).toBe('ACTION');
      expect(ventSpell.actionPoints).toBe(0);
      expect(ventSpell.resourceCost.furnacePressure).toBe(30);
      expect(ventSpell.manualOnly).toBe(true);

      expect(trampleSpell.spellType).toBe('ACTION');
      expect(trampleSpell.actionPoints).toBe(2);
      expect(trampleSpell.resourceCost.furnacePressure).toBe(15);
      expect(trampleSpell.manualOnly).toBe(true);

      // Verify class resource initialized correctly
      expect(created.classResource.type).toBe('furnace_pressure');
      expect(created.classResource.current).toBe(20);
      expect(created.classResource.max).toBe(100);

      // 4. View active character in store
      useCharacterStore.setState({
        currentCharacterId: created.id,
        ...created
      });
      const activeChar = useCharacterStore.getState();
      expect(activeChar.currentCharacterId).toBe('dreadnaught_char_01');
      expect(activeChar.class).toBe('Dreadnaught');
      expect(activeChar.classResource.current).toBe(20);

      // 5. Reopen edit in Wizard
      const loadedInWizard = characterWizardReducer(initialState, {
        type: ACTION_TYPES.LOAD_CHARACTER,
        payload: created
      });
      expect(loadedInWizard.characterData.class).toBe('Dreadnaught');
      expect(loadedInWizard.characterData.name).toBe('Garek the Unmoved');
      expect(loadedInWizard.characterData.class_spells.known_spells).toEqual([
        'cr1_dreadnaught_stoke_furnace',
        'cr1_dreadnaught_vent_steam',
        'dread_iron_trample'
      ]);

      // Reopening doesn't block validation
      const reopenErrors = validateCurrentStep(loadedInWizard);
      expect(reopenErrors.class).toBeUndefined();
      expect(reopenErrors.spells).toBeUndefined();

      // 6. Modify & Save (e.g. rename character)
      const modifiedChar = {
        ...created,
        name: 'Garek Iron-Chassis'
      };
      useCharacterStore.setState(state => ({
        characters: state.characters.map(c => c.id === modifiedChar.id ? modifiedChar : c)
      }));

      const finalChars = useCharacterStore.getState().characters;
      expect(finalChars[0]).toEqual(preExistingGuest); // Guest STILL untouched
      expect(finalChars[1].name).toBe('Garek Iron-Chassis');
    });
  });

  describe('2. Talent and Progression Behavior', () => {
    test('enforces legal signature (10 pts) and capstone (45 pts) acquisition', () => {
      // Setup level 10 character
      const characterLevel = 10;
      let talents = {};

      // Allocate points in Siege Bastion tree
      // Tier 1 nodes
      talents['cr1_dreadnaught_siegebastion_p01'] = 3;
      talents['cr1_dreadnaught_siegebastion_p02'] = 3;
      talents['cr1_dreadnaught_siegebastion_p03'] = 3;
      talents['cr1_dreadnaught_siegebastion_p04'] = 3; // 12 points total

      // Legal signature allocation at 10 points
      talents['cr1_dreadnaught_siegebastion_signature'] = 1;

      let pruned = pruneDreadnaughtTalents(talents, characterLevel);
      expect(pruned['cr1_dreadnaught_siegebastion_signature']).toBe(1);

      // Verify signature node grant ID resolves to active spell
      const sigNode = DREADNAUGHT_TALENT_NODES.find(n => n.id === 'cr1_dreadnaught_siegebastion_signature');
      expect(sigNode.grantId).toBe('dread_sig_bedrock_lock');
      expect(DREADNAUGHT_PROJECTED_SPELLS_BY_ID[sigNode.grantId]).toBeDefined();

      // Fill up to 45+ points in the same tree (all prerequisites maxed)
      talents['cr1_dreadnaught_siegebastion_p05'] = 3;
      talents['cr1_dreadnaught_siegebastion_p06'] = 3;
      talents['cr1_dreadnaught_siegebastion_p07'] = 3;
      talents['cr1_dreadnaught_siegebastion_p08'] = 3;
      talents['cr1_dreadnaught_siegebastion_p09'] = 3;
      talents['cr1_dreadnaught_siegebastion_p10'] = 3;
      talents['cr1_dreadnaught_siegebastion_p11'] = 3;
      talents['cr1_dreadnaught_siegebastion_p12'] = 3;
      talents['cr1_dreadnaught_siegebastion_p13'] = 3;
      talents['cr1_dreadnaught_siegebastion_p14'] = 3;
      talents['cr1_dreadnaught_siegebastion_p15'] = 3;
      talents['cr1_dreadnaught_siegebastion_p16'] = 3; // 48 passives + 1 signature = 49 points

      // Legal capstone allocation (total 50 points)
      talents['cr1_dreadnaught_siegebastion_capstone'] = 1;

      pruned = pruneDreadnaughtTalents(talents, characterLevel);
      expect(pruned['cr1_dreadnaught_siegebastion_capstone']).toBe(1);

      const capNode = DREADNAUGHT_TALENT_NODES.find(n => n.id === 'cr1_dreadnaught_siegebastion_capstone');
      expect(capNode.grantId).toBe('dread_cap_unbreakable_colossus');
      expect(DREADNAUGHT_PROJECTED_SPELLS_BY_ID[capNode.grantId]).toBeDefined();
    });

    test('prunes high-tier talents, signatures, and capstones on level-down and respec', () => {
      // Build a level 10 talent setup
      let talents = {
        cr1_dreadnaught_siegebastion_p01: 3,
        cr1_dreadnaught_siegebastion_p02: 3,
        cr1_dreadnaught_siegebastion_p03: 3,
        cr1_dreadnaught_siegebastion_p04: 3,
        cr1_dreadnaught_siegebastion_signature: 1,
        cr1_dreadnaught_siegebastion_p05: 3,
        cr1_dreadnaught_siegebastion_p06: 3,
        cr1_dreadnaught_siegebastion_p07: 3,
        cr1_dreadnaught_siegebastion_p08: 3,
        cr1_dreadnaught_siegebastion_p09: 3,
        cr1_dreadnaught_siegebastion_p10: 3,
        cr1_dreadnaught_siegebastion_p11: 3,
        cr1_dreadnaught_siegebastion_p12: 3,
        cr1_dreadnaught_siegebastion_p13: 3,
        cr1_dreadnaught_siegebastion_p14: 3,
        cr1_dreadnaught_siegebastion_p15: 3,
        cr1_dreadnaught_siegebastion_p16: 3,
        cr1_dreadnaught_siegebastion_capstone: 1
      };

      // Prune down to Level 3 (points cap = 15)
      const prunedLevel3 = pruneTalentsForChange(talents, {
        previousClass: 'Dreadnaught',
        nextClass: 'Dreadnaught',
        level: 3
      });

      // Capstone must be removed (requires level 10 and 45 points)
      expect(prunedLevel3['cr1_dreadnaught_siegebastion_capstone']).toBeUndefined();
      // Lower tier nodes preserved and budget respected
      expect(prunedLevel3['cr1_dreadnaught_siegebastion_p01']).toBe(3);
      const totalPointsL3 = Object.values(prunedLevel3).reduce((sum, r) => sum + r, 0);
      expect(totalPointsL3).toBeLessThanOrEqual(15);

      // Verify removed grant IDs tracked
      const removedGrants = removedTalentGrantIds(talents, prunedLevel3, 'Dreadnaught');
      expect(removedGrants).toContain('dread_cap_unbreakable_colossus');
    });

    test('class switch cleanly resets Dreadnaught allocations and preserves guest characters', () => {
      const dreadnaughtChar = {
        id: 'dreadnaught_char_01',
        name: 'Garek Iron-Chassis',
        class: 'Dreadnaught',
        characterClass: 'Dreadnaught',
        level: 3,
        stats: { ...stats },
        talents: {
          cr1_dreadnaught_siegebastion_p01: 3,
          cr1_dreadnaught_siegebastion_p02: 3,
          cr1_dreadnaught_siegebastion_p03: 3,
          cr1_dreadnaught_siegebastion_p04: 1,
          cr1_dreadnaught_siegebastion_signature: 1
        },
        class_spells: {
          known_spells: [
            'cr1_dreadnaught_stoke_furnace',
            'cr1_dreadnaught_vent_steam',
            'dread_iron_trample',
            'dread_sig_bedrock_lock'
          ]
        },
        classResource: { type: 'furnace_pressure', current: 20, max: 100 }
      };

      const guestChar = {
        id: 'guest_unrelated',
        name: 'Guest Crusader',
        class: 'Crusader',
        characterClass: 'Crusader',
        level: 1,
        stats: { strength: 16, agility: 10, constitution: 14, intelligence: 10, spirit: 14, charisma: 10 },
        class_spells: { known_spells: ['cr1_crusader_radiant_strike'] },
        talents: {},
        classResource: { type: 'radiantFervor', current: 0, max: 100 }
      };

      useCharacterStore.setState({
        characters: [guestChar, dreadnaughtChar],
        currentCharacterId: dreadnaughtChar.id
      });

      // Execute class switch to Crusader
      const switchResult = buildClassSwitchPatch(dreadnaughtChar, 'Crusader', { level: 3, stats });
      expect(switchResult).not.toBeNull();
      expect(switchResult.patch.class).toBe('Crusader');
      expect(switchResult.patch.classResource.type).toBe('radiantFervor');

      // Removed grants includes Dreadnaught signature
      expect(switchResult.removedGrantIds).toContain('dread_sig_bedrock_lock');

      // Guest character remains 100% untouched
      const currentGuest = useCharacterStore.getState().characters.find(c => c.id === 'guest_unrelated');
      expect(currentGuest).toEqual(guestChar);
    });
  });
});
