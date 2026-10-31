import useCharacterStore from '../../../store/characterStore';
import {
  BLADEDANCER_DATA,
  BLADEDANCER_PROJECTED_SPELLS_BY_ID,
  pruneBladedancerTalents,
  validateBladedancerState
} from '../bladedancerData';
import {
  INSCRIPTOR_DATA,
  INSCRIPTOR_PROJECTED_SPELLS_BY_ID,
  pruneInscriptorTalents,
  validateInscriptorState
} from '../inscriptorData';
import {
  TOTEMIST_DATA,
  TOTEMIST_PROJECTED_SPELLS_BY_ID,
  pruneTotemistTalents,
  validateTotemistState
} from '../totemistData';
import {
  WITCH_DOCTOR_DATA,
  WITCH_DOCTOR_PROJECTED_SPELLS_BY_ID,
  pruneWitchDoctorTalents,
  validateWitchDoctorState
} from '../witchDoctorData';
import {
  characterWizardReducer,
  validateCurrentStep,
  initialState,
  ACTION_TYPES,
  WIZARD_STEPS
} from '../../../components/character-creation-wizard/context/CharacterWizardContext';
import { CLASS_PROVENANCE } from '../../classHeritageRegistry';
import { initializeClassResource } from '../../classResources';

describe('Restored Classes (Bladedancer, Inscriptor, Totemist, Witch Doctor) Round-Trip & Progression', () => {
  const stats = { strength: 12, agility: 14, constitution: 12, intelligence: 12, spirit: 14, charisma: 10 };

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

  describe('1. Character Round-Trip in Isolated Storage', () => {
    const classesToTest = [
      {
        name: 'Bladedancer',
        coreGrants: ['cr1_bladedancer_kinetic_strike', 'cr1_bladedancer_fluid_pivot'],
        optionalPick: 'bd_whirling_parry',
        resourceType: 'bladedancer_momentum',
        initialField: 'momentum',
        initialVal: 0
      },
      {
        name: 'Inscriptor',
        coreGrants: ['cr1_inscriptor_etch_glyph', 'cr1_inscriptor_discharge_rune'],
        optionalPick: 'insc_warding_script',
        resourceType: 'runic_resonance',
        initialField: 'resonance',
        initialVal: 0
      },
      {
        name: 'Totemist',
        coreGrants: ['cr1_totemist_place_conduit', 'cr1_totemist_reclaim_conduit'],
        optionalPick: 'tot_hearth_ember',
        resourceType: 'totemic_attunement',
        initialField: 'attunement',
        initialVal: 0
      },
      {
        name: 'Witch Doctor',
        coreGrants: ['cr1_witch_doctor_bog_hex', 'cr1_witch_doctor_render_tallow'],
        optionalPick: 'wd_effigy_of_clay',
        resourceType: 'bog_tallow',
        initialField: 'tallow',
        initialVal: 50
      }
    ];

    classesToTest.forEach(cfg => {
      test(`exercises create -> pick optional -> save -> view -> reopen edit for ${cfg.name}`, () => {
        // Pre-existing guest
        const preExistingGuest = {
          id: 'prior_guest_01',
          name: 'Old Guard',
          class: 'Warden',
          characterClass: 'Warden',
          level: 3,
          stats: { ...stats },
          class_spells: { known_spells: ['cr1_warden_shield_wall'] },
          talents: {},
          classResource: { type: 'warden-guard', current: 2, max: 5 }
        };

        useCharacterStore.setState({
          characters: [preExistingGuest],
          currentCharacterId: null
        });

        // 1. Wizard Create Flow
        const provenance = CLASS_PROVENANCE[cfg.name] || {};
        const wizardState = {
          ...initialState,
          characterData: {
            ...initialState.characterData,
            name: `Hero of ${cfg.name}`,
            race: 'human',
            subrace: 'thalren_human',
            background: 'sage',
            class: cfg.name,
            classAcquisition: {
              [cfg.name]: {
                qualification: {
                  verified: true,
                  source: 'Grand Guild Provenance Registry',
                  fulfilledRequirements: provenance.requirements || []
                }
              }
            },
            baseStats: { ...stats },
            stats: { ...stats },
            class_spells: {
              known_spells: [...cfg.coreGrants, cfg.optionalPick]
            }
          },
          currentStep: WIZARD_STEPS.CORE_DRAFT
        };

        // Step 1 validation must pass with exactly 2 core + 1 optional
        const step1Errors = validateCurrentStep(wizardState);
        expect(step1Errors.class).toBeUndefined();
        expect(step1Errors.spells).toBeUndefined();

        // 2. Save character to Store
        const charId = `${cfg.name.toLowerCase().replace(/\s+/g, '_')}_001`;
        const newCharPayload = {
          id: charId,
          name: wizardState.characterData.name,
          class: cfg.name,
          characterClass: cfg.name,
          level: 1,
          stats: { ...stats },
          baseStats: { ...stats },
          class_spells: { ...wizardState.characterData.class_spells },
          talents: {},
          classResource: initializeClassResource(cfg.name, { ...stats, level: 1 }),
          resources: {
            health: { current: 30, max: 30 },
            mana: { current: 20, max: 20 },
            actionPoints: { current: 3, max: 3 }
          },
          health: { current: 30, max: 30 },
          mana: { current: 20, max: 20 }
        };

        const charsBefore = useCharacterStore.getState().characters;
        useCharacterStore.setState({
          characters: [...charsBefore, newCharPayload]
        });

        // Verify storage contains both characters and guest was untouched
        const storeChars = useCharacterStore.getState().characters;
        expect(storeChars).toHaveLength(2);
        expect(storeChars[0]).toEqual(preExistingGuest);

        const created = storeChars[1];
        expect(created.id).toBe(charId);
        expect(created.class).toBe(cfg.name);
        expect(created.class_spells.known_spells).toEqual([...cfg.coreGrants, cfg.optionalPick]);
        expect(created.classResource.type).toBe(cfg.resourceType);
        expect(created.classResource[cfg.initialField]).toBe(cfg.initialVal);

        // 3. View character
        useCharacterStore.setState({
          currentCharacterId: created.id,
          class: created.class,
          characterClass: created.class,
          level: created.level,
          stats: created.stats,
          class_spells: created.class_spells,
          classResource: created.classResource
        });

        const active = useCharacterStore.getState();
        expect(active.currentCharacterId).toBe(charId);
        expect(active.class).toBe(cfg.name);

        // 4. Reopen Edit in Wizard
        const loadedInWizard = characterWizardReducer(initialState, {
          type: ACTION_TYPES.LOAD_CHARACTER,
          payload: { ...created }
        });
        expect(loadedInWizard.characterData.name).toBe(`Hero of ${cfg.name}`);
        expect(loadedInWizard.characterData.class).toBe(cfg.name);
        expect(loadedInWizard.characterData.class_spells.known_spells).toEqual([...cfg.coreGrants, cfg.optionalPick]);
      });
    });
  });

  describe('2. Progression & Talent Behavior', () => {
    test('Bladedancer: level-down pruning and tree gate behavior', () => {
      const fullAllocation = {
        cr1_bladedancer_flm_p01: 3,
        cr1_bladedancer_flm_p02: 3,
        cr1_bladedancer_flm_signature: 1,
        cr1_bladedancer_flm_capstone: 1
      };
      const pruned = pruneBladedancerTalents(fullAllocation, 1);
      expect(pruned.cr1_bladedancer_flm_capstone).toBeUndefined();
      expect(pruned.cr1_bladedancer_flm_signature).toBeUndefined();
      expect(pruned.cr1_bladedancer_flm_p01).toBe(3);
    });

    test('Inscriptor: level-down pruning and tree gate behavior', () => {
      const fullAllocation = {
        cr1_inscriptor_rnb_p01: 3,
        cr1_inscriptor_rnb_p02: 3,
        cr1_inscriptor_rnb_signature: 1,
        cr1_inscriptor_rnb_capstone: 1
      };
      const pruned = pruneInscriptorTalents(fullAllocation, 1);
      expect(pruned.cr1_inscriptor_rnb_capstone).toBeUndefined();
      expect(pruned.cr1_inscriptor_rnb_signature).toBeUndefined();
      expect(pruned.cr1_inscriptor_rnb_p01).toBe(3);
    });

    test('Totemist: level-down pruning and tree gate behavior', () => {
      const fullAllocation = {
        cr1_totemist_hrk_p01: 3,
        cr1_totemist_hrk_p02: 3,
        cr1_totemist_hrk_signature: 1,
        cr1_totemist_hrk_capstone: 1
      };
      const pruned = pruneTotemistTalents(fullAllocation, 1);
      expect(pruned.cr1_totemist_hrk_capstone).toBeUndefined();
      expect(pruned.cr1_totemist_hrk_signature).toBeUndefined();
      expect(pruned.cr1_totemist_hrk_p01).toBe(3);
    });

    test('Witch Doctor: level-down pruning and tree gate behavior', () => {
      const fullAllocation = {
        cr1_witch_doctor_hxb_p01: 3,
        cr1_witch_doctor_hxb_p02: 3,
        cr1_witch_doctor_hxb_signature: 1,
        cr1_witch_doctor_hxb_capstone: 1
      };
      const pruned = pruneWitchDoctorTalents(fullAllocation, 1);
      expect(pruned.cr1_witch_doctor_hxb_capstone).toBeUndefined();
      expect(pruned.cr1_witch_doctor_hxb_signature).toBeUndefined();
      expect(pruned.cr1_witch_doctor_hxb_p01).toBe(3);
    });
  });
});
