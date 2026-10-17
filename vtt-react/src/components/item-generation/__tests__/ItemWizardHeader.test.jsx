/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItemWizard from '../ItemWizard';

describe('ItemWizard Header & Titlebar', () => {
  it('renders the illuminated titlebar and stepper bar', () => {
    const handleClose = jest.fn();
    render(<ItemWizard onClose={handleClose} initialData={{ type: 'weapon' }} />);

    expect(screen.getByText(/Enchanted Item Forge/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();

    const closeBtn = document.querySelector('.wizard-window-close-btn');
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it('advances through steps when clicking Next', () => {
    render(<ItemWizard onClose={() => {}} initialData={{ type: 'weapon' }} />);

    expect(screen.getByText(/Step 1 of/i)).toBeInTheDocument();
    const nextBtn = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Step 2 of/i)).toBeInTheDocument();
  });
});
