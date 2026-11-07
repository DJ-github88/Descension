/**
 * Handshake `auth` callback for a principal-bound socket.io connection.
 *
 * socket.io-client re-sends `auth` on every (re)connection attempt: a plain
 * object is reused verbatim, a function is called per attempt and the attempt
 * waits for its callback. A Firebase ID token expires after ~1 hour and the
 * production middleware refuses an expired one, so a long-lived socket must
 * obtain a current token for the SAME principal on reconnect.
 *
 * Contract:
 * - While `isCurrent()` holds (the socket's own principal + account
 *   generation), `resolveToken()` is invoked synchronously in the same turn as
 *   that check, so it reads the principal the socket was checked against; its
 *   result is used only if `isCurrent()` still holds after it settles.
 * - Otherwise, and on any failure (synchronous throw, rejection, or no answer
 *   within `timeoutMs`), the attempt carries this socket's own last token: the
 *   pre-existing behaviour, never another principal's token. A refused stale
 *   token ends at the server normally (connect_error); nothing here retries.
 * - Each attempt calls back exactly once.
 */
export const RECONNECT_AUTH_TIMEOUT_MS = 10000;

const checkCurrent = (isCurrent) => {
  try {
    return isCurrent() === true;
  } catch (_error) {
    return false;
  }
};

export function createSocketReconnectAuth({
  initialToken,
  isCurrent,
  resolveToken,
  timeoutMs = RECONNECT_AUTH_TIMEOUT_MS
}) {
  let lastToken = initialToken;
  return (cb) => {
    let settled = false;
    let timer = null;
    const settle = (token) => {
      if (settled) return;
      settled = true;
      if (timer !== null) clearTimeout(timer);
      cb({ token });
    };

    if (!checkCurrent(isCurrent)) {
      settle(lastToken);
      return;
    }

    let pending;
    try {
      pending = resolveToken();
    } catch (error) {
      console.warn('Could not refresh auth token for socket reconnect:', error);
      settle(lastToken);
      return;
    }

    timer = setTimeout(() => {
      console.warn('Auth token refresh for socket reconnect timed out; using the last token');
      settle(lastToken);
    }, timeoutMs);

    Promise.resolve(pending).then((token) => {
      if (settled) return;
      if (checkCurrent(isCurrent)) lastToken = token;
      settle(lastToken);
    }, (error) => {
      console.warn('Could not refresh auth token for socket reconnect:', error);
      settle(lastToken);
    });
  };
}
