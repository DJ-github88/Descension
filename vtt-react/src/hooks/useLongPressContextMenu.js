import { useCallback, useRef } from 'react';

/**
 * Provides long-press → context menu support for touch devices.
 * Attach the returned pointer handlers to any element that already handles
 * `onContextMenu` and a synthetic contextmenu event will be dispatched after
 * the hold delay (default 550ms) unless the pointer moves beyond the tolerance.
 */
export default function useLongPressContextMenu({
  delay = 550,
  moveTolerance = 12,
  enabled = true,
  onLongPress
} = {}) {
  const timerRef = useRef(null);
  const startPosRef = useRef(null);
  const pointerIdRef = useRef(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startPosRef.current = null;
    pointerIdRef.current = null;
  }, []);

  const triggerContextMenu = useCallback(
    (event) => {
      if (!enabled) return;

      const target = event?.target;
      if (!target) return;

      const syntheticEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: event.clientX,
        clientY: event.clientY,
        button: 2
      });

      target.dispatchEvent(syntheticEvent);

      if (onLongPress) {
        onLongPress(event);
      }
    },
    [enabled, onLongPress]
  );

  const handlePointerDown = useCallback(
    (event) => {
      if (!enabled) return;
      if (event.pointerType !== 'touch') return;

      startPosRef.current = { x: event.clientX, y: event.clientY };
      pointerIdRef.current = event.pointerId;

      timerRef.current = window.setTimeout(() => {
        triggerContextMenu(event);
        clear();
      }, delay);
    },
    [clear, delay, enabled, triggerContextMenu]
  );

  const handlePointerMove = useCallback(
    (event) => {
      if (!enabled) return;
      if (event.pointerType !== 'touch') return;
      if (pointerIdRef.current !== null && pointerIdRef.current !== event.pointerId) return;
      if (!startPosRef.current) return;

      const deltaX = Math.abs(event.clientX - startPosRef.current.x);
      const deltaY = Math.abs(event.clientY - startPosRef.current.y);

      if (deltaX > moveTolerance || deltaY > moveTolerance) {
        clear();
      }
    },
    [clear, enabled, moveTolerance]
  );

  const handlePointerUp = useCallback(
    (event) => {
      if (event.pointerType !== 'touch') return;
      clear();
    },
    [clear]
  );

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp,
    cancel: clear
  };
}

