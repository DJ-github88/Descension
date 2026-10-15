import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovementConfirmationDialog from '../MovementConfirmationDialog';

describe('MovementConfirmationDialog', () => {
    const baseMovementData = {
        baseMovement: 30,
        totalDistance: 25,
        currentMovementDistance: 25,
        movementUsedThisTurn: 0,
        feetPerTile: 5,
        currentAP: 3,
        requiredAP: 1,
        creatureName: 'Aldric the Paladin'
    };

    test('renders nothing when isOpen is false', () => {
        const { container } = render(
            <MovementConfirmationDialog
                isOpen={false}
                onConfirm={jest.fn()}
                onCancel={jest.fn()}
                movementData={baseMovementData}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    test('renders creature info, movement breakdown, AP cost, and handles buttons', () => {
        const onConfirm = jest.fn();
        const onCancel = jest.fn();

        render(
            <MovementConfirmationDialog
                isOpen={true}
                onConfirm={onConfirm}
                onCancel={onCancel}
                movementData={baseMovementData}
            />
        );

        // Header and creature info
        expect(screen.getByText('Spend AP to Move')).toBeInTheDocument();
        expect(screen.getByText('ALDRIC THE PALADIN')).toBeInTheDocument();

        // AP block
        expect(screen.getByText('Action Points')).toBeInTheDocument();
        expect(screen.getByText('Current AP:')).toBeInTheDocument();
        expect(screen.getByText('AP Spent to Move:')).toBeInTheDocument();

        // Buttons
        const confirmBtn = screen.getByRole('button', { name: /Spend 1 AP to Move/i });
        expect(confirmBtn).not.toBeDisabled();
        fireEvent.click(confirmBtn);
        expect(onConfirm).toHaveBeenCalledTimes(1);

        const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
        fireEvent.click(cancelBtn);
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test('disables confirm button and shows warning when AP is insufficient', () => {
        const insufficientData = {
            ...baseMovementData,
            currentAP: 0,
            requiredAP: 1
        };

        render(
            <MovementConfirmationDialog
                isOpen={true}
                onConfirm={jest.fn()}
                onCancel={jest.fn()}
                movementData={insufficientData}
            />
        );

        expect(screen.getByText(/Insufficient Action Points! Need 1 AP, have 0 AP\./i)).toBeInTheDocument();
        const confirmBtn = screen.getByRole('button', { name: /Insufficient AP/i });
        expect(confirmBtn).toBeDisabled();
    });
});
