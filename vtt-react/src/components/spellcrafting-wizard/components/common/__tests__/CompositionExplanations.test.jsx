import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnifiedSpellCard from '../UnifiedSpellCard';
import Step10Review from '../../steps/Step10Review';
import AuthoredAdmission from '../../library/AuthoredAdmission';
import { normalizeSpell } from '../../../core/utils/spellNormalizer';
import { explainExecution, WIZARD_ONLY_KEYS, STATES } from '../../../utils/executionCompatibility';
import { definitionFromWizard, creatureSourceRefusal } from '../../../../../services/authoredAbility';
import { TYPE as CD_TYPE } from '../../../../../services/authoredCooldown';
import { formatAuthoredExpiry } from '../spellTimingPresentation';
import useGameStore from '../../../../../store/gameStore';

// Wizard composition explanations (HEADQ): the Wizard Review, the spell card and the library admission card must describe the
// installed interaction classes the way the shared compiler and creature-source helper decide them. The Review is rendered with
// the state shape the real Wizard reducer produces (it carries editMode/editingSpellId, which the save path removes).
let mockWizardState = null;
jest.mock('../../../context/spellWizardContext', () => {
  const actual = jest.requireActual('../../../context/spellWizardContext');
  return { ...actual, useSpellWizardState: () => mockWizardState || {}, useSpellWizardDispatch: () => jest.fn(), validateStepCompletion: () => true };
});
jest.mock('../../../../../store/characterStore', () => ({ __esModule: true, default: selector => selector({ currentCharacter: { stats: { intelligence: 18 } } }) }));
jest.mock('../../../context/SpellLibraryContext', () => ({ useSpellLibrary: () => ({ getSpellById: () => null, dispatch: jest.fn() }), useSpellLibraryDispatch: () => jest.fn() }));
jest.mock('../../../../../utils/assetManager', () => ({ getIconUrl: i => `m/${i}.png`, getAbilityIconUrl: i => `m/${i}.png`, getCustomIconUrl: i => `m/${i}.png` }));
jest.mock('../SpellTooltip', () => () => <div />);
jest.mock('../../../../../services/effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));

const SAVE = { ability: 'constitution', dc: 12, outcome: 'negates' };
const cond = {
  periodic: { profile: 'authored-effect:v1', effect: 'periodic', periodicKind: 'damage', periodicFormula: '1d4', periodicDamageType: 'blight', tickRoll: 'each-tick', label: 'Cinder Brand', expiryPolicy: 'target-start-count', occurrences: 3, durationText: 'While the cinders glow', gmNote: 'g' },
  movement: { profile: 'authored-effect:v1', effect: 'movement', movementFeet: -10, label: 'Hobbled', expiryPolicy: 'target-next-end', durationText: 'Until the embers cool', gmNote: 'g' },
  stunnedTimed: { profile: 'authored-effect:v1', effect: 'stunned', expiryPolicy: 'target-next-end', durationText: 'Until end of turn', gmNote: 'g' },
  stunnedCounted: { profile: 'authored-effect:v1', effect: 'stunned', expiryPolicy: 'target-start-count', occurrences: 2, durationText: 'Two turns', gmNote: 'g' },
  stunnedManual: { profile: 'authored-effect:v1', effect: 'stunned', expiryPolicy: 'gm-manual', durationText: 'Until shaken off', gmNote: 'g' }
};
const spell = ({ kind, formula = '1d6+2', save, cd, noDirect }) => ({ name: `Disposable ${kind}`, description: 'd', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
  effectTypes: noDirect ? ['control'] : ['damage', 'control'], controlConfig: { authoredCondition: { ...cond[kind], ...(save ? { save } : {}) } },
  ...(noDirect ? {} : { damageConfig: { damageType: 'direct', elementType: 'rime', formula, resolution: 'DICE' } }),
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 2 },
  ...(cd ? { cooldownConfig: { cooldownType: CD_TYPE, cooldownValue: cd } } : {}) });
// The five installed interaction classes
const CLASSES = {
  'attribute formula + movement rider': spell({ kind: 'movement', formula: '2d6 + intelligence/3' }),
  'formula + rider + authenticated cooldown': spell({ kind: 'movement', formula: '2d6 + intelligence/3', cd: 2 }),
  'plain direct + rider-local save + timed expiry': spell({ kind: 'movement', save: SAVE }),
  'plain direct + rider-local save + cooldown': spell({ kind: 'stunnedTimed', save: SAVE, cd: 3 }),
  'standalone periodic + cooldown': spell({ kind: 'periodic', noDirect: true, cd: 2 })
};
const HAS_COOLDOWN = ['formula + rider + authenticated cooldown', 'plain direct + rider-local save + cooldown', 'standalone periodic + cooldown'];
const wrap = d => ({ ...JSON.parse(JSON.stringify(d)), authoredDefinitionId: '70000000-0000-4000-8000-0000000000d6', authoredDraft: JSON.parse(JSON.stringify(d)) });
const PC = { roomId: 'r', classId: 'arcanoneer', shared: true, gm: true };

