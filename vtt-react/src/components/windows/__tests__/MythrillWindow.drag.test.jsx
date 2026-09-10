import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MythrillWindow from '../MythrillWindow';
import MockDraggable from 'react-draggable';

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

// Capture the props MythrillWindow -> DraggableWindow -> react-draggable wires up.
// NOTE: react-resizable imports DraggableCore from this same module, so the
// mock must preserve the real named exports and only wrap the default export.
jest.mock('react-draggable', () => {
  const React = require('react');
  const actual = jest.requireActual('react-draggable');
  const Mock = (props) => <div data-testid="mock-draggable">{props.children}</div>;
  Mock.captured = { props: null };
  const Wrapped = (props) => {
    Wrapped.captured.props = props;
    return <Mock {...props} />;
  };
  Wrapped.captured = Mock.captured;
  return { ...actual, __esModule: true, default: Wrapped };
});

const getDraggableProps = () => MockDraggable.captured.props;

describe('MythrillWindow drag surfaces', () => {
  beforeEach(() => {
    MockDraggable.captured.props = null;
  });

  it('includes content + tab strips in the drag handle by default', () => {
    render(
      <MythrillWindow
        isOpen={true}
        title="Drag Window"
        onClose={jest.fn()}
        customHeader={<div className="spellbook-tab-container" />}
      >
        <div>content</div>
      </MythrillWindow>
    );

    const props = getDraggableProps();
    expect(props).not.toBeNull();
    expect(props.handle).toMatch(/window-content/);
    expect(props.handle).toMatch(/spellbook-tab-container/);
    expect(props.handle).toMatch(/tk-tab-container/);
    expect(props.handle).toMatch(/window-header/);
  });

  it('keeps tab buttons draggable but cancels other buttons/inputs', () => {
    render(
      <MythrillWindow isOpen={true} title="Drag Window" onClose={jest.fn()}>
        <button>content action</button>
        <input aria-label="content input" />
      </MythrillWindow>
    );

    const props = getDraggableProps();
    expect(props.cancel).toMatch(/button:not\(/);
    // Tab button classes are carved out of the button cancel ...
    expect(props.cancel).toMatch(/\.spellbook-tab-button/);
    expect(props.cancel).toMatch(/\.tk-tab/);
    expect(props.cancel).toMatch(/\.window-header-tab/);
    // ... while plain controls stay cancelled.
    expect(props.cancel).toMatch(/input/);
    expect(props.cancel).toMatch(/select/);
    expect(props.cancel).toMatch(/textarea/);
    expect(props.cancel).toMatch(/\.window-no-drag/);
  });

  it('opts out of content drag with disableContentDrag', () => {
    render(
      <MythrillWindow
        isOpen={true}
        title="Legacy Window"
        onClose={jest.fn()}
        disableContentDrag
      >
        <div>content</div>
      </MythrillWindow>
    );

    const props = getDraggableProps();
    expect(props.handle).not.toMatch(/window-content/);
    expect(props.handle).toMatch(/window-header/);
    expect(props.cancel).toBeUndefined();
  });

  it('still closes and switches tabs on plain clicks (no drag)', () => {
    const handleClose = jest.fn();
    const handleTabChange = jest.fn();
    render(
      <MythrillWindow
        isOpen={true}
        title="Tab Window"
        headerTabs={[
          { id: 'tab1', label: 'First Tab' },
          { id: 'tab2', label: 'Second Tab' }
        ]}
        activeTab="tab1"
        onTabChange={handleTabChange}
        onClose={handleClose}
      />
    );

    fireEvent.click(screen.getByText('Second Tab'));
    expect(handleTabChange).toHaveBeenCalledWith('tab2');

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
