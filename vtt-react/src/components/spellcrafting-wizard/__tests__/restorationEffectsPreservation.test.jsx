/**
 * Restoration effect editor preservation & manual-execution guard tests.
 *
 * Covers:
 * 1) Opening RestorationEffects with an empty config (`{}`) or uninitialized parent sync
 *    does not wipe initialized fields (both via real Step3Effects and direct mounts/re-renders).
 * 2) Deliberate `0` and `false` values (overTimeDuration: 0, stage triggerAt: 0,
 *    isOverTime: false, isProgressiveOverTime: false, duration: 'over-time-only' / false)
 *    are preserved across UI edits, save, and reopen without `||` fallback coercion.
 * 3) Resource restoration remains manual (refused by client & server definitionFromWizard,
 *    reported as UNSUPPORTED by explainExecution) while remaining editable in the Wizard
 *    and usable as GM reference in the Spell Library.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import SpellWizardWrapper from '../SpellWizardWrapper';
import Step3Effects from '../components/steps/Step3Effects';
import RestorationEffects from '../data/effects/RestorationEffects';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import {
  SpellWizardProvider,
  useSpellWizardState,
  useSpellWizardDispatch,
  actionCreators
} from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import useSpellbookStore from '../../../store/spellbookStore';
import { definitionFromWizard as clientDefinitionFromWizard } from '../../../services/authoredAbility';
import { explainExecution, STATES } from '../utils/executionCompatibility';

const {
  definitionFromWizard: serverDefinitionFromWizard
} = require('../../../../../server/shared/services/authoredAbility');

if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', {
    value: require('crypto').webcrypto,
    configurable: true
  });
}

if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function getContext(type) {
    if (type !== '2d') return null;
    return {
      clearRect: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      scale: () => {},
      fillText: () => {},
      measureText: () => ({ width: 0 }),
      setLineDash: () => {}
    };
  };
}

let mockPersisted = null;
jest.mock('../../../persistence/spellLibraryScopedStorage', () => ({
  loadSpellLibraryData: () => mockPersisted,
  saveSpellLibraryData: (data) => {
    mockPersisted = JSON.parse(JSON.stringify(data));
  },
  loadCustomSpells: () => [],
  saveCustomSpells: () => {},
  loadDeletedSpellIds: () => [],
  saveDeletedSpellIds: () => {}
}));
jest.mock('../../../services/firebase/userSpellService', () => ({
  loadUserSpells: () => Promise.resolve([])
}));
jest.mock('../../../utils/assetManager', () => ({
  getIconUrl: () => 'test-icon.png',
  getAbilityIconUrl: () => 'test-icon.png',
  getCustomIconUrl: () => 'fallback-icon.png',
  getCreatureTokenIconUrl: () => 'test-icon.png'
}));
jest.mock('../../../utils/dialogService', () => ({
  showConfirm: () => Promise.resolve(true),
  showAlert: () => Promise.resolve(true),
  showPrompt: () => Promise.resolve(null)
}));
jest.mock('../../../store/authStore', () => {
  const authState = { user: { uid: 'restoration-test-author' } };
  const useAuthStore = (selector) => (typeof selector === 'function' ? selector(authState) : authState);
  useAuthStore.getState = () => authState;
  return { __esModule: true, default: useAuthStore };
});

const clone = (value) => JSON.parse(JSON.stringify(value));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let wizardProbe = null;
function WizardProbe() {
  wizardProbe = useSpellWizardState();
  return null;
}

const seedLibrary = (spells = []) => {
  mockPersisted = {
    version: 1,
    timestamp: '2026-01-01T00:00:00.000Z',
    data: {
      spells: clone(spells),
      categories: [{ id: 'uncategorized', name: 'Uncategorized', spellIds: spells.map((s) => s.id) }],
      collections: [],
      selectedSpell: null
    }
  };
};

const mountFullWizard = () => render(
  <CreatureLibraryProvider>
    <SpellLibraryProvider>
      <SpellWizardProvider>
        <SpellWizardWrapper />
        <WizardProbe />
      </SpellWizardProvider>
    </SpellLibraryProvider>
  </CreatureLibraryProvider>
);

const clickWizardStep = async (stepName) => {
  const nav = screen.getByRole('navigation', { name: 'Spell wizard steps' });
  const btn = within(nav).getByRole('button', { name: new RegExp(stepName, 'i') });
  await act(async () => {
    fireEvent.click(btn);
  });
  await waitFor(() => expect(btn).toHaveAttribute('aria-current', 'step'));
};

describe('RestorationEffects editor initialization & empty-config protection', () => {
  beforeEach(() => {
    mockPersisted = null;
    wizardProbe = null;
  });

  afterEach(() => {
    useSpellbookStore.setState({ wizardEditRequest: null });
  });

  it('opening Restoration inside real Step3Effects (which passes config={{}}) does not wipe initialized fields', async () => {
    render(
      <SpellWizardProvider>
        <Step3Effects
          onNext={() => {}}
          onPrevious={() => {}}
          stepNumber={3}
          totalSteps={10}
          isActive={true}
        />
        <WizardProbe />
      </SpellWizardProvider>
    );

    const restorationCardTitle = screen.getByText('Restoration', { selector: 'h3, h4, .card-title, .selection-card-title, div, span' });
    await act(async () => {
      fireEvent.click(restorationCardTitle);
    });

    // Wait past the historical 10ms timer window to verify nothing asynchronously wipes initialized state
    await act(async () => {
      await sleep(50);
    });

    expect(wizardProbe.effectTypes).toContain('restoration');
    expect(wizardProbe.restorationConfig).toEqual(expect.objectContaining({
      resourceType: 'mana',
      resolution: 'DICE',
      formula: '2d6 + INT',
      isOverTime: false,
      overTimeFormula: '1d4 + INT/2',
      overTimeDuration: 3,
      tickFrequency: 'round',
      application: 'start',
      scalingType: 'flat'
    }));

    // Editor controls reflect the initialized config instead of empty/undefined fields
    expect(screen.getByDisplayValue('2d6 + INT')).toBeInTheDocument();
    expect(screen.getByLabelText(/Enable instant restoration/i)).toBeChecked();
    expect(screen.getByLabelText(/Enable restoration over time/i)).not.toBeChecked();
    expect(screen.getByText('Basic Mana Recovery')).toBeInTheDocument();
  });

  it('empty config ({}) and uninitialized parent sync after open never wipe initialized fields', async () => {
    const initialized = {
      resourceType: 'health',
      resolution: 'CARDS',
      formula: 'CARD_VALUE + CON',
      duration: 'instant',
      isOverTime: true,
      overTimeFormula: '0',
      overTimeDuration: 0,
      tickFrequency: 'turn',
      application: 'end',
      scalingType: 'decreasing',
      overTimeTriggerType: 'periodic',
      isProgressiveOverTime: false,
      overTimeProgressiveStages: [{ triggerAt: 0, formula: '0', description: 'Opening pulse' }]
    };
    const dispatch = jest.fn();

    const { rerender } = render(
      <RestorationEffects
        state={{ restorationConfig: clone(initialized) }}
        dispatch={dispatch}
        actionCreators={actionCreators}
        effectId="effect_restoration"
        effectType="restoration"
        config={{}}
      />
    );

    await act(async () => {
      await sleep(50);
    });

    expect(screen.getByDisplayValue('CARD_VALUE + CON')).toBeInTheDocument();
    expect(screen.getByLabelText(/Enable restoration over time/i)).toBeChecked();
    const durationInput = document.querySelector('.over-time-duration input[type="number"]');
    expect(durationInput).toHaveValue(0);
    // Mounting with an already-initialized parent state must not dispatch an empty or overwriting payload
    expect(dispatch).not.toHaveBeenCalled();

    // Subsequent re-renders with fresh empty config ({}) or uninitialized parent state ({} / null) must not wipe fields
    rerender(
      <RestorationEffects
        state={{ restorationConfig: {} }}
        dispatch={dispatch}
        actionCreators={actionCreators}
        effectId="effect_restoration"
        effectType="restoration"
        config={{}}
      />
    );
    rerender(
      <RestorationEffects
        state={{ restorationConfig: null }}
        dispatch={dispatch}
        actionCreators={actionCreators}
        effectId="effect_restoration"
        effectType="restoration"
        config={{}}
      />
    );

    await act(async () => {
      await sleep(50);
    });

    expect(screen.getByDisplayValue('CARD_VALUE + CON')).toBeInTheDocument();
    expect(screen.getByLabelText(/Enable restoration over time/i)).toBeChecked();
    expect(document.querySelector('.over-time-duration input[type="number"]')).toHaveValue(0);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('opening with both empty state.restorationConfig and config={{}} initializes valid defaults and seeds parent', async () => {
    const dispatch = jest.fn();

    const { rerender } = render(
      <RestorationEffects
        state={{ restorationConfig: null }}
        dispatch={dispatch}
        actionCreators={actionCreators}
        effectId="effect_restoration"
        effectType="restoration"
        config={{}}
      />
    );

    expect(screen.getByDisplayValue('1d8 + INT')).toBeInTheDocument();
    expect(screen.getByLabelText(/Enable instant restoration/i)).toBeChecked();
    expect(screen.getByLabelText(/Enable restoration over time/i)).not.toBeChecked();

    expect(dispatch).toHaveBeenCalledTimes(1);
    const seededPayload = dispatch.mock.calls[0][0].payload;
    expect(seededPayload).toEqual(expect.objectContaining({
      resourceType: 'mana',
      resolution: 'DICE',
      formula: '1d8 + INT',
      duration: 'instant',
      isOverTime: false,
      overTimeDuration: 3,
      isProgressiveOverTime: false
    }));

    // Re-rendering with another empty {} config does not wipe seeded fields
    rerender(
      <RestorationEffects
        state={{ restorationConfig: seededPayload }}
        dispatch={dispatch}
        actionCreators={actionCreators}
        effectId="effect_restoration"
        effectType="restoration"
        config={{}}
      />
    );
    expect(screen.getByDisplayValue('1d8 + INT')).toBeInTheDocument();
  });

  it('late parent load after mount populates the editor and is not overwritten by delayed timers', async () => {
    const loadedConfig = {
      resourceType: 'action_points',
      resolution: 'COINS',
      formula: 'HEADS_COUNT + AGI',
      duration: 'instant',
      isOverTime: true,
      overTimeFormula: 'HEADS_COUNT',
      overTimeDuration: 0,
      tickFrequency: 'turn',
      application: 'end',
      scalingType: 'flat',
      overTimeTriggerType: 'periodic',
      isProgressiveOverTime: false,
      overTimeProgressiveStages: []
    };

    function LateLoadHarness() {
      const state = useSpellWizardState();
      const dispatch = useSpellWizardDispatch();
      React.useEffect(() => {
        dispatch(actionCreators.loadSpell({
          effectTypes: ['restoration'],
          restorationConfig: clone(loadedConfig)
        }));
      }, [dispatch]);
      wizardProbe = state;
      return (
        <RestorationEffects
          state={state}
          dispatch={dispatch}
          actionCreators={actionCreators}
          effectId="effect_restoration"
          effectType="restoration"
          config={{}}
        />
      );
    }

    render(
      <SpellWizardProvider>
        <LateLoadHarness />
      </SpellWizardProvider>
    );

    await act(async () => {
      await sleep(50);
    });

    expect(wizardProbe.restorationConfig).toEqual(loadedConfig);
    expect(screen.getByDisplayValue('HEADS_COUNT + AGI')).toBeInTheDocument();
    expect(document.querySelector('.over-time-duration input[type="number"]')).toHaveValue(0);
  });
});

describe('RestorationEffects deliberate 0 and false preservation', () => {
  jest.setTimeout(30000);

  beforeEach(() => {
    mockPersisted = null;
    wizardProbe = null;
  });

  afterEach(() => {
    useSpellbookStore.setState({ wizardEditRequest: null });
  });

  it('preserves deliberate 0 and false values during direct edits without || fallback coercion', async () => {
    const initialConfig = {
      resourceType: 'mana',
      resolution: 'DICE',
      formula: '2d6 + INT',
      duration: 'over-time-only',
      isOverTime: true,
      overTimeFormula: '0',
      overTimeDuration: 3,
      tickFrequency: 'round',
      application: 'start',
      scalingType: 'flat',
      overTimeTriggerType: 'periodic',
      isProgressiveOverTime: false,
      overTimeProgressiveStages: [{ triggerAt: 2, formula: '0', description: '' }],
      manualNote: { gmAdjudicates: 'restore resource manually' }
    };

    function EditHarness() {
      const state = useSpellWizardState();
      const dispatch = useSpellWizardDispatch();
      const [ready, setReady] = React.useState(false);
      React.useEffect(() => {
        dispatch(actionCreators.loadSpell({
          effectTypes: ['restoration'],
          restorationConfig: clone(initialConfig)
        }));
        setReady(true);
      }, [dispatch]);
      wizardProbe = state;
      return ready ? (
        <RestorationEffects
          state={state}
          dispatch={dispatch}
          actionCreators={actionCreators}
          effectId="effect_restoration"
          effectType="restoration"
          config={{}}
        />
      ) : null;
    }

    render(
      <SpellWizardProvider>
        <EditHarness />
      </SpellWizardProvider>
    );

    await waitFor(() => expect(document.querySelector('.over-time-duration input[type="number"]')).toBeInTheDocument());

    // Instant restoration stays unchecked for duration: 'over-time-only'
    expect(screen.getByLabelText(/Enable instant restoration/i)).not.toBeChecked();

    // Explicitly set overTimeDuration to 0 (must not coerce 0 -> 3)
    const durationInput = document.querySelector('.over-time-duration input[type="number"]');
    await act(async () => {
      fireEvent.change(durationInput, { target: { value: '0' } });
    });
    expect(durationInput).toHaveValue(0);
    expect(wizardProbe.restorationConfig.overTimeDuration).toBe(0);

    // Enable progressive stages and set Stage 1 triggerAt explicitly to 0 (must not coerce 0 -> 1)
    const progressiveToggle = document.querySelector('.progressive-formula input[type="checkbox"]');
    await act(async () => {
      fireEvent.click(progressiveToggle);
    });
    const triggerAtInput = document.querySelector('.stage-field input[type="number"]');
    expect(triggerAtInput).toBeInTheDocument();
    await act(async () => {
      fireEvent.change(triggerAtInput, { target: { value: '0' } });
    });
    expect(triggerAtInput).toHaveValue(0);
    expect(wizardProbe.restorationConfig.overTimeProgressiveStages[0].triggerAt).toBe(0);

    // Explicitly toggle isProgressiveOverTime to false and isOverTime to false
    await act(async () => {
      fireEvent.click(progressiveToggle);
    });
    const overTimeToggle = screen.getByLabelText(/Enable restoration over time/i);
    await act(async () => {
      fireEvent.click(overTimeToggle);
    });

    // Edit an unrelated field (resourceType -> Action Points) and verify all 0/false values survive
    await act(async () => {
      fireEvent.click(screen.getByText('Action Points'));
    });

    expect(wizardProbe.restorationConfig).toEqual(expect.objectContaining({
      resourceType: 'action_points',
      duration: 'over-time-only',
      isOverTime: false,
      overTimeFormula: '0',
      overTimeDuration: 0,
      isProgressiveOverTime: false,
      overTimeProgressiveStages: [{ triggerAt: 0, formula: '0', description: '' }],
      manualNote: { gmAdjudicates: 'restore resource manually' }
    }));
  });

  it('does not coerce deliberate falsy values (duration: false, overTimeDuration: 0, numeric 0 formula) via || fallbacks', async () => {
    const dispatch = jest.fn();
    render(
      <RestorationEffects
        state={{
          restorationConfig: {
            resourceType: 'health',
            resolution: 'DICE',
            formula: 0,
            duration: false,
            isOverTime: true,
            overTimeFormula: 0,
            overTimeDuration: 0,
            tickFrequency: 'round',
            application: 'start',
            scalingType: 'flat',
            overTimeTriggerType: 'periodic',
            isProgressiveOverTime: false,
            overTimeProgressiveStages: []
          }
        }}
        dispatch={dispatch}
        actionCreators={actionCreators}
        effectId="effect_restoration"
        effectType="restoration"
        config={{}}
      />
    );

    // duration: false must NOT be coerced to instant restoration enabled
    expect(screen.getByLabelText(/Enable instant restoration/i)).not.toBeChecked();
    expect(document.querySelector('.over-time-duration input[type="number"]')).toHaveValue(0);

    // Turning progressive over-time on initializes Stage 1 from overTimeFormula (0) rather than coercing 0 -> default formula
    const progressiveToggle = document.querySelector('.progressive-formula input[type="checkbox"]');
    await act(async () => {
      fireEvent.click(progressiveToggle);
    });

    const lastPayload = dispatch.mock.calls[dispatch.mock.calls.length - 1][0].payload;
    expect(lastPayload.duration).toBe(false);
    expect(lastPayload.formula).toBe(0);
    expect(lastPayload.overTimeFormula).toBe(0);
    expect(lastPayload.overTimeDuration).toBe(0);
    expect(lastPayload.overTimeProgressiveStages[0].formula).toBe(0);
  });

  it('deliberate 0 and false values survive full Wizard edit -> Finalize -> reopen -> Step 3 -> Finalize, and resource restoration remains manual', async () => {
    const initialSpell = {
      id: 'fx-restoration-zero-false',
      name: 'Manual Wellspring',
      description: 'GM-adjudicated resource restoration spell with deliberate zero and false settings.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['restoration'],
      effectsMap: { restoration: true },
      typeConfig: { school: 'arcane', icon: 'spell_holy_holybolt', castTimeType: 'IMMEDIATE', tags: ['restoration'] },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        maxTargets: 1,
        targetRestrictions: ['ally'],
        selectionMethod: 'manual',
        targetSelectionMethod: 'manual',
        aoeShape: 'circle',
        aoeType: 'sphere',
        aoeParameters: {},
        movementBehavior: 'static'
      },
      resourceCost: {
        actionPoints: 1,
        actionPointsSelected: true,
        mana: 4,
        components: [],
        materialComponents: '',
        resourceTypes: ['mana', 'actionPoints'],
        resourceValues: { mana: 4, actionPoints: 1 },
        resourceFormulas: {},
        useFormulas: {}
      },
      restorationConfig: {
        resourceType: 'mana',
        resolution: 'DICE',
        formula: '2d6 + INT',
        duration: 'instant',
        isOverTime: true,
        overTimeFormula: '0',
        overTimeDuration: 0,
        tickFrequency: 'turn',
        application: 'end',
        scalingType: 'flat',
        overTimeTriggerType: 'periodic',
        isProgressiveOverTime: false,
        overTimeProgressiveStages: [{ triggerAt: 0, formula: '0', description: 'Zero-round stage' }],
        manualNote: { gmAdjudicates: 'GM applies resource gain manually' }
      },
      dateCreated: '2026-01-01T00:00:00.000Z',
      lastModified: '2026-01-01T00:00:00.000Z',
      categoryIds: ['uncategorized']
    };

    seedLibrary([initialSpell]);
    useSpellbookStore.setState({
      wizardEditRequest: { spell: clone(initialSpell), guard: { isCurrent: () => true } }
    });

    const view1 = mountFullWizard();

    // Open Step 3 (Effects) — RestorationEffects mounts with Step3Effects' config={{}}
    await clickWizardStep('Effects');
    await act(async () => {
      await sleep(50);
    });

    // Initialized fields and deliberate 0 / false survived opening with empty config
    expect(screen.getByDisplayValue('2d6 + INT')).toBeInTheDocument();
    expect(document.querySelector('.over-time-duration input[type="number"]')).toHaveValue(0);
    expect(document.querySelector('.progressive-formula input[type="checkbox"]')).not.toBeChecked();

    // Edit formula and explicitly toggle overTime off (deliberate false) while keeping overTimeDuration: 0
    const formulaInput = screen.getByDisplayValue('2d6 + INT');
    await act(async () => {
      fireEvent.change(formulaInput, { target: { value: '3d6 + INT' } });
    });
    await act(async () => {
      fireEvent.click(screen.getByLabelText(/Enable restoration over time/i));
    });

    // Save via production Finalize / Update control
    const beforeSave1 = JSON.stringify(mockPersisted);
    await act(async () => {
      fireEvent.click(screen.getByTitle(/Finalize|Update/i));
    });
    await waitFor(() => expect(JSON.stringify(mockPersisted)).not.toBe(beforeSave1));

    const savedFirst = clone(mockPersisted.data.spells[0]);
    expect(savedFirst.restorationConfig).toEqual(expect.objectContaining({
      resourceType: 'mana',
      resolution: 'DICE',
      formula: '3d6 + INT',
      duration: 'instant',
      isOverTime: false,
      overTimeFormula: '0',
      overTimeDuration: 0,
      tickFrequency: 'turn',
      application: 'end',
      isProgressiveOverTime: false,
      overTimeProgressiveStages: [{ triggerAt: 0, formula: '0', description: 'Zero-round stage' }],
      manualNote: { gmAdjudicates: 'GM applies resource gain manually' }
    }));
    expect(savedFirst.authoredDraft.restorationConfig).toEqual(savedFirst.restorationConfig);
    expect(JSON.parse(savedFirst.serializedData).restorationConfig).toEqual(savedFirst.restorationConfig);

    // Resource restoration remains manual on BOTH client and server validators
    const clientCompilation = clientDefinitionFromWizard(clone(savedFirst), {
      roomId: 'room-restoration-test',
      definitionVersion: 1,
      classId: 'arcanoneer'
    });
    const serverCompilation = serverDefinitionFromWizard(clone(savedFirst), {
      roomId: 'room-restoration-test',
      definitionVersion: 1,
      classId: 'arcanoneer'
    });
    expect(clientCompilation.ok).toBe(false);
    expect(serverCompilation.ok).toBe(false);

    const executionExplanation = explainExecution(clone(savedFirst), {
      roomId: 'room-restoration-test',
      definitionVersion: 1,
      classId: 'arcanoneer',
      shared: true
    });
    expect(executionExplanation.state).toBe(STATES.UNSUPPORTED);
    expect(executionExplanation.automated).toEqual([]);
    expect(executionExplanation.preserved.map((item) => item.key)).toContain('restoration');

    // Reopen from persisted library into a fresh Wizard mount, revisit Step 3, and save again
    view1.unmount();
    useSpellbookStore.setState({
      wizardEditRequest: { spell: clone(savedFirst), guard: { isCurrent: () => true } }
    });
    const view2 = mountFullWizard();

    await clickWizardStep('Effects');
    await act(async () => {
      await sleep(50);
    });

    expect(screen.getByDisplayValue('3d6 + INT')).toBeInTheDocument();
    expect(screen.getByLabelText(/Enable restoration over time/i)).not.toBeChecked();
    expect(wizardProbe.restorationConfig.overTimeDuration).toBe(0);
    expect(wizardProbe.restorationConfig.isOverTime).toBe(false);
    expect(wizardProbe.restorationConfig.isProgressiveOverTime).toBe(false);
    expect(wizardProbe.restorationConfig.overTimeProgressiveStages).toEqual([
      { triggerAt: 0, formula: '0', description: 'Zero-round stage' }
    ]);

    // Second no-op Finalize after reopen preserves the exact restorationConfig
    const beforeSave2 = JSON.stringify(mockPersisted);
    await act(async () => {
      fireEvent.click(screen.getByTitle(/Finalize|Update/i));
    });
    await waitFor(() => expect(JSON.stringify(mockPersisted)).not.toBe(beforeSave2));
    const savedSecond = clone(mockPersisted.data.spells[0]);
    expect(savedSecond.restorationConfig).toEqual(savedFirst.restorationConfig);
    expect(savedSecond.authoredDraft.restorationConfig).toEqual(savedFirst.restorationConfig);

    // Still usable as GM reference in the Spell Library card view
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Spell Library/i }));
    });
    await act(async () => {
      fireEvent.keyDown(screen.getByRole('button', { name: 'Manual Wellspring details' }), { key: 'Enter' });
    });
    await waitFor(() => {
      expect(screen.queryAllByText(/3d6 \+ INT/i).length).toBeGreaterThan(0);
    });

    view2.unmount();
  });
});
