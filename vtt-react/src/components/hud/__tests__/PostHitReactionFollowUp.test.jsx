import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReactionWindowHost from '../ReactionWindowPanel';
import TriggerOfferPanel from '../TriggerOfferPanel';
import useGameStore from '../../../store/gameStore';
import { useReactionWindowStore, changeReactionIntent, refreshReactionWindows } from '../../../services/reactionWindowService';
import { useTriggerOfferStore, refreshTriggerLedger, registerTriggerOfferHandlers } from '../../../services/triggerOfferService';
import { useSpellConsequenceStore, ownerSource, routeSpellCast } from '../../../services/spellConsequenceService';

const pcRef = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'i' };

let mockSocket;
const mockRejoinListeners = new Set();

function makeSocket(connected = true) {
  const handlers = {};
  return {
    connected,
    on: jest.fn((event, fn) => {
      if (!handlers[event]) handlers[event] = new Set();
      handlers[event].add(fn);
    }),
    off: jest.fn((event, fn) => {
      handlers[event]?.delete(fn);
    }),
    emitMock(event, payload) {
      handlers[event]?.forEach(fn => fn(payload));
    }
  };
}

jest.mock('../../../store/gameStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({
    multiplayerRoom: { id: 'r' },
    multiplayerSocket: null,
    isGMMode: false
  }))
}));
jest.mock('../../../store/authStore', () => ({ __esModule: true, default: selector => selector({ user: { uid: 'u' } }) }));
jest.mock('../../../store/characterStore', () => ({ __esModule: true, default: selector => selector({ currentCharacterId: 'c' }) }));
jest.mock('../../../store/characterTokenStore', () => ({ __esModule: true, default: selector => selector({ characterTokens: [] }) }));
jest.mock('../../../store/creatureStore', () => ({ __esModule: true, default: selector => selector({ creatureTokens: [] }) }));
jest.mock('../../../persistence/bootstrapPrivacyGate', () => ({
  isPrivateProjectionIsolated: () => false,
  getBootstrapGateState: () => ({ accountGeneration: 1 })
}));
jest.mock('../../../services/actorConsequenceService', () => ({
  refOf: token => token?.state?.actorContract
}));
jest.mock('../../../services/roomRejoinBus', () => ({
  onRoomRejoined: fn => {
    mockRejoinListeners.add(fn);
    return () => mockRejoinListeners.delete(fn);
  }
}));
jest.mock('../../../services/reactionWindowService', () => ({
  useReactionWindowStore: require('zustand').create(() => ({})),
  reactionPrincipal: () => 'principal',
  bindReactionWindows: () => () => {},
  changeReactionIntent: jest.fn().mockResolvedValue({ success: true }),
  refreshReactionWindows: jest.fn().mockResolvedValue({ success: true }),
  advanceWindowNarration: jest.fn()
}));
jest.mock('../../../services/triggerOfferService', () => {
  const { create } = require('zustand');
  return {
    useTriggerOfferStore: create(() => ({
      projection: null,
      loading: false,
      error: null,
      message: '',
      declined: [],
      setupRequest: null
    })),
    refreshTriggerLedger: jest.fn(),
    registerTriggerOfferHandlers: jest.fn(() => () => {}),
    registerFollowUp: jest.fn(),
    registerComponentWatch: jest.fn(),
    revokeTriggerListener: jest.fn(),
    dismissTriggerOffer: jest.fn(),
    declineTriggerOffer: jest.fn(),
    clearTriggerRegistrationSetup: jest.fn(),
    primaryPcSources: jest.fn(() => []),
    FOLLOWUP_PREDICATE: { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' },
    HEALING_FOLLOWUP_PREDICATE: { occurrence: 'immediate-healing', role: 'source', evidence: 'hpRestored' }
  };
});
jest.mock('../../../services/spellConsequenceService', () => {
  const { create } = require('zustand');
  return {
    useSpellConsequenceStore: create(() => ({
      authoredRoomId: 'r',
      authoredEntries: []
    })),
    refreshAuthoredAbilities: jest.fn(),
    routeSpellCast: jest.fn(() => true),
    ownerSource: jest.fn(() => ({ ref: pcRef }))
  };
});

const makeWindow = (overrides = {}) => ({
  windowId: 'win-12345678',
  epoch: 'e',
  moment: 'on_hit',
  status: 'open',
  remainingMs: 8000,
  receivedAt: performance.now(),
  reactor: pcRef,
  intents: [],
  ...overrides
});

const offerProjection = (obligations = []) => ({
  roomId: 'r',
  viewerRole: 'member',
  revision: 2,
  listeners: [{ listenerId: 'l-1', source: pcRef }],
  obligations
});

const echoLanceOffer = {
  obligationId: 'ob-1',
  listenerId: 'l-1',
  mode: 'follow-up',
  available: true,
  expiresAtSequence: 4,
  definitionRef: { definitionId: 'echo-lance', definitionVersion: 1 }
};

beforeEach(() => {
  jest.clearAllMocks();
  mockRejoinListeners.clear();
  mockSocket = makeSocket(true);
  changeReactionIntent.mockResolvedValue({ success: true });
  refreshReactionWindows.mockResolvedValue({ success: true });
  registerTriggerOfferHandlers.mockReturnValue(() => {});
  routeSpellCast.mockReturnValue(true);
  ownerSource.mockReturnValue({ ref: pcRef });
  useGameStore.setState({ multiplayerRoom: { id: 'r' }, multiplayerSocket: mockSocket, isGMMode: false });
  useSpellConsequenceStore.setState({
    authoredRoomId: 'r',
    authoredEntries: [
      {
        definitionRef: { definitionId: 'echo-lance', definitionVersion: 1 },
        canonicalDefinition: { name: 'Demo Echo Lance' }
      }
    ]
  });
  useReactionWindowStore.setState({
    principal: 'principal',
    windows: [makeWindow()],
    pending: null,
    interrupted: [],
    status: '',
    narration: { current: null }
  });
  useTriggerOfferStore.setState({
    projection: offerProjection([echoLanceOffer]),
    declined: [],
    loading: false,
    error: null,
    message: ''
  });
});

test('eligible player sees React now (8s) and Ordinary follow-up (no 8s timer) with one short instruction each', () => {
  const { container } = render(<><ReactionWindowHost /><TriggerOfferPanel /></>);
  const rwGuide = document.querySelector('[data-post-hit-state="open"]');
  expect(rwGuide).toHaveTextContent('React now · 8s window');
  expect(rwGuide).toHaveTextContent('Follow-up stays available: Demo Echo Lance');
  expect(rwGuide).toHaveTextContent('Declare a reaction before the timer ends; Demo Echo Lance stays available after it closes.');

  const fptGuide = container.querySelector('[data-followup-state="open-window-available"]');
  expect(fptGuide).toHaveTextContent('Ordinary follow-up · No 8s timer');
  expect(fptGuide).toHaveTextContent('Available now or after the 8-second reaction window closes — click Use this offer when ready.');
  expect(screen.getByRole('button', { name: 'Use this offer' })).toBeEnabled();
});

test('ineligible player sees no private reaction window and sees one short follow-up status instruction', () => {
  useReactionWindowStore.setState({
    principal: 'principal',
    windows: [],
    pending: null,
    interrupted: [],
    status: '',
    narration: { current: null }
  });
  useTriggerOfferStore.setState({
    projection: { roomId: 'r', viewerRole: 'member', revision: 2, listeners: [], obligations: [] },
    declined: []
  });

  render(<><ReactionWindowHost /><TriggerOfferPanel /></>);
  expect(screen.queryByRole('region', { name: 'Private declaration collection' })).toBeNull();
  expect(screen.getByText('Follow-up offers (0)')).toBeInTheDocument();
  expect(screen.getByText('No action needed')).toBeInTheDocument();
  expect(screen.getByText('No reaction or follow-up is available for you right now; wait for the GM or active player.')).toBeInTheDocument();
});

test('closed window clearly states follow-up availability and focuses Use this offer when clicked', () => {
  useReactionWindowStore.setState({
    principal: 'principal',
    windows: [makeWindow({ status: 'closed', remainingMs: 0 })],
    pending: null,
    interrupted: [],
    status: '',
    narration: { current: null }
  });

  const { container } = render(<><ReactionWindowHost /><TriggerOfferPanel /></>);
  const rwClosed = document.querySelector('[data-post-hit-state="closed-followup-available"]');
  expect(rwClosed).toHaveTextContent('8s window closed');
  expect(rwClosed).toHaveTextContent('Follow-up still available: Demo Echo Lance');
  expect(rwClosed).toHaveTextContent('Use Demo Echo Lance in Follow-up offers now, or wait for the GM.');

  const fptClosed = container.querySelector('[data-followup-state="after-close-available"]');
  expect(fptClosed).toHaveTextContent('Still available after 8s window');
  expect(fptClosed).toHaveTextContent('The 8-second reaction window closed, but this follow-up is still available — click Use this offer or Decline.');

  const useOfferBtn = screen.getByRole('button', { name: 'Use this offer' });
  expect(useOfferBtn).toBeEnabled();
  fireEvent.click(screen.getByRole('button', { name: 'Go to Follow-up offers' }));
  expect(document.activeElement).toBe(useOfferBtn);

  act(() => {
    useTriggerOfferStore.setState({ projection: offerProjection([]) });
  });
  const rwNone = document.querySelector('[data-post-hit-state="closed-no-followup"]');
  expect(rwNone).toHaveTextContent('No follow-up available');
  expect(rwNone).toHaveTextContent('No follow-up is available; wait for the GM to adjudicate.');
  expect(container.querySelector('[data-followup-state="empty-closed-window"]')).toHaveTextContent(
    'The 8-second reaction window is closed and no follow-up is available; wait for the GM.'
  );
});

test('disconnect pauses actions with short reconnect instructions and rejoin refreshes follow-ups', () => {
  render(<><ReactionWindowHost /><TriggerOfferPanel /></>);
  expect(refreshTriggerLedger).toHaveBeenCalledTimes(1);

  act(() => {
    mockSocket.connected = false;
    mockSocket.emitMock('disconnect');
  });

  expect(screen.getByText(/Collection disconnected\/unavailable — the 8-second timer keeps running; reconnect to check reaction and follow-up status \(never resubmits\)\./)).toBeInTheDocument();
  expect(screen.getByText('Disconnected')).toBeInTheDocument();
  expect(screen.getByText('Connection lost — reconnect to confirm this follow-up is still available.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Use this offer' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Decline' })).toBeDisabled();

  act(() => {
    mockSocket.connected = true;
    mockSocket.emitMock('connect');
    mockRejoinListeners.forEach(fn => fn({ socket: mockSocket, roomId: 'r' }));
  });

  expect(refreshTriggerLedger).toHaveBeenCalledTimes(2);
  expect(screen.getByRole('button', { name: 'Use this offer' })).toBeEnabled();
  expect(document.querySelector('[data-post-hit-state="open"]')).toHaveTextContent('React now · 8s window');
});
