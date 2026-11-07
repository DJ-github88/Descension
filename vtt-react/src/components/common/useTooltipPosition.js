import { useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';

export const useTooltipPosition = (position, isVisible, options = {}) => {
  const { offsetX = 16, offsetY = null, estimateHeight = 450, estimateWidth = 340, anchor = 'auto' } = options;
  const [adjustedPosition, setAdjustedPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  const calculatePosition = useCallback(() => {
    if (!position) return;

    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1920;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1080;

    const tooltip = tooltipRef.current;
    // Measure content element if tooltipRef is on a fixed wrapper
    const targetEl = tooltip?.firstElementChild || tooltip;
    const rect = targetEl ? targetEl.getBoundingClientRect() : null;

    const tooltipWidth = (rect && rect.width > 0) ? rect.width : estimateWidth;
    const tooltipHeight = (rect && rect.height > 0) ? rect.height : estimateHeight;

    const paddingX = 16;
    const paddingY = 24;

    // Horizontal placement: right of cursor, or flipped to left if overflow
    let x = position.x + offsetX;
    if (x + tooltipWidth > viewportWidth - paddingX) {
      const leftX = position.x - tooltipWidth - offsetX;
      if (leftX >= paddingX) {
        x = leftX;
      } else {
        x = Math.max(paddingX, viewportWidth - tooltipWidth - paddingX);
      }
    }
    if (x < paddingX) {
      x = paddingX;
    }

    // Vertical placement:
    // If offsetY is explicitly specified, use it.
    // If anchor === 'above', position strictly above the anchor.
    // If anchor === 'below', position strictly below.
    // In 'auto' mode, default to downward/adjacent, clamping within viewport bounds so the tooltip
    // stays immediately beside the cursor and never extends beyond screen.
    let targetY;
    if (offsetY !== null && offsetY !== undefined) {
      targetY = position.y + offsetY;
    } else if (anchor === 'above') {
      targetY = position.y - tooltipHeight - 12;
      if (targetY < paddingY) {
        // If overflowing top, check if placing below fits
        if (position.y + 12 + tooltipHeight <= viewportHeight - paddingY) {
          targetY = position.y + 12;
        } else {
          targetY = paddingY;
        }
      }
    } else if (anchor === 'below') {
      targetY = position.y + 12;
      if (targetY + tooltipHeight > viewportHeight - paddingY) {
        if (position.y - tooltipHeight - 12 >= paddingY) {
          targetY = position.y - tooltipHeight - 12;
        }
      }
    } else {
      // In 'auto' mode: for cursor/pointer tooltips that are horizontally adjacent,
      // default adjacent to the cursor and clamp within viewport bounds so the tooltip
      // stays immediately beside the cursor and never catapults hundreds of pixels away.
      targetY = position.y + 12;
    }

    // Clamp within viewport boundaries with safety padding so it never extends beyond screen
    const maxY = Math.max(paddingY, viewportHeight - tooltipHeight - paddingY);
    const y = Math.max(paddingY, Math.min(targetY, maxY));

    setAdjustedPosition({ x, y });
  }, [position, isVisible, offsetX, offsetY, estimateHeight, estimateWidth, anchor]);

  const useEffectHooks = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useEffectHooks(() => {
    calculatePosition();
  }, [calculatePosition]);

  // Handle measurement once ref mounts, resizes, or content loads
  useEffect(() => {
    if (!isVisible) return;

    calculatePosition();

    let observer = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        calculatePosition();
      });
      if (tooltipRef.current) {
        observer.observe(tooltipRef.current);
        if (tooltipRef.current.firstElementChild) {
          observer.observe(tooltipRef.current.firstElementChild);
        }
      }
    }

    const rafId = requestAnimationFrame(() => {
      calculatePosition();
      if (observer && tooltipRef.current) {
        observer.observe(tooltipRef.current);
        if (tooltipRef.current.firstElementChild) {
          observer.observe(tooltipRef.current.firstElementChild);
        }
      }
    });

    const timerId = setTimeout(() => {
      calculatePosition();
      if (observer && tooltipRef.current) {
        observer.observe(tooltipRef.current);
        if (tooltipRef.current.firstElementChild) {
          observer.observe(tooltipRef.current.firstElementChild);
        }
      }
    }, 50);

    const handleWinChange = () => calculatePosition();
    window.addEventListener('resize', handleWinChange, { passive: true });
    window.addEventListener('scroll', handleWinChange, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
      if (observer) observer.disconnect();
      window.removeEventListener('resize', handleWinChange);
      window.removeEventListener('scroll', handleWinChange);
    };
  }, [isVisible, calculatePosition]);

  return { adjustedPosition, tooltipRef };
};

export default useTooltipPosition;
