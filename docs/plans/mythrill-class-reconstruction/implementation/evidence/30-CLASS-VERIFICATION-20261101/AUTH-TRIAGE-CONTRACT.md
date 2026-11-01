# Shared Guest Auth Blocker — Independent Triage & Bounded Correction Contract

**Verification Date:** November 1, 2026  
**Target Environment:** Mythrill VTT (`vtt-react`)  
**Tested Commit:** `f0519cb0bd3afb4d21a8ffa8cc8ea043ac3d41a4` (`fix(ci): isolate server tests, resolve spell specializations, and align 30-class roster tests`)  
**Production Build Date:** November 1, 2026, 20:06:38 UTC+1  
**Status:** TRIAGE COMPLETE — CONTRACT SPECIFIED (APPLICATION SOURCE UNMODIFIED)

---

## 1. Executive Summary

Class verification for the 30 canonical classes reached the live production wizard round-trip stage. The real browser UI round-trip (`/account/characters/create` → select class → select spells → save → view → reopen edit → save) was blocked because guest authentication failed at the browser level under two distinct mechanisms:

1. **Failure 1 (Guest Session Restore):** `initializeAuth()` crashes with `TypeError: actions.setIsAuthenticated is not a function` at `authStore.js:782`.
2. **Failure 2 (Active Guest Sign-In):** `signInAsGuest()` self-rejects with `{ success: false, error: 'superseded-by-newer-auth', superseded: true }` at `authStore.js:311` because Firebase's `onAuthStateChange` listener misidentifies the anonymous Firebase user credential as a registered user, triggers `setUser()`, and increments `authIntentSeq`.

Both failures have been **independently reproduced** against the current source and the live compiled production build (`vtt-react/build/static/js/stores.7046115f.js`) using both headless unit simulation (`vtt-react/verification/30-class-delivery-20261101/triage-auth-reproduction.cjs`) and live Chromium Playwright automation (`vtt-react/verification/30-class-delivery-20261101/test-guest-click.cjs`).

A naive patch previously proposed (`previousUid !== nextUid && !user?.isGuest` in `setUser`) was investigated and **strictly rejected**: it does not work (raw Firebase user objects lack `isGuest`), and it compromises core auth intent sequencing (B5-A / R8 fencing) and P5 private scope activation.

This document specifies the **bounded correction contract** for auth/persistence owners, detailing exact paths, line numbers, and 5 regression test cases preserving all 7 required security and state invariants.

---

## 2. Tested Build & Environment Snapshot

### 2.1 Git Repository State
- **HEAD Commit:** `f0519cb0bd3afb4d21a8ffa8cc8ea043ac3d41a4`
- **Branch:** `master`
- **Application Source Modified in this Task:** **NONE** (`vtt-react/src/` is strictly read-only during triage).
- **Harness Scripts Created:**
  - `vtt-react/verification/30-class-delivery-20261101/triage-auth-reproduction.cjs`
  - `vtt-react/verification/30-class-delivery-20261101/test-guest-click.cjs`
  - `vtt-react/verification/30-class-delivery-20261101/covenbane-ui-roundtrip.cjs`

### 2.2 Production Bundle & Source Hashes (SHA-256)
| File | SHA-256 Hash | Notes |
| :--- | :--- | :--- |
| `vtt-react/build/index.html` | `335a481572566f8132ee8b35d007e53121a39f2f939f6a311a6e33c5c2c6be64` | Compiled prod HTML (7,830 bytes) |
| `vtt-react/build/asset-manifest.json` | `30c108b753b7774acb6ec1b07fa7b7ac58e79e806a5afbf07d0e9eda2557bbb4` | Webpack build manifest |
| `vtt-react/build/static/js/stores.7046115f.js` | `9b2c1b6b043714d8cfa6bffe99e3a4c6c3862f97f77179d7976c701bd7d694cf` | Compiled `useAuthStore` bundle |
| `vtt-react/src/store/authStore.js` | `745fa66fd73aca0e6ce69397d293d20b70ccd496093522384175f9a3da45ab33` | Production auth store source |
| `vtt-react/src/persistence/authBootstrapGateBinding.js` | `9eb79c25c99f38504a1a94ee15bf6201e1f4c0ee6913b606ddf037d7737e54ab` | P5 auth-gate binding |
| `vtt-react/src/persistence/bootstrapPrivacyGate.js` | `975f821da9764a3d39f443c6c19167995c352a4e7cec4a7966e0ccbbd0e2b90e` | P5 bootstrap privacy gate |
| `vtt-react/src/persistence/handoff/accountHandoffCoordinator.js` | `6aa459919f33fd740aef7afbf9667b74f3ac4a702f9ce661da7b0d03e025ab45` | P5 handoff coordinator |
| `vtt-react/src/persistence/scopeModel.js` | `4f4e32114ca7ae88de72680e20b276ced719f951582495233685d8fe00591170` | P5 scope derivation & validation |
| `vtt-react/src/persistence/guestRetention.js` | `4ae397e4fbff7ae24b6c2669eafce539674a6eb08b2a8b546cdb3939c5004bb2` | Guest authored draft retention |

