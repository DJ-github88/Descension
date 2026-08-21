import { useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';

export const useTooltipPosition = (position, isVisible, options = {}) => {
  const { offsetX = 16, offsetY = null, estimateHeight = 300, estimateWidth = 300 } = options;
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
    // If offsetY is explicitly specified, use it; otherwise elevate the tooltip
    // relative to the mouse so it never trails off the bottom of the screen.
    let targetY;
    if (offsetY !== null && offsetY !== undefined) {
      targetY = position.y + offsetY;
    } else {
      const isLowerScreen = position.y > (viewportHeight * 0.45);
      if (isLowerScreen) {
        // Position upward from cursor so bottom is near cursor level
        targetY = position.y - (tooltipHeight * 0.75);
      } else {
        // In upper screen, keep slightly elevated near cursor
        targetY = position.y - Math.min(40, tooltipHeight * 0.25);
      }
    }

    // Clamp within viewport boundaries with safety padding
    const maxY = Math.max(paddingY, viewportHeight - tooltipHeight - paddingY);
    const y = Math.max(paddingY, Math.min(targetY, maxY));

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
