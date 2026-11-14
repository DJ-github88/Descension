/**
 * Card-only spell-selection surface must keep stored trigger sections and their
 * automation disclosure when it maps a saved library record to UnifiedSpellCard.
 */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import fs from 'fs';

const mockSpell = JSON.parse(fs.readFileSync(
  'D:/VTT/handoff/spell-card-combat-flow-repair/fixtures/combined-whole-and-component-trigger.json',
  'utf8'
));
const captured = [];

jest.mock('../MythrillWindow', () => function WindowProbe({ children }) {
  return <div>{children}</div>;
});
jest.mock('../../spellcrafting-wizard/components/common/UnifiedSpellCard', () => function CardProbe(props) {
  captured.push(JSON.parse(JSON.stringify(props.spell)));
  return <div data-testid="card-probe" />;
});
jest.mock('../../spellcrafting-wizard/context/SpellLibraryContext', () => ({
  useSpellLibrary: () => ({ spells: [mockSpell] })
}));
jest.mock('../../spellcrafting-wizard/core/utils/spellCardTransformer', () => ({
  getSpellRollableTable: () => null
}));

const SpellSelectionWindow = require('../SpellSelectionWindow').default;

afterEach(() => {
  cleanup();
  captured.length = 0;
});

test('the spell-selection map keeps both stored trigger sections and the manual disclosure', () => {
  render(<SpellSelectionWindow isOpen={true} onClose={jest.fn()} onSelectSpell={jest.fn()} title="Select Spell" />);

  expect(captured).toHaveLength(1);
  expect(captured[0].triggerConfig.global.compoundTriggers).toHaveLength(1);
  expect(captured[0].triggerConfig.buffDebuffTriggers).toEqual(mockSpell.triggerConfig.buffDebuffTriggers);
  expect(captured[0].authoredTriggerDisclosure).toMatchObject({ manual: true });
});
