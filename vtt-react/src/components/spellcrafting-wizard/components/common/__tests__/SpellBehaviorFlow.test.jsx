import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnifiedSpellCard from '../UnifiedSpellCard';
import ExecutionCompatibility from '../ExecutionCompatibility';
import Step10Review from '../../steps/Step10Review';
import { EFFECT_CAPABILITY, FOLLOWUP_TRIGGER_ID, FOLLOWUP_HEALING_TRIGGER_ID } from '../../../../../services/authoredAbility';
import { TYPE as CD_TYPE } from '../../../../../services/authoredCooldown';

let mockWizardState = null;
jest.mock('../../../context/spellWizardContext', () => {
  const actual = jest.requireActual('../../../context/spellWizardContext');
  return { ...actual, useSpellWizardState: () => mockWizardState || {}, useSpellWizardDispatch: () => jest.fn(), validateStepCompletion: () => true };
});
jest.mock('../../../../../store/characterStore', () => ({
  __esModule: true,
  default: (selector) => selector({ currentCharacter: { stats: { intelligence: 18 } } })
}));
jest.mock('../../../context/SpellLibraryContext', () => ({
  useSpellLibrary: () => ({ getSpellById: () => null, dispatch: jest.fn() }),
  useSpellLibraryDispatch: () => jest.fn()
}));
jest.mock('../../../../../utils/assetManager', () => ({
  getIconUrl: (i) => `m/${i}.png`,
  getAbilityIconUrl: (i) => `m/${i}.png`,
  getCustomIconUrl: (i) => `m/${i}.png`
}));
jest.mock('../SpellTooltip', () => () => <div />);
jest.mock('../../../../../services/effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));

const ID = '22222222-2222-4222-8222-222222222222';
const wrap = (d) => ({ ...JSON.parse(JSON.stringify(d)), id: `rec-${d.name}`, authoredDefinitionId: ID, authoredDraft: JSON.parse(JSON.stringify(d)) });

const REAL_RECORDS = {
  simpleDamage: wrap({
    name: 'Cinder Lash',
    description: 'A lash of embers.',
    spellType: 'ACTION',
    typeConfig: { castTimeType: 'IMMEDIATE', school: 'ember' },
    effectTypes: ['damage'],
    damageConfig: { damageType: 'direct', elementType: 'ember', formula: '2d6', resolution: 'DICE' },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['enemy'] },
    resourceCost: { actionPoints: 1, mana: 3 }
  }),
  damageSaveMovement: wrap({
    name: 'Hobbling Ember',
    description: 'Chilling strike that slows on a failed save.',
    spellType: 'ACTION',
    typeConfig: { castTimeType: 'IMMEDIATE', school: 'rime' },
    effectTypes: ['damage', 'control'],
    damageConfig: { damageType: 'direct', elementType: 'rime', formula: '1d6+2', resolution: 'DICE' },
    controlConfig: {
      authoredCondition: {
        profile: EFFECT_CAPABILITY,
        effect: 'movement',
        movementFeet: -10,
        label: 'Hobbled',
        expiryPolicy: 'target-next-end',
        durationText: 'Until the embers cool',
        gmNote: 'GM removes on expiry.',
        save: { ability: 'constitution', dc: 12, outcome: 'negates' }
      }
    },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['enemy'] },
    resourceCost: { actionPoints: 1, mana: 2 }
  }),
  periodicEffect: wrap({
    name: 'Cinder Brand',
    description: 'Immediate damage plus periodic ticks.',
    spellType: 'ACTION',
    typeConfig: { castTimeType: 'IMMEDIATE', school: 'ember' },
    effectTypes: ['damage', 'control'],
    damageConfig: { damageType: 'direct', elementType: 'ember', formula: '1d6+2', resolution: 'DICE' },
    controlConfig: {
      authoredCondition: {
        profile: EFFECT_CAPABILITY,
        effect: 'periodic',
        periodicKind: 'damage',
        periodicFormula: '1d4',
        periodicDamageType: 'ember',
        tickRoll: 'each-tick',
        label: 'Cinder Brand',
        expiryPolicy: 'target-start-count',
        occurrences: 3,
        durationText: 'While the cinders glow',
        gmNote: 'GM resolves each tick.'
      }
    },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['enemy'] },
    resourceCost: { actionPoints: 1, mana: 2 },
    cooldownConfig: { cooldownType: CD_TYPE, cooldownValue: 2 }
  }),
  damageFollowUp: wrap({
    name: 'Ember Follow-Up',
    description: 'Optional damage follow-up after my damage lands.',
    spellType: 'ACTION',
    typeConfig: { castTimeType: 'IMMEDIATE', school: 'ember' },
    effectTypes: ['damage'],
    damageConfig: { damageType: 'direct', elementType: 'ember', formula: '1d6+1', resolution: 'DICE' },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['enemy'] },
    resourceCost: { actionPoints: 1, mana: 2 },
    triggerConfig: {
      global: { logicType: 'AND', compoundTriggers: [{ id: FOLLOWUP_TRIGGER_ID, category: 'combat', name: 'Follow-up After My Damage', parameters: {} }] },
      effectTriggers: {}, conditionalEffects: {}, buffDebuffTriggers: {},
      requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
      triggerRole: { mode: 'CONDITIONAL' }
    }
  }),
  healingFollowUp: wrap({
    name: 'Mercy Follow-Up',
    description: 'Optional healing follow-up after my healing lands.',
    spellType: 'ACTION',
    typeConfig: { castTimeType: 'IMMEDIATE', school: 'sacred' },
    effectTypes: ['healing'],
    healingConfig: { healingType: 'direct', formula: '1d8+2', resolution: 'DICE' },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['ally'] },
    resourceCost: { actionPoints: 1, mana: 2 },
    triggerConfig: {
      global: { logicType: 'AND', compoundTriggers: [{ id: FOLLOWUP_HEALING_TRIGGER_ID, category: 'health', name: 'Follow-up After My Healing', parameters: {} }] },
      effectTriggers: {}, conditionalEffects: {}, buffDebuffTriggers: {},
      requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
      triggerRole: { mode: 'CONDITIONAL' }
    }
  }),
  componentWatch: wrap({
    name: 'Shatter Watch',
    description: 'Direct damage watched for a separate follow-up, plus Hobbled.',
    spellType: 'ACTION',
    typeConfig: { castTimeType: 'IMMEDIATE', school: 'rime' },
    effectTypes: ['damage', 'control'],
    damageConfig: { damageType: 'direct', elementType: 'rime', formula: '1d6+2', resolution: 'DICE' },
    controlConfig: {
      authoredCondition: {
        profile: EFFECT_CAPABILITY,
        effect: 'movement',
        movementFeet: -10,
        label: 'Hobbled',
        expiryPolicy: 'target-next-end',
        durationText: 'Until end of turn',
        gmNote: 'GM removes on expiry.'
      }
    },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['enemy'] },
    resourceCost: { actionPoints: 1, mana: 2 },
    triggerConfig: {
      global: { logicType: 'AND', compoundTriggers: [] },
      effectTriggers: { damage_direct: { logicType: 'AND', compoundTriggers: [{ id: FOLLOWUP_TRIGGER_ID, category: 'combat', name: 'Follow-up After My Damage', parameters: {} }], targetingOverride: null } },
      conditionalEffects: {}, buffDebuffTriggers: {},
      requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
      triggerRole: { mode: 'CONDITIONAL' }
    }
  }),
  storedUnsupportedPassive: wrap({
    name: 'Aura of Warmth',
    description: 'Passive warmth aura.',
    spellType: 'PASSIVE',
    typeConfig: { castTimeType: 'IMMEDIATE', school: 'ember' },
    effectTypes: ['buff'],
    buffConfig: { duration: 10, buffs: [{ name: 'Warmth', description: '+2 resistance' }] },
    targetingConfig: { targetingType: 'self', rangeType: 'self_centered', rangeDistance: 0, maxTargets: 1, targetRestrictions: ['self'] },
    resourceCost: { actionPoints: 0, mana: 0 },
    triggerConfig: {
      global: { logicType: 'AND', compoundTriggers: [{ id: 'health_threshold', category: 'health', name: 'Low Health', parameters: {} }] },
      effectTriggers: {}, conditionalEffects: {}, buffDebuffTriggers: {},
      requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
      triggerRole: { mode: 'CONDITIONAL' }
    }
  })
};

