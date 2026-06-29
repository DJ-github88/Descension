import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MythrillWindow from '../MythrillWindow';

// Mock Zustand stores to avoid Firebase/Socket connections during testing
jest.mock('../../../store/windowManagerStore', () => {
  const store = {
    registerWindow: jest.fn(),
    bringToFront: jest.fn(),
    unregisterWindow: jest.fn(),
    layoutVersion: 1,
    getCascadeOffset: () => ({ x: 0, y: 0 })
  };
  const mockHook = (selector) => selector(store);
  mockHook.getState = () => store;
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/settingsStore', () => {
  const store = {
    windowScale: 1
  };
  return {
    __esModule: true,
    default: (selector) => selector(store)
  };
});

jest.mock('../../../store/gameStore', () => {
  const store = {
    currentRoomId: 'room-1'
  };
  return {
    __esModule: true,
    default: (selector) => selector(store)
  };
});

describe('MythrillWindow Component', () => {
  it('renders window title and children when open', () => {
    render(
      <MythrillWindow isOpen={true} title="Test Window" onClose={jest.fn()}>
        <div data-testid="window-child">Hello World</div>
      </MythrillWindow>
    );

    expect(screen.getByText('Test Window')).toBeInTheDocument();
    expect(screen.getByTestId('window-child')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <MythrillWindow isOpen={false} title="Hidden Window" onClose={jest.fn()}>
        <div>Hidden Child</div>
      </MythrillWindow>
    );

    expect(screen.queryByText('Hidden Window')).not.toBeInTheDocument();
  });

  it('triggers onClose when the close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <MythrillWindow isOpen={true} title="Test Window" onClose={handleClose} />
    );

    const closeBtn = screen.getByRole('button', { name: /close/i });
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders and switches tabs correctly', () => {
    const tabs = [
      { id: 'tab1', label: 'First Tab' },
      { id: 'tab2', label: 'Second Tab' }
    ];
    const handleTabChange = jest.fn();

    render(
      <MythrillWindow 
        isOpen={true} 
        title="Tab Window" 
        headerTabs={tabs} 
        activeTab="tab1" 
        onTabChange={handleTabChange} 
        onClose={jest.fn()}
      />
    );

    const tab1Btn = screen.getByText('First Tab');
    const tab2Btn = screen.getByText('Second Tab');
    expect(tab1Btn).toBeInTheDocument();
    expect(tab2Btn).toBeInTheDocument();

    fireEvent.click(tab2Btn);
    expect(handleTabChange).toHaveBeenCalledWith('tab2');
  });
});
