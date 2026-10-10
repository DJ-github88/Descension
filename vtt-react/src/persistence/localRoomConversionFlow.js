/**
 * Project 5 Wave C (S8-A) — local-room conversion confirmation flow.
 *
 * Bridges the retained conversion transfer to the EXISTING P3 checkpoint
 * contract. This module does not save rooms: it observes room admission and
 * listens for the P3 durable checkpoint acknowledgment (`room_state_saved`
 * with cloudSaved + a confirmed revision) produced by the server checkpoint
 * writer, then confirms the transfer.
 *
 *   request emission  → create_room emit           (not durability)
 *   acknowledgment    → room_created               (not durability)
 *   admission         → room_joined                (not durability)
 *   durable checkpoint → room_state_saved cloudSaved + confirmedRevision
 *
 * Every callback revalidates the captured owner/generation context, so an
 * account switch or same-UID logout/relogin drops old continuations. A failure
 * or timeout leaves the transfer and the local source in a recoverable pending
 * state.
 */

import { isConsumerContextCurrent } from './scopedConsumer';
import {
  markConversionAcknowledged,
  markConversionAdmitted,
  markConversionFailed,
  confirmConversion,
  retireConfirmedConversion
} from './localRoomConversionScoped';

export const CONVERSION_CONFIRM_TIMEOUT_MS = 20000;

const FLOW_EVENTS = Object.freeze({
  REQUESTED: 'REQUESTED',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
  AWAITING_CONFIRMATION: 'AWAITING_CONFIRMATION',
  CONFIRMED: 'CONFIRMED',
  PENDING: 'PENDING',
  SUPERSEDED: 'SUPERSEDED'
});

const listeners = new Set();
let active = null;

function emitEvent(status) {
  const payload = { ...status, at: new Date().toISOString() };
  for (const listener of [...listeners]) {
    try {
      listener(payload);
    } catch (_error) {
      // A UI listener must never break the durability flow.
    }
  }
}

