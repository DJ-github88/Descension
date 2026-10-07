/**
 * Socket.IO acknowledgement helpers.
 *
 * Handlers may receive a trailing acknowledgement callback. The composed
 * socket middleware (sanitization -> validation -> rate limit) must forward
 * the complete argument list to the handler, and may itself answer with a
 * bounded failure when it rejects a request. `ensureSingleAck` wraps an
 * acknowledgement callback exactly once per dispatch so that a wrapper and
 * the handler can never produce a duplicate acknowledgement.
 */

const ACK_ONCE = Symbol('mythrill.ackOnce');

/**
 * Locate the acknowledgement callback in a handler argument list.
 * Socket.IO appends it as the last argument when the client supplied one.
 * @param {Array} args - Handler arguments
 * @returns {number} Index of the callback, or -1
 */
function findAckIndex(args) {
  for (let i = args.length - 1; i >= 0; i--) {
    if (typeof args[i] === 'function') {return i;}
  }
  return -1;
}

/**
 * Wrap the acknowledgement callback (if any) so it can run at most once.
 * Already-guarded argument lists are returned unchanged, so the same guarded
 * callback reaches every wrapper and the handler.
 * @param {Array} args - Handler arguments
 * @returns {{ args: Array, ack: Function|null, ackIndex: number }}
 */
function ensureSingleAck(args) {
  const ackIndex = findAckIndex(args);
  if (ackIndex === -1) {
    return { args, ack: null, ackIndex };
  }

  const original = args[ackIndex];
  if (original[ACK_ONCE]) {
    return { args, ack: original, ackIndex };
  }

  let called = false;
  const ackOnce = (...ackArgs) => {
    if (called) {return undefined;}
    called = true;
    return original(...ackArgs);
  };
  ackOnce[ACK_ONCE] = true;

  const forwardedArgs = args.slice();
  forwardedArgs[ackIndex] = ackOnce;
  return { args: forwardedArgs, ack: ackOnce, ackIndex };
}

/**
 * Answer an acknowledgement-bearing request with a bounded failure payload.
 * No-op when the caller supplied no callback.
 * @param {Function|null} ack - Guarded acknowledgement callback
 * @param {Object} payload - Failure payload
 */
function ackFailure(ack, payload) {
  if (typeof ack === 'function') {
    ack(payload);
  }
}

module.exports = { ensureSingleAck, ackFailure, findAckIndex };
