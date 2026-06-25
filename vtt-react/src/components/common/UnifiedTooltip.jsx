import React, { useState, useEffect, useRef, memo } from 'react';
import LazyImage from './LazyImage';
import TooltipPortal from '../tooltips/TooltipPortal';
import './UnifiedTooltip.css';

/**
 * Unified Tooltip Component
 * A single, consistent tooltip system for the entire application
 * Features:
 * - Follows mouse cursor
 * - Auto-positioning to stay on screen
 * - Pathfinder-themed styling
 * - Configurable delay
 * - Support for rich content
 * - Renders via portal to avoid clipping issues
 */
const UnifiedTooltip = ({
  content,
  title,
  icon,
  isVisible,
  position,
  delay = 300,
  variant = 'default' // 'default', 'spell', 'dice', 'card', 'coin'
}) => {
  const [show, setShow] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  // Handle visibility with delay
  useEffect(() => {
    let timeoutId;

    if (isVisible) {
      timeoutId = setTimeout(() => {
        setShow(true);
      }, delay);
    } else {
      setShow(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isVisible, delay]);

  // Auto-position tooltip to stay on screen
  useEffect(() => {
    if (position) {
      if (show && tooltipRef.current) {
        // Tooltip is visible and we can measure it
        const tooltip = tooltipRef.current;
        const rect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Start with mouse position, offset to the right and above
        const offsetX = 15; // Horizontal offset from cursor
        const offsetY = 15; // Vertical offset from cursor

        let x = position.x + offsetX;
        let y = position.y - rect.height - offsetY;

        // Adjust horizontal position if tooltip would go off screen
        if (x + rect.width > viewportWidth - 20) {
          x = position.x - rect.width - offsetX; // Show to the left of cursor
        }
        if (x < 20) {
          x = 20; // Minimum left margin
        }

        // Adjust vertical position if tooltip would go off screen
        if (y < 20) {
          y = position.y + offsetY; // Show below cursor if no room above
        }
        if (y + rect.height > viewportHeight - 20) {
          y = viewportHeight - rect.height - 20; // Keep within viewport
        }

        setAdjustedPosition({ x, y });
      } else {
        // Set initial position even before tooltip is measured
        setAdjustedPosition({
          x: position.x + 15,
          y: position.y - 80 // Estimated height offset
        });
      }
    }
  }, [show, position]);

  if (!show || !content) {
    return null;
  }

  // Render tooltip via shared portal (same root/z-index as all other tooltips)
  return (
    <TooltipPortal>
      <div
        ref={tooltipRef}
        className={`unified-tooltip ${variant}`}
        style={{
          position: 'fixed',
          left: adjustedPosition.x,
          top: adjustedPosition.y,
          zIndex: 2147483647,
          pointerEvents: 'none'
        }}
      >
      <div className="tooltip-content">
        {icon && (
          <div className="tooltip-icon">
            {typeof icon === 'string' ? (
              <LazyImage src={`/icons/${icon}.png`} alt="" width="16" height="16" />
            ) : (
              icon
            )}
          </div>
        )}

        <div className="tooltip-text">
          {title && (
            <div className="tooltip-title">{title}</div>
          )}

          <div className="tooltip-description">
            {typeof content === 'string' ? content : content}
          </div>
        </div>
      </div>

      {/* Tooltip arrow */}
      <div className="tooltip-arrow"></div>
      </div>
    </TooltipPortal>
  );
};

export default memo(UnifiedTooltip);
