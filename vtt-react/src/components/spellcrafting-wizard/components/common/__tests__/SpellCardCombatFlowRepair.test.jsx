/**
 * Focused regressions for the spell-card combat-flow repair packet.
 *
 * Covers: Review preview preserves whole-spell + component-attached trigger sections;
 * trigger-refused records keep an honest save component description; card-only surfaces
 * show the stored trigger condition, scope and manual marker; genuinely unsupported save
 * shapes keep the existing manual-only save wording.
 */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import UnifiedSpellCard from '../UnifiedSpellCard';
import Step10Review from '../../steps/Step10Review';
import { saveDisclosureForRecord } from '../spellSavePresentation';
import { definitionFromWizard } from '../../../../../services/authoredAbility';
import { explainExecution } from '../../../utils/executionCompatibility';
import useGameStore from '../../../../../store/gameStore';

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

const FIXTURES = 'D:/VTT/handoff/spell-card-combat-flow-repair/fixtures';
const load = name => JSON.parse(fs.readFileSync(path.join(FIXTURES, name), 'utf8'));
const clone = value => JSON.parse(JSON.stringify(value));

const renderCard = record => render(
  <UnifiedSpellCard spell={{ ...clone(record), id: `card-${record.id}` }} variant="wizard" showDescription showStats />
);

const renderReview = draft => {
  mockWizardState = { ...clone(draft), editMode: false, editingSpellId: null, categoryIds: [], source: 'library' };
  return render(<Step10Review stepNumber={10} totalSteps={10} onNext={jest.fn()} onPrevious={jest.fn()} />);
};

afterEach(() => {
  cleanup();
  mockWizardState = null;
  useGameStore.setState({ isInMultiplayer: false, isGMMode: false });
});

describe('Review payload keeps whole-spell and component-attached triggers together', () => {
  test('the Review preview card shows both sections and their stored conditions', () => {
    const record = load('combined-whole-and-component-trigger.json');
    const { container } = renderReview(record.authoredDraft);
    const card = container.querySelector('.pf-spell-card');
    const text = card.textContent;

    expect(text).toContain('Spell Triggers');
    expect(text).toContain('Whole spell');
    expect(text).toContain('If my health is below 50%');
    expect(text).toContain('Trigger Chain');
    expect(text).toContain('Damage component → restoration');
    expect(text).toContain('If I take 5 pts of damage');
    expect(container.querySelectorAll('[data-trigger-disclosure="manual"]').length).toBeGreaterThanOrEqual(2);
  });
});

describe('trigger-refused records keep an honest save component description', () => {
  test.each(['whole-spell-trigger.json', 'component-attached-trigger.json', 'combined-whole-and-component-trigger.json'])(
    '%s describes the save component without blaming the save shape',
    name => {
      const disclosure = saveDisclosureForRecord(load(name));
      expect(disclosure).not.toBeNull();
      expect(disclosure.status).toBe('record-manual');
      expect(disclosure.text).toContain('Save component (Constitution DC 12)');
      expect(disclosure.text).toContain('The whole ability is manual');
      expect(disclosure.text).toContain('triggers');
      expect(disclosure.text).not.toMatch(/cannot run this save shape/);
    }
  );

  test('a genuinely unsupported save shape keeps the existing manual-only wording', () => {
    const record = load('supported.json');
    record.controlConfig.authoredCondition.save.outcome = 'halves';
    record.authoredDraft.controlConfig.authoredCondition.save.outcome = 'halves';
    record.serializedData = JSON.stringify(record.authoredDraft, null, 2);

    const disclosure = saveDisclosureForRecord(record);
    expect(disclosure.status).toBe('unsupported-shape');
    expect(disclosure.text).toMatch(/manual only — Prism cannot run this save shape as authored/);
    expect(disclosure.text).not.toContain('The whole ability is manual');
  });

  test('the supported record keeps the executable save wording', () => {
    const disclosure = saveDisclosureForRecord(load('supported.json'));
    expect(disclosure.text).toMatch(/^Save: The table rolls the Constitution DC 12 save/);
    expect(disclosure.text).toMatch(/the direct damage part still applies on both outcomes/);
    const { container } = renderCard(load('supported.json'));
    expect(container.textContent).not.toContain('Manual only — Prism cannot run this stored trigger configuration');
    expect(container.querySelector('[data-trigger-disclosure="manual"]')).toBeNull();
  });
});

describe('card-only surfaces show stored trigger conditions, scope and manual marker', () => {
  test('whole-spell trigger keeps the self subject and says the stored trigger is manual', () => {
    const { container } = renderCard(load('whole-spell-trigger.json'));
    const text = container.textContent;

    expect(text).toContain('Spell Triggers');
    expect(text).toContain('Whole spell');
    expect(text).toContain('If my health is below 50%');
    expect(text).not.toContain('If below 50% health');
    expect(text).toContain('Manual only — Prism cannot run this stored trigger configuration');
    expect(container.querySelector('[data-trigger-disclosure="manual"]')).toBeTruthy();
  });

  test('component-attached trigger shows its stored event, component scope and manual marker', () => {
    const { container } = renderCard(load('component-attached-trigger.json'));
    const text = container.textContent;

    expect(text).toContain('Trigger Chain');
    expect(text).toContain('Damage component → restoration');
    expect(text).toContain('If I take 5 pts of damage');
    expect(text).toContain('Manual only — Prism cannot run this stored trigger configuration');
    expect(container.querySelector('[data-trigger-disclosure="manual"]')).toBeTruthy();
  });

  test('a missing trigger subject is described as not stored instead of inventing one', () => {
    const record = load('whole-spell-trigger.json');
    record.triggerConfig.global.compoundTriggers[0].parameters = { percentage: 50, comparison: 'below' };
    record.authoredDraft.triggerConfig.global.compoundTriggers[0].parameters = { percentage: 50, comparison: 'below' };
    record.serializedData = JSON.stringify(record.authoredDraft, null, 2);

    const { container } = renderCard(record);
    expect(container.textContent).toContain('If health is below 50% (subject not stored)');
    expect(container.textContent).not.toContain('If my health is below 50%');
  });
});

describe('unsupported records remain refused whole', () => {
  test('the combined trigger record is still refused at triggerConfig after the presentation repair', () => {
    const record = load('combined-whole-and-component-trigger.json');
    const result = definitionFromWizard(record, { classId: 'arcanoneer', definitionVersion: 1 });
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/triggers/);

    const view = explainExecution(record, { classId: 'arcanoneer' });
    expect(view.state).toBe('unsupported');
    expect(view.reasons[0].text).toMatch(/triggers/);
  });
});
