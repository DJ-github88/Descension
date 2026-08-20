import { useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';

export const useTooltipPosition = (position, isVisible, options = {}) => {
  const { offsetX = 16, offsetY = 16, estimateHeight = 160, estimateWidth = 280 } = options;
  const [adjustedPosition, setAdjustedPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  const calculatePosition = useCallback(() => {
    if (!position) return;

    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1920;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1080;

    const tooltip = tooltipRef.current;
    const rect = tooltip ? tooltip.getBoundingClientRect() : null;

    const tooltipWidth = (rect && rect.width > 0) ? rect.width : estimateWidth;
    const tooltipHeight = (rect && rect.height > 0) ? rect.height : estimateHeight;

    let x = position.x + offsetX;
    let y = position.y + offsetY;

    // Vertical boundary: if placing below cursor extends past bottom of screen,
    // smoothly clamp so the tooltip bottom sits at viewport bottom (staying right at mouse)
    if (y + tooltipHeight > viewportHeight - 12) {
      const clampedY = viewportHeight - tooltipHeight - 12;
      y = Math.max(12, clampedY);
    }

    // Safety: ensure top never goes off screen
    if (y < 12) {
      y = 12;
    }

    // Horizontal boundary: if extending past right edge, flip to left of cursor or clamp
    if (x + tooltipWidth > viewportWidth - 12) {
      const leftX = position.x - tooltipWidth - offsetX;
      if (leftX >= 12) {
        x = leftX;
      } else {
        x = Math.max(12, viewportWidth - tooltipWidth - 12);
      }
    }

    // Safety: ensure left never goes off screen
    if (x < 12) {
      x = 12;
    }

    setAdjustedPosition({ x, y });
  }, [position, isVisible, offsetX, offsetY, estimateHeight, estimateWidth]);

  const useEffectHooks = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useEffectHooks(() => {
    calculatePosition();
  }, [calculatePosition]);

  // Handle measurement once ref mounts, resizes, or content loads
  useEffect(() => {
    if (!isVisible) return;

    calculatePosition();

    const rafId = requestAnimationFrame(() => {
      calculatePosition();
    });

    let observer = null;
    if (typeof ResizeObserver !== 'undefined' && tooltipRef.current) {
      observer = new ResizeObserver(() => {
        calculatePosition();
      });
      observer.observe(tooltipRef.current);
    }

    const handleWinChange = () => calculatePosition();
    window.addEventListener('resize', handleWinChange, { passive: true });
    window.addEventListener('scroll', handleWinChange, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      window.removeEventListener('resize', handleWinChange);
      window.removeEventListener('scroll', handleWinChange);
    };
  }, [isVisible, calculatePosition]);

  return { adjustedPosition, tooltipRef };
};

export default useTooltipPosition;
