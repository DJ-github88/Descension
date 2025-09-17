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
  smartPositioning = false // New prop to enable smart positioning for action bar
}) => {
  if (!spell || !position) return null;

  // Tooltip dimensions
  const tooltipWidth = 450;
  const tooltipHeight = 500;
  const maxTooltipHeight = Math.min(500, window.innerHeight - 40); // Max 500px or available height
  const padding = 20;

  let x = position.x;
  let y = position.y;

  // Apply smart positioning only when requested (for action bar)
  if (smartPositioning) {
    // For action bar tooltips, we want to center horizontally and position above
    // The position.x is already the center of the action slot

    // Calculate tooltip width (scaled down to 75%)
    const scaledTooltipWidth = tooltipWidth * 0.75;
    const scaledTooltipHeight = maxTooltipHeight * 0.75;

    // Center the tooltip horizontally on the action slot
    x = position.x - (scaledTooltipWidth / 2);

    // Position tooltip above the action slot
    y = position.y - scaledTooltipHeight - 10;

    // If tooltip would go off right edge, adjust left
    if (x + scaledTooltipWidth > window.innerWidth - padding) {
      x = window.innerWidth - scaledTooltipWidth - padding;
    }

    // If tooltip would go off left edge, adjust right
    if (x < padding) {
      x = padding;
    }

    // If tooltip would go off top edge, position below the action slot instead
    if (y < padding) {
      y = position.y + 60; // Position below the action slot (48px height + some margin)
    }

    // If positioning below would go off bottom edge, try to fit it in the available space
    if (y + scaledTooltipHeight > window.innerHeight - padding) {
      // Try to position it in the middle of available space
      const availableHeight = window.innerHeight - 2 * padding;
      y = Math.max(padding, (window.innerHeight - scaledTooltipHeight) / 2);
    }
  }

  console.log('SpellTooltip position:', {
    x,
    y,
    originalPosition: position,
    smartPositioning,
    maxTooltipHeight
  }); // Debug log

  // Create tooltip content
  const tooltipContent = (
    <div
      className="spell-tooltip-overlay spell-tooltip-always-on-top"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 2147483647, // Maximum z-index value to ensure tooltips always appear above everything
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
  }).isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  smartPositioning: PropTypes.bool
};

export default SpellTooltip;
