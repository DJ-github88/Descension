import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayerJournalWindow from '../PlayerJournalWindow';
import useAuthStore from '../../../store/authStore';
import useGameStore from '../../../store/gameStore';

jest.mock('../../../store/windowManagerStore', () => {
  const store = {
    registerWindow: jest.fn(),
    bringToFront: jest.fn(),
    unregisterWindow: jest.fn(),
    layoutVersion: 1,
    getCascadeOffset: () => ({ x: 0, y: 0 })
  };
  const mockHook = (selector) => (typeof selector === 'function' ? selector(store) : store);
  mockHook.getState = () => store;
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/settingsStore', () => {
  const store = { windowScale: 1 };
  return {
    __esModule: true,
    default: (selector) => (typeof selector === 'function' ? selector(store) : store)
  };
});

let mockFeatureFull = false;
let mockFeatureBasic = true;
jest.mock('../../../hooks/useFeatureFlag', () => {
  return {
    __esModule: true,
    default: (flag) => {
      if (flag === 'journalFull') return { allowed: mockFeatureFull, loading: false };
      return { allowed: mockFeatureBasic, loading: false };
    }
  };
});

jest.mock('../../../services/campaignService', () => ({
  __esModule: true,
  default: {
    getCampaigns: jest.fn().mockResolvedValue([])
  }
}));

jest.mock('../../books/BookManager', () => {
  return function MockBookManager(props) {
    return (
      <div
        data-testid="mock-book-manager"
        data-ingame={props.inGameSession ? 'true' : 'false'}
        data-allowwrite={props.allowWrite ? 'true' : 'false'}
      />
    );
  };
});

describe('PlayerJournalWindow Account & Guest Capability Gating', () => {
  beforeEach(() => {
    mockFeatureFull = false;
    mockFeatureBasic = true;
    useGameStore.setState({ isGMMode: false, currentRoomId: 'test-room' });
  });

  test('completely hides Knowledge Board and Books & Chapters for guest / unauthenticated accounts', () => {
    useAuthStore.setState({
      user: { isGuest: true, uid: 'guest-123' },
      isAuthenticated: true
    });

    render(<PlayerJournalWindow isOpen={true} onClose={() => {}} />);

    // Knowledge Board and Books tabs must be completely hidden
    expect(screen.queryByText('Knowledge Board')).not.toBeInTheDocument();
    expect(screen.queryByText('Books & Chapters')).not.toBeInTheDocument();

    // Received Handouts and My Notes must be fully accessible
    expect(screen.getByText('Received Handouts')).toBeInTheDocument();
    expect(screen.getByText('My Notes')).toBeInTheDocument();

    // Must NOT display any locked modal or restriction container
    expect(screen.queryByText(/Upgrade your account/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Restricted/i)).not.toBeInTheDocument();
  });

  test('hides Knowledge Board for free-tier authenticated accounts without journalFull', () => {
    useAuthStore.setState({
      user: { isGuest: false, uid: 'user-free-456' },
      isAuthenticated: true
    });
    mockFeatureFull = false;

    render(<PlayerJournalWindow isOpen={true} onClose={() => {}} />);

    // Knowledge Board is locked and therefore completely hidden
    expect(screen.queryByText('Knowledge Board')).not.toBeInTheDocument();

    // Books & Chapters, Received Handouts, and My Notes are visible
    expect(screen.getByText('Books & Chapters')).toBeInTheDocument();
    expect(screen.getByText('Received Handouts')).toBeInTheDocument();
    expect(screen.getByText('My Notes')).toBeInTheDocument();
  });

  test('shows Knowledge Board and Books & Chapters when user has journalFull capability or is GM', () => {
    useAuthStore.setState({
      user: { isGuest: false, uid: 'user-pro-789' },
      isAuthenticated: true
    });
    mockFeatureFull = true;

    render(<PlayerJournalWindow isOpen={true} onClose={() => {}} />);

    expect(screen.getByText('Knowledge Board')).toBeInTheDocument();
    expect(screen.getByText('Books & Chapters')).toBeInTheDocument();
    expect(screen.getByText('Received Handouts')).toBeInTheDocument();
    expect(screen.getByText('My Notes')).toBeInTheDocument();
  });
});
