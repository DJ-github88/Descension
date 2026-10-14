import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoomLobby from '../RoomLobby';

// Mock dependencies
jest.mock('../../../config/firebase', () => ({
  auth: { currentUser: null }
}));

jest.mock('../../../services/roomService', () => ({
  getUserRooms: jest.fn().mockResolvedValue([]),
  createPersistentRoom: jest.fn()
}));

jest.mock('../../../services/localRoomService', () => ({
  subscribeRooms: jest.fn(() => () => {})
}));

jest.mock('../../../persistence/localRoomConversionScoped', () => ({
  loadConversionTransfer: jest.fn(() => ({ ok: true, payload: null })),
  captureConversionTransfer: jest.fn(() => ({ ok: true, payload: null })),
  beginConversionRequest: jest.fn()
}));

jest.mock('../../../persistence/localRoomConversionFlow', () => ({
  beginConversionConfirmation: jest.fn(),
  subscribeConversionFlow: jest.fn((cb) => () => {})
}));

// Allow real scopedConsumer and bootstrapPrivacyGate to run

describe('RoomLobby - Calm TTRPG Theme & Atmospheric Scene', () => {
  const mockSocket = {
    connected: true,
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
  };

  const renderLobby = () => {
    return render(
      <MemoryRouter>
        <RoomLobby
          socket={mockSocket}
          onJoinRoom={jest.fn()}
          onReturnToLanding={jest.fn()}
          onJoinAttempt={jest.fn()}
        />
      </MemoryRouter>
    );
  };

  it('renders the atmospheric expedition desk and world map underlay outside the box', () => {
    const { container } = renderLobby();

    // Verify outer atmospheric layers exist
    expect(container.querySelector('.lobby-desk-surface')).toBeInTheDocument();
    expect(container.querySelector('.lobby-map-underlay')).toBeInTheDocument();
    expect(container.querySelector('.lobby-map-vignette')).toBeInTheDocument();
    expect(container.querySelector('.lobby-hearth-glow')).toBeInTheDocument();
    expect(container.querySelector('.lobby-ambient-embers')).toBeInTheDocument();
    expect(container.querySelector('.lobby-expedition-peripherals')).toBeInTheDocument();

    // Verify perimeter coordinates and whisper prompt
    expect(screen.getByText(/CHRONICLE REGISTER · REALMS OF MYTHRILL/i)).toBeInTheDocument();
    expect(screen.getByText(/LAT 54° 18' N · LONG 12° 40' E/i)).toBeInTheDocument();
    expect(screen.getByText(/Gather your companions, chart your course, and cross the threshold/i)).toBeInTheDocument();
  });

  it('renders brass corner plates on the expedition folio container', () => {
    const { container } = renderLobby();

    expect(container.querySelector('.lobby-corner-bracket.top-left')).toBeInTheDocument();
    expect(container.querySelector('.lobby-corner-bracket.top-right')).toBeInTheDocument();
    expect(container.querySelector('.lobby-corner-bracket.bottom-left')).toBeInTheDocument();
    expect(container.querySelector('.lobby-corner-bracket.bottom-right')).toBeInTheDocument();
  });

  it('renders the main tavern empty state with narrative tone and action button', () => {
    renderLobby();

    expect(screen.getByText(/The Tavern Stands Empty/i)).toBeInTheDocument();
    expect(screen.getByText(/Be the first to light the hearth!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create a Room/i })).toBeInTheDocument();
  });

  it('navigates to Create Room tab with mechanical brass toggles and wizard options', () => {
    const { container } = renderLobby();

    // Click "Create Room" tab
    const createTabBtn = screen.getByRole('button', { name: /Create Room/i });
    fireEvent.click(createTabBtn);

    // Verify create room wizard controls are rendered
    expect(screen.getByPlaceholderText(/Enter room or campaign name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Describe your quest/i)).toBeInTheDocument();
    expect(screen.getByText(/Password Protection/i)).toBeInTheDocument();
    expect(screen.getByText(/Permanent Room/i)).toBeInTheDocument();

    // Verify toggle switches exist
    const toggles = container.querySelectorAll('.toggle-switch-slider');
    expect(toggles.length).toBeGreaterThanOrEqual(2);
  });
});
