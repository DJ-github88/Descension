import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const useTabOverflow = ({ itemIds, triggerWidth = 34 }) => {
  const containerRef = useRef(null);
  const widthsRef = useRef(new Map());
  const prevKeyRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const [fontsTick, setFontsTick] = useState(0);
  const [visibleCount, setVisibleCount] = useState(itemIds.length);

  const idsKey = itemIds.join('\u0000');

  if (prevKeyRef.current !== idsKey) {
    prevKeyRef.current = idsKey;
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

    const rect = root.getBoundingClientRect();
    const W = containerWidth !== null ? containerWidth : rect.width;
    if (!W || W <= 0) return null;

    const n = itemIds.length;
    let used = 0;
    let k = 0;
    for (let i = 0; i < n; i++) {
      const w = widthsRef.current.get(itemIds[i]);
      if (w === undefined) break;
      const nextUsed = used + (k > 0 ? gap : 0) + w;
      const total = nextUsed + (k + 1 < n ? gap + triggerWidth : 0);
      if (total <= W + 1) {
        used = nextUsed;
        k += 1;
      } else {
        break;
      }
    }
    return k;
  }, [containerWidth, fontsTick, idsKey, itemIds, triggerWidth]);

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
