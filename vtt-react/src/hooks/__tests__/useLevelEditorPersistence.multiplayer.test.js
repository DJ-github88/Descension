/**
 * Project 3 Test 44 regression: the editor persistence hook can mount in an
 * active multiplayer room, but must refuse cache restoration.
 */

jest.mock('../../contexts/RoomContext', () => ({
  useRoomContext: () => ({ currentRoomId: 'review', isInRoom: true, roomType: 'multiplayer' })
}));

import { renderHook, act } from '@testing-library/react';
import { useLevelEditorPersistence } from '../useLevelEditorPersistence';
import cache from '../../services/levelEditorPersistenceService';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';

beforeEach(() => {
  jest.restoreAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  useGameStore.setState({ isInMultiplayer: true, multiplayerRoom: { id: 'review' } });
  useLevelEditorStore.setState({ terrainData: { accepted: 'live' } });
});

test('test44: hook mount in multiplayer refuses cache restoration', async() => {
  cache.cache.set('review', { levelEditorData: { terrainData: { stale: 'cache' } } });
  const load = jest.spyOn(cache, 'loadLevelEditorState');
  const hook = renderHook(() => useLevelEditorPersistence());
  let result;
  await act(async() => {
    result = await hook.result.current.loadLevelEditorState();
  });
  expect(result).toBe(false);
  expect(load).not.toHaveBeenCalled();
  expect(useLevelEditorStore.getState().terrainData).toEqual({ accepted: 'live' });
  hook.unmount();
});
