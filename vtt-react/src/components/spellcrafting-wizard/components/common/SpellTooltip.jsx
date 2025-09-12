import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import UnifiedSpellCard from './UnifiedSpellCard';

const SpellTooltip = ({
  spell,
  rollableTableData,
  position,
  onMouseEnter,
  onMouseLeave
}) => {
  if (!spell || !position) return null;

  // Calculate position to keep tooltip on screen - prioritize right side positioning
  const padding = 20;
  const cursorOffset = 15;

  // Tooltip dimensions for scaled spell cards (75% of 580px = ~435px)
  const tooltipWidth = 450; // Adjusted for 75% scale of spell cards
  // Set reasonable max height to enable scrolling when needed
  const maxTooltipHeight = Math.min(500, window.innerHeight - padding * 2); // Max 500px or available height

  // Smart positioning strategy: prioritize right side, then left, then above/below
  let x, y;

  // Try positioning to the right first (preferred for spell library)
  x = position.x + cursorOffset;
  y = position.y - 10;

  // If tooltip would go off right edge, try left side
  if (x + tooltipWidth > window.innerWidth - padding) {
    x = position.x - tooltipWidth - cursorOffset;

    // If left side also doesn't fit, center it and position above/below
    if (x < padding) {
      // Center horizontally and position above or below
      x = Math.max(padding, Math.min(
        window.innerWidth - tooltipWidth - padding,
        position.x - tooltipWidth / 2
      ));

      // Position above if in bottom half of screen, below if in top half
      if (position.y > window.innerHeight / 2) {
        y = position.y - maxTooltipHeight - cursorOffset; // Above
      } else {
        y = position.y + cursorOffset; // Below
      }
    }
  }

  // Special handling for action bar area (bottom 300px of screen)
  if (position.y > window.innerHeight - 300) {
    // Always show tooltip above for action bar
    y = Math.max(padding, position.y - maxTooltipHeight - cursorOffset);

    // Keep horizontal positioning but ensure it fits
    x = Math.max(padding, Math.min(
      window.innerWidth - tooltipWidth - padding,
      position.x + cursorOffset
    ));
  }

  // Final bounds check to ensure tooltip stays on screen
  x = Math.max(padding, Math.min(x, window.innerWidth - tooltipWidth - padding));
  y = Math.max(padding, Math.min(y, window.innerHeight - maxTooltipHeight - padding));

  // Create tooltip content
  const tooltipContent = (
    <div
      className="spell-tooltip-overlay"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 2147483647, // Maximum z-index value to ensure tooltips always appear above windows
        pointerEvents: 'auto',
        // Set size for scaled spell card - scrolling handled by inner container
        width: 'auto', // Let content determine width
        height: 'auto',
        maxHeight: 'none', // No constraint here - handled by inner container
        maxWidth: 'none', // Remove width constraint
        overflow: 'visible' // Let inner container handle scrolling
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="spell-tooltip-container" style={{
        transform: 'scale(0.75)', // Scale the entire tooltip container to match spell card
        transformOrigin: 'top left',
        width: 'fit-content',
        height: 'auto',
        maxHeight: maxTooltipHeight / 0.75, // Adjust max height for scaling
        overflow: 'auto' // Enable scrolling on the scaled container
      }}>
        {/* Tooltip borders - now scaled with the container */}
        <div className="tooltip-top-border"></div>

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

        {/* Tooltip borders - now scaled with the container */}
        <div className="tooltip-bottom-border"></div>
      </div>
    </div>
  );

  // Render tooltip using portal to avoid z-index issues
  return ReactDOM.createPortal(tooltipContent, document.body);
};

SpellTooltip.propTypes = {
  spell: PropTypes.object.isRequired,
  rollableTableData: PropTypes.object,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
};

export default SpellTooltip;
