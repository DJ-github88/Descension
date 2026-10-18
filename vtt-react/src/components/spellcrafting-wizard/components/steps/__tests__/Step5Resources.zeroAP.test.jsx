import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Step5Resources from '../Step5Resources';
import {
  SpellWizardProvider,
  useSpellWizardState,
  useSpellWizardDispatch,
  actionCreators
} from '../../../context/spellWizardContext';
import { serializeSpell, deserializeSpell } from '../../../core/utils/spellSerializer';

jest.mock('../../common/SimpleFormulaHelp', () => () => null);
jest.mock('../../common/SpellComponentsSelector', () => () => null);

let observedState = null;

const StateObserver = () => {
  observedState = useSpellWizardState();
  return null;
};

const SeedGate = ({ patch, spellType, children }) => {
  const dispatch = useSpellWizardDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (spellType !== undefined) {
      dispatch(actionCreators.setSpellType(spellType));
    }
    if (patch) {
      dispatch(actionCreators.updateResourceCost(patch));
    }
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <>
      <StateObserver />
      {children}
    </>
  );
};

const renderStep = ({ patch, spellType } = {}) => {
  observedState = null;
  return render(
    <SpellWizardProvider>
      <SeedGate patch={patch} spellType={spellType}>
        <Step5Resources />
      </SeedGate>
    </SpellWizardProvider>
  );
};

const actionPointsOption = () =>
  screen
    .getByText('Action Points', { selector: '.resource-type-name' })
    .closest('.resource-type-option');

const reactPropsOf = (element) =>
  element[Object.keys(element).find(key => key.startsWith('__reactProps$'))];

