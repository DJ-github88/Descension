import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

/**
 * FlavorTooltip
 *
 * Lightweight, reusable hover tooltip for short flavor/lore text on cards.
 * Designed for race cards, subrace cards, background cards, etc. — anywhere
 * a brief descriptive blurb should appear on hover without taking the user
 * away from the page.
 *
 * Follows the same UX pattern as SpellIconTooltip:
 *  - 200ms hover delay before showing
 *  - Mouse-following positioning (+15px right, -10px above cursor)
 *  - Stays visible while hovering the tooltip itself
 *  - Clamps to viewport edges
 *  - Renders via React portal to avoid clipping/overflow issues
 */
const FlavorTooltip = ({
  title,
  flavor,
  essence,
  icon,
  position,
  onMouseEnter,
  onMouseLeave,
  maxWidth = 340
}) => {
  if (!title && !flavor) return null;
  if (!position) return null;

  // Tooltip dimensions (estimate; actual width is controlled by CSS max-width)
  const tooltipHeight = 160;
  const padding = 12;

  // Viewport clamp — keep tooltip on screen
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let x = Math.min(Math.max(position.x, padding), vw - maxWidth - padding);
  // If cursor is in the bottom half of the viewport, place tooltip ABOVE cursor
  let y = position.y;
  if (position.y > vh * 0.6) {
    y = Math.max(position.y - tooltipHeight, padding);
  } else {
    y = Math.min(position.y, vh - tooltipHeight - padding);
  }

  const tooltipContent = (
    <div
      className="flavor-tooltip-overlay"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        maxWidth: `${maxWidth}px`,
        zIndex: 2147483640, // Slightly below SpellTooltip (2147483647) so spell tooltips still win
        pointerEvents: 'auto'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flavor-tooltip-container">
        <div className="flavor-tooltip-arrow" />
        <div className="flavor-tooltip-content">
          {(icon || title) && (
            <div className="flavor-tooltip-header">
              {icon && <i className={`flavor-tooltip-icon ${icon}`} />}
              {title && <span className="flavor-tooltip-title">{title}</span>}
            </div>
          )}
          {essence && <p className="flavor-tooltip-essence">{essence}</p>}
          {flavor && <p className="flavor-tooltip-flavor">{flavor}</p>}
        </div>
      </div>
    </div>
  );

  // Reuse the spell-tooltip-portal container if it exists, otherwise create our own
  let container = document.getElementById('flavor-tooltip-portal');
  if (!container) {
    container = document.createElement('div');
    container.id = 'flavor-tooltip-portal';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '2147483640';
    container.style.isolation = 'isolate';
    document.body.appendChild(container);
  }

  return ReactDOM.createPortal(tooltipContent, container);
};

/**
 * useFlavorTooltip — small hook that bundles up the hover state machine
 * for any element that wants to expose a FlavorTooltip. Returns props that
 * spread onto the trigger element plus the FlavorTooltip JSX to render.
 *
 *   const { triggerProps, tooltip } = useFlavorTooltip({ title, flavor, ... });
 *   return (
 *     <div {...triggerProps} onClick={...}>
 *       Card content
 *       {tooltip}
 *     </div>
 *   );
 */
export const useFlavorTooltip = (data) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const hoverTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const handleMouseEnter = useCallback((e) => {
    isHoveringRef.current = true;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    const currentMouseX = e.clientX;
    const currentMouseY = e.clientY;
    hoverTimeoutRef.current = setTimeout(() => {
      if (isHoveringRef.current && hoverTimeoutRef.current) {
        setTooltipPosition({ x: currentMouseX + 15, y: currentMouseY - 10 });
        setShowTooltip(true);
      }
    }, 200);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (showTooltip) {
      setTooltipPosition({ x: e.clientX + 15, y: e.clientY - 10 });
    }
  }, [showTooltip]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // Small grace period so cursor can move from trigger to tooltip
    hideTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 80);
  }, []);

  // Tooltip-on-hover handlers (keep tooltip visible while over it)
  const handleTooltipEnter = useCallback(() => {
    isHoveringRef.current = true;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const handleTooltipLeave = useCallback(() => {
    isHoveringRef.current = false;
    setShowTooltip(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isHoveringRef.current = false;
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, []);

  const triggerProps = {
    onMouseEnter: handleMouseEnter,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave
  };

  const tooltip = showTooltip ? (
    <FlavorTooltip
      title={data?.title}
      flavor={data?.flavor}
      essence={data?.essence}
      icon={data?.icon}
      position={tooltipPosition}
      onMouseEnter={handleTooltipEnter}
      onMouseLeave={handleTooltipLeave}
    />
  ) : null;

  return { triggerProps, tooltip };
};

export default FlavorTooltip;
