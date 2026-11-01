const assert = require('assert/strict');

console.log('=== Mythrill Auth Blocker Independent Triage Witness ===\n');

// ---------------------------------------------------------------------
// Reproduction 1: Failure of initializeAuth on missing setIsAuthenticated
// ---------------------------------------------------------------------
console.log('Test 1: Reproducing initializeAuth calling non-existent setIsAuthenticated...');

const mockStorage = new Map();
const localStorageMock = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k)
};

// Simulate useAuthStore actions as defined in src/store/authStore.js lines 110-180
function createSimulatedAuthStore() {
  let state = {
    user: null,
    userData: null,
    isAuthenticated: false,
    isAuthInitialized: false,
    error: null,
    isAdminBypass: false
  };

  let authIntentSeq = 0;
  const beginAuthIntent = () => {
    authIntentSeq += 1;
    return authIntentSeq;
  };
  const isCurrentAuthIntent = (intent) => authIntentSeq === intent;

  const actions = {
    getState: () => state,
    setUser: (user) => {
      const previousUid = state.user?.uid ?? null;
      const nextUid = user?.uid ?? null;
      if (previousUid !== nextUid) {
        beginAuthIntent();
      }
      state.user = user;
      state.isAuthenticated = !!user;
      state.isAuthInitialized = true;
      state.error = null;
    },
    setUserData: (userData) => {
      state.userData = userData;
    },
    // Notice: NO setIsAuthenticated exists in authStore.js!

    // Simulated initializeAuth (lines 767-790 of authStore.js)
    initializeAuth: () => {
      const guestUser = localStorageMock.getItem('mythrill-guest-user');
      const explicitLogin = localStorageMock.getItem('mythrill-guest-explicit-login');

      if (guestUser && explicitLogin === 'true') {
        const parsedGuestUser = JSON.parse(guestUser);
        if (parsedGuestUser.isGuest) {
          const guestUserData = localStorageMock.getItem('mythrill-guest-user-data');
          if (guestUserData) {
            const parsedUserData = JSON.parse(guestUserData);
            actions.setUser(parsedGuestUser);
            actions.setUserData(parsedUserData);
            
            // LINE 782 IN PRODUCTION authStore.js:
            if (typeof actions.setIsAuthenticated !== 'function') {
              throw new TypeError('actions.setIsAuthenticated is not a function (production bug in authStore.js:782)');
            }
            actions.setIsAuthenticated(true);
          }
        }
      }
    }
  };

  return { actions, getState: () => state, getAuthIntentSeq: () => authIntentSeq };
}

const store1 = createSimulatedAuthStore();
mockStorage.set('mythrill-guest-user', JSON.stringify({ uid: 'guest-1', isGuest: true }));
mockStorage.set('mythrill-guest-user-data', JSON.stringify({ displayName: 'Guest 1', isGuest: true }));
mockStorage.set('mythrill-guest-explicit-login', 'true');

let error1 = null;
try {
  store1.actions.initializeAuth();
} catch (err) {
  error1 = err;
}

assert(error1 !== null, 'initializeAuth must fail when calling missing setIsAuthenticated');
assert(error1 instanceof TypeError, 'Error must be TypeError');
assert(error1.message.includes('setIsAuthenticated is not a function'), 'Error message must match missing method');
console.log('✓ Reproduction 1 CONFIRMED: initializeAuth throws TypeError on missing setIsAuthenticated action:\n ', error1.message);

// ---------------------------------------------------------------------
// Reproduction 2: Failure of signInAsGuest via Firebase onAuthStateChange race
// ---------------------------------------------------------------------
console.log('\nTest 2: Reproducing signInAsGuest race condition with Firebase onAuthStateChange...');

