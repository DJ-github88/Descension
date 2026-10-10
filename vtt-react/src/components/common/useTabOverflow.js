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

  const observedRef = useRef({ el: null, ro: null });
  useEffect(() => {
    const el = containerRef.current;
    const state = observedRef.current;
    if (el === state.el) return;
    if (state.ro) state.ro.disconnect();
    state.el = el;
    state.ro = null;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = Math.round(entry.contentRect.width);
        setContainerWidth(prev => (prev === w ? prev : w));
      }
    });
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);
    state.ro = ro;
  });

  useEffect(() => () => {
    if (observedRef.current.ro) observedRef.current.ro.disconnect();
    observedRef.current = { el: null, ro: null };
  }, []);

  useEffect(() => {
    const onResize = () => setContainerWidth(containerRef.current ? Math.round(containerRef.current.getBoundingClientRect().width) : null);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
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

    // Fast path: every tab width is known, so solve the visible count directly
    // (no one-tab-per-render stepping, no lag while resizing).
    if (n > 0 && itemIds.every(id => widthsRef.current.get(id) > 0)) {
      const w = itemIds.map(id => widthsRef.current.get(id));
      const total = w.reduce((s, x) => s + x, 0) + gap * (n - 1);
      if (total <= rootRect.width) return n;
      let used = 0;
      let k = 0;
      for (let i = 0; i < n; i++) {
        const next = used + w[i] + (i > 0 ? gap : 0);
        if (next + gap + triggerWidth > rootRect.width) break;
        used = next;
        k = i + 1;
      }
      return k;
    }

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
      widthKey <= lockRef.current.width + 2 &&
      lockRef.current.tick === fontsTick;

    let next = visibleCount;
    let action = null;
    if (overflowing && visibleCount > 0) {
      next = visibleCount - 1;
      action = 'collapse';
      lockRef.current = { width: widthKey, tick: fontsTick };
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

  const flipsRef = useRef({ count: 0, raf: 0 });
  useEffect(() => () => {
    if (flipsRef.current.raf) cancelAnimationFrame(flipsRef.current.raf);
  }, []);

  useLayoutEffect(() => {
    const k = computeFit();
    if (k === null || k === visibleCount) return;
    const flips = flipsRef.current;
    // Guard: if measurement keeps flipping the count within one frame, stop and
    // settle instead of looping into React's max update depth.
    if (flips.count >= 6) return;
    flips.count += 1;
    if (!flips.raf) {
      flips.raf = requestAnimationFrame(() => {
        flips.count = 0;
        flips.raf = 0;
      });
    }
    setVisibleCount(k);
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
