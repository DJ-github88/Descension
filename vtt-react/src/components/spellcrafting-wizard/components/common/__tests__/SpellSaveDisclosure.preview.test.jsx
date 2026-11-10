import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Step10Review from '../../steps/Step10Review';
import useGameStore from '../../../../../store/gameStore';
import { saveDisclosureForRecord } from '../spellSavePresentation';
import { draftSubject } from '../../../utils/executionCompatibility';

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
const fields = (save, extra = {}) => ({
  name: 'Preview Brand', description: 'd', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
  effectTypes: ['damage', 'control'],
  damageConfig: { damageType: 'direct', elementType: 'rime', formula: '1d6+2', resolution: 'DICE' },
  controlConfig: { authoredCondition: { profile: 'authored-effect:v1', effect: 'stunned', expiryPolicy: 'target-next-end', durationText: 'Until end of turn', gmNote: 'g', ...(save ? { save } : {}), ...extra } },
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] },
  resourceCost: { actionPoints: 1, mana: 2 }
});

let initialWizardState;
beforeAll(() => {
  const actual = jest.requireActual('../../../context/spellWizardContext');
  const Capture = () => { initialWizardState = actual.useSpellWizardState(); return null; };
  render(<actual.SpellWizardProvider><Capture /></actual.SpellWizardProvider>);
  expect(initialWizardState).toHaveProperty('editMode', false);
});
const renderReview = state => {
  mockWizardState = { ...initialWizardState, ...JSON.parse(JSON.stringify(state)) };
  return render(<Step10Review stepNumber={10} totalSteps={10} onNext={jest.fn()} onPrevious={jest.fn()} />);
};
afterEach(() => { mockWizardState = null; useGameStore.setState({ isInMultiplayer: false, isGMMode: false }); });

test('the Review preview card shows the same executable rider-save disclosure as the Review', () => {
  const state = { ...initialWizardState, ...JSON.parse(JSON.stringify(fields(SAVE))) };
  const disclosure = saveDisclosureForRecord(draftSubject(state));
  expect(disclosure).not.toBeNull();
  expect(disclosure.executable).toBe(true);
  const { container } = renderReview(fields(SAVE));
  const save = container.querySelector('.healing-effect-save .healing-effect-mechanics');
  expect(save).toBeInTheDocument();
  expect(save.textContent).toMatch(/Save: The table rolls the Constitution DC 12 save/);
  expect(save.textContent).toMatch(/only the rider "Canonical Stunned" is negated/);
  expect(container.textContent).toMatch(/expires at the end of the target's next turn/);
});

test('the Review preview card keeps a refused save shape manual', () => {
  const periodic = fields(SAVE, { effect: 'periodic', periodicKind: 'damage', periodicFormula: '1d4', periodicDamageType: 'blight', tickRoll: 'each-tick', label: 'Cinder Brand', expiryPolicy: 'target-start-count', occurrences: 3, movementFeet: undefined });
  const state = { ...initialWizardState, ...JSON.parse(JSON.stringify(periodic)) };
  const disclosure = saveDisclosureForRecord(draftSubject(state));
  expect(disclosure).not.toBeNull();
  expect(disclosure.executable).toBe(false);
  const { container } = renderReview(periodic);
  const save = container.querySelector('.healing-effect-save .healing-effect-mechanics');
  expect(save).toBeInTheDocument();
  expect(save.textContent).toMatch(/Saving throw \(Constitution DC 12\): manual only/);
  expect(save.textContent).not.toMatch(/Save: The table rolls/);
});