---

## 3. Independent Reproduction Evidence

### 3.1 Failure 1 Reproduction (`actions.setIsAuthenticated is not a function`)
- **Simulated Harness Execution (`triage-auth-reproduction.cjs`):**
  ```text
  Test 1: Reproducing initializeAuth calling non-existent setIsAuthenticated...
  ✓ Reproduction 1 CONFIRMED: initializeAuth throws TypeError on missing setIsAuthenticated action:
    actions.setIsAuthenticated is not a function (production bug in authStore.js:782)
  ```
- **Live Browser Execution (`stores.7046115f.js` under Playwright):**
  ```text
  [Console] error Error parsing guest user data: TypeError: t(...).setIsAuthenticated is not a function
      at initializeAuth (http://127.0.0.1:4202/static/js/stores.7046115f.js:1:296638)
      at http://127.0.0.1:4202/static/js/main.93bcc2dd.js:1:1867959
  Final URL: http://127.0.0.1:4202/
  ```
- **Result:** Calling non-existent action `setIsAuthenticated` aborts guest session restoration. The user remains unauthenticated (`isAuthenticated: false`), and React Router's `<ProtectedRoute>` redirects from `/account/characters` back to `/`.

### 3.2 Failure 2 Reproduction (`superseded-by-newer-auth`)
- **Simulated Harness Execution (`triage-auth-reproduction.cjs`):**
  ```text
  Test 2: Reproducing signInAsGuest race condition with Firebase onAuthStateChange...
  ✓ Reproduction 2 CONFIRMED: signInAsGuest rejects itself with: superseded-by-newer-auth
  ```
- **Live Browser Execution (Chromium clicking UI "Login" → "Continue as Guest"):**
  ```text
  [Console] ✅ Firebase configured with project: mythrill-ff7c6
  Login button count: 1
  Guest button count: 1
  [Console] Guest login failed: superseded-by-newer-auth
  [Console] Error loading user maps: FirebaseError: Missing or insufficient permissions.
  After guest click URL: http://127.0.0.1:4202/
  ```
- **Result:** The UI click handler in `AuthModal.jsx` receives `{ success: false, error: 'superseded-by-newer-auth' }`. The modal remains open or aborts navigation; the user is trapped on the home page.

---

## 4. Deep Architectural Root Cause Analysis

### 4.1 Root Cause of Failure 1
In `vtt-react/src/store/authStore.js` (lines 780–782):
```javascript
const parsedUserData = JSON.parse(guestUserData);
get().setUser(parsedGuestUser);
get().setUserData(parsedUserData);
get().setIsAuthenticated(true); // <--- FATAL RUNTIME ERROR
```
`useAuthStore` defines state fields `isAuthenticated`, `isAuthInitialized`, etc., but **no action named `setIsAuthenticated` exists**. On lines 133–138, `setUser(user)` already sets:
```javascript
set({
  user,
  isAuthenticated: !!user,
  isAuthInitialized: true,
  error: null
});
```
Because `parsedGuestUser` is truthy, calling `setUser(parsedGuestUser)` already sets `isAuthenticated: true`. Calling `get().setIsAuthenticated(true)` is both completely redundant and fatal.

### 4.2 Root Cause of Failure 2
In `vtt-react/src/store/authStore.js`:
1. `signInAsGuest()` initiates an asynchronous intent at line 295:
   `const intent = beginAuthIntent();` (say `authIntentSeq` = 1).
2. It calls `await authService.signInAsAnonymous();` (line 305).
3. The Firebase Auth SDK creates an anonymous credential:
   `{ uid: 'anon-...', isAnonymous: true }`.
4. Firebase fires its `onAuthStateChanged` listeners.
5. In `authStore.js:816`, the listener checks:
   ```javascript
   if (user && !user.isGuest) {
     get().setUser(user);
   }
   ```
