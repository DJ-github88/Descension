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
