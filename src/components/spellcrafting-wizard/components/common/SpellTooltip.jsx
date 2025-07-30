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

  // Calculate position to keep tooltip on screen - wider spell card with no scrolling
  const padding = 20;
  const cursorOffset = 15;

  // Tooltip dimensions for scaled spell cards (75% of 580px = ~435px)
  const tooltipWidth = 450; // Adjusted for 75% scale of spell cards
  // Set reasonable max height to enable scrolling when needed
  const maxTooltipHeight = Math.min(500, window.innerHeight - padding * 2); // Max 500px or available height

  // Start with cursor positioning
  let x = position.x + cursorOffset;
  let y = position.y - 10;

  // Check if tooltip goes off right edge
  if (x + tooltipWidth > window.innerWidth - padding) {
    x = position.x - tooltipWidth - cursorOffset;
  }

  // Smart positioning to keep tooltip on screen
  // For action bar (bottom of screen), always show tooltip above
  if (position.y > window.innerHeight - 300) {
    // Action bar area - show tooltip well above cursor
    y = position.y - 200; // Position well above cursor to avoid action bar
  } else if (y > window.innerHeight / 2) {
    // If cursor is in bottom half, show tooltip above cursor
    y = position.y - 50; // Position above cursor with offset
  }

  // Check if tooltip goes off top edge
  if (y < padding) {
    y = padding;
  }

  // Check if tooltip goes off left edge
  if (x < padding) {
    x = padding;
  }

  // Final bounds check - ensure tooltip fits entirely on screen
  if (x + tooltipWidth > window.innerWidth - padding) {
    x = window.innerWidth - tooltipWidth - padding;
  }
  if (y < padding) {
    y = padding;
  }

  // Create tooltip content
  const tooltipContent = (
    <div
      className="spell-tooltip-overlay"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 99999, // Much higher z-index to appear above collection windows
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
