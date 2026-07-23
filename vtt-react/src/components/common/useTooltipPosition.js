import { useState, useLayoutEffect, useEffect, useRef } from 'react';

export const useTooltipPosition = (position, isVisible, options = {}) => {
  const { offsetX = 15, offsetY = 15, estimateHeight = 80 } = options;
  const [adjustedPosition, setAdjustedPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  const calculatePosition = () => {
    if (!position) return;

    if (isVisible && tooltipRef.current) {
      const tooltip = tooltipRef.current;
      const rect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      const tooltipWidth = rect.width || 280;
      const tooltipHeight = rect.height || estimateHeight;

      let x = position.x + offsetX;
      // Default: place above position
      let y = position.y - tooltipHeight - offsetY;

      // Horizontal boundary adjustment
      if (x + tooltipWidth > viewportWidth - 10) {
        x = Math.max(10, position.x - tooltipWidth - offsetX);
      }
      if (x < 10) {
        x = 10;
      }
      if (x + tooltipWidth > viewportWidth - 10) {
        x = Math.max(10, viewportWidth - tooltipWidth - 10);
      }

      // Vertical boundary adjustment (especially on mobile)
      if (y < 20 || position.y < viewportHeight * 0.45) {
        // Place below if not enough room above or in upper half of screen
        y = position.y + offsetY;
      }
      if (y + tooltipHeight > viewportHeight - 10) {
        y = Math.max(10, viewportHeight - tooltipHeight - 10);
      }

      setAdjustedPosition({ x, y });
    } else if (position) {
      setAdjustedPosition({
        x: Math.max(10, position.x + offsetX),
        y: Math.max(10, position.y - estimateHeight)
      });
    }
  };

  const useEffectHooks = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useEffectHooks(() => {
    calculatePosition();
  }, [isVisible, position?.x, position?.y, offsetX, offsetY, estimateHeight]);

  // Handle measurement once ref mounts or resizes
  useEffect(() => {
    if (!isVisible || !tooltipRef.current) return;

    calculatePosition();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        calculatePosition();
      });
      observer.observe(tooltipRef.current);
      return () => observer.disconnect();
    }
  }, [isVisible, position?.x, position?.y]);

  return { adjustedPosition, tooltipRef };
};

export default useTooltipPosition;
