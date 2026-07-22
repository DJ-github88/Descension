import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';

const OVERFLOW_BTN_WIDTH = 40;
const SAFETY_MARGIN = 4;

export default function useNavOverflow(itemCount, headerRef, leftRef, rightRef) {
  const containerRef = useRef(null);
  const itemEls = useRef([]);
  const [overflowCount, setOverflowCount] = useState(0);
  const overflowCountRef = useRef(0);

  const updateOverflow = useCallback((count) => {
   const clamped = Math.max(0, Math.min(count, itemCount));
   if (overflowCountRef.current !== clamped) {
    overflowCountRef.current = clamped;
    setOverflowCount(clamped);
   }
  }, [itemCount]);

  const setItemRef = useCallback((index) => (el) => {
   itemEls.current[index] = el;
  }, []);

  const recalc = useCallback(() => {
   const header = headerRef?.current;
   if (!header) return;

   const cs = window.getComputedStyle(header);
   const padL = parseFloat(cs.paddingLeft) || 0;
   const padR = parseFloat(cs.paddingRight) || 0;

   const leftEl = leftRef?.current;
   const rightEl = rightRef?.current;
   const leftW = leftEl ? leftEl.getBoundingClientRect().width : 0;
   const rightW = rightEl ? rightEl.getBoundingClientRect().width : 0;

   const navEl = containerRef?.current;
   let navPadding = 14;
   let navGap = 6;
   if (navEl) {
    const ncs = window.getComputedStyle(navEl);
    const npL = parseFloat(ncs.paddingLeft) || 0;
    const npR = parseFloat(ncs.paddingRight) || 0;
    const nbL = parseFloat(ncs.borderLeftWidth) || 0;
    const nbR = parseFloat(ncs.borderRightWidth) || 0;
    navPadding = npL + npR + nbL + nbR;
    navGap = parseFloat(ncs.gap) || parseFloat(ncs.columnGap) || 6;
   }

   const available = header.clientWidth - padL - padR - leftW - rightW - navPadding - SAFETY_MARGIN;
   const minVisible = Math.min(2, itemCount);

   if (available <= 0) {
    updateOverflow(itemCount - minVisible);
    return;
   }

   const widths = [];
   let ready = true;
   for (let i = 0; i < itemCount; i++) {
    const el = itemEls.current[i];
    const w = el ? el.getBoundingClientRect().width : 0;
    widths[i] = w;
    if (!w) ready = false;
   }
   if (!ready) return;

   let total = 0;
   let noBtnFit = 0;
   for (let i = 0; i < itemCount; i++) {
    const needed = noBtnFit === 0 ? widths[i] : widths[i] + navGap;
    if (total + needed <= available) {
     total += needed;
     noBtnFit++;
    } else {
     break;
    }
   }
   if (noBtnFit === itemCount) {
    updateOverflow(0);
    return;
   }

   let withBtnFit = 0;
   total = 0;
   for (let i = 0; i < itemCount; i++) {
    const needed = withBtnFit === 0 ? widths[i] : widths[i] + navGap;
    if (total + needed <= available - OVERFLOW_BTN_WIDTH - navGap) {
     total += needed;
     withBtnFit++;
    } else {
     break;
    }
   }

    const finalWithBtnFit = withBtnFit;
    updateOverflow(itemCount - finalWithBtnFit);
  }, [itemCount, headerRef, leftRef, rightRef, updateOverflow]);

  useEffect(() => {
   recalc();

   const onResize = () => recalc();
   window.addEventListener('resize', onResize);
   if (document.fonts?.ready) document.fonts.ready.then(() => recalc());

   const roTargets = [headerRef?.current, leftRef?.current, rightRef?.current].filter(Boolean);
   let ro;
   if (typeof ResizeObserver !== 'undefined' && roTargets.length > 0) {
    ro = new ResizeObserver(() => recalc());
    roTargets.forEach(t => ro.observe(t));
   }

   return () => {
    window.removeEventListener('resize', onResize);
    if (ro) ro.disconnect();
   };
  }, [recalc, headerRef, leftRef, rightRef]);

  useLayoutEffect(() => {
   recalc();
  });

  return { containerRef, setItemRef, overflowCount };
}
