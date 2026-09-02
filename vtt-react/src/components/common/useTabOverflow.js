import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const EXPAND_MARGIN = 12;

const useTabOverflow = ({ itemIds, triggerWidth = 34 }) => {
  const containerRef = useRef(null);
  const widthsRef = useRef(new Map());
  const prevKeyRef = useRef(null);
  const lastActionRef = useRef(null);
  const lockRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const [fontsTick, setFontsTick] = useState(0);
  const [visibleCount, setVisibleCount] = useState(itemIds.length);

  const idsKey = itemIds.join('\u0000');

  if (prevKeyRef.current !== idsKey) {
    prevKeyRef.current = idsKey;
    lastActionRef.current = null;
    lockRef.current = null;
    setVisibleCount(itemIds.length);
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      let active = true;
      document.fonts.ready.then(() => {
        if (active) setFontsTick(t => t + 1);
      }).catch(() => {});
      return () => { active = false; };
    }
    return undefined;
  }, []);

  const computeFit = useCallback(() => {
    const root = containerRef.current;
    if (!root) return null;
    const cs = window.getComputedStyle(root);
    const gap = parseFloat(cs.columnGap) || parseFloat(cs.gap) || 4;

    root.querySelectorAll('[data-overflow-id]').forEach(el => {
      widthsRef.current.set(el.getAttribute('data-overflow-id'), el.getBoundingClientRect().width);
    });
    const idSet = new Set(itemIds);
    Array.from(widthsRef.current.keys()).forEach(id => {
      if (!idSet.has(id)) widthsRef.current.delete(id);
    });

    const rootRect = root.getBoundingClientRect();
    if (!rootRect.width) return null;
    const widthKey = Math.round(rootRect.width);
    const n = itemIds.length;

    const items = Array.from(root.querySelectorAll('[data-overflow-id]'));
    const triggerEl = root.querySelector('[data-overflow-trigger]');
    const lastRect = items.length ? items[items.length - 1].getBoundingClientRect() : null;
    const triggerRect = triggerEl ? triggerEl.getBoundingClientRect() : null;

    const rowRight = triggerRect
      ? triggerRect.right
      : (lastRect ? lastRect.right : rootRect.left);
    const overflowing = rowRight - rootRect.right > 1;

    const baseRight = lastRect ? lastRect.right : rootRect.left;
    const reserve = gap + (triggerRect ? gap + triggerRect.width : 0);
    const freeForNext = rootRect.right - baseRight - reserve;

    const locked =
      lockRef.current !== null &&
      Math.abs(lockRef.current.width - widthKey) <= 2 &&
      lockRef.current.tick === fontsTick;

    let next = visibleCount;
    let action = null;
    if (overflowing && visibleCount > 0) {
      next = visibleCount - 1;
      action = 'collapse';
      if (lockRef.current === null || !locked) {
        lockRef.current = { width: widthKey, tick: fontsTick };
      }
    } else {
      const nextW = visibleCount < n ? widthsRef.current.get(itemIds[visibleCount]) : undefined;
      if (
        visibleCount < n &&
        !locked &&
        nextW !== undefined &&
        freeForNext >= nextW + EXPAND_MARGIN
      ) {
        next = visibleCount + 1;
        action = 'expand';
      } else if (lockRef.current !== null && !locked) {
        lockRef.current = null;
      }
    }

    if (action === null) lastActionRef.current = null;
    else lastActionRef.current = action;

    return Math.max(0, Math.min(next, n));
  }, [containerWidth, fontsTick, idsKey, itemIds, triggerWidth, visibleCount]);

  useLayoutEffect(() => {
    const k = computeFit();
    if (k !== null) {
      setVisibleCount(prev => (prev === k ? prev : k));
    }
  });

  return {
    containerRef,
    containerWidth,
    visibleCount,
    visibleIds: itemIds.slice(0, visibleCount),
    hiddenIds: itemIds.slice(visibleCount)
  };
};

export default useTabOverflow;
