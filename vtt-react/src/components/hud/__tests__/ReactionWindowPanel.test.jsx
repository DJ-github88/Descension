import React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReactionWindowHost from '../ReactionWindowPanel';
import useGameStore from '../../../store/gameStore';
import { useReactionWindowStore, changeReactionIntent, refreshReactionWindows } from '../../../services/reactionWindowService';
jest.mock('../../../store/gameStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ multiplayerRoom: { id: 'r' }, multiplayerSocket: { connected: true }, isGMMode: false })) }));
jest.mock('../../../store/authStore', () => ({ __esModule: true, default: selector => selector({ user: { uid: 'u' } }) }));
jest.mock('../../../store/characterStore', () => ({ __esModule: true, default: selector => selector({ currentCharacterId: 'c' }) }));
jest.mock('../../../persistence/bootstrapPrivacyGate', () => ({ isPrivateProjectionIsolated: () => false, getBootstrapGateState: () => ({ accountGeneration: 1 }) }));
jest.mock('../../../services/actorConsequenceService', () => ({ refOf: token => token?.state?.actorContract }));
jest.mock('../../../services/reactionWindowService', () => ({
  useReactionWindowStore: require('zustand').create(() => ({})), reactionPrincipal: () => 'principal', bindReactionWindows: () => () => {},
  changeReactionIntent: jest.fn().mockResolvedValue({ success: true }), refreshReactionWindows: jest.fn().mockResolvedValue({ success: true }), advanceWindowNarration: jest.fn()
}));
const window = () => ({ windowId: 'w', epoch: 'e', moment: 'after_roll', status: 'open', remainingMs: 8000,
  receivedAt: performance.now(), reactor: { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'i' }, intents: [] });
beforeEach(() => {
  global.crypto = { randomUUID: require('crypto').randomUUID };
  jest.useFakeTimers(); jest.clearAllMocks(); useGameStore.setState({ isGMMode: false });
  useReactionWindowStore.setState({ principal: 'principal', windows: [window()], pending: null, status: '', narration: { current: null } });
});
afterEach(() => jest.useRealTimers());
test('accessible private form, silence/no Pass, countdown cutoff and explicit manual handoff', async() => {
  render(<ReactionWindowHost />);
  expect(screen.queryByRole('button', { name: /^Pass$/ })).toBeNull();
  fireEvent.change(screen.getByLabelText('Card ID or GM-agreed reference'), { target: { value: 'manual:parry' } });
  fireEvent.change(screen.getByLabelText('Private correction / notes'), { target: { value: 'own private note' } });
  await act(async() => fireEvent.click(screen.getByRole('button', { name: 'Declare privately' })));
  expect(changeReactionIntent).toHaveBeenCalledWith(expect.anything(), { cardKey: 'manual:parry', label: 'manual:parry', note: 'own private note' });
  act(() => jest.advanceTimersByTime(8100));
  expect(screen.getByRole('button', { name: 'Declare privately' })).toBeDisabled();
  expect(refreshReactionWindows).toHaveBeenCalled();
  act(() => useReactionWindowStore.setState({ windows: [{ ...window(), status: 'closed' }] }));
  expect(screen.getByText(/Collection closed — GM manual adjudication required/)).toBeInTheDocument();
});
test('observer has no collector/choice counts; a mismatched principal hides old private DOM synchronously', () => {
  const view = render(<ReactionWindowHost />);
  act(() => useReactionWindowStore.setState({ principal: 'retired-private-principal' }));
  expect(screen.queryByRole('region', { name: 'Private declaration collection' })).toBeNull();
  act(() => useReactionWindowStore.setState({ principal: 'principal', windows: [], narration: { current: null } }));
  expect(screen.queryByRole('region', { name: 'Private declaration collection' })).toBeNull();
  view.unmount();
});
test('five retained windows keep an early open opportunity reachable and every old GM review selectable', () => {
  const windows = Array.from({ length: 5 }, (_, i) => ({ ...window(), windowId: `window-${i}`, status: i === 0 ? 'open' : 'closed' }));
  useReactionWindowStore.setState({ windows });
  const ownerView = render(<ReactionWindowHost />);
  expect(within(screen.getByRole('article', { name: 'after roll declaration window window-0' })).getByLabelText('Card ID or GM-agreed reference')).toBeEnabled();
  expect(screen.getByLabelText('Retained opportunity').options).toHaveLength(5);
  ownerView.unmount();
  useGameStore.setState({ isGMMode: true });
  useReactionWindowStore.setState({ windows: windows.map(w => ({ ...w, status: 'closed', gmCommit: { note: '' },
    review: [{ reactor: w.reactor, cardKey: `card-for-${w.windowId}`, withdrawn: false, history: [] }] })) });
  render(<ReactionWindowHost />);
  fireEvent.change(screen.getByLabelText('Retained opportunity'), { target: { value: 'window-0' } });
  expect(screen.getByText(/card-for-window-0/)).toBeInTheDocument();
});
