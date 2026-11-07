import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LibraryWindow from '../LibraryWindow';

jest.mock('../../creature-wizard/components/library/CreatureLibrary', () => () => (
  <div data-testid="mock-creature-library">Creature Library</div>
));
jest.mock('../../item-generation/ItemLibrary', () => (props) => (
  <div data-testid="mock-item-library">
    Item Library
    <button data-testid="mock-item-library-close" onClick={props.onClose}>Close Inner</button>
  </div>
));
jest.mock('../MapLibraryWindow', () => (props) => (
  <div data-testid="mock-map-library">
    Map Library
    <button data-testid="mock-map-library-close" onClick={props.onClose}>Close Inner</button>
  </div>
));
jest.mock('../../creature-wizard/CreatureWizardApp', () => () => (
  <div data-testid="mock-creature-wizard">Creature Wizard</div>
));
jest.mock('../../creature-wizard/components/library/CommunityCreaturesTab', () => () => (
  <div data-testid="mock-community-creatures">Community Creatures</div>
));
jest.mock('../../../store/windowManagerStore', () => {
  const store = {
    getWindowPosition: () => ({ x: 80, y: 80 }),
    getWindowSize: () => ({ width: 1100, height: 700 }),
    setWindowPosition: jest.fn(),
    setWindowSize: jest.fn(),
    registerWindow: jest.fn(),
    bringToFront: jest.fn(),
    unregisterWindow: jest.fn(),
    layoutVersion: 1,
    getCascadeOffset: () => ({ x: 0, y: 0 }),
  };
  const mockHook = (selector) => selector(store);
  mockHook.getState = () => store;
  return {
    __esModule: true,
    default: mockHook,
  };
});
jest.mock('../../../store/gameStore', () => {
  const store = {
    isGMMode: true,
  };
  return {
    __esModule: true,
    default: (selector) => selector(store),
  };
});

describe('LibraryWindow', () => {
  it('renders grand library shelf by default', () => {
    render(<LibraryWindow isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText(/Mythrill Grand Library/i)).toBeInTheDocument();
  });

  it('navigates directly into Armory when targetSection="items"', () => {
    render(<LibraryWindow isOpen={true} onClose={jest.fn()} targetSection="items" />);
    expect(screen.getByTestId('mock-item-library')).toBeInTheDocument();
  });

  it('navigates directly into Bestiary when targetSection="creatures"', () => {
    render(<LibraryWindow isOpen={true} onClose={jest.fn()} targetSection="creatures" />);
    expect(screen.getByTestId('mock-creature-library')).toBeInTheDocument();
  });

  it('navigates directly into Atlas when targetSection="maps"', () => {
    render(<LibraryWindow isOpen={true} onClose={jest.fn()} targetSection="maps" />);
    expect(screen.getByTestId('mock-map-library')).toBeInTheDocument();
  });

  it('closes the window when clicking X while in Armory, without navigating back to shelf', () => {
    const handleClose = jest.fn();
    const handleSectionChange = jest.fn();
    render(
      <LibraryWindow
        isOpen={true}
        onClose={handleClose}
        targetSection="items"
        onSectionChange={handleSectionChange}
      />
    );

    expect(screen.getByTestId('mock-item-library')).toBeInTheDocument();

    // Find the close button (the X button with aria-label="Close")
    const closeBtn = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeBtn);

    // onClose MUST be called to close the window
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleSectionChange).toHaveBeenCalledWith(null);
  });

  it('closes the window when clicking X while reading a book', () => {
    const handleClose = jest.fn();
    render(<LibraryWindow isOpen={true} onClose={handleClose} />);

    // Click a gem book on the shelf
    const gemButtons = screen.getAllByRole('button', { name: /open /i });
    // Click the first one
    fireEvent.click(gemButtons[0]);

    // Click the window close button
    const closeBtn = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('navigates back to the shelf when clicking the Back button in the header', () => {
    const handleClose = jest.fn();
    const handleSectionChange = jest.fn();
    render(
      <LibraryWindow
        isOpen={true}
        onClose={handleClose}
        targetSection="items"
        onSectionChange={handleSectionChange}
      />
    );

    // The header back button
    const backBtn = screen.getByTitle('Back to library shelf');
    fireEvent.click(backBtn);

    // Should NOT close the window
    expect(handleClose).not.toHaveBeenCalled();
    // Should notify section change to null
    expect(handleSectionChange).toHaveBeenCalledWith(null);
    // Should show the bookshelf now
    expect(screen.getByText(/Mythrill Grand Library/i)).toBeInTheDocument();
  });
});
