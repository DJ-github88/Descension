import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PartyEventToast from '../PartyEventToast';
import ExitGameConfirmDialog from '../../dialogs/ExitGameConfirmDialog';

describe('PartyEventToast', () => {
    it('renders party_created notification with calm structure and header', () => {
        const event = {
            id: 'test-1',
            type: 'party_created',
            message: 'Party "Single Player Party" created successfully'
        };
        const onDismiss = jest.fn();

        render(<PartyEventToast event={event} onDismiss={onDismiss} />);

        // Header in Cinzel
        expect(screen.getByText('Party Created')).toBeInTheDocument();
        // Body formatted cleanly with quotes emphasized in strong
        expect(screen.getByText('“Single Player Party”')).toBeInTheDocument();
        expect(screen.getByLabelText('Dismiss notification')).toBeInTheDocument();
    });

    it('renders joined notification with member name', () => {
        const event = {
            id: 'test-2',
            type: 'joined',
            memberName: 'Gimli'
        };
        const onDismiss = jest.fn();

        render(<PartyEventToast event={event} onDismiss={onDismiss} />);

        expect(screen.getByText('Member Joined')).toBeInTheDocument();
        expect(screen.getByText('Gimli')).toBeInTheDocument();
    });

    it('calls onDismiss when close button is clicked', () => {
        jest.useFakeTimers();
        const event = {
            id: 'test-3',
            type: 'party_created',
            message: 'Party created'
        };
        const onDismiss = jest.fn();

        render(<PartyEventToast event={event} onDismiss={onDismiss} />);

        fireEvent.click(screen.getByLabelText('Dismiss notification'));
        jest.advanceTimersByTime(350);
        expect(onDismiss).toHaveBeenCalledWith('test-3');
        jest.useRealTimers();
    });
});

describe('ExitGameConfirmDialog', () => {
    it('renders with calm TTRPG manuscript structure and seal', () => {
        const onConfirm = jest.fn();
        const onCancel = jest.fn();

        render(<ExitGameConfirmDialog gameName="Mythrill" onConfirm={onConfirm} onCancel={onCancel} />);

        expect(screen.getByText('Departure Confirmation')).toBeInTheDocument();
        expect(screen.getByText('Depart Mythrill?')).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you wish to return to the realm gates/i)).toBeInTheDocument();
        expect(screen.getByText('Stay in Realm')).toBeInTheDocument();
        expect(screen.getByText('Exit Game')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Exit Game'));
        expect(onConfirm).toHaveBeenCalled();

        fireEvent.click(screen.getByText('Stay in Realm'));
        expect(onCancel).toHaveBeenCalled();
    });
});
