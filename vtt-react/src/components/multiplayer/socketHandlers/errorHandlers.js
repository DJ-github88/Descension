/**
 * Global socket error handlers.
 * Listens for error events emitted by the server that previously had no frontend listeners.
 *
 * Project 2: room persistence status is surfaced here through the existing
 * notification store. This is ROOM cloud-save status only - it makes no claim
 * about journal, character or campaign durability.
 *
 * Status is scoped to the client's CURRENT multiplayer room: a stale packet
 * for an old room is ignored and cannot change the current room's state or
 * raise a toast. Previous-state deduplication is tracked per room so one
 * room's outage cannot suppress or fabricate another room's notification.
 */

export function registerErrorHandlers({ socket, notificationStore, currentRoomRef, currentRoom }) {
  const lastStatusByRoom = new Map();
  const MAX_TRACKED_STATUS_ROOMS = 20;

  // `notificationStore` may be the zustand hook itself (as passed from
  // MultiplayerApp) or a plain store object. Resolve its actions safely.
  const resolveNotificationActions = () => {
    if (!notificationStore) {return null;}
    if (typeof notificationStore.getState === 'function') {
      try {
        return notificationStore.getState();
      } catch (_) {
        return null;
      }
    }
    return notificationStore;
  };
  const notificationActions = resolveNotificationActions();

  const showWarning = (message, options = {}) => {
    if (notificationActions && typeof notificationActions.showWarning === 'function') {
      notificationActions.showWarning(message, options);
    }
  };

  const showSuccess = (message, options = {}) => {
    if (notificationActions && typeof notificationActions.showSuccess === 'function') {
      notificationActions.showSuccess(message, options);
    }
  };

  const currentRoomId = () => {
    const refRoom = currentRoomRef && currentRoomRef.current;
    if (refRoom && refRoom.id) {return refRoom.id;}
    if (currentRoom && currentRoom.id) {return currentRoom.id;}
    return null;
  };

  // A packet without a room scope is accepted for legacy compatibility; a
  // scoped packet is accepted only for the client's current room.
  const isCurrentRoom = (roomId) => {
    if (!roomId) {return true;}
    const active = currentRoomId();
    return !active || active === roomId;
  };

  const readPreviousStatus = (key) => lastStatusByRoom.get(key) || null;

  const rememberStatus = (key, status) => {
    lastStatusByRoom.set(key, status);
    while (lastStatusByRoom.size > MAX_TRACKED_STATUS_ROOMS) {
      const oldest = lastStatusByRoom.keys().next().value;
      lastStatusByRoom.delete(oldest);
    }
  };

  socket.on('validation_error', (data) => {
    console.warn('[socket] Validation error:', data?.message, data?.event);
  });

  socket.on('room_state_save_error', (data) => {
    if (!isCurrentRoom(data?.roomId)) {
      console.warn('[socket] Ignored room state save error for another room:', data?.roomId);
      return;
    }
    if (data?.code === 'gm_required') {
      // Members are not the room's save authority; the server already
      // broadcasts any accepted live state. Stay quiet on the map-switch path.
      console.warn('[socket] Room state save denied:', data?.error);
      return;
    }
    console.warn('[socket] Room state save error:', data?.error);
    showWarning(
      data?.retriable
        ? 'Room changes are not cloud-saved yet. Mythrill is retrying.'
        : `Room changes could not be cloud-saved: ${data?.error || 'unknown error'}`,
      { title: 'Room save failed' }
    );
  });

  socket.on('room_state_saved', (data) => {
    if (!isCurrentRoom(data?.roomId)) {return;}
    console.log('[socket] Room state saved successfully');
  });

  socket.on('room_save_status', (data) => {
    const roomId = data?.roomId;
    const status = data?.status;
    if (!status) {return;}
    if (!isCurrentRoom(roomId)) {return;}

    const key = roomId || '__unscoped__';
    const previous = readPreviousStatus(key);

    if (status === 'unsaved') {
      if (previous !== 'unsaved') {
        showWarning(
          'Room changes are not cloud-saved. Recovery may be needed - keep this tab open.',
          { title: 'Room not saved', persistent: true }
        );
      }
    } else if (status === 'retrying') {
      if (previous !== 'retrying' && previous !== 'unsaved') {
        showWarning('Cloud save is failing. Mythrill is retrying automatically.', {
          title: 'Room save retrying'
        });
      }
    } else if (status === 'saved') {
      if (previous === 'retrying' || previous === 'unsaved') {
        showSuccess('Room changes are saved to the cloud.', { title: 'Room saved' });
      }
    }

    rememberStatus(key, status);
  });

  socket.on('join_error', (data) => {
    console.warn('[socket] Join error:', data?.message);
  });

  return () => {
    socket.off('validation_error');
    socket.off('room_state_save_error');
    socket.off('room_state_saved');
    socket.off('room_save_status');
    socket.off('join_error');
  };
}
