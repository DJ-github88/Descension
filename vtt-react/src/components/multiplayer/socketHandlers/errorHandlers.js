/**
 * Global socket error handlers.
 * Listens for error events emitted by the server that previously had no frontend listeners.
 */

export function registerErrorHandlers({ socket, notificationStore }) {
  socket.on('validation_error', (data) => {
    console.warn('[socket] Validation error:', data?.message, data?.event);
  });

  socket.on('room_state_save_error', (data) => {
    console.warn('[socket] Room state save error:', data?.error);
  });

  socket.on('room_state_saved', (data) => {
    console.log('[socket] Room state saved successfully');
  });

  socket.on('join_error', (data) => {
    console.warn('[socket] Join error:', data?.message);
  });

  return () => {
    socket.off('validation_error');
    socket.off('room_state_save_error');
    socket.off('room_state_saved');
    socket.off('join_error');
  };
}