describe('Step5Resources zero-AP authoring (mounted real provider)', () => {
  it('preserves a selected fixed editor 0 and canonical 0 through input, summary and emitted patch', () => {
    const { container } = renderStep({
      patch: {
        resourceTypes: ['actionPoints'],
        resourceValues: { actionPoints: 0 },
        actionPoints: 0
      }
    });

    expect(observedState.resourceCost.actionPoints).toBe(0);
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    expect(
      container.querySelector('.resource-summary-body .resource-cost-value').textContent.trim()
    ).toBe('0');
  });

  it('renders canonical 0 in the AP input when the editor value is missing, then commits an edit to 2', () => {
    renderStep({
      patch: { resourceTypes: ['actionPoints'], resourceValues: {}, actionPoints: 0 }
    });

    const input = screen.getByDisplayValue('0');
    expect(observedState.resourceCost.actionPoints).toBe(0);

    fireEvent.change(input, { target: { value: '2' } });

    expect(observedState.resourceCost.actionPoints).toBe(2);
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('commits selected editor 0 over canonical 2', () => {
    renderStep({
      patch: { resourceTypes: ['actionPoints'], resourceValues: {}, actionPoints: 2 }
    });

    const input = screen.getByDisplayValue('2');
    fireEvent.change(input, { target: { value: '0' } });

    expect(observedState.resourceCost.actionPoints).toBe(0);
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
  });

  it('retains canonical 0 across deselect and reselect of the AP editing row', () => {
    renderStep({
      patch: {
        resourceTypes: ['actionPoints'],
        resourceValues: { actionPoints: 0 },
        actionPoints: 0
      }
    });

    fireEvent.click(actionPointsOption());

    expect(observedState.resourceCost.actionPoints).toBe(0);
    expect(screen.getByText('No additional resource costs selected')).toBeInTheDocument();
    expect(screen.queryByText('Free Spell')).not.toBeInTheDocument();
    expect(screen.queryByText(/can be cast freely/)).not.toBeInTheDocument();

    fireEvent.click(actionPointsOption());

    expect(observedState.resourceCost.actionPoints).toBe(0);
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
  });

  it('uses the authoring fallback 1 instead of a deselected stale editor 0', () => {
    renderStep({
      patch: {
        resourceTypes: [],
        resourceValues: { actionPoints: 0 },
        actionPoints: undefined
      }
    });

    expect(observedState.resourceCost.actionPoints).toBe(1);
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  it('retains a just-entered 0 through a same-batch edit and deselect of the AP row', () => {
    renderStep({
      patch: {
        actionPoints: 2,
        resourceTypes: ['actionPoints'],
        resourceValues: { actionPoints: 2 }
      }
    });

    const input = screen.getByRole('spinbutton');
    const option = actionPointsOption();

    act(() => {
      ReactDOM.unstable_batchedUpdates(() => {
        reactPropsOf(input).onChange({ target: { value: '0' } });
        reactPropsOf(option).onClick();
      });
    });

    expect(observedState.resourceCost.actionPoints).toBe(0);
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  it('retains a just-entered 0 through a same-batch edit, deselect and reselect of the AP row', () => {
    renderStep({
      patch: {
        actionPoints: 2,
        resourceTypes: ['actionPoints'],
        resourceValues: { actionPoints: 2 }
      }
    });

    const input = screen.getByRole('spinbutton');
    const option = actionPointsOption();

    act(() => {
      ReactDOM.unstable_batchedUpdates(() => {
        reactPropsOf(input).onChange({ target: { value: '0' } });
        reactPropsOf(option).onClick();
        reactPropsOf(option).onClick();
      });
    });

    expect(observedState.resourceCost.actionPoints).toBe(0);
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    expect(
      document.querySelector('.resource-summary-body .resource-cost-value').textContent.trim()
    ).toBe('0');
  });

  it('falls back to 1 only when both AP encodings are genuinely missing', () => {
    renderStep({
      patch: { resourceTypes: [], resourceValues: {}, actionPoints: undefined }
    });

    expect(observedState.resourceCost.actionPoints).toBe(1);
  });

  it('keeps explicit PASSIVE 0 at 0 without introducing a new type default', () => {
    renderStep({
      spellType: 'PASSIVE',
      patch: { actionPoints: 0, resourceTypes: [] }
    });

    expect(observedState.resourceCost.actionPoints).toBe(0);
    expect(observedState.resourceCost.actionPoints).not.toBe(1);
  });

  it('retains the existing fallback for genuinely missing PASSIVE AP', () => {
    renderStep({
      spellType: 'PASSIVE',
      patch: { resourceTypes: [], resourceValues: {}, actionPoints: undefined }
    });

    expect(observedState.resourceCost.actionPoints).toBe(1);
  });

  it('omits the AP replacement for a malformed supplied draft and labels it invalid', () => {
    const { container } = renderStep({
      patch: { resourceTypes: ['actionPoints'], resourceValues: {}, actionPoints: null }
    });

    expect(observedState.resourceCost.actionPoints).toBeNull();
    expect(container.textContent).toContain('(invalid)');
    expect(screen.getByRole('spinbutton').value).toBe('');
  });

  it('keeps positive canonical 2 stable through an unrelated resource edit', () => {
    renderStep({
      patch: {
        actionPoints: 2,
        resourceTypes: ['mana'],
        resourceValues: { mana: 4 }
      }
    });

    expect(observedState.resourceCost.actionPoints).toBe(2);

    fireEvent.change(screen.getByDisplayValue('4'), { target: { value: '3' } });

    expect(observedState.resourceCost.actionPoints).toBe(2);
    expect(observedState.resourceCost.resourceValues.mana).toBe(3);
  });

  it('keeps explicit-zero AP with nonzero mana and structured resourceCost through canonical serialization', () => {
    renderStep({
      patch: {
        actionPoints: 0,
        resourceTypes: ['actionPoints', 'mana'],
        resourceValues: { actionPoints: 0, mana: 4 },
        spheres: ['arcane', 'arcane', 'rime'],
        classResource: { type: 'fervor', gain: 10 }
      }
    });

    expect(observedState.resourceCost.actionPoints).toBe(0);
    expect(observedState.resourceCost.resourceValues.mana).toBe(4);

    const roundTrip = deserializeSpell(serializeSpell(observedState));
    expect(roundTrip.resourceCost.actionPoints).toBe(0);
    expect(roundTrip.resourceCost.resourceValues.mana).toBe(4);
    expect(roundTrip.resourceCost.spheres).toEqual(['arcane', 'arcane', 'rime']);
    expect(roundTrip.resourceCost.classResource).toEqual({ type: 'fervor', gain: 10 });
  });
});
