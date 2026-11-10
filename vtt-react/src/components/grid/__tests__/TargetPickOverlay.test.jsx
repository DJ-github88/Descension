import React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import TargetPickOverlay from '../TargetPickOverlay';
import useGameStore from '../../../store/gameStore';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useTargetingStore from '../../../store/targetingStore';
import useCreatureStore from '../../../store/creatureStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import { useCombatFeedStore, actorKey } from '../../../services/acceptedResultFeed';
import { pickKey } from '../../../services/targetPick';

jest.mock('../../../store/authStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ user: { uid: 'u' } })) }));
jest.mock('../../../store/gameStore', () => ({ __esModule: true, default: require('zustand').create(() => ({})) }));
jest.mock('../../../store/levelEditorStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({ wallData: {}, environmentalObjects: [], windowOverlays: {}, viewingFromToken: null })),
  WALL_TYPES: {}
}));
jest.mock('../../level-editor/objects/ObjectSystem', () => ({ PROFESSIONAL_OBJECTS: {} }));

const refOf = tokenId => ({ kind: 'creature', roomId: 'room', mapId: 'map', tokenId, instanceId: `${tokenId}-instance` });
const refA = refOf('alpha'), refB = refOf('beta'), refHidden = refOf('hidden');
const refGamma = refOf('gamma'), refDelta = refOf('delta');
const token = (ref, name, x, hidden = false) => ({
  id: ref.tokenId,
  creatureId: 'goblin',
  mapId: ref.mapId,
  position: { x, y: 100 },
  state: { customName: name, actorContract: { ...ref, version: 1 }, hiddenFromPlayers: hidden }
});
const tokenA = token(refA, 'Goblin', 100);
const tokenB = token(refB, 'Goblin', 200);
const tokenHidden = token(refHidden, 'Goblin', 300, true);
const tokenGamma = token(refGamma, 'Goblin', 400);
const tokenDelta = token(refDelta, 'Goblin', 500);
const gridSystem = { worldToScreen: (x, y) => ({ x, y }), screenToWorld: (x, y) => ({ x, y }) };

function setup({ tokens = [tokenA, tokenB, tokenHidden], candidates = [refA, refB, refHidden], onPick = jest.fn() } = {}) {
  useTargetingStore.setState({ pickSession: null });
  useGameStore.setState({
    isGMMode: false, multiplayerRoom: { id: 'room' }, multiplayerSocket: { connected: true }, actorRecoverySnapshot: null,
    gridType: 'square', gridOffsetX: 0, gridOffsetY: 0, gridSize: 50, cameraX: 0, cameraY: 0, zoomLevel: 1,
    playerZoom: 1, viewMode: '2d', viewRotation: 0, viewTilt: 0
  });
  useLevelEditorStore.setState({ wallData: {}, environmentalObjects: [], windowOverlays: {}, viewingFromToken: null });
  useCreatureStore.setState({ creatures: [{ id: 'goblin', name: 'Goblin', size: 'medium' }], creatureTokens: tokens });
  useCharacterTokenStore.setState({ characterTokens: [] });
  const renderedRefs = [refA, refB, refHidden, refGamma, refDelta, ...tokens.map(item => item.state.actorContract)];
  useCombatFeedStore.setState({ rendered: Object.fromEntries(renderedRefs.map(item => [actorKey(item), 1])) });
  act(() => useTargetingStore.getState().startTargetPick({
    id: 'p9-spell', label: 'Test spell', sourceRef: refOf('source'), candidates,
    rangeFeet: 30, rangeLabel: 'card range 30 ft', reasonFor: () => 'Not eligible for this spell.',
    onPick, onCancel: jest.fn()
  }));
  const view = render(<TargetPickOverlay gridSystem={gridSystem} currentMapId="map" gridSize={50} feetPerTile={5} />);
  const select = () => screen.getByLabelText('Preview target');
  return { view, select, onPick };
}

