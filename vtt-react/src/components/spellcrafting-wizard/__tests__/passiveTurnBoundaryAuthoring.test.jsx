/**
 * Passive Turn-Boundary Authoring — Mounted Step7Triggers & Compatibility Proof
 *
 * Authors two distinct PASSIVE spells through real mounted Step7Triggers controls:
 *   1. Dawnstride Stance (turn_start, whose_turn: 'self', movement +10 ft "Dawnstride", gm-manual)
 *   2. Oathkeeper's Bulwark (turn_end, whose_turn: 'enemy', damageReduction +3 DR "Oathkeeper Guard", gm-manual)
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Step4Targeting from '../components/steps/Step4Targeting';
import Step7Triggers from '../components/steps/Step7Triggers';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import { SpellWizardProvider, useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import useTriggerFormatters from '../components/common/useTriggerFormatters';
import { definitionFromWizard, PASSIVE_ENTRY_CAPABILITY, PASSIVE_TURN_CAPABILITY, PASSIVE_TURN_TRIGGER } from '../../../services/authoredAbility';
import { explain as explainTriggerPlan } from '../../../services/executionPlan';
import { buildCanonicalSpellRecord } from '../utils/canonicalSpellSave';
import { explainExecution, STATES } from '../utils/executionCompatibility';
import { buildSpellBehaviorModel } from '../components/common/spellBehaviorPresentation';

if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
}

if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function (type) {
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
      ellipse: () => {},
      fill: () => {},
      stroke: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      rotate: () => {},
      scale: () => {},
      fillText: () => {},
      measureText: () => ({ width: 0 }),
      setLineDash: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} })
    };
  };
}

jest.mock('../../../persistence/spellLibraryScopedStorage', () => ({
  loadSpellLibraryData: () => null,
  saveSpellLibraryData: () => {},
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

const clone = (value) => JSON.parse(JSON.stringify(value));

const EMPTY_TRIGGERS = {
  global: { logicType: 'AND', compoundTriggers: [] },
  effectTriggers: {},
  conditionalEffects: {},
  buffDebuffTriggers: {},
  requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
  triggerRole: { mode: 'CONDITIONAL' }
};

function makePassiveDraft({
  name,
  description,
  authoredCondition,
  targetingType = 'single'
}) {
  return {
    name,
    description,
    level: 1,
    spellType: 'PASSIVE',
    typeConfig: { school: 'sacred', tags: ['passive'], toggleable: false },
    effectTypes: ['control'],
    effectsMap: { control: true },
    controlConfig: { authoredCondition },
    targetingConfig: {
      targetingType,
      rangeType: 'self',
      rangeDistance: 0,
      targetRestrictions: ['self'],
      maxTargets: 1,
      selectionMethod: 'manual',
      targetSelectionMethod: 'manual',
      aoeShape: '',
      aoeType: '',
      aoeParameters: {},
      movementBehavior: 'static'
    },
    resourceCost: {
      actionPoints: 0,
      actionPointsSelected: false,
      mana: 0,
      resourceTypes: [],
      resourceValues: { actionPoints: 0, mana: 0 }
    },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
    triggerConfig: clone(EMPTY_TRIGGERS)
  };
}

function buildSavedRecordFromState(state, definitionId) {
  const draft = {
    name: state.name,
    description: state.description,
    level: state.level,
    spellType: state.spellType,
    typeConfig: clone(state.typeConfig),
    effectTypes: clone(state.effectTypes),
    effectsMap: clone(state.effectsMap),
    controlConfig: clone(state.controlConfig),
    targetingConfig: clone(state.targetingConfig),
    resourceCost: clone(state.resourceCost),
    cooldownConfig: clone(state.cooldownConfig),
    triggerConfig: clone(state.triggerConfig)
  };
  return {
    ...clone(draft),
    authoredDraft: clone(draft),
    authoredDefinitionId: definitionId,
    serializedData: JSON.stringify(draft)
  };
}

function Step7Harness({ initialDraft, onStateChange }) {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  const [seeded, setSeeded] = React.useState(false);

  React.useEffect(() => {
    if (!seeded) {
      dispatch(actionCreators.loadSpell(clone(initialDraft)));
      setSeeded(true);
    }
  }, [seeded, initialDraft, dispatch]);

  React.useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  if (!seeded || state.spellType !== 'PASSIVE') return null;

  return (
    <Step7Triggers
      stepNumber={7}
      totalSteps={10}
      onNext={() => {}}
      onPrevious={() => {}}
    />
  );
}

describe('Mounted Step7Triggers — passive turn-boundary authoring', () => {
  afterEach(() => {
    cleanup();
  });

  test('authors Dawnstride Stance (turn_start, whose_turn defaults to self) and compiles to executable passive', async () => {
    const draft = makePassiveDraft({
      name: 'Dawnstride Stance',
      description: 'Gain +10 ft speed at the start of my turn until GM clears.',
      targetingType: 'single',
      authoredCondition: {
        profile: 'authored-effect:v1',
        effect: 'movement',
        movementFeet: 10,
        label: 'Dawnstride',
        expiryPolicy: 'gm-manual',
        durationText: 'Until the GM clears it',
        gmNote: 'Automatic self movement bonus at self turn start.'
      }
    });

    let latestState = null;
    render(
      <CreatureLibraryProvider>
        <SpellLibraryProvider>
          <SpellWizardProvider>
            <Step7Harness initialDraft={draft} onStateChange={(s) => { latestState = s; }} />
          </SpellWizardProvider>
        </SpellLibraryProvider>
      </CreatureLibraryProvider>
    );

    const timeCategory = await screen.findByRole('button', { name: /Time & Turns/i });
    await act(async () => { fireEvent.click(timeCategory); });

    const turnStartCard = Array.from(document.querySelectorAll('.wow-trigger-option'))
      .find((el) => el.querySelector('.wow-trigger-option-title')?.textContent?.trim() === 'Turn Start');
    expect(turnStartCard).toBeTruthy();
    await act(async () => { fireEvent.click(turnStartCard); });

    await waitFor(() => {
      const triggers = latestState?.triggerConfig?.global?.compoundTriggers || [];
      expect(triggers).toHaveLength(1);
      expect(triggers[0].id).toBe('turn_start');
      expect(triggers[0].category).toBe('time');
      expect(triggers[0].parameters).toEqual({ whose_turn: 'self' });
    });

    // Verify mounted Step7 summary text and standalone formatter both read whose_turn accurately
    const summaryEl = document.querySelector('.pf-trigger-summary');
    expect(summaryEl?.textContent).toMatch(/When my turn starts/i);
    const { formatTriggerText } = useTriggerFormatters({ spell: latestState, library: null });
    expect(formatTriggerText(latestState.triggerConfig.global.compoundTriggers[0])).toBe('When my turn starts');

    const record = buildSavedRecordFromState(latestState, '11111111-1111-4111-8111-111111111111');
    const compiled = definitionFromWizard(clone(record), { roomId: 'room-1', definitionVersion: 1, classId: 'crusader' });
    expect(compiled.ok).toBe(true);
    expect(compiled.definition.schemaVersion).toBe(11);
    expect(compiled.definition.capability).toBe(PASSIVE_TURN_CAPABILITY);
    expect(compiled.definition.targeting).toEqual({ kind: 'self', restriction: 'self' });
    expect(compiled.definition.trigger).toEqual({ kind: 'turn_start', whoseTurn: 'self', contract: PASSIVE_TURN_TRIGGER });
    expect(compiled.definition.effects).toEqual({ direct: null, condition: { kind: 'movement', feet: 10, label: 'Dawnstride' } });

    const compat = explainExecution(clone(record));
    expect(compat.state).toBe(STATES.PARTIAL);
    expect(compat.reasons).toEqual([]);

    const plan = explainTriggerPlan(clone(record), compiled);
    expect(plan.wholeExecutable).toBe(true);
    expect(plan.heading).toBe('Passive turn-boundary trigger');
    expect(plan.flow.join(' ')).toMatch(/no 8-second reaction declaration window/i);

    const behavior = buildSpellBehaviorModel(clone(record));
    const activationStep = behavior.steps.find((s) => s.id === 'activation');
    expect(activationStep.label).toBe('WHILE ACTIVE');
    expect(activationStep.summary).toMatch(/self turn start/i);
  });

  test('authors Oathkeeper\'s Bulwark (turn_end, whose_turn: enemy -> +3 DR) and refuses unsupported variants', async () => {
    const draft = makePassiveDraft({
      name: 'Oathkeeper\'s Bulwark',
      description: 'When an enemy finishes their turn, gain +3 DR until GM clears.',
      targetingType: 'self',
      authoredCondition: {
        profile: 'authored-effect:v1',
        effect: 'damageReduction',
        drAmount: 3,
        label: 'Oathkeeper Guard',
        expiryPolicy: 'gm-manual',
        durationText: 'Until the GM clears it',
        gmNote: 'Automatic self flat DR when enemy ends turn.'
      }
    });

    let latestState = null;
    render(
      <CreatureLibraryProvider>
        <SpellLibraryProvider>
          <SpellWizardProvider>
            <Step7Harness initialDraft={draft} onStateChange={(s) => { latestState = s; }} />
          </SpellWizardProvider>
        </SpellLibraryProvider>
      </CreatureLibraryProvider>
    );

    const timeCategory = await screen.findByRole('button', { name: /Time & Turns/i });
    await act(async () => { fireEvent.click(timeCategory); });

    const turnEndCard = Array.from(document.querySelectorAll('.wow-trigger-option'))
      .find((el) => el.querySelector('.wow-trigger-option-title')?.textContent?.trim() === 'Turn End');
    expect(turnEndCard).toBeTruthy();
    await act(async () => { fireEvent.click(turnEndCard); });

    const select = await waitFor(() => {
      const s = document.querySelector('.pf-select-wrapper select.pf-select');
      expect(s).toBeTruthy();
      expect(s.value).toBe('self');
      return s;
    });
    await act(async () => { fireEvent.change(select, { target: { value: 'enemy' } }); });

    await waitFor(() => {
      expect(latestState?.triggerConfig?.global?.compoundTriggers[0]?.parameters?.whose_turn).toBe('enemy');
      expect(document.querySelector('.pf-trigger-summary')?.textContent).toMatch(/When enemy's turn ends/i);
    });
    const { formatTriggerText } = useTriggerFormatters({ spell: latestState, library: null });
    expect(formatTriggerText(latestState.triggerConfig.global.compoundTriggers[0])).toBe("When enemy's turn ends");

    const record = buildSavedRecordFromState(latestState, '22222222-2222-4222-8222-222222222222');
    const compiled = definitionFromWizard(clone(record), { roomId: 'room-1', definitionVersion: 1, classId: 'crusader' });
    expect(compiled.ok).toBe(true);
    expect(compiled.definition.trigger).toEqual({ kind: 'turn_end', whoseTurn: 'enemy', contract: PASSIVE_TURN_TRIGGER });
    expect(compiled.definition.effects).toEqual({ direct: null, condition: { kind: 'damageReduction', amount: 3, label: 'Oathkeeper Guard' } });
    const compat2 = explainExecution(clone(record));
    expect(compat2.state).toBe(STATES.PARTIAL);
    expect(compat2.reasons).toEqual([]);

    // Unsupported variants remain cleanly refused
    const withCompound = clone(record);
    withCompound.triggerConfig.global.compoundTriggers.push(clone(withCompound.triggerConfig.global.compoundTriggers[0]));
    withCompound.authoredDraft = clone(withCompound);
    expect(definitionFromWizard(withCompound, { roomId: 'r', definitionVersion: 1, classId: 'crusader' }).ok).toBe(false);
    expect(explainExecution(withCompound).state).toBe(STATES.UNSUPPORTED);

    const blankWhose = clone(record);
    blankWhose.triggerConfig.global.compoundTriggers[0].parameters.whose_turn = '';
    blankWhose.authoredDraft = clone(blankWhose);
    expect(definitionFromWizard(blankWhose, { roomId: 'r', definitionVersion: 1, classId: 'crusader' }).ok).toBe(false);

    const enemyTarget = clone(record);
    enemyTarget.targetingConfig.targetRestrictions = ['enemy'];
    enemyTarget.authoredDraft = clone(enemyTarget);
    expect(definitionFromWizard(enemyTarget, { roomId: 'r', definitionVersion: 1, classId: 'crusader' }).ok).toBe(false);

    const asAction = clone(record);
    asAction.spellType = 'ACTION';
    asAction.authoredDraft = clone(asAction);
    expect(definitionFromWizard(asAction, { roomId: 'r', definitionVersion: 1, classId: 'crusader' }).ok).toBe(false);
  });
});

function Step4Harness({ initialDraft, onStateChange }) {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  const [seeded, setSeeded] = React.useState(false);

  React.useEffect(() => {
    if (!seeded) {
      dispatch(actionCreators.loadSpell(clone(initialDraft)));
      setSeeded(true);
    }
  }, [seeded, initialDraft, dispatch]);

  React.useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  if (!seeded || state.spellType !== initialDraft.spellType) return null;

  return (
    <Step4Targeting
      stepNumber={4}
      totalSteps={10}
      onNext={() => {}}
      onPrevious={() => {}}
    />
  );
}

function renderStep4(initialDraft) {
  let latestState = null;
  const onStateChange = (s) => { latestState = s; };
  render(
    <CreatureLibraryProvider>
      <SpellLibraryProvider>
        <SpellWizardProvider>
          <Step4Harness initialDraft={initialDraft} onStateChange={onStateChange} />
        </SpellWizardProvider>
      </SpellLibraryProvider>
    </CreatureLibraryProvider>
  );
  return () => latestState;
}

function makeFreshTurnDraft({
  name = 'Dawnstride Stance',
  triggerId = 'turn_start',
  triggerName = 'Turn Start',
  whoseTurn = 'self',
  targetingConfig = {},
  extraTriggers = []
} = {}) {
  return {
    name,
    description: 'Gain +10 ft movement speed at turn boundary.',
    level: 1,
    spellType: 'PASSIVE',
    typeConfig: { school: 'arcane', tags: ['passive'], toggleable: false },
    effectTypes: ['control'],
    effectsMap: { control: true },
    controlConfig: {
      authoredCondition: {
        profile: 'authored-effect:v1',
        effect: 'movement',
        movementFeet: 10,
        label: 'Dawnstride',
        expiryPolicy: 'gm-manual',
        durationText: 'Until GM removes',
        gmNote: 'GM removes Dawnstride manually.'
      }
    },
    targetingMode: 'unified',
    targetingConfig,
    resourceCost: {
      actionPoints: 0,
      actionPointsSelected: false,
      mana: 0,
      resourceTypes: [],
      resourceValues: { actionPoints: 0, mana: 0 }
    },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
    triggerConfig: {
      global: {
        logicType: 'AND',
        compoundTriggers: [
          { id: triggerId, category: 'time', name: triggerName, parameters: { whose_turn: whoseTurn } },
          ...extraTriggers
        ]
      },
      effectTriggers: {},
      conditionalEffects: {},
      buffDebuffTriggers: {},
      requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
      triggerRole: { mode: 'CONDITIONAL' }
    }
  };
}

describe('Mounted Step4Targeting — passive turn-boundary vs movement-entry targeting', () => {
  afterEach(() => {
    cleanup();
  });

  test('supported turn passive defaults to Self, builds clean record, and compiles to authored-passive-turn:v1', async () => {
    const getState = renderStep4(makeFreshTurnDraft());

    const selfCard = await screen.findByText('Self', { selector: '.targeting-option-name' });
    expect(selfCard.closest('.targeting-option-card')).toHaveClass('selected');
    expect(screen.getByText('Self-Centered', { selector: '.targeting-option-name' })).toBeInTheDocument();
    expect(screen.getByText(/Self-targeted effects always affect only the caster/i)).toBeInTheDocument();
    expect(screen.queryByText('Target Restrictions')).not.toBeInTheDocument();
    expect(screen.queryByText('Area of Effect Configuration')).not.toBeInTheDocument();
    expect(screen.queryByText('Propagation Method')).not.toBeInTheDocument();

    await act(async () => { fireEvent.click(selfCard); });

    await waitFor(() => {
      const t = getState()?.targetingConfig;
      expect(t?.targetingType).toBe('self');
      expect(t?.rangeType).toBe('self');
      expect(t?.rangeDistance).toBe(0);
      expect(t?.targetRestrictions).toEqual(['self']);
      expect(t?.aoeParameters).toEqual({});
    });

    const record = buildCanonicalSpellRecord({ wizardState: clone(getState()) });
    expect(record.authoredDraft.targetingConfig.targetingType).toBe('self');
    expect(record.authoredDraft.targetingConfig.rangeType).toBe('self');
    expect(record.authoredDraft.targetingConfig.rangeDistance).toBe(0);
    expect(record.authoredDraft.targetingConfig.targetRestrictions).toEqual(['self']);
    expect(record.authoredDraft.targetingConfig.aoeParameters).toEqual({});

    const compiled = definitionFromWizard(record, { roomId: 'room-1', definitionVersion: 1, classId: 'arcanoneer' });
    expect(compiled.ok).toBe(true);
    expect(compiled.definition.capability).toBe(PASSIVE_TURN_CAPABILITY);
    expect(compiled.definition.targeting).toEqual({ kind: 'self', restriction: 'self' });
    expect(compiled.definition.trigger).toEqual({ kind: 'turn_start', whoseTurn: 'self', contract: PASSIVE_TURN_TRIGGER });
    expect(explainExecution(record).state).toBe(STATES.PARTIAL);
    expect(explainExecution(record).reasons).toEqual([]);
  });

  test('switching from Self-Centered to Self clears radius/enemy restrictions and compiles', async () => {
    const getState = renderStep4(makeFreshTurnDraft({
      triggerId: 'turn_end',
      triggerName: 'Turn End',
      whoseTurn: 'enemy',
      targetingConfig: {
        targetingType: 'self_centered',
        rangeType: 'self_centered',
        rangeDistance: 0,
        aoeShape: 'circle',
        aoeParameters: { radius: 10 },
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        selectionMethod: 'manual',
        targetSelectionMethod: 'manual',
        movementBehavior: 'static'
      }
    }));

    const targetingTypeSection = await screen.findByText('Targeting Type', { selector: '.targeting-section-title' });
    const typeScope = within(targetingTypeSection.closest('.targeting-section'));
    const selfCenteredCard = await typeScope.findByText('Self-Centered', { selector: '.targeting-option-name' });
    expect(selfCenteredCard.closest('.targeting-option-card')).toHaveClass('selected');

    const selfCard = typeScope.getByText('Self', { selector: '.targeting-option-name' });
    await act(async () => { fireEvent.click(selfCard); });

    await waitFor(() => {
      const t = getState()?.targetingConfig;
      expect(t?.targetingType).toBe('self');
      expect(t?.rangeType).toBe('self');
      expect(t?.rangeDistance).toBe(0);
      expect(t?.aoeParameters).toEqual({});
      expect(t?.targetRestrictions).toEqual(['self']);
    });

    const record = buildCanonicalSpellRecord({ wizardState: clone(getState()) });
    const compiled = definitionFromWizard(record, { roomId: 'room-1', definitionVersion: 1, classId: 'crusader' });
    expect(compiled.ok).toBe(true);
    expect(compiled.definition.capability).toBe(PASSIVE_TURN_CAPABILITY);
    expect(compiled.definition.trigger).toEqual({ kind: 'turn_end', whoseTurn: 'enemy', contract: PASSIVE_TURN_TRIGGER });

    // Reopening the saved record preserves Self selection cleanly
    cleanup();
    const getReopenedState = renderStep4(clone(record));
    const reopenedTypeSection = await screen.findByText('Targeting Type', { selector: '.targeting-section-title' });
    const reopenedSelfCard = await within(reopenedTypeSection.closest('.targeting-section')).findByText('Self', { selector: '.targeting-option-name' });
    expect(reopenedSelfCard.closest('.targeting-option-card')).toHaveClass('selected');
    expect(getReopenedState()?.targetingConfig?.rangeType).toBe('self');
    expect(getReopenedState()?.targetingConfig?.rangeDistance).toBe(0);
    expect(getReopenedState()?.targetingConfig?.targetRestrictions).toEqual(['self']);
  });

  test('Frost Ward Aura (moves_into_radius) keeps Self-Centered only and compiles to authored-passive-entry:v1', async () => {
    const frostDraft = {
      name: 'Frost Ward Aura',
      description: 'Enemies moving into radius suffer Frost Slow.',
      level: 1,
      spellType: 'PASSIVE',
      typeConfig: { school: 'arcane', tags: ['passive'], toggleable: false },
      effectTypes: ['control'],
      effectsMap: { control: true },
      controlConfig: {
        authoredCondition: {
          profile: 'authored-effect:v1',
          effect: 'movement',
          movementFeet: -10,
          label: 'Frost Slow',
          expiryPolicy: 'gm-manual',
          durationText: 'Until GM removes',
          gmNote: 'GM removes Frost Slow manually.'
        }
      },
      targetingMode: 'unified',
      targetingConfig: {},
      resourceCost: {
        actionPoints: 0,
        actionPointsSelected: false,
        mana: 0,
        resourceTypes: [],
        resourceValues: { actionPoints: 0, mana: 0 }
      },
      cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
      triggerConfig: {
        global: {
          logicType: 'AND',
          compoundTriggers: [{ id: 'moves_into_radius', category: 'movement', name: 'Moves Into Passive Radius', parameters: {} }]
        },
        effectTriggers: {},
        conditionalEffects: {},
        buffDebuffTriggers: {},
        requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
        triggerRole: { mode: 'CONDITIONAL' }
      }
    };

    const getState = renderStep4(frostDraft);
    const targetingTypeSection = await screen.findByText('Targeting Type', { selector: '.targeting-section-title' });
    const typeScope = within(targetingTypeSection.closest('.targeting-section'));
    const selfCenteredCard = await typeScope.findByText('Self-Centered', { selector: '.targeting-option-name' });
    expect(selfCenteredCard.closest('.targeting-option-card')).toHaveClass('selected');
    expect(typeScope.queryByText('Self', { selector: '.targeting-option-name' })).not.toBeInTheDocument();

    const record = buildCanonicalSpellRecord({ wizardState: clone(getState()) });
    const compiled = definitionFromWizard(record, { roomId: 'room-1', definitionVersion: 1, classId: 'arcanoneer' });
    expect(compiled.ok).toBe(true);
    expect(compiled.definition.capability).toBe(PASSIVE_ENTRY_CAPABILITY);
    expect(compiled.definition.targeting).toEqual({
      kind: 'self_centered_radius',
      aoeShape: 'circle',
      radiusFeet: 10,
      restriction: 'enemy'
    });
  });

  test('unsupported compound turn passive and ACTION spells do not expose Self targeting card', async () => {
    renderStep4(makeFreshTurnDraft({
      extraTriggers: [{ id: 'turn_end', category: 'time', name: 'Turn End', parameters: { whose_turn: 'enemy' } }]
    }));
    const passiveTypeSection = await screen.findByText('Targeting Type', { selector: '.targeting-section-title' });
    const passiveScope = within(passiveTypeSection.closest('.targeting-section'));
    await passiveScope.findByText('Self-Centered', { selector: '.targeting-option-name' });
    expect(passiveScope.queryByText('Self', { selector: '.targeting-option-name' })).not.toBeInTheDocument();

    cleanup();
    renderStep4({
      name: 'Plain Action',
      description: 'Action spell',
      level: 1,
      spellType: 'ACTION',
      typeConfig: { school: 'arcane', castTimeType: 'IMMEDIATE' },
      effectTypes: ['damage'],
      effectsMap: { damage: true },
      targetingMode: 'unified',
      targetingConfig: {},
      triggerConfig: clone(EMPTY_TRIGGERS)
    });
    const actionTypeSection = await screen.findByText('Targeting Type', { selector: '.targeting-section-title' });
    const actionScope = within(actionTypeSection.closest('.targeting-section'));
    await actionScope.findByText('Single Target', { selector: '.targeting-option-name' });
    expect(actionScope.queryByText('Self', { selector: '.targeting-option-name' })).not.toBeInTheDocument();
  });
});
