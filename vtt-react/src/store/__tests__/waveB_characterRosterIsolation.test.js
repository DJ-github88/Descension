/**
 * Project 5 Wave B (S5.3) — character roster ownership isolation.
 *
 * The alternate-key fallback could silently read another account's roster
 * (guest ↔ account). These regressions pin the ownership boundary: a roster is
 * only ever loaded from the key that belongs to the current verified account
 * type.
 */

import useCharacterStore from '../characterStore';
import { registerStore } from '../storeRegistry';

function setAuth(user) {
  registerStore('authStore', {
    getState: () => ({
      user,
      isAuthInitialized: true,
      isDevelopmentBypass: false,
      isAdminBypass: false
    }),
    subscribe: () => () => {}
  });
}

describe('Wave B S5.3 — character roster ownership isolation', () => {
  beforeEach(() => {
    localStorage.clear();
    useCharacterStore.setState({ characters: [], isLoading: false, error: null });
  });

  it('an authenticated user with an empty roster never adopts the guest roster', async () => {
    setAuth({ uid: 'user-a' });
    localStorage.setItem('mythrill-characters', JSON.stringify([]));
    localStorage.setItem('mythrill-guest-characters', JSON.stringify([
      { id: 'guest-char', name: 'Guest Hero' }
    ]));

    const characters = await useCharacterStore.getState().loadCharacters();

    expect(characters.some((c) => c.id === 'guest-char')).toBe(false);
    expect(useCharacterStore.getState().characters.some((c) => c.id === 'guest-char')).toBe(false);
  });

  it('a guest with an empty roster never adopts the account roster', async () => {
    setAuth({ uid: 'anon-1', isGuest: true });
    localStorage.setItem('mythrill-guest-characters', JSON.stringify([]));
    localStorage.setItem('mythrill-characters', JSON.stringify([
      { id: 'account-char', name: 'Account Hero' }
    ]));

    const characters = await useCharacterStore.getState().loadCharacters();

    expect(characters.some((c) => c.id === 'account-char')).toBe(false);
    expect(useCharacterStore.getState().characters.some((c) => c.id === 'account-char')).toBe(false);
  });

  it('a guest load never deletes or rewrites the account roster key', async () => {
    setAuth({ uid: 'anon-1', isGuest: true });
    const accountRaw = JSON.stringify([{ id: 'account-char', name: 'Account Hero' }]);
    localStorage.setItem('mythrill-characters', accountRaw);
    localStorage.setItem('mythrill-guest-characters', JSON.stringify([]));

    await useCharacterStore.getState().loadCharacters();

    expect(localStorage.getItem('mythrill-characters')).toBe(accountRaw);
  });
});