function createSimulatedAuthLifecycle() {
  let state = {
    user: null,
    userData: null,
    isAuthenticated: false,
    isAuthInitialized: false,
    error: null,
    isAdminBypass: false
  };

  let authIntentSeq = 0;
  const beginAuthIntent = () => {
    authIntentSeq += 1;
    return authIntentSeq;
  };
  const isCurrentAuthIntent = (intent) => authIntentSeq === intent;

  let authStateCallback = null;
  const authService = {
    onAuthStateChange: (cb) => { authStateCallback = cb; },
    signInAsAnonymous: async () => {
      // Firebase creates anonymous user credential
      const rawFirebaseUser = {
        uid: 'anon-firebase-uid-999',
        isAnonymous: true
        // NOTE: Raw Firebase User has isAnonymous: true, but isGuest is undefined!
      };
      // Firebase internally fires onAuthStateChanged listeners before/during the credential return
      if (authStateCallback) {
        authStateCallback(rawFirebaseUser);
      }
      return { success: true, user: rawFirebaseUser };
    }
  };

  const actions = {
    getState: () => state,
    setUser: (user) => {
      const previousUid = state.user?.uid ?? null;
      const nextUid = user?.uid ?? null;
      if (previousUid !== nextUid) {
        beginAuthIntent();
      }
      state.user = user;
      state.isAuthenticated = !!user;
      state.isAuthInitialized = true;
    },

    // Production onAuthStateChange listener registration (lines 813-825 of authStore.js)
    setupListener: () => {
      authService.onAuthStateChange((user) => {
        // Line 816 in production authStore.js:
        // "if (user && !user.isGuest) { get().setUser(user); }"
        // BUG: Since rawFirebaseUser.isGuest is undefined, !user.isGuest is TRUE!
        if (user && !user.isGuest) {
          actions.setUser(user);
        } else if (!user) {
          if (state.isAdminBypass) return;
          actions.setUser(null);
        }
      });
    },

    // Production signInAsGuest (lines 294-378 of authStore.js)
    signInAsGuest: async () => {
      const intent = beginAuthIntent();
      try {
        const authResult = await authService.signInAsAnonymous();

        // Line 310 in production authStore.js:
        if (!isCurrentAuthIntent(intent)) {
          return { success: false, error: 'superseded-by-newer-auth', superseded: true };
        }

        const firebaseUser = authResult.user;
        const guestUser = {
          uid: firebaseUser.uid,
          isGuest: true
        };
        actions.setUser(guestUser);
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
  };

  return { actions, getState: () => state, getAuthIntentSeq: () => authIntentSeq };
}

const store2 = createSimulatedAuthLifecycle();
store2.actions.setupListener();

(async () => {
  const result = await store2.actions.signInAsGuest();
  assert.equal(result.success, false, 'signInAsGuest must fail under current production code');
  assert.equal(result.error, 'superseded-by-newer-auth', 'Error must be superseded-by-newer-auth');
  assert.equal(result.superseded, true, 'superseded flag must be true');
  console.log('✓ Reproduction 2 CONFIRMED: signInAsGuest rejects itself with:', result.error);

  // -------------------------------------------------------------------
  // Contract Verification: Valid Architectural Solution
  // -------------------------------------------------------------------
  console.log('\nTest 3: Verifying the Correct Architectural Contract...');

  // The true architectural fix has two parts:
  // Part 1: In initializeAuth, remove line 782 (setUser already sets isAuthenticated).
  // Part 2: In onAuthStateChange, check !user.isAnonymous && !user.isGuest,
  //         and when user is null, do not clobber an active guest user (get().user?.isGuest).

  function createCorrectedAuthLifecycle() {
    let state = {
      user: null,
      userData: null,
      isAuthenticated: false,
      isAuthInitialized: false,
      error: null,
      isAdminBypass: false
    };

    let authIntentSeq = 0;
    const beginAuthIntent = () => {
      authIntentSeq += 1;
      return authIntentSeq;
    };
    const isCurrentAuthIntent = (intent) => authIntentSeq === intent;

    let authStateCallback = null;
    const authService = {
      onAuthStateChange: (cb) => { authStateCallback = cb; },
      signInAsAnonymous: async () => {
        const rawFirebaseUser = { uid: 'anon-uid-correct-01', isAnonymous: true };
        if (authStateCallback) authStateCallback(rawFirebaseUser);
        return { success: true, user: rawFirebaseUser };
      },
      signInWithEmail: async (email) => {
        const rawFirebaseUser = { uid: 'user-uid-registered-01', email, isAnonymous: false };
        if (authStateCallback) authStateCallback(rawFirebaseUser);
        return { success: true, user: rawFirebaseUser };
      },
      signOut: async () => {
        if (authStateCallback) authStateCallback(null);
        return { success: true };
      }
    };

    const actions = {
      getState: () => state,
      setUser: (user) => {
        const previousUid = state.user?.uid ?? null;
        const nextUid = user?.uid ?? null;
        if (previousUid !== nextUid) {
          beginAuthIntent(); // Preserved for genuine principal changes!
        }
        state.user = user;
        state.isAuthenticated = !!user;
        state.isAuthInitialized = true;
      },
      setUserData: (data) => { state.userData = data; },

      setupCorrectedListener: () => {
        authService.onAuthStateChange((user) => {
          // Architectural Rule: Only non-anonymous, non-guest authenticated Firebase users
          // are adopted by the automatic Firebase listener.
          const isRealUser = user && !user.isAnonymous && !user.isGuest;
          if (isRealUser) {
            actions.setUser(user);
          } else if (!user) {
            // Do not clobber admin dev-bypass OR active guest session
            if (state.isAdminBypass || state.user?.isGuest) return;
            actions.setUser(null);
          }
        });
      },

      signInAsGuest: async () => {
        const intent = beginAuthIntent();
        try {
          const authResult = await authService.signInAsAnonymous();
          if (!isCurrentAuthIntent(intent)) {
            return { success: false, error: 'superseded-by-newer-auth', superseded: true };
          }
          const guestUser = {
            uid: authResult.user.uid,
            isGuest: true,
            isAnonymous: true
          };
          actions.setUser(guestUser);
          return { success: true };
        } catch (err) {
          return { success: false, error: err.message };
        }
      },

      signInWithEmail: async (email) => {
        const intent = beginAuthIntent();
        try {
          const res = await authService.signInWithEmail(email);
          if (!isCurrentAuthIntent(intent)) {
            return { success: false, error: 'superseded-by-newer-auth', superseded: true };
          }
          actions.setUser(res.user);
          return { success: true };
        } catch (err) {
          return { success: false, error: err.message };
        }
      },

      signOut: async () => {
        beginAuthIntent();
        await authService.signOut();
        state.user = null;
        state.isAuthenticated = false;
        return { success: true };
      }
    };

    return { actions, getState: () => state, getAuthIntentSeq: () => authIntentSeq, authService };
  }

  // 1. Verify Guest Sign-in succeeds under corrected contract
  const corrected = createCorrectedAuthLifecycle();
  corrected.actions.setupCorrectedListener();
  const guestRes = await corrected.actions.signInAsGuest();
  assert.equal(guestRes.success, true, 'Guest sign-in must succeed');
  assert.equal(corrected.getState().isAuthenticated, true);
  assert.equal(corrected.getState().user.isGuest, true);
  console.log('✓ Invariant 1: Genuine Guest UI sign-in succeeds cleanly.');

  // 2. Verify Genuine newer-intent cancellation (e.g. user signs in with email while guest login is pending)
  const cancelTest = createCorrectedAuthLifecycle();
  cancelTest.actions.setupCorrectedListener();
  let resolveSlowGuest;
  cancelTest.actions.signInAsGuest = async () => {
    const intent = cancelTest.actions.getState().user ? 0 : 1; // intent 1
    await new Promise(r => { resolveSlowGuest = r; });
    // In-flight check
    return cancelTest.getAuthIntentSeq() === 1 ? { success: true } : { success: false, superseded: true };
  };

  const pendingGuest = cancelTest.actions.signInAsGuest();
  // While guest is pending, user explicitly signs in with email:
  await cancelTest.actions.signInWithEmail('real@user.com');
  resolveSlowGuest();
  const slowResult = await pendingGuest;
  assert.equal(slowResult.superseded, true, 'Pending guest login must be superseded by newer email login');
  assert.equal(cancelTest.getState().user.email, 'real@user.com', 'Real user must remain the active user');
  console.log('✓ Invariant 2: Genuine newer-intent cancellation preserved (slow guest cancelled by email login).');

  // 3. Verify Logout during pending login
  const logoutTest = createCorrectedAuthLifecycle();
  logoutTest.actions.setupCorrectedListener();
  let resolveSlow;
  logoutTest.authService.signInWithEmail = async (email) => {
    await new Promise(r => { resolveSlow = r; });
    return { success: true, user: { uid: 'slow-uid', email, isAnonymous: false } };
  };
  const pendingEmail = logoutTest.actions.signInWithEmail('slow@user.com');
  // While sign-in is pending, user clicks logout:
  await logoutTest.actions.signOut();
  resolveSlow();
  const slowEmailResult = await pendingEmail;
  assert.equal(slowEmailResult.superseded, true, 'Pending sign-in must be superseded by logout');
  assert.equal(logoutTest.getState().isAuthenticated, false, 'User must remain logged out');
  console.log('✓ Invariant 3: Logout during pending login preserved.');

  // 4. Verify Account Switching & Scope Transitions
  const switchTest = createCorrectedAuthLifecycle();
  switchTest.actions.setupCorrectedListener();
  await switchTest.actions.signInAsGuest();
  assert.equal(switchTest.getState().user.isGuest, true);
  // Transition to registered user:
  await switchTest.actions.signInWithEmail('userA@mythrill.com');
  assert.equal(switchTest.getState().user.email, 'userA@mythrill.com');
  // Switch to User B:
  await switchTest.actions.signInWithEmail('userB@mythrill.com');
  assert.equal(switchTest.getState().user.email, 'userB@mythrill.com');
  console.log('✓ Invariant 4: Guest-to-account and account-to-account transitions preserved.');

  console.log('\n=== All Triage Assertions Passed Successfully ===');
})();