6. **The Flaw:** Raw Firebase `User` objects have `user.isAnonymous === true`, but `user.isGuest` is **`undefined`**. Therefore, `!user.isGuest` evaluates to **`true`**!
7. The listener invokes `setUser(user)` with the raw anonymous Firebase user.
8. Inside `setUser(user)` (lines 127–131):
   ```javascript
   const previousUid = get().user?.uid ?? null;
   const nextUid = user?.uid ?? null;
   if (previousUid !== nextUid) {
     beginAuthIntent();
   }
   ```
   Because `previousUid` was `null` and `nextUid` is `'anon-...'`, `beginAuthIntent()` runs! `authIntentSeq` advances to 2!
9. In addition, `setUser(user)` calls `loadUserData()`, querying Firestore for user profile documents that anonymous guests do not have permission to read, generating `FirebaseError: Missing or insufficient permissions`.
10. When `signInAsAnonymous()` promise resolves back into `signInAsGuest()`, line 310 evaluates:
    ```javascript
    if (!isCurrentAuthIntent(intent)) {
      return { success: false, error: 'superseded-by-newer-auth', superseded: true };
    }
    ```
    Because `intent` (1) $\neq$ `authIntentSeq` (2), `signInAsGuest()` self-rejects!

### 4.3 Why `previousUid !== nextUid && !user?.isGuest` in `setUser` is Strictly Rejected
The proposed patch modifies `setUser`:
`if (previousUid !== nextUid && !user?.isGuest) beginAuthIntent();`

This patch is defective and dangerous for five concrete architectural reasons:
1. **It Does Not Work Against Firebase:** The object passed by Firebase's callback to `setUser` is a raw Firebase user (`UserImpl`), which does NOT have `isGuest: true` (it has `isAnonymous: true`). Therefore, `!user?.isGuest` evaluates to `true` anyway, and `beginAuthIntent()` is STILL called.
2. **Breaks Intent Sequencing for Legitimate Guest Transitions:** `beginAuthIntent()` is the mechanism that cancels stale async operations when the principal changes. If a user transitions from Guest A to Guest B, suppressing `beginAuthIntent()` would allow stale in-flight promises from Guest A to overwrite Guest B.
3. **Breaks Logout Guarantees:** If a user initiates guest sign-in, and then clicks Logout or Sign In with Email while the guest sign-in is awaiting, suppressing intent sequencing on guest assignment would allow a late-resolving guest promise to resurrect an authenticated session.
4. **Violates the Auth Architecture of `onAuthStateChange`:** The comment at lines 814–815 explicitly specifies the architectural contract:
   `// CRITICAL FIX: Only restore authenticated Firebase users`
   `// Guest users are handled above with explicit login flag`
   The author's clear intent was that the automatic Firebase listener should ignore guest users entirely. The defect was checking `!user.isGuest` instead of `!user.isAnonymous && !user.isGuest`.
5. **Generates Firestore Permission Errors:** Allowing `onAuthStateChange` to pass an anonymous user into `setUser` triggers `loadUserData()`, throwing Firestore permission exceptions in production.

---

## 5. Architectural Invariants: Intent Sequencing & P5 Private Scopes

### 5.1 Auth Intent Sequencing (`authIntentSeq`)
- **Purpose:** Protects the single active auth principal from race conditions caused by interleaved asynchronous auth flows (B5-A / R8 fencing).
- **Invariants Preserved:**
  - `beginAuthIntent()` is called on every explicit auth operation initiation (`signIn`, `signUp`, `signInWithGoogle`, `signInAsGuest`, `signOut`).
  - `beginAuthIntent()` is called on genuine principal changes (`previousUid !== nextUid`) in `setUser()`.
  - Every asynchronous operation checks `isCurrentAuthIntent(intent)` before committing state. If another intent occurred in the interim, the stale operation terminates as superseded without mutating state.

### 5.2 P5 Bootstrap Privacy Gate & Scopes
- `useAuthStore` binds to the P5 gate via `installAuthBootstrapGate(useAuthStore)` (`authBootstrapGateBinding.js:866`).
- Whenever `useAuthStore` updates, `syncBootstrapGateWithAuthState` derives the active scope via `deriveScopeFromAuthUser` (`scopeModel.js:123`):
  - Guest user (`user.isGuest || user.isAnonymous`): maps to stable local namespace `guest:local-guest` (`GUEST_SCOPE_ID`).
  - Verified user (`isNonEmptyString(user.uid)`): maps to `user:<uid>`.
  - Admin/dev bypass: maps to `dev:local-dev`.
- **Zero Cross-Contamination:**
  - Private storage keys are scoped by generation and namespace (`mythrill:p5:<scope>:*`).
  - Authenticated user drafts (`user:<uid>`) and guest drafts (`guest:local-guest`) never share storage partitions.
  - When transitioning from guest to registered user, `accountHandoffCoordinator.js` retires the guest scope and activates the user scope with a new generation. Authored guest drafts are retained device-locally under `guestRetention.js` without being uploaded or merged into the new user scope.

