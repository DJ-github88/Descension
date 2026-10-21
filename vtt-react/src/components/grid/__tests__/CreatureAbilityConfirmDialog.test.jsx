import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreatureAbilityConfirmDialog from '../CreatureAbilityConfirmDialog';

describe('CreatureAbilityConfirmDialog', () => {
  const sampleAbility = {
    id: 'black-ice-hoofprint',
    name: 'Black-Ice-Hoofprint',
    type: 'spell',
    description: 'Leaves chilling hooves of frost in the ground.',
    apCost: 1,
    manaCost: 5,
    formula: '2d8+3',
    damageType: 'rime'
  };

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <CreatureAbilityConfirmDialog
        isOpen={false}
        creatureName="Alpmarr"
        ability={sampleAbility}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders notice-only mode in calm manuscript TTRPG theme', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    render(
      <CreatureAbilityConfirmDialog
        isOpen={true}
        creatureName="Alpmarr"
        ability={sampleAbility}
        noticeOnly={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    // Header
    expect(screen.getByText('Manual Ability Notice')).toBeInTheDocument();
    // Creature info
    expect(screen.getByText('ALPMARR')).toBeInTheDocument();
    // Notice Callout
    expect(screen.getByText(/Notice Only · No Automated Consequence/i)).toBeInTheDocument();
    expect(screen.getByText(/Manual notice only/i)).toBeInTheDocument();
    // Ability details
    expect(screen.getByText('Black-Ice-Hoofprint')).toBeInTheDocument();
    expect(screen.getByText(/2d8\+3/)).toBeInTheDocument();
    // Resource cost
    expect(screen.getByText('1 AP')).toBeInTheDocument();
    expect(screen.getByText('5 MP')).toBeInTheDocument();
    // Buttons
    const confirmBtn = screen.getByRole('button', { name: 'Post Manual Notice' });
    expect(confirmBtn).toBeInTheDocument();
    expect(confirmBtn).not.toBeDisabled();

    fireEvent.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalledTimes(1);

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders standard ability confirmation with resource validation', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    render(
      <CreatureAbilityConfirmDialog
        isOpen={true}
        creatureName="Alpmarr"
        ability={sampleAbility}
        noticeOnly={false}
        currentAP={4}
        maxAP={4}
        currentMana={30}
        maxMana={30}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText('Confirm Ability')).toBeInTheDocument();
    expect(screen.getByText('Current Resources')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Use Black-Ice-Hoofprint/i })).not.toBeDisabled();
  });

  it('disables confirm button when insufficient resources in standard mode', () => {
    render(
      <CreatureAbilityConfirmDialog
        isOpen={true}
        creatureName="Alpmarr"
        ability={sampleAbility}
        noticeOnly={false}
        currentAP={0}
        maxAP={4}
        currentMana={2}
        maxMana={30}
      />
    );

    expect(screen.getByText(/Insufficient resources!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Insufficient Resources' })).toBeDisabled();
  });
});
