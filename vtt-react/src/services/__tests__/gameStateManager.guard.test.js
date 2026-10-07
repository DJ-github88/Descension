/**
 * Project 3 — multiplayer guard on the legacy browser whole-room manager
 * (frozen 19 partial: join/cleanup cannot write shared state).
 */

jest.mock('../roomService', () => ({
  saveCompleteGameState: jest.fn(),
  loadCompleteGameState: jest.fn()
}));

import gameStateManager from '../gameStateManager';
import { saveCompleteGameState, loadCompleteGameState } from '../roomService';

describe('gameStateManager multiplayer guard', () => {
  afterEach(() => {
    gameStateManager.setMultiplayerActive(false);
    gameStateManager.stopAutoSave();
    gameStateManager.teardownStoreListeners();
    jest.clearAllMocks();
  });

  test('19: active multiplayer never loads or autosaves the whole-room document', async () => {
    gameStateManager.setMultiplayerActive(true);
    await gameStateManager.initialize('persist-room', true);
    expect(loadCompleteGameState).not.toHaveBeenCalled();
    expect(gameStateManager.isAutoSaveEnabled).toBe(false);

    gameStateManager.markChanged('tokens');
    await gameStateManager.saveGameState(true);
    expect(saveCompleteGameState).not.toHaveBeenCalled();

    await gameStateManager.cleanup();
    expect(saveCompleteGameState).not.toHaveBeenCalled();
  });

  test('local (non-multiplayer) usage keeps its existing load path', async () => {
    gameStateManager.setMultiplayerActive(false);
    loadCompleteGameState.mockResolvedValue({});

    await gameStateManager.initialize('local-room', false);
    await gameStateManager.loadGameState();
    expect(loadCompleteGameState).toHaveBeenCalledWith('local-room');

    gameStateManager.stopAutoSave();
    gameStateManager.teardownStoreListeners();
  });
});