### 5.3 Genuine Guest UI Login (Category C) vs. Injected Fixtures (Category D)
- **Category D (Fixture Injection):** Writing directly to `localStorage` before page load (`mythrill:p5:guest:*`, `mythrill-guest-user`, `mythrill-guest-characters`). When the page loads, `initializeAuth()` executes. If `mythrill-guest-explicit-login` is missing, `clearGuestSessionState()` clears the session. If `mythrill-guest-explicit-login` is `'true'`, `initializeAuth()` crashes on line 782 (`setIsAuthenticated`).
- **Category C (Genuine UI Round-Trip):** User clicks "Login" → "Continue as Guest" → `signInAsGuest()`. With the contract applied, `signInAsGuest()` completes with `{ success: true }`, sets `mythrill-guest-explicit-login: 'true'`, establishes `guest:local-guest` scope, and navigates seamlessly to `/account/characters/create`.

---

## 6. The Bounded Correction Contract

### 6.1 Affected File
`vtt-react/src/store/authStore.js`

### 6.2 Exact Unified Diff

```diff
--- a/vtt-react/src/store/authStore.js
+++ b/vtt-react/src/store/authStore.js
@@ -361,6 +361,9 @@ export const useAuthStore = create((set, get) => ({
           // Mark guest as initialized so we don't clear again on page refresh
           localStorage.setItem('mythrill-guest-initialized', 'true');
 
+          // Mark explicit guest login so initializeAuth restores session on reload
+          localStorage.setItem('mythrill-guest-explicit-login', 'true');
+
           set({
             user: guestUser,
             userData: guestUserData,
@@ -779,7 +782,6 @@ export const useAuthStore = create((set, get) => ({
                   const parsedUserData = JSON.parse(guestUserData);
                   get().setUser(parsedGuestUser);
                   get().setUserData(parsedUserData);
-                  get().setIsAuthenticated(true);
                 } catch (error) {
                   console.error('Error parsing guest user data:', error);
                 }
@@ -813,11 +815,11 @@ export const useAuthStore = create((set, get) => ({
             return authService.onAuthStateChange((user) => {
               // CRITICAL FIX: Only restore authenticated Firebase users
               // Guest users are handled above with explicit login flag
-              if (user && !user.isGuest) {
+              if (user && !user.isAnonymous && !user.isGuest) {
                 get().setUser(user);
               } else if (!user) {
-                // Don't clobber an active admin dev-login session when
-                // Firebase reports no current user.
-                if (get().isAdminBypass) return;
+                // Don't clobber an active admin dev-login session OR an active guest session
+                // when Firebase reports no current user.
+                if (get().isAdminBypass || get().user?.isGuest) return;
                 // No authenticated user - clear state
                 get().setUser(null);
               }
```

### 6.3 Explanation of Each Change
1. **Line 364 (`localStorage.setItem('mythrill-guest-explicit-login', 'true')`):**
   Ensures that genuine guest UI sign-ins set the explicit login flag required by line 769. When the page reloads or navigates, `initializeAuth()` recognizes the session as intentionally authenticated rather than stale leftover state.
2. **Line 782 (Remove `get().setIsAuthenticated(true)`):**
   Resolves Failure 1. `useAuthStore` does not have an action named `setIsAuthenticated`. `setUser(parsedGuestUser)` on line 780 already sets `isAuthenticated: true`.
3. **Line 816 (Change `if (user && !user.isGuest)` to `if (user && !user.isAnonymous && !user.isGuest)`):**
   Resolves Failure 2. Firebase anonymous users have `user.isAnonymous === true` and `user.isGuest === undefined`. This condition cleanly prevents `onAuthStateChange` from adopting anonymous credentials as registered accounts, preventing `setUser()` from being called during guest login, which prevents spurious `beginAuthIntent()` calls and invalid Firestore queries.
4. **Line 821 (Change `if (get().isAdminBypass) return;` to `if (get().isAdminBypass || get().user?.isGuest) return;`):**
   Prevents background `null` events from Firebase from wiping an active guest session established in `useAuthStore`.

---

## 7. Regression Test Suite Specification

The following 5 test cases define the regression contract for auth and persistence test suites (e.g. `vtt-react/src/store/__tests__/authStore.guestFlow.test.js` or `vtt-react/src/persistence/__tests__/waveA_authGuestContract.test.js`).