test('same-named visible creatures have distinct exact options while hidden actors stay private', () => {
  const { select } = setup();
  const options = within(select()).getAllByRole('option');
  expect(options[0].value).toBe('');
  const alpha = options.find(option => option.textContent.includes('alpha'));
  const beta = options.find(option => option.textContent.includes('beta'));
  expect(alpha).toBeTruthy();
  expect(beta).toBeTruthy();
  expect(alpha.textContent).toContain('Goblin');
  expect(alpha.textContent).toContain('· creature ·');
  expect(alpha.textContent).toContain('(100, 100)');
  expect(beta.textContent).toContain('(200, 100)');
  expect(alpha.value).toBe(pickKey(refA));
  expect(beta.value).toBe(pickKey(refB));
  expect(alpha.value).not.toBe(beta.value);
  expect(options.some(option => option.textContent.includes('hidden'))).toBe(false);
});

test('long token identifiers keep both ends so same-prefix actors remain distinguishable', () => {
  const longA = 'token-11111111-1111-4111-8111-aaaaaaaaaaaa';
  const longB = 'token-22222222-2222-4222-8222-bbbbbbbbbbbb';
  const refLongA = { ...refOf('long-a'), tokenId: longA };
  const refLongB = { ...refOf('long-b'), tokenId: longB };
  const { select } = setup({
    tokens: [token(refLongA, 'Goblin', 100), token(refLongB, 'Goblin', 200)],
    candidates: [refLongA, refLongB]
  });
  const options = within(select()).getAllByRole('option');
  const alpha = options.find(option => option.textContent.includes('aaaaaa'));
  const beta = options.find(option => option.textContent.includes('bbbbbb'));
  expect(alpha.textContent).toContain('token-…aaaaaa');
  expect(beta.textContent).toContain('token-…bbbbbb');
  expect(alpha.value).not.toBe(beta.value);
});

test('the selected exact actor survives option reordering and an ordinary rerender', () => {
  const { view, select, onPick } = setup();
  const beta = within(select()).getAllByRole('option').find(option => option.textContent.includes('beta'));
  fireEvent.change(select(), { target: { value: beta.value } });
  expect(select().value).toBe(beta.value);

  view.rerender(<TargetPickOverlay gridSystem={gridSystem} currentMapId="map" gridSize={50} feetPerTile={5} />);
  expect(select().value).toBe(beta.value);

  act(() => useCreatureStore.setState({ creatureTokens: [tokenB, tokenA, tokenHidden] }));
  view.rerender(<TargetPickOverlay gridSystem={gridSystem} currentMapId="map" gridSize={50} feetPerTile={5} />);
  expect(select().value).toBe(beta.value);

  const useTarget = screen.getByRole('button', { name: 'Use target' });
  expect(useTarget).toBeEnabled();
  fireEvent.click(useTarget);
  expect(onPick).toHaveBeenCalledTimes(1);
  expect(pickKey(onPick.mock.calls[0][0])).toBe(pickKey(refB));
});

test('a removed or replaced target clears the selection and never silently retargets a same-named actor', () => {
  const { select, onPick } = setup({ tokens: [tokenA, tokenB, tokenHidden], candidates: [refA, refB, refHidden, refGamma, refDelta] });
  const beta = within(select()).getAllByRole('option').find(option => option.textContent.includes('beta'));
  fireEvent.change(select(), { target: { value: beta.value } });
  expect(select().value).toBe(beta.value);

  act(() => useCreatureStore.setState({ creatureTokens: [tokenA, tokenHidden] }));
  expect(select().value).toBe('');
  expect(screen.getByRole('button', { name: 'Use target' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Use target' }));
  expect(onPick).not.toHaveBeenCalled();

  act(() => useCreatureStore.setState({ creatureTokens: [tokenA, tokenGamma, tokenHidden] }));
  const gamma = within(select()).getAllByRole('option').find(option => option.textContent.includes('gamma'));
  fireEvent.change(select(), { target: { value: gamma.value } });
  expect(select().value).toBe(gamma.value);

  act(() => useCreatureStore.setState({ creatureTokens: [tokenA, tokenDelta, tokenHidden] }));
  expect(select().value).toBe('');
  expect(screen.getByRole('button', { name: 'Use target' })).toBeDisabled();
  expect(onPick).not.toHaveBeenCalled();
});
