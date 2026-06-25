import { useState, useEffect, useRef } from 'react';

export const useTooltipPosition = (position, isVisible, options = {}) => {
  const { offsetX = 15, offsetY = 15, estimateHeight = 80 } = options;
  const [adjustedPosition, setAdjustedPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!position) return;

    if (isVisible && tooltipRef.current) {
      const tooltip = tooltipRef.current;
      const rect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = position.x + offsetX;
      let y = position.y - rect.height - offsetY;

      if (x + rect.width > viewportWidth - 20) {
        x = position.x - rect.width - offsetX;
      }
      if (x < 20) {
        x = 20;
      }
      if (y < 20) {
        y = position.y + offsetY;
      }
      if (y + rect.height > viewportHeight - 20) {
        y = viewportHeight - rect.height - 20;
      }

      setAdjustedPosition({ x, y });
    } else {
      setAdjustedPosition({
        x: position.x + offsetX,
        y: position.y - estimateHeight
      });
    }
  }, [isVisible, position, offsetX, offsetY, estimateHeight]);

  return { adjustedPosition, tooltipRef };
};

export default useTooltipPosition;