### Test Case 1: Genuine Guest UI Sign-In Completes Without Self-Cancellation
```javascript
it('WA-AUTH-1: signInAsGuest completes successfully when Firebase onAuthStateChange fires with anonymous user', async () => {
  let authCallback;
  authService.onAuthStateChange.mockImplementation((cb) => { authCallback = cb; return () => {}; });
  authService.signInAsAnonymous.mockImplementation(async () => {
    const rawFirebaseUser = { uid: 'anon-test-uid-1', isAnonymous: true };
    // Firebase internally triggers onAuthStateChanged during sign-in
    if (authCallback) authCallback(rawFirebaseUser);
    return { success: true, user: rawFirebaseUser };
  });

  useAuthStore.getState().initializeAuth();
  const result = await useAuthStore.getState().signInAsGuest();

  expect(result.success).toBe(true);
  expect(result.superseded).toBeUndefined();
  expect(useAuthStore.getState().isAuthenticated).toBe(true);
  expect(useAuthStore.getState().user?.isGuest).toBe(true);
  expect(useAuthStore.getState().user?.uid).toBe('anon-test-uid-1');
  expect(localStorage.getItem('mythrill-guest-explicit-login')).toBe('true');
});
```

### Test Case 2: initializeAuth Restores Guest Session Without Missing Method Error
```javascript
it('WA-AUTH-2: initializeAuth restores guest session cleanly without throwing TypeError', () => {
  localStorage.setItem('mythrill-guest-user', JSON.stringify({ uid: 'guest-stored-1', isGuest: true }));
  localStorage.setItem('mythrill-guest-user-data', JSON.stringify({ displayName: 'Guest Stored', isGuest: true, characters: [] }));
  localStorage.setItem('mythrill-guest-explicit-login', 'true');

  expect(() => {
    useAuthStore.getState().initializeAuth();
  }).not.toThrow();

  expect(useAuthStore.getState().isAuthenticated).toBe(true);
  expect(useAuthStore.getState().user?.uid).toBe('guest-stored-1');
  expect(useAuthStore.getState().user?.isGuest).toBe(true);
});
```

### Test Case 3: Genuine Newer-Intent Cancellation Preserved (Slow Guest vs. Real Sign-In)
```javascript
it('WA-AUTH-3: in-flight guest sign-in is cleanly superseded if real user signs in during await', async () => {
  let resolveGuest;
  authService.signInAsAnonymous.mockImplementationOnce(() => new Promise(r => { resolveGuest = r; }));

  const guestPromise = useAuthStore.getState().signInAsGuest();

  // Real user arrives while guest sign-in is pending:
  useAuthStore.getState().setUser({ uid: 'user-real-99', isAnonymous: false });

  resolveGuest({ success: true, user: { uid: 'anon-late', isAnonymous: true } });
  const guestResult = await guestPromise;

  expect(guestResult.superseded).toBe(true);
  expect(useAuthStore.getState().user?.uid).toBe('user-real-99');
  expect(useAuthStore.getState().user?.isGuest).toBeUndefined();
});
```

### Test Case 4: Logout During Pending Login Preserved
```javascript
it('WA-AUTH-4: in-flight sign-in is superseded if signOut is called before resolution', async () => {
  let resolveLogin;
  authService.signIn.mockImplementationOnce(() => new Promise(r => { resolveLogin = r; }));

  const loginPromise = useAuthStore.getState().signIn('user@test.com', 'password');

  // User commands sign out while login is pending:
  await useAuthStore.getState().signOut();

  resolveLogin({ success: true, user: { uid: 'user-late' } });
  const loginResult = await loginPromise;

  expect(useAuthStore.getState().isAuthenticated).toBe(false);
  expect(useAuthStore.getState().user).toBeNull();
});
```

### Test Case 5: Scope & Generation Transition on Guest-to-Account Promotion
```javascript
it('WA-AUTH-5: transition from guest to registered account increments generation and isolates scopes', async () => {
  const { getBootstrapGateState } = require('../bootstrapPrivacyGate');

  // 1. Establish guest session
  useAuthStore.getState().setUser({ uid: 'anon-guest-1', isGuest: true, isAnonymous: true });
  const guestGate = getBootstrapGateState();
  expect(guestGate.scope.scopeKind).toBe('guest');
  expect(guestGate.scope.scopeId).toBe('local-guest');
  const guestGen = guestGate.generation;

  // 2. Transition to registered user
  useAuthStore.getState().setUser({ uid: 'user-account-1', isAnonymous: false });
  const userGate = getBootstrapGateState();
  expect(userGate.scope.scopeKind).toBe('user');
  expect(userGate.scope.scopeId).toBe('user-account-1');
  expect(userGate.generation).toBeGreaterThan(guestGen);
});
```
