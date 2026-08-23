import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import useDialogStore from '../../../store/dialogStore';
import CustomDialogContainer from '../CustomDialogContainer';
import { showConfirm, showAlert, showPrompt } from '../../../utils/dialogService';

describe('CustomDialog System', () => {
  beforeEach(() => {
    act(() => {
      useDialogStore.setState({ dialogs: [] });
    });
  });

  test('renders confirm dialog and resolves true on confirm', async () => {
    render(<CustomDialogContainer />);

    let confirmPromise;
    act(() => {
      confirmPromise = showConfirm({
        title: 'Remove Dynasty Member',
        message: 'Remove Nikolaos Alduin from dynasty?',
        confirmText: 'Remove',
        isDestructive: true
      });
    });

    expect(screen.getByText('Remove Dynasty Member')).toBeInTheDocument();
    expect(screen.getByText('Remove Nikolaos Alduin from dynasty?')).toBeInTheDocument();
    
    const removeBtn = screen.getByRole('button', { name: /Remove/i });
    act(() => {
      fireEvent.click(removeBtn);
    });

    const result = await confirmPromise;
    expect(result).toBe(true);
    expect(screen.queryByText('Remove Dynasty Member')).not.toBeInTheDocument();
  });

  test('resolves false when cancel button is clicked', async () => {
    render(<CustomDialogContainer />);

    let confirmPromise;
    act(() => {
      confirmPromise = showConfirm({
        title: 'Delete Item',
        message: 'Are you sure you want to delete this item?',
        cancelText: 'Cancel'
      });
    });

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    act(() => {
      fireEvent.click(cancelBtn);
    });

    const result = await confirmPromise;
    expect(result).toBe(false);
  });

  test('renders prompt dialog and returns entered text on confirm', async () => {
    render(<CustomDialogContainer />);

    let promptPromise;
    act(() => {
      promptPromise = showPrompt({
        title: 'New Faction',
        message: 'Enter name of new Faction / House:',
        defaultValue: 'House of Alduin',
        confirmText: 'Create'
      });
    });

    const input = screen.getByDisplayValue('House of Alduin');
    act(() => {
      fireEvent.change(input, { target: { value: 'High House of Valyria' } });
    });

    const createBtn = screen.getByRole('button', { name: /Create/i });
    act(() => {
      fireEvent.click(createBtn);
    });

    const result = await promptPromise;
    expect(result).toBe('High House of Valyria');
  });

  test('renders alert dialog with single acknowledge button', async () => {
    render(<CustomDialogContainer />);

    let alertPromise;
    act(() => {
      alertPromise = showAlert({
        title: 'Heal Party',
        message: 'You have healed the entire party.'
      });
    });

    expect(screen.getByText('Heal Party')).toBeInTheDocument();
    expect(screen.getByText('You have healed the entire party.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Cancel/i })).not.toBeInTheDocument();

    const okBtn = screen.getByRole('button', { name: /OK/i });
    act(() => {
      fireEvent.click(okBtn);
    });

    const result = await alertPromise;
    expect(result).toBe(true);
  });
});
