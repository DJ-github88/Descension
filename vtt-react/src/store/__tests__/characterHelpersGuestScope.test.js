import { registerStore } from '../storeRegistry';
import { isGuestUser } from '../characterHelpers';

jest.mock('../../services/firebase/characterPersistenceService', () => ({
  __esModule: true,
  default: { isConfigured: false }
}));
jest.mock('../../services/offlineService', () => ({ updateCharacterData: jest.fn() }));
jest.mock('../../config/firebase', () => ({ isDemoMode: false }));
jest.mock('../../persistence/scopedConsumer', () => ({
  captureConsumerContext: jest.fn(() => ({ ok: false }))
}));
jest.mock('../../persistence/characterSaveOutcome', () => ({ stageCharacterDraft: jest.fn() }));

const setAuthState = (state) => {
  registerStore('authStore', { getState: () => state });
};

describe('isGuestUser follows the P5 scope mapping', () => {
  test('an anonymous Firebase principal reads and writes the guest roster', () => {
    setAuthState({ user: { uid: 'anon-1', isAnonymous: true }, isAuthenticated: true });
    expect(isGuestUser()).toBe(true);
  });

  test('the explicit guest wrapper is still a guest', () => {
    setAuthState({ user: { uid: 'guest-1', isGuest: true }, isAuthenticated: true });
    expect(isGuestUser()).toBe(true);
  });

  test('dev and admin bypasses stay out of the guest roster', () => {
    setAuthState({ user: { uid: 'dev-1', isAnonymous: true }, isDevelopmentBypass: true });
    expect(isGuestUser()).toBe(false);

    setAuthState({ user: { uid: 'admin-1' }, isAdminBypass: true });
    expect(isGuestUser()).toBe(false);
  });

  test('a verified user is not a guest', () => {
    setAuthState({ user: { uid: 'user-1' }, isAuthenticated: true });
    expect(isGuestUser()).toBe(false);
  });
});
