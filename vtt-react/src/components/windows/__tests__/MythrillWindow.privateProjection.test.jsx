/**
 * P5-01 focused regression (2026-10-10 mounted-integration correction).
 *
 * Reproduced defect: the production PlayerJournalWindow renders through
 * MythrillWindow's portal to document.body, outside the PrivateProjectionBoundary
 * host. Hiding the boundary host left the portal visible (`A NOTE` stayed
 * visible with the previous owner's content while the live principal was B).
 *
 * Contract under test: a window that opts in as an account-private projection
 * is hidden synchronously on the gate notification (before React commits) and
 * unmounted while isolation is active; after the destination scope activates
 * it renders again. Public dialogs are unaffected.
 */
import React from 'react';
import { render, act } from '@testing-library/react/pure';
import { cleanup } from '@testing-library/react';
import MythrillWindow from '../MythrillWindow';
import {
  activatePrivateScope,
  markHandoffPending,
  resetBootstrapGateForTests
} from '../../../persistence/bootstrapPrivacyGate';

jest.mock('../../../store/windowManagerStore', () => {
  const store = {
    registerWindow: jest.fn(() => 1000),
    bringToFront: jest.fn(() => 1001),
    unregisterWindow: jest.fn(),
    layoutVersion: 1,
    getCascadeOffset: () => ({ x: 0, y: 0 }),
    getWindowPosition: () => ({ x: 0, y: 0 }),
    getWindowSize: () => ({ width: 800, height: 600 }),
    setWindowPosition: jest.fn(),
    setWindowSize: jest.fn(),
    updateWindowOnClose: jest.fn(),
    setDraggingWindowId: jest.fn(),
    setResizingWindowId: jest.fn()
  };
  const mockHook = (selector) => selector(store);
  mockHook.getState = () => store;
  return { __esModule: true, default: mockHook };
});

jest.mock('../../../store/settingsStore', () => {
  const store = { windowScale: 1 };
  return { __esModule: true, default: (selector) => selector(store) };
});

jest.mock('../../../store/gameStore', () => {
  const store = { currentRoomId: 'room-1', isDraggingItem: false };
  const mockHook = (selector) => selector(store);
  mockHook.getState = () => store;
  return { __esModule: true, default: mockHook };
});

const ownerA = { scopeKind: 'user', scopeId: 'owner-a' };
const ownerB = { scopeKind: 'user', scopeId: 'owner-b' };

const flush = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

beforeEach(() => {
  resetBootstrapGateForTests();
  activatePrivateScope(ownerA);
});

afterEach(() => {
  cleanup();
});

test('P5-01 a private portal window is hidden synchronously and unmounted during a handoff', async () => {
  render(
    React.createElement(
      MythrillWindow,
      { isOpen: true, title: 'Journal', privateProjection: true, onClose: () => {} },
      React.createElement('div', null, 'A NOTE')
    )
  );

  const node = document.querySelector('.adventurer-window');
  expect(node).not.toBeNull();
  expect(node.textContent).toContain('A NOTE');

  // The gate notification hides the live portal node in the same call,
  // before React's asynchronous commit.
  markHandoffPending(true);
  expect(node.style.display).toBe('none');
  expect(node.getAttribute('aria-hidden')).toBe('true');

  // React then unmounts the private window entirely while isolation holds.
  await flush();
  expect(document.querySelector('.adventurer-window')).toBeNull();
  expect(document.body.textContent).not.toContain('A NOTE');

  // A valid destination activation restores the authorized window.
  await act(async () => {
    activatePrivateScope(ownerB);
  });
  await flush();
  const restored = document.querySelector('.adventurer-window');
  expect(restored).not.toBeNull();
  expect(restored.textContent).toContain('A NOTE');
  expect(restored.style.display).not.toBe('none');
});

test('P5-01 a non-private dialog is not hidden by handoff isolation', async () => {
  render(
    React.createElement(
      MythrillWindow,
      { isOpen: true, title: 'Confirm', onClose: () => {} },
      React.createElement('div', null, 'PUBLIC DIALOG')
    )
  );

  const node = document.querySelector('.adventurer-window');
  expect(node).not.toBeNull();

  markHandoffPending(true);
  expect(node.style.display).not.toBe('none');
  await flush();
  const stillMounted = document.querySelector('.adventurer-window');
  expect(stillMounted).not.toBeNull();
  expect(stillMounted.textContent).toContain('PUBLIC DIALOG');
});
