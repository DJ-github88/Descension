import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import UnifiedSpellCard from './UnifiedSpellCard';

const SpellTooltip = ({
  spell,
  rollableTableData,
  position,
  onMouseEnter,
  onMouseLeave,
  smartPositioning = false, // Enable smart positioning for action bar
  fullscreenMode = false // Enable fullscreen modal mode with cloudy background
}) => {
  if (!spell) return null;
  
  // Position is only required when not in fullscreen mode
  if (!fullscreenMode && !position) return null;

  // Fullscreen modal mode - shows cloudy background with centered spell card
  if (fullscreenMode) {
    const tooltipContent = (
      <div
        className="spellbook-popup-overlay"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(circle at center, rgba(100, 100, 150, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999, // Lower than action bar to keep it visible
          cursor: 'default',
          margin: 0,
          padding: 0,
          pointerEvents: 'none' // Allow clicks to pass through to action bar
        }}
      >
        <div
          className="spellbook-popup-content"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{
            padding: '20px',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            cursor: 'default',
            pointerEvents: 'auto' // Re-enable pointer events for the spell card
          }}
        >
          <UnifiedSpellCard
            spell={spell}
            variant="wizard"
            rollableTableData={rollableTableData}
            showActions={false}
            showDescription={true}
            showStats={true}
            showTags={true}
          />
        </div>
      </div>
    );

    // Render directly to body for fullscreen mode
    return ReactDOM.createPortal(tooltipContent, document.body);
  }

  // Safe coordinate fallbacks: guarantee valid numbers within viewport
  const safeX = (position && typeof position.x === 'number' && position.x > 0)
    ? position.x
    : (window.innerWidth / 2);
  const safeY = (position && typeof position.y === 'number' && position.y > 0)
    ? position.y
    : (window.innerHeight - 80);

  // Tooltip dimensions
  const tooltipWidth = 580;
  const scaledTooltipWidth = tooltipWidth * 0.75; // 435px
  const maxTooltipHeight = Math.min(520, window.innerHeight - 36);
  const padding = 16;

  // Determine whether to anchor above or below based on position in viewport
  // If in bottom half of viewport, or smartPositioning is requested: anchor above to avoid hanging off bottom edge!
  const isBottomAnchored = smartPositioning || (safeY > (window.innerHeight * 0.5));

  // Horizontal clamping: ensure scaled tooltip stays completely within viewport
  const halfWidth = scaledTooltipWidth / 2;
  const minCenterX = padding + halfWidth;
  const maxCenterX = window.innerWidth - padding - halfWidth;
  const x = Math.min(Math.max(safeX, minCenterX), maxCenterX);

  // Available vertical space and maximum height clamping
  const availableHeight = isBottomAnchored
    ? Math.max(160, safeY - 20)
    : Math.max(160, window.innerHeight - safeY - 20);
  const effectiveMaxHeight = Math.min(maxTooltipHeight, availableHeight);

  // Vertical anchor position: guarantee tooltip sits on-screen above the bubble/slot
  const verticalStyle = isBottomAnchored
    ? { bottom: Math.max(12, window.innerHeight - safeY + 12), top: 'auto' }
    : { top: Math.max(12, safeY + 12), bottom: 'auto' };

  // Create tooltip content
  const tooltipContent = (
    <div
      className="spell-tooltip-overlay spell-tooltip-always-on-top"
      style={{
        position: 'fixed',
        left: x,
        ...verticalStyle,
        zIndex: 2147483647, // Maximum z-index value to ensure tooltips always appear above everything
        pointerEvents: 'auto',
        // Center horizontally on anchor point
        transform: 'translateX(-50%)',
        width: scaledTooltipWidth,
        height: 'auto',
        maxHeight: effectiveMaxHeight,
        maxWidth: 'none',
        overflow: 'visible',
        animation: 'none' // Avoid global keyframe conflicts that animate transform
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="spell-tooltip-container"
        style={{
          transform: 'scale(0.75)',
          transformOrigin: isBottomAnchored ? 'bottom left' : 'top left',
          width: tooltipWidth,
          height: 'auto',
          maxHeight: effectiveMaxHeight / 0.75,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {/* Tooltip content */}
        <div className="spell-tooltip-content">
          <UnifiedSpellCard
            spell={spell}
            variant="wizard"
            rollableTableData={rollableTableData}
            showActions={false}
            showDescription={true}
            showStats={true}
            showTags={true}
          />
        </div>
      </div>
    </div>
  );

  // Create or get dedicated tooltip container at the highest level
  let tooltipContainer = document.getElementById('spell-tooltip-portal');
  if (!tooltipContainer) {
    tooltipContainer = document.createElement('div');
    tooltipContainer.id = 'spell-tooltip-portal';
    tooltipContainer.style.position = 'fixed';
    tooltipContainer.style.top = '0';
    tooltipContainer.style.left = '0';
    tooltipContainer.style.width = '100%';
    tooltipContainer.style.height = '100%';
    tooltipContainer.style.pointerEvents = 'none';
    tooltipContainer.style.zIndex = '2147483647';
    tooltipContainer.style.isolation = 'isolate';
    document.body.appendChild(tooltipContainer);
  }

  // Render tooltip using portal to dedicated container
  return ReactDOM.createPortal(tooltipContent, tooltipContainer);
};

SpellTooltip.propTypes = {
  spell: PropTypes.object.isRequired,
  rollableTableData: PropTypes.object,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  smartPositioning: PropTypes.bool,
  fullscreenMode: PropTypes.bool
};

export default SpellTooltip;
