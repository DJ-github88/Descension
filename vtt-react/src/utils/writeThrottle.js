/**
 * Write Throttle / Cooldown utilities
 *
 * Client-side guard rails so rapid user input (chat sends, vote clicks, state
 * toggles, dice rolls) cannot translate into a burst of Firestore writes.
 *
 * Two primitives:
 *  - `runWithCooldown(key, ms, fn)` — leading-edge rate limit. The first call
 *    wins; calls during the cooldown are dropped (optionally invoking
 *    `onBlocked`). This is the right tool for votes / toggles.
 *  - `createDebouncedWriter(fn, waitMs)` — trailing-edge debounce that always
 *    resolves the latest payload. Right tool for "save the latest value".
 *
 * Both are dependency-free and safe to use outside React. `useCooldown` is a
 * small React binding that also exposes a `blocked` flag for disabling buttons.
 */

import { useCallback, useRef, useState } from 'react';

const cooldownUntil = new Map();

export const isOnCooldown = (key, now = Date.now()) => {
  const until = cooldownUntil.get(key);
  return typeof until === 'number' && until > now;
};

export const remainingCooldownMs = (key, now = Date.now()) => {
  const until = cooldownUntil.get(key);
  return typeof until === 'number' && until > now ? until - now : 0;
};

/**
 * Synchronous cooldown acquisition: returns false when still cooling down,
 * true (and starts the cooldown) otherwise. Use when the guarded work is not
 * a single promise (e.g. a zustand action that also emits over a socket).
 */
export const tryAcquireCooldown = (key, cooldownMs) => {
  const now = Date.now();
  if (isOnCooldown(key, now)) return false;
  cooldownUntil.set(key, now + cooldownMs);
  return true;
};

/**
 * Run `fn` at most once per `cooldownMs` per `key`.
 * Returns a promise resolving to the result, or `undefined` when blocked.
 */
export const runWithCooldown = async (key, cooldownMs, fn, options = {}) => {
  const now = Date.now();
  if (isOnCooldown(key, now)) {
    if (options.onBlocked) options.onBlocked(remainingCooldownMs(key, now));
    return undefined;
  }
  cooldownUntil.set(key, now + cooldownMs);
  try {
    return await fn();
  } finally {
    if (options.releaseOnFailure && cooldownUntil.get(key) === now + cooldownMs) {
      cooldownUntil.delete(key);
    }
  }
};

export const clearCooldown = (key) => cooldownUntil.delete(key);
export const clearAllCooldowns = () => cooldownUntil.clear();

/**
 * Trailing-edge debounce around an async writer. Only the last payload in a
 * burst is written. `flush()` forces an immediate write.
 */
export const createDebouncedWriter = (writer, waitMs) => {
  let timer = null;
  let pendingPayload;
  let pendingResolvers = [];

  const settle = (result, error) => {
    const resolvers = pendingResolvers;
    pendingResolvers = [];
    resolvers.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(result)));
  };

  const invoke = async () => {
    timer = null;
    const payload = pendingPayload;
    pendingPayload = undefined;
    try {
      const result = await writer(payload);
      settle(result, null);
      return result;
    } catch (error) {
      settle(null, error);
      throw error;
    }
  };

  const schedule = (payload) =>
    new Promise((resolve, reject) => {
      pendingPayload = payload;
      pendingResolvers.push({ resolve, reject });
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        invoke().catch(() => {
          /* rejection delivered to caller */
        });
      }, waitMs);
    });

  const flush = () => {
    if (!timer) return Promise.resolve(undefined);
    clearTimeout(timer);
    return invoke();
  };

  const cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    pendingPayload = undefined;
    settle(undefined, null);
  };

  return { schedule, flush, cancel, isPending: () => timer !== null };
};

/**
 * React binding: returns [blocked, run, remainingMs].
 * `blocked` flips true while the cooldown is active so buttons can be disabled.
 */
export const useCooldown = (cooldownMs) => {
  const [blocked, setBlocked] = useState(false);
  const timeoutRef = useRef(null);

  const run = useCallback(
    async (key, fn, options = {}) => {
      const now = Date.now();
      if (isOnCooldown(key, now)) {
        if (options.onBlocked) options.onBlocked(remainingCooldownMs(key, now));
        return undefined;
      }
      cooldownUntil.set(key, now + cooldownMs);
      setBlocked(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        setBlocked(false);
      }, cooldownMs);
      try {
        return await fn();
      } finally {
        if (options.releaseOnFailure) {
          cooldownUntil.delete(key);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setBlocked(false);
        }
      }
    },
    [cooldownMs]
  );

  return [blocked, run];
};

const writeThrottle = {
  isOnCooldown,
  remainingCooldownMs,
  tryAcquireCooldown,
  runWithCooldown,
  clearCooldown,
  clearAllCooldowns,
  createDebouncedWriter,
  useCooldown
};

export default writeThrottle;