let initialWizardState;
beforeAll(() => {
  const actual = jest.requireActual('../../../context/spellWizardContext');
  const Capture = () => { initialWizardState = actual.useSpellWizardState(); return null; };
  render(<actual.SpellWizardProvider><Capture /></actual.SpellWizardProvider>);
});

afterEach(() => {
  cleanup();
  mockWizardState = null;
});

describe('SpellBehaviorFlow AFTER rendering for 6 real records', () => {
  test.each(Object.entries(REAL_RECORDS))('%s renders structured hierarchy on card and compatibility', (key, record) => {
    const card = render(<UnifiedSpellCard spell={record} variant="wizard" showDescription showStats showTags />);
    const flow = card.container.querySelector('.spell-behavior-flow');
    expect(flow).toBeInTheDocument();
    expect(flow.querySelector('[data-behavior-support]')).toBeInTheDocument();
    expect(flow.querySelector('[data-behavior-live="static-only"]')).toBeInTheDocument();
    console.log(`AFTER [${key}] FLOW:`, flow.textContent.replace(/\s+/g, ' ').trim());

    const compat = render(<ExecutionCompatibility record={record} variant="saved" />);
    expect(compat.container.querySelector('.exec-compat .spell-behavior-flow')).toBeInTheDocument();
  });

  test('shows trigger steps only where a real execution dependency exists (no-trigger control)', () => {
    const simple = render(<UnifiedSpellCard spell={REAL_RECORDS.simpleDamage} variant="wizard" showStats />);
    const stepIds = Array.from(simple.container.querySelectorAll('[data-behavior-step]')).map(el => el.getAttribute('data-behavior-step'));
    expect(stepIds).toEqual(['activation', 'immediate']);
    expect(simple.container.querySelector('[data-behavior-step="followup"]')).toBeNull();
    expect(simple.container.querySelector('.spell-behavior-flow').textContent).not.toMatch(/OFFERED WHEN|WATCH → OFFER|THEN \(OPTIONAL\)/);
    cleanup();

    const saveMove = render(<UnifiedSpellCard spell={REAL_RECORDS.damageSaveMovement} variant="wizard" showStats />);
    expect(saveMove.container.querySelector('[data-behavior-step="save"]')).toBeInTheDocument();
    expect(saveMove.container.querySelector('[data-behavior-step="save"]').textContent).toContain('On fail:');
    expect(saveMove.container.querySelector('[data-behavior-step="save"]').textContent).toContain('On save:');
    expect(saveMove.container.querySelector('[data-behavior-step="expiry"]')).toBeInTheDocument();
    expect(saveMove.container.querySelector('[data-behavior-step="followup"]')).toBeNull();
    cleanup();

    const periodic = render(<UnifiedSpellCard spell={REAL_RECORDS.periodicEffect} variant="wizard" showStats />);
    expect(periodic.container.querySelector('[data-behavior-step="persistent"]')).toBeInTheDocument();
    expect(periodic.container.querySelector('[data-behavior-step="cooldown"]')).toBeInTheDocument();
    expect(periodic.container.querySelector('[data-behavior-step="followup"]')).toBeNull();
  });

  test('proves trigger direction for damage follow-up, healing follow-up, and component watch without self-offering or auto-recast', () => {
    // 1. Damage follow-up B: another qualifying damage cast -> B is offered -> pay and execute B
    const dmgFollow = render(<UnifiedSpellCard spell={REAL_RECORDS.damageFollowUp} variant="wizard" showStats />);
    const dmgStepIds = Array.from(dmgFollow.container.querySelectorAll('[data-behavior-step]')).map(el => el.getAttribute('data-behavior-step'));
    expect(dmgStepIds).toEqual(['followup', 'activation', 'immediate']);
    const dmgStep = dmgFollow.container.querySelector('[data-behavior-step="followup"]');
    expect(dmgStep).toHaveAttribute('data-behavior-scope', 'whole-spell');
    expect(dmgStep.textContent).toContain('OFFERED WHEN');
    expect(dmgStep.textContent).toContain('Another qualifying cast\'s immediate damage removes ≥ 1 base HP from a creature → this spell is offered');
    expect(dmgStep.textContent).toContain('never self-offers, partially casts, chains, or auto-recasts');
    cleanup();

    // 2. Healing follow-up B: another qualifying healing cast -> B is offered -> pay and execute B
    const healFollow = render(<UnifiedSpellCard spell={REAL_RECORDS.healingFollowUp} variant="wizard" showStats />);
    const healStepIds = Array.from(healFollow.container.querySelectorAll('[data-behavior-step]')).map(el => el.getAttribute('data-behavior-step'));
    expect(healStepIds).toEqual(['followup', 'activation', 'immediate']);
    const healStep = healFollow.container.querySelector('[data-behavior-step="followup"]');
    expect(healStep).toHaveAttribute('data-behavior-scope', 'whole-spell');
    expect(healStep.textContent).toContain('OFFERED WHEN');
    expect(healStep.textContent).toContain('Another qualifying cast\'s immediate healing restores ≥ 1 actual HP (after max-HP cap) to a creature or another primary PC (not yourself) → this spell is offered');
    expect(healStep.textContent).toContain('If accepted, pay and execute this spell below');
    expect(healStep.textContent).toContain('never self-offers, partially casts, chains, or auto-recasts');
    cleanup();

    // 3. Component watch A: execute A -> its watched component qualifies -> separate B is offered
    const watch = render(<UnifiedSpellCard spell={REAL_RECORDS.componentWatch} variant="wizard" showStats />);
    const watchStepIds = Array.from(watch.container.querySelectorAll('[data-behavior-step]')).map(el => el.getAttribute('data-behavior-step'));
    expect(watchStepIds).toEqual(['activation', 'immediate', 'persistent', 'expiry', 'followup']);
    const watchStep = watch.container.querySelector('[data-behavior-step="followup"]');
    expect(watchStep).toHaveAttribute('data-behavior-scope', 'component-watch');
    expect(watchStep.textContent).toContain('WATCH → OFFER');
    expect(watchStep.textContent).toContain('After this spell executes, if its direct damage part removes ≥ 1 base HP after temp HP → a separate GM-paired follow-up spell is offered');
    expect(watchStep.textContent).toContain('this spell is never offered as its own follow-up');
    expect(watchStep.textContent).toContain('never partially casts, chains, or auto-recasts');
  });

  test('mounted Step10Review and reopened library card (behaviorRecord) render identical trigger direction for healing follow-up', () => {
    mockWizardState = {
      ...initialWizardState,
      ...JSON.parse(JSON.stringify(REAL_RECORDS.healingFollowUp.authoredDraft))
    };
    const review = render(<Step10Review stepNumber={10} totalSteps={10} onNext={jest.fn()} onPrevious={jest.fn()} />);
    const reviewFlows = review.container.querySelectorAll('.spell-behavior-flow');
    expect(reviewFlows.length).toBeGreaterThanOrEqual(2);
    reviewFlows.forEach((flow) => {
      const ids = Array.from(flow.querySelectorAll('[data-behavior-step]')).map(el => el.getAttribute('data-behavior-step'));
      expect(ids).toEqual(['followup', 'activation', 'immediate']);
      expect(flow.textContent).toContain('OFFERED WHEN');
      expect(flow.textContent).toContain('not yourself');
    });
    cleanup();

    // Reopened library card passes mapped summary as `spell` and raw saved record as `behaviorRecord`
    const mappedSummary = { ...REAL_RECORDS.healingFollowUp, authoredDraft: undefined };
    const libraryCard = render(
      <UnifiedSpellCard spell={mappedSummary} behaviorRecord={REAL_RECORDS.healingFollowUp} variant="wizard" showStats />
    );
    const libFlow = libraryCard.container.querySelector('.spell-behavior-flow');
    const libIds = Array.from(libFlow.querySelectorAll('[data-behavior-step]')).map(el => el.getAttribute('data-behavior-step'));
    expect(libIds).toEqual(['followup', 'activation', 'immediate']);
    expect(libFlow.textContent).toContain('OFFERED WHEN');
    expect(libFlow.textContent).toContain('not yourself');
  });

  test('stored unsupported passive preserves manual sections and never claims whole-record executability', () => {
    const passive = render(<UnifiedSpellCard spell={REAL_RECORDS.storedUnsupportedPassive} variant="wizard" showStats />);
    const flow = passive.container.querySelector('.spell-behavior-flow');
    expect(flow).toHaveAttribute('data-behavior-status', 'manual');
    expect(flow.querySelector('[data-behavior-step="activation"]').textContent).toContain('STORED');
    expect(flow.querySelector('[data-behavior-manual="true"]').textContent).toContain('Having a supported component does not make the whole record executable');
  });

  test('mounted Step10Review renders behavioral flow for real wizard state with long name and narrow viewport', () => {
    const longDraft = {
      ...initialWizardState,
      ...JSON.parse(JSON.stringify(REAL_RECORDS.damageSaveMovement.authoredDraft)),
      name: 'ExtremelyLongSpellNameForNarrowViewportWrappingVerificationWithoutOverflow1234567890'
    };
    mockWizardState = longDraft;
    const { container } = render(
      <div style={{ width: '320px' }}>
        <Step10Review stepNumber={10} totalSteps={10} onNext={jest.fn()} onPrevious={jest.fn()} />
      </div>
    );
    expect(container.querySelectorAll('.spell-behavior-flow').length).toBeGreaterThanOrEqual(2);
    expect(container.textContent).toContain('On fail:');
    expect(container.textContent).toContain('On save:');
  });
});
