/**
 * Focused P5-21 owner fence regression: a delayed A journal cloud read must
 * not hydrate the working store after the account switches to B.
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useJournalPersistence } from '../useJournalPersistence';
import persistenceService from '../../services/firebase/persistenceService';
import useAuthStore from '../../store/authStore';
import useShareableStore from '../../store/shareableStore';
import { activatePrivateScope, resetBootstrapGateForTests } from '../../persistence/bootstrapPrivacyGate';
import { createUserScope } from '../../persistence/scopeModel';

jest.mock('../../services/firebase/persistenceService', () => ({
  __esModule: true,
  default: { loadJournal: jest.fn(), saveJournal: jest.fn() }
}));

jest.mock('../../store/authStore', () => {
  const { create } = require('zustand');
  const useAuthStore = create(() => ({ user: null }));
  return { __esModule: true, default: useAuthStore };
});

describe('useJournalPersistence owner fence (P5-21)', () => {
  beforeEach(() => {
    resetBootstrapGateForTests();
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('a delayed A journal load cannot hydrate the store after the account switches to B', async () => {
    let resolveA;
    const pendingA = new Promise((resolve) => { resolveA = resolve; });
    persistenceService.loadJournal.mockImplementation((uid) => (
      uid === 'user-a' ? pendingA : Promise.resolve(null)
    ));
    persistenceService.saveJournal.mockResolvedValue({ success: true });

    act(() => {
      useAuthStore.setState({ user: { uid: 'user-a', email: 'a@test' } });
      activatePrivateScope(createUserScope('user-a'));
    });

    const { unmount } = renderHook(() => useJournalPersistence());
    await waitFor(() => expect(persistenceService.loadJournal).toHaveBeenCalledWith('user-a'));

    // Account switches to B while A's cloud read is still in flight.
    act(() => {
      activatePrivateScope(createUserScope('user-b'));
      useAuthStore.setState({ user: { uid: 'user-b', email: 'b@test' } });
    });

    await act(async () => {
      resolveA({
        playerNotes: [{ id: 'leak', title: 'A CLOUD NOTE' }],
        playerKnowledge: [],
        journalFolders: [],
        knowledgeBoards: [],
        knowledgeOrbs: [],
        knowledgeConnections: []
      });
      await pendingA;
    });

    const titles = useShareableStore.getState().playerNotes.map((note) => note.title);
    expect(titles).not.toContain('A CLOUD NOTE');
    unmount();
  });
});
