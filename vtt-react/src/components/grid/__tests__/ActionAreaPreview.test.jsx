import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionAreaPreview from '../ActionAreaPreview';
import useSpellAoEStore from '../../../store/spellAoEStore';
import useTargetingStore from '../../../store/targetingStore';
import useGameStore from '../../../store/gameStore';
import useCreatureStore from '../../../store/creatureStore';
import { useCombatFeedStore, actorKey } from '../../../services/acceptedResultFeed';
import { MARTYR_DATA } from '../../../data/classes/martyrData';
import { radiantPreviewProfile } from '../../../services/areaPreview';
import { TokenCombatFloats } from '../../combat/FloatingCombatText';
import { beginLoadingPhase, resetBootstrapGateForTests } from '../../../persistence/bootstrapPrivacyGate';

jest.mock('../../../store/authStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ user: { uid: 'u' } })) }));
jest.mock('../../../store/characterStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ currentCharacterId: 'c' })) }));
jest.mock('../../../store/gameStore', () => ({ __esModule: true, default: require('zustand').create(() => ({})) }));
jest.mock('../../../services/spellConsequenceService', () => ({ ownerSource: () => ({ ref: mockSourceRef, token: mockSource }) }));
jest.mock('../../../services/actorProjectionOrder', () => ({ currentActorDelivery: () => true }));
const mockSourceRef = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'source', instanceId: 's1', characterId: 'c', ownerUid: 'u' };
const mockSource = { position: { x: 25, y: 25 }, state: { actorContract: { ...mockSourceRef, version: 1 } } };
const targetRef = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'target', instanceId: 't1' };
const gridSystem = { getGridState: () => ({ gridType: 'square' }), worldToScreen: (x, y) => ({ x, y }), screenToWorld: (x, y) => ({ x, y }) };
const props = { gridSystem, gridSize: 50, feetPerTile: 5, gridOffsetX: 0, gridOffsetY: 0, currentMapId: 'm' };
const action = MARTYR_DATA.spells.find(s => s.id === 'martyr_radiant_burst');
const onReturn = jest.fn(), emit = jest.fn();
beforeEach(() => {
  resetBootstrapGateForTests();
  emit.mockClear(); onReturn.mockClear();
  useGameStore.setState({ multiplayerSocket: { connected: true, emit }, isGMMode: false, gridType: 'square', gridSize: 50, feetPerTile: 5 });
  useSpellAoEStore.setState({ actionPreview: null, tool: null, placement: null });
  useCombatFeedStore.setState({ rendered: { [actorKey(mockSourceRef)]: 1, [actorKey(targetRef)]: 1 } });
  useCreatureStore.setState({ creatures: [{ id: 'goblin', name: 'Visible goblin', size: 'medium' }], creatureTokens: [
    { id: 'target', creatureId: 'goblin', mapId: 'm', position: { x: 75, y: 25 }, state: { actorContract: { ...targetRef, version: 1 } } }
  ] });
  useSpellAoEStore.getState().startActionPreview({ action, profile: radiantPreviewProfile(action, 'damage'), sourceRef: mockSourceRef,
    context: { uid: 'u', roomId: 'r', socket: useGameStore.getState().multiplayerSocket }, onReturn });
});
function WithTarget({ show = true }) {
  return <>{show && <TokenCombatFloats token={useCreatureStore.getState().creatureTokens[0]} />}<ActionAreaPreview {...props} /></>;
}
test('free placement, origin range, keep/cancel, retained-visibility updates and no emitted action', () => {
  const view = render(<WithTarget />);
  fireEvent.keyDown(screen.getByRole('application'), { key: 'ArrowRight' });
  expect(screen.getByRole('note', { name: /Visible goblin: Geometric overlap only/ })).toBeInTheDocument();
  const keep = screen.getByRole('button', { name: /Keep preview/ });
  expect(keep).not.toBeDisabled(); fireEvent.click(keep);
  expect(screen.queryByRole('application')).toBeNull(); expect(onReturn).toHaveBeenCalledTimes(1);
  expect(JSON.stringify(useSpellAoEStore.getState().actionPreview)).not.toMatch(/Visible goblin|keptEvidence|target.*t1/);
  view.rerender(<WithTarget show={false} />);
  expect(screen.queryByRole('note', { name: /Visible goblin/ })).toBeNull();
  expect(document.querySelectorAll('.b2-token-marker')).toHaveLength(0);
  expect(screen.getByText(/Changed since confirmation/)).toBeInTheDocument();
  view.rerender(<WithTarget />);
  expect(screen.getByText(/Changed since confirmation/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Review placement' }));
  act(() => useSpellAoEStore.getState().updateActionPreview({ origin: { x: 226, y: 25 } }));
  expect(screen.getByText(/outside 20-ft/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Keep preview/ })).toBeDisabled();
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(useSpellAoEStore.getState().actionPreview).toBeNull(); expect(emit).not.toHaveBeenCalled();
  expect(document.querySelector('.b2-panel')).toBeNull();
});
test('production rendered-registry cleanup removes names before the post-commit layout observation', () => {
  const token = useCreatureStore.getState().creatureTokens[0];
  useCombatFeedStore.setState({ rendered: { [actorKey(mockSourceRef)]: 1 } });
  const observed = [];
  function Witness({ show }) {
    React.useLayoutEffect(() => { if (!show) observed.push(document.querySelector('.b2-token-marker')?.outerHTML || ''); }, [show]);
    return <>{show && <TokenCombatFloats token={token} />}<ActionAreaPreview {...props} /></>;
  }
  const view = render(<Witness show />);
  fireEvent.keyDown(screen.getByRole('application'), { key: 'ArrowRight' });
  expect(screen.getByRole('note', { name: /Visible goblin: Geometric overlap only/ })).toBeInTheDocument();
  view.rerender(<Witness show={false} />);
  // Layout effects flush the registry update before paint; MutationObserver/screen readers see no name.
  expect(screen.queryByRole('note', { name: /Visible goblin/ })).toBeNull();
  expect(observed).toEqual(['']);
  expect(useCombatFeedStore.getState().rendered[actorKey(targetRef)]).toBeUndefined();
});
test('disconnect without a store render and pre-existing loading uncertainty end the session', () => {
  const listeners = {}, socket = { connected: true, on: (e, fn) => { listeners[e] = fn; }, off: e => { delete listeners[e]; } };
  useGameStore.setState({ multiplayerSocket: socket });
  useSpellAoEStore.getState().updateActionPreview({ context: { uid: 'u', roomId: 'r', socket } });
  const view = render(<ActionAreaPreview {...props} />);
  act(() => { socket.connected = false; listeners.disconnect(); });
  expect(useSpellAoEStore.getState().actionPreview).toBeNull();
  view.unmount();
  beginLoadingPhase();
  useSpellAoEStore.getState().startActionPreview({ action, profile: radiantPreviewProfile(action, 'damage'), sourceRef: mockSourceRef, context: { uid: 'u', roomId: 'r' } });
  render(<ActionAreaPreview {...props} />);
  expect(screen.queryByRole('application')).toBeNull(); expect(useSpellAoEStore.getState().actionPreview).toBeNull();
});
test('missing source coordinates fail closed before drawing rather than throwing in projection', () => {
  const before = mockSource.position;
  try {
    mockSource.position = null;
    render(<ActionAreaPreview {...props} />);
    expect(screen.queryByRole('application')).toBeNull();
    expect(useSpellAoEStore.getState().actionPreview).toBeNull();
  } finally { mockSource.position = before; }
});
test('one interaction: B1/free tool replaces B2 and starting B2 cancels their catcher', () => {
  useTargetingStore.getState().startTargetPick({ id: 'pick', onPick: jest.fn() });
  expect(useSpellAoEStore.getState().actionPreview).toBeNull();
  useSpellAoEStore.getState().startActionPreview({ action, onReturn });
  expect(useTargetingStore.getState().pickSession).toBeNull();
  useSpellAoEStore.getState().startPlacement({ shape: 'circle', sizeFeet: 10 });
  expect(useSpellAoEStore.getState().actionPreview).toBeNull();
});
