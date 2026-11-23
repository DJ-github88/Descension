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
  expect(document.querySelector('.b2-range')).not.toBeNull();
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
test('line AoE placement initializes origin at caster, aims direction with pointer/keyboard, and confirms origin + target', () => {
  const onConfirmArea = jest.fn();
  const lineAction = {
    id: 'line-def-1',
    name: 'Arcane Beam',
    capability: 'authored-area:v1',
    kind: 'damage',
    definitionHash: 'authored-area:v1/' + 'b'.repeat(64),
    areaTerms: { kind: 'area', aoeShape: 'line', lengthFeet: 30, widthFeet: 5, rangeFeet: 30, maxTargets: 8, restriction: 'enemy' }
  };
  useSpellAoEStore.getState().startActionPreview({
    action: lineAction,
    profile: radiantPreviewProfile(lineAction, 'damage'),
    sourceRef: mockSourceRef,
    context: { uid: 'u', roomId: 'r', socket: useGameStore.getState().multiplayerSocket },
    onReturn,
    onConfirmArea
  });
  render(<WithTarget />);
  expect(useSpellAoEStore.getState().actionPreview.origin).toEqual({ x: 25, y: 25 });
  // Aim east with ArrowRight toward creature at (75, 25)
  fireEvent.keyDown(screen.getByRole('application'), { key: 'ArrowRight' });
  expect(screen.getByRole('note', { name: /Visible goblin: Geometric overlap only/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Use placed area in cast panel' }));
  expect(onConfirmArea).toHaveBeenCalledTimes(1);
  const confirmed = onConfirmArea.mock.calls[0][0];
  expect(confirmed.origin).toEqual({ x: 25, y: 25 });
  expect(confirmed.target.x).toBeGreaterThan(25);
  expect(confirmed.target.y).toBe(25);
});

test('D-LINE-1: a Line keeps its origin at the caster; no control, key or pointer moves it, and no origin range is offered', () => {
  const onConfirmArea = jest.fn();
  const lineAction = {
    id: 'line-def-2', name: 'Caster Line', capability: 'authored-area:v1', kind: 'damage', definitionHash: 'authored-area:v1/' + 'c'.repeat(64),
    areaTerms: { kind: 'area', aoeShape: 'line', lengthFeet: 15, widthFeet: 5, rangeFeet: 30, maxTargets: 8, restriction: 'enemy' }
  };
  useSpellAoEStore.getState().startActionPreview({
    action: lineAction, profile: radiantPreviewProfile(lineAction, 'damage'), sourceRef: mockSourceRef,
    context: { uid: 'u', roomId: 'r', socket: useGameStore.getState().multiplayerSocket }, onReturn, onConfirmArea,
    initialOrigin: { x: 125, y: 25 } // a stale/saved off-caster origin must be ignored
  });
  render(<WithTarget />);
  expect(document.querySelector('.b2-range')).toBeNull();
  expect(screen.queryByRole('button', { name: /Move line origin|Center origin at caster|Aim line direction/ })).toBeNull();
  expect(screen.queryByText(/origin range/)).toBeNull();
  expect(screen.getAllByText(/starts at the caster/).length).toBeGreaterThan(0);
  const app = screen.getByRole('application');
  expect(app.getAttribute('aria-label')).not.toMatch(/Alt|Move origin/i);
  expect(useSpellAoEStore.getState().actionPreview.origin).toEqual({ x: 25, y: 25 });
  fireEvent.keyDown(app, { key: 'ArrowRight', altKey: true });
  expect(useSpellAoEStore.getState().actionPreview.origin).toEqual({ x: 25, y: 25 });
  fireEvent.keyDown(app, { key: 'ArrowRight' }); // aim the direction (the only thing the player chooses)
  expect(useSpellAoEStore.getState().actionPreview.origin).toEqual({ x: 25, y: 25 });
  fireEvent.click(screen.getByRole('button', { name: 'Use placed area in cast panel' }));
  expect(onConfirmArea.mock.calls.at(-1)[0].origin).toEqual({ x: 25, y: 25 });
});

test('GM grid scale: the same 30 ft Line covers a creature 4 squares away at 5 ft per square but not at 10 ft per square', () => {
  const farRef = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'far', instanceId: 'f1' };
  const lineAction = {
    id: 'line-def-scale', name: 'Scaled Line', capability: 'authored-area:v1', kind: 'damage', definitionHash: 'authored-area:v1/' + 'd'.repeat(64),
    areaTerms: { kind: 'area', aoeShape: 'line', lengthFeet: 30, widthFeet: 5, rangeFeet: 30, maxTargets: 8, restriction: 'enemy' }
  };
  const measure = (feetPerTile) => {
    useCombatFeedStore.setState({ rendered: { [actorKey(mockSourceRef)]: 1, [actorKey(targetRef)]: 1, [actorKey(farRef)]: 1 } });
    useCreatureStore.setState({ creatures: [{ id: 'goblin', name: 'Visible goblin', size: 'medium' }, { id: 'ogre', name: 'Far ogre', size: 'medium' }], creatureTokens: [
      { id: 'target', creatureId: 'goblin', mapId: 'm', position: { x: 75, y: 25 }, state: { actorContract: { ...targetRef, version: 1 } } },
      { id: 'far', creatureId: 'ogre', mapId: 'm', position: { x: 225, y: 25 }, state: { actorContract: { ...farRef, version: 1 } } }
    ] });
    useGameStore.setState({ feetPerTile });
    useSpellAoEStore.getState().startActionPreview({
      action: lineAction, profile: radiantPreviewProfile(lineAction, 'damage'), sourceRef: mockSourceRef,
      context: { uid: 'u', roomId: 'r', socket: useGameStore.getState().multiplayerSocket }, onReturn, onConfirmArea: jest.fn()
    });
    const view = render(<>
      {useCreatureStore.getState().creatureTokens.map(t => <TokenCombatFloats key={t.id} token={t} />)}
      <ActionAreaPreview {...props} feetPerTile={feetPerTile} />
    </>);
    fireEvent.keyDown(screen.getByRole('application'), { key: 'ArrowRight' });
    const result = {
      origin: useSpellAoEStore.getState().actionPreview.origin,
      near: screen.queryAllByRole('note', { name: /Visible goblin: Geometric overlap only/ }).length > 0,
      far: screen.queryAllByRole('note', { name: /Far ogre: Geometric overlap only/ }).length > 0
    };
    view.unmount();
    act(() => { useSpellAoEStore.getState().cancelActionPreview?.(); });
    return result;
  };
  // 5 ft per square: 30 ft = 6 squares from (25,25) -> reaches x=325, covering the far creature's square (200..250).
  expect(measure(5)).toEqual({ origin: { x: 25, y: 25 }, near: true, far: true });
  // 10 ft per square: 30 ft = 3 squares -> reaches x=175; the far creature is outside, the near one is still covered.
  expect(measure(10)).toEqual({ origin: { x: 25, y: 25 }, near: true, far: false });
});