export function subscribeConversionFlow(listener) {
  if (typeof listener !== 'function') return () => {};
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getConversionFlowStatus() {
  if (!active) return { active: false };
  return {
    active: true,
    destinationRoomId: active.destinationRoomId,
    sourceRoomId: active.sourceRoomId,
    awaitingConfirmation: active.admitted,
    lastEvent: active.lastEvent || null
  };
}

function roomMatchesDestination(room, destinationRoomId) {
  if (!room || !destinationRoomId) return false;
  return room.persistentRoomId === destinationRoomId || room.id === destinationRoomId;
}

function detachActive() {
  if (!active) return;
  const { socket, handlers, timeout } = active;
  if (timeout) clearTimeout(timeout);
  try {
    socket.off('room_created', handlers.onRoomCreated);
    socket.off('room_joined', handlers.onRoomJoined);
    socket.off('room_state_saved', handlers.onRoomStateSaved);
    socket.off('room_state_save_error', handlers.onRoomStateSaveError);
    socket.off('room_error', handlers.onRoomError);
    socket.off('auth_error', handlers.onRoomError);
  } catch (_error) {
    // Listener cleanup is best-effort; the context fence still holds.
  }
  active = null;
}

export function cancelConversionConfirmation() {
  detachActive();
}

/**
 * Arm confirmation listeners for one conversion attempt. Safe to call again on
 * a retry for the same destination: the previous arm is replaced.
 */
export function beginConversionConfirmation({
  socket,
  context,
  destinationRoomId,
  sourceRoomId = null,
  onConfirmed = null
}) {
  if (!socket || typeof socket.emit !== 'function' || !destinationRoomId) {
    return { status: 'INVALID_REQUEST' };
  }
  detachActive();

  const isCurrent = () => isConsumerContextCurrent(context) && !!context;

  const finishPending = (error, retriable = true) => {
    if (!isCurrent()) {
      detachActive();
      emitEvent({ event: FLOW_EVENTS.SUPERSEDED, destinationRoomId });
      return;
    }
    markConversionFailed({ destinationRoomId, context, error, retriable });
    active.lastEvent = FLOW_EVENTS.PENDING;
    emitEvent({ event: FLOW_EVENTS.PENDING, destinationRoomId, error, retriable });
  };

  const finishConfirmed = (confirmedRevision) => {
    const confirmed = confirmConversion({ destinationRoomId, confirmedRevision, context });
    if (confirmed.status !== 'OK' && confirmed.status !== 'ALREADY_CONFIRMED') {
      if (confirmed.status === 'WRONG_DESTINATION' || confirmed.status === 'UNPROVEN_CHECKPOINT') {
        // A wrong destination or unproven revision must never confirm the
        // transfer; keep waiting for the true checkpoint instead of failing.
        return false;
      }
      detachActive();
      return false;
    }
    const retire = () => {
      if (!isCurrent()) return;
      const retired = retireConfirmedConversion({ context });
      detachActive();
      emitEvent({ event: FLOW_EVENTS.CONFIRMED, destinationRoomId, sourceRoomId,
        confirmedRevision, retired: retired.status === 'RETIRED' });
    };
    if (typeof onConfirmed === 'function') {
      try {
        const completion = onConfirmed({
          destinationRoomId,
          sourceRoomId,
          confirmedRevision,
          context
        });
        if (completion && typeof completion.then === 'function') {
          completion.then(retire).catch(() => {
            detachActive();
            emitEvent({ event: FLOW_EVENTS.PENDING, destinationRoomId,
              error: 'Checkpoint confirmed; local completion remains recoverable.', retriable: true });
          });
          return true;
        }
      } catch (_error) {
        // The transfer stays CONFIRMED (recoverable) until retirement succeeds.
        detachActive();
        emitEvent({ event: FLOW_EVENTS.PENDING, destinationRoomId,
          error: 'Checkpoint confirmed; local completion remains recoverable.', retriable: true });
        return false;
      }
    } else {
      // No source-retirement proof: retain the confirmed recovery receipt.
      detachActive();
      return false;
    }
    retire();
    return true;
  };

  const handlers = {
    onRoomCreated(data) {
      if (!isCurrent()) {
        detachActive();
        return;
      }
      if (!roomMatchesDestination(data?.room, destinationRoomId)) return;
      markConversionAcknowledged({ destinationRoomId, context });
      active.lastEvent = FLOW_EVENTS.ACKNOWLEDGED;
      emitEvent({ event: FLOW_EVENTS.ACKNOWLEDGED, destinationRoomId });
    },
    onRoomJoined(data) {
      if (!isCurrent()) {
        detachActive();
        return;
      }
      if (!roomMatchesDestination(data?.room, destinationRoomId)) return;
      const admitted = markConversionAdmitted({ destinationRoomId, context });
      if (admitted.status !== 'OK') return;
      if (active.requestSent) return;
      active.requestSent = true;
      active.admitted = true;
      active.lastEvent = FLOW_EVENTS.AWAITING_CONFIRMATION;
      emitEvent({ event: FLOW_EVENTS.AWAITING_CONFIRMATION, destinationRoomId });
      // The existing P3 checkpoint path: the server writes its authoritative
      // room state; only its durable confirmation can confirm the conversion.
      socket.emit('save_room_state_request', {
        roomId: destinationRoomId,
        reason: 'local_room_conversion'
      });
      if (active.timeout) clearTimeout(active.timeout);
      active.timeout = setTimeout(() => {
        if (!active || !active.requestSent) return;
        finishPending('confirmation-timeout', true);
        if (active) active.requestSent = false;
      }, CONVERSION_CONFIRM_TIMEOUT_MS);
    },
    onRoomStateSaved(data) {
      if (!isCurrent()) {
        detachActive();
        return;
      }
      if (!data || data.roomId !== destinationRoomId) return;
      if (data.reason !== 'local_room_conversion') return;
      if (!active?.admitted || !active.requestSent) return;
      if (data.cloudSaved !== true) return;
      const revision = Number(data.confirmedRevision);
      if (!Number.isSafeInteger(revision) || revision <= 0) return;
      finishConfirmed(revision);
    },
    onRoomStateSaveError(data) {
      if (!isCurrent()) {
        detachActive();
        return;
      }
      if (data?.roomId && data.roomId !== destinationRoomId) return;
      if (data?.code === 'gm_required') return;
      finishPending(data?.error || 'checkpoint-not-confirmed', data?.retriable !== false);
    },
    onRoomError(data) {
      if (!isCurrent()) {
        detachActive();
        return;
      }
      finishPending(data?.error || data?.message || 'room-error', true);
    }
  };

  active = {
    socket,
    context,
    destinationRoomId,
    sourceRoomId,
    handlers,
    timeout: null,
    requestSent: false,
    admitted: false,
    lastEvent: FLOW_EVENTS.REQUESTED
  };

  socket.on('room_created', handlers.onRoomCreated);
  socket.on('room_joined', handlers.onRoomJoined);
  socket.on('room_state_saved', handlers.onRoomStateSaved);
  socket.on('room_state_save_error', handlers.onRoomStateSaveError);
  socket.on('room_error', handlers.onRoomError);
  socket.on('auth_error', handlers.onRoomError);
  emitEvent({ event: FLOW_EVENTS.REQUESTED, destinationRoomId });
  return { status: 'ARMED', destinationRoomId };
}

export function resetConversionFlowForTests() {
  detachActive();
  listeners.clear();
}
