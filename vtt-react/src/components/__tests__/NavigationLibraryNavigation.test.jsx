import React, { Suspense } from 'react';
import { render, act } from '@testing-library/react';
import Navigation from '../Navigation';
import useGameStore from '../../store/gameStore';

jest.mock('../windows/LibraryWindow', () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="mock-library-window">
      LibraryWindow: {props.targetSection || 'shelf'}
      <button data-testid="close-lib-btn" onClick={props.onClose}>Close</button>
    </div>
  ),
}));

describe('Navigation Library Hotkeys (I, N, A, L)', () => {
  beforeEach(() => {
    useGameStore.setState({
      isGMMode: true,
      activeSceneMode: 'tactical',
      cameraX: 0,
      cameraY: 0,
      gridSize: 50,
      gridOffsetX: 0,
      gridOffsetY: 0,
    });
  });

  it('opens Armory on pressing I and toggles closed on pressing I again', async () => {
    const { queryByTestId, findByText } = render(
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation onReturnToLanding={jest.fn()} />
      </Suspense>
    );

    // Allow component to finish mount effects
    await act(async () => {
      await new Promise(r => setTimeout(r, 50));
    });

    expect(queryByTestId('mock-library-window')).not.toBeInTheDocument();

    // Press 'i' to open Armory
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'i', code: 'KeyI', bubbles: true }));
    });

    expect(await findByText(/LibraryWindow: items/i)).toBeInTheDocument();

    // Press 'i' again to toggle closed
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'i', code: 'KeyI', bubbles: true }));
    });

    expect(queryByTestId('mock-library-window')).not.toBeInTheDocument();
  });

  it('opens Bestiary on pressing N and toggles closed on pressing N again', async () => {
    const { queryByTestId, findByText } = render(
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation onReturnToLanding={jest.fn()} />
      </Suspense>
    );

    // Press 'n' to open Bestiary
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', code: 'KeyN', bubbles: true }));
    });

    expect(await findByText(/LibraryWindow: creatures/i)).toBeInTheDocument();

    // Press 'n' again to toggle closed
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', code: 'KeyN', bubbles: true }));
    });

    expect(queryByTestId('mock-library-window')).not.toBeInTheDocument();
  });

  it('opens Atlas on pressing A and toggles closed on pressing A again', async () => {
    const { queryByTestId, findByText } = render(
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation onReturnToLanding={jest.fn()} />
      </Suspense>
    );

    // Press 'a' to open Atlas
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA', bubbles: true }));
    });

    expect(await findByText(/LibraryWindow: maps/i)).toBeInTheDocument();

    // Press 'a' again to toggle closed
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA', bubbles: true }));
    });

    expect(queryByTestId('mock-library-window')).not.toBeInTheDocument();
  });

  it('switches directly between books when pressing their hotkeys', async () => {
    const { queryByTestId, findByText } = render(
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation onReturnToLanding={jest.fn()} />
      </Suspense>
    );

    // Press 'i' -> Armory
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'i', code: 'KeyI', bubbles: true }));
    });
    expect(await findByText(/LibraryWindow: items/i)).toBeInTheDocument();

    // Press 'n' -> switches directly to Bestiary
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', code: 'KeyN', bubbles: true }));
    });
    expect(await findByText(/LibraryWindow: creatures/i)).toBeInTheDocument();

    // Press 'a' -> switches directly to Atlas
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA', bubbles: true }));
    });
    expect(await findByText(/LibraryWindow: maps/i)).toBeInTheDocument();

    // Press 'l' -> switches to Grand Library shelf
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'l', code: 'KeyL', bubbles: true }));
    });
    expect(await findByText(/LibraryWindow: shelf/i)).toBeInTheDocument();

    // Press 'l' again -> closes
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'l', code: 'KeyL', bubbles: true }));
    });
    expect(queryByTestId('mock-library-window')).not.toBeInTheDocument();
  });

  it('supports mythrill_open_library custom event', async () => {
    const { queryByTestId, findByText } = render(
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation onReturnToLanding={jest.fn()} />
      </Suspense>
    );

    await act(async () => {
      window.dispatchEvent(new CustomEvent('mythrill_open_library', {
        detail: { section: 'items' },
      }));
    });

    expect(await findByText(/LibraryWindow: items/i)).toBeInTheDocument();
  });
});