// The state the real reducer holds: initial state keys (editMode, editingSpellId …) with the authored fields on top.
let initialWizardState;
beforeAll(() => {
  const actual = jest.requireActual('../../../context/spellWizardContext');
  const Capture = () => { initialWizardState = actual.useSpellWizardState(); return null; };
  render(<actual.SpellWizardProvider><Capture /></actual.SpellWizardProvider>);
  expect(initialWizardState).toHaveProperty('editMode', false);
});
const renderReview = fields => {
  mockWizardState = { ...initialWizardState, ...JSON.parse(JSON.stringify(fields)) };
  return render(<Step10Review stepNumber={10} totalSteps={10} onNext={jest.fn()} onPrevious={jest.fn()} />);
};
const box = container => container.querySelector('.exec-compat');
afterEach(() => { mockWizardState = null; useGameStore.setState({ isInMultiplayer: false, isGMMode: false }); });

describe('Wizard Review explains the installed classes from the real Wizard state', () => {
  test.each(Object.entries(CLASSES))('%s: a supported composition is never reported as unsupported', (name, fields) => {
    const { container } = renderReview(fields);
    expect(box(container).dataset.state).toBe(STATES.PARTIAL);
    expect(box(container).textContent).not.toMatch(/Prism cannot run this ability/);
    const text = box(container).textContent;
    if (HAS_COOLDOWN.includes(name)) expect(text).toMatch(/Cooldown: \d strictly upcoming caster-turn starts?/);
    else expect(text).not.toMatch(/Cooldown:/);
    expect(text).not.toMatch(/no cooldown/i);
  });

  test('the Review also holds while editing a saved spell (edit-mode keys, stale serializedData after a rename)', () => {
    const fields = CLASSES['plain direct + rider-local save + cooldown'];
    const stale = JSON.stringify({ ...fields, name: 'Old name' });
    const { container } = renderReview({ ...fields, editMode: true, editingSpellId: 'abc', serializedData: stale, categoryIds: ['uncategorized'], source: 'library', isCustom: true });
    expect(box(container).dataset.state).toBe(STATES.PARTIAL);
    expect(box(container).textContent).toMatch(/Rolling the save: .*Constitution DC 12/);
  });

  test('the per-class responsibilities are the validated ones: timed expiry, rider-local save, ticks', () => {
    const timedSave = renderReview(CLASSES['plain direct + rider-local save + timed expiry']).container;
    expect(box(timedSave).textContent).toMatch(/Ending the effect: expires at the end of the target's next turn/);
    expect(box(timedSave).textContent).toMatch(/Rolling the save: /);
    expect(box(timedSave).textContent).not.toMatch(/GM removes it/);
    const periodic = renderReview(CLASSES['standalone periodic + cooldown']).container;
    expect(box(periodic).textContent).toMatch(/Resolving periodic ticks: 3 ticks/);
    expect(box(periodic).textContent).toMatch(/Cooldown: 2 strictly upcoming caster-turn starts/);
  });

  test('what the compiler refuses stays refused: no widening of the Review', () => {
    const periodicSave = renderReview(spell({ kind: 'periodic', save: SAVE })).container;
    expect(box(periodicSave).dataset.state).toBe(STATES.UNSUPPORTED);
    expect(box(periodicSave).textContent).toMatch(/A save on a periodic effect stays manual/);
    const attributeCooldown = spell({ kind: 'movement', cd: 2 });
    attributeCooldown.controlConfig.authoredCondition = { profile: 'authored-effect:v1', effect: 'attribute', attribute: 'agility', attributeAmount: -2, label: 'Leaden', expiryPolicy: 'gm-manual', durationText: 'x', gmNote: 'y', save: SAVE };
    const refused = renderReview(attributeCooldown).container;
    expect(box(refused).dataset.state).toBe(STATES.UNSUPPORTED);
    expect(box(refused).textContent).toMatch(/Cooldowns currently require/);
    // An unknown authored section is still a validator decision (kept in the record, never hidden by the Review).
    const unknown = renderReview({ ...CLASSES['plain direct + rider-local save + timed expiry'], unrelatedManualSection: { note: 'table rule' } }).container;
    expect(box(unknown).dataset.state).toBe(STATES.UNSUPPORTED);
  });

  test('installed formula + rider + save compiles to partial automation on PC route', () => {
    const formulaSave = renderReview(spell({ kind: 'movement', formula: '2d6 + intelligence/3', save: SAVE })).container;
    expect(box(formulaSave).dataset.state).toBe(STATES.PARTIAL);
    expect(box(formulaSave).textContent).toMatch(/Rolling the save: The table rolls the Constitution DC 12 save/);
  });

  test('distinguishes invalid structured timing from explicitly authored gm-manual timing without converting invalid schedules to executable routes', () => {
    // 1. Invalid structured timing (occurrences out of bounds, e.g. 11) is refused by compiler and marked UNSUPPORTED (not converted to manual executable)
    const invalidCount = spell({ kind: 'stunnedCounted', save: SAVE });
    invalidCount.controlConfig.authoredCondition.occurrences = 11;
    const reviewInvalid = renderReview(invalidCount).container;
    expect(box(reviewInvalid).dataset.state).toBe(STATES.UNSUPPORTED);
    expect(box(reviewInvalid).textContent).toMatch(/Occurrences: counted expiry needs a whole number of target-turn boundaries from 2 to 10/);

    // 2. Explicitly authored gm-manual timing is accepted by existing validation as a partially automated executable route
    const manualSpell = spell({ kind: 'stunnedManual', save: SAVE });
    const reviewManual = renderReview(manualSpell).container;
    expect(box(reviewManual).dataset.state).toBe(STATES.PARTIAL);
    expect(box(reviewManual).textContent).toMatch(/Ending the effect: the GM removes it/);
  });
});

describe('Draft check wraps the Wizard state the way the save path does', () => {
  test('the Wizard-only keys are exactly the ones Step10Review removes before it stores the record', () => {
    const source = require('fs').readFileSync(require.resolve('../../steps/Step10Review.jsx'), 'utf8');
    const start = source.indexOf('Create a clean version of spellState'), end = source.indexOf('...cleanSpellState', start);
    expect(start).toBeGreaterThan(0);
    const removed = [...source.slice(start, end).matchAll(/^\s*(\w+): _\w+,?\s*$/gm)].map(m => m[1]);
    expect(removed.length).toBeGreaterThan(5);
    expect([...WIZARD_ONLY_KEYS].sort()).toEqual(removed.sort());
  });
});

describe('Creature-source route explanations come from the shared refusal helper', () => {
  const creature = { ...PC, route: 'creature' };
  test.each(Object.entries(CLASSES))('%s: refused for a creature source with the helper\'s own reason and advice that matches it', (name, fields) => {
    const mapped = definitionFromWizard(wrap(fields), { roomId: 'r', classId: 'arcanoneer', definitionVersion: 1 });
    expect(mapped.ok).toBe(true);
    const refusal = creatureSourceRefusal(mapped.definition);
    expect(refusal).toMatchObject({ code: 'unsupported_source_route' });
    const view = explainExecution(wrap(fields), creature);
    expect(view.state).toBe(STATES.UNSUPPORTED);
    expect(view.reasons).toEqual([{ label: 'Route restriction', text: refusal.reason }]);
    const advice = view.next.join(' ');
    // The advice must not name only periodic effects / formula scaling: cooldown and save routes are refused for other reasons.
    expect(advice).not.toMatch(/without periodic effects or formula scaling/);
    expect(advice).toMatch(/route restriction/i);
    // The same record on the primary owner PC route is partial and admits through the PC action.
    const pc = explainExecution(wrap(fields), PC);
    expect(pc.state).toBe(STATES.PARTIAL);
    expect(pc.next.join(' ')).toMatch(/Admit this saved version/);
  });

  test.each(Object.entries(CLASSES))('%s: the library admission card disables creature admission and states the reason', (name, fields) => {
    useGameStore.setState({ isGMMode: true, isInMultiplayer: true, multiplayerRoom: { id: 'r' } });
    const sourceRef = { kind: 'creature', mapId: 'arena', tokenId: 'wolf-1', instanceId: 'inc-1' };
    const { unmount } = render(<AuthoredAdmission spell={wrap(fields)} sourceRef={sourceRef} />);
    expect(screen.getByRole('button', { name: 'Admit for this creature' })).toBeDisabled();
    expect(screen.getByText(/Compatible definition, not executable by this creature source/)).toBeInTheDocument();
    expect(screen.queryByText(/Exact creature source → one distinct creature; the GM confirms success/)).not.toBeInTheDocument();
    unmount();
  });

  test('the same record on the PC route offers the admit action and the Review text agrees', () => {
    useGameStore.setState({ isGMMode: true, isInMultiplayer: true, multiplayerRoom: { id: 'r' } });
    const { container } = render(<AuthoredAdmission spell={wrap(CLASSES['formula + rider + authenticated cooldown'])} />);
    expect(screen.getByRole('button', { name: 'Admit this saved version' })).toBeEnabled();
    expect(box(container).dataset.state).toBe(STATES.PARTIAL);
    expect(box(container).textContent).toMatch(/Cooldown: 2 strictly upcoming caster-turn starts/);
  });
});

describe('Spell card does not call a structured expiry manual', () => {
  const cardText = fields => { const r = render(<UnifiedSpellCard spell={normalizeSpell({ ...JSON.parse(JSON.stringify(fields)), id: 'x' })} variant="wizard" showDescription showStats />); return r.container.textContent; };
  test('timed Stunned rider states the authenticated boundary, not "GM removes"', () => {
    const text = cardText(spell({ kind: 'stunnedTimed', formula: '2d6 + intelligence/3', cd: 2 }));
    expect(text).toMatch(/Stunned · expires at the end of the target's next turn/);
    expect(text).not.toMatch(/Stunned · GM removes/);
    expect(text).toMatch(/2 strictly upcoming caster-turn starts until reuse/);
  });
  test('counted Stunned rider names the counted boundary', () => {
    expect(cardText(spell({ kind: 'stunnedCounted', save: SAVE }))).toMatch(/Stunned · expires at the start of the target's 2nd upcoming turn/);
  });
  test('counted-expiry presentation enforces validOccurrences contract (2..10) with focused boundary checks', () => {
    // Direct presentation helper boundaries (validOccurrences contract: 2..10 safe integers)
    expect(formatAuthoredExpiry('target-start-count', 2)).toMatch(/start of the target's 2nd upcoming turn/);
    expect(formatAuthoredExpiry('target-end-count', 2)).toMatch(/end of the target's 2nd upcoming turn/);
    expect(formatAuthoredExpiry('target-start-count', 10)).toMatch(/start of the target's 10th upcoming turn/);
    expect(formatAuthoredExpiry('target-end-count', 10)).toMatch(/end of the target's 10th upcoming turn/);

    // Below minimum of 2: invalid, returns null (presentation falls back to manual)
    expect(formatAuthoredExpiry('target-start-count', 1)).toBeNull();
    expect(formatAuthoredExpiry('target-start-count', 0)).toBeNull();
    expect(formatAuthoredExpiry('target-start-count', -1)).toBeNull();

    // Above maximum of 10: invalid, returns null (presentation falls back to manual)
    expect(formatAuthoredExpiry('target-start-count', 11)).toBeNull();
    expect(formatAuthoredExpiry('target-end-count', 11)).toBeNull();

    // Non-integer / non-number inputs: invalid, returns null
    expect(formatAuthoredExpiry('target-start-count', 2.5)).toBeNull();
    expect(formatAuthoredExpiry('target-start-count', '2')).toBeNull();
    expect(formatAuthoredExpiry('target-start-count', null)).toBeNull();
    expect(formatAuthoredExpiry('target-start-count', undefined)).toBeNull();

    // Card presentation integration at boundaries:
    // Upper boundary at max 10
    const spell10 = spell({ kind: 'stunnedCounted', save: SAVE });
    spell10.controlConfig.authoredCondition.occurrences = 10;
    expect(cardText(spell10)).toMatch(/Stunned · expires at the start of the target's 10th upcoming turn/);

    // Beyond max 10 (11): falls back to "GM removes"
    const spell11 = spell({ kind: 'stunnedCounted', save: SAVE });
    spell11.controlConfig.authoredCondition.occurrences = 11;
    expect(cardText(spell11)).toMatch(/Stunned · GM removes/);

    // Below min 2 (1): falls back to "GM removes"
    const spell1 = spell({ kind: 'stunnedCounted', save: SAVE });
    spell1.controlConfig.authoredCondition.occurrences = 1;
    expect(cardText(spell1)).toMatch(/Stunned · GM removes/);
  });
  test('a genuinely manual Stunned rider still says the GM removes it', () => {
    expect(cardText(spell({ kind: 'stunnedManual', save: SAVE }))).toMatch(/Stunned · GM removes/);
  });
  test('timed movement rider no longer says the GM manages its timing', () => {
    const text = cardText(spell({ kind: 'movement', save: SAVE, cd: 1 }));
    expect(text).toMatch(/Hobbled \(Movement −10 ft\)/);
    expect(text).not.toMatch(/GM manages timing/);
    expect(text).toMatch(/1 strictly upcoming caster-turn start until reuse/);
  });
});
