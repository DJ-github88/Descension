import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Step3Effects from '../Step3Effects';
import {
  SpellWizardProvider,
  useSpellWizardState,
  useSpellWizardDispatch,
  actionCreators
} from '../../../context/spellWizardContext';
import { SpellLibraryProvider } from '../../../context/SpellLibraryContext';
import { CreatureLibraryProvider } from '../../../../creature-wizard/context/CreatureLibraryContext.js';

jest.mock('../../../../../persistence/spellLibraryScopedStorage', () => ({
  loadSpellLibraryData: () => null,
  saveSpellLibraryData: () => {},
  loadCustomSpells: () => [],
  saveCustomSpells: () => {},
  loadDeletedSpellIds: () => [],
  saveDeletedSpellIds: () => {}
}));

jest.mock('../../../../../services/firebase/userSpellService', () => ({
  loadUserSpells: () => Promise.resolve([])
}));

jest.mock('../../../../../utils/assetManager', () => ({
  getIconUrl: () => 'test-icon.png',
  getAbilityIconUrl: () => 'test-icon.png',
  getCustomIconUrl: () => 'fallback-icon.png',
  getCreatureTokenIconUrl: () => 'test-icon.png'
}));

let latestState = null;

function StateProbe() {
  latestState = useSpellWizardState();
  return null;
}

function PassiveTriggerToggle() {
  const dispatch = useSpellWizardDispatch();
  return (
    <button
      type="button"
      onClick={() => dispatch(actionCreators.setSpellType('PASSIVE'))}
    >
      Switch to PASSIVE
    </button>
  );
}

function renderStep3() {
  latestState = null;
  return render(
    <SpellLibraryProvider>
      <CreatureLibraryProvider>
        <SpellWizardProvider>
          <StateProbe />
          <PassiveTriggerToggle />
          <Step3Effects
            stepNumber={3}
            totalSteps={10}
            isActive={true}
            onNext={jest.fn()}
            onPrevious={jest.fn()}
          />
        </SpellWizardProvider>
      </CreatureLibraryProvider>
    </SpellLibraryProvider>
  );
}

describe('Step3Effects composed effect profile button', () => {
  test('lists all five canonical effects (Stunned, movement, attribute, flat DR, periodic tick) and opens AuthoredConditionFields with all five options', () => {
    renderStep3();

    const controlTitle = screen.getByText('Control', { selector: 'h3' });
    fireEvent.click(controlTitle.closest('.effect-type-card') || controlTitle);

    const expectedLabel =
      'Use composed effect profile — Stunned, movement, attribute, flat DR, or periodic tick, structured expiry (replace control configuration)';

    const profileBtn = screen.getByRole('button', { name: expectedLabel });
    expect(profileBtn).toBeInTheDocument();
    expect(screen.queryByText(/Stunned or movement change/i)).not.toBeInTheDocument();

    fireEvent.click(profileBtn);

    expect(latestState.controlConfig?.authoredCondition).toEqual(
      expect.objectContaining({
        profile: 'authored-effect:v1',
        effect: 'stunned',
        expiryPolicy: 'target-next-end'
      })
    );

    const canonicalSelect = screen.getByLabelText(/Canonical effect/i);
    const optionValues = Array.from(canonicalSelect.querySelectorAll('option')).map(o => o.value);
    expect(optionValues).toEqual(['stunned', 'movement', 'attribute', 'damageReduction', 'periodic']);
  });

  test('defaults PASSIVE spells to gm-manual expiry when activating the composed effect profile', () => {
    renderStep3();

    fireEvent.click(screen.getByRole('button', { name: 'Switch to PASSIVE' }));
    const controlTitle = screen.getByText('Control', { selector: 'h3' });
    fireEvent.click(controlTitle.closest('.effect-type-card') || controlTitle);

    const profileBtn = screen.getByRole('button', {
      name: /Use composed effect profile — Stunned, movement, attribute, flat DR, or periodic tick, structured expiry/i
    });
    fireEvent.click(profileBtn);

    expect(latestState.controlConfig?.authoredCondition).toEqual(
      expect.objectContaining({
        profile: 'authored-effect:v1',
        effect: 'stunned',
        expiryPolicy: 'gm-manual'
      })
    );
  });
});
