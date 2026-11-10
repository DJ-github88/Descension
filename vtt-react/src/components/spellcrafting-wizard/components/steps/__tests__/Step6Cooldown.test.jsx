import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Step6Cooldown from '../Step6Cooldown';
import { TYPE } from '../../../../../services/authoredCooldown';
let mockState, mockDispatch;
beforeAll(() => { global.IS_REACT_ACT_ENVIRONMENT = true; });
afterAll(() => { delete global.IS_REACT_ACT_ENVIRONMENT; });
jest.mock('../../../context/spellWizardContext', () => ({ useSpellWizardState: () => mockState, useSpellWizardDispatch: () => mockDispatch, ACTION_TYPES: { UPDATE_COOLDOWN_CONFIG: 'cooldown' }, validateStepCompletion: () => true }));
jest.mock('../../common/WizardStep', () => ({ children }) => <div>{children}</div>);
test.each([{ cooldownType: 'none', cooldownValue: 0 }, { cooldownType: TYPE, cooldownValue: 2 }, { type: 'rounds', value: 3 }])('reopen preserves stored timing without mount writes: %j', config => {
  mockState = { cooldownConfig: config }; mockDispatch = jest.fn(); const node = document.createElement('div'), root = createRoot(node);
  act(() => root.render(<Step6Cooldown />)); expect(mockDispatch).not.toHaveBeenCalled();
  if (config.cooldownType === TYPE) expect(node.textContent).toContain('2 strictly upcoming caster-turn starts');
  act(() => root.unmount());
});
test('explicit profile replaces stale legacy fields; zero remains zero', () => {
  mockState = { cooldownConfig: { type: 'charge_based', value: 3, charges: 4 } }; mockDispatch = jest.fn(); const node = document.createElement('div'), root = createRoot(node);
  act(() => root.render(<Step6Cooldown />));
  act(() => [...node.querySelectorAll('button')].find(b => b.textContent === 'Authenticated Caster Starts').click());
  expect(mockDispatch).toHaveBeenLastCalledWith({ type: 'cooldown', replace: true, payload: { cooldownType: TYPE, cooldownValue: 1 } });
  act(() => [...node.querySelectorAll('button')].find(b => b.textContent === 'No Cooldown').click());
  expect(mockDispatch).toHaveBeenLastCalledWith({ type: 'cooldown', replace: true, payload: { cooldownType: 'none', cooldownValue: 0 } }); act(() => root.unmount());
});
test('composed cooldowns: the explicit profile copy names the same-kind periodic option and keeps reuse separate from the tick count', () => {
  mockState = { cooldownConfig: { cooldownType: TYPE, cooldownValue: 3 } }; mockDispatch = jest.fn(); const node = document.createElement('div'), root = createRoot(node);
  act(() => root.render(<Step6Cooldown />));
  expect(node.textContent).toContain('optionally with one periodic effect of the same kind');
  expect(node.textContent).toContain('a periodic effect keeps its own tick count, and removing it or its last tick never releases the cooldown');
  expect(mockDispatch).not.toHaveBeenCalled(); act(() => root.unmount());
});
test('effect cooldowns: the profile copy names periodic-only and movement/Stunned riders and keeps reuse separate from their expiry', () => {
  mockState = { cooldownConfig: { cooldownType: TYPE, cooldownValue: 2 } }; mockDispatch = jest.fn(); const node = document.createElement('div'), root = createRoot(node);
  act(() => root.render(<Step6Cooldown />));
  expect(node.textContent).toContain('a periodic effect on its own; a movement or Stunned effect, optionally with an immediate damage OR healing part, which may carry one save that negates only that effect');
  expect(node.textContent).toContain('one Agility, Intelligence or Spirit change, optionally with a plain immediate damage OR healing part and no save');
  expect(node.textContent).toContain('With a save, the cooldown starts on either recorded outcome');
  expect(node.textContent).toContain('a movement, Stunned or attribute effect keeps its own expiry, and removing or expiring it never releases the cooldown, nor does the release remove it');
  expect(node.textContent).toContain('A second change to the same attribute remains refused even after cooldown release');
  expect(node.textContent).toContain('Positive flat DR (+1 to +20, whole number) also supports this cooldown');
  expect(node.textContent).toContain('removal or expiry never releases the cooldown, and cooldown release never removes the DR effect');
  expect(node.textContent).toContain('A second flat DR effect remains refused even after cooldown release');
  expect(mockDispatch).not.toHaveBeenCalled(); act(() => root.unmount());
});
